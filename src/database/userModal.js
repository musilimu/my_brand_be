import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email is required.'],
      unique: true
    },
    userName: {
      type: String,
      required: [true, 'userName is required.'],
      unique: true
    },
    uid: { type: String, default: () => Math.random() },
    password: {
      type: String,
      required: [true, 'password is required.'],
      minLength: 6
    },
    avatar: String
  },
  {
    timestamps: true
  }
);
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('Users', UserSchema);
export default User;
