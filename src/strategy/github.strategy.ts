import { IMidwayLogger } from '@midwayjs/core';
import { Config, Logger } from '@midwayjs/decorator';
import { CustomStrategy, PassportStrategy } from '@midwayjs/passport';
import { Strategy } from 'passport-github2';
/**
 * @file: github.strategy.ts
 * @author: xiaoqinvar
 * @desc：此项目未使用该方式，passport-github 和 passport-github2 都是3年前东西连commit都没提过了，推荐使用github文档的方式，本项目采用github文档的流程
 * @doc：https://docs.github.com/cn/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
 * @date: 2022-08-31 09:59:38
 */
@CustomStrategy()
export class GithubStrategy extends PassportStrategy(Strategy, 'github2') {
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
      // 下面这三个参数要和你github oauth设置的一样！否则github会返回错误信息
      clientID: this.env.GITHUB_CLIENT_ID,
      clientSecret: this.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://127.0.0.1:${this.port}/v1/auth/github/cb`,
    };
  }
}
