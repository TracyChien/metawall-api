const handleErrorAsync = require("./handleErrorAsync");
const jwt = require("jsonwebtoken");
const appError = require("./appError");

const User = require("../models/usersModel");

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  //   jwt.verify(token, secretOrPublicKey, [options, callback])
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    user: {
      token,
      name: user.name,
    },
  });
};

const generateRedirectJWT = (user, res) => {
  // 產生 JWT token
  //   jwt.verify(token, secretOrPublicKey, [options, callback])
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.redirect(`${process.env.FRONTEND_URL}?t=${token}`);
};

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(appError(401, "您尚未登入!", next));
  }
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;
  next();
});

module.exports = {
  isAuth,
  generateSendJWT,
  generateRedirectJWT,
};
