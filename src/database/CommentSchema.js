import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const CommentSchema = new Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: 'Users'
    },
    text: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default CommentSchema
