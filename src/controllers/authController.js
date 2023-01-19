import {
  createUserService,
  loginUserSevice,
  getAllUsersService, updateUsersService, deleteUsersService, getSingleUserService
} from '../services/userService.js'
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: create your account for our blog
 *     tags: [auth routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '201':
 *         description: user account created successfully
 */

const createUser = async (req, res) => {
  try {
    const createdUser = await createUserService(req.body)
    res.status(201).json(createdUser)
  } catch (error) {
    let status = 401
    if (error.message.includes('duplicate key error collection')) { status = 406 }

    const err = {
      msg: 'Email or Username are being used by another account',
      details: error.message,
      statusCode: status
    }
    res.status(status).json(err)
  }
}
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: create your account for our blog
 *     tags: [auth routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '201':
 *         description: logged in successfully
 */

const loginUser = async (req, res) => {
  try {
    const user = await loginUserSevice(req.body)
    res.json(user)
  } catch (error) {
    res.status(401).json({
      details: "Credentials doesn't match any account",
      error: error.message,
      statusCode: 401
    })
  }
}
/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     summary: get all users
 *     tags: [auth routes]
 *     responses:
 *       '201':
 *         description: returns list of all users
 *       '401':
 *         description: Error try loggin first
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService(req)
    res.status(200).json(users)
  } catch (error) {
    res.status(401).json({
      msg: 'users not found',
      error: error.message
    })
  }
}

/**
 * @swagger
 * /api/v1/auth/users/{userId}:
 *    get:
 *      tags: [auth routes]
 *      summary: get one user
 *      parameters:
 *        - name: userId
 *          in: path
 *          description: provide userId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *        404:
 *          description: not found
 */
const getSingleUser = async (req, res) => {
  try {
    const user = await getSingleUserService(req)
    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({
      msg: 'users not found',
      error: error.message
    })
  }
}

/**
 * @swagger
 * /api/v1/auth/users/{userId}:
 *    delete:
 *      tags: [auth routes]
 *      summary: deleting a one user, should provide userId from our database
 *      parameters:
 *        - name: userId
 *          in: path
 *          description: provide userId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *        401:
 *          description: not found
 */

const deteUser = async (req, res) => {
  try {
    const user = await deleteUsersService(req)
    res.status(200).json({
      statusCode: 200,
      message: 'users delete successfully',
      data: user
    })
  } catch (error) {
    res.status(401).json({
      message: 'user not found',
      error: error.message
    })
  }
}
/**
 * @swagger
 * /api/v1/auth/users/{userId}:
 *   put:
 *     summary: add user profile and update it
 *     tags: [auth routes]
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: provide userId
 *        required: true
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/profileInput'
 *     responses:
 *       '201':
 *         description: Commented successfuly
 */
const updateUser = async (req, res) => {
  try {
    const user = await updateUsersService(req)
    res.status(200).json({
      statusCode: 200,
      message: 'user updated successfully',
      data: user
    })
  } catch (error) {
    res.status(401).json({
      message: 'user not found, request failed',
      error: error.message,
      statusCode: 400
    })
  }
}
export { createUser, loginUser, getAllUsers, deteUser, updateUser, getSingleUser }
