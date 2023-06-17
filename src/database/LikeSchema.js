import mongoose from 'mongoose'
import { BlogError } from '../controllers/blogController.js'
import { STATUSCODE } from '../utils/statusCodes.js'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const LikeSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'Users'
    },
    blog: {
      type: ObjectId,
      ref: 'Blogs'
    }
  },
  {
    timestamps: true
  }
)

LikeSchema.pre('save', async function (next) {
  const like = await LikeModal.findOne({ blog: this.blog, user: this.user })
  if (like) {
    await like.delete()
    throw new BlogError({
      message: 'you unliked this blog post',
      statusCode: STATUSCODE.OK
    })
  } else {
    next()
  }
})

export const LikeModal = mongoose.model('Likes', LikeSchema)
