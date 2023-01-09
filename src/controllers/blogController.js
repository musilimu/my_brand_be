import {
  getAllBlogsService,
  getOneBlogSevice,
  deleteOneBlogSevice,
  updateOneBlogSevice,
  postOneBlogSevice,
  getLikesServive,
  postCommentSevice, likeBlogSevice, likeCommentService, deleteCommentService
} from '../services/blogService.js'

/**
 * @swagger
 * /api/v1/blogs:
 *    get:
 *      tags: [blog routes]
 *      description: <p>returns all blogs from our database</p> (you can also add query to filter your blogs <strong>/api/v1/blogs?sort=created_at:asc&limit=10&offset=0&search=javascript&fields=title,body,banner</strong>)<h3>sorting </h3><p> ascending <strong>/api/v1/blogs?sort=created_at:asc</strong></p><p>descending <strong>/api/v1/blogs?sort=created_at:desc</strong></p><p> <h3>return fields</h3><p>you may not need all fields filter what you need</p><p><strong>/api/v1/blogs?fields=title,body,banner</strong></p><h3>limit the number of blogs</h3><p>limit the length of the response (number of blogs)</p><p><strong>/api/v1/blogs?limit=10</strong></p>[those queries are optional put them according to your choise, add more as shown above]</p>
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
      details:
        'please provide the correct query try reading documentation `http:localhost:3000/api/docs`',
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
    res.json(Likes)
  } catch (error) {
    res.json({
      details: 'try provide id of blog and try again',
      error: error.message,
      statusCode: 400
    })
  }
}

/**
 * @swagger
 * /api/v1/blogs/{blogId}/likes:
 *   get:
 *     summary: get all likes of a blog
 *     tags: [blog routes]
 *     parameters:
 *      - name: blogId
 *        in: path
 *        description: provide blogId
 *        required: true
 *     responses:
 *       '201':
 *         description: all likes likes for this blog sent successfuly
 */

const getOneBlog = async (req, res) => {
  try {
    const blog = await getOneBlogSevice(req.params.blogId, req)
    res.status(200).json(blog)
  } catch (error) {
    res.json({
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
    res.status(201).json(createdBlog)
  } catch (error) {
    let statusCode = 400
    if (error.message === 'only admin can create a blog') statusCode = 401
    res.status(statusCode).json({
      error: error.message,
      statusCode,
      datails:
        'please try fill all required fields read `http://localhost:3000/api/v1/docs`'
    })
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
 * /api/v1/blogs/{blogId}/comments:
 *   post:
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

/**
 * @swagger
 * /api/v1/blogs/{blogId}/likes:
 *   post:
 *     summary: likes a blog login is required first
 *     tags: [blog routes]
 *     parameters:
 *      - name: blogId
 *        in: path
 *        description: provide blogId
 *        required: true
 *     responses:
 *       '201':
 *         description: liked successfuly
 */
const postComment = async (req, res) => {
  try {
    const updatedBlog = await postCommentSevice(req)
    res.send(updatedBlog)
  } catch (error) {
    res.json({ error: error.message })
  }
}

const likeBlog = async (req, res) => {
  try {
    const updatedBlog = await likeBlogSevice(req)
    res.send(updatedBlog)
  } catch (error) {
    res.json({ error: error.message })
  }
}

/**
 * @swagger
 * /api/v1/blogs/{blogId}/comments/{commentId}/likes:
 *   post:
 *     summary: like a comment on a blog, login is required first
 *     tags: [blog routes]
 *     parameters:
 *      - name: blogId
 *        in: path
 *        description: provide blogId
 *        required: true
 *      - name: commentId
 *        in: path
 *        description: provide commentId
 *        required: true
 *     responses:
 *       '201':
 *         description: Commented successfuly
 */
const likeComment = async (req, res) => {
  try {
    const updatedBlog = await likeCommentService(req)
    res.send(updatedBlog)
  } catch (error) {
    res.json({ error: error.message })
  }
}

const updateOneBlog = async (req, res) => {
  try {
    const updatedBlog = await updateOneBlogSevice(req.params.blogId, req)
    res.send(updatedBlog)
  } catch (error) {
    let statusCode = 400
    if (error.message === 'only admin can update a blog') statusCode = 401
    res.status(statusCode).json({ error: error.message, statusCode })
  }
}
/**
 * @swagger
 * /api/v1/blogs/{blogId}/comments/{commentId}:
 *   delete:
 *     summary: delete a comment on a blog, login is required with admin credentials first
 *     tags: [blog routes]
 *     parameters:
 *      - name: blogId
 *        in: path
 *        description: provide blogId
 *        required: true
 *      - name: commentId
 *        in: path
 *        description: provide commentId
 *        required: true
 *     responses:
 *       '201':
 *         description: Commented successfuly
 */
const deleteComment = async (req, res) => {
  try {
    const updatedBlog = await deleteCommentService(req)
    res.status(200).send(updatedBlog)
  } catch (error) {
    res.json({ error: error.message })
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
 *        404:
 *          description: not found
 */

const deleteOneBlog = async (req, res) => {
  try {
    const deletedMessage = await deleteOneBlogSevice(req.params.blogId, req)
    res.status(200).json(deletedMessage)
  } catch (error) {
    const err = {}
    if (error.message === 'only admin can delete a blog') {
      err.details =
        'try login agin with admin (emal, password) or your JWT has expired'
      err.message = error.message
      err.statusCode = 401
    }
    res.json(err)
  }
}

export {
  deleteOneBlog,
  createOneBlog,
  updateOneBlog,
  getAllBlogs,
  getOneBlog,
  getLikes, postComment, likeBlog, likeComment, deleteComment
}
