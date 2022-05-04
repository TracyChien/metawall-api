const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const handleError = require("../service/handleError");

const posts = {
  async getPosts(req, res) {
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
  async createdPost(req, res) {
    try {
      const data = req.body;
      const newPost = await Post.create({
        user: data.user,
        content: data.content,
      });
      res.status(200).json({
        status: "success",
        data: newPost,
      });
    } catch (error) {
      handleError(res, error);
    }
  },
  async updatedPost(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
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
        handleError(res, "");
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async deletedPost(req, res) {
    try {
      const id = req.params.id;
      const delPost = await Post.findByIdAndDelete(id);
      if (delPost !== null) {
        res.status(200).json({
          status: "success",
          data: delPost,
        });
      } else {
        handleError(res, "");
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async clearPosts(req, res) {
    await Post.deleteMany({});
    res.status(200).json({
      status: "success",
      data: [],
    });
  },
};

module.exports = posts;
