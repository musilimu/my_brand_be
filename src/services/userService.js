import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../database/userModal.js'
import { validateUser, updateSchema } from '../database/userSchema.js'
import { client } from '../database/redisClient.js'

const createUserService = async (user) => {
  const { error } = validateUser.validate(user)
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
        _id: user.id,
      },
    }
  }
}
const getAllUsersService = async (req) => {
  const data = await client.get('users')
  if (data) {
    return {
      statusCode: 200,
      message: 'all users sent  successfully',
      data: JSON.parse(data),
    }
  }

  const users = await User.find({}, { password: 0, __v: 0 })
  await client.set('users', JSON.stringify(users))

  return {
    statusCode: 200,
    message: 'all users sent  successfully',
    data: users,
  }
}
const getSingleUserService = async (req) => {
  // try {
  const data = await client.get(req.params.userId)

  if (data) {
    return {
      statusCode: 200,
      message: `user ${req.params.userId} sent  successfully`,
      data: JSON.parse(data),
    }
  }
  const user = await User.findById(req.params.userId, {
    password: 0,
    __v: 0,
  })
  await client.set(req.params.userId, JSON.stringify(user))

  return {
    statusCode: 200,
    message: `user ${req.params.userId} sent  successfully`,
    data: user,
  }
  // } catch (error) {
  //   console.log(error)
  // }
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
        permision: [process.env.ADMIN_EMAIL === user.email && 'admin'],
        token: await generateJWT(user.id),
      },
    }
  }
  throw new Error('account not found')
}

const generateJWT = async (id) => {
  const data = await client.get(`token ${id}`)
  if (data) {
    return data
  }
  const token = jwt.sign({ id }, process.env.MY_SUPER_SECRET, {
    expiresIn: '5d',
  })
  await client.setEx(`token ${id}`, 5 * 24 * 60 * 60, token)

  return token
}

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
  deleteUsersService,
}
