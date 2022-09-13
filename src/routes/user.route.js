const router = require("express").Router();

const advancedResults = require("../middleware/advancedResults");
const { authenticate, authorize } = require("../middleware/auth");
const UserSchema = require("../models/User.schema");

const { httpGetUsers } = require("../controllers/user.controller");

router.use(authenticate);
router.use(authorize("admin"));

router.route("/").get(advancedResults(UserSchema), httpGetUsers);

module.exports = router;
