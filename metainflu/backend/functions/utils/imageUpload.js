const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

/**
 * Compress and optimize image buffer
 * @param {Buffer} buffer - Image buffer from multer
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} - Compressed image data
 */
const compressImage = async (buffer, options = {}) => {
  try {
    const {
      maxSizeInBytes = 2 * 1024 * 1024, // 2MB default
      quality = 80,
      format = 'webp'
    } = options;

    // PATCH: BUFFER SAFETY CHECK
    if (!buffer || !(buffer instanceof Buffer) || buffer.length === 0) {
      throw new Error('Invalid image input: input is not a non-empty Buffer');
    }

    // PATCH: CHECK IMAGE FORMAT BEFORE SHARP
    let metadata;
    try {
      metadata = await sharp(buffer).metadata();
    } catch (metaErr) {
      throw new Error('Unable to get image metadata, likely non-image file: ' + metaErr.message);
    }

    let compressed = buffer;
    let currentQuality = quality;
    let outputBuffer;

    while (currentQuality >= 20) {
      if (format === 'webp') {
        outputBuffer = await sharp(compressed)
          .webp({ quality: currentQuality })
          .toBuffer();
      } else if (format === 'jpeg') {
        outputBuffer = await sharp(compressed)
          .jpeg({ quality: currentQuality, mozjpeg: true })
          .toBuffer();
      } else {
        outputBuffer = await sharp(compressed)
          .png({ quality: currentQuality, compressionLevel: 9 })
          .toBuffer();
      }
      if (outputBuffer.length <= maxSizeInBytes) {
        break;
      }
      currentQuality -= 10;
    }
    if (outputBuffer.length > maxSizeInBytes) {
      const scaleFactor = Math.sqrt(maxSizeInBytes / outputBuffer.length);
      const newWidth = Math.floor(metadata.width * scaleFactor);
      const newHeight = Math.floor(metadata.height * scaleFactor);
      outputBuffer = await sharp(compressed)
        .resize(newWidth, newHeight, { fit: 'inside' })
        .webp({ quality: 70 })
        .toBuffer();
    }
    const base64Image = `data:image/${format};base64,${outputBuffer.toString('base64')}`;
    return {
      success: true,
      data: base64Image,
      size: outputBuffer.length,
      originalSize: buffer.length,
      compressionRatio: ((1 - outputBuffer.length / buffer.length) * 100).toFixed(2) + '%',
      format: format,
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error('Image compression error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Process multiple images
 * @param {Array} files - Array of multer file objects
 * @param {Object} options - Compression options
 * @returns {Promise<Array>} - Array of processed images
 */
const processImages = async (files, options = {}) => {
  if (!files || files.length === 0) {
    return [];
  }
  const processedImages = [];
  for (const file of files) {
    // PATCH: FILE INTEGRITY CHECK
    if (!file || !file.buffer || !file.mimetype || file.buffer.length === 0) {
      console.warn('processImages skipped invalid file:', file && file.originalname);
      continue;
    }
    if (!isValidImage(file)) {
      console.warn('processImages rejected file not valid image:', file && file.mimetype, file && file.originalname);
      continue;
    }
    const result = await compressImage(file.buffer, options);
    if (result.success) {
      processedImages.push({
        id: uuidv4(),
        data: result.data,
        size: result.size,
        originalSize: result.originalSize,
        compressionRatio: result.compressionRatio,
        originalName: file.originalname,
        mimeType: file.mimetype
      });
    }
  }
  return processedImages;
};

/**
 * Validate image file
 * @param {Object} file - Multer file object
 * @returns {Boolean} - True if valid
 */
const isValidImage = (file) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return !!(file && allowedMimes.includes(file.mimetype));
};

module.exports = {
  compressImage,
  processImages,
  isValidImage
};
