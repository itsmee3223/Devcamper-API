const router = require("express").Router();

const courseRouter = require("./courses.route");
const {
  httpGetBootcamps,
  httpGetBootcamp,
  httpGetBootcampsInRadius,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
} = require("../controllers/bootcamps.controller");
const BootcampSchema = require("../models/Bootcamp.schema");
const advancedResults = require("../middleware/advancedResults");

// re-route in to another courses
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(
    advancedResults(BootcampSchema, {
      path: "courses",
    }),
    httpGetBootcamps
  )
  .post(httpCreateBootcamp);

router.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);
router
  .route("/:id")
  .get(httpGetBootcamp)
  .put(httpUpdateBootcamp)
  .delete(httpDeleteBootcamp);

module.exports = router;
