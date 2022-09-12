const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const UserSchema = require("../models/User.schema");

exports.authenticate = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorResponse("Not authorize to access this resource", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await UserSchema.findById(decoded.id);
  if (!req.user) {
    return next(
      new ErrorResponse("Not authorize to accsess this resource", 401)
    );
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("Forbidden to access this resource", 403));
    }
    next();
  };
};
