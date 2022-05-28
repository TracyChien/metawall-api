var express = require("express");
var router = express.Router();
const { isAuth } = require("../service/auth");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const upload = require("../service/image");
const sizeOf = require("image-size");
const { ImgurClient } = require("imgur");

router.post(
  "/",
  isAuth,
  upload,
  handleErrorAsync(async (req, res, next) => {
    if (!req.files || !req.files.length) {
      return next(appError(400, "尚未上傳檔案", next));
    }
    const dimensions = sizeOf(req.files[0].buffer);
    // if (dimensions.width !== dimensions.height) {
    //   return next(appError(400, "圖片長寬不符合 1:1 尺寸。", next));
    // }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const response = await client.upload({
      image: req.files[0].buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });

    res.status(200).json({
      status: "success",
      imgUrl: response.data.link,
    });
  })
);

module.exports = router;
