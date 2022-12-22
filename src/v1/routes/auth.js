import express from 'express'

import passport from 'passport'
import FacebookStrategy from 'passport-facebook'

import { createUser, loginUser } from '../../controllers/authController.js'
import secureRoute from '../../middlewares/authMiddleware.js'
import { config } from 'dotenv'
import { createUserService, generateJWT } from '../../services/userService.js'
import User from '../../database/userModal.js'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const router = express.Router()

// router.use(passport.initialize())
// router.use(passport.session())
let user
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ['id', 'displayName', 'photos', 'email']
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const {
//         _json: { id, name, email }
//       } = profile
//       const myUser = await User.findOne({ email })
//       if (myUser) {
//         user = { id, name, email, token: generateJWT(id) }
//         done(null, user)
//       } else {
//         const res = await createUserService({
//           userName: name.split(' ').join(''),
//           email,
//           password: id,
//           uid: id
//         })
//         user = res.data
//         done(null, user)
//       }
//     }
//   )
// )

// router.get(
//   '/facebook',
//   passport.authenticate('facebook', {
//     authType: 'reauthenticate',
//     scope: ['email']
//   })
// )
// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', {
//     failureRedirect: '/api/v1/auth/login',
//     failureMessage: true
//   }),
//   (req, res) => {
//     res.json({ message: 'logged in successfuly', data: req.user })
//   }
// )
// passport.serializeUser(async (user, done) => {
//   done(null, user)
// })
// passport.deserializeUser(async (id, done) => {
//   const logedUser = User.find({ uid: user.id })
//   if (logedUser) {
//     done(null, user)
//   }
//   return done(null, id)
// })
router.route('/signup').post(createUser)
router.route('/login').post(loginUser)
router.get('/profile', secureRoute, (req, res) => {
  res.json(user)
})

export { router as v1AuthRouter }
