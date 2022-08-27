import { createApp, close, createHttpRequest, createBootstrap } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';
import * as assert from 'assert';
import { join } from 'path';
import { IMidwayBaseApplication } from '@midwayjs/core';
import { loginIsBad2RegisterFunc } from './user.controller.test';

describe('test/controller/v1/user.controller.test.ts', () => {
  let app: IMidwayBaseApplication<any>;
  let token: string;

  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
    token = await loginIsBad2RegisterFunc(app);
  });

  afterAll(async () => {
    await close(app);
  });

  // 根据角色获取所有用户(包括继承的角色)
  it('should GET /v1/casbin/users', async () => {
    const verifyRes = await createHttpRequest(app)
      .get('/v1/casbin/users')
      .set({
        authorization: token,
      })
      .query({
        roleName: 'MANAGER',
      });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
  });

  // 更新策略
  it('should GET /v1/casbin/update', async () => {
    const verifyRes = await createHttpRequest(app).get('/v1/casbin/update');
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
  });

  // 测试redis watcher
  it('should GET /v1/casbin/testWatcher', async () => {
    const verifyRes = await createHttpRequest(app).get('/v1/casbin/testWatcher');
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
  });
});
