const router = require("express").Router();

const BootcampSchema = require("../models/Bootcamp.schema");

const {
  httpGetBootcamps,
  httpGetBootcamp,
  httpGetBootcampsInRadius,
  httpCreateBootcamp,
} = require("../controllers/bootcamps.controller");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(advancedResults(BootcampSchema), httpGetBootcamps)
  .post(httpCreateBootcamp);

router.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);
router.get("/:id", httpGetBootcamp);
module.exports = router;
