import mongoose, { Document, Model } from 'mongoose';
import { ApiError, handleError } from '../errors';
import { httpStatus } from '../constant';

export const checkExistence = async <T extends Document>(
  model: Model<T>,
  objectId: mongoose.Types.ObjectId,
  //   t: TFunction<'translation', undefined>,
  errorMessage: string
): Promise<T | undefined> => {
  try {
    const document = await model.findById(objectId);
    if (!document) {
      throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
    return document;
  } catch (error) {
    handleError(error);
  }
};
