import { ApiError, handleError } from '../errors';
import { httpStatus } from '../constant';
import { IUser, User } from '../models';
import FriendRequest from '../models/friendRequest.model';
import Friend from '../models/friend.model';
import mongoose from 'mongoose';

interface ICreateFriendRequest {
  sender: IUser;
  receiverEmail: string;
}

interface IConfirmFriendRequest {
  currentUser: IUser;
  confirmUserId: mongoose.Types.ObjectId;
}

interface IConfirmFriendRequest2 {
  currentUser: IUser;
  friendRequestId: mongoose.Types.ObjectId;
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

export const confirmFriendRequestService = async (payload: IConfirmFriendRequest) => {
  const { currentUser, confirmUserId } = payload;

  //check confirm User
  const confirmUser = await User.findById(confirmUserId);

  if (!confirmUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${confirmUserId} has not been found. Please check email address again.`
    );
  }
  //check 2 object ID
  const areEquals = currentUser._id.equals(confirmUser._id);
  if (areEquals) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot send friend request to yourself');
  }

  //check existing request
  const existingRequest = await FriendRequest.findOne({
    senderId: confirmUser._id,
    receiverId: currentUser._id,
  });
  if (!existingRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'request not found');
  }

  //check friend
  const friendship1 = await Friend.findOne({
    userId: confirmUser._id,
    friends: { $in: [currentUser._id] },
  });
  const friendship2 = await Friend.findOne({
    userId: currentUser._id,
    friends: { $in: [confirmUser._id] },
  });
  if (!!friendship1 || !!friendship2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already friends');
  }

  //delete request
  await FriendRequest.deleteOne({
    senderId: confirmUser._id,
    receiverId: currentUser._id,
  });

  //push friend
  await Friend.findOneAndUpdate(
    { userId: confirmUser._id },
    {
      $addToSet: {
        friends: currentUser._id,
      },
    },
    { upsert: true, new: true }
  );

  await Friend.findOneAndUpdate(
    { userId: currentUser._id },
    {
      $addToSet: {
        friends: confirmUser._id,
      },
    },
    { upsert: true, new: true }
  );

  return { status: 'Success' };
};

export const confirmFriendRequestService2 = async (payload: IConfirmFriendRequest2) => {
  const { currentUser, friendRequestId } = payload;

  //check  friend Request
  const friendRequest = await FriendRequest.findById(friendRequestId);
  if (!friendRequest) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${friendRequestId} has not been found. Please check email address again.`
    );
  }
  const senderId = friendRequest.senderId;
  //check receiver ID
  const areEquals = currentUser._id.equals(friendRequest.receiverId);
  if (!areEquals) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not receiver');
  }

  //check friend
  const friendship1 = await Friend.findOne({
    userId: senderId,
    friends: { $in: [currentUser._id] },
  });
  const friendship2 = await Friend.findOne({
    userId: currentUser._id,
    friends: { $in: [senderId] },
  });
  if (!!friendship1 || !!friendship2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already friends');
  }

  //delete request
  await friendRequest.deleteOne({
    _id: friendRequest._id,
  });

  //push friend
  await Friend.findOneAndUpdate(
    { userId: senderId },
    {
      $addToSet: {
        friends: currentUser._id,
      },
    },
    { upsert: true, new: true }
  );

  await Friend.findOneAndUpdate(
    { userId: currentUser._id },
    {
      $addToSet: {
        friends: senderId,
      },
    },
    { upsert: true, new: true }
  );

  return { status: 'Success' };
};
