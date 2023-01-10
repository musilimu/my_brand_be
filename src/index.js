import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import * as Redis from 'redis'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { config } from 'dotenv'
import { v1BlogRouter } from './v1/routes/blogs.js'
import { v1AuthRouter } from './v1/routes/auth.js'
const RedisStore = connectRedis(session)
const app = express.Router()
if (process.env.NODE_ENV !== 'production') {
  config()
}

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
    resave: false
  })
)

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

app.use('/api/v1/blogs', v1BlogRouter)
app.use('/api/v1/auth', v1AuthRouter)

export default app
