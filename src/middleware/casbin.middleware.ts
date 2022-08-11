import { Context, IMiddleware, IMidwayLogger } from '@midwayjs/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { NextFunction } from '@midwayjs/web';

@Middleware()
export class LogMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  logger: IMidwayLogger;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      this.logger.info(null);
      await next();
    };
  }

  static getName(): string {
    return 'log';
  }
}
