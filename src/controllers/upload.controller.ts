import { httpStatus } from '../constant';
import { deleteFromCloudinary, uploadToCloudinary } from '../services/cloudinary.service';
import { uploadMultiS3FileService } from '../services/s3.service';
import { UploadedFile } from '../types';
import { catchAsync } from '../utils';
import { Request, Response } from 'express';

// aws s3

export const uploadMultiFileController = catchAsync(async (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: req.t('upload.error.missingFiles'),
    });
  }
  const results = await uploadMultiS3FileService(req.files as UploadedFile[]);
  return res.status(httpStatus.CREATED).json(results);
});

// cloudinary

export const uploadSingleFileController = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json({
      code: httpStatus.BAD_REQUEST,
      message: req.t('upload.error.missingFile'),
    });
  }
  const result = await uploadToCloudinary(req.file);
  return res.status(httpStatus.CREATED).json({
    url: result.url,
  });
});

export const deleteSingleFileController = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  const result = await deleteFromCloudinary(publicId);

  if (result.result === 'ok') {
    return res.status(httpStatus.NO_CONTENT).send();
  } else {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: req.t('upload.error.failedToDeleteImage') });
  }
});
