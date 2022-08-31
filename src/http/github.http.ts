import { HttpService } from '@midwayjs/axios';
import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { AxiosResponse } from 'axios';

/**
 * @file: github.http.ts
 * @author: xiaoqinvar
 * @desc：github 相关接口
 * @date: 2022-08-31 10:33:07
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class GithubApi {
  @Inject()
  httpService: HttpService;

  /**
   * 获取用户信息
   * @param token
   * @returns
   */
  getUser(token: string): Promise<AxiosResponse<Record<string, string | number | any>>> {
    return this.httpService.get('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: token,
      },
    });
  }
}
