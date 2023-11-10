import logger from '../../logger/index.js';
import TierModel from '../models/tier.model.js';
import UserModel from '../models/user.model.js';
import _ from 'lodash';

const checkUserQualifiedForTier = (userId) => {
  // Check user against subscription etc.
  // Otherwise default
  return 'tier-3';
};

const associateUserWithTier = async (userId) => {
  const tier = checkUserQualifiedForTier(userId);
  const tierInfo = await TierModel.findOne({ name: tier });
  const tierId = _.get(tierInfo, '_id');
  if (!tierId) {
    logger.error('Tier requested not found: ', tier);
    return;
  }
  console.log(userId, tierId);
  await UserModel.findByIdAndUpdate(userId, { tierId });
};

export default {
  associateUserWithTier,
};
