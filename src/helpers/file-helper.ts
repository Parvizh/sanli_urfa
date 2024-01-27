import { extname, join } from "path";
import * as fs from "fs";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";

export const imageFileFilter =
  (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    if (!allowedExtensions.includes(extname(file.originalname))) {
      return callback(null, false);
    }
    callback(null, true);
  }

export const cvFileFilter = (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
  const allowedExtensions = ['.pdf'];
  if (!allowedExtensions.includes(extname(file.originalname))) {
    return callback(null, false);
  }
  callback(null, true)
}

export const storeImage = (req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
  const extension = extname(file.originalname);
  const fileName = randomStringGenerator() + extension;
  callback(null, fileName);

  return fileName;
}

export const deleteImage = filePath => {
  filePath = join(__dirname, '..', '..', 'public', filePath);
  fs.unlink(filePath, err => {
    if (err) console.log(err);
    else console.log('File deleted!');
  });
}