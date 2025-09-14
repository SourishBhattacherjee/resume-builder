const { createClient } = require('redis');
env = require('dotenv').config();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'localhost',
    port: 6379
  }
});

redisClient.on('error', (err) => console.log('Redis Error:', err));
redisClient.on('connect', () => console.log('Redis Connecting...'));
redisClient.on('ready', () => console.log('Redis Ready!'));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected with password');
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
})();

module.exports = redisClient;