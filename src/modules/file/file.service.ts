import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as uuid from 'uuid';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const uniqueSuffix = uuid.v4();
      const typeFile = path.extname(file.originalname).toLowerCase();
      const fileName = uniqueSuffix + typeFile;

      const filePath = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
