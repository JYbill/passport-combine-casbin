# passport-combine-casbin

> but not only casbin
> passport-combine-casbin-react：前端应用(vite + react 17): [跳转链接](https://github.com/JYbill/passport-combine-casbin-react)

## 技术选型

- 基础：Midway.js ✅
- ORM： prisma ✅
- DB: mongoDB(需要副本集开启事物) ✅
- Front: React✅ (有考虑尝试 SSR，可以但没必要，主要是第一次练习用)

## 包含技术点

1. midway 基本用法、服务工厂，代码目录文件采用 nest 的规范、规范与细化...(如有不合格、可以改进的地方欢迎指出) ✅
2. midway 整合 `prisma` ✅
3. midway 整合 `passport` 配合 `jwt` 策略 ✅
4. passport 整合 `github OAuth2.0`策略 ⌛️
5. midway 整合 `casbin` ✅
6. 使用 `prisma 适配器` 结合 `casbin` ✅
7. 使用 `redis watcher` 结合 `casbin` ✅

## 期望

- 希望来看的各位看官有以下几点知识储备

1. ACL、RBAC、ABAC 模型的概念(google、百度很多)
   > RBAC: 这个做后台的基本都懂大白话就是`用户-角色-权限`的模型
2. 了解 jwt 前后端交互(google、百度巨多)
   > json web token，知道怎么使用，知道用来干啥的

## 提示

如果有什么不太理解的完全可以提个 issue！

## 运行

项目根目录创建一个`.env`文件

```bash
# 账号密码
USERNAME=mongodb账号
PASSWORD=mongodb密码

# url
URL=你的域名

# db
DB=db里的库

# db url
DATABASE_URL=mongodb://${USERNAME}:${PASSWORD}@${URL}:27017,${URL}:27018,${URL}:27019/${DB}?replicaSet=rs0&authSource=admin

# redis url
REDIS_USERNAME=redis用户名
REDIS_PASSWORD=redis密码
REDIS_IP=你的ip:端口
REDIS_URL=redis://:${REDIS_PASSWORD}@${REDIS_IP}/0

# github
# github申请oauth2.0 流程
# doc：https://docs.github.com/cn/developers/apps/building-oauth-apps/creating-an-oauth-app
GITHUB_CLIENT_ID=github client id
GITHUB_CLIENT_SECRET=密钥
```

## 什么是 Casbin？

- 它能做什么?不能做什么?
  > 其实网上基本上都会抄官方文档的原话：[Casbin 是什么？](https://casbin.io/zh/docs/overview#casbin-%E6%98%AF%E4%BB%80%E4%B9%88)，这里用大白话讲就一句话，"帮我们完成鉴权过程，所有用户、角色、权限之间的对应关系都由 casbin 完成"，所以需要使用其他的库进行认证操作，一般都是使用 jwt，所以你可以采用`passport-jwt`与`casbin`进行配合。

## 了解 casbin 必备的两个文件

1. `.conf`：[rbac_with_abac.conf](./src/casbin/rbac_with_abab.conf)，该文件作用：告诉 casbin 按照什么样的策略进行控制用户权限，一般通过文件 io 读取或者代码层面(api, 字符串)，本教程采用的是代码层面的字符串形式，如：[casbinFactory.ts](./src/ioc/casbinFactory.ts)
2. `.csv`：里面定义的都是用户有哪些角色，角色有哪些权限/权限组，并是否允许通过，存储方式有多种，如：io 读取，db 存储...(详细参考官方文档：[官方文档：数据库存储各字段的含义](https://casbin.io/zh/docs/policy-storage#%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AD%98%E5%82%A8%E6%A0%BC%E5%BC%8F)、[官方文档那个：casbin 适配器](https://casbin.io/zh/docs/adapters))，本教程采用的是`Prisma ORM适配器`结合`MongoDB集合数据库`

## 项目中 casbin 触发流程

- 项目初始化
  ![](./doc/img/project%20init.png)
- 请求中间件流程
  ![](./doc/img/request%20process.png)
  > 一定要注意，casbin 中间件一定得放在 jwt 后面，jwt、casbin 认证，鉴权能力形成互补关系[configuration.ts](./src/configuration.ts)(代码里的注释很详细)

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

## Casbin 官方计算器

- 快速开始往往是学习最快的方法：
  [官方 online casbin 计算器(可能挂了)](https://casbin.org/editor/)
- 官方计算器源码:
  [GitHub casbin-editor](https://github.com/casbin/casbin-editor)
  > 拉下来启动会报错，修改`tsconfig.json`里，添加`"useUnknownInCatchVariables": false`即可成功运行，不过启动很慢大概`30s内`

## ACL

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

- 可能有些童鞋不懂请求这里，下面用代码片段描述

```ts
// jwt 认证后的用户对象
const subject = ctx.state.user;
// 请求的资源，即http://localhost:7001/test
// 这里就是/test，底层与koa用法一致 `ctx.path`
const object = ctx.path;
// 这里不用多说就是 GET、...、DELETE请求方法
const effect = ctx.method;

// 鉴权
// 与上面对应(先大致理解)
// subject: xiaoqinvar
// object: /test
// effect: GET
// 那么，xiaoqinvar, /test, GET即xiaoqinvar这个用户就允许访问，因为上面的策略文件里面有给予他这个权限
const auth1 = await this.enforcer.enforce(subject, object, effect);
```

## RBAC with resource roles

- ACL 很简单，但是我们企业开发至少是 RBAC 模型(既有用户、用户角色、也有资源、资源组（或者叫资源角色）)

```bash
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && g2(r.obj, p.obj) && r.act == p.act
```

```bash
# 允许管理员访问 /user下的所有方法
p, MANAGER, userGetApi, GET
p, MANAGER, userPostApi, POST
p, MANAGER, userPutApi, PUT
p, MANAGER, userDeleteApi, DELETE

# 只允许用户访问 /user GET请求
p, USER, userGetApi, GET

# 用户、用户角色
g, xiaoqinvar, MANAGER
g, ant, USER

# /user接口的各GET... DELETE方法，接口 接口角色
g2, /user, userGetApi
g2, /user, userPostApi
g2, /user, userPutApi
g2, /user, userDeleteApi
```

```bash
xiaoqinvar, /user, GET # true
xiaoqinvar, /user, DELETE # true

ant, /user, GET # true, 下面都是false
ant, /user, POST
ant, /user, PUT
ant, /user, DELETE
```

## RBAC + ABAC
- 本项目采用的方式
```bash
[request_definition]
#   用户名，api，方法
r = sub, obj, act
#   用户名，api，方法，允许/拒绝
r2 = sub, obj, act, eft

[policy_definition]
p = sub, obj, act
# ABAC就不一样了，这里策略的sub_rule相当于一段判断条件表达式，就这一个区别，可以看看策略文件
# obj,...,eft 与之前的一致
p2= sub_rule, obj, act, eft

[role_definition]
# 用户继承(g, xiaoqinvar, MANAGER) -> xiaoqinvar 拥有 MANAGER角色
g = _, _
# 资源集成(g2, /user/info, testApiGet) -> /user/info 属于 testApiGet资源组
g2 = _, _

[policy_effect]
# e 默认条件 -> 只要有一个条件满足了就通过
e = some(where (p.eft == allow))
# e2 自定义条件 -> 只要没有否定条件就通过，也就是说e2条件下，在策略文件中没有写任何策略，也判定为通过，因为！没有deny策略即通过！
e2 = !some(where (p.eft == deny))

[matchers]
#RABC
# 这里我请求是个对象
# 请求对象中的username要和策略文件中的一致
# 如果请求对象中的role角色为'root'则不用查策略文件，全部通过
m = g(r.sub.username, p.sub) && g2(r.obj, p.obj) && r.act == p.act || r.sub.role == 'ROOT'
#ABAC
m2 = eval(p2.sub_rule) && r2.obj == p2.obj && r2.act == p2.act && p2.eft == 'allow'
#ABAC: 当且仅当user isAdmin为true才能通过，其实完全可以做成AOP，这里只是演示效果
m3 = isRoot(r.sub.username, p.obj)
# m1 m2 m3可以理解为三个方案，m为RBAC方案，m2为ABAC方案，m3为ABAC自定义方法方案
```
- 上代码
```ts
// casbin.middleware.ts
// 整理参数
// jwt 认证后的用户对象
const subject = ctx.state.user;
// 请求的资源，即http://localhost:7001/user/info
// 这里就是/user/info，底层与koa用法一致 `ctx.path`
const object = ctx.path;
// 这里不用多说就是 GET、...、DELETE请求方法
const effect = ctx.method;

// 鉴权操作RBAC
const auth1 = await this.enforcer.enforce(subject, object, effect);

// 鉴权操作ABAC
const enforceContext = new EnforceContext('r2', 'p2', 'e2', 'm2');
const auth2 = await this.enforcer.enforce(enforceContext, subject, object, effect);

// 有一个不通过即视为无权限，只有RBAC通过、ABAC也通过时才能访问
if (!(auth1 && auth2)) {
  throw new MidwayHttpError('🚪 当前用户无权限访问', HttpStatus.FORBIDDEN);
}
const result = await next();
return result;
```
- m3对应的代码
```ts
// casbinFactory.ts 启用m3
// 启用/:id动态路由解析函数
// 🌰：/v1/user/12345 通过该工具函数解析成可以访问 /v1/user/:id接口
await this.enforcer.addNamedMatchingFunc('g2', Util.keyMatch2Func);

// 自定义函数
await this.enforcer.addFunction('isRoot', this.isRoot.bind(this));
```
> m3代码流程：request -> AOP -> m3 -> isRoot自定义方法 -> true or false

- 先推荐代理 + 文档进行理解，如有不懂欢迎`issue` 👏
> 强烈推荐的参考文档:
>
> 1. [讲解各种模型的含义从最基本的 ACL 到 RBAC 到 RBAC 继承和 ABAC 模型(外网推荐)](https://medium.com/wesionary-team/understanding-casbin-with-different-access-control-model-configurations-faebc60f6da5)
> 2. [上面文献翻不了外网的同学，点击这个看 md](./doc/Understanding%20Casbin%20with%20different%20Access%20Control%20Model%20Configurations.md)

## 什么是 Casbin Watcher？

> 篇幅较长，另起了一个 md：[Casbin Watcher](./doc/Watcher.md)

## passport + passport-github GitHub 认证流程

> [passport-github 认证流程](./doc/Github%20authentication.md) (passport-github插件采用上一版的认证方式，现github认证已是新版，推荐参考github官方的OAuth2.0方式)
