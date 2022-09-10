const router = require("express").Router();

const BootcampSchema = require("../models/Bootcamp.schema");

const { httpGetBootcamps } = require("../controllers/bootcamps.controller");
const advancedResults = require("../middleware/advancedResults");

router.get("/", advancedResults(BootcampSchema), httpGetBootcamps);

module.exports = router;
