# Hermes WebUI API 文档（完善版）

本页基于 `hermes-webui-original/static/*.js` 的真实调用位点与 `api/routes.py` 路由进行整理。

- 后端入口：`hermes-webui-original/server.py` -> `api/routes.py`
- 接口范围：仅包含前端当前实际调用到的接口（不含未调用的保留路由）
- 说明：部分接口会在 WebUI 服务端进一步调用 `hermes-agent-original` 能力，但对前端暴露统一为 `/api/*`
- 总接口数（方法+路径维度）：**165**

## 通用约定

- 鉴权：使用 WebUI 登录态 Cookie（如已开启密码）。
- 请求体：除特别说明外，`POST/PATCH/DELETE` 采用 `application/json`。
- 返回体：默认 JSON；流式接口返回 `text/event-stream`。

## Auth 接口

### `POST` `/api/auth/login`
- 来源文件：`login.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/auth/logout`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/auth/logout' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `GET` `/api/auth/status`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/auth/status'
```

## Onboarding 接口

### `POST` `/api/onboarding/complete`
- 来源文件：`onboarding.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/onboarding/complete' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/onboarding/oauth/cancel`
- 来源文件：`onboarding.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/onboarding/oauth/cancel' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `GET` `/api/onboarding/oauth/poll?flow_id=`
- 来源文件：`onboarding.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`flow_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/onboarding/oauth/poll?flow_id='
```

### `POST` `/api/onboarding/oauth/start`
- 来源文件：`onboarding.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/onboarding/oauth/start' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/onboarding/probe`
- 来源文件：`onboarding.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/onboarding/probe' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/onboarding/setup`
- 来源文件：`onboarding.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：完成首次安装配置。设置 API 密钥、默认模型、工作区等基础配置。
- 输入参数：
  - Body(JSON)：
    - `api_key` (string, 可选) — API 密钥
    - `model` (string, 可选) — 默认模型
    - `workspace` (string, 可选) — 默认工作区路径
    - `provider` (string, 可选) — 默认提供商
- 输出示例：
```json
{"ok": true, "setup_complete": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/onboarding/setup' \
  -H 'Content-Type: application/json' \
  -d '{"api_key": "sk-xxx", "model": "claude-sonnet-4-6", "workspace": "/workspace"}'
```

### `GET` `/api/onboarding/status`
- 来源文件：`onboarding.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/onboarding/status'
```

## Chat 接口

### `POST` `/api/chat/start`
- 来源文件：`messages.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：启动新的聊天流。创建流式任务，返回 stream_id 供 SSE 连接使用。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `message` (string, 必填) — 用户消息内容
    - `workspace` (string, 可选) — 工作区路径
    - `model` (string, 可选) — 模型名称
    - `files` (array[string], 可选) — 附件文件路径列表
    - `approved_tool` (string, 可选) — 已批准的工具调用 ID
    - `reasoning_enabled` (boolean, 可选) — 是否启用推理模式
- 输出示例：
```json
{"stream_id": "stream_abc123", "session_id": "sess_xyz"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/chat/start' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "message": "你好", "workspace": "/workspace"}'
```

### `POST` `/api/chat/steer`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/chat/steer' \
  -H 'Content-Type: application/json' \
  -d '{}'
```


### `POST` `/api/chat`
- 来源文件：`fallback (非前端主流程)`
- 输出类型：`application/json（JSON 对象）`
- 描述：同步聊天回退端点（非流式），当 SSE 不可用时使用。创建临时会话上下文，调用 Agent 处理消息后返回完整响应。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `message` (string, 必填) — 用户消息内容
    - `workspace` (string, 可选) — 工作区路径，默认使用会话当前 workspace
    - `model` (string, 可选) — 指定模型，默认使用会话模型
    - `model_provider` (string, 可选) — 指定模型提供商
- 输出示例：
```json
{"response": "...", "session_id": "..."}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/chat' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "message": "Hello", "workspace": "/workspace"}'
```

### `GET` `/api/chat/cancel?stream_id=`
- 来源文件：`boot.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：取消指定 stream_id 的正在进行的聊天流。会中断 Agent 运行并清理相关状态。
- 输入参数：
  - Query：`stream_id` (string, 必填) — 要取消的流 ID
- 输出示例：
```json
{"ok": true, "cancelled": true, "stream_id": "..."}
```
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/chat/cancel?stream_id=demo-stream'
```

### `GET` `/api/chat/stream?session_id=`
- 来源文件：`messages.js`
- 输出类型：`text/event-stream（SSE）`
- 描述：主聊天 SSE 流端点。建立 Server-Sent Events 连接，实时推送 Agent 生成的内容、工具调用、状态更新等事件。
- 输入参数：
  - Query：`session_id` (string, 必填) — 会话 ID
- Demo：
```bash
curl -N 'http://localhost:18787/api/chat/stream?session_id=demo-session' \
  -H 'Accept: text/event-stream'
```


### `GET` `/api/chat/stream/status?stream_id=${encodeURIComponent(streamId || '')}`
- 来源文件：`ui.js`
- 输出类型：`text/event-stream（SSE）`
- 输入参数：
  - Query：`stream_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/chat/stream/status?stream_id=demo-stream'
```

### `GET` `/api/chat/stream/status?stream_id=${encodeURIComponent(streamId)}`
- 来源文件：`messages.js`
- 输出类型：`text/event-stream（SSE）`
- 输入参数：
  - Query：`stream_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/chat/stream/status?stream_id=demo-stream'
```

### `GET` `/api/reasoning`
- 来源文件：`commands.js, ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/reasoning'
```

### `POST` `/api/reasoning`
- 来源文件：`commands.js, ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：切换会话的推理模式（Chain of Thought）。启用后 Agent 会展示思考过程。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `enabled` (boolean, 可选) — 是否启用推理模式，不传则切换当前状态
- 输出示例：
```json
{"ok": true, "reasoning_enabled": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/reasoning' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "enabled": true}'
```

## Session 接口

### `POST` `/api/session/archive`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：归档/取消归档会话。归档的会话从活跃列表隐藏，但保留数据可通过搜索找回。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `archived` (boolean, 可选) — 是否归档，不传则切换状态
- 输出示例：
```json
{"ok": true, "archived": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/archive' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "archived": true}'
```

### `POST` `/api/session/branch`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：从当前会话创建分支会话。分支会复制原会话的历史消息，后续编辑互不影响。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 源会话 ID
    - `title` (string, 可选) — 分支会话标题，默认 "Branch of {原标题}"
- 输出示例：
```json
{"session_id": "branch_abc123", "title": "Branch of Untitled", "parent": "orig_xyz"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/branch' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "title": "实验方案 B"}'
```

### `POST` `/api/session/clear`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：清空会话的所有消息。保留会话元数据（标题、工作区等）。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"ok": true, "cleared": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/clear' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session"}'
```

### `POST` `/api/session/compress`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：触发会话的自动压缩。将较早的消息摘要为压缩锚点，减少后续对话的 token 消耗。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `topic` (string, 可选) — 压缩聚焦主题
- 输出示例：
```json
{"ok": true, "compressed": 5, "remaining": 12}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/compress' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "topic": "API 设计讨论"}'
```


### `POST` `/api/session/compress/start`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：启动会话的手动压缩任务。在后台线程中运行，将长对话历史压缩为摘要锚点，减少 token 消耗。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `focus_topic` (string, 可选) — 压缩聚焦主题，限制 500 字符
- 输出示例：
```json
{"ok": true, "status": "running", "session_id": "...", "started_at": 1234567890}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/compress/start' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "focus_topic": "项目进度讨论"}'
```

### `GET` `/api/session/compress/status?session_id=`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：查询会话手动压缩任务的状态。
- 输入参数：
  - Query：`session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"ok": true, "status": "running", "session_id": "..."}
