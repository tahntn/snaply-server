import { httpStatus } from '../constant';
import { ApiError, handleError } from '../errors';
import { Conversation, Message } from '../models';
import { TPayloadSendMessage } from '../types';

export const sendMessageService = async (payload: TPayloadSendMessage) => {
  try {
    const { user, conversationsId, title } = payload;

    //check conversation exist
    const conversation = await Conversation.findById(conversationsId);
    if (!conversation) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation not found');
    }

    //create new message
    const newMessage = await Message.create({
      title,
      senderId: user?.id,
      conversationsId,
    });

    //update conversation
    await Conversation.findOneAndUpdate(
      {
        _id: conversationsId,
      },
      {
        $push: {
          messages: newMessage._id,
        },
      }
    );

    return newMessage;
  } catch (error) {
    handleError(error);
  }
};
