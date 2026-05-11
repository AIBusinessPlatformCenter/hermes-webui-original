# Hermes WebUI API 文档（完善版）

本页基于 `hermes-webui-original/static/*.js` 的真实调用位点与 `api/routes.py` 路由进行整理。

- 后端入口：`hermes-webui-original/server.py` -> `api/routes.py`
- 接口范围：仅包含前端当前实际调用到的接口（不含未调用的保留路由）
- 说明：部分接口会在 WebUI 服务端进一步调用 `hermes-agent-original` 能力，但对前端暴露统一为 `/api/*`
- 总接口数（方法+路径维度）：**146**

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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/onboarding/setup' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/chat/start' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/reasoning' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Session 接口

### `POST` `/api/session/archive`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/archive' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/branch`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/branch' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/clear`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/clear' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/compress`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/compress' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/conversation-rounds`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/conversation-rounds' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/delete`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/delete' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/duplicate`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/duplicate' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/handoff-summary`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/handoff-summary' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/import`
- 来源文件：`boot.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/import' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/import_cli`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/import_cli' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/move`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/move' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/new`
- 来源文件：`panels.js, sessions.js, ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/new' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/pin`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/pin' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/rename`
- 来源文件：`commands.js, messages.js, panels.js, sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/rename' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/retry`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/retry' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/toolsets`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/toolsets' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/truncate`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/truncate' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/undo`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/undo' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/update`
- 来源文件：`boot.js, panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/update' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/session/yolo`
- 来源文件：`commands.js, messages.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/session/yolo' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/add' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/workspaces/remove`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/remove' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/workspaces/rename`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/rename' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/workspaces/reorder`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/workspaces/reorder' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/create' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/file/create-dir`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/create-dir' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/file/delete`
- 来源文件：`ui.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/delete' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/rename' \
  -H 'Content-Type: application/json' \
  -d '{}'
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

### `POST` `/api/file/save`
- 来源文件：`workspace.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/file/save' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/projects/create' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/projects/delete`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/projects/delete' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/projects/rename`
- 来源文件：`sessions.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/projects/rename' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/profile/create' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/profile/delete`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/profile/delete' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/profile/switch`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/profile/switch' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/default-model' \
  -H 'Content-Type: application/json' \
  -d '{}'
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

### `POST` `/api/models/refresh`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/providers' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/providers/delete`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/providers/delete' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Skills 接口

### `GET` `/api/skills`
- 来源文件：`commands.js, panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body：通常无
- Demo：
```bash
curl -X GET 'http://localhost:18787/api/skills'
```

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

### `POST` `/api/skills/delete`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/skills/delete' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/skills/save`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/skills/save' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/memory/write' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Terminal 接口

### `POST` `/api/terminal/close`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/close' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/terminal/input`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/input' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/terminal/resize`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/resize' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/terminal/start`
- 来源文件：`terminal.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/terminal/start' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/create' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/crons/delete`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/delete' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/pause' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/resume' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/crons/run`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/run' \
  -H 'Content-Type: application/json' \
  -d '{}'
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

### `POST` `/api/crons/update`
- 来源文件：`panels.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/crons/update' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/rollback/restore' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/approval/respond' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### `POST` `/api/background`
- 来源文件：`commands.js`
- 输出类型：`application/json（JSON 对象）`
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/background' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/btw' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/clarify/respond' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/goal' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/personality/set' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
- Demo：
```bash
curl -X POST 'http://localhost:18787/api/settings' \
  -H 'Content-Type: application/json' \
  -d '{}'
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
- 输入参数：
  - Query：无
  - Body(JSON)：无或按后端默认
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
