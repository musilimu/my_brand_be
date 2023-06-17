import {
  getAllBlogsService,
  getOneBlogSevice,
  deleteOneBlogSevice,
  updateOneBlogSevice,
  postOneBlogSevice,
  getLikesServive,
  postCommentSevice,
  likeBlogSevice,
  likeCommentService,
  deleteCommentService,
} from '../services/blogService.js'

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export class BlogError extends Error {
  constructor({ statusCode = 400, message, error }) {
    super()
    this.message = message
    this.statusCode = statusCode
    this.error = error
  }
}

const getAllBlogs = asyncHandler(async (req, res, next) => {
  const allBlogs = await getAllBlogsService(req)
  res.status(200).json(allBlogs)
})

const getLikes = asyncHandler(async (req, res) => {
  const Likes = await getLikesServive(req)
  res.json(Likes)
})

const getOneBlog = asyncHandler(async (req, res) => {
  const blog = await getOneBlogSevice(req.params.blogId, req)
  res.status(200).json(blog)
})

const createOneBlog = asyncHandler(async (req, res) => {
  const createdBlog = await postOneBlogSevice(req.body, req)
  res.status(201).json(createdBlog)
})
const postComment = asyncHandler(async (req, res) => {
  const updatedBlog = await postCommentSevice(req)
  res.send(updatedBlog)
})

const likeBlog = asyncHandler(async (req, res) => {
  const updatedBlog = await likeBlogSevice(req)
  res.send(updatedBlog)
})
const likeComment = asyncHandler(async (req, res) => {
  const updatedBlog = await likeCommentService(req)
  res.send(updatedBlog)
})

const updateOneBlog = asyncHandler(async (req, res) => {
  const updatedBlog = await updateOneBlogSevice(req.params.blogId, req)
  res.send(updatedBlog)
})
const deleteComment = asyncHandler(async (req, res) => {
  const updatedBlog = await deleteCommentService(req)
  res.status(200).send(updatedBlog)
})

const deleteOneBlog = asyncHandler(async (req, res) => {
  const deletedMessage = await deleteOneBlogSevice(req.params.blogId, req)
  res.status(200).json(deletedMessage)
})

export {
  deleteOneBlog,
  createOneBlog,
  updateOneBlog,
  getAllBlogs,
  getOneBlog,
  getLikes,
  postComment,
  likeBlog,
  likeComment,
  deleteComment,
}
