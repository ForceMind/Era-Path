// game.js - Main logic for Civilization Card Roguelike Game
// All UI text and game content in Simplified Chinese
// All code comments and variable names in English

// --- Data Definitions ---

// Civilization stages with balanced progression
const stages = [
    { key: 'tribe', name: '部落文明', bgClass: 'stage-tribe', unlockTech: 0, description: '采集狩猎的原始社会' },
    { key: 'agriculture', name: '农业文明', bgClass: 'stage-agriculture', unlockTech: 30, description: '掌握农业的定居社会' },
    { key: 'city', name: '城邦文明', bgClass: 'stage-city', unlockTech: 80, description: '城市与贸易的兴起' },
    { key: 'empire', name: '帝国时代', bgClass: 'stage-empire', unlockTech: 150, description: '统一的大型政治实体' },
    { key: 'industrial', name: '工业文明', bgClass: 'stage-industrial', unlockTech: 250, description: '机械化生产的新时代' },
    { key: 'info', name: '信息文明', bgClass: 'stage-info', unlockTech: 400, description: '数字化信息社会' },
    { key: 'stellar', name: '星际文明', bgClass: 'stage-stellar', unlockTech: 600, description: '征服星辰大海' }
];

// Starting locations with progressive complexity - tribe stage focuses on survival basics
const starts = [
    {
        key: 'plain', name: '肥沃平原', 
        desc: '资源均衡，适合新手',
        resources: { population: 30, food: 25, environment: 60, order: 25 } // 平衡的起始秩序
    },
    {
        key: 'mountain', name: '高原山地', 
        desc: '防御有利，但食物稀少',
        resources: { population: 20, food: 15, environment: 70, order: 30 } // 地理隔离利于维持秩序
    },
    {
        key: 'valley', name: '河谷盆地', 
        desc: '农业潜力大，人口增长快',
        resources: { population: 35, food: 30, environment: 55, order: 20 } // 人口密集导致秩序压力
    },
    {
        key: 'coast', name: '海滨港湾', 
        desc: '资源丰富，发展潜力好',
        resources: { population: 25, food: 20, environment: 65, order: 28 } // 贸易有利于社会组织
    },
    {
        key: 'desert', name: '沙漠绿洲', 
        desc: '环境恶劣，生存困难',
        resources: { population: 15, food: 10, environment: 45, order: 35 } // 恶劣环境促进团结
    }
];

// Event pool is now loaded from events.js
// This allows for better organization and maintainability

// Actions are now loaded from actions.js
// This provides better organization and maintainability

// Permanent upgrades (Civilization Legacy)
let legacy = {
    techBonus: 0,
    foodBonus: 0,
    cultureBonus: 0
};

// Load legacy from localStorage
function loadLegacy() {
    const saved = localStorage.getItem('civCardLegacy');
    if (saved) {
        try {
            legacy = { ...legacy, ...JSON.parse(saved) };
        } catch (e) {
            console.log('Failed to load legacy data');
        }
    }
}

// Save legacy to localStorage
function saveLegacy() {
    localStorage.setItem('civCardLegacy', JSON.stringify(legacy));
}

// --- Game State ---
let gameState = {
    started: false,
    turn: 1,
    stageIdx: 0,
    resources: {},
    eventLog: [],
    events: [], // Store recent events for contextual action selection
    unlockedEvents: [],
    investments: [], // Track active investments: { name, matureTurn, returns }
    legacy: { ...legacy },
    gameOver: false
};

// --- Utility Functions ---
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
// Progressive stage requirements - complexity increases with civilization development
const stageRequirements = {
    // To Agriculture: Only basic survival resources needed
    1: { population: 50, food: 30, tech: 15, environment: 50, order: 35 },
    // To City: Add military as cities need defense
    2: { population: 100, food: 60, tech: 40, military: 20, environment: 45, order: 50 },
    // To Empire: Add culture as empires need social cohesion
    3: { population: 200, food: 100, tech: 80, military: 40, culture: 30, environment: 40, order: 70 },
    // Industrial and beyond: All resources matter, 秩序需求快速增长
    4: { population: 350, food: 150, tech: 150, military: 60, culture: 50, environment: 35, order: 100 },
    5: { population: 500, food: 220, tech: 250, military: 80, culture: 80, environment: 30, order: 130 },
    6: { population: 700, food: 300, tech: 400, military: 100, culture: 120, environment: 25, order: 150 }
};

// Check if stage advancement is possible with progressive requirements
function canAdvanceStage() {
    const nextStageIdx = gameState.stageIdx + 1;
    const req = stageRequirements[nextStageIdx];
    if (!req) return false;
    
    // Check only the resources that are relevant for the next stage
    const res = gameState.resources;
    
    // Basic resources (always required)
    if (res.population < req.population || res.food < req.food || 
        res.tech < req.tech || res.environment < req.environment) {
        return false;
    }
    
    // Military required from city stage (2) onwards
    if (nextStageIdx >= 2 && req.military && res.military < req.military) {
        return false;
    }
    
    // Culture required from empire stage (3) onwards  
    if (nextStageIdx >= 3 && req.culture && res.culture < req.culture) {
        return false;
    }
    
    return true;
}

function getStageByTech(tech) {
    // Original simple tech-based advancement (for reference)
    for (let i = stages.length - 1; i >= 0; i--) {
        if (tech >= stages[i].unlockTech) return i;
    }
    return 0;
}
function applyEffects(effects) {
    // Get available resources for current stage
    const availableResources = getResourcesForStage(gameState.stageIdx);
    const availableResourceKeys = availableResources.map(r => r.key);
    
    for (let key in effects) {
        if (availableResourceKeys.includes(key)) {
            gameState.resources[key] = (gameState.resources[key] || 0) + effects[key];
        }
    }
}
function checkGameOver() {
    // Lose conditions - more forgiving thresholds
    if (gameState.resources.population <= 10) {
        logEvent('人口过少，文明无法延续！');
        return true;
    }
    if (gameState.resources.food <= 0) {
        logEvent('粮食耗尽，文明在饥荒中灭亡！');
        return true;
    }
    if (gameState.resources.environment <= 10) {
        logEvent('环境崩溃，文明失去了生存的基础！');
        return true;
    }
    if (gameState.resources.order <= 5) {
        logEvent('社会秩序彻底崩溃，文明陷入混乱而灭亡！');
        return true;
    }
    
    // Win condition - reach stellar mastery: stellar stage + high achievements
    if (gameState.stageIdx === stages.length - 1 && 
        gameState.resources.tech >= 800 && 
        gameState.resources.culture >= 200 && 
        gameState.resources.population >= 800 &&
        gameState.resources.food >= 400 &&
        gameState.resources.military >= 150 &&
        gameState.resources.environment >= 40 &&
        gameState.resources.order >= 200) {
        logEvent('🎊 恭喜！你的文明已完全掌控星际时代，成为宇宙霸主！');
        return 'win';
    }
    
    return false;
}
function getRandomEvents(count = 3) {
    // Use the new events module with turn-based progression
    let currentTurnInStage = gameState.turn; // Use overall turn count for progression
    let available = getEventsForStageTurn(gameState.stageIdx, currentTurnInStage);
    
    // If not enough stage-turn specific events, get all events for stage
    if (available.length < count && gameState.stageIdx >= 0) {
        let allStageEvents = getEventsForStageTurn(gameState.stageIdx);
        available = available.concat(allStageEvents.filter(e => !available.includes(e)));
    }
    
    // If still not enough, include some from previous stages
    if (available.length < count && gameState.stageIdx > 0) {
        let previousStageEvents = getEventsForStageTurn(gameState.stageIdx - 1);
        available = available.concat(previousStageEvents.filter(e => !available.includes(e)));
    }
    
    // Progressive difficulty: more crises as turns progress
    const crisisChance = Math.min(0.8, 0.3 + (gameState.turn / 50) + (gameState.stageIdx * 0.1));
    
    let result = [];
    let used = new Set();
    
    // Force at least one crisis if chance is high
    if (Math.random() < crisisChance) {
        let crises = available.filter(e => e.type === 'crisis');
        if (crises.length > 0) {
            let idx = Math.floor(Math.random() * crises.length);
            result.push(crises[idx]);
            available = available.filter(e => e !== crises[idx]);
        }
    }
    
    // Fill remaining slots with any available events
    while (result.length < count && available.length > 0) {
        let idx = Math.floor(Math.random() * available.length);
        if (!used.has(idx)) {
            result.push(available[idx]);
            used.add(idx);
            available.splice(idx, 1);
        }
    }
    
    return result;
}
function logEvent(text) {
    gameState.eventLog.unshift(text);
    if (gameState.eventLog.length > 30) gameState.eventLog.pop();
}
function resetGame() {
    gameState = {
        started: false,
        turn: 1,
        stageIdx: 0,
        resources: {},
        eventLog: [],
        unlockedEvents: [],
        investments: [], // Reset active investments
        legacy: clone(legacy),
        gameOver: false
    };
    updateUI(); // Update UI first to show proper "not started" state
    showStartLocation();
}

