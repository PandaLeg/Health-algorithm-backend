import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as uuid from 'uuid';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const uniqueSuffix = uuid.v4();
      const fileName: string = uniqueSuffix + '.webp';

      const filePath: string = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      const fileBuffer = await sharp(file.buffer)
        .webp({ quality: 90 })
        .resize({ width: 300, height: 250 })
        .toBuffer();

      await fs.promises.writeFile(path.join(filePath, fileName), fileBuffer);

      return fileName;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
