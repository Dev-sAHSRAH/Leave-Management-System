const express = require("express");
const { pingController } = require("../../controllers");

const v1Router = express.Router();

v1Router.use("/ping", pingController.ping);
module.exports = v1Router;
