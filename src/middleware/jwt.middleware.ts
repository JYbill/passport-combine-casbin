import { Config, Middleware } from '@midwayjs/decorator';
import { PassportMiddleware, AuthenticateOptions } from '@midwayjs/passport';
import { Context } from '@midwayjs/web';
import { JwtStrategy } from '../strategy/jwt.strategy';

/**
 * midway官网示例
 */
@Middleware()
export class JwtPassportMiddleware extends PassportMiddleware(JwtStrategy) {
  @Config('middlewareWhiteList')
  ignoreWhiteList: string[];

  getAuthenticateOptions(): Promise<AuthenticateOptions> | AuthenticateOptions {
    return {
      failureMessage: 'json wb token is bad. 🔐 please check token!',
    };
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
