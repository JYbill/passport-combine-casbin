import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';
import * as assert from 'assert';

describe('test/controller/v1.test.ts', () => {
  let app: Application;

  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('should GET v1', async () => {
    // GET /v1/
    const v1Result = await createHttpRequest(app).get('/v1/');
    expect(v1Result.status).toBe(200);
    expect(v1Result.text).toBe('hello v1 api.');
  });
});
