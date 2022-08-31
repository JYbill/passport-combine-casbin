# passport-github 认证流程

> github 官方认证流程：[https://docs.github.com/cn/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow](https://docs.github.com/cn/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow)

> midway 整合 passport-github：[https://midwayjs.org/docs/extensions/passport#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%B6%E4%BB%96%E7%AD%96%E7%95%A5](https://midwayjs.org/docs/extensions/passport#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%B6%E4%BB%96%E7%AD%96%E7%95%A5)
> 官方文档写的有点小小的问题，看[github.middleware.ts](../src/middleware/github.middleware.ts)，可能官方写掉了

- 这下好了，上面整合的没用了，github 文档流程和`passport-github`流程传输的字段不相同了，按照 github oauth 流程走吧
