import jwt from 'jsonwebtoken'
import User from '../database/userModal.js'

const secureRoute = async (req, res, next) => {
  let JWTtoken
  const errorRes = {
    error: 'not authorized',
    JWTtoken: req.headers.authorization,
    details: 'JWT is expired  and not acceptable',
    statusCode: 403,
  }
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      JWTtoken = req.headers.authorization.split(' ')[1]
      const decodedData = jwt.verify(JWTtoken, process.env.MY_SUPER_SECRET)
      const user = await User.findById(decodedData.id).select('-password')

      req.user = user
      if (user) return next()
      return res.status(401).json({
        error: 'not authorized',
        statusCode: 401,
        details:
          "try provide your JWT go to `http:localhost:3000/api/v1/auth/login` or create an account if you don't have one.",
      })
    } catch (err) {
      res.status(403).json(errorRes)
      return
    }
  }
  res.status(401).json({
    error: 'not authorized',
    statusCode: 401,
    details:
      "try provide your JWT go to `http:localhost:3000/api/v1/auth/login` or create an account if you don't have one.",
  })
}

export default secureRoute
