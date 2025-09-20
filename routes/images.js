const express = require('express');
const { auth } = require('../middlewares/authorization');
const { uploadImage, deleteImage, getTransformedImage } = require('../controllers/imageController');

const router = express.Router();

// Image upload route (protected)
router.post('/upload', auth, uploadImage);

// Delete image route (protected)
router.delete('/:public_id', auth, deleteImage);

// Get transformed image URL (public)
router.get('/transform/:public_id', getTransformedImage);

module.exports = router;

