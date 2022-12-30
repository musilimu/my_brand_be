import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import cors from 'cors'
import { config } from 'dotenv'
import { v1BlogRouter } from './v1/routes/blogs.js'
import { v1AuthRouter } from './v1/routes/auth.js'
import cookieParser from 'cookie-parser'
const app = express.Router()
if (process.env.NODE_ENV !== 'production') {
  config()
}
app.use(cors())
app.use(
  session({
    secret: process.env.MY_SUPER_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
)
app.use(express.json())
app.use(express.static('public'))
mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true
  })
  .then(() => console.log('connected to db'))
app.get('/', (req, res) => {
  res.cookie('hi', 'thet')
  console.log(res.cookie('hi'))
  res.json([1, 2, 3])
})
app.use('/api/v1/blogs', v1BlogRouter)
app.use('/api/v1/auth', v1AuthRouter)

export default app
