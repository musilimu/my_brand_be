import express from 'express'
import app from './src/index.js'
import swagerDocs from './src/utils/swagger.js'
const server = express()
server.use(app)
server.listen(process.env.port || 3000, () => {
  swagerDocs(server, 3000)
  console.log(`server started listening on port ${process.env.port}`)
})
