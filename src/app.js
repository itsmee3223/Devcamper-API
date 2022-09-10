const path = require("path");

const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: path.join(__dirname, "./config/.env") });

const errorHandler = require("./middleware/error");
const bootcampsRoute = require("./routes/bootcamps.route");

const app = express();
const limiter = rateLimit({
  windowMS: 10 * 60 * 1000,
  max: 100,
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/bootcamps", bootcampsRoute);
app.use(errorHandler);

module.exports = app;
