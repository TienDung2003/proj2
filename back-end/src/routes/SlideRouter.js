const express = require("express");
const router = express.Router();
const slideController = require("../controllers/SlideController");
const { authMiddleWare } = require("../middleware/authMiddleware");

// GET: Lấy tất cả slide
router.get("/get-all", slideController.getAllSlides);

// POST: Tạo slide mới (chỉ admin)
router.post("/create", slideController.createSlide);

// PUT: Cập nhật slide theo id (chỉ admin)
router.put("/update/:id", slideController.updateSlide);

// DELETE: Xoá slide theo id (chỉ admin)
router.delete("/delete/:id", slideController.deleteSlide);

module.exports = router;
