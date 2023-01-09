import express from 'express'
import app from './src/index.js'
import swagerDocs from './src/utils/swagger.js'

const server = express()
server.use(app)
const PORT = process.env.port || 3000
server.listen(PORT, () => {
  swagerDocs(server, PORT)
  console.log(`server started listening on port ${PORT}`)
})
export default server
