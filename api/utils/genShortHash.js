import { nanoid } from 'nanoid';
import crypto from 'crypto';
import base58 from 'bs58';

const genShortHash = async (seed) => {
  const nanoHash = nanoid();
  const hash = crypto.createHash('sha256').update(seed + nanoHash).digest('hex');
  return base58.encode(Buffer(hash)).slice(0, 7);
};

export default genShortHash;
