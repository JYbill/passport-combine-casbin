import { MidwayHttpError } from '@midwayjs/core';
import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { GithubAuthResponse } from '../../interface';
import { GithubPassportMiddleware } from '../../middleware/github.middleware';
import { AuthService } from '../../service/auth.service';
import BaseController from '../base.controller';

@Controller('/v1/auth')
export class CasbinController extends BaseController {
  @Inject()
  authService: AuthService;

  /**
   * 该接口什么都不需要写，passport-github策略已帮我们完成逻辑，这里会返回github域下的一个授权页面
   */
  @Get('/github', { middleware: [GithubPassportMiddleware] })
  async githubOAuth() {}

  /**
   * 这里是github设置的重定向页面，会拿到一个`状态码`
   * @param githubQuery
   * @returns
   */
  @Get('/github/cb', { middleware: [GithubPassportMiddleware] })
  async githubOAuthCallback(@Query() githubQuery: GithubAuthResponse) {
    this.logger.info(githubQuery);
    // 用户拒绝
    if (!githubQuery.code) {
      throw new BadRequestError(githubQuery.error_description);
    }
    return this.authService.requestGithubToken(githubQuery.code);
  }

  /**
   * 获取token码
   * @param githubQuery
   * @returns
   */
  @Get('/github/token', { middleware: [GithubPassportMiddleware] })
  async getGithubToken(@Query() githubQuery) {
    this.logger.info(githubQuery);
    return githubQuery;
  }
}
