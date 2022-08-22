// src/filter/validate.filter
import { Catch } from '@midwayjs/decorator';
import { MidwayValidationError } from '@midwayjs/validate';
import { Context } from '@midwayjs/web';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    const logger = ctx.logger;

    // Node 15-， 懒得用nvm换了，直接double call，'"xxx" is required' -> 'xxx is required'
    err.message = err.message.replace('"', '');
    err.message = err.message.replace('"', '');
    return {
      status: 422,
      success: false,
      message: err.message,
    };
  }
}
