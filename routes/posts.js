var express = require("express");
var router = express.Router();

const { isAuth } = require("../service/auth");
const PostsController = require("../controllers/posts");

/* GET users listing. */
router.get("/", isAuth, PostsController.getPosts);
router.get("/:id", isAuth, PostsController.getPostById);
router.post("/", isAuth, PostsController.createdPost);
router.patch("/:id", isAuth, PostsController.updatedPost);
router.delete("/", isAuth, PostsController.clearPosts);
router.delete("/:id", isAuth, PostsController.deletedPostById);
// likes
router.post("/:id/likes", isAuth, PostsController.addLike);
router.delete("/:id/unlikes", isAuth, PostsController.removeLike);
// user
router.get("/user/:id", isAuth, PostsController.getPostsByUserId);
// comment
router.post("/:id/comment", isAuth, PostsController.addComment);
router.patch("/comment/:id", isAuth, PostsController.updateComment);

module.exports = router;
