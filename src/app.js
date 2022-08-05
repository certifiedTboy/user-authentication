const express = require("express");
const userRoute = require("./routes/user.router");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRoute);

module.exports = app;
