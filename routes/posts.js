var express = require("express");
var router = express.Router();

const { isAuth } = require("../service/auth");
const PostsController = require("../controllers/posts");

/* GET users listing. */
router.get("/", isAuth, async function (req, res, next) {
  PostsController.getPosts(req, res, next);
});
router.get("/:id", isAuth, async function (req, res, next) {
  PostsController.getPostById(req, res, next);
});
router.post("/", isAuth, async function (req, res, next) {
  PostsController.createdPost(req, res, next);
});
router.patch("/:id", isAuth, async function (req, res, next) {
  PostsController.updatedPost(req, res, next);
});
router.delete("/", isAuth, async function (req, res, next) {
  PostsController.clearPosts(req, res, next);
});
router.delete("/:id", isAuth, async function (req, res, next) {
  PostsController.deletedPostById(req, res, next);
});

module.exports = router;
