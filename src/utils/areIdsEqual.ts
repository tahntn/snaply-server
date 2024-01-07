import mongoose from 'mongoose';

export const areIdsEqual = (id1: mongoose.Types.ObjectId, id2: mongoose.Types.ObjectId) => {
  return new mongoose.Types.ObjectId(id1).equals(new mongoose.Types.ObjectId(id1));
};
