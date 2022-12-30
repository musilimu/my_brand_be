import express from 'express'
import {
  getAllBlogs,
  createOneBlog,
  deleteOneBlog,
  updateOneBlog,
  getOneBlog, getLikes
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
export { router as v1BlogRouter }
