const cloudinary = require('../config/cloudinary');
const { promisify } = require('util');

class CloudinaryService {
  static async uploadImage(file, options = {}) {
    try {
      const uploadOptions = {
        folder: 'mostaqel',
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...options,
      };

      const result = await cloudinary.uploader.upload(file, uploadOptions);
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async uploadFromBase64(base64String, options = {}) {
    try {
      const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const uploadOptions = {
        folder: 'mostaqel/users',
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ],
        ...options,
      };

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64Data}`,
        uploadOptions
      );

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary base64 upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async uploadFromBuffer(buffer, options = {}) {
    try {
      const uploadOptions = {
        folder: 'mostaqel/users',
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ],
        ...options,
      };

      const result = await cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject({
                success: false,
                error: error.message,
              });
            } else {
              resolve({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
              });
            }
          }
        );

        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error('Cloudinary buffer upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        result: result.result,
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static getTransformedUrl(publicId, transformations = []) {
    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
    });
  }

  static getThumbnailUrl(publicId, width = 150, height = 150) {
    return cloudinary.url(publicId, {
      transformation: [
        { width, height, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      secure: true,
    });
  }
}

module.exports = CloudinaryService;

