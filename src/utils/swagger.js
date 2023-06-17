import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'blog api',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    swagger: '3.0',
  },
  apis: ['./docs/*.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)
const responseJSON = {
  statusCode: 404,
  error: 'route not found',
  message: 'route not available',
  detail: 'check for another route or try again',
}
export default function swagger(app, port) {
  app.use('/api/v1/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec))
  app.use((req, res) => {
    res.status(404).json(responseJSON)
  })
}
