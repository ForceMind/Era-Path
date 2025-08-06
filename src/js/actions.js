// actions.js - Dynamic Action System for Civilization Card Roguelike Game
// Actions are now contextual and respond to events and current game state
// All UI text and game content in Simplified Chinese
// All code comments and variable names in English

// Action categories for strategic depth
const ACTION_TYPES = {
    AMPLIFY: 'amplify',      // 强化事件效果
    COUNTER: 'counter',      // 抵消负面效果
    CONVERT: 'convert',      // 资源转化
    INVEST: 'invest',        // 长期投资
    EMERGENCY: 'emergency',  // 应急响应
    SYNERGY: 'synergy'       // 组合效应
};

// Base actions pool organized by stage and type
const actionPool = {
    // === 部落文明阶段 (0) ===
    0: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'expand_hunt', name: '扩大狩猎', desc: '趁势扩大狩猎规模，获得更多食物',
                costs: { population: 8 }, effects: { food: 25, environment: -5 },
                triggers: ['opportunity'], amplifies: ['food']
            },
            {
                key: 'gather_knowledge', name: '收集知识', desc: '记录和传承新发现的知识',
                costs: { population: 4 }, effects: { tech: 15, population: 2 },
                triggers: ['opportunity'], amplifies: ['tech']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'emergency_shelter', name: '紧急庇护', desc: '快速建造临时庇护所应对危机',
                costs: { population: 6, food: 5 }, effects: { environment: 15, population: 3 },
                triggers: ['crisis'], counters: ['environment', 'population']
            },
            {
                key: 'rationing', name: '配给制度', desc: '严格控制食物分配，度过难关',
                costs: { population: 3 }, effects: { food: 8, environment: 3 },
                triggers: ['crisis'], counters: ['food']
            },
            {
                key: 'tribal_unity', name: '部落团结', desc: '加强部落内部团结，共同应对困难',
                costs: { food: 8 }, effects: { population: 12, tech: 5 },
                triggers: ['crisis'], counters: ['population']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'population_to_food', name: '全力觅食', desc: '派遣更多人手寻找食物',
                costs: { population: 10 }, effects: { food: 20, tech: 3 },
                converts: { from: 'population', to: 'food', ratio: 2 }
            },
            {
                key: 'food_to_tech', name: '专心研究', desc: '减少觅食，专注技术发展',
                costs: { food: 12 }, effects: { tech: 18, population: 2 },
                converts: { from: 'food', to: 'tech', ratio: 1.5 }
            },
            {
                key: 'environment_to_population', name: '开发领地', desc: '开发更多栖息地，支持人口增长',
                costs: { environment: 10 }, effects: { population: 15, food: 5 },
                converts: { from: 'environment', to: 'population', ratio: 1.5 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'tool_workshop', name: '工具作坊', desc: '建立工具制作场所，长期提升效率',
                costs: { population: 6, food: 8 }, effects: { tech: 12 },
                investment: { turns: 3, returns: { tech: 5, food: 3 } }
            },
            {
                key: 'seed_storage', name: '种子储备', desc: '收集各种植物种子，为农业做准备',
                costs: { food: 10, population: 4 }, effects: { tech: 8 },
                investment: { turns: 2, returns: { food: 12 } }
            }
        ]
    },

    // === 农业文明阶段 (1) ===
    1: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'expand_farming', name: '扩大农业', desc: '趁势扩大农业规模',
                costs: { population: 12, tech: 5 }, effects: { food: 35, environment: -8 },
                triggers: ['opportunity'], amplifies: ['food']
            },
            {
                key: 'livestock_boom', name: '畜牧繁荣', desc: '大力发展畜牧业',
                costs: { food: 15, military: 5 }, effects: { food: 30, military: 8, population: 8 },
                triggers: ['opportunity'], amplifies: ['food', 'military']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'crop_diversification', name: '作物多样化', desc: '种植多种作物降低风险',
                costs: { population: 8, tech: 6 }, effects: { food: 18, environment: 5 },
                triggers: ['crisis'], counters: ['food']
            },
            {
                key: 'defensive_stockade', name: '防御栅栏', desc: '建造防御工事保护村庄',
                costs: { population: 10, food: 8 }, effects: { military: 15, population: 5 },
                triggers: ['crisis'], counters: ['military', 'population']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'food_to_military', name: '训练民兵', desc: '用充足粮食供养军事训练',
                costs: { food: 20 }, effects: { military: 15, population: -3 },
                converts: { from: 'food', to: 'military', ratio: 0.75 }
            },
            {
                key: 'population_to_tech', name: '工匠专业化', desc: '让部分人专门从事技术工作',
                costs: { population: 12, food: 10 }, effects: { tech: 20 },
                converts: { from: 'population', to: 'tech', ratio: 1.67 }
            },
            {
                key: 'tech_to_food', name: '农业改良', desc: '运用技术提升农业产量',
                costs: { tech: 10, population: 8 }, effects: { food: 25, environment: -5 },
                converts: { from: 'tech', to: 'food', ratio: 2.5 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'irrigation_project', name: '灌溉工程', desc: '大型水利建设项目',
                costs: { population: 15, tech: 8, food: 12 }, effects: { tech: 5 },
                investment: { turns: 4, returns: { food: 15, environment: -2 } }
            },
            {
                key: 'pottery_industry', name: '陶器产业', desc: '发展陶器制作产业链',
                costs: { population: 10, tech: 6 }, effects: { food: 8 },
                investment: { turns: 3, returns: { tech: 8, food: 5 } }
            }
        ]
    },

    // === 城邦文明阶段 (2) ===
    2: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'trade_expansion', name: '贸易扩张', desc: '大力发展对外贸易',
                costs: { military: 8, culture: 12 }, effects: { culture: 25, food: 20, tech: 10 },
                triggers: ['opportunity'], amplifies: ['culture', 'tech']
            },
            {
                key: 'cultural_festival', name: '文化庆典', desc: '举办盛大的文化活动',
                costs: { food: 15, culture: 10 }, effects: { culture: 30, population: 12 },
                triggers: ['opportunity'], amplifies: ['culture']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'fortify_city', name: '加固城防', desc: '强化城市防御设施',
                costs: { population: 15, food: 12, tech: 8 }, effects: { military: 25, culture: 5 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'diplomatic_mission', name: '外交使团', desc: '派遣使者缓解外部压力',
                costs: { culture: 15, food: 10 }, effects: { military: 8, culture: 12 },
                triggers: ['crisis'], counters: ['military']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'culture_to_tech', name: '学术研究', desc: '将文化资源投入技术研究',
                costs: { culture: 15, food: 8 }, effects: { tech: 25, population: 3 },
                converts: { from: 'culture', to: 'tech', ratio: 1.67 }
            },
            {
                key: 'military_to_culture', name: '和平发展', desc: '削减军费发展文化',
                costs: { military: 12 }, effects: { culture: 20, tech: 8 },
                converts: { from: 'military', to: 'culture', ratio: 1.67 }
            },
            {
                key: 'tech_to_military', name: '军事革新', desc: '用技术优势强化军力',
                costs: { tech: 12, food: 10 }, effects: { military: 18, culture: 5 },
                converts: { from: 'tech', to: 'military', ratio: 1.5 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'academy_foundation', name: '学院建设', desc: '建立高等学府',
                costs: { culture: 20, food: 15, tech: 10 }, effects: { population: 5 },
                investment: { turns: 5, returns: { tech: 12, culture: 8 } }
            },
            {
                key: 'trade_routes', name: '贸易路线', desc: '建立长期贸易网络',
                costs: { military: 10, culture: 15, food: 12 }, effects: { tech: 5 },
                investment: { turns: 4, returns: { culture: 10, food: 8 } }
            }
        ]
    },

    // === 帝国时代阶段 (3) ===
    3: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'imperial_expansion', name: '帝国扩张', desc: '大规模军事征服行动',
                costs: { military: 20, population: 15, food: 20 }, effects: { military: 30, population: 25, culture: 15 },
                triggers: ['opportunity'], amplifies: ['military', 'population']
            },
            {
                key: 'cultural_hegemony', name: '文化霸权', desc: '推广帝国文化和价值观',
                costs: { culture: 25, food: 15 }, effects: { culture: 40, tech: 15, military: 10 },
                triggers: ['opportunity'], amplifies: ['culture']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'legion_defense', name: '军团防御', desc: '调动精锐军团抵御外敌',
                costs: { food: 25, military: 15 }, effects: { military: 35, population: 10 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'imperial_decree', name: '帝国法令', desc: '颁布紧急法令稳定局势',
                costs: { culture: 20, military: 10 }, effects: { culture: 25, population: 15, military: 5 },
                triggers: ['crisis'], counters: ['population', 'culture']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'tribute_system', name: '贡赋制度', desc: '建立贡赋体系获取资源',
                costs: { military: 15, culture: 10 }, effects: { food: 30, tech: 10 },
                converts: { from: 'military', to: 'food', ratio: 2 }
            },
            {
                key: 'imperial_bureaucracy', name: '帝国官僚', desc: '完善行政体系提升效率',
                costs: { culture: 20, food: 15 }, effects: { tech: 25, military: 8 },
                converts: { from: 'culture', to: 'tech', ratio: 1.25 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'imperial_roads', name: '帝国道路', desc: '建设横跨帝国的道路网',
                costs: { population: 25, tech: 15, food: 20 }, effects: { military: 10 },
                investment: { turns: 6, returns: { culture: 15, military: 10, food: 10 } }
            }
        ]
    },

    // === 工业文明阶段 (4) ===
    4: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'industrial_revolution', name: '工业革命', desc: '全面推进机械化生产',
                costs: { tech: 25, population: 20, food: 15 }, effects: { tech: 40, population: 30, environment: -15 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'mass_production', name: '大规模生产', desc: '建立现代工厂体系',
                costs: { population: 25, tech: 20 }, effects: { tech: 35, food: 20, environment: -10 },
                triggers: ['opportunity'], amplifies: ['tech', 'food']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'labor_organization', name: '劳工组织', desc: '建立工会应对社会问题',
                costs: { culture: 20, food: 15 }, effects: { population: 25, culture: 15 },
                triggers: ['crisis'], counters: ['population']
            },
            {
                key: 'environmental_regulation', name: '环境法规', desc: '制定法律保护环境',
                costs: { tech: 15, culture: 12 }, effects: { environment: 25, tech: 8 },
                triggers: ['crisis'], counters: ['environment']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'mechanization', name: '机械化改造', desc: '用机器替代人力劳动',
                costs: { tech: 20, food: 15 }, effects: { population: 20, tech: 10, environment: -8 },
                converts: { from: 'tech', to: 'population', ratio: 1 }
            },
            {
                key: 'urbanization', name: '城市化进程', desc: '农村人口向城市迁移',
                costs: { food: 25, environment: 10 }, effects: { population: 30, tech: 15, culture: 10 },
                converts: { from: 'food', to: 'population', ratio: 1.2 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'railway_network', name: '铁路网络', desc: '建设全国铁路运输系统',
                costs: { tech: 25, population: 20, food: 18 }, effects: { culture: 10 },
                investment: { turns: 5, returns: { tech: 15, food: 12, culture: 8 } }
            }
        ]
    },

    // === 信息文明阶段 (5) ===
    5: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'digital_transformation', name: '数字化转型', desc: '全社会数字化改造',
                costs: { tech: 30, culture: 25 }, effects: { tech: 50, culture: 30, population: 15 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'global_connectivity', name: '全球互联', desc: '建立全球信息网络',
                costs: { tech: 35, food: 20 }, effects: { tech: 45, culture: 25, military: 15 },
                triggers: ['opportunity'], amplifies: ['tech']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'cybersecurity', name: '网络安全', desc: '建立数字防御体系',
                costs: { tech: 25, military: 15 }, effects: { military: 25, tech: 20 },
                triggers: ['crisis'], counters: ['military', 'tech']
            },
            {
                key: 'digital_divide', name: '数字鸿沟', desc: '解决技术不平等问题',
                costs: { culture: 25, food: 18 }, effects: { population: 20, culture: 20 },
                triggers: ['crisis'], counters: ['population']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'automation', name: '自动化系统', desc: '用AI系统优化生产',
                costs: { tech: 30, culture: 15 }, effects: { food: 35, environment: 15, population: 10 },
                converts: { from: 'tech', to: 'food', ratio: 1.17 }
            },
            {
                key: 'virtual_society', name: '虚拟社会', desc: '发展虚拟现实社交平台',
                costs: { tech: 25, food: 12 }, effects: { culture: 35, population: 15 },
                converts: { from: 'tech', to: 'culture', ratio: 1.4 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'space_program', name: '太空计划', desc: '发展载人航天技术',
                costs: { tech: 35, culture: 25, food: 20 }, effects: { military: 10 },
                investment: { turns: 6, returns: { tech: 20, culture: 15, environment: 10 } }
            }
        ]
    },

    // === 星际文明阶段 (6) ===
    6: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'galactic_expansion', name: '银河扩张', desc: '建立跨星系殖民地',
                costs: { tech: 40, military: 25, population: 30 }, effects: { population: 50, tech: 35, environment: 20 },
                triggers: ['opportunity'], amplifies: ['population', 'tech']
            },
            {
                key: 'cosmic_research', name: '宇宙研究', desc: '探索宇宙深层奥秘',
                costs: { tech: 45, culture: 30 }, effects: { tech: 60, culture: 40, military: 20 },
                triggers: ['opportunity'], amplifies: ['tech']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'planetary_defense', name: '行星防御', desc: '建立星际防御系统',
                costs: { tech: 35, military: 30 }, effects: { military: 45, tech: 25 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'ecological_restoration', name: '生态重建', desc: '修复星球生态系统',
                costs: { tech: 30, population: 20 }, effects: { environment: 40, population: 25 },
                triggers: ['crisis'], counters: ['environment']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'terraforming', name: '行星改造', desc: '改造外星球环境',
                costs: { tech: 35, environment: 15 }, effects: { population: 40, food: 30 },
                converts: { from: 'tech', to: 'population', ratio: 1.14 }
            },
            {
                key: 'energy_mastery', name: '能源掌控', desc: '掌握恒星级能源技术',
                costs: { tech: 40, culture: 25 }, effects: { tech: 50, environment: 25, military: 15 },
                converts: { from: 'culture', to: 'tech', ratio: 2 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'dimensional_gateway', name: '维度之门', desc: '建造跨维度传送门',
                costs: { tech: 50, culture: 35, military: 25 }, effects: { population: 20 },
                investment: { turns: 8, returns: { tech: 30, culture: 25, military: 20 } }
            }
        ]
    }
};

