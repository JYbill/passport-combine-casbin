import { MidwayHttpError } from '@midwayjs/core';
import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { Config, ContentType, Controller, Get, HttpCode, Inject, Query, Redirect } from '@midwayjs/decorator';
import { GithubAuthResponse } from '../../interface';
import { GithubPassportMiddleware } from '../../middleware/github.middleware';
import { AuthService } from '../../service/auth.service';
import BaseController from '../base.controller';

@Controller('/v1/auth')
export class CasbinController extends BaseController {
  @Inject()
  authService: AuthService;
  @Config('github')
  githubLoginConfig: Record<string, string>;

  // 不推荐该方式，本身这些参数都没有私密可言
  // @Get('/github', { middleware: [GithubPassportMiddleware] })
  // @Get('/github')
  // @ContentType('html')
  // async github() {
  //   return this.authService.requestGithub();
  // }

  /**
   * 这里是github设置的重定向页面，会拿到一个`状态码`
   * @param githubQuery
   * @returns
   */
  // @Get('/github/cb', { middleware: [GithubPassportMiddleware] })
  @Get('/github/cb')
  @HttpCode(302)
  async githubOAuthCallback(@Query() githubQuery: GithubAuthResponse) {
    // this.logger.info(githubQuery);
    // 用户拒绝
    if (!githubQuery.code) {
      throw new BadRequestError(githubQuery.error_description);
    }
    const token = await this.authService.requestGithubToken(githubQuery.code);

    let redirectUrl = this.githubLoginConfig['redirect'];
    redirectUrl += `#state=${githubQuery.state}&auth=${token}`;
    this.ctx.redirect(redirectUrl);
  }
}
