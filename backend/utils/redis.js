const { createClient } = require('redis');
require('dotenv').config();

const redisOptions = {
  password: process.env.REDIS_PASSWORD,
};

if (process.env.REDIS_HOST) {
  redisOptions.socket = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
  };
} else if (process.env.REDIS_URL) {
  redisOptions.url = process.env.REDIS_URL;
} else {
  redisOptions.socket = {
    host: 'localhost',
    port: 6379,
  };
}

const redisClient = createClient(redisOptions);

redisClient.on('error', (err) => console.log('Redis Error:', err));
redisClient.on('connect', () => console.log('Redis Connecting...'));
redisClient.on('ready', () => console.log('Redis Ready!'));

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('Redis connected');
    }
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
})();

module.exports = { redisClient, redisOptions };