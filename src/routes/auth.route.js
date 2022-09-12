const { httpRegisterUser } = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/register", httpRegisterUser);

module.exports = router;
