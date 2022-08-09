const express = require("express");
const protectedRoute = require("./routes/protected.router");
const authRoute = require("./routes/auth.router");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api/user/", protectedRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
