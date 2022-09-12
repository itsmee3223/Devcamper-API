const asyncHandler = require("../middleware/async");
const UserSchema = require("../models/User.schema");
const sendTokenResponse = require("../utils/sendTokenResponse");
const ErrorResponse = require("../utils/errorResponse");

exports.httpRegisterUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await UserSchema.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

exports.httpLoginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await UserSchema.findOne({ email }).select("password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});
