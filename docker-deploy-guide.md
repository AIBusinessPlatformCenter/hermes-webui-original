# Docker 部署指南

## 1. 打包镜像

在主仓库目录执行：

```bash
./build-and-save.sh
```

输出到 `dist/` 目录：
- `hermes-aiplatform-amd64.tar.gz`
- `hermes-aiplatform-arm64.tar.gz`

## 2. 传输到目标服务器

```bash
scp dist/hermes-aiplatform-amd64.tar.gz user@target:/opt/hermes/
scp docker-compose.yml user@target:/opt/hermes/
scp hermes.env user@target:/opt/hermes/
```

## 3. 加载镜像

```bash
docker load -i hermes-aiplatform-amd64.tar.gz
```

## 4. 启动服务

```bash
# 确保 hermes.env 已配置
cp hermes-env.example hermes.env

# 启动
HERMES_ENV_FILE=./hermes.env docker compose up -d
```

## 5. 访问地址

- WebUI: `http://target-ip:18787`
- Agent Gateway: `http://target-ip:18642`

## 6. 常用命令

```bash
# 停止
docker compose down

# 重启
docker compose restart

# 查看日志
docker compose logs -f hermes-agent
docker compose logs -f hermes-webui

# 进入容器
docker exec -it hermes-agent bash
```

## 7. 故障排查

| 问题 | 解决 |
|------|------|
| 端口被占用 | 修改 docker-compose.yml 中的端口映射 |
| 镜像加载失败 | 确认架构匹配 (`uname -m`) |
| 环境变量不生效 | 确认 hermes.env 已挂载 |
