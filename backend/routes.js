const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/add", controller.upload.single("proof"), controller.addAchievement);
router.get("/", controller.getAchievements);
router.get("/pending", controller.getPending);
router.get('/rejected', controller.getRejected);
router.put("/update/:id", controller.updateStatus);
router.get("/filters", controller.getFilters); // ✅ IMPORTANT

module.exports = router;