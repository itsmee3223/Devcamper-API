const router = require("express").Router({
  mergeParams: true,
});

const { httpGetCourses } = require("../controllers/courses.controller");
const CourseSchema = require("../models/Course.shema");

const advancedResults = require("../middleware/advancedResults");

router.route("/").get(
  advancedResults(CourseSchema, {
    path: "bootcamp",
    select: "name description",
  }),
  httpGetCourses
);

module.exports = router;
