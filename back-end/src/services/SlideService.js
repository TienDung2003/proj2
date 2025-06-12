const Slide = require('../models/Slides');

const getAllSlides = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const slides = await Slide.find().populate('product');

            resolve({
                status: 'OK',
                message: 'Get slides successfully',
                data: slides,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createSlide = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.image) {
                return reject(new Error('Missing required fields: name or image'));
            }

            const slide = await Slide.create({
                name: data.name,
                image: data.image,
                product: data.product || null,  // Optional
            });

            resolve({
                status: 'OK',
                message: 'Slide created successfully',
                data: slide,
            });
        } catch (error) {
            reject(error);
        }
    });
};


const updateSlide = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedSlide = await Slide.findByIdAndUpdate(id, data, { new: true });
            if (!updatedSlide) {
                return resolve({
                    status: 'ERR',
                    message: 'Slide not found',
                });
            }
            resolve({
                status: 'OK',
                message: 'Slide updated successfully',
                data: updatedSlide,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteSlide = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const slide = await Slide.findByIdAndDelete(id);
            if (!slide) {
                return resolve({
                    status: 'ERR',
                    message: 'Slide not found',
                });
            }
            resolve({
                status: 'OK',
                message: 'Slide deleted successfully',
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllSlides,
    createSlide,
    updateSlide,
    deleteSlide,
};
