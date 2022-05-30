var express = require("express");
var router = express.Router();
const { isAuth } = require("../service/auth");

const UserController = require("../controllers/users");

router.post("/sign_up", async function (req, res, next) {
  UserController.singUp(req, res, next);
});
router.post("/sign_in", async function (req, res, next) {
  UserController.singIn(req, res, next);
});
router.get("/profile", isAuth, async function (req, res, next) {
  UserController.getProfile(req, res, next);
});
router.patch("/updatePassword", isAuth, async function (req, res, next) {
  UserController.updatePassword(req, res, next);
});
router.patch("/profile", isAuth, async function (req, res, next) {
  UserController.updateProfile(req, res, next);
});
router.get("/check", isAuth, async function (req, res, next) {
  UserController.check(req, res, next);
});
router.get("/getLikeList", isAuth, async function (req, res, next) {
  UserController.getLikeList(req, res, next);
});
router.post("/:id/follow", isAuth, async function (req, res, next) {
  UserController.follow(req, res, next);
});
router.delete("/:id/unfollow", isAuth, async function (req, res, next) {
  UserController.unFollow(req, res, next);
});
router.get("/following", isAuth, async function (req, res, next) {
  UserController.getFollowing(req, res, next);
});
router.get("/followers", isAuth, async function (req, res, next) {
  UserController.getFollowers(req, res, next);
});
router.get("/getTradeList", isAuth, async function (req, res, next) {
  UserController.getTradeList(req, res, next);
});
router.get("/checkPay", isAuth, async function (req, res, next) {
  UserController.checkPay(req, res, next);
});

module.exports = router;
