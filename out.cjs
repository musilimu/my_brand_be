var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.js
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_express4 = __toESM(require("express"), 1);

// src/index.js
var import_express3 = __toESM(require("express"), 1);
var import_mongoose5 = __toESM(require("mongoose"), 1);
var import_express_session = __toESM(require("express-session"), 1);
var Redis3 = __toESM(require("redis"), 1);
var import_connect_redis = __toESM(require("connect-redis"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_dotenv2 = require("dotenv");

// src/v1/routes/blogs.js
var import_express = __toESM(require("express"), 1);

// src/services/blogService.js
var import_redis = __toESM(require("redis"), 1);

// src/database/blogsModal.js
var import_fs = __toESM(require("fs"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_mongoose2 = __toESM(require("mongoose"), 1);

// src/database/CommentSchema.js
var import_mongoose = __toESM(require("mongoose"), 1);
var Schema = import_mongoose.default.Schema;
var ObjectId = Schema.ObjectId;
var CommentSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "Users"
    },
    text: {
      type: String,
      required: true
    },
    likes: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);
var CommentSchema_default = CommentSchema;

// src/database/blogsModal.js
var Schema2 = import_mongoose2.default.Schema;
var ObjectId2 = Schema2.ObjectId;
var BlogSchema = new Schema2(
  {
    author: {
      type: ObjectId2,
      required: [true, "please provide the author"],
      ref: "Users"
    },
    title: String,
    body: String,
    banner: String,
    likes: Object,
    comments: [CommentSchema_default]
  },
  {
    timestamps: true
  }
);
BlogSchema.pre("save", async function(next) {
  if (this.banner)
    next();
  else {
    const fileName = `${import_crypto.default.randomUUID()}--${Date.now()}`;
    import_fs.default.writeFile(`public/${fileName}`, this.banner, (err) => {
      if (err) {
        console.error(err);
      }
    });
    this.banner = fileName;
    next();
  }
});
var Blog = import_mongoose2.default.model("Blogs", BlogSchema);
var blogsModal_default = Blog;

// src/database/blogSchema.js
var import_joi = __toESM(require("joi"), 1);
var schema = import_joi.default.object({
  title: import_joi.default.string().required().min(100).max(500),
  body: import_joi.default.string().required().min(1500),
  banner: import_joi.default.string().dataUri().required().min(200)
});
var updatingSchema = import_joi.default.object({
  title: import_joi.default.string().min(100).max(500),
  body: import_joi.default.string().min(1500)
});

// src/database/LikeSchema.js
var import_mongoose3 = __toESM(require("mongoose"), 1);
var Schema3 = import_mongoose3.default.Schema;
var ObjectId3 = Schema3.ObjectId;
var LikeSchema = new Schema3(
  {
    user: {
      type: ObjectId3,
      ref: "Users"
    },
    blog: {
      type: ObjectId3,
      ref: "Blogs"
    }
  },
  {
    timestamps: true
  }
);
LikeSchema.pre("save", async function(next) {
  const like = await LikeModal.findOne({ blog: this.blog, user: this.user });
  if (like) {
    await like.delete();
    throw new Error("you unliked");
  } else {
    next();
  }
});
var LikeModal = import_mongoose3.default.model("Likes", LikeSchema);

// src/services/blogService.js
var client = import_redis.default.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});
var getAllBlogsService = async (req) => {
  const allBlogs = await fetchByParams(req.query);
  return {
    statusCode: 200,
    message: "List of all blogs from our database",
    data: allBlogs
  };
};
var sortBlogs = (sortStr = "created_at:asc") => {
  if (sortStr && sortStr === "created_at:asc") {
    return 1;
  }
  if (sortStr && sortStr === "created_at:desc") {
    return -1;
  }
  throw new Error("server failed to sort based on query provided");
};
var fetchByParams = async (query) => {
  const { sort, limit, offset, search, fields } = query;
  let returnFields = {};
  returnFields = fields?.split(",").reduce((fieldSets, field) => {
    fieldSets[field] = 1;
    return fieldSets;
  }, {});
  console.log("query", JSON.stringify(query));
  await client.connect();
  const value = await client.get(JSON.stringify(query));
  if (value) {
    const allBlogs = JSON.parse(value);
    await client.disconnect();
    return allBlogs;
  } else {
    const data = await blogsModal_default.find(
      { $or: [{ title: new RegExp(search) }, { body: new RegExp(search) }] },
      returnFields
    ).sort({ createdAt: sortBlogs(sort) }).skip(+offset).limit(+limit);
    await client.set(JSON.stringify(query), JSON.stringify(data));
    await client.disconnect();
    return data;
  }
};
var getLikesServive = async (req) => {
  const { blogId } = req.params;
  await client.connect();
  const data = await client.get(blogId);
  if (data) {
    return JSON.parse(data);
  } else {
    const likes = await LikeModal.find({ blog: blogId });
    await client.set(blogId, JSON.stringify(likes));
    return likes;
  }
};
var getOneBlogSevice = async (blogId, req) => {
  const { fields } = req.query;
  await client.connect();
  let returnFields = {};
  returnFields = fields?.split(",").reduce((fieldSets, field) => {
    fieldSets[field] = 1;
    return fieldSets;
  }, {});
  const data = await client.get(`${blogId}--${JSON.stringify(returnFields)}`);
  if (data) {
    const blog = JSON.parse(data);
    await client.disconnect();
    return {
      statusCode: 200,
      message: `blog ${blogId} from our database`,
      data: blog
    };
  } else {
    const blog = await blogsModal_default.findById(blogId, returnFields);
    await client.disconnect();
    return {
      statusCode: 200,
      message: `blog ${blogId} from our database`,
      data: blog
    };
  }
};
var postOneBlogSevice = async (blog, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error("only admin can create a blog");
  }
  const { error, value } = await schema.validate(blog);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const createdBlog = new blogsModal_default({ ...value, author: req.user.id });
  await createdBlog.save();
  return {
    statusCode: 201,
    message: `created a blog ${createdBlog._id}  successfully`,
    data: createdBlog
  };
};
var updateOneBlogSevice = async (blogId, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error("only admin can update a blog");
  }
  const { title, body } = req.body;
  const { error, value } = updatingSchema.validate({ title, body });
  if (error)
    throw new Error(error.details[0].message);
  const updatedBlog = await blogsModal_default.updateOne({ _id: blogId }, value);
  return { message: "updated a blog successfully", data: updatedBlog };
};
var postCommentSevice = async (req) => {
  if (req.body.text.trim() === "")
    throw new Error("please provide content");
  const blog = await blogsModal_default.findById(req.params.blogId);
  blog.comments = [
    ...blog?.comments,
    {
      user: req.user.id,
      text: req.body.text
    }
  ];
  await blog.save();
  return { message: "updated a blog successfully", data: blog };
};
var likeBlogSevice = async (req) => {
  const res = await LikeModal.create({
    user: req.user.id,
    blog: req.params.blogId
  });
  return {
    statusCode: 200,
    message: `update (liked) a blog ${req.params.blogId}  successfully`,
    data: res
  };
};
var deleteOneBlogSevice = async (blogId, req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error("only admin can delete a blog");
  }
  const deletedMessage = await blogsModal_default.findByIdAndDelete(blogId);
  return { message: "deleted a blog successfully", data: deletedMessage };
};
var likeCommentService = async (req) => {
  const blog = await blogsModal_default.findById(req.params.blogId);
  const comment = blog.comments.find(({ _id }) => _id == req.params.commentId);
  if (comment.likes.includes(req.user.id)) {
    comment.likes.splice(comment.likes.indexOf(comment.likes), 1);
  } else {
    comment.likes = [...comment.likes, req.user.id];
  }
  await blog.save();
  return { message: "updated a blog successfully", data: blog };
};
var deleteCommentService = async (req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error("only admin can update a blog");
  }
  const blog = await blogsModal_default.findById(req.params.blogId);
  const comments = blog.comments.filter(
    ({ _id }) => _id != req.params.commentId
  );
  blog.comments = comments;
  await blog.save();
  return {
    statusCode: 200,
    message: "`deleted a comment successfully` => updated a blog by removing a comment",
    data: blog
  };
};

