const router = require("express").Router();
const {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", listItems);
router.get("/:id", getItem);
router.post("/", requireAuth, createItem);
router.put("/:id", requireAuth, updateItem);
router.delete("/:id", requireAuth, deleteItem);

module.exports = router;
