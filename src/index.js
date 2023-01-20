import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import * as Redis from 'redis'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { v1BlogRouter } from './v1/routes/blogs.js'
import { v1AuthRouter } from './v1/routes/auth.js'
import { v1MessageRouter } from './v1/routes/messages.js'
const RedisStore = connectRedis(session)
const app = express.Router()

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
const redisClient = Redis.createClient({ legacyMode: true })
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.MY_SUPER_SECRET,
    cookie: { secure: true },
    resave: false
  })
)

// app.use(
//   session({
//     secret: process.env.MY_SUPER_SECRET,
//     resave: false,
//     saveUninitialized: true
//   })
// )
app.use(express.json())
app.use(express.static('public'))
mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true
  })
  .then(() => console.log('connected to db'))

app.use('/api/v1/blogs', v1BlogRouter)
app.use('/api/v1/auth', v1AuthRouter)
app.use('/api/v1/messages', v1MessageRouter)

export default app
