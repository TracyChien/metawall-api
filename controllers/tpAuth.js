// const User = require("../models/usersModel");

const { generateRedirectJWT } = require("../service/auth");
const findOrCreateUser = require("../helps/findOrCreateUser");
const handleErrorAsync = require("../service/handleErrorAsync");

const auth = {
  googleCallback: handleErrorAsync(async (req, res) => {
    const user = await findOrCreateUser("google", req.user._json);
    // res.status(200).json(user);
    generateRedirectJWT(user, res);
  }),
  facebookCallback: handleErrorAsync(async (req, res) => {
    const user = await findOrCreateUser("facebook", req.user._json);
    // res.status(200).json(user);
    generateRedirectJWT(user, res);
  }),
};
module.exports = auth;
