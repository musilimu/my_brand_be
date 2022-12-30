import {
  createUserService,
  loginUserSevice,
  getAllUsersService
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
 *         description: logged in successfully
 */

const createUser = async (req, res) => {
  try {
    const createdUser = await createUserService(req.body)
    res.status(201).json(createdUser)
  } catch (error) {
    let status = 401
    if (error.message.includes('duplicate key error collection')) {
      status = 406
    }
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
const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService(req)
    res.status(201).json(users)
  } catch (error) {
    res.status(401).json({
      msg: 'users not fund',
      error: error.message
    })
  }
}
export { createUser, loginUser, getAllUsers }
