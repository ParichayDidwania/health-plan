const redis = require("redis");
const db = require("./db");

connectRedis = async () => {
    const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

    const redisClient = await redis.createClient({ url: url }).connect();

    console.log("Connected to Redis Successfully");

    db.redis = redisClient;
}

module.exports = connectRedis;
