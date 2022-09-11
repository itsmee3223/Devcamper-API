const path = require("path");

const hpp = require("hpp");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const express = require("express");
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: path.join(__dirname, "./config/.env") });

const errorHandler = require("./middleware/error");
const bootcampsRoute = require("./routes/bootcamps.route");
const coursesRoute = require("./routes/courses.route");

const app = express();
const limiter = rateLimit({
  windowMS: 10 * 60 * 1000,
  max: 100,
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1/bootcamps", bootcampsRoute);
app.use("/api/v1/courses", coursesRoute);
app.use(errorHandler);

module.exports = app;
