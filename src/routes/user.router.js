const express = require("express");
const { validationResult, check } = require("express-validator");
const {
  loginUser,
  getLoggedInUser,
  registerUser,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const { checkUserRoleData } = require("../middlewares/datavalidation");
const router = express.Router();

router.post("/api/auth/register", checkUserRoleData, registerUser);
router.post("/api/auth/login", loginUser);

router.get("/api/auth", auth, getLoggedInUser);

module.exports = router;
