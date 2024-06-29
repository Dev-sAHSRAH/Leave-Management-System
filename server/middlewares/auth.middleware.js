function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect("/api/v1/auth/signin"); // redirect to sign-in route
  }

  next();
}

module.exports = isAuthenticated;
