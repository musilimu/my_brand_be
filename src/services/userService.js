import User from '../database/userModal.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateUser } from '../database/userSchema.js'

const createUserService = async (user) => {
  const { error, value } = validateUser.validate(user)
  if (error) return error.details
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
        _id: user.id,
        token: generateJWT(user.id)
      }
    }
  }
}
const getAllUsersService = async (req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error('only admin can update a blog')
  }

  const users = await User.find()
  return { statusCode: 200, message: 'all users sent  successfully', data: users }
}
const loginUserSevice = async (body) => {
  const { email, password } = body
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      statusCode: 200,
      message: 'you are now authorized ',
      data: {
        email,
        _id: user.id,
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

export { loginUserSevice, createUserService, generateJWT, getAllUsersService }
