const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 16,
  },

  email: {
    type: String,
    trim: true, // email의 공백을 제거해줌
  },

  password: String,

  manager: {
    type: Boolean,
    default: false,
  },

  socialLogin: {
    type: Boolean,
    default: false,
  },

  image: String,

  token: String, // 토큰

  tokenExp: Number, // 토큰 유효기간
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
