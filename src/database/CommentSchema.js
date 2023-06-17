import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const CommentsLikeSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'Users',
      unique: true
    },
    comment: {
      type: ObjectId,
      ref: 'Comments'
    }
  },
  {
    timestamps: true
  }
)

export const CommentLikes = mongoose.model('CommentLikes', CommentsLikeSchema)

export const CommentSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'Users',
      required: true
    },
    blog: {
      type: ObjectId,
      ref: 'Blogs',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    likes: {
      type: [CommentsLikeSchema],
      refPath: 'CommentLikes'
    }
  },
  {
    timestamps: true
  }
)

export const Comment = mongoose.model('Comments', CommentSchema)
