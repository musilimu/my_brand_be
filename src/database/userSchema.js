import Joi from 'joi'

const schema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'yahoo', 'co', 'io'] }
  }),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  avatar: Joi.string().min(200),
  uid: Joi.string()
})

const updateSchema = Joi.object({
  phone: Joi.string().min(10).max(13),
  avatar: Joi.string().dataUri().min(200),
  address: Joi.string()
})

export { schema as validateUser, updateSchema }
