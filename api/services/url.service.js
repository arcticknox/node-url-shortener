import _ from 'lodash';
import UrlModel from '../models/url.model.js';
import genShortHash from '../utils/genShortHash.js';
import AppError from '../utils/AppError.js';
import httpStatus from 'http-status';
import { redis } from '../../redis/index.js';

const generateShortUrl = async (originalUrl, userId) => {
  const shortHash = await genShortHash(`${originalUrl}${userId}`);
  const checkExistingHash = await UrlModel.findOne({ shortHash });
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

const resolveShortUrl = async (shortHash) => {
  // Check cache
  const originalUrl = await redis.get(shortHash);
  if (originalUrl) return originalUrl;
  const urlInfo = await UrlModel.findOne({ shortHash }, { originalUrl: 1 });
  if (!urlInfo) throw new AppError(httpStatus.NOT_FOUND, 'No url found');
  return _.get(urlInfo, 'originalUrl');
};

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
