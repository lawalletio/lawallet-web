/**
 * Utility functions for image handling
 */

/**
 * Compress an image and convert it to base64
 * @param file The image file to compress
 * @param maxSizeMB Maximum size in MB
 * @param maxWidth Maximum width in pixels
 * @param maxHeight Maximum height in pixels
 * @returns Promise with the base64 string of the compressed image
 */
export const compressImage = (
  file: File,
  maxSizeMB: number = 0.3,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create an image element to load the file
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        // Create a canvas element to draw the image
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality reduction for JPEG and PNG
          let quality = 0.8; // Start with 80% quality
          let result = canvas.toDataURL(file.type, quality);

          // Reduce quality until size is under maxSizeMB
          const getSizeInMB = (base64: string) => (base64.length * 0.75) / 1024 / 1024;

          while (getSizeInMB(result) > maxSizeMB && quality > 0.1) {
            quality -= 0.1;
            result = canvas.toDataURL(file.type, quality);
          }

          resolve(result);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      img.onerror = () => {
        reject(new Error('Error loading image'));
      };

      // Set image source from FileReader result
      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    // Read the file as data URL
    reader.readAsDataURL(file);
  });
};

/**
 * Convert base64 to a file object
 * @param base64 The base64 string
 * @param filename The name of the file
 * @param mimeType The MIME type of the file
 * @returns a File object
 */
export const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], filename, { type: mimeType });
};
