const path = require("path");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const BootcampSchema = require("../models/Bootcamp.schema");
const geocoder = require("../utils/geocoder");

exports.httpGetBootcamps = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

exports.httpGetBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampSchema.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  return res.status(200).json({ success: true, data: bootcamp });
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

  return res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

exports.httpCreateBootcamp = asyncHandler(async (req, res, next) => {
  const createdBootcamp = await BootcampSchema.create(req.body);

  return res.status(201).json({
    success: true,
    data: createdBootcamp,
  });
});

exports.httpUpdateBootcamp = asyncHandler(async (req, res, next) => {
  let updatedBootcamp = await BootcampSchema.findById(req.params.id);

  if (!updatedBootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  updatedBootcamp = await BootcampSchema.findOneAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: updatedBootcamp,
  });
});

exports.httpDeleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampSchema.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

exports.httpUploadBootcampFoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampSchema.findById(req.params.id);
  const file = req.files.file;

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.UPLOAD_FILE_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(
        new ErrorResponse("Problem with file upload try again later....", 500)
      );
    }
  });

  await BootcampSchema.findByIdAndUpdate(req.params.id, { photo: file.name });
  return res.status(200).json({
    success: true,
    data: file.name,
  });
});
