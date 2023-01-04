import Joi from 'joi'

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - userName
 *        - email
 *        - password
 *      properties:
 *        userName:
 *          type: string
 *          default: muslim
 *        email:
 *          type: string
 *          default: muslim@gmail.com
 *        password:
 *          type: string
 *          default: 11b1GCAYA

 */

/**
 * @openapi
 * components:
 *  schemas:
 *    profileInput:
 *      type: object
 *      properties:
 *        phone:
 *          type: string
 *          default: 0791160178
 *        address:
 *          type: string
 *          default: Ngoma - Remera
 *        avatar:
 *          type: string
 *          default: data:image/png;base64,AABGCAYAAABxLuKEAAAACXBIWXMAAAsTAAALEwEAm==
 *    CommentBlogInput:
 *      type: object
 *      required:
 *        - comment
 *      properties:
 *        comment:
 *          type: string
 *          default: 👍 I love it
 *    CreateBlogResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *            body:
 *              type: string
 *            banner:
 *              type: string
 *            createdAt:
 *              type: string
 *            author:
 *              type: string
 *            updatedAt:
 *              type: string
 *            _id:
 *              type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    blog:
 *      type: object
 *      required:
 *        - title
 *        - banner
 *        - author
 *        - body
 *      properties:
 *        title:
 *          type: string
 *        body:
 *          type: string
 *        banner:
 *          type: string
 *        author:
 *          type: string
 */

const schema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'yahoo', 'co', 'io'] }
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  avatar: Joi.string().min(200),
  uid: Joi.string()
})

const updateSchema = Joi.object({
  phone: Joi.string().min(10).max(13),
  avatar: Joi.string().dataUri().min(200),
  address: Joi.string()
})

export { schema as validateUser, updateSchema }
