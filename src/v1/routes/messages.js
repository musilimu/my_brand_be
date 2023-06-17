import express from 'express'
import {
  getAllMessages,
  createOneMessage,
  deleteOneMessage,
  getOneMessage,
  updateOneMessage,
} from '../../controllers/messageController.js'
import secureRoute from '../../middlewares/authMiddleware.js'
const router = express.Router()

router
  .route('/')
  .get(secureRoute, getAllMessages)
  .post(secureRoute, createOneMessage)
router
  .route('/:messageId')
  .get(secureRoute, getOneMessage)
  .delete(secureRoute, deleteOneMessage)
  .put(secureRoute, updateOneMessage)

export { router as v1MessageRouter }
