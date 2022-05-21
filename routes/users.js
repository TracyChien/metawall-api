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
router.post("/updatePassword", isAuth, async function (req, res, next) {
  UserController.updatePassword(req, res, next);
});
router.patch("/profile", isAuth, async function (req, res, next) {
  UserController.updateProfile(req, res, next);
});
router.get("/check", isAuth, async function (req, res, next) {
  UserController.check(req, res, next);
});

module.exports = router;
