import {
  getAllBlogsService,
  getOneBlogSevice,
  deleteOneBlogSevice,
  updateOneBlogSevice,
  postOneBlogSevice, getLikesServive
} from '../services/blogService.js'

/**
 * @swagger
 * /api/v1/blogs:
 *    get:
 *      tags: [blog routes]
 *      description: returns all blogs from our database
 *      responses:
 *        200:
 *          description: blogs get all blogs from our api
 */

const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await getAllBlogsService(req)
    res.status(200).json(allBlogs)
  } catch (error) {
    res.status(400).json({
      error: error.message,
      details: 'please provide the correct query try reading documentation `http:localhost:3000/api/docs`',
      statusCode: 400
    })
  }
}

/**
 * @swagger
 * /api/v1/blogs/{blogId}:
 *    get:
 *      tags: [blog routes]
 *      summary: returns a one blog should provide blogId from our database
 *      parameters:
 *        - name: blogId
 *          in: path
 *          description: provide blogId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/blog'
 *        404:
 *          description: not found
 */

const getLikes = async (req, res) => {
  try {
    const Likes = await getLikesServive(req)
    res.send(Likes)
  } catch (error) {
    res.status(400).json({
      details: 'try provide id of blog and try again',
      error: error.message,
      statusCode: 400
    })
  }
}

const getOneBlog = async (req, res) => {
  try {
    const blog = await getOneBlogSevice(req.params.blogId, req)
    res.status(200).json(blog)
  } catch (error) {
    res.status(400).json({
      details: 'try provide id of blog and try again',
      error: error.message,
      statusCode: 400
    })
  }
}
/**
 * @swagger
 * /api/v1/blogs/:
 *   post:
 *     summary: create new blog
 *     tags: [blog routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogInput'
 *     responses:
 *       '201':
 *         description: Created
 */

const createOneBlog = async (req, res) => {
  try {
    const createdBlog = await postOneBlogSevice(req.body, req)
    res.json(createdBlog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
/**
 * @swagger
 * /api/v1/blogs/{blogId}:
 *   put:
 *     summary: update a blog post only admin can update
 *     tags: [blog routes]
 *     parameters:
 *      - name: blogId
 *        in: path
 *        description: provide blogId
 *        required: true
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogInput'
 *     responses:
 *       '201':
 *         description: Created successfuly
 */

/**
 * @swagger
 * /api/v1/blogs/{blogId}?like=true:
 *   put:
 *     summary: update a blog post only admin can update
 *     tags: [blog routes]
 *     parameters:
 *      - name: blogId
 *        in: path
 *        description: provide blogId
 *        required: true
 *     responses:
 *       '201':
 *         description: Created successfuly
 */

/**
 * @swagger
 * /api/v1/blogs/{blogId}?comment=true:
 *   put:
 *     summary: update a blog post only admin can update
 *     tags: [blog routes]
 *     parameters:
 *      - name: blogId
 *        in: path
 *        description: provide blogId
 *        required: true
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentBlogInput'
 *     responses:
 *       '201':
 *         description: Commented successfuly
 */
const updateOneBlog = async (req, res) => {
  try {
    const updatedBlog = await updateOneBlogSevice(req.params.blogId, req)
    res.send(updatedBlog)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

/**
 * @swagger
 * /api/v1/blogs/{blogId}:
 *    delete:
 *      tags: [blog routes]
 *      summary: deleting a one blog, should provide blogId from our database
 *      parameters:
 *        - name: blogId
 *          in: path
 *          description: provide blogId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/blog'
 *        401:
 *          description: not found
 */

const deleteOneBlog = async (req, res) => {
  try {
    const deletedMessage = await deleteOneBlogSevice(req.params.blogId, req)
    res.status(200).json(deletedMessage)
  } catch (error) {
    const err = {}
    if (error.message === 'only admin can delete a blog') {
      err.details = 'try login agin with admin (emal, password) or your JWT has expired'
      err.message = error.message
      err.statusCode = 401
    }
    res.status(401).json(err)
  }
}

export { deleteOneBlog, createOneBlog, updateOneBlog, getAllBlogs, getOneBlog, getLikes }
