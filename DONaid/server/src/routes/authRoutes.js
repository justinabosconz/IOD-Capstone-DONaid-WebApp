const router = require("express").Router();
const {
  register,
  login,
  me,
  logout,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

module.exports = router;
