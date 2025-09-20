const CloudinaryService = require('../services/cloudinaryService');
const ImageHelper = require('../utils/imageHelper');

const uploadImage = async (req, res, next) => {
  try {
    const { image, folder = 'mostaqel', type = 'profile' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // Validate image format
    if (!ImageHelper.isValidImage(image)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Supported formats: JPEG, PNG, GIF, WebP'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.uploadFromBase64(image, {
      folder: `${folder}/${type}`,
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    if (uploadResult.success) {
      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to upload image',
        error: uploadResult.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'No public_id provided'
      });
    }

    const deleteResult = await CloudinaryService.deleteImage(public_id);

    if (deleteResult.success) {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image',
        error: deleteResult.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getTransformedImage = async (req, res, next) => {
  try {
    const { public_id } = req.params;
    const { width = 300, height = 300, crop = 'fill', quality = 'auto' } = req.query;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'No public_id provided'
      });
    }

    const transformations = [
      { width: parseInt(width), height: parseInt(height), crop },
      { quality }
    ];

    const transformedUrl = CloudinaryService.getTransformedUrl(public_id, transformations);

    res.status(200).json({
      success: true,
      data: {
        url: transformedUrl,
        public_id,
        transformations: {
          width: parseInt(width),
          height: parseInt(height),
          crop,
          quality
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getTransformedImage
};

