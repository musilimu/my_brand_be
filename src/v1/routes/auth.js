import express from 'express'

import {
  createUser,
  getAllUsers,
  loginUser,
  deteUser,
  updateUser,
  getSingleUser,
} from '../../controllers/authController.js'
import secureRoute from '../../middlewares/authMiddleware.js'
import { config } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const router = express.Router()

router.route('/signup').post(createUser)
router.route('/login').post(loginUser)
router.get('/profile', secureRoute, (req, res) =>
  res.json({
    data: req.user,
    message: `user ${req.user.id} sent successfully`,
    statusCode: 200,
  }),
)
router.route('/users').get(secureRoute, getAllUsers)
router
  .route('/users/:userId')
  .delete(secureRoute, deteUser)
  .put(secureRoute, updateUser)
  .get(secureRoute, getSingleUser)
export { router as v1AuthRouter }
