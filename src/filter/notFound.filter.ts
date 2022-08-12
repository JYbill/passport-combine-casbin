import { MidwayError, httpError } from '@midwayjs/core';
import { Catch } from '@midwayjs/decorator';
import { Context } from 'egg';

// 捕获midwayError错误和他所有的子类
@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayError, ctx: Context) {
    const logger = ctx.getLogger();
    logger.warn(err.message);

    return {
      code: err.code,
      message: err.message,
    };
  }
}
