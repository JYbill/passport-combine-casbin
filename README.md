# passport-combine-casbin

## 技术选型

- 基础：Midway.js ✅
- ORM： prisma ✅
- DB: mongoDB(需要副本集开启事物) ✅
- Front: React✅ (有考虑尝试 SSR，可以但没必要，主要是第一次练习用)
- Cache: redis(后续可能采用做 casbin-watcher 替代内存 watcher) ❌

## 什么是 Casbin？

- 它能做什么?不能做什么?
  > 其实网上基本上都会抄官方文档的原话：[Casbin 是什么？](https://casbin.io/zh/docs/overview#casbin-%E6%98%AF%E4%BB%80%E4%B9%88)，这里用大白话讲就一句话，"帮我们完成鉴权过程，所有用户、角色、权限之间的对应关系都由 casbin 完成"，所以需要使用其他的库进行认证操作，一般都是使用 jwt，所以你可以采用`passport-jwt`与`casbin`进行配合。

## 了解 casbin 必备的两个文件

1. `.conf`：[rbac_with_abab.conf](./src/casbin/rbac_with_abab.conf)，该文件作用：告诉 casbin 按照什么样的策略进行控制用户权限，一般通过文件 io 读取或者代码层面(api, 字符串)，本教程采用的是代码层面的字符串形式，如：[casbinFactory.ts](./src/ioc/casbinFactory.ts)
2. `.csv`：里面定义的都是用户有哪些角色，角色有哪些权限/权限组，并是否允许通过，存储方式有多种，如：io 读取，db 存储...(详细参考官方文档：[官方文档：数据库存储各字段的含义](https://casbin.io/zh/docs/policy-storage#%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AD%98%E5%82%A8%E6%A0%BC%E5%BC%8F)、[官方文档那个：casbin 适配器](https://casbin.io/zh/docs/adapters))，本教程采用的是`Prisma ORM适配器`结合`MongoDB集合数据库`

## model.conf 分析

- model.conf 文件中各字段的含义

```bash
# 请求的定义
# r: request缩写
# sub: subject 主题(可以是角色名 or 用户名，一般都是用户名)
# obj: object (目标对象，一般是一个请求路径：/v1/test)
# act：行为(增删改查，对应RESTFUL就是POST、DELETE、PUT、GET)
# eft: 允许不填，默认为allow
# 官方文档：https://casbin.io/zh/docs/syntax-for-models#request%E5%AE%9A%E4%B9%89
[request_definition]
r = sub, obj, act

# 策略的定义
# 这里与request定义一致
# 定义这个是为了下面的`effect、matchers`与`policy.csv`文件的字段一一对应
# 官方文档：https://casbin.io/zh/docs/syntax-for-models#policy%E5%AE%9A%E4%B9%89
[policy_definition]
p = sub, obj, act

# 策略作用：这个就比较有意思了
# 参考官方文档：https://casbin.io/zh/docs/syntax-for-models#policy-effect%E5%AE%9A%E4%B9%89
[policy_effect]
e = some(where (p.eft == allow))
# 含义：存在任意一个决策结果为allow的匹配规则，则结果为true
# e = !some(where (p.eft == deny))
# 含义：不存在任何为deny的结果就通过，返回true

# 匹配器
[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
# 这里开始结合policy文件讲比较好
```

- 快速开始往往是学习最快的方法：
  [官方 casbin 计算器](https://casbin.org/editor/)
- 选择 ACL 模型：角色名对权限名

```bash
# model.conf
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
```

```bash
# policy.csv
# 策略，xiaoqinvar用户，/test接口，GET方法，允许访问(默认allow)
p, xiaoqinvar, /test, GET
# 策略，rabbit用户，/test接口，POST方法，允许访问(默认allow)
p, rabbit, /test, POST
```

```bash
# 请求
xiaoqinvar, /test, GET # true
xiaoqinvar, /test, POST # false
rabbit, /test, GET # false
rabbit, /test, POST # true
```

> xiaoqinvar 只有`/test`接口下的`GET`行为，所以他只能通过`GET /test`请求
> rabbit 只有`/test`接口下的`POST`行为，所以只能通过`POST /test`请求

- ACL 很简单，但是我们企业开发至少是 RBAC 模型起步
  > casbin 官网 editor 工具抽了，这里暂时停住

```bash

```

```bash

```

```bash

```

> 推荐参考文档:
>
> - [讲解各种模型的含义从最基本的 ACL 到 RBAC 到 RBAC 继承和 ABAC 模型](https://medium.com/wesionary-team/understanding-casbin-with-different-access-control-model-configurations-faebc60f6da5)
