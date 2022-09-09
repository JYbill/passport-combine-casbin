/**
 * @file: isRoot.decorator.ts
 * @author: xiaoqinvar
 * @desc：判断
 * @date: 2022-09-09 11:16:36
 */
import { getCurrentApplicationContext, getCurrentMainApp } from '@midwayjs/core';
import { createCustomMethodDecorator, JoinPoint } from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

// id
export const IS_ROOT_KEY = 'decorator:isRoot';

export function IsRoot(): MethodDecorator {
  // 我们传递了一个可以修改展示格式的参数
  return createCustomMethodDecorator(IS_ROOT_KEY, {});
}

/**
 * 通知配置
 * @param options
 * @returns
 */
export const isRootNotice = options => {
  return {
    // 环绕通知
    around: async (joinPoint: JoinPoint) => {
      const ctx: Context = joinPoint.target['ctx'];
      console.log(ctx.state.user);

      // 执行原方法
      const result = await joinPoint.proceed(...joinPoint.args);

      // 返回执行结果
      return result;
    },
  };
};
