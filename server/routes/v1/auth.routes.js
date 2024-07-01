const express = require("express");

const authProvider = require("../../auth/AuthProvider");
const {
  REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI,
  GRAPH_ME_ENDPOINT,
} = require("../../config/auth.config");
const { isAuthenticated } = require("../../middlewares");
const fetch = require("../../utils/fetch");

const authRouter = express.Router();
authRouter.get(
  "/signin",
  authProvider.login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: "http://localhost:5173/",
  })
);

authRouter.post("/redirect", authProvider.handleRedirect());

authRouter.get(
  "/acquireToken",
  authProvider.acquireToken({
    scopes: ["User.Read"],
    redirectUri: REDIRECT_URI,
    successRedirect: "/api/v1/auth/profile",
  })
);

authRouter.get("/profile", isAuthenticated, async function (req, res, next) {
  try {
    const graphResponse = await fetch(
      GRAPH_ME_ENDPOINT,
      req.session.accessToken
    );
    res.status(200).json({ profile: graphResponse });
  } catch (error) {
    next(error);
  }
});

authRouter.get(
  "/signout",
  authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
  })
);

module.exports = authRouter;
