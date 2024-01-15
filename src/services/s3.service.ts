import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { UploadParams, UploadedFile } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../config/s3Service';
import { handleError } from '../errors';
import { streamToString } from '../utils';
import { Readable } from 'stream';

export const uploadMultiS3FileService = async (files: UploadedFile[]) => {
  try {
    const params = files.map((file: UploadedFile) => {
      return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuidv4()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file?.mimetype,
      };
    });
    const results = await Promise.all(
      params.map((param: UploadParams) => {
        const command = new PutObjectCommand(param);
        s3Client.send(command);
        const url = `https://${param.Bucket}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${param.Key}`;
        return {
          name: param.Key,
          url,
          type: param.ContentType,
        };
      })
    );
    return results;
  } catch (err) {
    handleError(err);
  }
};

export const downloadS3FileService = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const fileContent = await streamToString(response.Body as Readable);
    return fileContent;
  } catch (err) {
    handleError(err);
  }
};

export const deleteS3FileService = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);
    return response;
  } catch (err) {
    handleError(err);
  }
};
