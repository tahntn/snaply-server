import { Request, Router } from 'express';
import multer, { FileFilterCallback } from 'multer';
import {
  deleteSingleFileController,
  uploadMultiFileController,
  uploadSingleFileController,
} from '../controllers/upload.controller';
import { allowedImageTypes } from '../constant';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(req.t('upload.error.fileNotSupported'));
    cb(error);
  }
};

// multiple file
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter,
});

//single file
const uploadSingleImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
    files: 1,
  },
  fileFilter,
});

const router = Router();

router.post('/', upload.array('files'), uploadMultiFileController);

router.post('/single-image', uploadSingleImage.single('file'), uploadSingleFileController);
router.delete('/single-image/:publicId', deleteSingleFileController);

export default router;
