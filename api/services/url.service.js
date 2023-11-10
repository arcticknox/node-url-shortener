import _ from 'lodash';
import UrlModel from '../models/url.model.js';
import genShortHash from '../utils/genShortHash.js';
import AppError from '../utils/AppError.js';
import httpStatus from 'http-status';
import { redis } from '../../redis/index.js';
import UserModel from '../models/user.model.js';
import TierModel from '../models/tier.model.js';
import logger from '../../logger/index.js';

/**
 * Check tier limits for user
 * @param {string} userId
 */
const checkTierLimits = async (userId) => {
  const userInfo = UserModel.findOne({ _id: userId });
  const userTierId = _.get(userInfo, 'tierId');
  const tierInfo = await TierModel.findOne({ _id: userTierId });
  const tierLimits = _.get(tierInfo, 'requestsLimit', 100);
  const timeNow = Date.now();
  const monthUsage = timeNow - (30 * 24 * 60 * 60 * 1000);
  const numberOfRequests = await UrlModel.countDocuments({ userId, createdAt: { $gte: monthUsage, $lt: timeNow } });
  if (numberOfRequests >= tierLimits) throw new AppError(400, 'Request limit reached for the tier');
  logger.info(`User current tier limits: ${numberOfRequests}/${tierLimits}`);
};

/**
 * Shorten url
 * @param {string} originalUrl
 * @param {string} userId
 */
const generateShortUrl = async (originalUrl, userId) => {
  await checkTierLimits(userId);
  const shortHash = await genShortHash(`${originalUrl}${userId}`);
  const checkExistingHash = await UrlModel.findOne({ shortHash, isDeleted: false });
  if (checkExistingHash) {
    shortHash = await genShortHash(`${originalUrl}${userId}`);
  }
  // Set cache
  redis.set(shortHash, originalUrl);
  return UrlModel.create({ originalUrl, shortHash, userId });
};

const getShortUrls = async (userId) => {
  return UrlModel.find({ userId });
};

/**
 * Resolves shortened url
 * @param {string} shortHash
 * @returns {string}
 */
const resolveShortUrl = async (shortHash) => {
  // Check cache
  const originalUrl = await redis.get(shortHash);
  if (originalUrl) return originalUrl;
  const urlInfo = await UrlModel.findOne({ shortHash }, { originalUrl: 1 });
  if (!urlInfo) throw new AppError(httpStatus.NOT_FOUND, 'No url found');
  return _.get(urlInfo, 'originalUrl');
};

/**
 * Delete short url
 * @param {string} _id
 * @param {string} userId
 */
const deleteShortUrl = async (_id, userId) => {
  const urlInfo = await UrlModel.findByIdAndUpdate({ _id, userId }, { isDeleted: true } );
  // Delete from cache
  redis.del(_.get(urlInfo, 'shortHash'));
};

export default {
  generateShortUrl,
  getShortUrls,
  resolveShortUrl,
  deleteShortUrl,
};
