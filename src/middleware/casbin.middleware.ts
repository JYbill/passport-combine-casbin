import { Context } from 'egg';
/**
 * @file: casbin.middleware.ts
 * @author: xiaoqinvar
 * @desc：casbin 鉴权中间件
 * @date: 2022-08-12 14:24:41
 */
import {
  HttpStatus,
  IMiddleware,
  MidwayHttpError,
  NextFunction,
} from '@midwayjs/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { Casbin } from '../ioc/casbin';

@Middleware()
export class CasbinMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  private casbin: Casbin;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // init
      const enforcer = this.casbin.getEnforcer();
      // uri：/v1/xxx
      const path = ctx['path'];
      // header
      const header = ctx['header'];
      const logger = ctx.getLogger();

      // 整理参数
      const subject = '';
      const object = '/error';
      const effect = ctx;

      // 鉴权操作
      const auth = await enforcer.enforce(subject, object, effect);
      if (!auth) {
        // 无权限
        throw new MidwayHttpError(
          '🚪 当前用户无权限访问',
          HttpStatus.FORBIDDEN
        );
      }
      const result = await next();
      return result;
    };
  }

  static getName(): string {
    return 'casbin-middleware';
  }
}
