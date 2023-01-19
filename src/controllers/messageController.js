import {
  getAllMessagesService,
  getOneMessageSevice,
  deleteOneMessageSevice,
  postOneMessageSevice

} from '../services/messageService.js'

/**
   * @swagger
   * /api/v1/messages:
   *    get:
   *      tags: [message routes]
   *      description: <p>returns all messages from our database</p> (you can also add query to filter your messages <strong>/api/v1/messages?sort=created_at:asc&limit=10&offset=0&search=javascript&fields=title,body,banner</strong>)<h3>sorting </h3><p> ascending <strong>/api/v1/messages?sort=created_at:asc</strong></p><p>descending <strong>/api/v1/messages?sort=created_at:desc</strong></p><p> <h3>return fields</h3><p>you may not need all fields filter what you need</p><p><strong>/api/v1/messages?fields=title,body,banner</strong></p><h3>limit the number of messages</h3><p>limit the length of the response (number of messages)</p><p><strong>/api/v1/messages?limit=10</strong></p>[those queries are optional put them according to your choise, add more as shown above]</p>
   *      responses:
   *        200:
   *          description: messages get all messages from our api
   */

const getAllMessages = async (req, res) => {
  try {
    const allMessages = await getAllMessagesService(req)
    res.status(200).json(allMessages)
  } catch (error) {
    res.status(400).json({
      error: error.message,
      details:
          'please provide the correct query try reading documentation `http:localhost:3000/api/docs`',
      statusCode: 400
    })
  }
}

/**
   * @swagger
   * /api/v1/messages/{messageId}:
   *    get:
   *      tags: [message routes]
   *      summary: returns a one message should provide messageId from our database
   *      parameters:
   *        - name: messageId
   *          in: path
   *          description: provide messageId
   *          required: true
   *      responses:
   *        200:
   *          description: success
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/message'
   *        404:
   *          description: not found
   */

const getOneMessage = async (req, res) => {
  try {
    const message = await getOneMessageSevice(req.params.messageId, req)
    res.status(200).json(message)
  } catch (error) {
    res.json({
      details: 'try provide id of message and try again',
      error: error.message,
      statusCode: 400
    })
  }
}
/**
   * @swagger
   * /api/v1/messages/:
   *   post:
   *     summary: create new message
   *     tags: [message routes]
   *     requestBody:
   *       description: please fill all required fields
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MessageInput'
   *     responses:
   *       '201':
   *         description: Created
   */

const createOneMessage = async (req, res) => {
  try {
    const createdMessage = await postOneMessageSevice(req.body, req)
    res.status(201).json(createdMessage)
  } catch (error) {
    let statusCode = 400
    if (error.message === 'only admin can create a Message') statusCode = 401
    res.status(statusCode).json({
      error: error.message,
      statusCode,
      datails:
          'please try fill all required fields'
    })
  }
}

/**
   * @swagger
   * /api/v1/messages/{messageId}:
   *    delete:
   *      tags: [message routes]
   *      summary: deleting a one message, should provide messageId from our database
   *      parameters:
   *        - name: messageId
   *          in: path
   *          description: provide messageId
   *          required: true
   *      responses:
   *        200:
   *          description: success
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/message'
   *        404:
   *          description: not found
   */

const deleteOneMessage = async (req, res) => {
  try {
    const deletedMessage = await deleteOneMessageSevice(req.params.messageId, req)
    res.status(200).json(deletedMessage)
  } catch (error) {
    const err = {}
    if (error.message === 'only owner can delete a message') {
      err.details =
          'try login again  (emal, password) or your JWT has expired'
      err.message = error.message
      err.statusCode = 401
    }
    res.status(err.statusCode).json(err)
  }
}

export {
  deleteOneMessage,
  createOneMessage,
  getAllMessages,
  getOneMessage

}
