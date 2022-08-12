import { PrismaClientServiceFactory } from './PrismaFactory';
import { IMidwayContainer, providerWrapper } from '@midwayjs/core';
import { ScopeEnum } from '@midwayjs/decorator';

export async function dynamicPrismaClientHandler(container: IMidwayContainer) {
  try {
    const prismaClient: PrismaClientServiceFactory = await container.getAsync(
      'prismaClientServiceFactory'
    );
    return prismaClient.get();
  } catch (error) {
    console.log(error);
  }
}

providerWrapper([
  {
    id: 'prismaClient',
    provider: dynamicPrismaClientHandler,
    scope: ScopeEnum.Singleton, // 也可以设置为全局作用域，那么里面的调用的逻辑将被缓存
  },
]);
