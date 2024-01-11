export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
export interface UploadParams {
  Bucket: string | undefined;
  Key: string;
  Body: Buffer;
  ContentType?: string;
}