// Emergency actions available at any stage when resources are critically low
const emergencyActions = {
    lowFood: [
        {
            key: 'emergency_hunt', name: '紧急狩猎', desc: '动员所有人手寻找食物',
            costs: { population: 8 }, effects: { food: 12, environment: -8 },
            requirement: { food: { below: 10 } }
        },
        {
            key: 'food_rationing', name: '严格配给', desc: '实施严格的食物配给制度',
            costs: { population: 3 }, effects: { food: 6, environment: 2 },
            requirement: { food: { below: 15 } }
        }
    ],
    lowPopulation: [
        {
            key: 'population_boost', name: '鼓励生育', desc: '采取措施增加人口',
            costs: { food: 20, tech: 5 }, effects: { population: 15 },
            requirement: { population: { below: 20 } }
        }
    ],
    lowEnvironment: [
        {
            key: 'environmental_restoration', name: '环境修复', desc: '专注于恢复生态环境',
            costs: { population: 10, food: 8 }, effects: { environment: 20, tech: 3 },
            requirement: { environment: { below: 25 } }
        }
    ]
};

// Dynamic action selection based on last event and current state
function getContextualActions(lastEvent, gameState, count = 4) {
    const stage = gameState.stageIdx;
    const eventType = lastEvent ? lastEvent.type : null;
    const resources = gameState.resources;
    
    let availableActions = [];
    const stageActions = actionPool[stage] || {};
    
    // 1. Add event-responsive actions
    if (eventType && stageActions[ACTION_TYPES.AMPLIFY] && eventType === 'opportunity') {
        // For opportunities, add amplifying actions
        const amplifyActions = stageActions[ACTION_TYPES.AMPLIFY].filter(action => {
            if (!action.amplifies || !lastEvent.effects) return false;
            return action.amplifies.some(resource => lastEvent.effects[resource] > 0);
        });
        availableActions.push(...amplifyActions);
    }
    
    if (eventType && stageActions[ACTION_TYPES.COUNTER] && eventType === 'crisis') {
        // For crises, add countering actions
        const counterActions = stageActions[ACTION_TYPES.COUNTER].filter(action => {
            if (!action.counters || !lastEvent.effects) return false;
            return action.counters.some(resource => lastEvent.effects[resource] < 0);
        });
        availableActions.push(...counterActions);
    }
    
    // 2. Add conversion actions based on resource abundance/scarcity
    if (stageActions[ACTION_TYPES.CONVERT]) {
        const conversionActions = stageActions[ACTION_TYPES.CONVERT].filter(action => {
            if (!action.converts) return true;
            const fromResource = action.converts.from;
            const toResource = action.converts.to;
            
            // Only show if we have enough of the source resource and need the target
            const hasSource = resources[fromResource] >= (action.costs[fromResource] || 0);
            const needsTarget = isResourceNeeded(toResource, resources, stage);
            
            return hasSource && needsTarget;
        });
        availableActions.push(...conversionActions);
    }
    
    // 3. Add investment actions when resources are abundant
    if (stageActions[ACTION_TYPES.INVEST] && isResourcesAbundant(resources, stage)) {
        availableActions.push(...stageActions[ACTION_TYPES.INVEST]);
    }
    
    // 4. Add emergency actions if resources are critically low
    Object.keys(emergencyActions).forEach(emergencyType => {
        const actions = emergencyActions[emergencyType];
        actions.forEach(action => {
            if (meetsRequirement(action.requirement, resources)) {
                availableActions.push(action);
            }
        });
    });
    
    // 5. If we don't have enough actions, add basic actions from all categories
    if (availableActions.length < count) {
        Object.keys(stageActions).forEach(actionType => {
            const typeActions = stageActions[actionType] || [];
            typeActions.forEach(action => {
                if (!availableActions.find(a => a.key === action.key)) {
                    availableActions.push(action);
                }
            });
        });
    }
    
    // 6. Remove duplicates and unaffordable actions
    availableActions = removeDuplicates(availableActions);
    availableActions = availableActions.filter(action => canAffordAction(action, resources, stage));
    
    // 7. If still not enough actions, ensure we have at least some basic actions
    if (availableActions.length === 0 && stageActions) {
        // Fallback: add the first affordable action from each type
        Object.keys(stageActions).forEach(actionType => {
            const typeActions = stageActions[actionType] || [];
            const affordableAction = typeActions.find(action => canAffordAction(action, resources, stage));
            if (affordableAction && availableActions.length < count) {
                availableActions.push(affordableAction);
            }
        });
    }
    
    // 8. Select final actions with priority weighting
    return selectWeightedActions(availableActions, lastEvent, gameState, count);
}

