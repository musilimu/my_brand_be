import bcrypt from 'bcrypt'
import User from '../database/userModal.js'

export const createUserSeeding = async () => {
  const salt = await bcrypt.genSalt()
  const password = await bcrypt.hash('lorem12345', salt)
  const user = await User.findOneAndUpdate(
    { email: 'john1@gmail.com' },
    {
      email: 'john1@gmail.com',
      password,
      userName: 'doe1'
    },
    { upsert: true, new: true }
  )

  return user
}