// src/controllers/blogController.js
var getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await getAllBlogsService(req);
    res.status(200).json(allBlogs);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      details: "please provide the correct query try reading documentation `http:localhost:3000/api/docs`",
      statusCode: 400
    });
  }
};
var getLikes = async (req, res) => {
  try {
    const Likes = await getLikesServive(req);
    res.json(Likes);
  } catch (error) {
    res.json({
      details: "try provide id of blog and try again",
      error: error.message,
      statusCode: 400
    });
  }
};
var getOneBlog = async (req, res) => {
  try {
    const blog = await getOneBlogSevice(req.params.blogId, req);
    res.status(200).json(blog);
  } catch (error) {
    res.json({
      details: "try provide id of blog and try again",
      error: error.message,
      statusCode: 400
    });
  }
};
var createOneBlog = async (req, res) => {
  try {
    const createdBlog = await postOneBlogSevice(req.body, req);
    res.status(201).json(createdBlog);
  } catch (error) {
    let statusCode = 400;
    if (error.message === "only admin can create a blog")
      statusCode = 401;
    res.status(statusCode).json({
      error: error.message,
      statusCode,
      datails: "please try fill all required fields read `http://localhost:3000/api/v1/docs`"
    });
  }
};
var postComment = async (req, res) => {
  try {
    const updatedBlog = await postCommentSevice(req);
    res.send(updatedBlog);
  } catch (error) {
    res.json({ error: error.message });
  }
};
var likeBlog = async (req, res) => {
  try {
    const updatedBlog = await likeBlogSevice(req);
    res.send(updatedBlog);
  } catch (error) {
    res.json({ error: error.message });
  }
};
var likeComment = async (req, res) => {
  try {
    const updatedBlog = await likeCommentService(req);
    res.send(updatedBlog);
  } catch (error) {
    res.json({ error: error.message });
  }
};
var updateOneBlog = async (req, res) => {
  try {
    const updatedBlog = await updateOneBlogSevice(req.params.blogId, req);
    res.send(updatedBlog);
  } catch (error) {
    let statusCode = 400;
    if (error.message === "only admin can update a blog")
      statusCode = 401;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
};
var deleteComment = async (req, res) => {
  try {
    const updatedBlog = await deleteCommentService(req);
    res.status(200).send(updatedBlog);
  } catch (error) {
    res.json({ error: error.message });
  }
};
var deleteOneBlog = async (req, res) => {
  try {
    const deletedMessage = await deleteOneBlogSevice(req.params.blogId, req);
    res.status(200).json(deletedMessage);
  } catch (error) {
    const err = {};
    if (error.message === "only admin can delete a blog") {
      err.details = "try login agin with admin (emal, password) or your JWT has expired";
      err.message = error.message;
      err.statusCode = 401;
    }
    res.json(err);
  }
};

// src/middlewares/authMiddleware.js
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// src/database/userModal.js
var import_mongoose4 = __toESM(require("mongoose"), 1);
var import_bcrypt = __toESM(require("bcrypt"), 1);
var Schema4 = import_mongoose4.default.Schema;
var UserSchema = new Schema4(
  {
    email: {
      type: String,
      required: [true, "email is required."],
      unique: true
    },
    userName: {
      type: String,
      required: [true, "userName is required."],
      unique: true
    },
    uid: { type: String, default: () => Math.random() },
    password: {
      type: String,
      required: [true, "password is required."],
      minLength: 6
    },
    avatar: String,
    phone: String,
    address: String
  },
  {
    timestamps: true
  }
);
UserSchema.pre("save", async function(next) {
  const salt = await import_bcrypt.default.genSalt();
  this.password = await import_bcrypt.default.hash(this.password, salt);
  next();
});
var User = import_mongoose4.default.model("Users", UserSchema);
var userModal_default = User;

// src/middlewares/authMiddleware.js
var secureRoute = async (req, res, next) => {
  let JWTtoken;
  const errorRes = {
    error: "not authorized",
    JWTtoken: req.headers.authorization,
    details: "JWT is expired  and not acceptable",
    statusCode: 403
  };
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      JWTtoken = req.headers.authorization.split(" ")[1];
      const decodedData = import_jsonwebtoken.default.verify(JWTtoken, process.env.MY_SUPER_SECRET);
      req.user = await userModal_default.findById(decodedData.id).select("-password");
      next();
      return;
    } catch (err) {
      res.status(403).json(errorRes);
      return;
    }
  }
  res.status(401).json({
    error: "not authorized",
    statusCode: 401,
    details: "try provide your JWT go to `http:localhost:3000/api/v1/auth/login` or create an account if you don't have one."
  });
};
var authMiddleware_default = secureRoute;

