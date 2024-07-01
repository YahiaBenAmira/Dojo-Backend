const router = require("express").Router();
const {
  register,
  login,
  getUserData,
  addImage,
} = require("../controllers/user");

router.post("/reg", register);
router.post("/image/:user_id", addImage);
router.post("/login", login);
router.get("/:user_id", getUserData);
module.exports = router;
