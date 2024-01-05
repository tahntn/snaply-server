import { Request } from 'express';
import { ApiError, handleError } from '../errors';
import { httpStatus } from '../constant';
import { Conversation, User } from '../models';
import Friend from '../models/friend.model';
import mongoose from 'mongoose';

interface ICreateFriendRequest {
  req: Request;
  receiverUserId: mongoose.Types.ObjectId;
}

interface IUpdateStateFriendRequest {
  req: Request;
  friendRequestId: mongoose.Types.ObjectId;
}

export const createFriendRequestService = async (payload: ICreateFriendRequest) => {
  try {
    const { req, receiverUserId } = payload;
    const currentUser = req.user!;

    // check create to yourself
    if (currentUser._id.equals(receiverUserId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('friend.error.cantSendRequestToYourself'));
    }

    // check receiver exist
    const receiver = await User.findById(receiverUserId);

    if (receiver === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t(`friend.error.receiverNotFound`));
    }

    //check if invitation has been already sent
    const invitationAlreadyReceived = await Friend.findOne({
      senderId: currentUser?._id,
      receiverId: receiver._id,
      status: 'pending',
    });

    if (invitationAlreadyReceived) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('friend.error.invitationAlreadySent'));
    }

    //check receiver is already a friend
    const areAlreadyFriends = await Friend.findOne({
      $or: [
        { userId: currentUser?._id, targetUserId: receiver?._id },
        { userId: receiver?._id, targetUserId: currentUser?._id },
      ],
      status: 'accept',
    });

    if (areAlreadyFriends) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('friend.error.friendAlreadyAdded'));
    }

    //Create your request list
    const friendRequest = await Friend.create({
      userId: currentUser?._id,
      targetUserId: receiver?._id,
      status: 'pending',
    });

    return friendRequest;
  } catch (error) {
    handleError(error);
  }
};

export const confirmFriendRequestService = async (payload: IUpdateStateFriendRequest) => {
  try {
    const { req, friendRequestId } = payload;
    const updatedFriendRequest = await Friend.findByIdAndUpdate(
      friendRequestId,
      { status: 'accept' },
      { new: true }
    );
    if (!updatedFriendRequest) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('friend.error.friendRequestNotFound'));
    }

    // Create conversation between two user
    const { userId, targetUserId } = updatedFriendRequest;

    const newConversation = new Conversation({
      participants: [userId, targetUserId],
    });
    await newConversation.save();

    return true;
  } catch (error) {
    handleError(error);
  }
};

export const denyFriendRequestService = async (payload: IUpdateStateFriendRequest) => {
  try {
    const { req, friendRequestId } = payload;

    const deletedFriendRequest = await Friend.findByIdAndDelete(friendRequestId);
    if (!deletedFriendRequest) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('friend.error.friendRequestNotFound'));
    }
    return true;
  } catch (error) {
    handleError(error);
  }
};
