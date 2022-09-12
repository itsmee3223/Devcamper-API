const {
  httpRegisterUser,
  httpLoginUser,
  httpLogoutUser,
  httpGetMe,
} = require("../controllers/auth.controller");

const router = require("express").Router();
const { authenticate } = require("../middleware/auth");

router.post("/register", httpRegisterUser);
router.post("/login", httpLoginUser);
router.get("/logout", httpLogoutUser);
router.get("/me", authenticate, httpGetMe);

module.exports = router;
