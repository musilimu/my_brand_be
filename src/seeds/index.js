import mongoose from 'mongoose'
import { config } from 'dotenv'

import { createBlogSeeding } from './createBlog.js'
import { createUserSeeding } from './user.js'

(async () => {
  config()
  mongoose.set('strictQuery', false)
  await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true
    })

  const user = await createUserSeeding()
  await createBlogSeeding({ author: user.id })
  await mongoose.disconnect()
})()
