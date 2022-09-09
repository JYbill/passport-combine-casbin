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
    midwayLogger: {},
  } as MidwayConfig & DefaultConfig;
};
