import Joi from 'joi'

const schema = Joi.object({
  title: Joi.string().required().min(100).max(500),
  body: Joi.string().required().min(1500),
  banner: Joi.string().dataUri().required().min(200)
})

const updatingSchema = Joi.object({
  title: Joi.string().min(100).max(500),
  body: Joi.string().min(1500),
  banner: Joi.string().dataUri().min(200)
})

export { schema as validateBlog, updatingSchema }
