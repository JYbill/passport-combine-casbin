import { Context } from 'egg';
/**
 * @file: casbin.middleware.ts
 * @author: xiaoqinvar
 * @desc：casbin 鉴权中间件 RBAC + ABAC
 * @date: 2022-08-12 14:24:41
 */
import { HttpStatus, IMiddleware, MidwayHttpError, NextFunction, ILogger, IMidwayLogger } from '@midwayjs/core';
import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { EnforceContext, Enforcer } from 'casbin';

@Middleware()
export class CasbinMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject('enforcer')
  private enforcer: Enforcer;

  @Inject()
  logger: IMidwayLogger;

  @Config('middlewareWhiteList')
  ignoreWhiteList: string[];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 整理参数
      // jwt 认证后的用户对象
      const subject = ctx.state.user;
      // 请求的资源，即http://localhost:7001/user/info
      // 这里就是/user/info，底层与koa用法一致 `ctx.path`
      const object = ctx.path;
      // 这里不用多说就是 GET、...、DELETE请求方法
      const effect = ctx.method;
      // this.logger.info(subject);
      // this.logger.info(object);
      // this.logger.info(effect);

      // 鉴权操作RBAC
      const auth1 = await this.enforcer.enforce(subject, object, effect);

      // 鉴权操作ABAC
      const enforceContext = new EnforceContext('r2', 'p2', 'e2', 'm2');
      const auth2 = await this.enforcer.enforce(enforceContext, subject, object, effect);

      // 无权限
      // this.logger.info(auth1, auth2);
      if (!(auth1 && auth2)) {
        throw new MidwayHttpError('🚪 当前用户无权限访问', HttpStatus.FORBIDDEN);
      }
      const result = await next();
      return result;
    };
  }

  static getName(): string {
    return 'casbin-middleware';
  }

  /**
   * 忽略配置白名单
   * @param ctx
   * @returns
   */
  ignore(ctx: Context): boolean {
    return this.ignoreWhiteList.includes(ctx.path);
  }
}
