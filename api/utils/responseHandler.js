import logger from '../../logger/index.js';
/**
 *  Response Handler
 * @param {Object} res
 * @param {Object} data
 * @param {Number} responseCode
 */
const responseHandler = (req, res, data, responseCode = 200) => {
  const success = !(responseCode >= 400 && responseCode <= 599);
  res.status(responseCode).send({ success, data });
  logger.logRequest(req, responseCode);
};

export default responseHandler;
