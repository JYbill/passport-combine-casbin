import { EggAppConfig, PowerPartial } from 'egg';
import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: MidwayAppInfo) => {
  return {
    egg: {
      port: null,
    },
    security: {
      csrf: false,
    },
    middlewareWhiteList: ['/v1/user/login', '/v1/user/register', '/v1/user/checkUsername'],
  } as MidwayConfig & DefaultConfig;
};
