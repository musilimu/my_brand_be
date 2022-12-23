import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const LikeSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'Users'
    }
  },
  {
    timestamps: true
  }
)

export default LikeSchema
