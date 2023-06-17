// import nodemailer from 'nodemailer'
import Message from '../database/messageModal.js'
import { validateMessage } from '../database/messageSchema.js'
import { client } from '../database/redisClient.js'

const getAllMessagesService = async (req) => {
  const allMessages = await fetchByParams(req.query)
  return {
    statusCode: 200,
    message: 'List of all messages from our database',
    data: process.env.ADMIN_EMAIL === req.user.email ? allMessages : allMessages.filter(({ email }) => email.trim() === req.user.email.trim())
  }
}

const sortMessages = (sortStr = 'created_at:asc') => {
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
    const allMessages = JSON.parse(value)

    return allMessages
  } else {
    const data = await Message.find(
      { $or: [{ subject: new RegExp(search) }, { message: new RegExp(search) }] },
      returnFields
    )
      .sort({ createdAt: sortMessages(sort) })
      .skip(+offset)
      .limit(+limit)
    await client.set(JSON.stringify(query), JSON.stringify(data))

    return data
  }
}

const getOneMessageSevice = async (messageId, req) => {
  const { fields } = req.query

  let returnFields = {}
  returnFields = fields?.split(',').reduce((fieldSets, field) => {
    fieldSets[field] = 1
    return fieldSets
  }, {})
  const data = await client.get(`${messageId}--${JSON.stringify(returnFields)}`)
  if (data) {
    const message = JSON.parse(data)

    return {
      statusCode: 200,
      message: `Message ${messageId} from our database`,
      data: message
    }
  } else {
    const message = await Message.findById(messageId, returnFields)
    return {
      statusCode: 200,
      message: `Message ${messageId} from our database`,
      data: req.user.email.trim() === message.email.trim() ? message : null
    }
  }
}

const postOneMessageSevice = async (message) => {
  const { error, value } = await validateMessage.validate(message)
  if (error) {
    throw new Error(error.details[0].message)
  }

  const createdMessage = new Message({ ...value })

  await createdMessage.save()
  return {
    statusCode: 201,
    message: `created a Message ${createdMessage._id}  successfully`,
    data: createdMessage
  }
}

const deleteOneMessageSevice = async (messageId, req) => {
  try {
    const deleteMessage = await Message.findById(messageId)

    if (req.user.email !== deleteMessage.email && req.user.email !== process.env.ADMIN_EMAIL) {
      return { error: 'deleted a message not allowed', statusCode: 400, details: 'you must be the owner to delete the message ' }
    }

    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return { error: 'deleted a message not allowed', statusCode: 400, details: 'you must be the owner to delete the message or admin' }
    }

    const data = await Message.deleteOne({ _id: messageId })
    return { message: 'deleted a message successfully', statusCode: 200, data }
  } catch (error) {
    console.log(error.message)
  }
}
const updateOneMessageService = async (messageId, req) => {
  try {
    const updateMessage = await Message.findById(messageId)

    if (req.user.email !== updateMessage.email && req.user.email !== process.env.ADMIN_EMAIL) {
      return { error: 'updated a message not allowed', statusCode: 400, details: 'you must be the owner to update the message ' }
    }

    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return { error: 'updated a message not allowed', statusCode: 400, details: 'you must be the owner to update the message or admin' }
    }
    const { error, value } = await validateMessage.validate(req.body)

    if (error) {
      throw new Error(error.details[0].message)
    }
    const data = await Message.findByIdAndUpdate(messageId, value)
    return { message: 'updated a message successfully', statusCode: 200, data }
  } catch (error) {
    console.log(error.message)
  }
}

export {
  getAllMessagesService,
  getOneMessageSevice,
  deleteOneMessageSevice,
  postOneMessageSevice,
  updateOneMessageService
}
