const express = require("express");

const authProvider = require("../../auth/AuthProvider");
const {
  REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI,
} = require("../../config/auth.config");

const authRouter = express.Router();

authRouter.get(
  "/signin",
  authProvider.login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: "/api/v1/ping",
  })
);

authRouter.post("/redirect", authProvider.handleRedirect());

// authRouter.get("/redirect", function (req, res, next) {
//   if (req.session.isAuthenticated) {
//     res.redirect("http://localhost:5173"); // Redirect to your frontend homepage
//   } else {
//     res.redirect("/auth/signin"); // Redirect back to sign-in if not authenticated
//   }
// });

// authRouter.get(
//   "/acquireToken",
//   authProvider.acquireToken({
//     scopes: ["User.Read"],
//     redirectUri: REDIRECT_URI,
//     successRedirect: "/",
//   })
// );

authRouter.get(
  "/signout",
  authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
  })
);

module.exports = authRouter;
