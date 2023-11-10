import httpStatus from 'http-status';
import UserModel from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import tierService from './tier.service.js';
/**
 * Create user
 * @param {Object} userInfo: user info to be saved to create user
 */
const createUser = async (userInfo) => {
  const { email } = userInfo;
  const isEmailTaken = await UserModel.isEmailTaken(email);
  if (isEmailTaken) throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  const user = await UserModel.create({ ...userInfo });
  await tierService.associateUserWithTier(user._id);
  return user;
};

/**
 * Fetch user
 * @param {String} _id: user identifier
 * returns user info
 */
const fetchUserById = async (_id) => {
  const findBy = { '_id': mongoose.Types.ObjectId(_id) };
  const userInfo = await UserModel.findOne(findBy);
  if (!userInfo) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user indentifier provided');
  return userInfo;
};

/**
 * Update user
 * @param {String} _id: user identifier
 * @param {Object} userInfo: user info to be updated
 * @return {Object} updatedUserInfo
 */
const updateUser = async (_id, userInfo) => {
  if (userInfo.email) delete userInfo.email;
  const findBy = { '_id': mongoose.Types.ObjectId(_id) };
  if (userInfo.password) userInfo.password = await bcrypt.hash(userInfo.password, 10);
  const updatedUserInfo = await UserModel.findOneAndUpdate(findBy, userInfo, { new: true });
  if (!updatedUserInfo) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user indentifier provided, update operation failed');
  return updatedUserInfo;
};

/**
 * Delete user
 * @param {String} _id: user identifier
 * @param {Boolean} softDelete: flag to decide whether to update or delete from db
 */
const deleteUser = async (_id) => {
  const findBy = { '_id': mongoose.Types.ObjectId(_id) };
  const updateData = { isDeleted: true };
  const updatedUserInfo = await UserModel.findOneAndUpdate(findBy, { $set: updateData }, { new: true });
  if (!updatedUserInfo) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user indentifier provided, delete operation failed');
};

export default {
  createUser,
  fetchUserById,
  updateUser,
  deleteUser,
};
