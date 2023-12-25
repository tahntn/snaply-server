import { handleError } from '../errors';
// import { IConversation } from '../models';

export const createConversationService = () => {
  try {
    return { hi: 'hi' };
  } catch (error) {
    handleError(error);
  }
};
