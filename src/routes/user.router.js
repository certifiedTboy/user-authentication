const express = require("express");
const { validationResult, check } = require("express-validator");
const {
  loginUser,
  registerUser,
  getAdminPage,
  getTutorPage,
  getStudentPage,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const { checkUserRoleData } = require("../middlewares/datavalidation");
const router = express.Router();

router.post(
  "/api/auth/register",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "A valid password is required").exists(),
  ],
  checkUserRoleData,
  registerUser
);
router.post(
  "/api/auth/login",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "A valid password is required").exists(),
  ],
  loginUser
);
router.get("/api/auth/adminpage/:id", auth, getAdminPage);
router.get("/api/auth/tutorpage", auth, getTutorPage);
router.get("/api/auth/studentPage/:id", auth, getStudentPage);
module.exports = router;
