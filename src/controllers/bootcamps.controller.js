const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const BootcampSchema = require("../models/Bootcamp.schema");

exports.httpGetBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.httpGetBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampSchema.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});