// Define which resources are relevant for each civilization stage
function getResourcesForStage(stageIdx) {
    const baseResources = [
        { key: 'population', name: '人口', critical: 15, warning: 25 },
        { key: 'food', name: '粮食', critical: 5, warning: 15 },
        { key: 'environment', name: '环境', critical: 20, warning: 50, suffix: '%' },
        { key: 'order', name: '秩序', critical: 10, warning: 25 } // 社会稳定性和组织程度
    ];
    
    if (stageIdx >= 0) { // Tribe stage and above
        baseResources.push({ key: 'tech', name: '科技', critical: 0, warning: 0 });
    }
    if (stageIdx >= 1) { // Agriculture stage and above  
        baseResources.push({ key: 'military', name: '军力', critical: 5, warning: 15 });
    }
    if (stageIdx >= 2) { // City stage and above
        baseResources.push({ key: 'culture', name: '文化', critical: 0, warning: 10 });
    }
    
    return baseResources;
}

// Export getResourcesForStage to window for use in actions.js
window.getResourcesForStage = getResourcesForStage;

// --- UI Functions ---
function updateUI() {
    // If game hasn't started, don't show resources
    if (!gameState.started) {
        document.getElementById('resource-display').innerHTML = '<div class="no-game">请选择起始位置开始游戏</div>';
        document.getElementById('stage-display').innerHTML = '<div class="no-game">等待开始...</div>';
        document.getElementById('turn-display').innerText = '准备阶段';
        
        // Update mobile displays too
        document.getElementById('mobile-resource-display').innerHTML = '<div class="no-game">请选择起始位置开始游戏</div>';
        document.getElementById('mobile-stage-display').innerHTML = '<div class="no-game">等待开始...</div>';
        document.getElementById('mobile-turn-display').innerText = '准备阶段';
        document.getElementById('mobile-resource-text').innerText = '等待开始游戏';
        return;
    }
    
    // Update resource display with better formatting and status indicators
    const res = gameState.resources;
    let resourceHTML = '';
    let mobileResourceSummary = '';
    
    const resourceConfig = getResourcesForStage(gameState.stageIdx);
    
    resourceConfig.forEach(config => {
        let value = res[config.key] || 0; // Default to 0 if resource doesn't exist yet
        let displayValue = value + (config.suffix || '');
        let statusClass = '';
        
        if (value <= config.critical) {
            statusClass = 'critical';
        } else if (value <= config.warning) {
            statusClass = 'warning';
        } else {
            statusClass = 'good';
        }
        
        resourceHTML += `<div class="resource-item ${statusClass}">
            <span class="resource-name">${config.name}:</span> 
            <span class="resource-value">${displayValue}</span>
        </div>`;
    });
    
    // Build mobile summary - select most relevant resources based on stage
    let priorityResources = [];
    if (gameState.stageIdx >= 0) { // All stages
        priorityResources.push('population', 'food', 'environment', 'order');
    }
    if (gameState.stageIdx >= 0) { // Tech becomes important from tribe stage
        priorityResources.push('tech');
    }
    if (gameState.stageIdx >= 1) { // Military important from agriculture stage
        priorityResources.push('military');
    }
    if (gameState.stageIdx >= 2) { // Culture important from city stage
        priorityResources.push('culture');
    }
    
    // For mobile, show top 4 resources based on current stage priorities
    let mobileDisplayPriority = [];
    if (gameState.stageIdx === 0) { // Tribe stage - focus on survival
        mobileDisplayPriority = ['population', 'food', 'environment', 'order'];
    } else if (gameState.stageIdx === 1) { // Agriculture stage - military becomes important
        mobileDisplayPriority = ['population', 'food', 'tech', 'military'];
    } else { // Advanced stages - include culture
        mobileDisplayPriority = ['population', 'tech', 'culture', 'environment'];
    }
    
    resourceConfig.forEach(config => {
        if (mobileDisplayPriority.includes(config.key)) {
            let value = res[config.key] || 0;
            let displayValue = value + (config.suffix || '');
            mobileResourceSummary += `${config.name}:${displayValue} `;
        }
    });
    
    document.getElementById('resource-display').innerHTML = resourceHTML;
    document.getElementById('mobile-resource-display').innerHTML = resourceHTML;
    document.getElementById('mobile-resource-text').innerText = mobileResourceSummary.trim();
    
    // Update stage with progress indicator and requirements
    let currentStage = stages[gameState.stageIdx];
    let nextStage = stages[gameState.stageIdx + 1];
    let stageHTML = `<div class="stage-name">${currentStage.name}</div>`;
    
    if (nextStage) {
        const req = stageRequirements[gameState.stageIdx + 1];
        if (req) {
            // Show detailed requirements for next stage
            let reqItems = [];
            for (let key in req) {
                let current = res[key] || 0;
                let needed = req[key];
                let met = current >= needed;
                let color = met ? '#4caf50' : '#f44336';
                let displayValue = current + (key === 'environment' ? '%' : '');
                let neededValue = needed + (key === 'environment' ? '%' : '');
                reqItems.push(`<span style="color: ${color}">${getResourceDisplayName(key)}: ${displayValue}/${neededValue}</span>`);
            }
            stageHTML += `<div class="stage-requirements">
                <div class="next-stage">升级至 ${nextStage.name} 需要:</div>
                <div class="req-list">${reqItems.join(', ')}</div>
            </div>`;
        } else {
            let progress = Math.min(100, ((res.tech - currentStage.unlockTech) / (nextStage.unlockTech - currentStage.unlockTech)) * 100);
            stageHTML += `<div class="stage-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="next-stage">下一阶段: ${nextStage.name} (需要科技: ${nextStage.unlockTech})</div>
            </div>`;
        }
    } else {
        stageHTML += `<div class="final-stage">最终阶段已达成！</div>`;
    }
    
    document.getElementById('stage-display').innerHTML = stageHTML;
    document.getElementById('mobile-stage-display').innerHTML = stageHTML;
    
    // Update turn
    document.getElementById('turn-display').innerText = `第 ${gameState.turn} 年`;
    document.getElementById('mobile-turn-display').innerText = `第 ${gameState.turn} 年`;
    
    // Update event log (both desktop and mobile)
    const logHTML = gameState.eventLog.map((e, idx) => 
        `<div class="log-entry ${idx === 0 ? 'latest' : ''}">${e}</div>`
    ).join('');
    
    // Build investments display
    let investmentsHTML = '';
    if (gameState.investments && gameState.investments.length > 0) {
        investmentsHTML = `
            <div class="investments-section">
                <h3>🏗️ 活跃投资</h3>
                <div class="investments-list">
                    ${gameState.investments.map(inv => {
                        const remainingTurns = inv.matureTurn - gameState.turn;
                        const returnsText = Object.entries(inv.returns)
                            .map(([resource, value]) => `${getResourceDisplayName(resource)}+${value}`)
                            .join(', ');
                        return `
                            <div class="investment-item">
                                <div class="investment-name">${inv.name}</div>
                                <div class="investment-details">
                                    <div class="investment-time">还需${remainingTurns}年成熟</div>
                                    <div class="investment-returns">回报: ${returnsText}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('event-log').innerHTML = logHTML + investmentsHTML;
    document.getElementById('mobile-event-log').innerHTML = logHTML + investmentsHTML;
    
    // Update mobile log summary
    const latestLog = gameState.eventLog[0] || '暂无事件';
    document.getElementById('mobile-log-text').innerText = latestLog.length > 30 ? 
        latestLog.substring(0, 30) + '...' : latestLog;
    
    // Update background
    document.body.className = stages[gameState.stageIdx].bgClass;
}
function showStartLocation() {
    // Show start location selection with detailed info
    const center = document.getElementById('center-panel');
    center.innerHTML = `
        <h2>选择你的文明起源地</h2>
        <p>每个地理位置都有不同的起始资源和发展潜力</p>
        <div id='start-options'></div>
        <div class="legacy-display">
            <h3>文明遗产加成</h3>
            <div>科技遗产: ${legacy.techBonus >= 0 ? '+' + legacy.techBonus : legacy.techBonus} | 农业遗产: ${legacy.foodBonus >= 0 ? '+' + legacy.foodBonus : legacy.foodBonus} | 文化遗产: ${legacy.cultureBonus >= 0 ? '+' + legacy.cultureBonus : legacy.cultureBonus}</div>
        </div>
    `;
    
    const opts = document.getElementById('start-options');
    starts.forEach((s, idx) => {
        let btn = document.createElement('div');
        btn.className = 'start-location-card';
        
        let resourcesHTML = '';
        for (let key in s.resources) {
            let value = s.resources[key] + (legacy[key + 'Bonus'] || 0);
            let displayValue = value + (key === 'environment' ? '%' : '');
            resourcesHTML += `<div class="start-resource">${getResourceDisplayName(key)}: ${displayValue}</div>`;
        }
        
        btn.innerHTML = `
            <h3>${s.name}</h3>
            <p class="start-desc">${s.desc}</p>
            <div class="start-resources">${resourcesHTML}</div>
        `;
        
        btn.onclick = () => {
            Array.from(opts.children).forEach(c => c.classList.remove('selected'));
            btn.classList.add('selected');
            
            // Add confirm button
            let existingConfirm = document.getElementById('confirm-start');
            if (existingConfirm) existingConfirm.remove();
            
            let confirmBtn = document.createElement('button');
            confirmBtn.id = 'confirm-start';
            confirmBtn.innerText = `开始 ${s.name} 文明`;
            confirmBtn.onclick = () => startGame(idx);
            center.appendChild(confirmBtn);
        };
        
        opts.appendChild(btn);
    });
    
    // Ensure proper display for different screen sizes
    const isMobile = window.innerWidth <= 900;
    
    if (isMobile) {
        // Hide mobile summary bars during start selection
        document.getElementById('mobile-resource-bar').style.display = 'none';
        document.getElementById('mobile-log-bar').style.display = 'none';
        document.getElementById('mobile-resource-content').style.display = 'none';
        document.getElementById('mobile-log-content').style.display = 'none';
        // Hide desktop panels on mobile
        document.getElementById('left-panel').style.display = 'none';
        document.getElementById('right-panel').style.display = 'none';
    } else {
        // Show desktop panels on PC, hide mobile bars
        document.getElementById('left-panel').style.display = 'block';
        document.getElementById('right-panel').style.display = 'block';
        document.getElementById('mobile-resource-bar').style.display = 'none';
        document.getElementById('mobile-log-bar').style.display = 'none';
        document.getElementById('mobile-resource-content').style.display = 'none';
        document.getElementById('mobile-log-content').style.display = 'none';
    }
}
function startGame(startIdx) {
    // Initialize with basic tribal resources
    gameState.resources = clone(starts[startIdx].resources);
    
    // Initialize other resources based on civilization stage
    // Tribe stage (0) - only basic survival resources are active
    if (!gameState.resources.tech) gameState.resources.tech = 0;
    if (!gameState.resources.military) gameState.resources.military = 0;
    if (!gameState.resources.culture) gameState.resources.culture = 0;
    if (!gameState.resources.order) gameState.resources.order = starts[startIdx].resources.order || 25; // 确保秩序属性存在
    
    // Apply legacy bonuses (ensure non-negative values)
    gameState.resources.tech += Math.max(0, legacy.techBonus);
    gameState.resources.food += Math.max(0, legacy.foodBonus);
    gameState.resources.culture += Math.max(0, legacy.cultureBonus);
    
    gameState.started = true;
    gameState.turn = 1;
    gameState.stageIdx = 0; // Always start from tribe stage (0), regardless of tech level
    gameState.eventLog = [];
    gameState.events = []; // Initialize event history for contextual actions
    gameState.investments = []; // Initialize investment tracking
    gameState.unlockedEvents = [];
    gameState.gameOver = false;
    logEvent(`你选择了${starts[startIdx].name}作为起始位置。`);
    
    // Show appropriate interface based on screen size
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
        // Show mobile summary bars when game starts
        document.getElementById('mobile-resource-bar').style.display = 'block';
        document.getElementById('mobile-log-bar').style.display = 'block';
        // Keep desktop panels hidden on mobile
        document.getElementById('left-panel').style.display = 'none';
        document.getElementById('right-panel').style.display = 'none';
    } else {
        // Ensure desktop panels are visible on PC
        document.getElementById('left-panel').style.display = 'block';
        document.getElementById('right-panel').style.display = 'block';
        // Keep mobile bars hidden on desktop
        document.getElementById('mobile-resource-bar').style.display = 'none';
        document.getElementById('mobile-log-bar').style.display = 'none';
    }
    
    // Auto-save on game start
    saveGameState();
    
    nextTurn();
}

