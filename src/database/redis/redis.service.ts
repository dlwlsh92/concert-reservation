import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: "localhost", // Redis server host
      port: 6379, // Redis server port
    });
  }

  onModuleInit() {
    this.redisClient.on("connect", () => console.log("Connected to Redis"));
    this.redisClient.on("error", (err) => console.error("Redis error", err));
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async getClient() {
    return this.redisClient;
  }

  async set(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.redisClient.set(key, value, "PX", ttl);
    } else {
      return this.redisClient.set(key, value);
    }
  }
}
