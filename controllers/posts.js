const Post = require("../models/postsModel");
// const User = require("../models/usersModel");
const handleErrorAsync = require("../service/handleErrorAsync");
// const handleError = require("../service/handleError");
const appError = require("../service/appError");

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
  createdPost: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const { content, image } = req.body;
    if (content == undefined) {
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
    const data = req.body;
    if (data.content == undefined) {
      return next(appError(400, "你沒有填寫 content 資料", next));
    }
    const newPost = await Post.findByIdAndUpdate(
      id,
      {
        name: data.name,
        content: data.content,
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
