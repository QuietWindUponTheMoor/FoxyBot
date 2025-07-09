import { createClient } from "redis";

let redis = createClient({
    url: process.env.redisURI
});

redis.on("error", error => {
    console.error(`[${new Date().toISOString()}] [Redis Error]`, error);
});

redis.on("connect", () => {
    console.error(`[${new Date().toISOString()}] [Redis] Connected`);
});

redis.on("ready", () => {
    console.error(`[${new Date().toISOString()}] [Redis] Ready`);
});

(async () => {
    await redis.connect();
})();

export default redis;