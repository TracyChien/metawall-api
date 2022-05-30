var express = require("express");
var router = express.Router();
const { isAuth } = require("../service/auth");

const PayController = require("../controllers/pay");

router.get("/", isAuth, async function (req, res, next) {
  PayController.createPay(req, res, next);
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
