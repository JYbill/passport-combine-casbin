import { HttpService } from '@midwayjs/axios';
import { Config, Inject, Provide } from '@midwayjs/decorator';
import { UserVo } from '../vo/user.vo';
import BaseService from './base.service';

@Provide()
export class AuthService extends BaseService<UserVo> {
  @Inject()
  httpService: HttpService;

  @Config('egg.port')
  port: number;

  model = 'user';
  env = process.env;

  async requestGithubToken(code: string): Promise<object> {
    this.logger.info(code);
    const result = await this.httpService.post(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id: this.env.GITHUB_CLIENT_ID,
        client_secret: this.env.GITHUB_CLIENT_SECRET,
        redirect_uri: `http://localhost:${this.port}/v1/auth/github/cb`,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    this.logger.info(result);
    return result.data;
  }
}
