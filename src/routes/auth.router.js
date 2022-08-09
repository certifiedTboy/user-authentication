const express = require("express");
const { validationResult, check } = require("express-validator");
const {
  loginUser,
  registerUser,
  resetPassword,
  resetPasswordRequest,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const { checkUserRoleData } = require("../middlewares/datavalidation");
const router = express.Router();

// user registration route
//data validation with express validator
router.post(
  "/register",

  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "A valid password is required").exists(),
  ],
  checkUserRoleData,
  registerUser
);

// user login route
//data validation with express validator
router.post(
  "/login",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "A valid password is required").exists(),
  ],
  loginUser
);

// resetPassword request route
router.post(
  "/resetpassword",
  [check("email", "please enter a valid email").isEmail()],
  resetPasswordRequest
);

// resetPassword route
router.post(
  "/resetpassword/:token",
  [check("newPassword", "A valid password is required").exists()],
  resetPassword
);

module.exports = router;
