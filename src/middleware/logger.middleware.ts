import { IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/web';

/**
 * 打印日志中间件
 */
@Middleware()
export class LogMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const logger = ctx.getLogger('middlewareLogger');

      // 打印参数信息
      let logInfo;
      if (ctx.method === 'GET') {
        logInfo = { query: ctx.query };
      } else {
        logInfo = { body: ctx.request.body };
      }
      logger.info(logInfo);
      const result = await next();
      return result;
    };
  }

  static getName(): string {
    return 'log';
  }
}
