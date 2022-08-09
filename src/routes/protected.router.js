const express = require("express");
const {
  getManagerPage,
  getAdminPage,
  getStaffPage,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

// admin page route
// @access: Managers only
router.get("/managerpage", auth, getManagerPage);

// tutor page route
// @Access Managers & Admin
router.get("/adminpage", auth, getAdminPage);

// student page route
//@Access Managers and Staff
router.get("/staffpage", auth, getStaffPage);

module.exports = router;
