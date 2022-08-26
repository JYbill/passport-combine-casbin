import { IMidwayLogger } from '@midwayjs/core';
import { Config, Init, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Enforcer, newEnforcer, newModelFromString } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { RedisWatcher } from '@casbin/redis-watcher';

@Provide()
@Scope(ScopeEnum.Singleton)
export class CasbinFactory {
  enforcer: Enforcer;

  @Logger()
  logger: IMidwayLogger;

  @Config('redis')
  redisConfig;

  env = process.env;

  @Init()
  public async init(): Promise<void> {
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
    m = g(r.sub.username, p.sub) && g2(r.obj, p.obj) && r.act == p.act || r.sub.role == 'root'
    #ABAC
    m2 = eval(p2.sub_rule) && r2.obj == p2.obj && r2.act == p2.act && p2.eft == 'allow'
    `);
    const adapter = await PrismaAdapter.newAdapter();
    this.enforcer = await newEnforcer(model, adapter);

    // setting redis watcher.
    const redisURL = this.env.REDIS_URL;
    // this.logger.info('redis connection url is');
    // this.logger.info(redisURL);
    // this.logger.info(this.redisConfig.clients.cache);
    // const watcher = await RedisWatcher.newWatcher(this.redisConfig.clients.cache);
    // this.logger.info(watcher);
    const watcher = await RedisWatcher.newWatcher('redis://:990415@101.35.13.180:6379');
    this.enforcer.setWatcher(watcher);
    // this.enforcer.savePolicy();

    // 用户继承
    await this.enforcer.addRoleForUser('xiaoqinvar', 'MANAGER');

    // 资源继承
    await this.enforcer.addNamedGroupingPolicies('g2', [['/v1/casbin/users', 'casbinGetApi']]);

    // 策略p
    await this.enforcer.addNamedPolicies('p', [['MANAGER', 'casbinGetApi', 'GET']]);

    this.logger.info('casbin is ready.');
    // Save the policy back to DB.
    // await e.savePolicy();
  }
}
