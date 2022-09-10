const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const BootcampSchema = require("../models/Bootcamp.schema");
const geocoder = require("../utils/geocoder");

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

exports.httpGetBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const location = await geocoder.geocode(zipcode);
  const latitude = location[0].latitude;
  const longitude = location[0].longitude;
  const radius = distance / 6357;
  const bootcamps = await BootcampSchema.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
