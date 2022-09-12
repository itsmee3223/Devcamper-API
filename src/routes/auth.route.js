const {
  httpRegisterUser,
  httpLoginUser,
  httpLogoutUser,
} = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/register", httpRegisterUser);
router.post("/login", httpLoginUser);
router.get("/logout", httpLogoutUser);

module.exports = router;
