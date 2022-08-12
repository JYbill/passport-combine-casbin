import { Context, IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction } from '@midwayjs/web';

/**
 * 打印日志中间件
 */
@Middleware()
export class LogMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const logger = ctx.getLogger('middlewareLogger');
      const result = await next();
      logger.info(result);
      return result;
    };
  }

  static getName(): string {
    return 'log';
  }
}
