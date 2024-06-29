require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const { PORT } = require("./config/server.config");
const apiRouter = require("./routes");
const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set this to true on production
    },
  })
);
app.use("/api", apiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(PORT, () => {
  console.log(`Server listening at PORT : ${PORT}`);
});
