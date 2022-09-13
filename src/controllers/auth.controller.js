const crypto = require("crypto");

const asyncHandler = require("../middleware/async");
const UserSchema = require("../models/User.schema");
const sendEmail = require("../utils/sendEmail");
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

exports.httpLogoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    succsess: true,
    data: {},
  });
});

exports.httpGetMe = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findById(req.user.id);
  res.status(200).json({
    succsess: true,
    data: user,
  });
});

exports.httpUpdateDetails = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  const user = await UserSchema.findByIdAndUpdate(
    req.user.id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    succsess: true,
    data: user,
  });
});

exports.httpUpdateUserPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(
      new ErrorResponse("Please enter a password and new password", 400)
    );
  }

  const user = await UserSchema.findById(req.user.id).select("password");
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse("Invalid password", 401));
  }

  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

exports.httpForgetUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    return res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

exports.httpResetPasswordUser = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await UserSchema.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
