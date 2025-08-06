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
        resources: { population: 30, food: 25, environment: 60 } // Tribe stage: only basic survival resources
    },
    {
        key: 'mountain', name: '高原山地', 
        desc: '防御有利，但食物稀少',
        resources: { population: 20, food: 15, environment: 70 }
    },
    {
        key: 'valley', name: '河谷盆地', 
        desc: '农业潜力大，人口增长快',
        resources: { population: 35, food: 30, environment: 55 }
    },
    {
        key: 'coast', name: '海滨港湾', 
        desc: '资源丰富，发展潜力好',
        resources: { population: 25, food: 20, environment: 65 }
    },
    {
        key: 'desert', name: '沙漠绿洲', 
        desc: '环境恶劣，生存困难',
        resources: { population: 15, food: 10, environment: 45 }
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
    unlockedEvents: [],
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
    1: { population: 50, food: 30, tech: 15, environment: 50 },
    // To City: Add military as cities need defense
    2: { population: 100, food: 60, tech: 40, military: 20, environment: 45 },
    // To Empire: Add culture as empires need social cohesion
    3: { population: 200, food: 100, tech: 80, military: 40, culture: 30, environment: 40 },
    // Industrial and beyond: All resources matter
    4: { population: 350, food: 150, tech: 150, military: 60, culture: 50, environment: 35 },
    5: { population: 500, food: 220, tech: 250, military: 80, culture: 80, environment: 30 },
    6: { population: 700, food: 300, tech: 400, military: 100, culture: 120, environment: 25 }
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
    
    // Win condition - reach the final stage with decent resources
    if (gameState.stageIdx === stages.length - 1 && gameState.resources.tech >= 600) {
        logEvent('恭喜！你的文明成功进入了星际时代！');
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
        { key: 'environment', name: '环境', critical: 20, warning: 50, suffix: '%' }
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
        
        // Build mobile summary (shorter format)
        if (config.key === 'population' || config.key === 'food' || config.key === 'tech') {
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
    
    document.getElementById('event-log').innerHTML = logHTML;
    document.getElementById('mobile-event-log').innerHTML = logHTML;
    
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
            <div>科技遗产: +${legacy.techBonus} | 农业遗产: +${legacy.foodBonus} | 文化遗产: +${legacy.cultureBonus}</div>
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
    
    // Apply legacy bonuses
    gameState.resources.tech += legacy.techBonus;
    gameState.resources.food += legacy.foodBonus;
    gameState.resources.culture += legacy.cultureBonus;
    
    gameState.started = true;
    gameState.turn = 1;
    gameState.stageIdx = getStageByTech(gameState.resources.tech);
    gameState.eventLog = [];
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
    
    const baseConsumption = {};
    
    // Only consume resources that are available at current stage
    // Food consumption - always available
    if (availableResourceKeys.includes('food')) {
        baseConsumption.food = Math.max(8, Math.floor(gameState.resources.population / 12) + gameState.stageIdx * 3 + Math.floor(gameState.turn / 10));
    }
    
    // Environment consumption - always available  
    if (availableResourceKeys.includes('environment')) {
        baseConsumption.environment = Math.max(2, gameState.stageIdx + 1 + Math.floor(gameState.turn / 15));
    }
    
    // Culture consumption - only from city stage (2) onwards
    if (availableResourceKeys.includes('culture') && gameState.stageIdx >= 2) {
        baseConsumption.culture = Math.max(1, Math.floor(gameState.stageIdx / 2) + Math.floor(gameState.turn / 20));
    }
    
    // Military consumption - only from city stage (2) onwards  
    if (availableResourceKeys.includes('military') && gameState.stageIdx >= 2) {
        baseConsumption.military = Math.max(2, Math.floor(gameState.stageIdx / 2));
    }
    
    // Apply consumption only for resources we actually have
    for (let resource in baseConsumption) {
        if (gameState.resources[resource] !== undefined) {
            gameState.resources[resource] -= baseConsumption[resource];
            // Prevent negative values except for debugging
            gameState.resources[resource] = Math.max(0, gameState.resources[resource]);
        }
    }
    
    // Create consumption report only for consumed resources
    let consumptionReport = [];
    for (let resource in baseConsumption) {
        consumptionReport.push(`${getResourceDisplayName(resource)}-${baseConsumption[resource]}`);
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
        environment: '环境'
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
    
    // Use the new actions module to get stage-specific actions
    let availableActions = getRandomActionsForStage(gameState.stageIdx, 4);
    
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
            changesHTML += `<li class="resource-gain">+${action.effects[resource]} ${getResourceDisplayName(resource)}</li>`;
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
    
    overlay.innerHTML = `
        <div class="advancement-content">
            <div class="advancement-title">🎉 文明进化！</div>
            <div class="advancement-stage">${stage.name}</div>
            <div class="advancement-description">${stage.description}</div>
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

function continueAfterAdvancement() {
    // Auto-save at turn start
    saveGameState();
    
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
    
    // Update legacy upgrades
    if (!win) {
        legacy.techBonus += Math.floor(gameState.resources.tech / 10);
        legacy.foodBonus += Math.floor(gameState.resources.food / 20);
        legacy.cultureBonus += Math.floor(gameState.resources.culture / 15);
        saveLegacy(); // Save updated legacy
    }
    
    // Clear saved game state
    localStorage.removeItem('civCardGameState');
    
    // Build game over screen
    let gameOverHTML = `
        <div class="game-over-screen">
            <h2>${win ? '🎉 胜利！' : '💀 游戏结束'}</h2>
            <div class="final-stats">
                <h3>最终统计</h3>
                <div class="stat-item">存活年数: ${gameState.turn}</div>
                <div class="stat-item">文明阶段: ${stages[gameState.stageIdx].name}</div>
                <div class="stat-item">最终人口: ${gameState.resources.population}</div>
                <div class="stat-item">科技水平: ${gameState.resources.tech}</div>
                <div class="stat-item">文化水平: ${gameState.resources.culture}</div>
                <div class="stat-item">总分: ${score}</div>
            </div>
            <div class="legacy-info">
                <h3>文明遗产</h3>
                <div class="legacy-item">科技遗产: +${legacy.techBonus}</div>
                <div class="legacy-item">农业遗产: +${legacy.foodBonus}</div>
                <div class="legacy-item">文化遗产: +${legacy.cultureBonus}</div>
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
        // Continue saved game
        updateUI();
        if (gameState.gameOver) {
            showStartLocation();
        } else {
            nextTurn();
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
            <h2>📚 游戏帮助</h2>
            <div class="help-section">
                <h3>🎯 游戏目标</h3>
                <p>引导你的文明从部落时代发展到星际文明，尽可能生存更多年数。</p>
            </div>
            <div class="help-section">
                <h3>🔄 游戏流程</h3>
                <ol>
                    <li>每年抽取3张事件卡，选择1张执行</li>
                    <li>事件影响你的资源（人口、粮食、科技、军力、文化、环境）</li>
                    <li>然后选择1个行动来进一步发展文明</li>
                    <li>科技达到要求时自动进入下一文明阶段</li>
                </ol>
            </div>
            <div class="help-section">
                <h3>⚠️ 生存条件</h3>
                <p>人口、粮食或环境稳定度降至0时游戏结束。合理平衡各项资源是关键！</p>
            </div>
            <div class="help-section">
                <h3>🏆 文明遗产</h3>
                <p>游戏结束后会获得遗产加成，下次游戏开始时提供额外资源。</p>
            </div>
            <button id="close-help" class="restart-button">返回游戏</button>
        </div>
    `;
    
    document.getElementById('center-panel').innerHTML = helpHTML;
    document.getElementById('close-help').onclick = () => {
        if (gameState.started && !gameState.gameOver) {
            nextTurn();
        } else {
            showStartLocation();
        }
    };
}
