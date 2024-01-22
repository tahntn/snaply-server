import { TFunction } from 'i18next';
import { IMessage, IUser } from '../models';

export type TPayloadSendMessage = Pick<
  IMessage,
  'conversationId' | 'title' | 'type' | 'imageList' | 'replyTo' | 'url'
> & {
  user: IUser;
  t: TFunction<'translation', undefined>;
};
