import UrlService from '../services/url.service.js';
import catchAsync from '../utils/catchAsync.js';
import responseHandler from '../utils/responseHandler.js';


const generate = catchAsync(async (req, res) => {
  const { body: { url }, user } = req;
  const urlInfo = await UrlService.generateShortUrl(url, user._id);
  responseHandler(req, res, urlInfo);
});

const getAllUrls = catchAsync(async (req, res) => {
  const { user } = req;
  const urls = await UrlService.getShortUrls(user._id);
  responseHandler(req, res, urls);
});

const resolve = catchAsync(async (req, res) => {
  const { params: { shortUrl } } = req;
  const originalUrl = await UrlService.resolveShortUrl(shortUrl);
  // Redirect to original
  res.redirect(originalUrl);
});

const deleteUrl = catchAsync(async (req, res) => {
  const { params: { shortUrl }, user } = req;
  await UrlService.deleteShortUrl(shortUrl, user._id);
  responseHandler(req, res, null, 204);
});

export default {
  generate,
  getAllUrls,
  resolve,
  deleteUrl,
};
