import { Redis } from 'ioredis';

let redis;

const initRedisClient = () => {
  if (!redis) {
    redis = new Redis({
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      username: 'default', // needs Redis >= 6
      password: 'supersecret',
      db: 0, // Defaults to 0
    });
  }
};

const closeRedisClient = () => {
  console.log('Closing redis conn...');
  redis.disconnect();
};

export {
  initRedisClient,
  redis,
  closeRedisClient,
};


