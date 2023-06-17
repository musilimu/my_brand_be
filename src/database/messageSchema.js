import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().min(3).max(20),
  subject: Joi.string().required().min(5),
  message: Joi.string().required().min(10)
})

export { schema as validateMessage }
