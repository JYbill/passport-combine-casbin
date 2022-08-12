import { Catch } from '@midwayjs/decorator';
import { Context } from 'egg';

// 捕获所有的错误
@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    const logger = ctx.getLogger();
    logger.error(err);

    return {
      code: 500,
      success: false,
      message: err.message,
    };
  }
}
