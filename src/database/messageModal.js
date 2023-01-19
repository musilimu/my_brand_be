import mongoose from 'mongoose'
const Schema = mongoose.Schema
const MessageSchema = new Schema(
  {
    name: String,
    email: String,
    subject: String
  },
  {
    timestamps: true
  }
)

const Message = mongoose.model('Messages', MessageSchema)
export default Message
