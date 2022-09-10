const router = require("express").Router();

const BootcampSchema = require("../models/Bootcamp.schema");

const {
  httpGetBootcamps,
  httpGetBootcamp,
} = require("../controllers/bootcamps.controller");
const advancedResults = require("../middleware/advancedResults");

router.get("/", advancedResults(BootcampSchema), httpGetBootcamps);
router.get("/:id", httpGetBootcamp);
module.exports = router;
