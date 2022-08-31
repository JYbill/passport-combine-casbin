import { IMiddleware } from '@midwayjs/core';
import { Config, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/web';

/**
 * 返回值校验，数据聚合中间件 BFF中间件
 */
@Middleware()
export class ResultMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('ignoreWhiteList')
  ignoreWhiteList: string[];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      return {
        code: 200,
        success: true,
        data: result,
        message: '🚀 ok.',
      };
    };
  }

  static getName(): string {
    return 'result.middleware';
  }

  ignore(ctx: Context): boolean {
    return this.ignoreWhiteList.includes(ctx.path);
  }
}