// Auto-save and load game state
function saveGameState() {
    localStorage.setItem('civCardGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('civCardGameState');
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            // Only load if game was not completed
            if (!loadedState.gameOver && loadedState.started) {
                gameState = loadedState;
                return true;
            }
        } catch (e) {
            console.log('Failed to load game state');
        }
    }
    return false;
}

// Restore game state without advancing turn
function restoreGameState() {
    // Show appropriate interface based on screen size
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
        // Show mobile summary bars when game starts
        document.getElementById('mobile-resource-bar').style.display = 'block';
        document.getElementById('mobile-log-bar').style.display = 'block';
        // Keep desktop panels hidden on mobile
        document.getElementById('left-panel').style.display = 'none';
        document.getElementById('right-panel').style.display = 'none';
    } else {
        // Ensure desktop panels are visible on PC
        document.getElementById('left-panel').style.display = 'block';
        document.getElementById('right-panel').style.display = 'block';
        // Keep mobile bars hidden on desktop
        document.getElementById('mobile-resource-bar').style.display = 'none';
        document.getElementById('mobile-log-bar').style.display = 'none';
    }
    
    // Show a "continue game" message in center panel
    const centerPanel = document.getElementById('center-panel');
    centerPanel.innerHTML = `
        <div class="continue-game">
            <h2>欢迎回来！</h2>
            <div class="game-status">
                <div class="status-item">文明阶段: ${stages[gameState.stageIdx].name}</div>
                <div class="status-item">当前年份: 第${gameState.turn}年</div>
                <div class="status-item">人口: ${gameState.resources.population || 0}</div>
                <div class="status-item">粮食: ${gameState.resources.food || 0}</div>
            </div>
            <button id="continue-turn-btn" class="restart-button">继续游戏</button>
            <button id="restart-game-btn" class="secondary-button">重新开始</button>
        </div>
    `;
    
    // Setup continue button
    document.getElementById('continue-turn-btn').onclick = () => {
        logEvent(`--- 继续第${gameState.turn}年 ---`);
        
        // Check if game over due to consumption
        let over = checkGameOver();
        if (over === true) {
            showGameOver(false);
            return;
        } else if (over === 'win') {
            showGameOver(true);
            return;
        }
        
        // Draw 3 event cards for player choice
        let events = getRandomEvents(3);
        showEventCards(events);
    };
    
    // Setup restart button
    document.getElementById('restart-game-btn').onclick = resetGame;
}
function nextTurn() {
    // Apply turn-based resource consumption (survival pressure)
    applyTurnConsumption();
    
    // Check stage progression with strict requirements
    let advancedStages = [];
    while (canAdvanceStage()) {
        gameState.stageIdx++;
        advancedStages.push(gameState.stageIdx);
        logEvent(`🎉 文明进入新阶段：${stages[gameState.stageIdx].name}！`);
    }
    
    // Show advancement notification if any stages were advanced
    if (advancedStages.length > 0) {
        showCivilizationAdvancement(advancedStages[advancedStages.length - 1]);
        return; // Stop here to show the notification
    }
    
    // If no advancement, continue with normal flow
    continueAfterAdvancement();
}

