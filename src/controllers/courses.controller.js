const asyncHandler = require("../middleware/async");
const CourseSchma = require("../models/Course.shema");

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
