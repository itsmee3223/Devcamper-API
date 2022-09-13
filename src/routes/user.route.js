const router = require("express").Router();

const advancedResults = require("../middleware/advancedResults");
const { authenticate, authorize } = require("../middleware/auth");
const UserSchema = require("../models/User.schema");

const {
  httpGetUsers,
  httpGetUser,
  httpCreateUser,
} = require("../controllers/user.controller");

router.use(authenticate);
router.use(authorize("admin"));

router
  .route("/")
  .get(advancedResults(UserSchema), httpGetUsers)
  .post(httpCreateUser);

router.route("/:id").get(httpGetUser);

module.exports = router;
