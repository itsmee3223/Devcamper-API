const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const UserSchema = require("../models/User.schema");

exports.httpGetUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
