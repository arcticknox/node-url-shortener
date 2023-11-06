import _ from 'lodash';
import UrlModel from '../models/url.model.js';
import genShortHash from '../utils/genShortHash.js';
import AppError from '../utils/AppError.js';
import httpStatus from 'http-status';

const generateShortUrl = async (originalUrl, userId) => {
  const shortHash = await genShortHash(`${originalUrl}${userId}`);
  const checkExistingHash = await UrlModel.findOne({ shortHash });
  if (checkExistingHash) {
    shortHash = await genShortHash(`${originalUrl}${userId}`);
  }
  return UrlModel.create({ originalUrl, shortHash, userId });
};

const getShortUrls = async (userId) => {
  return UrlModel.find({ userId });
};

const resolveShortUrl = async (shortHash) => {
  const urlInfo = await UrlModel.findOne({ shortHash }, { originalUrl: 1 });
  if (!urlInfo) throw new AppError(httpStatus.NOT_FOUND, 'No url found');
  return _.get(urlInfo, 'originalUrl');
};

const deleteShortUrl = async (_id, userId) => {
  return UrlModel.findByIdAndUpdate({ _id, userId }, { isDeleted: true } );
};

export default {
  generateShortUrl,
  getShortUrls,
  resolveShortUrl,
  deleteShortUrl,
};
