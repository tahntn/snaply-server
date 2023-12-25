import { ApiError, handleError } from '../errors';
import { httpStatus } from '../constant';
import { IUser, User } from '../models';
import FriendRequest from '../models/friendRequest.model';
import Friend from '../models/friend.model';

interface ICreateFriendRequest {
  sender: IUser;
  receiverEmail: string;
}

export const createFriendRequestService = async (payload: ICreateFriendRequest) => {
  try {
    const { sender, receiverEmail } = payload;
    const receiver = await User.findOne({
      email: receiverEmail,
    });

    // check create to yourself
    if (sender.email?.toLowerCase() === receiverEmail?.toLowerCase()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot send friend request to yourself');
    }

    // check receiver exist
    if (receiver === null) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `${receiverEmail} has not been found. Please check email address again.`
      );
    }

    //check if invitation has been already sent
    const invitationAlreadyReceived = await FriendRequest.findOne({
      senderId: sender?._id,
      receiverId: receiver._id,
    });
    if (invitationAlreadyReceived) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invitation has been already sent');
    }

    //check receiver is already a friend
    const friendOfUser = await Friend.findOne({
      userId: sender?._id,
    });

    if (friendOfUser) {
      const usersAlreadyFriends = friendOfUser?.friends?.find(
        (friendId) => friendId.toString() === receiver._id.toString()
      );
      if (usersAlreadyFriends) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Friend already added. Please check friends list.'
        );
      }
    }

    //Create your request list
    const friendRequest = await FriendRequest.create({
      senderId: sender?._id,
      receiverId: receiver?._id,
    });

    return friendRequest;
  } catch (error) {
    handleError(error);
  }
};
