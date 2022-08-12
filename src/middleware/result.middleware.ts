import { Context, IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction } from '@midwayjs/web';

/**
 * 返回值校验，数据聚合中间件 BFF中间件
 */
@Middleware()
export class ResultMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      return {
        code: 200,
        data: result,
        message: '🚀 ok.',
      };
    };
  }

  static getName(): string {
    return 'result.middleware';
  }
}