// Add turn-based consumption to create survival pressure with escalating difficulty
function applyTurnConsumption() {
    // Get available resources for current stage
    const availableResources = getResourcesForStage(gameState.stageIdx);
    const availableResourceKeys = availableResources.map(r => r.key);
    
    // === 自然增长机制 ===
    const naturalGrowth = {
        // 人口自然增长（基于当前人口和环境）
        population: Math.max(1, Math.floor(gameState.resources.population * 0.03) + Math.floor(gameState.resources.environment / 30)),
        // 环境自然恢复（缓慢但持续）
        environment: Math.max(1, 2 + Math.floor(gameState.resources.environment / 50)),
        // 秩序自然稳定（基于文化和军力的维持）
        order: Math.max(1, Math.floor((gameState.resources.culture || 0) / 20) + Math.floor((gameState.resources.military || 0) / 25))
    };
    
    // === 阶段性资源消耗机制 - 根据文明发展特点 ===
    const baseConsumption = {};
    
    // 基础生存消耗（所有阶段都有）
    baseConsumption.population = Math.max(1, Math.floor(gameState.turn / 30)); // 人口自然死亡，缓慢增长
    
    // 根据文明阶段特定消耗
    switch(gameState.stageIdx) {
        case 0: // 部落文明 - 最缺粮食和科技
            baseConsumption.food = Math.max(8, Math.floor(gameState.resources.population / 8) + Math.floor(gameState.turn / 15)); // 狩猎采集不稳定
            baseConsumption.environment = Math.max(1, Math.floor(gameState.turn / 25)); // 环境压力较小
            break;
            
        case 1: // 农业文明 - 粮食充足，但缺科技发展
            baseConsumption.food = Math.max(4, Math.floor(gameState.resources.population / 15) + Math.floor(gameState.turn / 25)); // 农业提供稳定食物
            baseConsumption.environment = Math.max(2, Math.floor(gameState.turn / 20) + Math.floor(gameState.resources.population / 30)); // 开始改造环境
            baseConsumption.order = Math.max(1, Math.floor(gameState.resources.population / 25)); // 定居带来社会组织需求
            break;
            
        case 2: // 城邦文明 - 缺少文化和军力
            baseConsumption.food = Math.max(6, Math.floor(gameState.resources.population / 12) + Math.floor(gameState.turn / 20));
            baseConsumption.environment = Math.max(2, Math.floor(gameState.turn / 18) + Math.floor(gameState.resources.population / 25));
            baseConsumption.military = Math.max(3, Math.floor(gameState.resources.military / 20)); // 军队维护开始重要
            baseConsumption.order = Math.max(2, Math.floor(gameState.resources.population / 20)); // 城市管理复杂
            break;
            
        case 3: // 帝国时代 - 主要缺军力维持
            baseConsumption.food = Math.max(8, Math.floor(gameState.resources.population / 10) + Math.floor(gameState.turn / 18));
            baseConsumption.environment = Math.max(3, Math.floor(gameState.turn / 15) + Math.floor(gameState.resources.population / 20));
            baseConsumption.military = Math.max(5, Math.floor(gameState.resources.military / 15) + Math.floor(gameState.resources.population / 30)); // 大帝国需要大军队
            baseConsumption.culture = Math.max(2, Math.floor(gameState.stageIdx / 2) + Math.floor(gameState.turn / 25));
            baseConsumption.order = Math.max(3, Math.floor(gameState.resources.population / 18)); // 帝国管理困难
            break;
            
        case 4: // 工业文明 - 缺少能源(环境)和科技发展
            baseConsumption.food = Math.max(6, Math.floor(gameState.resources.population / 12) + Math.floor(gameState.turn / 20)); // 工业化提高效率
            baseConsumption.environment = Math.max(8, Math.floor(gameState.turn / 10) + Math.floor(gameState.resources.tech / 50)); // 工业污染严重
            baseConsumption.military = Math.max(4, Math.floor(gameState.resources.military / 18));
            baseConsumption.culture = Math.max(3, Math.floor(gameState.turn / 20));
            baseConsumption.order = Math.max(4, Math.floor(gameState.resources.population / 15)); // 工业社会秩序挑战
            break;
            
        case 5: // 信息文明 - 主要缺科技创新
            baseConsumption.food = Math.max(5, Math.floor(gameState.resources.population / 15) + Math.floor(gameState.turn / 25)); // 效率更高
            baseConsumption.environment = Math.max(6, Math.floor(gameState.turn / 15) + Math.floor(gameState.resources.tech / 80)); // 电子污染
            baseConsumption.military = Math.max(3, Math.floor(gameState.resources.military / 20));
            baseConsumption.culture = Math.max(4, Math.floor(gameState.turn / 18));
            baseConsumption.order = Math.max(5, Math.floor(gameState.resources.population / 12)); // 信息社会管理复杂
            break;
            
        case 6: // 星际文明 - 缺少能源、科技、文化、秩序
            baseConsumption.food = Math.max(4, Math.floor(gameState.resources.population / 18) + Math.floor(gameState.turn / 30)); // 星际技术效率极高
            baseConsumption.environment = Math.max(10, Math.floor(gameState.turn / 8) + Math.floor(gameState.resources.tech / 60)); // 星际开发环境代价巨大
            baseConsumption.military = Math.max(6, Math.floor(gameState.resources.military / 15)); // 星际防务
            baseConsumption.culture = Math.max(8, Math.floor(gameState.turn / 12)); // 星际文化认同困难
            baseConsumption.order = Math.max(10, Math.floor(gameState.resources.population / 10)); // 跨星际管理极其复杂
            break;
    }
    
    // === 应用自然增长 ===
    let growthReport = [];
    for (let resource in naturalGrowth) {
        if (availableResourceKeys.includes(resource)) {
            gameState.resources[resource] += naturalGrowth[resource];
            growthReport.push(`${getResourceDisplayName(resource)}+${naturalGrowth[resource]}`);
        }
    }
    
    // === 应用年度消耗 ===
    let consumptionReport = [];
    for (let resource in baseConsumption) {
        if (availableResourceKeys.includes(resource)) {
            gameState.resources[resource] -= baseConsumption[resource];
            // 防止负值
            gameState.resources[resource] = Math.max(0, gameState.resources[resource]);
            consumptionReport.push(`${getResourceDisplayName(resource)}-${baseConsumption[resource]}`);
        }
    }
    
    // === 输出报告 ===
    if (growthReport.length > 0) {
        logEvent(`自然增长: ${growthReport.join(', ')}`);
    }
    if (consumptionReport.length > 0) {
        logEvent(`年度消耗: ${consumptionReport.join(', ')}`);
    }
}
function showEventCards(events) {
    let selectedIdx = null;
    
    // Update center panel header with stage and turn info
    const centerPanel = document.getElementById('center-panel');
    centerPanel.innerHTML = `
        <h2>${stages[gameState.stageIdx].name} - 第${gameState.turn}年</h2>
        <p>请选择一个事件来影响你的文明发展</p>
        <div id="event-cards"></div>
        <button id="choose-event-btn" disabled>选择事件</button>
        <div id="action-panel" style="display:none;">
            <h2>请选择一个行动</h2>
            <div id="action-options"></div>
            <button id="do-action-btn" disabled>进行行动</button>
        </div>
        <button id="next-turn-btn" style="display:none;">下一年</button>
    `;
    
    const cardsDiv = document.getElementById('event-cards');
    
    events.forEach((ev, idx) => {
        let card = document.createElement('div');
        card.className = 'event-card';
        
        // Get available resources for current stage
        const availableResources = getResourcesForStage(gameState.stageIdx);
        const availableResourceKeys = availableResources.map(r => r.key);
        
        // Build effects display (only show available resources)
        let effectsText = '';
        if (ev.effects) {
            let effectsList = [];
            for (let key in ev.effects) {
                if (availableResourceKeys.includes(key)) {
                    let value = ev.effects[key];
                    let sign = value > 0 ? '+' : '';
                    let resourceName = getResourceDisplayName(key);
                    effectsList.push(`${resourceName}: ${sign}${value}`);
                }
            }
            if (effectsList.length > 0) {
                effectsText = `<div class="effects">${effectsList.join(', ')}</div>`;
            }
        }
        
        let typeColor = ev.type === 'opportunity' ? '#4caf50' : 
                       ev.type === 'crisis' ? '#f44336' : '#ff9800';
        
        card.innerHTML = `
            <div style="color: ${typeColor}; font-weight: bold; margin-bottom: 8px;">${getEventTypeName(ev.type)}</div>
            <div style="font-weight: bold; margin-bottom: 6px;">${ev.name}</div>
            <div style="font-size: 0.9em; margin-bottom: 8px;">${ev.desc}</div>
            ${effectsText}
        `;
        
        card.onclick = () => {
            Array.from(cardsDiv.children).forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedIdx = idx;
            document.getElementById('choose-event-btn').disabled = false;
        };
        cardsDiv.appendChild(card);
    });
    
    document.getElementById('choose-event-btn').disabled = true;
    document.getElementById('choose-event-btn').onclick = () => {
        if (selectedIdx !== null) {
            chooseEvent(events[selectedIdx]);
        }
    };
}

