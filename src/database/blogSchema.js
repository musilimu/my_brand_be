import Joi from 'joi'
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateBlogInput:
 *      type: object
 *      required:
 *        - title
 *        - body
 *        - banner
 *        - author
 *      properties:
 *        title:
 *          type: string
 *          default: creative webdeveloper's spider logo
 *        body:
 *          type: string
 *          default: how creative webdeveloper think about spider logo
 *        banner:
 *          type: string
 *          default: data:image/png;base64,AABGCAYAAABxLuKEAAAACXBIWXMAAAsTAAALEwEAm==
 *        author:
 *          type: string
 *          default: 639c5eba4269042058a38611
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
  title: Joi.string().required().min(100).max(500),
  body: Joi.string().required().min(1500),
  banner: Joi.string().dataUri().required().min(200),
  author: Joi.string().alphanum().required(),
  likes: Joi.array()
})

const updatingSchema = Joi.object({
  title: Joi.string().min(100).max(500),
  body: Joi.string().min(1500)
})

export { schema as validateBlog, updatingSchema }
