import {
  getAllMessagesService,
  getOneMessageSevice,
  deleteOneMessageSevice,
  postOneMessageSevice,
  updateOneMessageService
} from '../services/messageService.js'
import { asyncHandler } from './blogController.js'

const getAllMessages = asyncHandler(async (req, res) => {
  const allMessages = await getAllMessagesService(req)
  res.status(200).json(allMessages)
})

const getOneMessage = asyncHandler(async (req, res) => {
  const message = await getOneMessageSevice(req.params.messageId, req)
  res.status(200).json(message)
})

const createOneMessage = asyncHandler(async (req, res) => {
  const createdMessage = await postOneMessageSevice(req.body)
  res.status(201).json(createdMessage)
})

const deleteOneMessage = asyncHandler(async (req, res) => {
  const deletedMessage = await deleteOneMessageSevice(req.params.messageId, req)
  res.status(200).json(deletedMessage)
})

const updateOneMessage = asyncHandler(async (req, res) => {
  const deletedMessage = await updateOneMessageService(
    req.params.messageId,
    req
  )
  res.status(200).json(deletedMessage)
})
export {
  deleteOneMessage,
  createOneMessage,
  getAllMessages,
  getOneMessage,
  updateOneMessage
}