function getResourceDisplayName(key) {
    const names = {
        population: '人口',
        food: '粮食', 
        tech: '科技',
        military: '军力',
        culture: '文化',
        environment: '环境',
        order: '秩序'
    };
    return names[key] || key;
}

function getEventTypeName(type) {
    const names = {
        opportunity: '机遇',
        crisis: '危机',
        decision: '抉择'
    };
    return names[type] || type;
}
function chooseEvent(event) {
    // Apply event effects
    applyEffects(event.effects);
    logEvent(`事件：${event.name} - ${event.desc}`);
    
    // Add event to game state history for contextual action selection
    if (!gameState.events) {
        gameState.events = [];
    }
    gameState.events.push({
        ...event,
        turn: gameState.turn,
        stage: gameState.stageIdx
    });
    
    // Keep only recent events to avoid memory issues
    if (gameState.events.length > 10) {
        gameState.events = gameState.events.slice(-10);
    }
    
    updateUI();
    
    // Disable event selection to prevent re-selection
    document.getElementById('choose-event-btn').disabled = true;
    document.getElementById('choose-event-btn').style.display = 'none';
    
    // Disable all event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.6';
    });
    
    // Check game over
    let over = checkGameOver();
    if (over === true) {
        showGameOver(false);
        return;
    } else if (over === 'win') {
        showGameOver(true);
        return;
    }
    
    // Show action options
    showActionOptions();
}
function showActionOptions() {
    const panel = document.getElementById('action-panel');
    panel.style.display = 'block';
    const opts = document.getElementById('action-options');
    opts.innerHTML = '';
    let selectedIdx = null;
    
    // Use the new contextual action system if available, otherwise fallback to random
    let availableActions;
    if (typeof getContextualActions === 'function') {
        // Get the last event from current turn for context
        const lastEvent = gameState.events && gameState.events.length > 0 
            ? gameState.events[gameState.events.length - 1] 
            : null;
        availableActions = getContextualActions(lastEvent, gameState, 4);
    } else {
        availableActions = getRandomActionsForStage(gameState.stageIdx, 4);
    }
    
    availableActions.forEach((a, idx) => {
        let btn = document.createElement('button');
        btn.className = 'action-btn';
        
        // Get available resources for current stage
        const availableResources = getResourcesForStage(gameState.stageIdx);
        const availableResourceKeys = availableResources.map(r => r.key);
        
        // Build cost display
        let costsText = '';
        if (a.costs) {
            let costsList = [];
            for (let key in a.costs) {
                if (availableResourceKeys.includes(key)) {
                    let value = a.costs[key];
                    let resourceName = getResourceDisplayName(key);
                    costsList.push(`${resourceName}: -${value}`);
                }
            }
            if (costsList.length > 0) {
                costsText = `<div class="action-costs">消耗: ${costsList.join(', ')}</div>`;
            }
        }
        
        // Build effects display
        let effectsText = '';
        if (a.effects) {
            let effectsList = [];
            for (let key in a.effects) {
                if (availableResourceKeys.includes(key)) {
                    let value = a.effects[key];
                    let sign = value > 0 ? '+' : '';
                    let resourceName = getResourceDisplayName(key);
                    effectsList.push(`${resourceName}: ${sign}${value}`);
                }
            }
            if (effectsList.length > 0) {
                effectsText = `<div class="action-effects">获得: ${effectsList.join(', ')}</div>`;
            }
        }
        
        // Build investment display
        let investmentText = '';
        if (a.investment) {
            let returnsText = [];
            for (let key in a.investment.returns) {
                if (availableResourceKeys.includes(key)) {
                    let value = a.investment.returns[key];
                    let sign = value > 0 ? '+' : '';
                    let resourceName = getResourceDisplayName(key);
                    returnsText.push(`${resourceName}: ${sign}${value}`);
                }
            }
            if (returnsText.length > 0) {
                investmentText = `<div class="action-investment">📈 ${a.investment.turns}年后回报: ${returnsText.join(', ')}</div>`;
            }
        }
        
        // Check if action is affordable
        let affordable = canAffordAction(a);
        if (!affordable) {
            btn.classList.add('unaffordable');
        }
        
        btn.innerHTML = `
            <strong>${a.name}</strong>
            <div class="action-desc">${a.desc}</div>
            ${costsText}
            ${effectsText}
            ${investmentText}
        `;
        
        btn.onclick = () => {
            if (!affordable) return; // Don't allow selection if unaffordable
            Array.from(opts.children).forEach(c => c.classList.remove('selected'));
            btn.classList.add('selected');
            selectedIdx = idx;
            document.getElementById('do-action-btn').disabled = false;
        };
        opts.appendChild(btn);
    });
    
    document.getElementById('do-action-btn').disabled = true;
    document.getElementById('do-action-btn').onclick = () => {
        if (selectedIdx !== null) {
            doAction(availableActions[selectedIdx]);
        }
    };
    document.getElementById('do-action-btn').style.display = 'inline-block';
    document.getElementById('next-turn-btn').style.display = 'none';
}
function canAffordAction(action) {
    if (!action.costs) return true;
    
    // Get available resources for current stage
    const availableResources = getResourcesForStage(gameState.stageIdx);
    const availableResourceKeys = availableResources.map(r => r.key);
    
    for (let resource in action.costs) {
        // Check if this resource is even available at current stage
        if (!availableResourceKeys.includes(resource)) {
            return false; // Cannot afford action that requires unavailable resource
        }
        
        // Check if we have enough of this resource
        if ((gameState.resources[resource] || 0) < action.costs[resource]) {
            return false;
        }
    }
    return true;
}

