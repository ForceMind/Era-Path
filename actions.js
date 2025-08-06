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
    }
};
    // === 部落文明阶段 (0) ===
    { 
        key: 'hunt', name: '狩猎采集', desc: '派遣部落成员狩猎野兽和采集食物', 
        costs: { population: 5 }, effects: { food: 15, tech: 2, environment: -2 }, stage: 0
    },
    { 
        key: 'craft_tools', name: '制作工具', desc: '用石头和木材制作简单工具，提升效率', 
        costs: { population: 3 }, effects: { tech: 10, food: 2 }, stage: 0
    },
    { 
        key: 'explore_territory', name: '探索领地', desc: '派遣勇士探索未知区域，寻找资源', 
        costs: { population: 4, food: 2 }, effects: { food: 8, tech: 3, environment: -3 }, stage: 0
    },
    { 
        key: 'tribal_gathering', name: '部落集会', desc: '举行仪式增强部落凝聚力和传承知识', 
        costs: { food: 5 }, effects: { tech: 5, population: 4 }, stage: 0
    },
    { 
        key: 'build_shelter', name: '建造庇护所', desc: '修建简单的居住场所，保护部落安全', 
        costs: { population: 4, food: 3 }, effects: { tech: 3, environment: 5, population: 3 }, stage: 0
    },
    { 
        key: 'preserve_food', name: '储存食物', desc: '学习保存和储存食物的方法', 
        costs: { tech: 2, population: 2 }, effects: { food: 12, tech: 1 }, stage: 0
    },
    { 
        key: 'fire_mastery', name: '掌握火种', desc: '学会生火和控制火焰的技术', 
        costs: { population: 2, food: 1 }, effects: { tech: 6, food: 3, environment: -1 }, stage: 0
    },
    { 
        key: 'water_source', name: '寻找水源', desc: '寻找稳定可靠的水源', 
        costs: { population: 3 }, effects: { food: 6, environment: 8, population: 2 }, stage: 0
    },

    // === 农业文明阶段 (1) ===
    { 
        key: 'farm_develop', name: '发展农业', desc: '开垦土地，种植作物，建立稳定粮食来源', 
        costs: { population: 8, tech: 3 }, effects: { food: 25, population: 5, environment: -5 }, stage: 1
    },
    { 
        key: 'domesticate', name: '驯养牲畜', desc: '驯化野生动物，获得持续的食物和劳力', 
        costs: { food: 8, military: 3 }, effects: { food: 18, military: 4, tech: 2 }, stage: 1
    },
    { 
        key: 'settle_village', name: '建立村庄', desc: '建设永久性定居点，发展定居文明', 
        costs: { food: 12, population: 6 }, effects: { population: 15, tech: 8, environment: -3 }, stage: 1
    },
    { 
        key: 'pottery_craft', name: '陶器制作', desc: '制作陶器用于储存和烹饪', 
        costs: { population: 5, tech: 3 }, effects: { tech: 12, food: 8 }, stage: 1
    },
    { 
        key: 'irrigation', name: '灌溉系统', desc: '修建水渠，改善农业生产条件', 
        costs: { population: 10, tech: 5 }, effects: { food: 20, tech: 8, environment: -8 }, stage: 1
    },
    { 
        key: 'weaving', name: '纺织技艺', desc: '发展纺织技术，制作衣物和工具', 
        costs: { population: 3, tech: 4 }, effects: { tech: 8, population: 5, food: 3 }, stage: 1
    },

    // === 城邦文明阶段 (2) ===
    { 
        key: 'establish_trade', name: '建立贸易', desc: '与邻近城邦建立贸易往来', 
        costs: { military: 5, culture: 8 }, effects: { culture: 15, tech: 8, food: 12 }, stage: 2
    },
    { 
        key: 'build_walls', name: '修建城墙', desc: '建设坚固的防御工事保护城市', 
        costs: { food: 15, population: 10, tech: 5 }, effects: { military: 20, tech: 3 }, stage: 2
    },
    { 
        key: 'education_system', name: '建立学校', desc: '创办学校，培养有知识的人才', 
        costs: { food: 12, culture: 10 }, effects: { tech: 15, culture: 12 }, stage: 2
    },
    { 
        key: 'artisan_guilds', name: '工匠行会', desc: '组织手工业者，发展专业技能', 
        costs: { food: 10, culture: 6 }, effects: { culture: 12, tech: 10, population: 4 }, stage: 2
    },
    { 
        key: 'road_network', name: '道路建设', desc: '修建道路连接各个城邦', 
        costs: { population: 12, food: 8 }, effects: { culture: 10, military: 5, tech: 8 }, stage: 2
    },
    { 
        key: 'market_square', name: '建设市场', desc: '建立集中交易的市场广场', 
        costs: { food: 8, tech: 4 }, effects: { culture: 8, food: 15, population: 6 }, stage: 2
    },

    // === 帝国时代阶段 (3) ===
    { 
        key: 'military_campaign', name: '军事征战', desc: '发动战争扩张帝国版图', 
        costs: { food: 20, military: 15, population: 8 }, effects: { military: 25, population: 20, environment: -10 }, stage: 3
    },
    { 
        key: 'infrastructure', name: '基础建设', desc: '大规模修建道路、桥梁、水利工程', 
        costs: { food: 18, population: 15, tech: 8 }, effects: { culture: 15, tech: 12, population: 8 }, stage: 3
    },
    { 
        key: 'bureaucracy', name: '行政体系', desc: '建立完善的官僚和法律体系', 
        costs: { culture: 15, food: 10 }, effects: { culture: 20, tech: 10, military: 8 }, stage: 3
    },
    { 
        key: 'cultural_patronage', name: '文化资助', desc: '资助艺术家和学者，繁荣文化', 
        costs: { food: 15, culture: 10 }, effects: { culture: 25, tech: 8, environment: 3 }, stage: 3
    },
    { 
        key: 'imperial_roads', name: '帝国道路', desc: '建设覆盖帝国的道路网络', 
        costs: { population: 20, tech: 15, food: 18 }, effects: { military: 18, culture: 25, tech: 12 }, stage: 3
    },
    { 
        key: 'grand_monuments', name: '宏伟建筑', desc: '建造彰显帝国威严的纪念建筑', 
        costs: { culture: 25, tech: 20, population: 18 }, effects: { culture: 40, tech: 15, military: 12 }, stage: 3
    },
    { 
        key: 'imperial_navy', name: '帝国海军', desc: '建立强大的海上力量', 
        costs: { tech: 18, military: 15, food: 20 }, effects: { military: 30, culture: 15, tech: 12 }, stage: 3
    },
    { 
        key: 'scholarly_academy', name: '学术研究院', desc: '建立帝国学术研究机构', 
        costs: { culture: 22, tech: 15, food: 12 }, effects: { tech: 35, culture: 20 }, stage: 3
    },
    { 
        key: 'naval_exploration', name: '海上探索', desc: '建造船队探索远洋，寻找新大陆', 
        costs: { tech: 10, military: 8, food: 12 }, effects: { food: 20, tech: 15, culture: 10, environment: -5 }, stage: 3
    },
    { 
        key: 'taxation_system', name: '税收制度', desc: '建立有效的税收体系支持国家发展', 
        costs: { culture: 12, military: 5 }, effects: { food: 18, military: 10, tech: 5 }, stage: 3
    },

    // === 工业文明阶段 (4) ===
    { 
        key: 'factory_production', name: '工厂生产', desc: '建设工厂进行大规模机械化生产', 
        costs: { population: 20, tech: 15, food: 12 }, effects: { tech: 25, population: 25, environment: -20 }, stage: 4
    },
    { 
        key: 'railway_construction', name: '铁路建设', desc: '修建铁路网络革新运输方式', 
        costs: { food: 25, population: 18, tech: 12 }, effects: { culture: 15, tech: 18, food: 10 }, stage: 4
    },
    { 
        key: 'scientific_research', name: '科学研究', desc: '建立研究机构推进科技发展', 
        costs: { culture: 20, food: 18 }, effects: { tech: 35, culture: 10 }, stage: 4
    },
    { 
        key: 'urban_planning', name: '城市规划', desc: '重新规划城市布局，改善居住环境', 
        costs: { food: 15, tech: 10, population: 8 }, effects: { culture: 12, population: 15, environment: 8 }, stage: 4
    },
    { 
        key: 'mass_education', name: '普及教育', desc: '建立义务教育制度，提高民众素质', 
        costs: { food: 20, culture: 15 }, effects: { culture: 25, tech: 15, population: 8 }, stage: 4
    },
    { 
        key: 'steam_power', name: '蒸汽动力', desc: '开发和应用蒸汽机技术', 
        costs: { tech: 15, population: 12, food: 10 }, effects: { tech: 30, culture: 15, military: 10 }, stage: 4
    },
    { 
        key: 'electrical_systems', name: '电力系统', desc: '建设发电厂和电力输配网络', 
        costs: { tech: 25, population: 15, food: 12 }, effects: { tech: 35, culture: 20, population: 18 }, stage: 4
    },
    { 
        key: 'chemical_industry', name: '化学工业', desc: '发展大规模化学工业生产', 
        costs: { tech: 20, population: 12, environment: 10 }, effects: { tech: 28, military: 20, culture: 8, environment: -15 }, stage: 4
    },

    // === 信息文明阶段 (5) ===
    { 
        key: 'digital_revolution', name: '数字革命', desc: '全面推进计算机和网络技术', 
        costs: { culture: 25, tech: 20, food: 15 }, effects: { tech: 40, culture: 20, environment: 5 }, stage: 5
    },
    { 
        key: 'internet_infrastructure', name: '互联网基础设施', desc: '建设全球互联网络系统', 
        costs: { tech: 30, culture: 20, population: 10 }, effects: { tech: 35, culture: 35, population: 20 }, stage: 5
    },
    { 
        key: 'artificial_intelligence', name: '人工智能', desc: '开发人工智能和机器学习技术', 
        costs: { tech: 35, culture: 20, food: 15 }, effects: { tech: 50, culture: 25, military: 20, environment: 5 }, stage: 5
    },
    { 
        key: 'genetic_engineering', name: '基因工程', desc: '掌握基因编辑和生物技术', 
        costs: { tech: 28, culture: 15, food: 18 }, effects: { tech: 35, population: 25, environment: 15 }, stage: 5
    },
    { 
        key: 'quantum_computing', name: '量子计算', desc: '突破量子计算技术瓶颈', 
        costs: { tech: 40, culture: 25, food: 20 }, effects: { tech: 60, culture: 30, military: 25 }, stage: 5
    },
    { 
        key: 'space_program', name: '航天计划', desc: '发展航天技术探索太空', 
        costs: { tech: 25, culture: 20, food: 20 }, effects: { tech: 35, culture: 15, military: 5 }, stage: 5
    },
    { 
        key: 'biotechnology', name: '生物技术', desc: '发展基因工程和生物医学', 
        costs: { tech: 18, culture: 12, food: 15 }, effects: { tech: 30, population: 15, environment: 8 }, stage: 5
    },
    { 
        key: 'renewable_energy', name: '可再生能源', desc: '大规模开发太阳能风能等清洁能源', 
        costs: { tech: 15, population: 10, food: 10 }, effects: { environment: 20, tech: 12, population: 5 }, stage: 5
    },
    { 
        key: 'global_cooperation', name: '国际合作', desc: '参与全球治理和国际组织', 
        costs: { military: 10, culture: 15 }, effects: { culture: 25, environment: 10, tech: 15 }, stage: 5
    },
    { 
        key: 'green_technology', name: '绿色科技', desc: '发展清洁能源和环保技术', 
        costs: { tech: 20, culture: 15, food: 12 }, effects: { environment: 25, tech: 18, food: 8 }, stage: 5
    },
    { 
        key: 'space_program', name: '航天计划', desc: '发展航天技术探索太空', 
        costs: { tech: 25, culture: 20, food: 20 }, effects: { tech: 35, culture: 15, military: 5 }, stage: 5
    },
    { 
        key: 'biotechnology', name: '生物技术', desc: '发展基因工程和生物医学', 
        costs: { tech: 18, culture: 12, food: 15 }, effects: { tech: 30, population: 15, environment: 8 }, stage: 5
    },
    { 
        key: 'renewable_energy', name: '可再生能源', desc: '大规模开发太阳能风能等清洁能源', 
        costs: { tech: 15, population: 10, food: 10 }, effects: { environment: 20, tech: 12, population: 5 }, stage: 5
    },

    // === 星际文明阶段 (6) ===
    { 
        key: 'space_colonization', name: '太空殖民', desc: '建立太空站和行星殖民地', 
        costs: { tech: 30, population: 20, food: 25, military: 10 }, effects: { population: 30, tech: 25, environment: 15 }, stage: 6
    },
    { 
        key: 'interstellar_travel', name: '星际旅行', desc: '发展超光速引擎技术', 
        costs: { tech: 35, culture: 25, food: 20 }, effects: { tech: 45, culture: 20, military: 8 }, stage: 6
    },
    { 
        key: 'terraform_planets', name: '行星改造', desc: '改造外星球环境使其适宜居住', 
        costs: { tech: 25, environment: 15, food: 18 }, effects: { environment: 30, population: 25, food: 20 }, stage: 6
    },
    { 
        key: 'alien_diplomacy', name: '外星外交', desc: '与外星文明建立外交关系', 
        costs: { culture: 30, military: 12 }, effects: { culture: 35, tech: 20, military: 15 }, stage: 6
    },
    { 
        key: 'galactic_federation', name: '银河联盟', desc: '建立跨星系的政治联盟', 
        costs: { culture: 35, military: 15, tech: 20 }, effects: { culture: 40, military: 20, tech: 15, environment: 10 }, stage: 6
    },
    { 
        key: 'dimensional_research', name: '维度研究', desc: '研究多维空间和平行宇宙', 
        costs: { tech: 40, culture: 30, food: 25 }, effects: { tech: 50, culture: 25, military: 12 }, stage: 6
    }
];

// Function to get actions filtered by stage
function getActionsForStage(stage) {
    return actions.filter(action => action.stage === stage);
}

// Function to get random actions for a stage
function getRandomActionsForStage(stage, count = 4) {
    const available = getActionsForStage(stage);
    let result = [];
    let used = new Set();
    
    while (result.length < count && available.length > 0) {
        let idx = Math.floor(Math.random() * available.length);
        if (!used.has(idx)) {
            result.push(available[idx]);
            used.add(idx);
        }
    }
    return result;
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { actions, getActionsForStage, getRandomActionsForStage };
}
