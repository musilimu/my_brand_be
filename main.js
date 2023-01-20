import express from 'express'
import { config } from 'dotenv'

import app from './src/index.js'
import swagerDocs from './src/utils/swagger.js'

const server = express()
server.use(app)
if (process.env.NODE_ENV !== 'production') {
  config()
}
const PORT = process.env.port || 3000

server.listen(PORT, () => {
  swagerDocs(server, PORT)
  console.log(`server started listening on port ${PORT}`)
})
export default server
