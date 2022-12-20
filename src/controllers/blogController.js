import {
  getAllBlogsService,
  getOneBlogSevice,
  deleteOneBlogSevice,
  updateOneBlogSevice,
  postOneBlogSevice,
} from "../services/blogService.js";

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
  const allBlogs = await getAllBlogsService();
  res.json(allBlogs);
};

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

const getOneBlog = async (req, res) => {
  try {
    const blog = await getOneBlogSevice(req.params.blogId);
    res.json(blog);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
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
    const createdBlog = await postOneBlogSevice(req.body, req);
    res.json(createdBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
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
const updateOneBlog = async (req, res) => {
  try {
    const updatedBlog = await updateOneBlogSevice(req.params.blogId, req);
    res.send(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
    const deletedMessage = await deleteOneBlogSevice(req.params.blogId, req);
    res.json(deletedMessage);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export { deleteOneBlog, createOneBlog, updateOneBlog, getAllBlogs, getOneBlog };
