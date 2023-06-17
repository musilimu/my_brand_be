import {
  createUserService,
  loginUserSevice,
  getAllUsersService,
  updateUsersService,
  deleteUsersService,
  getSingleUserService
} from '../services/userService.js'
import { asyncHandler } from './blogController.js'

const createUser = asyncHandler(async (req, res) => {
  const createdUser = await createUserService(req.body)
  res.status(201).json(createdUser)
})

const loginUser = asyncHandler(async (req, res) => {
  const user = await loginUserSevice(req.body)
  res.json(user)
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService(req)
  res.status(200).json(users)
})

const getSingleUser = asyncHandler(async (req, res) => {
  const user = await getSingleUserService(req)
  res.status(200).json(user)
})

const deteUser = asyncHandler(async (req, res) => {
  const user = await deleteUsersService(req)
  res.status(200).json({
    statusCode: 200,
    message: 'users delete successfully',
    data: user
  })
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUsersService(req)
  res.status(200).json({
    statusCode: 200,
    message: 'user updated successfully',
    data: user
  })
})
export {
  createUser,
  loginUser,
  getAllUsers,
  deteUser,
  updateUser,
  getSingleUser
}
