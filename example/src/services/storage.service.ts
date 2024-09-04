import fs from 'fs/promises';
import path from 'path';
import { Err, Ok } from '../errors/Result';

export const StorageService = {
  async upload(name: string, file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const filePath = path.join(
        'uploads',
        Date.now() + '-' + name + '.' + file.type.split('/')[1]
      );
      await fs.writeFile(path.join(process.cwd(), 'public', filePath), uint8Array);
      return Ok(filePath);
    } catch (error) {
      return Err({
        status: 500,
        message: 'Something went wrong',
      });
    }
  },
};
