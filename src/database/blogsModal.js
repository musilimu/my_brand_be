import fs from 'fs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import LikeSchema from './LikeSchema.js';
import CommentSchema from './CommentSchema.js';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
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
    likes: [LikeSchema],
    comments: [CommentSchema]
  },
  {
    timestamps: true
  }
);

BlogSchema.pre('save', async function (next) {
  const fileName = `public/${crypto.randomUUID()} ${Date.now()}.txt`;
  fs.writeFile(fileName, this.banner, (err) => {
    if (err) {
      console.error(err);
    }
  });
  this.banner = fileName;
  next();
});

const Blog = mongoose.model('Blogs', BlogSchema);
export default Blog;
