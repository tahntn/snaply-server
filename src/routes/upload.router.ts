import { Request, Router } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { uploadMultiFileController } from '../controllers/upload.controller';

//setup multer
const storage = multer.memoryStorage();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    const error = new Error(req.t('upload.error.fileNotSupported'));
    cb(error);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter,
});

const router = Router();

router.post('/', upload.array('files'), uploadMultiFileController);

export default router;
