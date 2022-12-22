import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'blog api',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        jwt: []
      }
    ],
    swagger: '3.0'
  },
  apis: ['./src/controllers/*.js', './src/database/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export default function swagger (app, port) {
  app.use('/api/v1/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec))
  app.use((req, res) => {
    res.status(404).json({
      message: 'route not available'
    })
  })
}
