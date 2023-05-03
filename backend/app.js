/** Express app for course website. */


const express = require("express");
const app = express();

app.use(express.json());
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));


const { authenticateJWT } = require("./middleware/auth");
const ExpressError = require("./expressError");
const lessonRoutes = require("./routes/lessons");
const unitRoutes = require("./routes/units");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const usersLessonsRoutes = require("./routes/usersLessons")
const authRoutes = require("./routes/auth")


app.use(express.json())
app.use(authenticateJWT)

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/units", unitRoutes);
app.use("/lessons", lessonRoutes);
app.use("/users", userRoutes);
app.use("/userslessons", usersLessonsRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});


/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;