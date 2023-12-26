import { IMessage, IUser } from '../models';

export type TPayloadSendMessage = Pick<IMessage, 'conversationsId' | 'title'> & {
  user: IUser;
};
