const {
  httpRegisterUser,
  httpLoginUser,
} = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/register", httpRegisterUser);
router.post("/login", httpLoginUser);

module.exports = router;