```
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session/compress/status?session_id=demo-session'
```


### `POST` `/api/session/conversation-rounds`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：设置会话的最大对话轮数限制。达到限制后 Agent 会提示压缩或归档。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `max_rounds` (integer, 可选) — 最大轮数，null 表示无限制
- 输出示例：
```json
{"ok": true, "max_rounds": 50}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/conversation-rounds' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "max_rounds": 50}'
```

### `POST` `/api/session/delete`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：删除指定会话及其关联数据。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 要删除的会话 ID
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/delete' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session"}'
```

### `POST` `/api/session/duplicate`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：复制会话。创建原会话的完整副本，包括所有消息和设置。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 源会话 ID
    - `title` (string, 可选) — 副本标题，默认 "Copy of {原标题}"
- 输出示例：
```json
{"ok": true, "session_id": "copy_abc123", "title": "Copy of Untitled"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/duplicate' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "title": "备份副本"}'
```

### `POST` `/api/session/handoff-summary`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：生成会话交接摘要。用于将当前会话的上下文传递给新会话或团队成员。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"ok": true, "summary": "本项目正在开发用户认证模块，已完成登录功能..."}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/handoff-summary' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session"}'
```


### `GET` `/api/session/export?session_id=`
- 来源文件：`sessions.js`
- 输出类型：`application/json; charset=utf-8（文件下载）`
- 描述：导出会话为 JSON 文件下载。敏感信息会被自动脱敏处理。
- 输入参数：
  - Query：`session_id` (string, 必填) — 会话 ID
- 响应头：
  - `Content-Disposition: attachment; filename="hermes-{session_id}.json"`
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session/export?session_id=demo-session' \
  -O hermes-demo-session.json
```

### `GET` `/api/session/draft?session_id=`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：获取会话的 Composer 草稿内容（文本和附件文件列表）。
- 输入参数：
  - Query：`session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"draft": {"text": "草稿内容...", "files": ["/path/to/file.txt"]}}
```
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session/draft?session_id=demo-session'
```

### `POST` `/api/session/draft`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：保存会话的 Composer 草稿。文本上限 50KB，附件文件上限 50 个。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `text` (string, 可选) — 草稿文本内容
    - `files` (array[string], 可选) — 附件文件路径列表
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/draft' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "text": "待发送的消息...", "files": []}'
```

### `GET` `/api/session/usage?session_id=`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：获取会话的 token 用量统计。
- 输入参数：
  - Query：`session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"prompt_tokens": 1200, "completion_tokens": 800, "total_tokens": 2000}
```
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session/usage?session_id=demo-session'
```


