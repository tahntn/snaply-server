import { httpStatus } from '../constant';
import { uploadMultiS3FileService } from '../services/s3.service';
import { UploadedFile } from '../types';
import { catchAsync } from '../utils';
import { Request, Response } from 'express';

export const uploadMultiFileController = catchAsync(async (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: req.t('upload.error.missingFile'),
    });
  }
  const results = await uploadMultiS3FileService(req.files as UploadedFile[]);
  return res.status(httpStatus.OK).json(results);
});
