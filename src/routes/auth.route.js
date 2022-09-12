const {
  httpRegisterUser,
  httpLoginUser,
  httpLogoutUser,
  httpGetMe,
  httpUpdateDetails,
} = require("../controllers/auth.controller");

const router = require("express").Router();
const { authenticate } = require("../middleware/auth");

router.post("/register", httpRegisterUser);
router.post("/login", httpLoginUser);
router.get("/logout", httpLogoutUser);
router.get("/me", authenticate, httpGetMe);
router.put("/updatedetails", authenticate, httpUpdateDetails);

module.exports = router;
