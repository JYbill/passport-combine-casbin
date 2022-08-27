/**
 * @file: github.middleware.ts
 * @author: xiaoqinvar
 * @desc：不需要写其他的，其他的方法passport-github已经帮我们完成
 * @date: 2022-08-27 21:12:50
 */
import { IMidwayLogger, MidwayFeatureNoLongerSupportedError, ILogger } from '@midwayjs/core';
import { GithubStrategy } from './../strategy/github.strategy';
import { AuthenticateOptions, PassportMiddleware } from '@midwayjs/passport';
import { Middleware } from '@midwayjs/decorator';

@Middleware()
export class GithubPassportMiddleware extends PassportMiddleware(GithubStrategy) {
  getAuthenticateOptions(): AuthenticateOptions | Promise<AuthenticateOptions> {
    return {};
  }
}
