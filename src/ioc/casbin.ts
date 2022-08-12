import { ILogger } from '@midwayjs/core';
import { Application } from 'egg';
import {
  App,
  Config,
  Init,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/decorator';
import {
  Enforcer,
  MemoryAdapter,
  newEnforcer,
  newModel,
  newModelFromString,
} from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { resolve } from 'path';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Casbin {
  private enforcer: Enforcer;

  @App()
  app: Application;

  @Logger()
  logger: ILogger;

  // @Config('redis')
  // private redisConfig;

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
    
    [policy_effect]
    e = some(where (p.eft == allow))
    
    [matchers]
    #RABC
    m = g(r.sub.uname, p.sub) && r.obj == p.obj && r.act == p.act
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

  public getEnforcer(): Enforcer {
    return this.enforcer;
  }
}