### `POST` `/api/session/import`
- 来源文件：`boot.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：导入外部会话数据。支持从 CLI 导出的 JSON 或 WebUI 导出的会话文件。
- 输入参数：
  - Body(JSON)：
    - `data` (object, 必填) — 会话数据对象，包含 session_id、messages、workspace 等字段
- 输出示例：
```json
{"ok": true, "session_id": "imported_abc123"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/import' \
  -H 'Content-Type: application/json' \
  -d '{"data": {"title": "Imported Session", "messages": [], "workspace": "/workspace"}}'
```

### `POST` `/api/session/import_cli`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：从 CLI 导出的会话文件导入。兼容 hermes-agent CLI 的导出格式。
- 输入参数：
  - Body(JSON)：
    - `data` (object, 必填) — CLI 会话数据对象
- 输出示例：
```json
{"ok": true, "session_id": "imported_cli_123"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/import_cli' \
  -H 'Content-Type: application/json' \
  -d '{"data": {"session_id": "cli_abc", "messages": [...]}}'
```

### `POST` `/api/session/move`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：移动会话到不同项目或工作区。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `project_id` (string, 可选) — 目标项目 ID，null 表示移出项目
    - `workspace` (string, 可选) — 目标工作区路径
- 输出示例：
```json
{"ok": true, "session": {"session_id": "...", "project": "new_proj"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/move' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "project_id": "proj_abc"}'
```

### `POST` `/api/session/new`
- 来源文件：`panels.js, sessions.js, ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：创建新会话。可选择指定工作区、模型和项目。
- 输入参数：
  - Body(JSON)：
    - `workspace` (string, 可选) — 工作区路径，默认使用上次使用的工作区
    - `model` (string, 可选) — 模型名称，默认使用系统默认模型
    - `project` (string, 可选) — 所属项目 ID
    - `worktree` (boolean/string, 可选) — 是否创建工作区 worktree，设为 true/1/yes/on 时启用
- 输出示例：
```json
{"session_id": "sess_abc123", "title": "Untitled", "workspace": "/workspace", "model": "claude-sonnet-4-6"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/new' \
  -H 'Content-Type: application/json' \
  -d '{"workspace": "/workspace", "model": "claude-sonnet-4-6", "project": "my-project"}'
```

### `POST` `/api/session/pin`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：固定/取消固定会话。固定的会话会显示在会话列表顶部，且不会被自动清理。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `pinned` (boolean, 可选) — 是否固定，不传则切换当前状态
- 输出示例：
```json
{"ok": true, "pinned": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/pin' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "pinned": true}'
```

### `POST` `/api/session/rename`
- 来源文件：`commands.js, messages.js, panels.js, sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：重命名会话标题。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `title` (string, 必填) — 新标题，最长 80 字符，超出截断
- 输出示例：
```json
{"session": {"session_id": "...", "title": "新标题"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/rename' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "title": "新的会话标题"}'
```

### `POST` `/api/session/retry`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：重试会话的最后一轮对话。删除上一条 Agent 回复后重新发送请求。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"ok": true, "stream_id": "stream_retry_123"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/retry' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session"}'
```

### `POST` `/api/session/toolsets`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：设置会话启用的工具集（MCP 服务器或内置工具）。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `toolsets` (array[string], 可选) — 启用的工具集名称列表，空数组表示禁用所有
- 输出示例：
```json
{"ok": true, "toolsets": ["filesystem", "git", "browser"]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/toolsets' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "toolsets": ["filesystem", "git"]}'
```

### `POST` `/api/session/truncate`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：截断会话消息历史。删除指定索引之后的所有消息，用于回退到对话的某个节点。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `index` (integer, 必填) — 截断到的消息索引（0-based，保留此索引及之前的消息）
- 输出示例：
```json
{"ok": true, "truncated": 3, "remaining": 5}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/truncate' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "index": 5}'
```

### `POST` `/api/session/undo`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：撤销会话的最后一轮对话。删除最后一条用户消息和 Agent 回复。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"ok": true, "removed": 2}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/undo' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session"}'
```

### `POST` `/api/session/update`
- 来源文件：`boot.js, panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：更新会话元数据。可修改 workspace、model、project 等字段。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `workspace` (string, 可选) — 新工作区路径
    - `model` (string, 可选) — 新模型
    - `project` (string, 可选) — 新项目 ID
- 输出示例：
```json
{"ok": true, "session": {"session_id": "...", "workspace": "/new/path"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/update' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "workspace": "/new/project"}'
```

### `POST` `/api/session/yolo`
- 来源文件：`commands.js, messages.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：切换会话的 YOLO 模式。启用后 Agent 自动批准所有工具调用，无需人工确认。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `enabled` (boolean, 可选) — 是否启用，默认 true
- 输出示例：
```json
{"ok": true, "yolo_enabled": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/yolo' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "enabled": true}'
```

### `GET` `/api/session/yolo?session_id=`
- 来源文件：`commands.js, messages.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session/yolo?session_id='
```

### `GET` `/api/session?session_id=`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id='
```

### `GET` `/api/session?session_id=${encodeURIComponent(S.session.session_id)}`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session'
```

### `GET` `/api/session?session_id=${encodeURIComponent(activeSid)}`
- 来源文件：`messages.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session'
```

### `GET` `/api/session?session_id=${encodeURIComponent(sid)}`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session'
```

### `GET` `/api/session?session_id=${encodeURIComponent(sid)}&messages=0&resolve_model=0`
- 来源文件：`boot.js, sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`messages, resolve_model, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session&messages=0&resolve_model=0'
```

### `GET` `/api/session?session_id=${encodeURIComponent(sid)}&messages=0&resolve_model=1`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`messages, resolve_model, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session&messages=0&resolve_model=1'
```

### `GET` `/api/session?session_id=${encodeURIComponent(sid)}&messages=1&resolve_model=0`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`messages, resolve_model, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session&messages=1&resolve_model=0'
```

### `GET` `/api/session?session_id=${encodeURIComponent(sid)}&messages=1&resolve_model=0&msg_before=${_oldestIdx}&msg_limit=${_INITIAL_MSG_LIMIT}`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`messages, msg_before, msg_limit, resolve_model, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session&messages=1&resolve_model=0&msg_before=demo&msg_limit=demo'
```

### `GET` `/api/session?session_id=${encodeURIComponent(sid)}&messages=1&resolve_model=0&msg_limit=${_INITIAL_MSG_LIMIT}`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`messages, msg_limit, resolve_model, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/session?session_id=demo-session&messages=1&resolve_model=0&msg_limit=demo'
```

### `GET` `/api/sessions`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/sessions'
```

### `GET` `/api/sessions/search?q=${encodeURIComponent(q)}&content=1&depth=5`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`content, depth, q`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/sessions/search?q=demo&content=1&depth=5'
```


### `POST` `/api/sessions/cleanup`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：清理所有标题为 "Untitled" 且无消息的空会话。同时重建会话索引。
- 输入参数：
  - Body(JSON)：无
- 输出示例：
```json
{"ok": true, "cleaned": 5}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/sessions/cleanup' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/sessions/cleanup_zero_message`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：清理所有消息数为 0 的会话（无论标题）。比 cleanup 更激进。
- 输入参数：
  - Body(JSON)：无
- 输出示例：
```json
{"ok": true, "cleaned": 12}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/sessions/cleanup_zero_message' \
  -H 'Content-Type: application/json' \
  -d '{}'
```


## Workspace 接口

### `GET` `/api/workspaces`
- 来源文件：`commands.js, panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/workspaces'
```

### `POST` `/api/workspaces/add`
- 来源文件：`onboarding.js, panels.js, ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：添加新的工作区到列表。
- 输入参数：
  - Body(JSON)：
    - `path` (string, 必填) — 工作区绝对路径，必须存在且可访问
- 输出示例：
```json
{"ok": true, "workspaces": [{"path": "/workspace", "name": "workspace"}]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/add' \
  -H 'Content-Type: application/json' \
  -d '{"path": "/home/user/myproject"}'
```

### `POST` `/api/workspaces/remove`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：从列表中移除工作区。不会删除实际目录。
- 输入参数：
  - Body(JSON)：
    - `path` (string, 必填) — 要移除的工作区路径
- 输出示例：
```json
{"ok": true, "workspaces": []}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/remove' \
  -H 'Content-Type: application/json' \
  -d '{"path": "/home/user/myproject"}'
```

### `POST` `/api/workspaces/rename`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：重命名工作区（仅修改显示名称，不影响实际目录）。
- 输入参数：
  - Body(JSON)：
    - `path` (string, 必填) — 工作区路径
    - `name` (string, 必填) — 新显示名称
- 输出示例：
```json
{"ok": true, "workspaces": [{"path": "/workspace", "name": "新项目"}]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/rename' \
  -H 'Content-Type: application/json' \
  -d '{"path": "/workspace", "name": "新项目"}'
```

### `POST` `/api/workspaces/reorder`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：重新排序工作区列表。
- 输入参数：
  - Body(JSON)：
    - `order` (array[string], 必填) — 工作区路径的新顺序数组
- 输出示例：
```json
{"ok": true, "workspaces": [{"path": "/proj2", "name": "proj2"}, {"path": "/proj1", "name": "proj1"}]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/reorder' \
  -H 'Content-Type: application/json' \
  -d '{"order": ["/proj2", "/proj1"]}'
```

### `GET` `/api/workspaces/suggest?${qs}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`${qs}`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/workspaces/suggest?q=demo'
```

## Filesystem 接口

### `POST` `/api/file/create`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：在工作区创建新文件。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `path` (string, 必填) — 文件相对路径（含文件名）
- 输出示例：
```json
{"ok": true, "path": "src/newfile.js"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/create' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "path": "src/newfile.js"}'
```

### `POST` `/api/file/create-dir`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：在工作区创建新目录。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `path` (string, 必填) — 目录相对路径
- 输出示例：
```json
{"ok": true, "path": "src/components"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/create-dir' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "path": "src/components"}'
```

### `POST` `/api/file/delete`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：删除工作区中的文件或目录。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `path` (string, 必填) — 要删除的文件/目录相对路径
- 输出示例：
```json
{"ok": true, "path": "oldfile.txt"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/delete' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "path": "oldfile.txt"}'
```

### `POST` `/api/file/path`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/path' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/file/rename`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：重命名工作区中的文件或目录。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `old_path` (string, 必填) — 原路径
    - `new_path` (string, 必填) — 新路径
- 输出示例：
```json
{"ok": true, "from": "old.js", "to": "new.js"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/rename' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "old_path": "old.js", "new_path": "new.js"}'
```

### `POST` `/api/file/reveal`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/reveal' \
  -H 'Content-Type: application/json' \
  -d '{}'
```


### `GET` `/api/file/raw?session_id=&path=&download=`
- 来源文件：`workspace.js, ui.js`
- 输出类型：`二进制文件流 或 inline 显示`
- 描述：获取工作区文件的原始字节内容。支持 inline 预览（?inline=1）和强制下载（?download=1）。HTML/SVG 等危险 MIME 类型默认强制下载。
- 输入参数：
  - Query：
    - `session_id` (string, 必填) — 会话 ID
    - `path` (string, 必填) — 文件相对路径
    - `download` (string, 可选) — 设为 `1` 时强制以附件形式下载
    - `inline` (string, 可选) — 设为 `1` 时允许 HTML inline 预览（iframe sandbox 内）
- Demo：
```bash
# 下载文件
curl -X GET 'http://localhost:18787/api/file/raw?session_id=demo-session&path=README.md&download=1' -O

# Inline 预览 HTML
curl -X GET 'http://localhost:18787/api/file/raw?session_id=demo-session&path=index.html&inline=1'
```

### `GET` `/api/folder/download?session_id=&path=`
- 来源文件：`ui.js`
- 输出类型：`application/zip（文件下载）`
- 描述：将工作区中的指定文件夹打包为 zip 下载。自动跳过越界符号链接。受 `HERMES_WEBUI_FOLDER_ZIP_MAX_MB` 和 `HERMES_WEBUI_FOLDER_ZIP_MAX_FILES` 限制。
- 输入参数：
  - Query：
    - `session_id` (string, 必填) — 会话 ID
    - `path` (string, 必填) — 文件夹相对路径
- 响应头：
  - `Content-Disposition: attachment; filename="{folder_name}.zip"`
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/folder/download?session_id=demo-session&path=src' \
  -o src.zip
```


### `POST` `/api/file/save`
- 来源文件：`workspace.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：保存文件内容到工作区。文件路径必须在会话工作区范围内。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `path` (string, 必填) — 文件相对路径
    - `content` (string, 必填) — 文件内容
- 输出示例：
```json
{"ok": true, "path": "src/main.js", "size": 1024}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/save' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "path": "hello.txt", "content": "Hello World"}'
```

### `GET` `/api/file?session_id=${encodeURIComponent(S.session.session_id)}&path=${encodeURIComponent(path)}`
- 来源文件：`workspace.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`path, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/file?session_id=demo-session&path=.'
```

### `GET` `/api/list?session_id=${encodeURIComponent(S.session.session_id)}&path=${encodeURIComponent(dirPath)}`
- 来源文件：`workspace.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`path, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/list?session_id=demo-session&path=.'
```

### `GET` `/api/list?session_id=${encodeURIComponent(S.session.session_id)}&path=${encodeURIComponent(item.path)}`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`path, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/list?session_id=demo-session&path=.'
```

### `GET` `/api/list?session_id=${encodeURIComponent(S.session.session_id)}&path=${encodeURIComponent(path)}`
- 来源文件：`workspace.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`path, session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/list?session_id=demo-session&path=.'
```

### `GET` `/api/media?path=`
- 来源文件：`ui.js`
- 输出类型：`二进制媒体流（文件/图片等）`
- 输入参数：
  - Query：`path`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/media?path='
```

## Project 接口

### `GET` `/api/projects`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/projects'
```

### `POST` `/api/projects/create`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：创建新项目。项目用于组织相关会话。
- 输入参数：
  - Body(JSON)：
    - `name` (string, 必填) — 项目名称
    - `description` (string, 可选) — 项目描述
- 输出示例：
```json
{"ok": true, "project": {"id": "proj_abc", "name": "My Project"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/projects/create' \
  -H 'Content-Type: application/json' \
  -d '{"name": "My Project", "description": "这是一个示例项目"}'
```

### `POST` `/api/projects/delete`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：删除项目。关联的会话不会被删除，仅解除项目绑定。
- 输入参数：
  - Body(JSON)：
    - `project_id` (string, 必填) — 项目 ID
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/projects/delete' \
  -H 'Content-Type: application/json' \
  -d '{"project_id": "proj_abc"}'
```

### `POST` `/api/projects/rename`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：重命名项目。
- 输入参数：
  - Body(JSON)：
    - `project_id` (string, 必填) — 项目 ID
    - `name` (string, 必填) — 新名称
- 输出示例：
```json
{"ok": true, "project": {"id": "proj_abc", "name": "New Name"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/projects/rename' \
  -H 'Content-Type: application/json' \
  -d '{"project_id": "proj_abc", "name": "New Project Name"}'
```

## Profile 接口

### `GET` `/api/profile/active`
- 来源文件：`boot.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/profile/active'
```

### `POST` `/api/profile/create`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：创建新的 profile。每个 profile 有独立的模型、技能集和配置。
- 输入参数：
  - Body(JSON)：
    - `name` (string, 必填) — profile 名称，唯一标识
    - `model` (string, 可选) — 默认模型
    - `description` (string, 可选) — profile 描述
- 输出示例：
```json
{"ok": true, "profile": {"name": "coding", "model": "claude-sonnet-4-6"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/profile/create' \
  -H 'Content-Type: application/json' \
  -d '{"name": "coding", "model": "claude-sonnet-4-6", "description": "编程助手"}'
```

### `POST` `/api/profile/delete`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：删除指定 profile。当前活跃的 profile 不能删除。
- 输入参数：
  - Body(JSON)：
    - `name` (string, 必填) — 要删除的 profile 名称
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/profile/delete' \
  -H 'Content-Type: application/json' \
  -d '{"name": "old-profile"}'
```

### `POST` `/api/profile/switch`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：切换到指定 profile。profile 决定模型、提供商和技能集等配置。
- 输入参数：
  - Body(JSON)：
    - `name` (string, 必填) — 目标 profile 名称
- 输出示例：
```json
{"ok": true, "active": "coding", "profiles": [{"name": "coding", "model": "claude-sonnet-4-6"}]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/profile/switch' \
  -H 'Content-Type: application/json' \
  -d '{"name": "coding"}'
```

### `GET` `/api/profiles`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/profiles'
```

## Model 接口

### `POST` `/api/default-model`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：设置系统默认模型。更新配置文件中的默认模型设置。
- 输入参数：
  - Body(JSON)：
    - `model` (string, 必填) — 模型标识符，如 `claude-sonnet-4-6`
- 输出示例：
```json
{"ok": true, "model": "claude-sonnet-4-6"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/default-model' \
  -H 'Content-Type: application/json' \
  -d '{"model": "claude-sonnet-4-6"}'
```

### `GET` `/api/models`
- 来源文件：`commands.js, panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/models'
```


### `GET` `/api/models/live?provider=`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：从提供商 API 实时获取可用模型列表。支持 OpenRouter、Anthropic、Copilot、DeepSeek 等。结果会被缓存 5 分钟。
- 输入参数：
  - Query：`provider` (string, 可选) — 提供商 ID，默认使用当前活跃 profile 的提供商
- 输出示例：
```json
{"models": [{"id": "claude-sonnet-4-6", "name": "Claude Sonnet 4.6"}]}
```
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/models/live?provider=anthropic'
```


### `POST` `/api/models/refresh`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：刷新可用模型列表。从配置和提供商 API 重新加载模型信息。
- 输入参数：
  - Body(JSON)：无
- 输出示例：
```json
{"ok": true, "models": [{"id": "claude-sonnet-4-6", "name": "Claude Sonnet 4.6"}]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/models/refresh' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Provider 接口

### `GET` `/api/provider/quota`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/provider/quota'
```


### `GET` `/api/provider/cost-history?provider=&days=`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：获取指定提供商的成本历史数据，用于绘制成本趋势图。
- 输入参数：
  - Query：
    - `provider` (string, 可选) — 提供商 ID，默认所有提供商
    - `days` (integer, 可选) — 查询天数，范围 1-365，默认 7
- 输出示例：
```json
{"history": [{"date": "2026-05-15", "cost": 0.0234}]}
```
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/provider/cost-history?provider=anthropic&days=7'
```


### `GET` `/api/providers`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/providers'
```

### `POST` `/api/providers`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：添加或更新模型提供商配置。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 提供商唯一标识
    - `name` (string, 可选) — 显示名称
    - `api_key` (string, 可选) — API 密钥
    - `base_url` (string, 可选) — 自定义基础 URL
    - `models` (array, 可选) — 支持的模型列表
- 输出示例：
```json
{"ok": true, "providers": [{"id": "openrouter", "name": "OpenRouter"}]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/providers' \
  -H 'Content-Type: application/json' \
  -d '{"id": "openrouter", "api_key": "sk-xxx", "base_url": "https://openrouter.ai/api/v1"}'
```

### `POST` `/api/providers/delete`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：删除模型提供商配置。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 提供商 ID
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/providers/delete' \
  -H 'Content-Type: application/json' \
  -d '{"id": "openrouter"}'
```

## Skills 接口

### `GET` `/api/skills/content?name=${encodeURIComponent(name)}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`name`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/skills/content?name=demo-name'
```

### `GET` `/api/skills/content?name=${encodeURIComponent(skillName)}&file=${encodeURIComponent(filePath)}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`file, name`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/skills/content?name=demo-skill&file=SKILL.md'
```

### `POST` `/api/skills/save`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：保存 skill 文件内容。可更新现有 skill 或创建新 skill。
- 输入参数：
  - Body(JSON)：
    - `name` (string, 必填) — skill 名称
    - `file` (string, 可选) — 目标文件路径，默认 `SKILL.md`
    - `content` (string, 必填) — 文件内容
- 输出示例：
```json
{"ok": true, "name": "my-skill", "file": "SKILL.md"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/skills/save' \
  -H 'Content-Type: application/json' \
  -d '{"name": "my-skill", "content": "# My Skill\n\nThis skill does..."}'
```

## Memory 接口

### `GET` `/api/memory`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/memory'
```

### `POST` `/api/memory/write`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：写入记忆内容。记忆是跨会话持久化的上下文信息，Agent 可在后续对话中引用。
- 输入参数：
  - Body(JSON)：
    - `content` (string, 必填) — 记忆内容文本
    - `category` (string, 可选) — 记忆分类，如 `"project"`、`"preference"`
- 输出示例：
```json
{"ok": true, "memory_id": "mem_abc123"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/memory/write' \
  -H 'Content-Type: application/json' \
  -d '{"content": "用户偏好使用 TypeScript 和 React", "category": "preference"}'
```

## Terminal 接口

### `POST` `/api/terminal/close`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：关闭终端进程并清理资源。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/close' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session"}'
```

### `POST` `/api/terminal/input`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：向终端进程发送输入。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `input` (string, 必填) — 输入文本
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/input' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "input": "ls -la\n"}'
```

### `POST` `/api/terminal/resize`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：调整终端窗口大小（行列数）。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `cols` (integer, 可选) — 列数，默认 80
    - `rows` (integer, 可选) — 行数，默认 24
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/resize' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "cols": 120, "rows": 40}'
```

### `POST` `/api/terminal/start`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：为会话启动一个终端进程。终端在当前会话工作区目录中运行。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `command` (string, 可选) — 启动命令，默认使用系统 shell
    - `cwd` (string, 可选) — 工作目录，默认使用会话 workspace
- 输出示例：
```json
{"ok": true, "pid": 12345, "shell": "/bin/bash"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/start' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "command": "/bin/bash"}'
```


### `GET` `/api/terminal/output?session_id=`
- 来源文件：`terminal.js`
- 输出类型：`text/event-stream（SSE）`
- 描述：获取终端输出的 SSE 流。实时推送终端的输出事件（stdout/stderr）、关闭事件和心跳。
- 输入参数：
  - Query：`session_id` (string, 必填) — 会话 ID
- Demo：
```bash
curl -N 'http://localhost:18787/api/terminal/output?session_id=demo-session' \
  -H 'Accept: text/event-stream'
```



## Upload 接口

### `POST` `/api/upload`
- 来源文件：`boot.js, ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：上传文件到会话附件目录。支持 multipart/form-data，文件大小受 `HERMES_WEBUI_MAX_UPLOAD_MB` 限制（默认 50MB）。
- 输入参数：
  - Body(FormData)：
    - `session_id` (string, 必填) — 会话 ID
    - `file` (file, 必填) — 要上传的文件
- 输出示例：
```json
{"filename": "photo.png", "path": "/tmp/attachments/...", "size": 12345, "mime": "image/png", "is_image": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/upload' \
  -F 'session_id=demo-session' \
  -F 'file=@./photo.png'
```

### `POST` `/api/upload/extract`
- 来源文件：`boot.js, ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：上传 zip/tar 归档文件并自动解压到会话附件目录。支持 .zip、.tar.gz、.tar.bz2、.tar.xz 等格式。
- 输入参数：
  - Body(FormData)：
    - `session_id` (string, 必填) — 会话 ID
    - `file` (file, 必填) — 要上传的归档文件
- 输出示例：
```json
{"ok": true, "extracted": 15, "files": ["file1.txt", "dir/file2.js"]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/upload/extract' \
  -F 'session_id=demo-session' \
  -F 'file=@./project.zip'
```


## Cron 接口

### `GET` `/api/crons`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/crons'
```

### `POST` `/api/crons/create`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：创建新的定时任务（Cron Job）。使用 cron 表达式定义执行计划。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 任务唯一标识
    - `schedule` (string, 必填) — cron 表达式，如 `"0 9 * * 1-5"`（工作日 9 点）
    - `prompt` (string, 必填) — 执行时发送给 Agent 的提示词
    - `model` (string, 可选) — 执行时使用的模型
    - `enabled` (boolean, 可选) — 是否启用，默认 true
- 输出示例：
```json
{"ok": true, "job": {"id": "daily-report", "schedule": "0 9 * * *"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/create' \
  -H 'Content-Type: application/json' \
  -d '{"id": "daily-report", "schedule": "0 9 * * *", "prompt": "总结昨日代码提交", "model": "claude-sonnet-4-6"}'
```

### `POST` `/api/crons/delete`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：删除定时任务。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 要删除的任务 ID
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/delete' \
  -H 'Content-Type: application/json' \
  -d '{"id": "daily-report"}'
```

### `GET` `/api/crons/history?job_id=${encodeURIComponent(jobId)}&limit=50`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`job_id, limit`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/crons/history?job_id=demo-job&limit=50'
```

### `POST` `/api/crons/pause`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：暂停定时任务。已暂停的任务不会按 schedule 触发，但配置保留。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 任务 ID
- 输出示例：
```json
{"ok": true, "status": "paused"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/pause' \
  -H 'Content-Type: application/json' \
  -d '{"id": "daily-report"}'
```

### `GET` `/api/crons/recent?since=${_cronPollSince}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`since`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/crons/recent?since=0'
```

### `POST` `/api/crons/resume`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：恢复已暂停的定时任务。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 任务 ID
- 输出示例：
```json
{"ok": true, "status": "active"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/resume' \
  -H 'Content-Type: application/json' \
  -d '{"id": "daily-report"}'
```

### `POST` `/api/crons/run`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：立即手动触发定时任务执行（不按 schedule）。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 任务 ID
- 输出示例：
```json
{"ok": true, "task_id": "run_abc123"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/run' \
  -H 'Content-Type: application/json' \
  -d '{"id": "daily-report"}'
```

### `GET` `/api/crons/run?job_id=${encodeURIComponent(jobId)}&filename=${encodeURIComponent(filename)}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`filename, job_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/crons/run?job_id=demo-job&filename=demo.txt'
```

### `GET` `/api/crons/status?job_id=${encodeURIComponent(jobId)}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`job_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/crons/status?job_id=demo-job'
```


### `GET` `/api/crons/output?job_id=&limit=`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：获取定时任务的输出文件列表和内容。输出文件按修改时间倒序排列。
- 输入参数：
  - Query：
    - `job_id` (string, 必填) — 任务 ID
    - `limit` (integer, 可选) — 返回文件数量上限，默认 5
- 输出示例：
```json
{"job_id": "my-job", "outputs": [{"filename": "output_001.md", "content": "..."}]}
```
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/crons/output?job_id=my-job&limit=5'
```


### `POST` `/api/crons/update`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：更新定时任务配置。可以修改 schedule、prompt、model 等字段。
- 输入参数：
  - Body(JSON)：
    - `id` (string, 必填) — 任务 ID
    - `schedule` (string, 可选) — 新的 cron 表达式
    - `prompt` (string, 可选) — 新的提示词
    - `model` (string, 可选) — 新的模型
    - `enabled` (boolean, 可选) — 是否启用
- 输出示例：
```json
{"ok": true, "job": {"id": "daily-report", "schedule": "0 10 * * *"}}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/update' \
  -H 'Content-Type: application/json' \
  -d '{"id": "daily-report", "schedule": "0 10 * * *", "prompt": "更新后的提示词"}'
```

## Kanban 接口

### `GET` `/api/kanban/assignees`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/assignees'
```

### `GET` `/api/kanban/boards`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/boards'
```

### `POST` `/api/kanban/boards`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/kanban/boards' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `GET` `/api/kanban/boards/`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/boards/'
```

### `GET` `/api/kanban/config`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/config'
```

### `GET` `/api/kanban/stats`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/stats'
```

### `GET` `/api/kanban/tasks`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/tasks'
```

### `GET` `/api/kanban/tasks/`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/tasks/'
```

### `GET` `/api/kanban/tasks/bulk`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/kanban/tasks/bulk'
```

## Rollback 接口

### `GET` `/api/rollback/diff?workspace=${encodeURIComponent(workspace)}&checkpoint=${encodeURIComponent(checkpoint)}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`checkpoint, workspace`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/rollback/diff?workspace=/workspace&checkpoint=demo-checkpoint'
```

### `GET` `/api/rollback/list?workspace=${encodeURIComponent(workspace)}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`workspace`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/rollback/list?workspace=/workspace'
```

### `POST` `/api/rollback/restore`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：回滚工作区到指定检查点。恢复该检查点的文件状态。
- 输入参数：
  - Body(JSON)：
    - `workspace` (string, 必填) — 工作区路径
    - `checkpoint` (string, 必填) — 检查点标识
- 输出示例：
```json
{"ok": true, "restored": "/workspace/.rollback/checkpoint_abc"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/rollback/restore' \
  -H 'Content-Type: application/json' \
  -d '{"workspace": "/workspace", "checkpoint": "checkpoint_abc123"}'
```

## MCP 接口

### `GET` `/api/mcp/servers`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/mcp/servers'
```

### `GET` `/api/mcp/tools`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/mcp/tools'
```

## General 接口

### `GET` `/api/approval/pending?session_id=`
- 来源文件：`messages.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/approval/pending?session_id='
```

### `POST` `/api/approval/respond`
- 来源文件：`messages.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：响等待中的工具调用审批请求。可批准、拒绝或选择"始终批准"。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `tool_call_id` (string, 必填) — 工具调用 ID
    - `approved` (boolean, 必填) — 是否批准
    - `always_approve` (boolean, 可选) — 是否始终批准此类工具
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/approval/respond' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "tool_call_id": "call_abc", "approved": true}'
```

### `POST` `/api/background`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：启动后台任务。在独立线程中运行长时间任务，不阻塞当前会话。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `task` (string, 必填) — 任务描述或命令
- 输出示例：
```json
{"ok": true, "task_id": "task_abc123"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/background' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "task": "分析代码库结构"}'
```

### `GET` `/api/background/status?session_id=`
- 来源文件：`messages.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/background/status?session_id='
```

### `POST` `/api/btw`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：发起"顺便问一句"（By The Way）旁白问题。创建临时隐藏会话获取答案，不影响当前会话。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 父会话 ID（用于获取上下文）
    - `question` (string, 必填) — 旁白问题内容
- 输出示例：
```json
{"ok": true, "answer": "...", "stream_id": "stream_xyz"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/btw' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "question": "这个函数是什么意思？"}'
```

### `GET` `/api/clarify/pending?session_id=`
- 来源文件：`messages.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/clarify/pending?session_id='
```

### `POST` `/api/clarify/respond`
- 来源文件：`messages.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：响应 Agent 的澄清请求（clarification）。当 Agent 需要更多信息时发送澄清问题，用户通过此接口回复。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `clarify_id` (string, 必填) — 澄清请求 ID
    - `response` (string, 必填) — 用户回复内容
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/clarify/respond' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "clarify_id": "clarify_123", "response": "使用 React 而不是 Vue"}'
```

### `GET` `/api/commands`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/commands'
```


### `POST` `/api/commands/exec`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：执行已注册插件的命令。命令字符串格式为 `plugin_name:command_name [args...]`。
- 输入参数：
  - Body(JSON)：
    - `command` (string, 必填) — 要执行的插件命令，格式 `plugin:cmd [args]`
- 输出示例：
```json
{"output": "命令执行结果..."}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/commands/exec' \
  -H 'Content-Type: application/json' \
  -d '{"command": "git:status"}'
```


### `GET` `/api/dashboard/config`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/dashboard/config'
```

### `POST` `/api/dashboard/config`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/dashboard/config' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `GET` `/api/dashboard/status`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/dashboard/status'
```

### `GET` `/api/gateway/status`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/gateway/status'
```

### `GET` `/api/git-info?session_id=${encodeURIComponent(S.session.session_id)}`
- 来源文件：`workspace.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`session_id`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/git-info?session_id=demo-session'
```

### `POST` `/api/goal`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：设置会话目标（Goal）。目标会作为系统提示的一部分影响 Agent 行为。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `goal` (string, 必填) — 目标描述文本，空字符串表示清除目标
- 输出示例：
```json
{"ok": true, "goal": "完成用户登录功能"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/goal' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "goal": "完成用户登录功能开发"}'
```

### `GET` `/api/health/agent`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/health/agent'
```

### `GET` `/api/insights?days=${period}`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`days`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/insights?days=7'
```

### `GET` `/api/logs?file=`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`file`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/logs?file='
```

### `GET` `/api/personalities`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/personalities'
```

### `POST` `/api/personality/set`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：为会话设置 Agent 人格（personality）。人格定义了 Agent 的行为风格和角色定位。
- 输入参数：
  - Body(JSON)：
    - `session_id` (string, 必填) — 会话 ID
    - `name` (string, 必填) — 人格名称，空字符串表示清除人格
- 输出示例：
```json
{"ok": true, "personality": "senior-engineer"}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/personality/set' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "demo-session", "name": "senior-engineer"}'
```

### `GET` `/api/plugins`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/plugins'
```

### `GET` `/api/settings`
- 来源文件：`boot.js, panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/settings'
```

### `POST` `/api/settings`
- 来源文件：`commands.js, onboarding.js, panels.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：保存用户设置。完整设置对象会覆盖原有配置。
- 输入参数：
  - Body(JSON)：
    - `settings` (object, 必填) — 设置键值对对象，如 `{"theme": "dark", "language": "zh"}`
- 输出示例：
```json
{"ok": true}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/settings' \
  -H 'Content-Type: application/json' \
  -d '{"settings": {"theme": "dark", "show_line_numbers": true}}'
```

### `GET` `/api/system/health`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/system/health'
```

### `POST` `/api/transcribe`
- 来源文件：`boot.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：`<FormData>`
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/transcribe' \
  -F 'file=@./sample.wav'
```

### `POST` `/api/updates/apply`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：应用待安装的更新。执行 git pull 或包管理器更新。
- 输入参数：
  - Body(JSON)：无
- 输出示例：
```json
{"ok": true, "updated": ["server.py", "api/routes.py"]}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/updates/apply' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `GET` `/api/updates/check?force=1`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：`force`
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/updates/check?force=1'
```

### `POST` `/api/updates/force`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/updates/force' \
  -H 'Content-Type: application/json' \
  -d '{}'
```


### `POST` `/api/updates/summary`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 描述：使用 LLM 生成更新摘要。将待更新的文件列表和可选目标提交给 LLM，返回自然语言描述的变化摘要。
- 输入参数：
  - Body(JSON)：
    - `updates` (object, 必填) — 更新内容对象，格式 `{files: [...], changes: [...]}`
    - `target` (string, 可选) — 目标分支或提交哈希
- 输出示例：
```json
{"summary": "本次更新包含 3 个文件修改：修复了登录页面的样式问题..."}
```
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/updates/summary' \
  -H 'Content-Type: application/json' \
  -d '{"updates": {"files": ["login.js"]}, "target": "main"}'
```


### `GET` `/api/wiki/status`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/wiki/status'
```
