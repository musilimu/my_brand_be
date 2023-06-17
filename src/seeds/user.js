import User from '../database/userModal.js'

export const createUserSeeding = async () => {
  const user = await User.create({
    email: process.env.ADMIN_EMAIL,
    password: 'Lorem12345',
    userName: 'doe',
  })

  if (user) return user
}
