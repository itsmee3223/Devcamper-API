const asyncHandler = require("../middleware/async");

exports.httpGetBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
