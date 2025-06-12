// controllers/slideController.js

const slideService = require('../services/SlideService');

const getAllSlides = async (req, res) => {
    try {
        const slides = await slideService.getAllSlides();
        res.json(slides);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const createSlide = async (req, res) => {
    try {
        const slide = await slideService.createSlide(req.body);
        res.status(201).json(slide);
    } catch (err) {
        res.status(400).json({ message: 'Lỗi khi tạo slide.' });
    }
};

const updateSlide = async (req, res) => {
    try {
        const slide = await slideService.updateSlide(req.params.id, req.body);
        if (!slide) return res.status(404).json({ message: 'Không tìm thấy slide.' });
        res.json(slide);
    } catch (err) {
        res.status(400).json({ message: 'Lỗi khi cập nhật slide.' });
    }
};

const deleteSlide = async (req, res) => {
    try {
        const slide = await slideService.deleteSlide(req.params.id);
        if (!slide) return res.status(404).json({ message: 'Không tìm thấy slide.' });
        res.json({ message: 'Xoá thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};
module.exports = {
    deleteSlide,
    updateSlide,
    createSlide,
    getAllSlides,

};
