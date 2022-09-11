const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const CourseSchma = require("../models/Course.shema");
const BootcampSchema = require("../models/Bootcamp.schema");

exports.httpGetCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await CourseSchma.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  }
  return res.status(200).json(res.advancedResults);
});

exports.httpGetCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseSchma.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  return res.status(200).json({
    success: true,
    data: course,
  });
});

exports.httpCreateCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await BootcampSchema.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id ${req.params.id}`, 404));
  }

  const course = await CourseSchma.create(req.body);
  return res.status(200).json({
    success: true,
    data: course,
  });
});
