import jwt from 'jsonwebtoken'
import User from '../database/userModal.js'

const secureRoute = async (req, res, next) => {
  let JWTtoken

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      JWTtoken = req.headers.authorization.split(' ')[1]
      const decodedData = jwt.verify(JWTtoken, process.env.MY_SUPER_SECRET)
      req.user = await User.findById(decodedData.id).select('-password')
      next()
      return
    } catch {
      res.status(404).json({
        errorMessage: 'not authorized',
        JWTtoken: req.headers.authorization
      })
      return
    }
  }
  res.status(404).json({
    errorMessage: 'not authorized'
  })
}

export default secureRoute
