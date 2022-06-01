const bcrypt = require("bcryptjs");

const User = require("../models/usersModel");
const randomId = require("../service/randomId");
const { generateSendJWT } = require("../service/auth");
const handleErrorAsync = require("../service/handleErrorAsync");

const auth = {
  googleCallback: handleErrorAsync(async (req, res) => {
    const { name, sub, email } = req.user._json;

    const hasUser = await User.findOne({ email: email });
    if (hasUser) {
      return generateSendJWT(hasUser, 201, res);
    }
    // 加密密碼
    password = await bcrypt.hash(randomId(8), 12);
    const newUser = await User.create({
      email,
      password,
      name,
      googleID: sub,
    });
    generateSendJWT(newUser, 201, res);
  }),
};
module.exports = auth;
