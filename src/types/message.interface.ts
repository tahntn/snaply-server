import { IMessage, IUser } from '../models';

export type TPayloadSendMessage = Pick<IMessage, 'conversationId' | 'title'> & {
  user: IUser;
};
