import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LikeSchema = new Schema(
  {
    user: {
      type: ObjectId,
      unique: true,
      required: true,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export default LikeSchema;
