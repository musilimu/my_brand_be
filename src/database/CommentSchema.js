import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const CommentSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'Users'
    },
    text: {
      type: String,
      required: true
    },
    likes: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
)

export default CommentSchema
