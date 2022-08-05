const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    // firstName: {
    //   type: String,
    //   required: true,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    // },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    userRole: {
      type: String,
      enum: ["admin", "tutor", "student", "not assigned"],
      default: "not assigned",
    },
    // isTutor: {
    //   type: Boolean,
    //   default: 0,
    // },
    // isAdmin: {
    //   type: Boolean,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
