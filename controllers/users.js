const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
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
      errorMsgArr.push("欄位未填寫正確！");
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
};

module.exports = users;