function doAction(action) {
    // Check if player can afford the action
    if (!canAffordAction(action)) {
        logEvent(`资源不足，无法执行${action.name}！`);
        updateUI();
        return;
    }
    
    // Get available resources for current stage
    const availableResources = getResourcesForStage(gameState.stageIdx);
    const availableResourceKeys = availableResources.map(r => r.key);
    
    // Apply costs first
    if (action.costs) {
        for (let resource in action.costs) {
            if (availableResourceKeys.includes(resource)) {
                gameState.resources[resource] = (gameState.resources[resource] || 0) - action.costs[resource];
            }
        }
    }
    
    // Then apply effects (only for available resources)
    if (action.effects) {
        for (let resource in action.effects) {
            if (availableResourceKeys.includes(resource)) {
                gameState.resources[resource] = (gameState.resources[resource] || 0) + action.effects[resource];
            }
        }
    }
    
    // Handle investment actions
    if (action.investment) {
        const matureTurn = gameState.turn + action.investment.turns;
        gameState.investments.push({
            name: action.name,
            matureTurn: matureTurn,
            returns: action.investment.returns
        });
        logEvent(`💰 投资项目"${action.name}"将在第${matureTurn}年成熟`);
    }
    
    logEvent(`你选择了行动：${action.name} - ${action.desc}`);
    updateUI();
    
    // Auto-save after action
    saveGameState();
    
    // Check game over
    let over = checkGameOver();
    if (over === true) {
        showGameOver(false);
        return;
    } else if (over === 'win') {
        showGameOver(true);
        return;
    }
    
    // Show turn summary instead of keeping event cards visible
    showTurnSummary(action);
}

function showTurnSummary(action) {
    // Create a summary of the turn showing what happened
    let summaryHTML = `
        <div class="turn-summary">
            <h2>第${gameState.turn}年 - 行动完成</h2>
            <div class="action-taken">
                <h3>已执行行动</h3>
                <div class="action-summary">
                    <strong>${action.name}</strong>
                    <p>${action.desc}</p>
                </div>
            </div>
    `;
    
    // Show resource changes if any
    let hasResourceChanges = false;
    let changesHTML = '<div class="resource-changes"><h3>资源变化</h3><ul>';
    
    if (action.costs) {
        for (let resource in action.costs) {
            changesHTML += `<li class="resource-cost">-${action.costs[resource]} ${getResourceDisplayName(resource)}</li>`;
            hasResourceChanges = true;
        }
    }
    
    if (action.effects) {
        for (let resource in action.effects) {
            const value = action.effects[resource];
            const sign = value >= 0 ? '+' : '';
            changesHTML += `<li class="resource-gain">${sign}${value} ${getResourceDisplayName(resource)}</li>`;
            hasResourceChanges = true;
        }
    }
    
    changesHTML += '</ul></div>';
    
    if (hasResourceChanges) {
        summaryHTML += changesHTML;
    }
    
    summaryHTML += `
            <div class="turn-summary-actions">
                <button id="next-turn-btn" class="next-turn-button">进入第${gameState.turn + 1}年</button>
            </div>
        </div>
    `;
    
    // Replace center panel content with summary
    document.getElementById('center-panel').innerHTML = summaryHTML;
    
    // Setup next turn button
    document.getElementById('next-turn-btn').onclick = () => {
        gameState.turn++;
        nextTurn();
    };
}

