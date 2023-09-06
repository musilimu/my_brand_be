import express from 'express'
import { config } from 'dotenv'

import app from './src/index.js'
import swagerDocs from './src/utils/swagger.js'
import { BlogError } from './src/controllers/blogController.js'
import { client } from './src/database/redisClient.js'

const server = express()
server.use(app, errHandler)
if (process.env.NODE_ENV !== 'production') {
  config()
}
const PORT = process.env.port || 3000

function errHandler(err, req, res, next) {
  if (err instanceof BlogError) return res.status(err.statusCode).json(err)
  res.status(500).json({ error: 'unexpected error', message: err.message })
}

client.connect()

server.listen(PORT, () => {
  swagerDocs(server, PORT)
  console.log(
    `server started listening on port ${PORT} !!! look for documentation on /api/v1/docs`,
  )
})
export default server
