import Joi from "joi";

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

const schema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "yahoo", "co", "io"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  avatar: Joi.string().min(200),
  uid: Joi.string(),
});

export { schema as validateUser };
