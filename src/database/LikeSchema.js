import mongoose from 'mongoose'
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
    throw new Error('you unliked')
  } else {
    next()
  }
})

export const LikeModal = mongoose.model('Likes', LikeSchema)
