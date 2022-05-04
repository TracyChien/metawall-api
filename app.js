var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("./connections");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).send("抱歉，您的頁面找不到");
});
app.use((err, req, res) => {
  console.err(err.stack);
  res.status(500).send("程式有些問題，請稍候嘗試");
});

module.exports = app;
