const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

// visit admin page
const getManagerPage = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("-password");
    const allUsers = await User.find({}).select("-password");
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    if (user.userRole === "staff" || user.userRole === "admin") {
      return res
        .status(401)
        .json({ message: `You're not authorized to view this page` });
    }

    return res
      .status(200)
      .json({ statusCode: 200, message: "success", user, allUsers });
  } catch (error) {
    res.staus(500).json({ error: "Server Error" });
  }
};

//visit tutor page
const getAdminPage = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("-password");
    const allUsers = await User.find({}).select("-password");
    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }
    if (user.userRole === "staff") {
      return res
        .status(401)
        .json({ message: `You're not authorized to view this page` });
    }

    const staff = allUsers.filter((staff) => staff.userRole === "staff");
    res.status(200).json({ statusCode: 200, message: "success", user, staff });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//visit student page
const getStaffPage = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }

    res.status(200).json({ statusCode: 200, message: "success", user });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getManagerPage,
  getAdminPage,
  getStaffPage,
};
