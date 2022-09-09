// src/filter/validate.filter
import { Catch } from '@midwayjs/decorator';
import { MidwayValidationError } from '@midwayjs/validate';
import { Context } from '@midwayjs/web';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    const logger = ctx.logger;
    return {
      status: 422,
      success: false,
      message: `[Validate Error] ${err.message}`,
    };
  }
}
