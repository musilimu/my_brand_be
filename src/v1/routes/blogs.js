import express from 'express'
import {
  getAllBlogs,
  createOneBlog,
  deleteOneBlog,
  updateOneBlog,
  getOneBlog,
  getLikes,
  postComment, likeBlog, likeComment, deleteComment
} from '../../controllers/blogController.js'
import secureRoute from '../../middlewares/authMiddleware.js'
const router = express.Router()

router.route('/').get(getAllBlogs).post(secureRoute, createOneBlog)
router
  .route('/:blogId')
  .get(getOneBlog)
  .put(secureRoute, updateOneBlog)
  .delete(secureRoute, deleteOneBlog)

router.get('/:blogId/likes', getLikes)
router.post('/:blogId/likes', secureRoute, likeBlog)
router.post('/:blogId/comments', secureRoute, postComment)
router.post('/:blogId/comments/:commentId/likes', secureRoute, likeComment)
router.delete('/:blogId/comments/:commentId', secureRoute, deleteComment)
export { router as v1BlogRouter }
