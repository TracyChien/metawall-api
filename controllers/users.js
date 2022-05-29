const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const { generateSendJWT } = require("../service/auth");

const users = {
  singUp: handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;
    const errorMsgArr = [];
    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return next(appError("400", "欄位未填寫正確！", next));
    }
    // 密碼正確
    if (password !== confirmPassword) {
      errorMsgArr.push("密碼不一致！");
    }
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      errorMsgArr.push("密碼字數低於 8 碼");
    }
    // 密碼 12 碼以下
    if (!validator.isLength(password, { max: 12 })) {
      errorMsgArr.push("密碼字數小於 12 碼");
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      errorMsgArr.push("Email 格式不正確");
    }
    const hasUser = await User.findOne({ email: email });
    if (hasUser) {
      errorMsgArr.push("Email帳號已被註冊，請替換新的 Email！");
    }
    // 回饋錯誤給使用者
    if (errorMsgArr.length > 0) {
      const errString = errorMsgArr.join();
      return next(appError("400", errString, next));
    }

    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name,
    });
    generateSendJWT(newUser, 201, res);
  }),
  singIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, "帳號密碼不可以為空", next));
    }

    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return next(appError(400, "您的登入資料不正確", next));
    }
    const auth = await bcrypt.compare(password, user?.password);

    if (!auth || !user) {
      return next(appError(400, "您的登入資料不正確", next));
    }
    generateSendJWT(user, 201, res);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return next(appError(400, "欄位未填寫正確！", next));
    }
    if (password !== confirmPassword) {
      return next(appError(400, "密碼不一致！", next));
    }
    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: newPassword,
      },
      { new: true }
    );
    generateSendJWT(user, 200, res);
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
    res.status(200).json({
      status: "success",
      user: req.user,
    });
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { name, photo, sex } = req.body;
    if (!name) {
      return next(appError(400, "欄位未填寫正確！", next));
    }
    if (sex && !validator.isIn(sex, ["male", "female"])) {
      return next(appError(400, "欄位值錯誤！", next));
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name,
        photo: photo || "",
        sex: sex,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      user: {
        name: user.name,
      },
    });
  }),
  check: handleErrorAsync(async (req, res, next) => {
    res.status(200).json({
      status: "success",
      user: {
        id: req.user.id,
        name: req.user.name,
        photo: req.user.photo,
      },
    });
  }),
  getLikeList: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const likeList = await Post.find({
      likes: { $in: [user] },
    })
      .populate({
        path: "user",
        select: "name _id",
      })
      .populate({
        path: "likes",
        select: "name",
      });
    res.status(200).json({
      status: "success",
      likeList,
    });
  }),
  follow: handleErrorAsync(async (req, res, next) => {
    const TokenUserId = req.user.id; //from token
    const userId = req.params.id;

    if (!mongoose.isObjectIdOrHexString(userId)) {
      return next(appError(400, "無效id", next));
    }

    if (TokenUserId === userId) {
      return next(appError(401, "您無法追蹤自己", next));
    }
    await User.updateOne(
      {
        _id: TokenUserId,
        "following.user": { $ne: userId },
      },
      {
        $addToSet: { following: { user: userId } },
      }
    );
    await User.updateOne(
      {
        _id: userId,
        "followers.user": { $ne: TokenUserId },
      },
      {
        $addToSet: { followers: { user: TokenUserId } },
      }
    );
    res.status(200).json({
      status: "success",
      message: "您已成功追蹤！",
    });
  }),
  unFollow: handleErrorAsync(async (req, res, next) => {
    const TokenUserId = req.user.id; //from token
    const userId = req.params.id;

    if (!mongoose.isObjectIdOrHexString(userId)) {
      return next(appError(400, "無效id", next));
    }

    if (TokenUserId === userId) {
      return next(appError(401, "您無法取消追蹤自己", next));
    }

    await User.updateOne(
      {
        _id: TokenUserId,
      },
      {
        $pull: { following: { user: userId } },
      }
    );
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: { followers: { user: TokenUserId } },
      }
    );
    res.status(200).json({
      status: "success",
      message: "您已成功取消追蹤！",
    });
  }),
  getFollowing: handleErrorAsync(async (req, res, next) => {
    const TokenUserId = req.user.id; //from token
    const response = await User.findById(TokenUserId).populate({
      path: "following.user",
      select: "name",
    });
    res.status(200).json({
      status: "success",
      following: response.following,
    });
  }),
  getFollowers: handleErrorAsync(async (req, res, next) => {
    const TokenUserId = req.user.id; //from token
    const response = await User.findById(TokenUserId).populate({
      path: "followers.user",
      select: "name",
    });
    res.status(200).json({
      status: "success",
      followers: response.followers,
    });
  }),
};

module.exports = users;
