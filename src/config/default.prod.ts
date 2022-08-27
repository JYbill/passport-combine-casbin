import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core';
export default (appInfo: MidwayAppInfo) => {
  return {
    egg: {
      port: 7101,
    },
  } as MidwayConfig;
};
