import fs from 'fs/promises';
import path from 'path';
import { Err, Ok } from '../errors/Result';

function sanitizeFilename(name: string): string {
  // Remove path traversal sequences and dangerous characters
  return name
    .replace(/[\/\\:*?"<>|]/g, '') // Remove dangerous characters
    .replace(/\.\./g, '') // Remove path traversal sequences
    .replace(/^\.+/, '') // Remove leading dots
    .trim()
    .slice(0, 100) // Limit length
    || 'unnamed'; // Fallback if name becomes empty
}

export const StorageService = {
  async upload(name: string, file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Sanitize the filename to prevent path traversal
      const sanitizedName = sanitizeFilename(name);
      
      // Validate file type and get safe extension
      const mimeType = file.type;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav'];
      
      if (!allowedTypes.includes(mimeType)) {
        return Err({
          status: 400,
          message: 'Invalid file type. Only images and audio files are allowed.',
        });
      }
      
      const extension = mimeType.split('/')[1];
      const timestamp = Date.now();
      const filename = `${timestamp}-${sanitizedName}.${extension}`;
      
      const filePath = path.join('uploads', filename);
      const fullPath = path.join(process.cwd(), 'public', filePath);
      
      // Ensure the uploads directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      
      await fs.writeFile(fullPath, uint8Array);
      return Ok(filePath);
    } catch (error) {
      console.error('File upload error:', error);
      return Err({
        status: 500,
        message: 'Failed to upload file. Please try again.',
      });
    }
  },
};
