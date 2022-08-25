import { createApp, close, createHttpRequest, createBootstrap } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';
import * as assert from 'assert';
import { join } from 'path';
import { IMidwayBaseApplication } from '@midwayjs/core';

describe('test/controller/v1/user.controller.test.ts', () => {
  let app: IMidwayBaseApplication<any>;
  let token: string;

  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
    const loginRet = await createHttpRequest(app).post('/v1/user/login').send({
      username: 'MR-frog',
      password: 'frog-password',
    });
    token = 'Bearer ' + loginRet.body.data;
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
});