// src/v1/routes/blogs.js
var router = import_express.default.Router();
router.route("/").get(getAllBlogs).post(authMiddleware_default, createOneBlog);
router.route("/:blogId").get(getOneBlog).put(authMiddleware_default, updateOneBlog).delete(authMiddleware_default, deleteOneBlog);
router.get("/:blogId/likes", getLikes);
router.post("/:blogId/likes", authMiddleware_default, likeBlog);
router.post("/:blogId/comments", authMiddleware_default, postComment);
router.post("/:blogId/comments/:commentId/likes", authMiddleware_default, likeComment);
router.delete("/:blogId/comments/:commentId", authMiddleware_default, deleteComment);

// src/v1/routes/auth.js
var import_express2 = __toESM(require("express"), 1);
var import_passport = __toESM(require("passport"), 1);
var import_passport_facebook = __toESM(require("passport-facebook"), 1);

// src/services/userService.js
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var Redis2 = __toESM(require("redis"), 1);

// src/database/userSchema.js
var import_joi2 = __toESM(require("joi"), 1);
var schema2 = import_joi2.default.object({
  userName: import_joi2.default.string().alphanum().min(3).max(30).required(),
  email: import_joi2.default.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "yahoo", "co", "io"] }
  }),
  password: import_joi2.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  avatar: import_joi2.default.string().min(200),
  uid: import_joi2.default.string()
});
var updateSchema = import_joi2.default.object({
  phone: import_joi2.default.string().min(10).max(13),
  avatar: import_joi2.default.string().dataUri().min(200),
  address: import_joi2.default.string()
});

