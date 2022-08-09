const User = require("../models/user.model");

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
  getManagerPage,
  getAdminPage,
  getStaffPage,
};
