const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { SECRET } = process.env;

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: "400", errors: errors.array() });
  }
  try {
    const { firstName, lastName, userRole, email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist)
      return res.status(400).json({ error: "email is already taken" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      userRole,
      password,
    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
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
        res.header("jwt", token).send({
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
const getAdminPage = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    const allUsers = await User.find({});
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    if (user.userRole == "admin") {
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
const getTutorPage = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    const allUsers = await User.find({});
    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }
    if (user.userRole == "tutor") {
      return res
        .status(401)
        .json({ message: `You're not authorized to view this page` });
    }

    const students = allUsers.filter(
      (student) => student.userRole === "student"
    );
    console.log(students);

    res
      .status(200)
      .json({ statusCode: 200, message: "success", user, students });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//visit student page
const getStudentPage = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

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
  getAdminPage,
  getTutorPage,
  getStudentPage,
};
