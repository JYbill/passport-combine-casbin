# Casbin Watcher 监视器

> 官方 doc: [https://casbin.io/zh/docs/watchers](https://casbin.io/zh/docs/watchers)

- 前言：起初我看见`redis watcher`时，我就固定思维化的想到了`memo cache`这个概念，无论是在 java 或者 node 中，redis 最主要的用途有缓存和分布式锁 🔒 的应用，只能怪自己学艺不精啊，完全`不是缓存`这回事儿

- redis watcher 的作用：一个以 redis 作为发布订阅模型应用场景！

- 上图
  ![](./img/redis%20watcher.png)

- 你问我怎么发现的？
  > 看源码，昨天周五，我一直以为是内存作用，作为 node 开发人员思维相对有点固化。node v8 1400M 左右的内存大小限制，导致 V8 内存使用都是小心翼翼的，只要涉及大内存就会想到 redis cache。要不是看了 npm 使用量还有几百人，我的有点怀疑这是 bug 吧？后来发现我才是 bug。
- github redis watcher：[https://github.com/node-casbin/redis-watcher](https://github.com/node-casbin/redis-watcher)
- npm redis watcher: [https://www.npmjs.com/package/@casbin/redis-watcher](https://www.npmjs.com/package/@casbin/redis-watcher)

- 重要源码分析: [cache redis 初始化](https://github.com/node-casbin/redis-watcher/blob/a90cfcbb3cc98802b022afc653140920d2a11b58/src/watcher.ts#L74)
  1. subConnection：subscribe connection 订阅链接，专门处理订阅消息的
  2. pubConnection: publish connection 发布连接，专门用于发布，整个 watcher 对象中只有一个`RedisWatcher#update()`方法，用于手动去发布，让所有订阅的连接都收到消息，后面就是自己的业务了，比如 load 策略...
  3. channel: 管道，至于这块我对 redis 了解不够深入，我的猜测是类似于 MQ 消息中间件，在订阅频道下，才能统一接受该信息
  - 有兴趣可以看看源码，就 2 个文件，挺简单的

```ts
import { Watcher } from 'casbin';
import { RedisClusterConnection, RedisConnection, RedisClient } from './redis';
import { ClusterNode, ClusterOptions, RedisOptions } from 'ioredis';

export interface WatcherOptions extends RedisOptions {
  channel?: string;
}

export interface WatcherClusterOptions extends ClusterOptions {
  channel?: string;
}

export class RedisWatcher implements Watcher {
  private pubConnection: RedisConnection | RedisClusterConnection;
  private subConnection: RedisConnection | RedisClusterConnection;
  private callback: () => void;
  private channel = 'casbin';

  /**
   * newWatcher creates a watcher on the single Redis.
   * @param options - https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options
   * @example
   * newWatcher('redis://user:password@redis-service.com:6379')
   * newWatcher('//localhost:6379')
   * newWatcher({
   *   port: 6379, // Redis port
   *   host: "127.0.0.1", // Redis host
   *   family: 4, // 4 (IPv4) or 6 (IPv6)
   *   password: "auth",
   *   db: 0,
   *   channel: "casbin"
   * })
   */
  public static async newWatcher(options?: WatcherOptions | string): Promise<RedisWatcher> {
    let channel = '';
    if (typeof options === 'object' && options.channel) {
      channel = options.channel;
    }

    const pubConnection = new RedisConnection(options);
    const subConnection = new RedisConnection(options);
    return this.init(pubConnection, subConnection, channel);
  }

  /**
   * newWatcherWithCluster creates a watcher on the Redis cluster.
   * @param nodes - An array of nodes in the cluster, [{ port: number, host: string }]
   * @param clusterOptions - https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options
   * @example
   * newWatcherWithCluster([{ port: 6380, host: "127.0.0.1"}, { port: 6381, host: "127.0.0.1"})
   */
  public static async newWatcherWithCluster(nodes: ClusterNode[] = [], clusterOptions: WatcherClusterOptions = {}): Promise<RedisWatcher> {
    const pubConnection = new RedisClusterConnection(nodes, clusterOptions);
    const subConnection = new RedisClusterConnection(nodes, clusterOptions);
    return this.init(pubConnection, subConnection, clusterOptions.channel);
  }

  private static async init(
    pubConnection: RedisConnection | RedisClusterConnection,
    subConnection: RedisConnection | RedisClusterConnection,
    channel?: string
  ): Promise<RedisWatcher> {
    const watcher = new RedisWatcher();

    watcher.pubConnection = pubConnection;
    watcher.subConnection = subConnection;

    if (channel) {
      watcher.channel = channel;
    }

    const client = await watcher.subConnection.getRedisClient();
    // @ts-ignore - subscribe is exists.
    await client.subscribe(watcher.channel);
    client.on('message', (chan: string) => {
      // redis应该是广播，没有mq那种内置的频道，这里手动判断，避免其他redis业务干扰
      if (chan !== watcher.channel) {
        return;
      }

      // 这里的callback是Watcher.setUpdateCallback(() => void)
      // 业务在`casbinFactory.ts`文件中有
      if (watcher.callback) {
        watcher.callback();
      }
    });

    return watcher;
  }

  private constructor() {}

  // 手动发送广播，一般不需要，修改casbin权限时会自动调用，当然你手动调用着玩也是ok的👌
  public async update(): Promise<boolean> {
    const client = await this.pubConnection.getRedisClient();
    // @ts-ignore - publish is exists.
    await client.publish(this.channel, 'casbin rules updated');
    return true;
  }

  // 设置回调
  public setUpdateCallback(callback: () => void) {
    this.callback = callback;
  }

  // 关闭watcher，这里肯定由casbin帮我们完成.
  public async close(): Promise<void> {
    this.pubConnection.close();
    this.subConnection.close();
  }
}
```

- 其实代码还是很简单的，如果需要定制 redis watcher 的功能，我们也完全可以在源码上进行修改，如果你想给`casbin redis watcher`增加拓展功能，完全可以给他们提 PR

- 实践，我说了怎么多，万一是骗你们的怎么办？

1. 下载项目
2. pnpm build -> pnpm start (端口 7101)
3. pnpm dev (7003)
