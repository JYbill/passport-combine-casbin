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
  });

  afterAll(async () => {
    await close(app);
  });

  // 检测同名
  it('should GET /v1/user/checkUsername', async () => {
    const res = await createHttpRequest(app).get('/v1/user/checkUsername').query({ username: 'test' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 注册
  it('should POST /v1/user/register', async () => {
    const res = await createHttpRequest(app).post('/v1/user/register').send({
      username: 'MR-frog',
      password: 'frog-password',
      nickname: '土壳马',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 登陆 -> 校验token
  it('should POST /v1/user/login and /v1/user/verify', async () => {
    const loginRet = await createHttpRequest(app).post('/v1/user/login').send({
      // username: 'MR-frog',
      // password: 'frog-password',
      username: 'xiaoqinvar',
      password: '1234567890',
    });
    token = 'Bearer ' + loginRet.body.data;
    const res = await createHttpRequest(app).post('/v1/user/verify').set({
      authorization: token,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
