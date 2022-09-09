import { resolve } from 'path';
import { IMidwayLogger } from '@midwayjs/core';
import { Config, Init, Inject, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Enforcer, newEnforcer, newModel, newModelFromString, Util } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { RedisWatcher } from '@casbin/redis-watcher';
import { UserService } from '../service/user.service';
import { Context } from '@midwayjs/web';

@Provide()
@Scope(ScopeEnum.Singleton)
export class CasbinFactory {
  enforcer: Enforcer;

  @Logger()
  logger: IMidwayLogger;

  @Config('redis')
  redisConfig;

  @Inject()
  ctx: Context;

  env = process.env;

  @Init()
  public async init(): Promise<void> {
    const adapter = await PrismaAdapter.newAdapter();
    const model = newModelFromString(`
    [request_definition]
    r = sub, obj, act
    r2 = sub, obj, act, eft

    [policy_definition]
    p = sub, obj, act
    p2= sub_rule, obj, act, eft

    [role_definition]
    g = _, _
    g2 = _, _

    [policy_effect]
    e = some(where (p.eft == allow))
    e2 = !some(where (p.eft == deny))

    [matchers]
    #RABC
    m = g(r.sub.username, p.sub) && g2(r.obj, p.obj) && r.act == p.act || r.sub.role == 'ROOT'
    #ABAC
    m2 = eval(p2.sub_rule) && r2.obj == p2.obj && r2.act == p2.act && p2.eft == 'allow'
    #ABAC: 当且仅当为ROOT时才能执行
    m3 = isRoot(r.sub.id, p.obj)
    `);
    this.enforcer = await newEnforcer(model, adapter);

    // setting redis watcher.
    const redisURL = this.env.REDIS_URL;
    const watcher = await RedisWatcher.newWatcher(redisURL);
    this.enforcer.setWatcher(watcher);
    // 其他分布式项目对casbin进行增删改权限时，会通过redis 发布订阅模型进行通知，此时只需要load一下加载db内对权限同步进内存即可
    watcher.setUpdateCallback(() => {
      this.enforcer.loadPolicy();
      this.logger.warn('casbin is updating.');
    });

    // 用户继承
    await this.enforcer.addRoleForUser('xiaoqinvar', 'MANAGER');
    await this.enforcer.addRoleForUser('MR-frog', 'MANAGER');

    // 资源继承
    await this.enforcer.addNamedGroupingPolicy('g2', '/v1/casbin/users', 'casbinGetApi');
    await this.enforcer.addNamedGroupingPolicy('g2', '/v1/user', 'userGetApi');
    await this.enforcer.addNamedGroupingPolicy('g2', '/v1/user/verify', 'userPostApi');
    await this.enforcer.addNamedGroupingPolicy('g2', '/v1/user/:id', 'userPutApi');
    // 所有后缀是复数的api，都属于原子操作，即有一个添加失败即全部都失败，理解为db的事物回滚，所以你数据库中有一项同样的规则及全部插入失败
    // doc：https://casbin.org/docs/zh-CN/management-api#addgroupingpolicies
    // await this.enforcer.addNamedGroupingPolicies('g2', [[]]);

    // 策略p
    await this.enforcer.addNamedPolicy('p', 'MANAGER', 'casbinGetApi', 'GET');
    await this.enforcer.addNamedPolicy('p', 'MANAGER', 'userGetApi', 'GET');
    await this.enforcer.addNamedPolicy('p', 'MANAGER', 'userPostApi', 'POST');
    await this.enforcer.addNamedPolicy('p', 'MANAGER', 'userPutApi', 'PUT');

    // 启用/:id动态路由解析函数
    // 🌰：/v1/user/12345 通过该工具函数解析成可以访问 /v1/user/:id接口
    await this.enforcer.addNamedMatchingFunc('g2', Util.keyMatch2Func);

    // 自定义函数
    await this.enforcer.addFunction('isRoot', this.isRoot);

    this.logger.warn('casbin is ready.');
  }

  /**
   * casbin 自定义方法是否是管理员
   * @param subjectId
   * @param object
   * @returns
   */
  async isRoot(subjectId: string, object: string): Promise<boolean> {
    const userService = await this.ctx.requestContext.getAsync(UserService);
    return userService.isRoot(subjectId);
  }
}