// src/services/userService.js
var client2 = Redis2.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});
client2.on("connect", () => {
  console.log("Connected to redis server!");
});
var createUserService = async (user) => {
  const { error, value } = schema2.validate(user);
  if (error)
    return error.details[0];
  const createdUser = new userModal_default(user);
  await createdUser.save();
  const { email, password } = user;
  const myUser = await userModal_default.findOne({ email });
  if (myUser && await import_bcrypt2.default.compare(password, myUser.password)) {
    return {
      statusCode: 201,
      message: "user account created successfully",
      data: {
        email,
        _id: user.id
      }
    };
  }
};
var getAllUsersService = async (req) => {
  await client2.connect();
  const data = await client2.get("users");
  if (data) {
    await client2.disconnect();
    return {
      statusCode: 200,
      message: "all users sent  successfully",
      data: JSON.parse(data)
    };
  } else {
    const users = await userModal_default.find({}, { password: 0, __v: 0 });
    await client2.set("users", JSON.stringify(users));
    await client2.disconnect();
    return {
      statusCode: 200,
      message: "all users sent  successfully",
      data: users
    };
  }
};
var getSingleUserService = async (req) => {
  try {
    await client2.connect();
    const data = await client2.get(req.params.userId);
    console.log("test", data);
    if (data) {
      await client2.disconnect();
      return {
        statusCode: 200,
        message: `user ${req.params.userId} sent  successfully`,
        data: JSON.parse(data)
      };
    } else {
      const user = await userModal_default.findById(req.params.userId, {
        password: 0,
        __v: 0
      });
      await client2.set(req.params.userId, JSON.stringify(user));
      await client2.disconnect();
      return {
        statusCode: 200,
        message: `user ${req.params.userId} sent  successfully`,
        data: user
      };
    }
  } catch (error) {
    console.log(error);
  }
};
var loginUserSevice = async (body) => {
  const { email, password } = body;
  const user = await userModal_default.findOne({ email });
  if (user && await import_bcrypt2.default.compare(password, user.password)) {
    return {
      statusCode: 200,
      message: "you are now authorized ",
      data: {
        email,
        _id: user.id,
        permision: [process.env.ADMIN_EMAIL === user.email && "admin"],
        token: await generateJWT(user.id)
      }
    };
  }
  throw new Error("account not found");
};
var generateJWT = async (id) => {
  await client2.connect();
  const data = await client2.get(`token ${id}`);
  if (data) {
    await client2.disconnect();
    return data;
  } else {
    const token = import_jsonwebtoken2.default.sign({ id }, process.env.MY_SUPER_SECRET, {
      expiresIn: "5d"
    });
    await client2.setEx(`token ${id}`, 5 * 24 * 60 * 60, token);
    await client2.disconnect();
    return token;
  }
};
var deleteUsersService = async (req) => {
  if (process.env.ADMIN_EMAIL !== req.user.email) {
    throw new Error("only admin can delete a user");
  }
  const user = await userModal_default.deleteOne({ _id: req.params.userId });
  return user;
};
var updateUsersService = async (req) => {
  if (req.params.userId !== req.user.id) {
    throw new Error("only owner can update his/her profile");
  }
  const user = await userModal_default.findById(req.params.userId);
  const { value, error } = updateSchema.validate(req.body);
  if (error) {
    throw new Error(error.message);
  }
  for (const val in value) {
    user[val] = value[val];
  }
  await user.save();
  return user;
};

