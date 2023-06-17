import Blog from '../database/blogsModal.js'
import { validateBlog, updatingSchema } from '../database/blogSchema.js'
import { LikeModal } from '../database/LikeSchema.js'
import { client } from '../database/redisClient.js'
import { BlogError } from '../controllers/blogController.js'

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
    throw new BlogError({
      error: 'un authorized',
      message: 'only admin can create a blog',
      statusCode: 401
    })
  }
  const { error, value } = await validateBlog.validate(blog)
  if (error) {
    throw new Error(error.details[0].message)
  }

  const createdBlog = new Blog({ ...value, author: req.user.id })
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

  const { title, body, banner } = req.body
  const { error, value } = updatingSchema.validate({ title, body, banner })
  if (error) throw new Error(error.details[0].message)

  const updatedBlog = await Blog.updateOne({ _id: blogId }, value)

  return { message: 'updated a blog successfully', data: updatedBlog }
}

const postCommentSevice = async (req) => {
  if (req.body.text.trim() === '') throw new Error('please provide content')

  const blog = await Blog.findByIdAndUpdate(req.params.blogId, {
    $push: {
      comments: [
        {
          blog: req.params.blogId,
          text: req.body.text,
          user: req.user.id
        }
      ]
    }
  })
  const newblog = await Blog.findById(req.params.blogId).populate('Comments')
  return {
    message: 'updated a blog successfully',
    data: newblog
  }
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
  const data = await blog.comments.find((b) => b.id === req.params.commentId)
  const alreadyExistingUserLike = data.likes.find((like) => {
    console.log(like.user.toString(), req.user.id)
    return like.user.toString() === req.user.id
  })
  if (alreadyExistingUserLike) {
    await alreadyExistingUserLike.remove()
  } else {
    data.likes.push({
      user: req.user.id,
      comment: req.params.commentId
    })
  }
  await blog.save()

  return { message: 'updated a comment successfully', data: blog }
}

const deleteCommentService = async (req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can update a blog')
  }

  const blog = await Blog.findById(req.params.blogId)
  const comments = blog.comments.filter(
    ({ _id }) => _id !== req.params.commentId
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
