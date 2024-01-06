import { ICheckFriend } from '../types/friend.interface';

/**
 * Check if two userIds are equal.
 * @param {mongoose.Types.ObjectId} userId1 - User ID of user 1.
 * @param {mongoose.Types.ObjectId} userId2 - User ID of user 2.
 * @returns {boolean} - Returns true if equal, false otherwise.
 */

export const areUserIdsEqual = ({ userId1, userId2 }: ICheckFriend) => {
  return userId1.equals(userId2);
};
