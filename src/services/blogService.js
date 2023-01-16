import Redis from 'redis'
import Blog from '../database/blogsModal.js'
import { validateBlog, updatingSchema } from '../database/blogSchema.js'
import { LikeModal } from '../database/LikeSchema.js'
const client = Redis.createClient({
  legacyMode: true,
  socket: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
})
client.on('connect', () => {
  console.log('Connected to redis server!')
})
const connect = async () => {
  await client.connect()
}
connect()
const getAllBlogsService = async (req) => {
  const allBlogs = await fetchByParams(req.query)
  return {
    statusCode: 200,
    message: 'List of all blogs from our database',
    data: allBlogs
  }
}
const sortBlogs = (sortStr = 'created_at:asc') => {
  if (sortStr && sortStr === 'created_at:asc') {
    return 1
  }
  if (sortStr && sortStr === 'created_at:desc') {
    return -1
  }
  throw new Error('server failed to sort based on query provided')
}
const fetchByParams = async (query) => {
  const { sort, limit, offset, search, fields } = query

  let returnFields = {}
  returnFields = fields?.split(',').reduce((fieldSets, field) => {
    fieldSets[field] = 1
    return fieldSets
  }, {})

  console.log('query', JSON.stringify(query))

  const value = await client.get(JSON.stringify(query))
  if (value) {
    const allBlogs = JSON.parse(value)

    return allBlogs
  } else {
    const data = await Blog.find(
      { $or: [{ title: new RegExp(search) }, { body: new RegExp(search) }] },
      returnFields
    )
      .sort({ createdAt: sortBlogs(sort) })
      .skip(+offset)
      .limit(+limit)
    await client.set(JSON.stringify(query), JSON.stringify(data))

    return data
  }
}
const getLikesServive = async (req) => {
  const { blogId } = req.params

  const data = await client.get(blogId)
  if (data) {
    return JSON.parse(data)
  } else {
    const likes = await LikeModal.find({ blog: blogId })
    await client.set(blogId, JSON.stringify(likes))
    return likes
  }
}
const getOneBlogSevice = async (blogId, req) => {
  const { fields } = req.query

  let returnFields = {}
  returnFields = fields?.split(',').reduce((fieldSets, field) => {
    fieldSets[field] = 1
    return fieldSets
  }, {})
  const data = await client.get(`${blogId}--${JSON.stringify(returnFields)}`)
  if (data) {
    const blog = JSON.parse(data)

    return {
      statusCode: 200,
      message: `blog ${blogId} from our database`,
      data: blog
    }
  } else {
    const blog = await Blog.findById(blogId, returnFields)

    return {
      statusCode: 200,
      message: `blog ${blogId} from our database`,
      data: blog
    }
  }
}

const postOneBlogSevice = async (blog, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can create a blog')
  }
  const { error, value } = await validateBlog.validate(blog)
  if (error) {
    throw new Error(error.details[0].message)
  }

  const createdBlog = new Blog({ ...value, author: req.user.id })
  // client.flushAll()
  await createdBlog.save()
  return {
    statusCode: 201,
    message: `created a blog ${createdBlog._id}  successfully`,
    data: createdBlog
  }
}

const updateOneBlogSevice = async (blogId, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can update a blog')
  }

  const { title, body } = req.body
  const { error, value } = updatingSchema.validate({ title, body })
  if (error) throw new Error(error.details[0].message)

  const updatedBlog = await Blog.updateOne({ _id: blogId }, value)

  return { message: 'updated a blog successfully', data: updatedBlog }
}

const postCommentSevice = async (req) => {
  if (req.body.text.trim() === '') throw new Error('please provide content')
  const blog = await Blog.findById(req.params.blogId)
  blog.comments = [
    ...blog?.comments,
    {
      user: req.user.id,
      text: req.body.text
    }
  ]

  await blog.save()
  return { message: 'updated a blog successfully', data: blog }
}

const likeBlogSevice = async (req) => {
  const res = await LikeModal.create({
    user: req.user.id,
    blog: req.params.blogId
  })
  return {
    statusCode: 200,
    message: `update (liked) a blog ${req.params.blogId}  successfully`,
    data: res
  }
}

const deleteOneBlogSevice = async (blogId, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can delete a blog')
  }

  const deletedMessage = await Blog.findByIdAndDelete(blogId)
  return { message: 'deleted a blog successfully', data: deletedMessage }
}
const likeCommentService = async (req) => {
  const blog = await Blog.findById(req.params.blogId)
  const comment = blog.comments.find(({ _id }) => _id == req.params.commentId)
  if (comment.likes.includes(req.user.id)) {
    comment.likes.splice(comment.likes.indexOf(comment.likes), 1)
  } else {
    comment.likes = [...comment.likes, req.user.id]
  }
  await blog.save()
  return { message: 'updated a blog successfully', data: blog }
}

const deleteCommentService = async (req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can update a blog')
  }

  const blog = await Blog.findById(req.params.blogId)
  const comments = blog.comments.filter(
    ({ _id }) => _id != req.params.commentId
  )
  blog.comments = comments
  await blog.save()
  return {
    statusCode: 200,
    message:
      '`deleted a comment successfully` => updated a blog by removing a comment',
    data: blog
  }
}

export {
  getAllBlogsService,
  getOneBlogSevice,
  deleteOneBlogSevice,
  updateOneBlogSevice,
  postOneBlogSevice,
  deleteCommentService,
  getLikesServive,
  postCommentSevice,
  likeBlogSevice,
  likeCommentService
}
