#!/bin/bash
# Hermes WebUI + Agent 快速启动脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

usage() {
  echo "用法: $0 [命令]"
  echo ""
  echo "命令:"
  echo "  load          加载 Docker 镜像"
  echo "  start         启动 WebUI + Agent"
  echo "  stop          停止所有服务"
  echo "  status        查看服务状态"
  echo "  logs [服务]   查看日志 (hermes-agent / hermes-webui)"
  echo ""
  echo "示例:"
  echo "  $0 load       # 加载镜像"
  echo "  $0 start      # 启动服务"
  echo "  $0 logs webui # 查看 WebUI 日志"
}

load_image() {
  for f in hermes-aiplatform-*.tar.gz; do
    if [ -f "$f" ]; then
      echo "[load] $f"
      docker load -i "$f"
    fi
  done
  echo "[done] 镜像加载完成"
}

start_services() {
  if [ ! -f "hermes.env" ]; then
    echo "[!] hermes.env 不存在，复制模板..."
    cp hermes-env.example hermes.env 2>/dev/null || true
  fi
  HERMES_ENV_FILE=./hermes.env docker compose up -d
  echo "[done] 服务已启动"
  echo "  WebUI:    http://localhost:18787"
  echo "  Gateway:  http://localhost:18642"
}

stop_services() {
  docker compose down
  echo "[done] 服务已停止"
}

show_status() {
  docker compose ps
}

show_logs() {
  local svc="${1:-hermes-webui}"
  docker compose logs -f "$svc"
}

case "${1:-}" in
  load)    load_image ;;
  start)   start_services ;;
  stop)    stop_services ;;
  status)  show_status ;;
  logs)    show_logs "${2:-hermes-webui}" ;;
  -h|--help|help) usage ;;
  *)       usage ;;
esac
