import mongoose from 'mongoose'
import { CommentSchema } from './CommentSchema.js'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const BlogSchema = new Schema(
  {
    author: {
      type: ObjectId,
      required: [true, 'please provide the author'],
      ref: 'Users'
    },
    title: String,
    body: String,
    banner: String,
    likes: Object,
    comments: {
      type: [CommentSchema],
      refPath: 'Comments'
    }
  },
  {
    timestamps: true
  }
)

const Blog = mongoose.model('Blogs', BlogSchema)
export default Blog
