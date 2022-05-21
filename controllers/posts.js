const Post = require("../models/postsModel");
// const User = require("../models/usersModel");
const handleErrorAsync = require("../service/handleErrorAsync");
// const handleError = require("../service/handleError");
const appError = require("../service/appError");
const validator = require("validator");
const ObjectId = require("mongoose").Types.ObjectId;

const posts = {
  getPosts: async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const posts = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    res.status(200).json({
      status: "success",
      data: posts,
    });
  },
  getPostById: async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return next(appError(400, "查無此id", next));
    }
    const post = await Post.findById(id).populate({
      path: "user",
      select: "name photo",
    });
    if (post !== null) {
      res.status(200).json({
        status: "success",
        data: post,
      });
    } else {
      return next(appError(400, "查無此id", next));
    }
  },
  createdPost: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id; //form isAuth(token)
    const { content, image } = req.body;

    if (!content || validator.isEmpty(content)) {
      return next(appError(400, "你沒有填寫 content 資料", next));
    }
    const newPost = await Post.create({
      user: user,
      content: content,
      image: image,
    });
    res.status(200).json({
      status: "success",
      data: newPost,
    });
  }),
  updatedPost: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const { content, image } = req.body;

    if (!ObjectId.isValid(id)) {
      return next(appError(400, "查無此id", next));
    }

    if (!content || validator.isEmpty(content)) {
      return next(appError(400, "你沒有填寫 content 資料", next));
    }
    const newPost = await Post.findByIdAndUpdate(
      id,
      {
        content: content,
        image: image,
      },
      { new: true }
    );
    if (newPost !== null) {
      res.status(200).json({
        status: "success",
        data: newPost,
      });
    } else {
      return next(appError(400, "查無此id", next));
    }
  }),
  deletedPostById: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return next(appError(400, "查無此id", next));
    }
    const delPost = await Post.findByIdAndDelete(id);
    if (delPost !== null) {
      res.status(200).json({
        status: "success",
        data: delPost,
      });
    } else {
      return next(appError(400, "查無此id", next));
    }
  }),
  clearPosts: async (req, res, next) => {
    await Post.deleteMany({});
    res.status(200).json({
      status: "success",
      data: [],
    });
  },
};

module.exports = posts;
