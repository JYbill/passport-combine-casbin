import { MidwayError, httpError } from '@midwayjs/core';
import { Catch } from '@midwayjs/decorator';
import { Context } from 'egg';

// 捕获midwayError错误和他所有的子类
@Catch([MidwayError], {
  matchPrototype: true,
})
export class MidwayHttpErrorFilter {
  async catch(err: MidwayError, ctx: Context) {
    const logger = ctx.getLogger();
    logger.error(err);

    return {
      code: err.code,
      success: false,
      message: err.message,
    };
  }
}
