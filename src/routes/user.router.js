const express = require("express");
const { validationResult, check } = require("express-validator");
const {
  loginUser,
  registerUser,
  getManagerPage,
  getAdminPage,
  getStaffPage,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const { checkUserRoleData } = require("../middlewares/datavalidation");
const router = express.Router();

// user registration route
//data validation with express validator
router.post(
  "/api/auth/register",

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
  "/api/auth/login",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "A valid password is required").exists(),
  ],
  loginUser
);

// admin page route
// @access: Admin only
router.get("/api/auth/managerpage", auth, getManagerPage);

// tutor page route
// @Access Admins & tutors
router.get("/api/auth/adminpage", auth, getAdminPage);

// student page route
//@Access Admin and Students
router.get("/api/auth/staffpage", auth, getStaffPage);

module.exports = router;
