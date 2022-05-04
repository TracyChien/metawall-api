var express = require("express");
var router = express.Router();

const PostsController = require("../controllers/posts");

/* GET users listing. */
router.get("/", function (req, res, next) {
  PostsController.getPosts(req, res);
});
router.post("/", function (req, res, next) {
  PostsController.createdPost(req, res);
});
router.patch("/:id", async function (req, res, next) {
  PostsController.updatedPost(req, res);
});
router.delete("/", async function (req, res, next) {
  PostsController.clearPosts(req, res);
});
router.delete("/:id", async function (req, res, next) {
  PostsController.deletedPost(req, res);
});

module.exports = router;
