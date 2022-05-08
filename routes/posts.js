var express = require("express");
var router = express.Router();

const handleErrorAsync = require("../service/handleErrorAsync");
const PostsController = require("../controllers/posts");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  PostsController.getPosts(req, res, next);
});
router.post(
  "/",
  handleErrorAsync(async function (req, res, next) {
    PostsController.createdPost(req, res, next);
  })
);
router.patch(
  "/:id",
  handleErrorAsync(async function (req, res, next) {
    PostsController.updatedPost(req, res, next);
  })
);
router.delete("/", async function (req, res, next) {
  PostsController.clearPosts(req, res, next);
});
router.delete(
  "/:id",
  handleErrorAsync(async function (req, res, next) {
    PostsController.deletedPost(req, res, next);
  })
);

module.exports = router;