// Helper functions
function isResourceNeeded(resource, resources, stage) {
    const getResourcesForStage = window.getResourcesForStage || (() => []);
    const stageResources = getResourcesForStage(stage);
    const resourceConfig = stageResources.find(r => r.key === resource);
    
    if (!resourceConfig) return false;
    
    const currentValue = resources[resource] || 0;
    return currentValue <= resourceConfig.warning;
}

function isResourcesAbundant(resources, stage) {
    const getResourcesForStage = window.getResourcesForStage || (() => []);
    const stageResources = getResourcesForStage(stage);
    
    let abundantCount = 0;
    stageResources.forEach(resourceConfig => {
        const currentValue = resources[resourceConfig.key] || 0;
        if (currentValue > resourceConfig.warning * 2) {
            abundantCount++;
        }
    });
    
    return abundantCount >= 2; // At least 2 resources are abundant
}

function meetsRequirement(requirement, resources) {
    if (!requirement) return true;
    
    for (let resource in requirement) {
        const condition = requirement[resource];
        const currentValue = resources[resource] || 0;
        
        if (condition.below && currentValue >= condition.below) return false;
        if (condition.above && currentValue <= condition.above) return false;
    }
    
    return true;
}

function canAffordAction(action, resources, stage) {
    if (!action.costs) return true;
    
    const getResourcesForStage = window.getResourcesForStage || (() => []);
    const availableResources = getResourcesForStage(stage);
    const availableResourceKeys = availableResources.map(r => r.key);
    
    for (let resource in action.costs) {
        if (!availableResourceKeys.includes(resource)) return false;
        if ((resources[resource] || 0) < action.costs[resource]) return false;
    }
    
    return true;
}

