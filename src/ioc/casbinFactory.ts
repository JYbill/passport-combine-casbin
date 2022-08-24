import { ILogger } from '@midwayjs/core';
import { Application } from 'egg';
import { App, Config, Init, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Enforcer, MemoryAdapter, newEnforcer, newModel, newModelFromString } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';

@Provide()
@Scope(ScopeEnum.Singleton)
export class CasbinFactory {
  enforcer: Enforcer;

  @Logger()
  logger: ILogger;

  @Init()
  public async init(): Promise<void> {
    const adapter = await PrismaAdapter.newAdapter();
    const model = newModelFromString(`
    [request_definition]
    r = sub, obj, act
    r2 = sub, obj, act
    
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
    this.enforcer = await newEnforcer(model, adapter);
    // redis watcher
    // const watcher = await RedisWatcher.newWatcher(
    //   this.redisConfig.clients.session
    // );
    // this.enforcer.setWatcher(watcher);

    // await e.addPolicy(...);
    // await e.removePolicy(...);

    // Save the policy back to DB.
    // await e.savePolicy();
  }
}
