const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { SECRET } = process.env;

// get current logged in user
const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ statusCode: 200, message: "user gotten successfully", user });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, SECRET, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, userRole, email, password } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      userRole,
      password,
    });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    console.log(user);

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

// user login controller function
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: "400", errors: errors.array() });
  }
  const { email, password } = req.body;
  console.log(email, password);

  try {
    let user = await User.findOne({ email });
    console.log(user);
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
        res.json({
          statusCode: 200,
          message: "Logged in successfully",
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userRole: user.userRole,
            isTutor: user.isTutor,
            isAdmin: user.isAdmin,
            isStudent: user.isStudent,
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

module.exports = {
  loginUser,
  getLoggedInUser,
  registerUser,
};
