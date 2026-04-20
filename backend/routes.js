const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/add", controller.addAchievement);
router.get("/", controller.getAchievements);
router.get("/pending", controller.getPending);
router.put("/update/:id", controller.updateStatus);

module.exports = router;