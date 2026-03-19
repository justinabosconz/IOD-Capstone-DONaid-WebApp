const router = require("express").Router();
const items = require("../controllers/itemController");
const requireSession = require("../middleware/requireSession");

router.get("/", items.listAvailable);
router.get("/:id", items.getOne);
router.post("/", requireSession, items.create);
router.put("/:id", requireSession, items.update);
router.delete("/:id", requireSession, items.remove);

module.exports = router;
