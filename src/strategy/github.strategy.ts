import { IMidwayLogger } from '@midwayjs/core';
import { Config, Logger } from '@midwayjs/decorator';
import { CustomStrategy, PassportStrategy } from '@midwayjs/passport';
import { Strategy } from 'passport-github';

@CustomStrategy()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  env = process.env;

  @Config('egg.port')
  port: number;

  @Logger()
  logger: IMidwayLogger;

  /**
   * 这里可以拿到自己登陆的非私密性的信息，如：github个性简介、email、居住地、用户名...
   * @param payload
   * @returns
   */
  async validate(...payload) {
    // this.logger.info(payload);
    return payload;
  }
  getStrategyOptions() {
    return {
      // 下面这三个参数要和你github oauth设置的一样！否则
      clientID: this.env.GITHUB_CLIENT_ID,
      clientSecret: this.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://localhost:${this.port}/v1/auth/github/cb`,
    };
  }
}
