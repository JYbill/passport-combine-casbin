import { createApp, close, createHttpRequest, createBootstrap } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';
import * as assert from 'assert';
import { join } from 'path';
import { IMidwayBaseApplication } from '@midwayjs/core';

/**
 * ζ³¨ε
 */
export const registerFunc = async app => {
  await createHttpRequest(app).post('/v1/user/register').send({
    username: 'MR-frog',
    password: 'frog-password',
    nickname: 'εε£³π',
  });
};

/**
 * η»ι
 * @returns token
 */
const loginFunc = async app => {
  const loginRet = await createHttpRequest(app).post('/v1/user/login').send({
    username: 'MR-frog',
    password: 'frog-password',
  });
  // expect(loginRet.status).toBe(200);
  // expect(loginRet.body.success).toBe(true);
  return {
    success: loginRet.body.success,
    token: 'Bearer ' + loginRet.body.data,
  };
};

/**
 * η»ιε€±θ΄₯ to ζ³¨εεη»ι
 * @returns token
 */
export const loginIsBad2RegisterFunc = async app => {
  let { token, success } = await loginFunc(app);
  if (!success) {
    await registerFunc(app);
    token = (await loginFunc(app)).token;
  }
  // console.log(token);
  return token;
};

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

  // ζ£ζ΅εε
  it('should GET /v1/user/checkUsername', async () => {
    const res = await createHttpRequest(app).get('/v1/user/checkUsername').query({ username: 'test' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // η»ι -> ζ ‘ιͺtoken
  it('should POST /v1/user/verify', async () => {
    const res = await createHttpRequest(app).post('/v1/user/verify').set({
      authorization: token,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // θ·εζζη¨ζ·
  it('should GET /v1/user getUser', async () => {
    const res = await createHttpRequest(app).get('/v1/user').set({
      authorization: token,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ζ΄ζ°
  it('should PUT /v1/user updateOne', async () => {
    const res = await createHttpRequest(app).put('/v1/user').set({
      authorization: token,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ζ°ε’
  it('should POST /v1/user ', async () => {
    const res = await createHttpRequest(app).post('/v1/user').set({
      authorization: token,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
  });

  // ε ι€
  it('should DELETE /v1/user ', async () => {
    const res = await createHttpRequest(app).delete('/v1/user').set({
      authorization: token,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
  });

});
