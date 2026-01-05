# Claude Code + Linear 自动化项目管理指南

本文档介绍如何使用 Claude Code 与 Linear 集成，实现自动化项目管理和开发任务执行。

## 目录

- [概述](#概述)
- [前置条件](#前置条件)
- [方法 1: Linear Skill 直接调用](#方法-1-linear-skill-直接调用)
- [方法 2: Headless Mode 自动化](#方法-2-headless-mode-自动化)
- [方法 3: Claude Flow 多代理协作](#方法-3-claude-flow-多代理协作)
- [方法 4: 自动化脚本](#方法-4-自动化脚本)
- [方法 5: GitHub Actions 集成](#方法-5-github-actions-集成)
- [最佳实践](#最佳实践)
- [参考资源](#参考资源)

---

## 概述

Claude Code 可以通过 MCP (Model Context Protocol) 与 Linear 集成，实现：

- 自动读取 Linear issue 详情
- 根据 issue 描述自动编写代码
- 自动提交代码到 GitHub
- 自动更新 Linear issue 状态
- 多个 Claude 实例并行处理不同任务

## 前置条件

### 1. 安装 Linear Skill

```bash
# 方法 A: 使用 Claude 插件命令
claude plugin add github:wrsmith108/linear-claude-skill

# 方法 B: 手动克隆到 skills 目录
git clone https://github.com/wrsmith108/linear-claude-skill ~/.claude/skills/linear
```

### 2. 配置 Linear API Key

1. 访问 Linear Settings → Security & Access → API Keys
2. 创建新的 API Key
3. 设置环境变量：

```bash
export LINEAR_API_KEY="lin_api_xxxxxxxxxxxxx"
```

或添加到 `~/.zshrc` / `~/.bashrc`：

```bash
echo 'export LINEAR_API_KEY="lin_api_xxxxxxxxxxxxx"' >> ~/.zshrc
source ~/.zshrc
```

### 3. 验证配置

```bash
cd ~/.claude/skills/linear/skills/linear
npx tsx scripts/setup.ts
```

成功输出：
```
========================================
  STATUS: Ready to use!
========================================
```

---

## 方法 1: Linear Skill 直接调用

最简单的方式，在 Claude Code 对话中直接引用 Linear issue：

### 基本用法

```bash
# 启动 Claude Code
claude

# 在对话中请求处理 issue
> 请查看 Linear issue SUC-11，分析需要做什么，然后完成这个任务
```

### 使用脚本命令

```bash
# 列出所有项目
npx tsx ~/.claude/skills/linear/skills/linear/scripts/linear-ops.ts list-projects

# 创建 issue
npx tsx ~/.claude/skills/linear/skills/linear/scripts/linear-ops.ts create-issue "项目名" "标题" "描述" --priority 2

# 更新 issue 状态
npx tsx ~/.claude/skills/linear/skills/linear/scripts/linear-ops.ts status Done SUC-11
```

### 工作流程

1. Claude 读取 Linear issue 详情
2. 分析任务需求
3. 自动编写代码/执行命令
4. 测试验证
5. 提交代码
6. 更新 issue 状态为 Done

---

## 方法 2: Headless Mode 自动化

使用 `--dangerously-skip-permissions` 标志让 Claude 自主执行，无需人工确认。

### 基本命令

```bash
claude --dangerously-skip-permissions -p "
从 Linear 获取 issue SUC-11，完成以下步骤：
1. 读取 issue 描述
2. 执行所需的开发工作
3. 提交代码到 GitHub
4. 更新 Linear issue 状态为 Done
"
```

### 带输出的命令

```bash
claude --dangerously-skip-permissions --output-format json -p "完成 Linear issue SUC-11" > result.json
```

### 注意事项

> **警告**: `--dangerously-skip-permissions` 给予 Claude 完全权限，包括：
> - 读写任意文件
> - 执行任意 shell 命令
> - 访问网络
>
> 请仅在受信任的环境中使用。

---

## 方法 3: Claude Flow 多代理协作

[Claude Flow](https://github.com/ruvnet/claude-flow) 是一个企业级的多代理编排平台，支持多个 Claude 实例并行工作。

### 安装

```bash
npm install -g @anthropic-ai/claude-flow
```

### 配置

创建 `claude-flow.config.json`：

```json
{
  "swarm": {
    "maxAgents": 5,
    "coordinationMode": "distributed"
  },
  "linear": {
    "projectId": "context-graph-marketplace-website",
    "autoSync": true
  },
  "github": {
    "repo": "jesseqin-kamiwaza/contextgraph_site",
    "autoPR": true
  }
}
```

### 启动多代理

```bash
# 并行处理多个 issues
claude-flow swarm --tasks "SUC-10,SUC-11,SUC-12" --parallel 3

# 监控状态
claude-flow status
```

### 特点

- 多个 Claude 实例同时工作
- 自动任务分配和负载均衡
- 分布式任务处理
- 自动协调避免代码冲突
- 内置 Git worktree 支持

---

## 方法 4: 自动化脚本

创建 shell 脚本批量处理 issues。

### 基本脚本

```bash
#!/bin/bash
# scripts/auto-complete-issues.sh

set -e

ISSUES=("SUC-10" "SUC-11" "SUC-12" "SUC-13")
PROJECT_DIR="/Users/jesseqin/Documents/Explore/context_graph_site"

for issue in "${ISSUES[@]}"; do
  echo "=========================================="
  echo "Processing $issue..."
  echo "=========================================="

  cd "$PROJECT_DIR"

  # 创建新分支
  git checkout -b "feature/$issue" main 2>/dev/null || git checkout "feature/$issue"

  # 让 Claude 完成任务
  claude --dangerously-skip-permissions -p "
    1. 从 Linear 获取 issue $issue 的详情
    2. 完成 issue 中描述的任务
    3. 确保代码可以通过 build
    4. 不要提交代码，我会手动审查
  "

  echo "Completed $issue, please review changes."
  echo ""
done
```

### 高级脚本（带错误处理）

```bash
#!/bin/bash
# scripts/smart-auto-complete.sh

set -e

PROJECT_DIR="/Users/jesseqin/Documents/Explore/context_graph_site"
LINEAR_SKILL_DIR="$HOME/.claude/skills/linear/skills/linear"
LOG_DIR="$PROJECT_DIR/logs"

mkdir -p "$LOG_DIR"

# 获取 Todo 状态的 issues
get_todo_issues() {
  cd "$LINEAR_SKILL_DIR"
  npx tsx scripts/query.ts 'query {
    issues(filter: {
      project: { name: { eq: "Context Graph Marketplace Website" } }
      state: { name: { eq: "Todo" } }
    }) {
      nodes { identifier title priority }
    }
  }' 2>/dev/null | jq -r '.data.issues.nodes[] | .identifier'
}

# 处理单个 issue
process_issue() {
  local issue=$1
  local log_file="$LOG_DIR/${issue}_$(date +%Y%m%d_%H%M%S).log"

  echo "Processing $issue..." | tee -a "$log_file"

  cd "$PROJECT_DIR"

  # 更新 Linear 状态为 In Progress
  cd "$LINEAR_SKILL_DIR"
  npx tsx scripts/linear-ops.ts status "In Progress" "$issue" 2>&1 | tee -a "$log_file"

  cd "$PROJECT_DIR"

  # 创建分支
  git checkout main
  git pull origin main
  git checkout -b "feature/$issue"

  # 执行 Claude
  if claude --dangerously-skip-permissions -p "
    完成 Linear issue $issue:
    1. 读取 issue 详情
    2. 实现所需功能
    3. 运行 npm run build 确保没有错误
    4. 完成后告诉我结果
  " 2>&1 | tee -a "$log_file"; then

    # 成功：提交代码
    git add -A
    git commit -m "feat: Complete $issue" || true

    # 更新状态为 Done
    cd "$LINEAR_SKILL_DIR"
    npx tsx scripts/linear-ops.ts status "Done" "$issue"

    echo "SUCCESS: $issue completed" | tee -a "$log_file"
  else
    # 失败：回滚
    cd "$PROJECT_DIR"
    git checkout main
    git branch -D "feature/$issue" 2>/dev/null || true

    echo "FAILED: $issue" | tee -a "$log_file"
  fi
}

# 主循环
main() {
  echo "Fetching Todo issues..."
  issues=$(get_todo_issues)

  for issue in $issues; do
    process_issue "$issue"
  done
}

main
```

---

## 方法 5: GitHub Actions 集成

在 CI/CD 中自动处理 Linear issues。

### 工作流配置

```yaml
# .github/workflows/auto-dev.yml
name: Auto Complete Linear Issues

on:
  schedule:
    - cron: '0 9 * * 1-5'  # 周一至周五早上 9 点
  workflow_dispatch:  # 允许手动触发
    inputs:
      issue_id:
        description: 'Linear Issue ID (e.g., SUC-11)'
        required: false

env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  LINEAR_API_KEY: ${{ secrets.LINEAR_API_KEY }}

jobs:
  process-issues:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Process Linear Issue
        run: |
          if [ -n "${{ github.event.inputs.issue_id }}" ]; then
            ISSUE="${{ github.event.inputs.issue_id }}"
          else
            ISSUE="next-todo"  # 获取下一个 Todo issue
          fi

          claude --dangerously-skip-permissions -p "
            完成 Linear issue $ISSUE:
            1. 获取 issue 详情
            2. 实现功能
            3. 运行测试
            4. 如果成功，提交代码并创建 PR
            5. 更新 Linear 状态
          "

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'feat: Auto-complete Linear issue'
          title: '[Auto] Complete Linear Issue'
          body: 'This PR was automatically generated by Claude Code.'
          branch: auto-feature
```

### 配置 Secrets

在 GitHub 仓库设置中添加：

- `ANTHROPIC_API_KEY`: Claude API 密钥
- `LINEAR_API_KEY`: Linear API 密钥

---

## 最佳实践

### 1. 任务拆分

每个 Linear issue 应该：

- **足够小**: Claude 可以在一次对话中完成（< 30 分钟工作量）
- **独立性强**: 不依赖其他未完成的 issues
- **明确边界**: 清晰的开始和结束条件

### 2. Issue 描述规范

```markdown
## 目标
[一句话描述要实现什么]

## 验收标准
- [ ] 标准 1
- [ ] 标准 2
- [ ] 标准 3

## 技术细节
- 涉及文件: `path/to/file.ts`
- 相关组件: ComponentName
- API 端点: `/api/xxx`

## 测试要求
- 运行 `npm run build` 无错误
- 运行 `npm run test` 通过
```

### 3. 人工检查点

关键步骤设置人工审核：

| 阶段 | 自动化 | 人工审核 |
|------|--------|----------|
| 读取 issue | ✅ | |
| 编写代码 | ✅ | |
| 运行测试 | ✅ | |
| 代码审查 | | ✅ |
| PR 合并 | | ✅ |
| 部署生产 | | ✅ |

### 4. 错误恢复策略

```bash
# 如果 Claude 执行失败，自动回滚
git checkout main
git branch -D feature/SUC-XX

# 更新 Linear 状态为 Blocked
npx tsx scripts/linear-ops.ts status "Backlog" SUC-XX
```

### 5. 监控和日志

- 保存每次执行的日志
- 跟踪成功率和失败原因
- 定期审查自动化效果

---

## 参考资源

### 官方文档

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Building Agents with Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)

### 工具和插件

- [linear-claude-skill](https://github.com/wrsmith108/linear-claude-skill) - Linear 集成 skill
- [Claude Flow](https://github.com/ruvnet/claude-flow) - 多代理编排平台
- [Composio Linear MCP](https://composio.dev/blog/how-to-set-up-linear-mcp-in-claude-code-to-automate-issue-tracking) - MCP 设置指南

### 社区资源

- [Agentic Claude Code Workflow with Linear](https://www.hypeflo.ws/workflow/agentic-claude-code-workflow-with-linear-integration)
- [Claude Code as Project Manager](https://benenewton.com/blog/claude-code-roadmap-management)
- [CCPM - GitHub Issues Based PM](https://github.com/automazeio/ccpm)

---

## 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2025-01-05 | 1.0 | 初始版本 |

---

*本文档由 Claude Code 自动生成，用于 Context Graph Marketplace 项目。*
