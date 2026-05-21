# 多 Profiles 聊天技术方案

## 一、核心结论

| 问题 | 结论 |
|------|------|
| 对指定 profile 进行 chat，需要代码调整吗？ | **不需要**。现有架构已支持，Session 天然绑定 profile，chat 流自动读取 Session 的 profile 字段 |
| 多个 profiles 能否同时 chat？ | **可以**。利用已有的 per-request profile 隔离（Thread-local + `_ENV_LOCK`），但前端 UI 一次只能操作一个 profile 的会话 |
| 多个 profile 能否共用同一个 gateway？ | **当前设计为单 profile 共用**。Gateway 是进程级单例，绑定一个 `HERMES_HOME`；多 profile 同时接入 gateway 需要架构调整 |
| Gateway 在 chat 流程中起什么作用？ | **WebUI chat 不走 gateway**。WebUI chat 直接在 webui 进程中运行 `AIAgent`；Gateway 独立运行，负责平台适配（Telegram/Discord/Slack 等） |

---

## 二、Profile 与 Chat 的现有绑定机制

### 2.1 Session → Profile 绑定

```
用户创建 Session 时 → 携带当前 activeProfile
                      ↓
          backend: new_session(profile=xxx)
                      ↓
          Session 数据库存入 profile 字段
                      ↓
          后续该 Session 的所有 chat 自动使用该 profile
```

关键代码位置：
- `hermes-webui-original/api/models.py:409` — `Session` 类有 `profile` 字段
- `hermes-webui-original/api/routes.py` — `new_session()` 从请求体读取 `profile` 参数

### 2.2 Chat 流中的 Profile 环境隔离

```
POST /api/chat/start
    ↓
_start_chat_stream_for_session(session_id)
    ↓
_run_agent_streaming(session_id)
    ↓
从 session.profile 解析 HERMES_HOME
    ↓
_ENV_LOCK 锁定 → 修改 os.environ['HERMES_HOME']
    ↓
更新技能模块缓存路径
    ↓
运行 AIAgent（在该 profile 的上下文中）
    ↓
_ENV_LOCK 释放
```

关键代码位置：
- `hermes-webui-original/api/streaming.py:2976` — `_run_agent_streaming()`
- `hermes-webui-original/api/streaming.py` — `_set_thread_env()` 设置线程环境

---

## 三、多 Profile 同时 Chat 的可行性分析

### 3.1 后端：天然支持并发

| 机制 | 说明 |
|------|------|
| Thread-local profile (`_tls.profile`) | 每个 HTTP 请求独立解析 profile，互不干扰 |
| Session-profile 绑定 | 每个 chat stream 读取自己的 Session.profile |
| `_ENV_LOCK` | 串行化环境变量切换，保证同一时刻只有一个 Agent 在运行，但不同 profile 的 stream 可以交错执行 |
| 独立 HERMES_HOME | 每个 profile 有完全独立的配置、记忆、技能目录 |

**结论**：后端完全支持多个 profile 同时发起 chat 请求。A 用户在 profile "dev" 的 Session 中聊天，B 用户在 profile "prod" 的 Session 中聊天，两者互不干扰。

### 3.2 前端：一次只能操作一个 Profile

当前前端设计：
- `S.activeProfile` 是全局状态，页面一次只展示一个 profile 的 Session 列表
- 切换 profile 会刷新页面、重载 Session 列表
- 没有多 profile 同时展示的 UI

**如果要实现前端同时操作多 profile**，需要：
1. 侧边栏改为按 profile 分组展示 Session
2. 支持多窗口/多标签页模式（每个标签页绑定不同 profile）
3. 或者增加 "多 profile 视图" 模式

### 3.3 现有 "all_profiles" 参数

API 已支持跨 profile 查询：
- `GET /api/sessions?all_profiles=1` — 返回所有 profile 的 Session
- 前端有 `_showAllProfiles` 开关（隐藏功能），可显示其他 profile 的 Session

---

## 四、多 Profile 共用 Gateway 的可行性分析

### 4.1 Gateway 的架构定位

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose 架构                       │
├─────────────────────────────────────────────────────────────┤
│  hermes-webui (port 8787)      hermes-agent (port 8642)     │
│  ┌─────────────┐              ┌─────────────┐              │
│  │ WebUI Server│              │   Gateway   │              │
│  │  - API 路由  │              │  - 平台适配  │              │
│  │  - Chat 流   │  ──────►     │  - Session  │              │
│  │  - SSE 推送  │   无直接     │    Store    │              │
│  │             │   调用       │  - Agent    │              │
│  │  AIAgent 在 │              │    Cache    │              │
│  │  本进程运行  │              │             │              │
│  └─────────────┘              └─────────────┘              │
│         │                            │                     │
│         └──── 共享 hermes-home 卷 ────┘                     │
│              (读写同一 state.db / 配置)                      │
└─────────────────────────────────────────────────────────────┘
```

**关键事实**：
- WebUI 的 chat **不调用** gateway API，直接在 webui 进程内运行 `AIAgent`
- Gateway 是一个独立的长驻进程，负责对接外部平台（Telegram Bot、Discord Bot 等）
- Gateway 有 **进程级单例限制**：`gateway.pid` 文件、`state.db` 连接、`HERMES_HOME` 绑定

### 4.2 Gateway 的 Profile 绑定方式

```
Gateway 启动时
    ↓
读取环境变量 HERMES_HOME（默认 ~/.hermes）
    ↓
绑定到该目录下的 config.yaml、.env、state.db
    ↓
