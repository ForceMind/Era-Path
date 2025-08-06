# 贡献指南

感谢您对时代之路项目的关注！我们欢迎各种形式的贡献。

## 🚀 如何贡献

### 报告问题
- 在 [Issues](https://github.com/ForceMind/Era-Path/issues) 页面提交bug报告
- 请详细描述问题，包括复现步骤
- 如果可能，请附上截图

### 提出建议
- 在 [Discussions](https://github.com/ForceMind/Era-Path/discussions) 分享想法
- 新功能建议请使用Feature Request模板

### 代码贡献

#### 开发环境设置
1. Fork 仓库
2. 克隆到本地：
   ```bash
   git clone https://github.com/YOUR_USERNAME/Era-Path.git
   cd Era-Path
   ```
3. 启动本地服务器：
   ```bash
   python -m http.server 8000
   # 或
   npx serve .
   ```

#### 开发流程
1. 创建新分支：`git checkout -b feature/your-feature-name`
2. 进行开发并测试
3. 提交代码：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature-name`
5. 创建Pull Request

## 📝 代码规范

### JavaScript
- 使用ES6+语法
- 函数和变量使用英文命名
- 注释使用中文说明功能
- 保持代码简洁可读

### CSS
- 使用BEM命名规范
- 移动端优先的响应式设计
- 合理使用CSS变量

### 文件结构
- 游戏逻辑：`game.js`
- 事件数据：`events.js`
- 行动数据：`actions.js`
- 样式文件：`style.css`

## 🎮 内容贡献

### 添加事件
在 `events.js` 中添加新事件：
```javascript
{
    id: 'new_event_id',
    name: '事件名称',
    desc: '事件描述',
    type: 'opportunity', // opportunity, crisis, decision
    stageMin: 0, // 最小阶段
    stageMax: 6, // 最大阶段
    turnMin: 1,  // 最小回合
    turnMax: 100, // 最大回合
    effects: {
        population: 5,
        food: -10
    }
}
```

### 添加行动
在 `actions.js` 中添加新行动：
```javascript
{
    id: 'new_action_id',
    name: '行动名称',
    desc: '行动描述',
    stageMin: 0,
    stageMax: 6,
    costs: {
        food: 10
    },
    effects: {
        tech: 5
    }
}
```

## 🎯 优先级

### 高优先级
- Bug修复
- 性能优化
- 移动端体验改善

### 中优先级
- 新事件和行动
- UI/UX改进
- 新功能

### 低优先级
- 代码重构
- 文档完善

## 🧪 测试

### 基础测试
- 在多个浏览器中测试
- 测试移动端和桌面端
- 验证游戏平衡性

### 测试清单
- [ ] 游戏能正常开始和结束
- [ ] 所有按钮和界面交互正常
- [ ] 移动端面板能正确展开/收起
- [ ] 资源计算正确
- [ ] 存档系统工作正常

## 📧 联系方式

- GitHub Issues: 技术问题和bug报告
- GitHub Discussions: 功能建议和讨论
- Pull Request: 代码贡献

感谢您的贡献！🎉
