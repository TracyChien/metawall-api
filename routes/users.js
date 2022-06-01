var express = require("express");
var router = express.Router();
const { isAuth } = require("../service/auth");

const UserController = require("../controllers/users");

router.post("/sign_up", async function (req, res, next) {
  /*
      #swagger.tags = ['會員功能'],
      #swagger.summary = '使用者註冊'
      #swagger.description = `
          參數用法：
         <ul>
          <li>欄位 <code>"password"</code> 長度8-12</li>
          <li>欄位 <code>"gender"</code> 只能接受 <code>"male"</code>、<code>"female"</code>、<code>""</code>。</li>
        </ul>
        `,
      * #swagger.parameters['body'] = {
        in: "body",
        type: "object",
        required: "success",
        description: ``,
        schema:{
          "$email":"tt@gmail.com",
          "$password":"tttttttt",
          "$confirmPassword":"tttttttt",
          "$name":"TT"
        }
      },
      * #swagger.responses[201] = {
        description: '登入資訊',
        schema: {
          "status": "success",
          "user": {
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTcwNGRjYWE3M2YwMmRiZTFkNThhZSIsImlhdCI6MTY1NDA2NDM0OCwiZXhwIjoxNjU0NjY5MTQ4fQ.xm23pCNkQb9X_U1kRUOW11nLV1EN31D211OeGKeKhUs",
              "name": "TT"
          }
      }
      },
    */
  UserController.singUp(req, res, next);
});
router.post("/sign_in", async function (req, res, next) {
  /*
      #swagger.tags = ['會員功能'],
      #swagger.summary = '使用者登入'
      #swagger.description = `
          參數用法：
         <ul>
          <li>登入以 mail 為帳號</li>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.parameters['body'] = {
        in: "body",
        type: "object",
        required: "success",
        description: ``,
        schema: {
          "$email": "tt@gmail.com",
          "$password": "wwwwwwww"
        }
      },
      * #swagger.responses[201] = {
        description: '登入資訊',
        schema: {
          status: 'success',
          data: {
            "token": "Token",
            "name": "王小明",
          }
        }
      },
    */
  UserController.singIn(req, res, next);
});
router.get("/profile", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員功能'],
      #swagger.summary = '取得個人資料'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '個人資訊',
        schema: {
            "status": "success",
            "user": {
                "premiumMember": {
                    "paid": 0
                },
                "_id": "629704dcaa73f02dbe1d58ae",
                "name": "TT",
                "followers": [],
                "following": [],
                "__v": 0
            }
        }
      },
    */
  UserController.getProfile(req, res, next);
});
router.patch("/updatePassword", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員功能'],
      #swagger.summary = '重設密碼'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.parameters['body'] = {
        in: "body",
        type: "object",
        required: "success",
        description: ``,
        schema: {
            "$password":"wwwwwwww",
            "$confirmPassword":"wwwwwwww"
        }
      },
      * #swagger.responses[200] = {
        description: '密碼變更',
        schema: {
            "status": "success",
            "user": {
                "token": "token",
                "name": "TT"
            }
        }
      },
    */
  UserController.updatePassword(req, res, next);
});
router.patch("/profile", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員功能'],
      #swagger.summary = '更新個人資料'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.parameters['body'] = {
        in: "body",
        type: "object",
        required: "success",
        description: ``,
        schema: {
            "$name":"qq",
            "sex":"female",
            "photo":"http://url"
        }
      },
      * #swagger.responses[200] = {
        description: '更新個人資料',
        schema: {
            "status": "success",
            "user": {
                "name": "TT"
            }
        }
      },
    */
  UserController.updateProfile(req, res, next);
});
router.get("/check", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員功能'],
      #swagger.summary = '確認登入狀態'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '更新個人資料',
        schema: {
            "status": "success",
            "user": {
                "id":"mongoDB id",
                "name": "TT",
                "photo":"link",
            }
        }
      },
    */
  UserController.check(req, res, next);
});
router.get("/getLikeList", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員按讚追踨'],
      #swagger.summary = '取得個人按讚列表'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '更新個人資料',
        schema: {
            "status": "success",
            "likeList": [
                {
                    "_id": "629385506e8e3e5187847dea",
                    "content": "測試05288",
                    "image": "",
                    "user": {
                        "_id": "6291f79b4e58b922713c7ef9",
                        "name": "fgh"
                    },
                    "likes": [
                        {
                            "_id": "6291f79b4e58b922713c7ef9",
                            "name": "fgh"
                        },
                        {
                            "_id": "62938dc4bf176a01c76fc8b0",
                            "name": "qq"
                        },
                        {
                            "_id": "629704dcaa73f02dbe1d58ae",
                            "name": "TT"
                        }
                    ],
                    "id": "629385506e8e3e5187847dea"
                }
            ]
        }
      },
    */
  UserController.getLikeList(req, res, next);
});
router.post("/:id/follow", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員按讚追踨'],
      #swagger.summary = '追蹤朋友'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      * #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: "User ID",
      },
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
           <li>網址路由以 <code>:id</code> 傳入參數，直接針對 Users 中的 document id 進行資料更新。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '追蹤朋友',
        schema: {
            "status": "success",
            "message": "您已成功追蹤！"
        }
      },
    */
  UserController.follow(req, res, next);
});
router.delete("/:id/unfollow", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員按讚追踨'],
      #swagger.summary = '取消追蹤朋友'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      * #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: "User ID",
      },
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
           <li>網址路由以 <code>:id</code> 傳入參數，直接針對 Users 中的 document id 進行資料更新。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '取消追蹤朋友',
        schema: {
            "status": "success",
            "message": "您已成功取消追蹤！"
        }
      },
    */
  UserController.unFollow(req, res, next);
});
router.get("/following", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員按讚追踨'],
      #swagger.summary = '取得個人追蹤名單'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '取得個人追蹤名單',
        schema:{
            "status": "success",
            "following": [
                {
                    "user": {
                        "_id": "mongoDB id",
                        "name": "abc1234"
                    },
                    "_id": "mongoDB id"
                }
            ]
        }
      },
    */
  UserController.getFollowing(req, res, next);
});
router.get("/followers", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員按讚追踨'],
      #swagger.summary = '取得個人粉絲名單'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '取得個人粉絲名單',
        schema:{
            "status": "success",
            "followers": [
                {
                    "user": {
                        "_id": "mongoDB id",
                        "name": "abc1234"
                    },
                    "_id": "mongoDB id"
                }
            ]
        }
      },
    */
  UserController.getFollowers(req, res, next);
});
router.get("/getTradeList", isAuth, async function (req, res, next) {
  /*
      #swagger.tags = ['會員功能'],
      #swagger.summary = '取得個人付款紀錄'
      #swagger.security = [{
        'apiKeyAuth': []
      }],
      #swagger.description = `
          參數用法：
         <ul>
          <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
        </ul>
        `,
      * #swagger.responses[200] = {
        description: '取得個人付款紀錄',
        schema:{
            "status": "success",
            "results": 1,
            "list": [
                {
                    "_id": "mongoDB id",
                    "tradeNo": "MWWxxxxxxxxxx",
                    "tradeType": "creditonetime",
                    "totalAmount": 1000,
                    "tradeDesc": "會員費用",
                    "itemName": "會員費用",
                    "tradeStatus": 2,
                    "user": {
                        "_id": "mongoDB id",
                        "name": "TT"
                    }
                }
            ]
        }
      },
    */
  UserController.getTradeList(req, res, next);
});
// router.get("/checkPay", isAuth, async function (req, res, next) {
//   UserController.checkPay(req, res, next);
// });

module.exports = router;
