const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const async = require("async");
require("dotenv").config();
const { SECRET } = process.env;

// register user controllers function
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  //check for possible password / email errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: "400", errors: errors.array() });
  }
  try {
    const { firstName, lastName, userRole, email, password } = req.body;

    // check if email is already taken
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "email is already taken" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      userRole,
      password,
    });

    if (!user) {
      return res
        .status(400)
        .json({ statusCode: 400, errror: "something went wrong" });
    }

    res.status(201).json({
      message: "user created successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// user login controller function
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: "400", errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ statuseCode: 400, error: "Invalid credentials..." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Invalid login credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      SECRET,
      {
        expiresIn: 36000,
      },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie("auth-token", token).send({
          statusCode: 200,
          message: "Logged in successfully",
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userRole: user.userRole,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Server Error");
  }
};

// logout user controller function
const logOut = (req, res) => {
  res.clearCookie("auth-token");
  return res.json({ message: "Signout Successfully" });
};

// reset password controller function
const resetPasswordRequest = async (req, res) => {
  const errors = validationResult(req);
  //check for possible email errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: "400", errors: errors.array() });
  }
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
          console.log(token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            return res
              .status(404)
              .json({ error: "No account with the email address exist" });
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save((err) => {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        const resetPasswordLink = `http://${req.headers.host}/api/auth/resetpassword/${token}`;
        return res.status(200).send({
          message: "email link is created successfully",
          resetPasswordLink,
        });
      },
    ],
    (err) => {
      if (err) return next(err);
      res.status(500).json({ error: "Server Error" });
    }
  );
};

const resetPassword = async (req, res) => {
  //check for possible password errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: "400", errors: errors.array() });
  }
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token });
    if (!user) {
      return res.status(400).json({
        error: "Password reset token is invalid or has expired",
      });
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return res.status(200).json({
      statusCode: 200,
      message: "password changed successfully",
      user,
    });
  } catch (error) {
    res.sattus(500).json({ error: "Server Error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  logOut,
  resetPasswordRequest,
  resetPassword,
};
