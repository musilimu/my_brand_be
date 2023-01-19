import Joi from 'joi'
/**
 * @openapi
 * components:
 *  schemas:
 *    MessageInput:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - subject
 *        - message
 *      properties:
 *        name:
 *          type: string
 *          default: muslim
 *        email:
 *          type: string
 *          default: muslim@gmail.com
 *        subject:
 *          type: string
 *          default: hiring you
 *        message:
 *          type: string
 *          default: contact me as soon as possible
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    message:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - subject
 *        - message
 *      properties:
 *        name:
 *          type: string
 *        message:
 *          type: string
 *        email:
 *          type: string
 *        subject:
 *          type: string
 */

const schema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().min(3).max(20),
  subject: Joi.string().required().min(5),
  message: Joi.string().required().min(10)
})

export { schema as validateMessage }