function showCivilizationAdvancement(stageIdx) {
    const stage = stages[stageIdx];
    
    // Create the advancement notification overlay
    const overlay = document.createElement('div');
    overlay.className = 'civilization-advancement';
    overlay.id = 'advancement-overlay';
    
    // Special message for stellar stage
    let specialMessage = '';
    if (stageIdx === stages.length - 1) { // Stellar stage
        specialMessage = `
            <div class="stellar-challenge">
                <h3>🌟 终极挑战</h3>
                <p>成为真正的宇宙霸主需要达成以下目标：</p>
                <div class="victory-requirements">
                    <div>🔬 科技：800+</div>
                    <div>🎭 文化：200+</div>
                    <div>👥 人口：800+</div>
                    <div>🌾 粮食：400+</div>
                    <div>⚔️ 军力：150+</div>
                    <div>🌍 环境：40+</div>
                    <div>⚖️ 秩序：200+</div>
                </div>
                <p>星际时代的挑战才刚刚开始！</p>
            </div>
        `;
    }
    
    overlay.innerHTML = `
        <div class="advancement-content">
            <div class="advancement-title">🎉 文明进化！</div>
            <div class="advancement-stage">${stage.name}</div>
            <div class="advancement-description">${stage.description}</div>
            ${specialMessage}
            <button class="advancement-button" onclick="closeCivilizationAdvancement()">
                继续发展文明
            </button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Update background immediately to new stage
    document.body.className = stage.bgClass;
}

function closeCivilizationAdvancement() {
    const overlay = document.getElementById('advancement-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Continue with the normal turn flow
    continueAfterAdvancement();
}

// Process investments that have matured this turn
function processMatureInvestments() {
    if (!gameState.investments || gameState.investments.length === 0) {
        return;
    }
    
    // Get available resources for current stage
    const availableResources = getResourcesForStage(gameState.stageIdx);
    const availableResourceKeys = availableResources.map(r => r.key);
    
    // Find investments that mature this turn
    const matureInvestments = gameState.investments.filter(inv => inv.matureTurn === gameState.turn);
    
    // Process each mature investment
    matureInvestments.forEach(investment => {
        let returnsText = [];
        
        // Apply returns for available resources only
        for (let resource in investment.returns) {
            if (availableResourceKeys.includes(resource)) {
                const returnValue = investment.returns[resource];
                gameState.resources[resource] = (gameState.resources[resource] || 0) + returnValue;
                
                const sign = returnValue >= 0 ? '+' : '';
                const resourceName = getResourceDisplayName(resource);
                returnsText.push(`${resourceName}${sign}${returnValue}`);
            }
        }
        
        if (returnsText.length > 0) {
            logEvent(`🎉 投资回报："${investment.name}"成熟，获得：${returnsText.join(', ')}`);
        }
    });
    
    // Remove mature investments from active list
    gameState.investments = gameState.investments.filter(inv => inv.matureTurn !== gameState.turn);
}

function continueAfterAdvancement() {
    // Auto-save at turn start
    saveGameState();
    
    // Check for mature investments and apply returns
    processMatureInvestments();
    
    updateUI();
    
    // Check if game over due to consumption
    let over = checkGameOver();
    if (over === true) {
        showGameOver(false);
        return;
    } else if (over === 'win') {
        showGameOver(true);
        return;
    }
    
    // Show turn start message
    logEvent(`--- 第${gameState.turn}年开始 ---`);
    
    // Draw 3 event cards for player choice using the new event system
    let events = getRandomEvents(3);
    showEventCards(events);
}

function showGameOver(win) {
    gameState.gameOver = true;
    let msg = win ? '恭喜！你的文明已成功进入星际时代！' : '文明终结。但你的遗产将传承下去...';
    logEvent(msg);
    
    // Calculate score
    let score = gameState.turn * 10 + gameState.resources.tech + gameState.resources.culture + gameState.resources.population;
    if (win) score *= 2;
    
    // Update legacy upgrades (ensure they remain non-negative)
    if (!win) {
        legacy.techBonus = Math.max(0, legacy.techBonus + Math.floor(gameState.resources.tech / 10));
        legacy.foodBonus = Math.max(0, legacy.foodBonus + Math.floor(gameState.resources.food / 20));
        legacy.cultureBonus = Math.max(0, legacy.cultureBonus + Math.floor(gameState.resources.culture / 15));
        saveLegacy(); // Save updated legacy
    }
    
    // Clear saved game state
    localStorage.removeItem('civCardGameState');
    
    // Get all resources for current stage to display complete stats
    const resourceConfig = getResourcesForStage(gameState.stageIdx);
    let finalStatsHTML = `
                <div class="stat-item">存活年数: ${gameState.turn}</div>
                <div class="stat-item">文明阶段: ${stages[gameState.stageIdx].name}</div>`;
    
    // Add all relevant resources for the current stage
    resourceConfig.forEach(config => {
        let value = gameState.resources[config.key] || 0;
        let displayValue = value + (config.suffix || '');
        finalStatsHTML += `<div class="stat-item">${config.name}: ${displayValue}</div>`;
    });
    
    finalStatsHTML += `<div class="stat-item">总分: ${score}</div>`;
    
    // Build game over screen
    let gameOverHTML = `
        <div class="game-over-screen">
            <h2>${win ? '🎉 胜利！' : '💀 游戏结束'}</h2>
            <div class="final-stats">
                <h3>最终统计</h3>
                ${finalStatsHTML}
            </div>
            <div class="legacy-info">
                <h3>文明遗产</h3>
                <div class="legacy-item">科技遗产: ${legacy.techBonus >= 0 ? '+' + legacy.techBonus : legacy.techBonus}</div>
                <div class="legacy-item">农业遗产: ${legacy.foodBonus >= 0 ? '+' + legacy.foodBonus : legacy.foodBonus}</div>
                <div class="legacy-item">文化遗产: ${legacy.cultureBonus >= 0 ? '+' + legacy.cultureBonus : legacy.cultureBonus}</div>
                <p>这些遗产将在下次游戏中为你提供起始加成！</p>
            </div>
            <button id="restart-btn" class="restart-button">重新开始新的文明</button>
        </div>
    `;
    
    document.getElementById('center-panel').innerHTML = gameOverHTML;
    document.getElementById('restart-btn').onclick = resetGame;
    
    updateUI();
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Load legacy data
    loadLegacy();
    
    // Try to load saved game
    if (loadGameState()) {
        // Continue saved game - just restore the UI, don't auto-advance turn
        updateUI();
        if (gameState.gameOver) {
            showStartLocation();
        } else {
            // Check if we're in the middle of a turn (waiting for event/action selection)
            // If so, restore the appropriate state
            restoreGameState();
        }
    } else {
        // Start new game selection
        updateUI(); // Call updateUI first to show "please select starting location"
        showStartLocation();
    }
    
    // Setup button handlers for both desktop and mobile
    document.getElementById('reset-btn').onclick = resetGame;
    document.getElementById('help-btn').onclick = showHelp;
    document.getElementById('mobile-reset-btn').onclick = resetGame;
    document.getElementById('mobile-help-btn').onclick = showHelp;
    
    // Setup mobile panels after DOM is ready
    setupMobilePanels();
});

// Setup mobile collapsible panels
function setupMobilePanels() {
    // Resource panel toggle
    const resourceBar = document.getElementById('mobile-resource-bar');
    const logBar = document.getElementById('mobile-log-bar');
    
    if (resourceBar) {
        // 添加点击和触摸事件处理
        const toggleResourcePanel = () => {
            console.log('Toggling resource panel'); // Debug log
            const content = document.getElementById('mobile-resource-content');
            const toggle = document.getElementById('resource-toggle');
            
            if (content && toggle) {
                console.log('Elements found, current expanded state:', content.classList.contains('expanded')); // Debug log
                if (content.classList.contains('expanded')) {
                    content.classList.remove('expanded');
                    toggle.classList.remove('expanded');
                } else {
                    content.classList.add('expanded');
                    toggle.classList.add('expanded');
                }
            } else {
                console.log('Elements not found:', { content, toggle }); // Debug log
            }
        };
        
        resourceBar.onclick = toggleResourcePanel;
        resourceBar.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggleResourcePanel();
        });
    }
    
    // Log panel toggle
    if (logBar) {
        const toggleLogPanel = () => {
            console.log('Toggling log panel'); // Debug log
            const content = document.getElementById('mobile-log-content');
            const toggle = document.getElementById('log-toggle');
            
            if (content && toggle) {
                console.log('Log elements found, current expanded state:', content.classList.contains('expanded')); // Debug log
                if (content.classList.contains('expanded')) {
                    content.classList.remove('expanded');
                    toggle.classList.remove('expanded');
                } else {
                    content.classList.add('expanded');
                    toggle.classList.add('expanded');
                }
            } else {
                console.log('Log elements not found:', { content, toggle }); // Debug log
            }
        };
        
        logBar.onclick = toggleLogPanel;
        logBar.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggleLogPanel();
        });
    }
}

// Help/Tutorial function
function showHelp() {
    const helpHTML = `
        <div class="help-screen">
            <h2>📚 时代之路 - 快速指南</h2>
            
            <div class="help-section">
                <h3>🎯 游戏目标</h3>
                <p>发展文明从部落到星际时代，生存尽可能多的年数</p>
                <div class="help-expandable" onclick="toggleHelpSection('goal-details')">
                    <span class="expand-text">详细说明 ▼</span>
                </div>
                <div id="goal-details" class="help-details" style="display: none;">
                    <p><strong>胜利条件：</strong>进入星际文明阶段并达到宇宙霸主成就</p>
                    <p><strong>宇宙霸主要求：</strong>科技800+ 文化200+ 人口800+ 粮食400+ 军力150+ 环境40+ 秩序200+</p>
                    <p><strong>失败条件：</strong>人口≤10 或 粮食≤0 或 环境≤10 或 秩序≤5</p>
                </div>
            </div>
            
            <div class="help-section">
                <h3>🔄 游戏流程</h3>
                <p>每年：选择事件 → 选择行动 → 自动消耗 → 检查升级</p>
                <div class="help-expandable" onclick="toggleHelpSection('flow-details')">
                    <span class="expand-text">详细流程 ▼</span>
                </div>
                <div id="flow-details" class="help-details" style="display: none;">
                    <ol>
                        <li><strong>事件阶段：</strong>从3张事件卡中选择1张执行</li>
                        <li><strong>行动阶段：</strong>选择1个行动应对或发展</li>
                        <li><strong>消耗阶段：</strong>自动扣除年度维持消耗</li>
                        <li><strong>进化检查：</strong>满足条件时自动升级文明阶段</li>
                    </ol>
                </div>
            </div>
            
            <div class="help-section">
                <h3>📊 资源系统</h3>
                <p>管理6种资源：人口、粮食、环境、科技、军力、文化</p>
                <div class="help-expandable" onclick="toggleHelpSection('resource-details')">
                    <span class="expand-text">资源详情 ▼</span>
                </div>
                <div id="resource-details" class="help-details" style="display: none;">
                    <div class="resource-guide">
                        <div><strong>人口：</strong>文明基础，≤10时游戏结束</div>
                        <div><strong>粮食：</strong>维持生存，≤0时游戏结束</div>
                        <div><strong>环境：</strong>生态稳定度(%)，≤10时游戏结束</div>
                        <div><strong>科技：</strong>解锁新文明阶段的关键</div>
                        <div><strong>军力：</strong>城邦阶段起解锁，用于防御扩张</div>
                        <div><strong>文化：</strong>城邦阶段起解锁，影响社会稳定</div>
                    </div>
                </div>
            </div>
            
            <div class="help-section">
                <h3>🏛️ 文明阶段</h3>
                <p>7个阶段：部落→农业→城邦→帝国→工业→信息→星际</p>
                <div class="help-expandable" onclick="toggleHelpSection('stage-details')">
                    <span class="expand-text">阶段要求 ▼</span>
                </div>
                <div id="stage-details" class="help-details" style="display: none;">
                    <div class="stage-guide">
                        <div><strong>部落文明(0科技)：</strong>最缺粮食和科技，狩猎采集不稳定</div>
                        <div><strong>农业文明(30科技)：</strong>粮食充足，主要缺科技发展</div>
                        <div><strong>城邦文明(80科技)：</strong>缺少文化认同和军事力量</div>
                        <div><strong>帝国时代(150科技)：</strong>主要缺军力维持庞大疆域</div>
                        <div><strong>工业文明(250科技)：</strong>缺少能源(环境)和技术创新</div>
                        <div><strong>信息文明(400科技)：</strong>主要缺科技创新和社会管理</div>
                        <div><strong>星际文明(600科技)：</strong>缺少能源、科技、文化、秩序</div>
                    </div>
                </div>
            </div>
            
            <div class="help-section">
                <h3>⚡ 智能行动</h3>
                <p>行动会根据事件和资源情况智能推荐最合适的选择</p>
                <div class="help-expandable" onclick="toggleHelpSection('action-details')">
                    <span class="expand-text">行动类型 ▼</span>
                </div>
                <div id="action-details" class="help-details" style="display: none;">
                    <div class="action-guide">
                        <div><strong>强化：</strong>放大机遇事件的正面效果</div>
                        <div><strong>抵消：</strong>减轻危机事件的负面影响</div>
                        <div><strong>转化：</strong>将富余资源转换为稀缺资源</div>
                        <div><strong>投资：</strong>长期项目，多年后获得回报</div>
                        <div><strong>应急：</strong>资源危机时的紧急措施</div>
                    </div>
                </div>
            </div>
            
            <div class="help-section">
                <h3>💡 生存技巧</h3>
                <p>平衡发展，应对危机，合理规划，长期投资</p>
                <div class="help-expandable" onclick="toggleHelpSection('strategy-details')">
                    <span class="expand-text">策略详情 ▼</span>
                </div>
                <div id="strategy-details" class="help-details" style="display: none;">
                    <div class="strategy-guide">
                        <div>• <strong>部落阶段：</strong>重点解决粮食短缺，发展基础科技</div>
                        <div>• <strong>农业阶段：</strong>充分利用粮食优势，大力发展科技</div>
                        <div>• <strong>城邦阶段：</strong>建设文化认同，发展军事力量</div>
                        <div>• <strong>帝国阶段：</strong>维持强大军力，控制广阔疆域</div>
                        <div>• <strong>工业阶段：</strong>平衡环境消耗，推进技术革新</div>
                        <div>• <strong>信息阶段：</strong>持续科技创新，应对复杂社会管理</div>
                        <div>• <strong>星际阶段：</strong>多重挑战并存，需要全方位发展</div>
                    </div>
                </div>
            </div>
            
            <div class="help-section">
                <h3>🏆 文明遗产</h3>
                <p>游戏结束后获得永久加成，下次游戏起始资源更多</p>
                <div class="help-expandable" onclick="toggleHelpSection('legacy-details')">
                    <span class="expand-text">遗产计算 ▼</span>
                </div>
                <div id="legacy-details" class="help-details" style="display: none;">
                    <div class="legacy-guide">
                        <div><strong>科技遗产：</strong>科技点数÷10，下次科技起始+X</div>
                        <div><strong>农业遗产：</strong>粮食点数÷20，下次粮食起始+X</div>
                        <div><strong>文化遗产：</strong>文化点数÷15，下次文化起始+X</div>
                    </div>
                </div>
            </div>
            
            <button id="close-help" class="restart-button">返回游戏</button>
        </div>
    `;
    
    document.getElementById('center-panel').innerHTML = helpHTML;
    document.getElementById('close-help').onclick = () => {
        if (gameState.started && !gameState.gameOver) {
            // 恢复到帮助前的游戏状态，不推进年数
            continueAfterAdvancement();
        } else {
            showStartLocation();
        }
    };
}

// Toggle help section details
function toggleHelpSection(sectionId) {
    const section = document.getElementById(sectionId);
    const expandBtn = section.previousElementSibling.querySelector('.expand-text');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        expandBtn.textContent = expandBtn.textContent.replace('▼', '▲');
    } else {
        section.style.display = 'none';
        expandBtn.textContent = expandBtn.textContent.replace('▲', '▼');
    }
}
