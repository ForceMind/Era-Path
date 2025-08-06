# GitHub 上传指南

## 📋 上传步骤

### 1. 安装 Git
如果您的系统还没有安装Git，请：
- 下载Git: https://git-scm.com/download/windows
- 安装完成后重启命令行

### 2. 配置 Git（首次使用）
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. 初始化仓库
在项目目录下执行：
```bash
git init
```

### 4. 添加远程仓库
```bash
git remote add origin https://github.com/ForceMind/Era-Path.git
```

### 5. 添加文件到暂存区
```bash
git add .
```

### 6. 提交代码
```bash
git commit -m "Initial commit: Era Path v2.1.0"
```

### 7. 推送到GitHub
```bash
git push -u origin main
```

## 🔄 后续更新流程

当您需要更新代码时：
```bash
git add .
git commit -m "描述您的更改"
git push
```

## 🌐 GitHub Pages 设置

1. 进入仓库设置页面
2. 找到 "Pages" 选项
3. 选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 选择 "/ (root)" 目录
6. 点击 "Save"

几分钟后，您的游戏将在以下地址可访问：
https://forcemind.github.io/Era-Path/

## 📁 文件结构检查

请确保您的项目包含以下文件：
- ✅ index.html
- ✅ style.css
- ✅ game.js
- ✅ events.js
- ✅ actions.js
- ✅ favicon.svg
- ✅ README.md
- ✅ LICENSE
- ✅ CHANGELOG.md
- ✅ CONTRIBUTING.md
- ✅ GAME_GUIDE.md
- ✅ package.json
- ✅ .gitignore
- ✅ .github/workflows/deploy.yml

## 🎯 完成后的链接

- **游戏地址**: https://forcemind.github.io/Era-Path/
- **仓库地址**: https://github.com/ForceMind/Era-Path
- **Issues**: https://github.com/ForceMind/Era-Path/issues
- **Wiki**: https://github.com/ForceMind/Era-Path/wiki
