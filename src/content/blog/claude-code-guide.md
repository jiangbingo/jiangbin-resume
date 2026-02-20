---
title: "Claude Code 使用指南 - 从入门到精通"
description: "Claude Code CLI 工具的完整使用手册，涵盖安装配置、常用命令、MCP 扩展和实战技巧。"
date: 2026-02-16
tags: [Claude Code, AI 工具, 开发效率, CLI]
publish: true
author: Jiang Bin
---

## 安装和配置

### 安装

```bash
npm install -g @anthropic-ai/claude-code
```

### 配置 API

```bash
# 设置 API 地址（不同的中转平台对应的不一样）
export ANTHROPIC_BASE_URL="https://api.anthropic.com"

# 设置你的 API 密钥
export ANTHROPIC_AUTH_TOKEN="你的API密钥"
```

> 建议把这两行加到你的 `.bashrc` 或 `.zshrc` 文件里，这样每次开终端都自动加载。

## 项目初始化

### 打开项目

```bash
cd 你的项目目录
claude
```

### 初始化项目规则

```
/init
```

这个命令会自动分析你的项目，设置一些项目级别的规则。

### 设置使用偏好

```
/memory
```

用这个命令可以：
- 修改项目级别的规则
- 设置用户全局规则（比如「使用中文交互」）
- 告诉 Claude 你的编码习惯

## 开始使用

### 直接提问

直接用自然语言问就行：

```
帮我看看这个函数有什么问题

重构一下这段代码

给我写个登录接口
```

### 指定文件或目录

用 `@` 符号指定具体文件：

```
@src/utils.js 这个文件里的工具函数能优化吗？

@components/ 这个目录下的组件有重复代码，帮我抽取一下
```

### 拖拽文件

你也可以直接把文件或文件夹拖到 Claude Code 里，它会自动识别。

## 管理上下文

### 清除对话历史

当对话变得很长时，Claude Code 会自动压缩上下文。但更好的习惯是：

```
/clear
```

一个问题解决完就清除一次，这样能：
- 节省 token
- 减少 AI 幻觉
- 让新对话更准确

### 好习惯：经常提交代码

```bash
git add .
git commit -m "完成xxx功能"
```

完成一个小功能就提交一次，这样出问题也好回滚。

## 安装常用 MCP

MCP 是一些扩展插件，让 Claude Code 更强大。

### 上下文增强

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### 深度搜索

```bash
claude mcp add mcp-deepwiki -- npx -y mcp-deepwiki@latest
```

### 思考增强

```bash
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking@latest
```

## 使用深度思考

遇到复杂问题时，可以用这些关键词：

| 关键词 | 适用场景 |
|--------|----------|
| `ultrathink` | 复杂问题，需要深度推理 |
| `hard think` | 深度思考 |
| `think` | 简单思考 |

示例：

```
ultrathink 这个架构设计有什么问题？
```

它会读取更多上下文，配合 sequential-thinking MCP 给出更准确的答案。

## 使用计划模式

处理大功能时，先规划再执行：

```
计划模式：我要重构整个用户管理模块
```

Claude Code 会先给你一个详细的实施计划，你满意了再执行。

## 常用指令速查

| 指令 | 功能 |
|------|------|
| `/help` | 查看所有可用指令 |
| `/clear` | 清除对话 |
| `/memory` | 管理记忆 |
| `/init` | 初始化项目 |
| `/commit` | 提交代码 |
| `/plan` | 计划模式 |

## 实用技巧

### 文件操作

```
显示 @package.json
修改 @src/App.js 的第50行
搜索项目中所有的 "TODO"
```

### 代码生成

```
写一个用户登录的接口
给这个组件加个加载状态
帮我写个工具函数处理日期格式化
```

### 问题诊断

```
这个报错是什么原因？
为什么这里的性能这么差？
这段代码有什么潜在问题？
```

## 总结：八步上手

1. **安装配置** → 设置 API 密钥
2. **初始化项目** → `/init`
3. **开始提问** → 自然语言交互
4. **及时清理上下文** → `/clear`
5. **装几个有用的 MCP** → 增强功能
6. **复杂问题用 ultrathink** → 深度推理
7. **大功能先做计划** → 计划模式
8. **多用各种指令** → 提高效率

---

> 记住几个要点：问题解决了就 `/clear`，代码写完了就 `git commit`，复杂问题用 `ultrathink`，大功能先用计划模式。
