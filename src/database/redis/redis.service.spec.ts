import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

describe('redis 테스트 코드 작성', () => {
  let redisService: RedisService;
  let configService: ConfigService;

  beforeAll(() => {
    configService = new ConfigService();
    redisService = new RedisService(configService);
  });

  afterAll(async () => {
    const client = await redisService.getClient();
    await client.del('test');
    await client.del('test1');
    redisService.onModuleDestroy();
  });

  it('redisService가 정상적으로 생성되는가', () => {
    expect(redisService).toBeInstanceOf(RedisService);
  });

  it('redisService의 getClient 메서드가 정상적으로 동작하는가', async () => {
    const client = await redisService.getClient();
    expect(client).toBeDefined();
  });

  it('redisService의 set 메서드가 정상적으로 동작하는가', async () => {
    const result = await redisService.set('test', 'test');
    expect(result).toBe('OK');
  });

  it('redisService의 get 메서드가 정상적으로 동작하는가', async () => {
    await redisService.set('test1', 'test1');
    const result = await redisService.get('test1');
    expect(result).toBe('test1');
  });
});
