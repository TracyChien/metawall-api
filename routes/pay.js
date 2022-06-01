var express = require("express");
var router = express.Router();
const { isAuth } = require("../service/auth");

const PayController = require("../controllers/pay");

router.get("/", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['pay (綠界)'],
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          <p>產生訂單並要求付款</p>
          參數用法：
          <ul>
            <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
          </ul>
        `,
    */
  PayController.createPay(req, res, next);
  /*
      * #swagger.responses[200] = {
        description: `
          取得form data
        `,
          schema:"1"
      }
      */
});

router.post("/tradeConfirm", async function (req, res, next) {
  PayController.tradeConfirm(req, res, next);
});

router.get("/tradeResult/:id", isAuth, async function (req, res, next) {
  PayController.getTradeResult(req, res, next);
});

// router.get("/tradeList/:id", isAuth, async function (req, res, next) {
//   PayController.getTradeListByUserId(req, res, next);
// });

module.exports = router;