所有 platform adapter 在该 profile 上下文中运行
```

Gateway 中的 `/profile` 命令只显示当前绑定的 profile，**不能动态切换**。

### 4.3 多 Profile 共用 Gateway 的方案对比

| 方案 | 描述 | 优点 | 缺点 | 工作量 |
|------|------|------|------|--------|
| **A. 单 Gateway + 动态切换** | Gateway 进程中维护多个 profile 上下文，根据消息路由到对应 profile | 节省资源 | 需重构 Gateway 内部所有单例（SessionStore、AgentCache、PID 文件） | **大** |
| **B. 每 Profile 一个 Gateway 进程** | docker-compose 中为每个 profile 启动一个 gateway 容器 | 完全隔离，实现简单 | 资源开销大（N 个 profile = N 个进程） | **中** |
| **C. Gateway 按 Session 路由** | Gateway 收到消息后，根据 Session 所属 profile 切换上下文 | 比较优雅 | 与方案 A 类似，需要重构核心 | **大** |
| **D. 维持现状（推荐）** | WebUI chat 不走 gateway；gateway 仅用于平台接入，绑默认 profile | 无需改动 | 平台消息只能走默认 profile | **无** |

**推荐方案 D**（当前已满足需求）：
- WebUI 的多 profile chat 已经在 webui server 中直接处理，不需要 gateway 参与
- Gateway 仅用于外部平台接入（Telegram/Discord 等），这些场景通常只需要一个默认 profile
- 如果未来需要 "Telegram Bot 同时服务多个 profile"，再考虑方案 B（每个 profile 一个 gateway 实例）

---

## 五、Gateway 在 Chat 流程中的作用（详细拆解）

### 5.1 WebUI Chat 流程（不走 Gateway）

```
用户输入消息
    ↓
前端: send() → POST /api/chat/start
    ↓
后端: _handle_chat_start() 生成 stream_id
    ↓
后端: 创建 SSE 通道
    ↓
后端: 后台线程 _run_agent_streaming()
    ↓
    ├─ 读取 Session.profile
    ├─ 设置 HERMES_HOME = profile home
    ├─ 加载该 profile 的 config.yaml、.env
    ├─ 运行 AIAgent（本地推理 + 工具调用）
    ├─ 将 token/tool/done 事件推入 SSE 队列
    ↓
前端: EventSource 接收 SSE，实时渲染
```

**注意**：整个流程在 `hermes-webui` 容器内部完成，`hermes-agent` 容器的 gateway **不参与**。

### 5.2 Gateway Chat 流程（外部平台）

```
Telegram 用户发送消息
    ↓
Telegram Bot Adapter (在 Gateway 进程中)
    ↓
SessionStore.get_or_create_session(user_id)
    ↓
AgentCache 获取/创建 AIAgent 实例
    ↓
_handle_message_with_agent()
    ↓
AIAgent.run() 处理消息
    ↓
DeliveryRouter 将回复路由回 Telegram
```

**注意**：Gateway 独立运行，与 WebUI 的 chat 流程是两条平行线。

### 5.3 WebUI 与 Gateway 的交互点

| 交互点 | 方向 | 说明 |
|--------|------|------|
| Gateway 健康检查 | WebUI → Gateway | WebUI 定期请求 `http://hermes-agent:8642` 检查 gateway 是否存活 |
| Gateway 状态文件 | WebUI ← Gateway 文件系统 | WebUI 读取 `gateway_state.json`、`gateway.pid` 显示状态 |
| 共享 state.db | 双向文件系统 | WebUI 读取 gateway 创建的 Session，gateway 读取 WebUI 创建的 Session |
| 共享 hermes-home | 双向文件系统 | 两个容器挂载同一卷，读写同一套 profile 数据 |

---

## 六、如果要 "对指定 profile 进行 chat"，需要做什么？

### 6.1 当前已实现的能力

**什么都不用改**，已经支持：

1. 用户在前端切换到目标 profile（点击 profile 下拉菜单）
2. 前端设置 `hermes_profile` cookie
3. 创建新 Session（自动绑定当前 profile）
4. 在该 Session 中 chat → 自动使用绑定的 profile 环境

### 6.2 如果要 "在一个页面同时操作多个 profile"

需要的前端调整（工作量：**中**）：

```
当前: 侧边栏 Session 列表 → 平铺展示当前 profile 的所有 Session

目标: 侧边栏按 profile 分组
      ├─ Profile: default
      │   ├─ Session A
      │   └─ Session B
      ├─ Profile: dev
      │   ├─ Session C
      │   └─ Session D
      └─ Profile: prod
          └─ Session E
```

涉及修改：
- `static/sessions.js` — Session 列表渲染逻辑，支持按 profile 分组
- `static/messages.js` — 发送消息时携带正确的 profile 标识
- `static/style.css` — 分组 UI 样式
- `api/routes.py` — 可选：优化 `/api/sessions` 返回分组数据

### 6.3 如果要 "一个 Session 内切换 profile"

不推荐，会破坏 Session-Profile 绑定语义。如果确实有需求：
- 方案：新建 Session 时选择 profile，不支持中途切换
- 理由：一个 Session 的记忆、工具状态、文件都是 profile 隔离的，中途切换会导致状态混乱

---

## 七、总结

| 场景 | 是否需要调整 | 说明 |
|------|-------------|------|
| 用户手动切换 profile 后聊天 | **否** | 已完全支持 |
| 多个用户各自用不同 profile 同时聊天 | **否** | 后端天然支持并发隔离 |
| 前端同时展示多 profile 的 Session | **前端中改** | 需改造侧边栏 UI |
| 多 profile 同时接入 Gateway | **架构大改** | 推荐维持现状，或每 profile 起一个 gateway |
| WebUI Chat 需要 Gateway 参与 | **否，且不应改** | 当前设计合理，WebUI 直连 Agent 更轻量 |
