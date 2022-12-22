import express from 'express'
import {
  getAllBlogs,
  createOneBlog,
  deleteOneBlog,
  updateOneBlog,
  getOneBlog
} from '../../controllers/blogController.js'
import secureRoute from '../../middlewares/authMiddleware.js'
const router = express.Router()

router.route('/').get(getAllBlogs).post(secureRoute, createOneBlog)

router
  .route('/:blogId')
  .get(getOneBlog)
  .put(secureRoute, updateOneBlog)
  .delete(secureRoute, deleteOneBlog)

export { router as v1BlogRouter }
