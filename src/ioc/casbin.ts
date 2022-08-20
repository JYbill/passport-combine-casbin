/**
 * @file: casbin.ts
 * @author: xiaoqinvar
 * @desc：casbin 动态函数注入enforce
 * @date: 2022-08-20 18:42:15
 */
import { IMidwayContainer, providerWrapper } from '@midwayjs/core';
import { ScopeEnum } from '@midwayjs/decorator';
import { CasbinFactory } from './casbinFactory';

export async function dynamicCasbinHandler(container: IMidwayContainer) {
  try {
    const casbin: CasbinFactory = await container.getAsync('casbinFactory');
    return casbin.enforcer;
  } catch (error) {
    console.log(error);
  }
}

providerWrapper([
  {
    id: 'enforcer',
    provider: dynamicCasbinHandler,
    scope: ScopeEnum.Singleton, // 也可以设置为全局作用域，那么里面的调用的逻辑将被缓存
  },
]);
