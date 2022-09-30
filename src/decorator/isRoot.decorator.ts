/**
 * @file: isRoot.decorator.ts
 * @author: xiaoqinvar
 * @desc：判断
 * @date: 2022-09-09 11:16:36
 */
import { getCurrentApplicationContext, getCurrentMainApp, MethodHandlerFunction } from '@midwayjs/core';
import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { createCustomMethodDecorator, JoinPoint } from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';
import { EnforceContext, Enforcer } from 'casbin';
import { CasbinService } from '../service/casbin.service';
import { UserService } from '../service/user.service';

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
export const isRootNotice: MethodHandlerFunction = options => {
  return {
    // 环绕通知
    around: async (joinPoint: JoinPoint) => {
      const continer = getCurrentApplicationContext();
      const logger = getCurrentMainApp().getLogger();
      const ctx: Context = joinPoint.target['ctx'];

      // 只要是删除操作、更新用户的isAdmin操作都会进行判断是否是管理员
      const DELETE_METHOD = 'DELETE';
      const isDeleteMethod = ctx.request.method === DELETE_METHOD;
      const isUpdateAdminRole = ctx.request.body['isAdmin'];
      if (isUpdateAdminRole || isDeleteMethod) {
        const enforcer = await continer.getAsync<Enforcer>('enforcer');
        const enforceContext = new EnforceContext('r', 'p', 'e', 'm3');
        const sub = ctx.state.user;
        const obj = ctx.request.path;
        const eft = ctx.request.method;
        const isPass = await enforcer.enforce(enforceContext, sub, obj, eft);
        if (!isPass) {
          throw new BadRequestError('☠️ 当前用户不支持修改');
        }
      }

      // 执行原方法
      const result = await joinPoint.proceed(...joinPoint.args);

      // 返回执行结果
      return result;
    },
    // 后置通知
    // after
    // 前置通知
    // before
  };
};
