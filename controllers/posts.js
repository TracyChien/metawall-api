const Post = require("../models/postsModel");
const Comment = require("../models/commentsModel");
// const User = require("../models/usersModel");
const handleErrorAsync = require("../service/handleErrorAsync");
// const handleError = require("../service/handleError");
const appError = require("../service/appError");
const validator = require("validator");
const mongoose = require("mongoose");

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
      .populate({
        path: "comments",
        select: "comment user",
      })
      .populate({
        path: "likes",
        select: "name",
      })
      .sort(timeSort);
    res.status(200).json({
      status: "success",
      data: posts,
    });
  },
  getPostById: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return next(appError(400, "無效id", next));
    }
    const post = await Post.findById(id)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "comment user",
      })
      .populate({
        path: "likes",
        select: "name",
      });
    if (post !== null) {
      res.status(200).json({
        status: "success",
        data: post,
      });
    } else {
      return next(appError(400, "查無此id", next));
    }
  }),
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
    const user = req.user.id; //form isAuth(token)
    const id = req.params.id;
    const { content, image } = req.body;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return next(appError(400, "無效id", next));
    }
    if (!content || validator.isEmpty(content)) {
      return next(appError(400, "你沒有填寫 content 資料", next));
    }
    // check post exist
    const curPost = await Post.findById(id)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "comment user",
      });
    if (curPost === null) {
      return next(appError(400, "查無此id", next));
    }
    // check post create user id = update user id
    const curCommentUserId = curPost.user.id;
    console.log(curPost);
    if (curCommentUserId !== user) {
      return next(appError(400, "無編輯權限", next));
    }
    const newPost = await Post.findByIdAndUpdate(
      id,
      {
        content: content,
        image: image,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: newPost,
    });
  }),
  deletedPostById: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const id = req.params.id;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return next(appError(400, "無效id", next));
    }
    // check post exist
    const curPost = await Post.findById(id)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "comment user",
      });
    if (curPost === null) {
      return next(appError(400, "查無此id", next));
    }
    // check post create user id = update user id
    const curCommentUserId = curPost.user;
    if (curCommentUserId !== user) {
      return next(appError(400, "無刪除權限", next));
    }

    const delPost = await Post.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: delPost,
    });
  }),
  clearPosts: async (req, res, next) => {
    await Post.deleteMany({});
    res.status(200).json({
      status: "success",
      data: [],
    });
  },
  addLike: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = req.user.id; //form isAuth(token)

    if (!mongoose.isObjectIdOrHexString(id)) {
      return next(appError(400, "無效id", next));
    }
    const newPost = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: user },
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
  removeLike: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = req.user.id; //form isAuth(token)

    if (!mongoose.isObjectIdOrHexString(id)) {
      return next(appError(400, "無效id", next));
    }
    const newPost = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { likes: user },
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
  getPostsByUserId: handleErrorAsync(async (req, res, next) => {
    const userId = req.params.id;
    if (!mongoose.isObjectIdOrHexString(userId)) {
      return next(appError(400, "無效id", next));
    }

    const posts = await Post.find({ user: userId }).populate({
      path: "comments",
      select: "comment user",
    });

    res.status(200).json({
      status: "success",
      results: posts.length,
      posts,
    });
  }),
  addComment: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id; //form isAuth(token)
    const post = req.params.id;
    const { comment } = req.body;

    if (!mongoose.isObjectIdOrHexString(post)) {
      return next(appError(400, "無效id", next));
    }

    if (!comment || validator.isEmpty(comment)) {
      return next(appError(400, "你沒有填寫 comment 資料", next));
    }

    const newComment = await Comment.create({
      post,
      user,
      comment,
    });
    res.status(201).json({
      status: "success",
      data: {
        comments: newComment,
      },
    });
  }),
  updateComment: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id; //form isAuth(token)
    const commentId = req.params.id;
    const { comment } = req.body;

    if (!mongoose.isObjectIdOrHexString(commentId)) {
      return next(appError(400, "無效id", next));
    }
    if (!comment || validator.isEmpty(comment)) {
      return next(appError(400, "你沒有填寫 comment 資料", next));
    }
    // check comment exist
    const curComment = await Comment.findById(commentId);
    if (curComment === null) {
      return next(appError(400, "查無此id", next));
    }
    // check comment create user id === update user id
    const curCommentUserId = curComment.user.id;
    if (curCommentUserId !== user) {
      return next(appError(400, "無編輯權限", next));
    }
    const newComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        comment,
      },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        comments: newComment,
      },
    });
  }),
};

module.exports = posts;
