const asyncHandler = require("../middleware/async");
const UserSchema = require("../models/User.schema");
const sendTokenResponse = require("../utils/sendTokenResponse");

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
