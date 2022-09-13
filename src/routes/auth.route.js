const {
  httpRegisterUser,
  httpLoginUser,
  httpLogoutUser,
  httpGetMe,
  httpUpdateDetails,
  httpUpdateUserPassword,
  httpForgetUserPassword,
  httpResetPasswordUser,
} = require("../controllers/auth.controller");

const router = require("express").Router();
const { authenticate } = require("../middleware/auth");

router.post("/register", httpRegisterUser);
router.post("/login", httpLoginUser);
router.get("/logout", httpLogoutUser);
router.get("/me", authenticate, httpGetMe);
router.put("/updatedetails", authenticate, httpUpdateDetails);
router.put("/updatepassword", authenticate, httpUpdateUserPassword);
router.post("/forgetpassword", httpForgetUserPassword);
router.put("/resetpassword/:resetToken", httpResetPasswordUser);

module.exports = router;
