const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const UserSchema = require("../models/User.schema");

exports.httpGetUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

exports.httpGetUser = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findById(req.params.id);
  if (!user) {
    return next(ErrorResponse("There is no user"), 404);
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

exports.httpCreateUser = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.create(req.body);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

exports.httpUpdateUser = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({ success: true, data: updatedUser });
});
