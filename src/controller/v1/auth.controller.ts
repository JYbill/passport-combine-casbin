import { Controller, Get, Query } from '@midwayjs/decorator';
import { GithubAuthResponse } from '../../interface';
import { GithubPassportMiddleware } from '../../middleware/github.middleware';
import BaseController from '../base.controller';

@Controller('/v1/auth')
export class CasbinController extends BaseController {
  /**
   * 该接口什么都不需要写，passport-github策略已帮我们完成逻辑，这里会返回github域下的一个授权页面
   */
  @Get('/github', { middleware: [GithubPassportMiddleware] })
  async githubOAuth() {}

  /**
   * 这里是github设置的重定向页面，会拿到一个状态码
   * @param githubQuery
   * @returns
   */
  @Get('/github/cb', { middleware: [GithubPassportMiddleware] })
  async githubOAuthCallback(@Query() githubQuery: GithubAuthResponse) {
    return githubQuery.code;
  }
}