function removeDuplicates(actions) {
    const seen = new Set();
    return actions.filter(action => {
        if (seen.has(action.key)) return false;
        seen.add(action.key);
        return true;
    });
}

function selectWeightedActions(availableActions, lastEvent, gameState, count) {
    if (availableActions.length <= count) return availableActions;
    
    // Weight actions based on context
    const weightedActions = availableActions.map(action => ({
        action,
        weight: calculateActionWeight(action, lastEvent, gameState)
    }));
    
    // Sort by weight and select top actions
    weightedActions.sort((a, b) => b.weight - a.weight);
    return weightedActions.slice(0, count).map(item => item.action);
}

function calculateActionWeight(action, lastEvent, gameState) {
    let weight = 1;
    
    // Higher weight for event-responsive actions
    if (lastEvent) {
        if (action.triggers && action.triggers.includes(lastEvent.type)) {
            weight += 2;
        }
        
        if (action.amplifies && lastEvent.effects) {
            const hasAmplifiable = action.amplifies.some(resource => 
                lastEvent.effects[resource] > 0
            );
            if (hasAmplifiable) weight += 1.5;
        }
        
        if (action.counters && lastEvent.effects) {
            const hasCounterable = action.counters.some(resource => 
                lastEvent.effects[resource] < 0
            );
            if (hasCounterable) weight += 1.5;
        }
    }
    
    // Higher weight for addressing resource shortages
    const resources = gameState.resources;
    if (action.effects) {
        Object.keys(action.effects).forEach(resource => {
            const currentValue = resources[resource] || 0;
            if (currentValue < 20 && action.effects[resource] > 0) {
                weight += 1;
            }
        });
    }
    
    return weight;
}

// Compatibility functions for existing game code
function getActionsForStage(stage) {
    // Return a basic set of actions for compatibility
    const stageActions = actionPool[stage] || {};
    let actions = [];
    
    Object.keys(stageActions).forEach(actionType => {
        actions.push(...stageActions[actionType]);
    });
    
    return actions;
}

function getRandomActionsForStage(stage, count = 4) {
    // This function is replaced by getContextualActions but kept for compatibility
    const actions = getActionsForStage(stage);
    let result = [];
    let used = new Set();
    
    while (result.length < count && actions.length > 0) {
        let idx = Math.floor(Math.random() * actions.length);
        if (!used.has(idx)) {
            result.push(actions[idx]);
            used.add(idx);
        }
    }
    return result;
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        actionPool, 
        emergencyActions,
        getContextualActions,
        getActionsForStage, 
        getRandomActionsForStage,
        ACTION_TYPES
    };
}

// Global export for compatibility with existing game.js
window.getContextualActions = getContextualActions;
window.getActionsForStage = getActionsForStage;
window.getRandomActionsForStage = getRandomActionsForStage;
window.ACTION_TYPES = ACTION_TYPES;
