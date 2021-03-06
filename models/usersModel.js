const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "請輸入您的名字"],
  },
  email: {
    type: String,
    required: [true, "請輸入您的 Email"],
    unique: true,
    lowercase: true,
    select: false,
  },
  photo: String,
  sex: {
    type: String,
    enum: ["male", "female"],
  },
  password: {
    type: String,
    required: [true, "請輸入密碼"],
    minlength: 8,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  followers: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "user" },
      createdAt: {
        type: Date,
        default: Date.now,
        select: false,
      },
    },
  ],
  following: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "user" },
      createdAt: {
        type: Date,
        default: Date.now,
        select: false,
      },
    },
  ],
  premiumMember: {
    //0 = false, 1=true
    paid: { type: Number, enum: [0, 1], default: 0 },
    pay: { type: mongoose.Schema.ObjectId, ref: "pay" },
    startAt: {
      type: Date,
    },
  },
  thirdParty: {
    googleID: {
      type: String,
      default: "0",
    },
    facebookID: {
      type: String,
      default: "0",
    },
  },
});
// User
const User = mongoose.model("user", userSchema);

module.exports = User;
