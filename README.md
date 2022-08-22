# passport-combine-casbin

## 技术选型

- 基础：Midway.js ✅
- ORM： prisma ✅
- DB: mongoDB(需要副本集开启事物) ✅
- Front: React✅ (有考虑尝试 SSR，可以但没必要，主要是第一次练习用)
- Cache: redis(后续可能采用做 casbin-watcher 替代内存 watcher) ❌

## model 分析

```typescript
[request_definition];
(r = sub), obj, act;
(r2 = sub), obj, act[policy_definition];
(p = sub), obj, act;
(p2 = sub_rule), obj, act, eft[role_definition];
(g = _), _;
(g2 = _), _[policy_effect];
e = some(where(p.eft == allow));
e2 = !some(where(p.eft == deny))[matchers];
#RABC;
m = (g(r.sub.username, p.sub) && g2(r.obj, p.obj) && r.act == p.act) || r.sub.role == 'root';
#ABAC;
m2 = eval(p2.sub_rule) && r2.obj == p2.obj && r2.act == p2.act && p2.eft == 'allow';
```

> 推荐参考文档:
>
> - [讲解各种模型的含义从最基本的 ACL 到 RBAC 到 RBAC 继承和 ABAC 模型](https://medium.com/wesionary-team/understanding-casbin-with-different-access-control-model-configurations-faebc60f6da5)

## policy 分析
