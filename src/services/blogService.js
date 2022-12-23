import Blog from '../database/blogsModal.js'
import { validateBlog, updatingSchema } from '../database/blogSchema.js'

const getAllBlogsService = async () => {
  const allBlogs = await Blog.find().sort({ createdAt: -1 })
  return { statusCode: 200, message: 'List of all blogs from our database', data: allBlogs }
}

const getOneBlogSevice = async (blogId) => {
  const blog = await Blog.findById(blogId)
  return { statusCode: 200, message: `blog ${blogId} from our database`, data: blog }
}

const postOneBlogSevice = async (blog, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can create a blog')
  }
  const { error, value } = await validateBlog.validate(blog)
  if (error) {
    throw new Error(error.details[0].message)
  }

  const createdBlog = new Blog(value)
  await createdBlog.save()
  return { statusCode: 200, message: `created a blog ${createdBlog._id}  successfully`, data: createdBlog }
}

const updateOneBlogSevice = async (blogId, req) => {
  if (req.query.like) {
    const blog = await Blog.findById(blogId)
    let msg
    blog.likes.forEach(async (like, index) => {
      if (like.user === req.user.id) {
        blog.likes.splice(index, 1)
        msg = { message: 'updated a blog successfully', data: blog }
      }
    })
    if (!msg) {
      blog.likes = [
        ...blog.likes,
        {
          user: req.user.id
        }
      ]
    }

    await blog.save()

    return { message: 'updated a blog successfully', data: blog }
  }

  if (req.query.comment) {
    const blog = await Blog.findById(blogId)

    blog.comments = [
      ...blog.comments,
      {
        user: req.user.id,
        text: req.body.text
      }
    ]

    await blog.save()

    return { message: 'updated a blog successfully', data: blog }
  }

  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can update a blog')
  }

  const { title, body } = req.body
  const { error, value } = updatingSchema.validate({ title, body })
  if (error) throw new Error(error.details[0].message)

  const updatedBlog = await Blog.updateOne({ _id: blogId }, value)

  return { message: 'updated a blog successfully', data: updatedBlog }
}

const deleteOneBlogSevice = async (blogId, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can delete a blog')
  }

  const deletedMessage = await Blog.findByIdAndDelete(blogId)
  return { message: 'deleted a blog successfully', data: deletedMessage }
}

export {
  getAllBlogsService,
  getOneBlogSevice,
  deleteOneBlogSevice,
  updateOneBlogSevice,
  postOneBlogSevice
}
