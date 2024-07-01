const express = require("express");
const { pingController } = require("../../controllers");
const authRouter = require("./auth.routes");
const { isAuthenticated } = require("../../middlewares");
const v1Router = express.Router();

v1Router.get("/", isAuthenticated, function (req, res, next) {
  const response = {
    title: "Auth Check",
    isAuthenticated: req.session.isAuthenticated,
    username: req.session.account?.username,
  };

  return res.status(200).json(response);
});

v1Router.use("/ping", isAuthenticated, pingController.ping);
v1Router.use("/auth", authRouter);

module.exports = v1Router;
