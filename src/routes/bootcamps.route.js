const router = require("express").Router();

const courseRouter = require("./courses.route");
const reviewRouter = require("./review.route");

const {
  httpGetBootcamps,
  httpGetBootcamp,
  httpGetBootcampsInRadius,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
  httpUploadBootcampFoto,
} = require("../controllers/bootcamps.controller");
const { authenticate, authorize } = require("../middleware/auth");
const BootcampSchema = require("../models/Bootcamp.schema");
const advancedResults = require("../middleware/advancedResults");

// re-route in to another courses
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);
// bootcamp routes
router
  .route("/")
  .get(
    advancedResults(BootcampSchema, {
      path: "courses",
    }),
    httpGetBootcamps
  )
  .post(authenticate, authorize("admin", "publisher"), httpCreateBootcamp);

router.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);

router.put(
  "/:id/photo",
  authenticate,
  authorize("admin", "publisher"),
  httpUploadBootcampFoto
);

router
  .route("/:id")
  .get(httpGetBootcamp)
  .put(authenticate, authorize("admin", "publisher"), httpUpdateBootcamp)
  .delete(authenticate, authorize("admin", "publisher"), httpDeleteBootcamp);

module.exports = router;
