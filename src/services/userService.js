import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../database/userModal.js'
import { validateUser, updateSchema } from '../database/userSchema.js'

const createUserService = async (user) => {
  const { error, value } = validateUser.validate(user)
  if (error) return error.details[0]
  const createdUser = new User(user)
  await createdUser.save()
  const { email, password } = user
  const myUser = await User.findOne({ email })
  if (myUser && (await bcrypt.compare(password, myUser.password))) {
    return {
      statusCode: 201,
      message: 'user account created successfully',
      data: {
        email,
        _id: user.id
      }
    }
  }
}
const getAllUsersService = async (req) => {
  const users = await User.find({}, { password: 0, __v: 0 })
  return {
    statusCode: 200,
    message: 'all users sent  successfully',
    data: users
  }
}
const getSingleUserService = async (req) => {
  const user = await User.findById(req.params.userId, { password: 0, __v: 0 })
  return {
    statusCode: 200,
    message: `user ${req.params.userId} sent  successfully`,
    data: user
  }
}

const loginUserSevice = async (body) => {
  const { email, password } = body
  // console.log(110)
  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      statusCode: 200,
      message: 'you are now authorized ',
      data: {
        email,
        _id: user.id,
        permision: [process.env.ADMIN_EMAIL === user.email && 'admin'],
        token: generateJWT(user.id)
      }
    }
  }
  throw new Error('account not found')
}

const generateJWT = (id) =>
  jwt.sign({ id }, process.env.MY_SUPER_SECRET, {
    expiresIn: '5d'
  })

const deleteUsersService = async (req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can delete a user')
  }
  const user = await User.deleteOne({ _id: req.params.userId })
  return user
}
const updateUsersService = async (req) => {
  if (req.params.userId !== req.user.id) {
    throw new Error('only owner can update his/her profile')
  }
  const user = await User.findById(req.params.userId)
  const { value, error } = updateSchema.validate(req.body)
  if (error) {
    throw new Error(error.message)
  }

  for (const val in value) {
    user[val] = value[val]
  }
  await user.save()
  return user
}
export {
  updateUsersService,
  loginUserSevice,
  createUserService,
  getSingleUserService,
  generateJWT,
  getAllUsersService,
  deleteUsersService
}