// src/controllers/authController.js
var createUser = async (req, res) => {
  try {
    const createdUser = await createUserService(req.body);
    res.status(201).json(createdUser);
  } catch (error) {
    let status = 401;
    if (error.message.includes("duplicate key error collection")) {
      status = 406;
    }
    const err = {
      msg: "Email or Username are being used by another account",
      details: error.message,
      statusCode: status
    };
    res.status(status).json(err);
  }
};
var loginUser = async (req, res) => {
  try {
    const user = await loginUserSevice(req.body);
    res.json(user);
  } catch (error) {
    res.status(401).json({
      details: "Credentials doesn't match any account",
      error: error.message,
      statusCode: 401
    });
  }
};
var getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService(req);
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json({
      msg: "users not found",
      error: error.message
    });
  }
};
var getSingleUser = async (req, res) => {
  try {
    const user = await getSingleUserService(req);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({
      msg: "users not found",
      error: error.message
    });
  }
};
var deteUser = async (req, res) => {
  try {
    const user = await deleteUsersService(req);
    res.status(200).json({
      statusCode: 200,
      message: "users delete successfully",
      data: user
    });
  } catch (error) {
    res.status(401).json({
      message: "user not found",
      error: error.message
    });
  }
};
var updateUser = async (req, res) => {
  try {
    const user = await updateUsersService(req);
    res.status(200).json({
      statusCode: 200,
      message: "user updated successfully",
      data: user
    });
  } catch (error) {
    res.status(401).json({
      message: "user not found, request failed please try read `http://localhost:3000/api/v1/docs for more info`",
      error: error.message,
      statusCode: 400
    });
  }
};

// src/v1/routes/auth.js
var import_dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
  (0, import_dotenv.config)();
}
var router2 = import_express2.default.Router();
router2.route("/signup").post(createUser);
router2.route("/login").post(loginUser);
router2.get("/profile", authMiddleware_default, (req, res) => {
  res.json({ data: req.user, message: `user ${req.user.id} sent successfully`, statusCode: 200 });
});
router2.route("/users").get(authMiddleware_default, getAllUsers);
router2.route("/users/:userId").delete(authMiddleware_default, deteUser).put(authMiddleware_default, updateUser).get(authMiddleware_default, getSingleUser);

// src/index.js
var RedisStore = (0, import_connect_redis.default)(import_express_session.default);
var app = import_express3.default.Router();
if (process.env.NODE_ENV !== "production") {
  (0, import_dotenv2.config)();
}
var corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
};
app.use((0, import_cors.default)(corsOptions));
var redisClient = Redis3.createClient({ legacyMode: true });
app.use(
  (0, import_express_session.default)({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.MY_SUPER_SECRET,
    resave: false
  })
);
app.use(
  (0, import_express_session.default)({
    secret: process.env.MY_SUPER_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);
app.use(import_express3.default.json());
app.use(import_express3.default.static("public"));
import_mongoose5.default.set("strictQuery", true);
import_mongoose5.default.connect(process.env.DB_URL, {
  useNewUrlParser: true
}).then(() => console.log("connected to db"));
app.use("/api/v1/blogs", router);
app.use("/api/v1/auth", router2);
var src_default = app;

// src/utils/swagger.js
var import_swagger_jsdoc = __toESM(require("swagger-jsdoc"), 1);
var import_swagger_ui_express = __toESM(require("swagger-ui-express"), 1);
var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "blog api",
      version: "1.0.0"
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        jwt: []
      }
    ],
    swagger: "3.0"
  },
  apis: ["./src/controllers/*.js", "./src/database/*.js"]
};
var swaggerSpec = (0, import_swagger_jsdoc.default)(options);
function swagger(app2, port) {
  app2.use("/api/v1/docs", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(swaggerSpec));
  app2.use((req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: "route not found",
      message: "route not available",
      detail: "check for another route or try again"
    });
  });
}

// main.js
var server = (0, import_express4.default)();
server.use(src_default);
var PORT = process.env.port || 3e3;
server.listen(PORT, () => {
  swagger(server, PORT);
  console.log(`server started listening on port ${PORT}`);
});
var main_default = server;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
