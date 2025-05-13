const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      uniqe: true,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Users", userSchema);
