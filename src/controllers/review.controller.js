const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const ReviewSchema = require("../models/Review.schema");
const BootcampSchema = require("../models/Bootcamp.schema");

exports.httpGetReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const review = await ReviewSchema.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      succsess: true,
      data: review,
    });
  }

  return res.status(200).json(res.advancedResults);
});

exports.httpGetReview = asyncHandler(async (req, res, next) => {
  const review = await ReviewSchema.findById(req.params.reviewId).populate({
    path: "bootcamp user",
    select: "name description",
  });

  if (!review) {
    return next(new ErrorResponse("No review found", 404));
  }

  return res.status(200).json({
    succsess: true,
    data: review,
  });
});

exports.httpCreateReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await BootcampSchema.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await ReviewSchema.create(req.body);

  return res.status(201).json({
    success: true,
    data: review,
  });
});

exports.httpUpdateReview = asyncHandler(async (req, res, next) => {
  let review = await ReviewSchema.findById(req.params.reviewId);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await ReviewSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

exports.httpDeleteReview = asyncHandler(async (req, res, next) => {
  const review = await ReviewSchema.findById(req.params.reviewId);
  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
