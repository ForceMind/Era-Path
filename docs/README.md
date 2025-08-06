# 时代之路 | Era Path

## 🎮 游戏简介

**时代之路**是一款单人卡牌策略游戏，玩家将引导文明从原始部落发展到星际时代。通过明智的决策和资源管理，带领你的文明穿越七个伟大的历史时期。

## ✨ 游戏特色

- 🌍 **七大文明阶段**：从部落文明到星际文明的完整发展历程
- 🎯 **策略决策**：每年面临3个事件选择，每个决定都将影响文明走向
- 📱 **响应式设计**：完美适配PC和移动设备
- 💾 **自动保存**：游戏进度自动保存，随时继续冒险
- 🏆 **文明遗产**：失败也有收获，遗产系统让下次游戏更有优势
- 🎨 **沉浸式体验**：每个时代都有独特的视觉主题和音效

## 🎯 游戏目标

引导你的文明从部落时代发展到星际文明，尽可能生存更多年数，达成最终的星际时代胜利！

## 🎲 游戏玩法

### 基础流程
1. **选择起源地**：5个不同的地理位置，各有优劣
2. **年度循环**：
   - 每年抽取3张事件卡，选择1张执行
   - 事件影响6种核心资源
   - 选择1个行动进一步发展文明
   - 消耗资源维持文明运转

### 核心资源
- 👥 **人口**：文明的根基，过少将导致灭亡
- 🌾 **粮食**：维持人口生存的必需品
- 🔬 **科技**：推动文明进步的关键
- ⚔️ **军力**：保护文明免受威胁
- 🎭 **文化**：维系社会凝聚力
- 🌿 **环境**：生态平衡，破坏过度将导致崩溃

### 文明阶段
1. **部落文明**：采集狩猎的原始社会
2. **农业文明**：掌握农业的定居社会
3. **城邦文明**：城市与贸易的兴起
4. **帝国时代**：统一的大型政治实体
5. **工业文明**：机械化生产的新时代
6. **信息文明**：数字化信息社会
7. **星际文明**：征服星辰大海

## 🚀 快速开始

### 在线游戏
直接访问：[https://forcemind.github.io/Era-Path/](https://forcemind.github.io/Era-Path/)

### 本地运行
1. 克隆仓库：
```bash
git clone https://github.com/ForceMind/Era-Path.git
```

2. 进入项目目录：
```bash
cd Era-Path
```

3. 使用任意HTTP服务器运行：
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 或直接用浏览器打开 index.html
```

## 📱 设备支持

- **桌面端**：Chrome, Firefox, Safari, Edge
- **移动端**：iOS Safari, Android Chrome
- **分辨率**：自适应各种屏幕尺寸

## 🛠️ 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **存储**：LocalStorage（本地保存游戏进度）
- **架构**：纯前端实现，无需服务器

## 📁 项目结构

```
Era-Path/
├── index.html              # 主页面
├── src/                    # 源代码目录
│   ├── js/                 # JavaScript文件
│   │   ├── game.js         # 游戏核心逻辑
│   │   ├── events.js       # 事件数据
│   │   └── actions.js      # 行动数据
│   ├── css/                # 样式文件
│   │   └── style.css       # 主样式文件
│   └── assets/             # 静态资源
│       └── favicon.svg     # 网站图标
├── docs/                   # 文档目录
│   ├── README.md           # 项目说明
│   ├── GAME_GUIDE.md       # 详细游戏指南
│   └── CHANGELOG.md        # 更新日志
└── tests/                  # 测试文件
    ├── test.html           # 基础测试页面
    └── legacy-test.html    # 传承奖励测试页面
```

## 🎮 游戏截图

### 桌面端界面
![桌面端游戏界面](docs/screenshots/desktop.png)

### 移动端界面
![移动端游戏界面](docs/screenshots/mobile.png)

### 文明进阶提示
![文明进阶](docs/screenshots/advancement.png)

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 这个仓库
2. 创建特性分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交Pull Request

### 开发建议
- 保持代码注释的完整性
- 新增事件和行动时保持游戏平衡
- 测试多种设备和分辨率
- 遵循现有的代码风格

## 📈 版本历史

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细的版本更新信息。

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 👨‍💻 作者

- **ForceMind** - *项目创建者* - [GitHub](https://github.com/ForceMind)

## 🙏 致谢

- 感谢所有测试和反馈的玩家
- 感谢开源社区的支持

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/ForceMind/Era-Path/issues)
- 发起 [Discussion](https://github.com/ForceMind/Era-Path/discussions)

---

⭐ 如果你喜欢这个项目，请给它一个星标！

[🎮 立即开始游戏](https://forcemind.github.io/Era-Path/) | [📖 详细指南](GAME_GUIDE.md) | [🐛 报告问题](https://github.com/ForceMind/Era-Path/issues)
