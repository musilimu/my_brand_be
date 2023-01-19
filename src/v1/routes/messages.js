import express from 'express'
import {
  getAllMessages,
  createOneMessage,
  deleteOneMessage,
  getOneMessage
} from '../../controllers/messageController.js'
import secureRoute from '../../middlewares/authMiddleware.js'
const router = express.Router()

router.route('/').get(secureRoute, getAllMessages).post(secureRoute, createOneMessage)
router
  .route('/:messageId')
  .get(secureRoute, getOneMessage)
  .delete(secureRoute, deleteOneMessage)

export { router as v1MessageRouter }
