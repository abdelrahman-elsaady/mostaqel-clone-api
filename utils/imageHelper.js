const CloudinaryService = require('../services/cloudinaryService');

class ImageHelper {
  static getProfilePictureUrl(user, size = 'medium') {
    if (!user.profilePicturePublicId) {
      return user.profilePicture || 'https://i.ibb.co/MG513bH/Default-user.png';
    }

    const sizeMap = {
      thumbnail: { width: 150, height: 150 },
      medium: { width: 300, height: 300 },
      large: { width: 500, height: 500 }
    };

    const dimensions = sizeMap[size] || sizeMap.medium;
    
    return CloudinaryService.getThumbnailUrl(
      user.profilePicturePublicId, 
      dimensions.width, 
      dimensions.height
    );
  }

  static isValidImage(base64String) {
    const validTypes = ['data:image/jpeg', 'data:image/png', 'data:image/gif', 'data:image/webp'];
    return validTypes.some(type => base64String.startsWith(type));
  }

  static getImageSize(base64String) {
    try {
      const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      return {
        width: 0,
        height: 0,
        size: buffer.length
      };
    } catch (error) {
      return { width: 0, height: 0, size: 0 };
    }
  }

  static async compressImage(base64String, quality = 80) {
    try {
      const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      return base64String;
    } catch (error) {
      console.error('Image compression error:', error);
      return base64String;
    }
  }
}

module.exports = ImageHelper;

