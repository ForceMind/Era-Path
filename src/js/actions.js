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
            },
            {
                key: 'fertility_ritual', name: '生育仪式', desc: '利用好时机举行传统仪式促进人口增长',
                costs: { food: 10 }, effects: { population: 18, tech: 5 },
                triggers: ['opportunity'], amplifies: ['population']
            },
            {
                key: 'nature_harmony', name: '自然和谐', desc: '与自然环境建立更深层次的联系',
                costs: { population: 5, food: 8 }, effects: { environment: 20, tech: 8 },
                triggers: ['opportunity'], amplifies: ['environment']
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
            },
            {
                key: 'survival_adaptation', name: '生存适应', desc: '快速适应恶劣环境变化',
                costs: { population: 8, food: 6 }, effects: { environment: 12, tech: 10 },
                triggers: ['crisis'], counters: ['environment']
            },
            {
                key: 'resource_conservation', name: '资源保护', desc: '严格保护现有资源储备',
                costs: { population: 4 }, effects: { food: 6, environment: 8, tech: 3 },
                triggers: ['crisis'], counters: ['food', 'environment']
            },
            {
                key: 'elder_wisdom', name: '长者智慧', desc: '依靠部落长者的经验渡过危机',
                costs: { food: 5 }, effects: { tech: 12, population: 5, environment: 5 },
                triggers: ['crisis'], counters: ['tech', 'population']
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
            },
            {
                key: 'tech_to_environment', name: '生态技艺', desc: '运用技术改善生态环境',
                costs: { tech: 8, population: 5 }, effects: { environment: 15, food: 8 },
                converts: { from: 'tech', to: 'environment', ratio: 1.8 }
            },
            {
                key: 'balanced_exploitation', name: '平衡开发', desc: '在发展与保护间找到平衡',
                costs: { population: 6, environment: 8 }, effects: { food: 12, tech: 10 },
                converts: { from: 'environment', to: 'food', ratio: 1.5 }
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
            },
            {
                key: 'sacred_grove', name: '圣林培育', desc: '种植和保护神圣树林',
                costs: { population: 8, food: 6 }, effects: { environment: 5 },
                investment: { turns: 4, returns: { environment: 15, tech: 8, food: 5 } }
            },
            {
                key: 'tribal_education', name: '部落教育', desc: '建立知识传承体系',
                costs: { food: 12, population: 6 }, effects: { population: 3 },
                investment: { turns: 3, returns: { tech: 10, population: 8 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'seasonal_cycle', name: '季节循环', desc: '遵循自然规律，平衡发展各方面',
                costs: { population: 10, food: 8 }, effects: { population: 8, food: 12, environment: 10, tech: 6 },
                synergy: { all: 0.1 }
            },
            {
                key: 'tribal_festival', name: '部落节庆', desc: '举办传统庆典，增强凝聚力',
                costs: { food: 15 }, effects: { population: 12, tech: 8, environment: 5 },
                synergy: { population: 0.15, tech: 0.1 }
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
            },
            {
                key: 'tech_advancement', name: '技术突破', desc: '抓住机会推进农业技术革新',
                costs: { population: 10, food: 12 }, effects: { tech: 30, food: 15 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'population_growth', name: '人口繁荣', desc: '利用良好条件促进人口增长',
                costs: { food: 20, tech: 8 }, effects: { population: 25, military: 10 },
                triggers: ['opportunity'], amplifies: ['population']
            },
            {
                key: 'military_expansion', name: '军事扩张', desc: '趁势加强武装力量',
                costs: { population: 15, food: 18 }, effects: { military: 25, tech: 8 },
                triggers: ['opportunity'], amplifies: ['military']
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
            },
            {
                key: 'soil_restoration', name: '土壤修复', desc: '修复受损农田，恢复生产力',
                costs: { population: 12, tech: 8 }, effects: { environment: 20, food: 10 },
                triggers: ['crisis'], counters: ['environment', 'food']
            },
            {
                key: 'disease_control', name: '疫病防控', desc: '建立疫病防控体系',
                costs: { tech: 10, food: 8 }, effects: { population: 15, tech: 5 },
                triggers: ['crisis'], counters: ['population']
            },
            {
                key: 'food_preservation', name: '食物保存', desc: '发展食物储存和保鲜技术',
                costs: { tech: 8, population: 6 }, effects: { food: 20, tech: 8 },
                triggers: ['crisis'], counters: ['food']
            },
            {
                key: 'militia_training', name: '民兵训练', desc: '紧急训练民兵应对威胁',
                costs: { population: 10, food: 12 }, effects: { military: 18, population: -5 },
                triggers: ['crisis'], counters: ['military']
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
            },
            {
                key: 'military_to_food', name: '军队屯田', desc: '让军队参与农业生产',
                costs: { military: 12, population: 8 }, effects: { food: 22, tech: 5 },
                converts: { from: 'military', to: 'food', ratio: 1.8 }
            },
            {
                key: 'environment_to_tech', name: '自然研究', desc: '研究自然现象获得技术进步',
                costs: { environment: 12, population: 10 }, effects: { tech: 20, food: 8 },
                converts: { from: 'environment', to: 'tech', ratio: 1.67 }
            },
            {
                key: 'tech_to_population', name: '医疗技术', desc: '运用技术改善健康和生育',
                costs: { tech: 15, food: 10 }, effects: { population: 20, environment: -3 },
                converts: { from: 'tech', to: 'population', ratio: 1.33 }
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
            },
            {
                key: 'granary_system', name: '粮仓体系', desc: '建立大型粮食储存设施',
                costs: { population: 18, tech: 10, food: 15 }, effects: { military: 5 },
                investment: { turns: 3, returns: { food: 20, population: 10 } }
            },
            {
                key: 'breeding_program', name: '育种计划', desc: '长期改良作物和牲畜品种',
                costs: { tech: 12, food: 20, population: 8 }, effects: { environment: 5 },
                investment: { turns: 5, returns: { food: 25, tech: 10, environment: 8 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'agricultural_revolution', name: '农业革命', desc: '全面革新农业生产方式',
                costs: { population: 20, tech: 15, food: 25 }, effects: { food: 30, tech: 15, military: 10, environment: -5 },
                synergy: { food: 0.2, tech: 0.15 }
            },
            {
                key: 'village_confederation', name: '村落联盟', desc: '建立村落间的合作网络',
                costs: { population: 15, food: 18, military: 10 }, effects: { population: 20, military: 15, tech: 10 },
                synergy: { population: 0.1, military: 0.12 }
            },
            {
                key: 'harvest_festival', name: '丰收庆典', desc: '庆祝丰收，加强社会凝聚力',
                costs: { food: 20 }, effects: { population: 15, tech: 8, military: 8, environment: 5 },
                synergy: { all: 0.08 }
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
            },
            {
                key: 'technological_breakthrough', name: '技术突破', desc: '推动科学技术飞跃发展',
                costs: { culture: 15, population: 12 }, effects: { tech: 35, military: 10, food: 8 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'military_conquest', name: '军事征服', desc: '发动对外征服获取资源',
                costs: { military: 15, population: 10, food: 12 }, effects: { military: 20, population: 18, culture: 8 },
                triggers: ['opportunity'], amplifies: ['military', 'population']
            },
            {
                key: 'urban_prosperity', name: '城市繁荣', desc: '推动城市全面发展',
                costs: { food: 18, tech: 10 }, effects: { population: 25, culture: 15, military: 8 },
                triggers: ['opportunity'], amplifies: ['population']
            },
            {
                key: 'artisan_guild', name: '工匠行会', desc: '建立专业工匠组织',
                costs: { population: 12, culture: 10 }, effects: { tech: 20, culture: 15, food: 10 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
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
            },
            {
                key: 'cultural_preservation', name: '文化保护', desc: '保护传统文化免受冲击',
                costs: { population: 10, tech: 8 }, effects: { culture: 20, population: 8 },
                triggers: ['crisis'], counters: ['culture']
            },
            {
                key: 'emergency_mobilization', name: '紧急动员', desc: '动员全城应对危机',
                costs: { culture: 12, food: 15 }, effects: { population: 20, military: 15 },
                triggers: ['crisis'], counters: ['population', 'military']
            },
            {
                key: 'knowledge_preservation', name: '知识保护', desc: '保护重要技术和知识',
                costs: { culture: 10, population: 8 }, effects: { tech: 18, culture: 10 },
                triggers: ['crisis'], counters: ['tech']
            },
            {
                key: 'resource_rationing', name: '资源配给', desc: '实施严格的资源分配制度',
                costs: { culture: 8, military: 5 }, effects: { food: 15, population: 10, environment: 5 },
                triggers: ['crisis'], counters: ['food', 'population']
            },
            {
                key: 'plague_quarantine', name: '瘟疫隔离', desc: '建立隔离制度控制疫病传播',
                costs: { tech: 10, military: 8 }, effects: { population: 15, culture: -5 },
                triggers: ['crisis'], counters: ['population']
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
            },
            {
                key: 'population_to_culture', name: '文化教育', desc: '投入人力发展文化教育',
                costs: { population: 15, food: 12 }, effects: { culture: 25, tech: 8 },
                converts: { from: 'population', to: 'culture', ratio: 1.67 }
            },
            {
                key: 'food_to_population', name: '人口增长', desc: '用充足粮食支持人口增长',
                costs: { food: 20, culture: 8 }, effects: { population: 25, military: 5 },
                converts: { from: 'food', to: 'population', ratio: 1.25 }
            },
            {
                key: 'culture_to_military', name: '文化动员', desc: '用文化凝聚力增强军事力量',
                costs: { culture: 18, population: 10 }, effects: { military: 22, tech: 5 },
                converts: { from: 'culture', to: 'military', ratio: 1.22 }
            },
            {
                key: 'tech_to_food', name: '技术农业', desc: '运用技术大幅提升农业产量',
                costs: { tech: 15, population: 12 }, effects: { food: 30, environment: -8 },
                converts: { from: 'tech', to: 'food', ratio: 2 }
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
            },
            {
                key: 'grand_library', name: '大图书馆', desc: '建立知识收集和保存中心',
                costs: { culture: 25, tech: 15, population: 12 }, effects: { military: 5 },
                investment: { turns: 6, returns: { tech: 20, culture: 15, population: 8 } }
            },
            {
                key: 'amphitheater', name: '圆形剧场', desc: '建设大型文化娱乐设施',
                costs: { culture: 18, population: 15, food: 10 }, effects: { tech: 8 },
                investment: { turns: 4, returns: { culture: 18, population: 12 } }
            },
            {
                key: 'merchant_quarter', name: '商业区', desc: '建立专门的商业贸易区域',
                costs: { population: 20, food: 18, culture: 12 }, effects: { military: 8 },
                investment: { turns: 5, returns: { food: 15, culture: 12, tech: 10 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'golden_age', name: '黄金时代', desc: '推动文明全面繁荣发展',
                costs: { population: 25, culture: 20, tech: 15, food: 20 }, effects: { population: 20, culture: 25, tech: 20, military: 15, food: 15 },
                synergy: { all: 0.15 }
            },
            {
                key: 'city_state_alliance', name: '城邦联盟', desc: '与其他城邦建立同盟关系',
                costs: { military: 15, culture: 18, food: 12 }, effects: { military: 20, culture: 15, tech: 12, population: 10 },
                synergy: { military: 0.12, culture: 0.1 }
            },
            {
                key: 'cultural_synthesis', name: '文化融合', desc: '融合不同文化创造新文明',
                costs: { culture: 22, population: 15 }, effects: { culture: 30, tech: 15, military: 10, food: 8 },
                synergy: { culture: 0.18, tech: 0.1 }
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
            },
            {
                key: 'technological_empire', name: '技术帝国', desc: '推动帝国范围内的技术革新',
                costs: { tech: 20, culture: 18, population: 15 }, effects: { tech: 45, military: 15, food: 20 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'imperial_census', name: '帝国人口普查', desc: '大规模人口登记和管理',
                costs: { culture: 15, tech: 12, food: 18 }, effects: { population: 35, military: 12, culture: 10 },
                triggers: ['opportunity'], amplifies: ['population']
            },
            {
                key: 'tribute_expansion', name: '贡赋扩张', desc: '扩大贡赋制度获取更多资源',
                costs: { military: 18, culture: 12 }, effects: { food: 40, tech: 12, culture: 15 },
                triggers: ['opportunity'], amplifies: ['food']
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
            },
            {
                key: 'border_fortification', name: '边境要塞', desc: '在边境建立防御工事',
                costs: { population: 20, tech: 15, food: 18 }, effects: { military: 30, culture: 8 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'imperial_propaganda', name: '帝国宣传', desc: '加强意识形态控制',
                costs: { culture: 18, tech: 10 }, effects: { culture: 25, population: 12, military: 8 },
                triggers: ['crisis'], counters: ['culture', 'population']
            },
            {
                key: 'strategic_reserves', name: '战略储备', desc: '建立大规模资源储备',
                costs: { food: 30, tech: 12, military: 10 }, effects: { food: 20, population: 15, military: 12 },
                triggers: ['crisis'], counters: ['food', 'population']
            },
            {
                key: 'imperial_academy', name: '帝国学院', desc: '建立帝国级别的知识机构',
                costs: { culture: 22, population: 15 }, effects: { tech: 30, culture: 15, military: 8 },
                triggers: ['crisis'], counters: ['tech']
            },
            {
                key: 'provincial_autonomy', name: '行省自治', desc: '给予地方更多自主权',
                costs: { military: 12, culture: 15 }, effects: { population: 20, culture: 18, food: 10 },
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
            },
            {
                key: 'military_colonization', name: '军事殖民', desc: '派遣军队开拓新领土',
                costs: { military: 18, food: 20 }, effects: { population: 30, culture: 10, environment: -8 },
                converts: { from: 'military', to: 'population', ratio: 1.67 }
            },
            {
                key: 'imperial_taxation', name: '帝国税收', desc: '建立完善的税收体系',
                costs: { culture: 18, population: 12 }, effects: { food: 25, tech: 15, military: 10 },
                converts: { from: 'culture', to: 'food', ratio: 1.39 }
            },
            {
                key: 'tech_dissemination', name: '技术传播', desc: '在帝国内推广先进技术',
                costs: { tech: 20, culture: 15 }, effects: { population: 25, food: 20, military: 12 },
                converts: { from: 'tech', to: 'population', ratio: 1.25 }
            },
            {
                key: 'cultural_assimilation', name: '文化同化', desc: '将征服地区纳入帝国文化',
                costs: { population: 18, military: 15 }, effects: { culture: 30, tech: 12 },
                converts: { from: 'population', to: 'culture', ratio: 1.67 }
            },
            {
                key: 'imperial_infrastructure', name: '帝国基建', desc: '大规模基础设施建设',
                costs: { tech: 25, population: 20, food: 15 }, effects: { culture: 20, military: 18, food: 12 },
                converts: { from: 'tech', to: 'culture', ratio: 0.8 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'imperial_roads', name: '帝国道路', desc: '建设横跨帝国的道路网',
                costs: { population: 25, tech: 15, food: 20 }, effects: { military: 10 },
                investment: { turns: 6, returns: { culture: 15, military: 10, food: 10 } }
            },
            {
                key: 'great_wall', name: '长城工程', desc: '建造巨大的防御工程',
                costs: { population: 40, tech: 20, food: 30, military: 15 }, effects: { culture: 15 },
                investment: { turns: 8, returns: { military: 30, population: 20, culture: 15 } }
            },
            {
                key: 'imperial_university', name: '帝国大学', desc: '建立帝国最高学府',
                costs: { culture: 30, tech: 25, food: 20 }, effects: { military: 10 },
                investment: { turns: 7, returns: { tech: 25, culture: 20, population: 15 } }
            },
            {
                key: 'colosseum_project', name: '竞技场工程', desc: '建造大型娱乐竞技场',
                costs: { population: 30, culture: 25, food: 22 }, effects: { tech: 10 },
                investment: { turns: 5, returns: { culture: 25, population: 20, military: 12 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'imperial_golden_age', name: '帝国盛世', desc: '帝国达到全面繁荣的巅峰',
                costs: { population: 35, culture: 30, tech: 25, military: 25, food: 30 }, 
                effects: { population: 40, culture: 35, tech: 30, military: 30, food: 25, environment: 10 },
                synergy: { all: 0.2 }
            },
            {
                key: 'pax_imperia', name: '帝国和平', desc: '建立长久的帝国和平秩序',
                costs: { military: 25, culture: 25, food: 20 }, 
                effects: { population: 30, culture: 25, tech: 20, food: 18, environment: 8 },
                synergy: { population: 0.15, culture: 0.12, tech: 0.1 }
            },
            {
                key: 'imperial_synthesis', name: '帝国融合', desc: '融合各民族文化创造新文明',
                costs: { culture: 28, population: 22, tech: 18 }, 
                effects: { culture: 35, tech: 25, military: 20, population: 15 },
                synergy: { culture: 0.18, tech: 0.15 }
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
            },
            {
                key: 'resource_exploitation', name: '资源开发', desc: '大规模开发自然资源',
                costs: { tech: 20, military: 15, population: 18 }, effects: { food: 35, tech: 20, military: 15, environment: -20 },
                triggers: ['opportunity'], amplifies: ['food', 'tech']
            },
            {
                key: 'population_boom', name: '人口爆炸', desc: '工业化带来的人口快速增长',
                costs: { food: 25, tech: 15 }, effects: { population: 45, military: 20, culture: 15, environment: -12 },
                triggers: ['opportunity'], amplifies: ['population']
            },
            {
                key: 'military_industry', name: '军工产业', desc: '发展现代军事工业',
                costs: { tech: 30, population: 20, food: 18 }, effects: { military: 40, tech: 15, culture: 10 },
                triggers: ['opportunity'], amplifies: ['military']
            },
            {
                key: 'cultural_modernization', name: '文化现代化', desc: '推动传统文化向现代转型',
                costs: { culture: 20, tech: 18, food: 15 }, effects: { culture: 35, population: 20, tech: 15 },
                triggers: ['opportunity'], amplifies: ['culture']
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
            },
            {
                key: 'social_reform', name: '社会改革', desc: '推行社会制度改革',
                costs: { culture: 25, tech: 12, food: 18 }, effects: { population: 30, culture: 20, military: -5 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'pollution_control', name: '污染治理', desc: '采取措施控制工业污染',
                costs: { tech: 20, population: 15, food: 12 }, effects: { environment: 30, culture: 10 },
                triggers: ['crisis'], counters: ['environment']
            },
            {
                key: 'worker_protection', name: '工人保护', desc: '保护工人权益和安全',
                costs: { culture: 18, military: 10, food: 15 }, effects: { population: 25, culture: 18, tech: 8 },
                triggers: ['crisis'], counters: ['population']
            },
            {
                key: 'technology_safety', name: '技术安全', desc: '建立技术安全防护体系',
                costs: { tech: 18, culture: 12, military: 10 }, effects: { tech: 20, population: 15, environment: 8 },
                triggers: ['crisis'], counters: ['tech', 'population']
            },
            {
                key: 'resource_conservation', name: '资源节约', desc: '推广资源节约利用技术',
                costs: { tech: 15, culture: 15 }, effects: { food: 20, environment: 15, tech: 10 },
                triggers: ['crisis'], counters: ['food', 'environment']
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
            },
            {
                key: 'industrial_agriculture', name: '工业化农业', desc: '用工业技术改造农业',
                costs: { tech: 25, population: 15 }, effects: { food: 40, environment: -12 },
                converts: { from: 'tech', to: 'food', ratio: 1.6 }
            },
            {
                key: 'military_conversion', name: '军转民用', desc: '将军事技术转为民用',
                costs: { military: 20, tech: 10 }, effects: { tech: 25, food: 15, culture: 12 },
                converts: { from: 'military', to: 'tech', ratio: 1.25 }
            },
            {
                key: 'cultural_industry', name: '文化产业', desc: '将文化转化为工业生产力',
                costs: { culture: 20, tech: 15 }, effects: { tech: 25, population: 20, food: 10 },
                converts: { from: 'culture', to: 'tech', ratio: 1.25 }
            },
            {
                key: 'population_mobilization', name: '人口动员', desc: '动员人口投入工业生产',
                costs: { population: 25, culture: 15 }, effects: { tech: 30, food: 20, environment: -8 },
                converts: { from: 'population', to: 'tech', ratio: 1.2 }
            },
            {
                key: 'resource_processing', name: '资源加工', desc: '深度加工自然资源',
                costs: { environment: 15, tech: 12 }, effects: { food: 25, tech: 15, military: 10 },
                converts: { from: 'environment', to: 'food', ratio: 1.67 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'railway_network', name: '铁路网络', desc: '建设全国铁路运输系统',
                costs: { tech: 25, population: 20, food: 18 }, effects: { culture: 10 },
                investment: { turns: 5, returns: { tech: 15, food: 12, culture: 8 } }
            },
            {
                key: 'steel_industry', name: '钢铁工业', desc: '建立现代钢铁生产基地',
                costs: { tech: 30, population: 25, food: 20, environment: 15 }, effects: { military: 15 },
                investment: { turns: 6, returns: { tech: 20, military: 18, food: 10 } }
            },
            {
                key: 'power_grid', name: '电力网络', desc: '建设全面的电力供应系统',
                costs: { tech: 35, population: 30, food: 22 }, effects: { culture: 12 },
                investment: { turns: 7, returns: { tech: 25, population: 20, culture: 15, food: 12 } }
            },
            {
                key: 'education_system', name: '教育体系', desc: '建立现代教育制度',
                costs: { culture: 25, tech: 20, food: 18 }, effects: { population: 10 },
                investment: { turns: 6, returns: { tech: 22, culture: 18, population: 15 } }
            },
            {
                key: 'research_institute', name: '研究院所', desc: '建立科学研究机构',
                costs: { tech: 28, culture: 22, food: 20 }, effects: { military: 8 },
                investment: { turns: 5, returns: { tech: 25, culture: 15, military: 12 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'industrial_empire', name: '工业帝国', desc: '建立以工业为核心的强大帝国',
                costs: { tech: 40, population: 35, military: 25, food: 30 }, 
                effects: { tech: 45, population: 40, military: 30, food: 25, culture: 20, environment: -15 },
                synergy: { tech: 0.2, population: 0.15, military: 0.12 }
            },
            {
                key: 'modernization_drive', name: '现代化运动', desc: '全面推进社会现代化',
                costs: { tech: 30, culture: 25, population: 25, food: 20 }, 
                effects: { tech: 35, culture: 30, population: 30, food: 20, military: 15, environment: -10 },
                synergy: { tech: 0.15, culture: 0.15, population: 0.1 }
            },
            {
                key: 'technological_society', name: '技术社会', desc: '建立以技术为核心的新社会',
                costs: { tech: 35, culture: 20, population: 20 }, 
                effects: { tech: 40, culture: 25, population: 25, food: 18, military: 15 },
                synergy: { tech: 0.18, culture: 0.12 }
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
            },
            {
                key: 'ai_revolution', name: 'AI革命', desc: '推动人工智能技术突破',
                costs: { tech: 40, culture: 20, food: 15 }, effects: { tech: 55, population: 20, military: 18, environment: 10 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'biotechnology_boom', name: '生物技术爆发', desc: '生物技术获得重大突破',
                costs: { tech: 35, culture: 18, food: 20 }, effects: { population: 40, tech: 25, food: 25, environment: 15 },
                triggers: ['opportunity'], amplifies: ['population', 'food']
            },
            {
                key: 'quantum_computing', name: '量子计算', desc: '量子计算技术实现突破',
                costs: { tech: 45, culture: 25 }, effects: { tech: 60, military: 25, culture: 20 },
                triggers: ['opportunity'], amplifies: ['tech', 'military']
            },
            {
                key: 'virtual_culture', name: '虚拟文化', desc: '虚拟现实文化蓬勃发展',
                costs: { culture: 30, tech: 25, food: 12 }, effects: { culture: 45, population: 25, tech: 15 },
                triggers: ['opportunity'], amplifies: ['culture', 'population']
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
            },
            {
                key: 'privacy_protection', name: '隐私保护', desc: '建立数据隐私保护制度',
                costs: { culture: 20, tech: 18, military: 12 }, effects: { culture: 25, population: 18, tech: 15 },
                triggers: ['crisis'], counters: ['culture', 'population']
            },
            {
                key: 'ai_ethics', name: 'AI伦理', desc: '制定人工智能伦理规范',
                costs: { culture: 25, tech: 20 }, effects: { culture: 30, tech: 18, population: 15 },
                triggers: ['crisis'], counters: ['culture', 'tech']
            },
            {
                key: 'digital_resilience', name: '数字韧性', desc: '提高系统抗攻击能力',
                costs: { tech: 30, military: 20, food: 15 }, effects: { tech: 25, military: 25, population: 12 },
                triggers: ['crisis'], counters: ['tech', 'military']
            },
            {
                key: 'tech_addiction_cure', name: '技术成瘾治疗', desc: '应对技术成瘾问题',
                costs: { culture: 22, tech: 15, food: 12 }, effects: { population: 25, culture: 20, environment: 10 },
                triggers: ['crisis'], counters: ['population']
            },
            {
                key: 'information_warfare', name: '信息战防护', desc: '建立信息战防护体系',
                costs: { tech: 28, military: 25, culture: 15 }, effects: { military: 30, tech: 20, culture: 18 },
                triggers: ['crisis'], counters: ['military', 'culture']
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
            },
            {
                key: 'digital_military', name: '数字化军队', desc: '用信息技术改造军队',
                costs: { tech: 35, culture: 20 }, effects: { military: 40, tech: 15, population: -8 },
                converts: { from: 'tech', to: 'military', ratio: 1.14 }
            },
            {
                key: 'smart_agriculture', name: '智慧农业', desc: '用信息技术改造农业',
                costs: { tech: 28, population: 15 }, effects: { food: 40, environment: 20, tech: 8 },
                converts: { from: 'tech', to: 'food', ratio: 1.43 }
            },
            {
                key: 'population_optimization', name: '人口优化', desc: '用技术手段优化人口结构',
                costs: { tech: 30, culture: 20, food: 18 }, effects: { population: 35, military: 15, environment: 8 },
                converts: { from: 'tech', to: 'population', ratio: 1.17 }
            },
            {
                key: 'culture_digitization', name: '文化数字化', desc: '将传统文化数字化保存传播',
                costs: { culture: 25, tech: 20 }, effects: { tech: 30, culture: 20, population: 12 },
                converts: { from: 'culture', to: 'tech', ratio: 1.2 }
            },
            {
                key: 'green_technology', name: '绿色科技', desc: '发展环境友好型技术',
                costs: { tech: 32, culture: 18, food: 15 }, effects: { environment: 30, tech: 15, population: 10 },
                converts: { from: 'tech', to: 'environment', ratio: 0.94 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'space_program', name: '太空计划', desc: '发展载人航天技术',
                costs: { tech: 35, culture: 25, food: 20 }, effects: { military: 10 },
                investment: { turns: 6, returns: { tech: 20, culture: 15, environment: 10 } }
            },
            {
                key: 'fusion_reactor', name: '核聚变反应堆', desc: '建设清洁能源核聚变设施',
                costs: { tech: 45, population: 30, food: 25, military: 15 }, effects: { environment: 15 },
                investment: { turns: 8, returns: { tech: 30, environment: 25, food: 20, population: 15 } }
            },
            {
                key: 'neural_network', name: '神经网络', desc: '建立全球神经网络系统',
                costs: { tech: 40, culture: 30, population: 20 }, effects: { military: 12 },
                investment: { turns: 7, returns: { tech: 35, culture: 25, military: 20 } }
            },
            {
                key: 'space_elevator', name: '太空电梯', desc: '建造连接地球和太空的电梯',
                costs: { tech: 50, population: 35, food: 30, military: 20 }, effects: { culture: 18 },
                investment: { turns: 10, returns: { tech: 40, military: 25, culture: 20, environment: 15 } }
            },
            {
                key: 'global_brain', name: '全球大脑', desc: '建立人类集体智慧网络',
                costs: { tech: 38, culture: 32, population: 25 }, effects: { food: 15 },
                investment: { turns: 6, returns: { tech: 30, culture: 28, population: 20 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'information_society', name: '信息社会', desc: '建立以信息为核心的新社会形态',
                costs: { tech: 45, culture: 35, population: 30, food: 25 }, 
                effects: { tech: 50, culture: 40, population: 35, food: 20, military: 25, environment: 20 },
                synergy: { tech: 0.22, culture: 0.18, population: 0.15 }
            },
            {
                key: 'digital_renaissance', name: '数字文艺复兴', desc: '信息时代的文化艺术大繁荣',
                costs: { tech: 35, culture: 40, population: 25 }, 
                effects: { culture: 50, tech: 30, population: 30, food: 15, military: 15 },
                synergy: { culture: 0.25, tech: 0.15, population: 0.12 }
            },
            {
                key: 'technological_singularity', name: '技术奇点', desc: '人工智能超越人类智慧的历史时刻',
                costs: { tech: 50, culture: 30, military: 25, food: 20 }, 
                effects: { tech: 60, culture: 25, military: 30, population: 20, environment: 15 },
                synergy: { tech: 0.3, military: 0.2 }
            }
        ]
    },

    // === 星际文明阶段 (6) ===
    6: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'galactic_expansion', name: '银河扩张', desc: '向银河系各星系扩张',
                costs: { tech: 45, military: 35, food: 30 }, effects: { tech: 60, military: 45, culture: 35, population: 25 },
                triggers: ['opportunity'], amplifies: ['tech', 'military']
            },
            {
                key: 'stellar_engineering', name: '恒星工程', desc: '改造恒星系统',
                costs: { tech: 50, population: 35, environment: 25 }, effects: { tech: 70, environment: 40, food: 35, military: 20 },
                triggers: ['opportunity'], amplifies: ['tech', 'environment']
            },
            {
                key: 'cosmic_intelligence', name: '宇宙智慧', desc: '建立跨星系智慧网络',
                costs: { tech: 55, culture: 40, military: 25 }, effects: { tech: 75, culture: 50, military: 35, population: 30 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'dimensional_portal', name: '维度门户', desc: '开发多维空间技术',
                costs: { tech: 60, culture: 35, environment: 30 }, effects: { tech: 80, culture: 45, environment: 25, food: 20 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'galactic_federation', name: '银河联邦', desc: '建立跨星系政治联盟',
                costs: { culture: 45, military: 30, population: 25 }, effects: { culture: 55, military: 40, population: 35, tech: 25 },
                triggers: ['opportunity'], amplifies: ['culture', 'military']
            },
            {
                key: 'matter_replicator', name: '物质复制器', desc: '掌握原子级物质重组技术',
                costs: { tech: 50, food: 35, environment: 20 }, effects: { food: 55, tech: 35, population: 30, environment: 25 },
                triggers: ['opportunity'], amplifies: ['food', 'tech']
            },
            {
                key: 'time_manipulation', name: '时间操控', desc: '掌握时空扭曲技术',
                costs: { tech: 65, culture: 40, military: 30 }, effects: { tech: 85, culture: 35, military: 45, population: 20 },
                triggers: ['opportunity'], amplifies: ['tech', 'military']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'alien_diplomacy', name: '外星外交', desc: '与外星文明建立外交关系',
                costs: { culture: 35, military: 25, tech: 20 }, effects: { culture: 40, military: 20, tech: 25 },
                triggers: ['crisis'], counters: ['military', 'culture']
            },
            {
                key: 'cosmic_defense', name: '宇宙防御', desc: '建立星际防御体系',
                costs: { military: 40, tech: 35, population: 20 }, effects: { military: 50, tech: 30, population: 15 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'reality_stabilization', name: '现实稳定', desc: '修复时空异常和维度裂缝',
                costs: { tech: 45, culture: 30, environment: 25 }, effects: { tech: 35, environment: 35, culture: 25, population: 20 },
                triggers: ['crisis'], counters: ['environment', 'tech']
            },
            {
                key: 'consciousness_backup', name: '意识备份', desc: '建立意识保护和备份系统',
                costs: { tech: 40, culture: 35, population: 25 }, effects: { population: 40, tech: 30, culture: 25 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'quantum_shield', name: '量子护盾', desc: '建立量子级防护屏障',
                costs: { tech: 50, military: 35, environment: 20 }, effects: { military: 45, tech: 35, environment: 25 },
                triggers: ['crisis'], counters: ['military', 'tech']
            },
            {
                key: 'entropy_reversal', name: '熵逆转', desc: '逆转宇宙熵增过程',
                costs: { tech: 55, environment: 40, culture: 30 }, effects: { environment: 50, tech: 40, culture: 25, population: 15 },
                triggers: ['crisis'], counters: ['environment']
            },
            {
                key: 'galactic_peacekeeping', name: '银河维和', desc: '维护银河系和平秩序',
                costs: { military: 45, culture: 35, food: 25 }, effects: { culture: 40, military: 35, population: 30 },
                triggers: ['crisis'], counters: ['culture', 'military']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'star_harvesting', name: '恒星收割', desc: '从恒星中提取能量和物质',
                costs: { tech: 45, military: 30, population: 25 }, effects: { food: 50, environment: 35, tech: 20, population: -10 },
                converts: { from: 'tech', to: 'food', ratio: 1.11 }
            },
            {
                key: 'consciousness_synthesis', name: '意识合成', desc: '合成人工智慧生命',
                costs: { tech: 50, culture: 35, food: 25 }, effects: { population: 45, culture: 30, tech: 20 },
                converts: { from: 'tech', to: 'population', ratio: 0.9 }
            },
            {
                key: 'reality_engineering', name: '现实工程', desc: '重构物理法则和现实规则',
                costs: { tech: 55, culture: 40, environment: 30 }, effects: { environment: 50, culture: 35, tech: 25 },
                converts: { from: 'tech', to: 'environment', ratio: 0.91 }
            },
            {
                key: 'cosmic_military', name: '宇宙军队', desc: '建立跨维度军事力量',
                costs: { tech: 50, population: 35, food: 25 }, effects: { military: 55, tech: 30, population: 15 },
                converts: { from: 'tech', to: 'military', ratio: 1.1 }
            },
            {
                key: 'galactic_culture', name: '银河文化', desc: '传播跨星系文明价值观',
                costs: { culture: 40, tech: 30, population: 20 }, effects: { tech: 35, culture: 35, population: 25 },
                converts: { from: 'culture', to: 'tech', ratio: 0.88 }
            },
            {
                key: 'universe_gardening', name: '宇宙园艺', desc: '培育和改造整个星系生态',
                costs: { environment: 35, tech: 40, culture: 25 }, effects: { food: 45, environment: 30, population: 20 },
                converts: { from: 'environment', to: 'food', ratio: 1.29 }
            },
            {
                key: 'transcendence_protocol', name: '超越协议', desc: '将文明提升到更高维度',
                costs: { tech: 60, culture: 45, population: 35, military: 25 }, effects: { tech: 50, culture: 50, population: 40, military: 30, environment: 25 },
                converts: { from: 'tech', to: 'culture', ratio: 0.83 }
            }
        ],
        [ACTION_TYPES.INVEST]: [
            {
                key: 'universe_simulation', name: '宇宙模拟', desc: '创建完整的宇宙模拟系统',
                costs: { tech: 60, culture: 45, population: 35, military: 25 }, effects: { environment: 20 },
                investment: { turns: 12, returns: { tech: 50, culture: 40, population: 30, military: 25 } }
            },
            {
                key: 'multiverse_gate', name: '多元宇宙门', desc: '建造通往平行宇宙的门户',
                costs: { tech: 70, culture: 50, environment: 40, military: 30 }, effects: { food: 25 },
                investment: { turns: 15, returns: { tech: 60, culture: 45, environment: 35, military: 30, food: 25 } }
            },
            {
                key: 'cosmic_consciousness', name: '宇宙意识', desc: '建立与宇宙本身的意识连接',
                costs: { tech: 55, culture: 50, population: 40, environment: 30 }, effects: { military: 20 },
                investment: { turns: 10, returns: { culture: 50, tech: 40, population: 35, environment: 30 } }
            },
            {
                key: 'reality_anchor', name: '现实锚点', desc: '建立稳定多维空间的锚点系统',
                costs: { tech: 65, military: 45, environment: 35, food: 25 }, effects: { culture: 22 },
                investment: { turns: 14, returns: { tech: 55, military: 40, environment: 35, culture: 25 } }
            },
            {
                key: 'eternal_archive', name: '永恒档案', desc: '建立记录所有存在的永恒档案',
                costs: { tech: 50, culture: 55, population: 35, food: 30 }, effects: { environment: 18 },
                investment: { turns: 8, returns: { culture: 45, tech: 35, population: 30 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'cosmic_ascension', name: '宇宙飞升', desc: '文明达到宇宙级别的存在形态',
                costs: { tech: 70, culture: 60, population: 50, military: 40, food: 35, environment: 30 }, 
                effects: { tech: 80, culture: 70, population: 60, military: 50, food: 40, environment: 45 },
                synergy: { tech: 0.25, culture: 0.22, population: 0.18 }
            },
            {
                key: 'universal_harmony', name: '宇宙和谐', desc: '实现与整个宇宙的完美和谐共存',
                costs: { culture: 65, environment: 55, population: 45, food: 35 }, 
                effects: { culture: 75, environment: 65, population: 55, food: 45, tech: 30, military: 25 },
                synergy: { culture: 0.28, environment: 0.25, population: 0.2 }
            },
            {
                key: 'omnipotent_empire', name: '全能帝国', desc: '建立跨越多元宇宙的全能帝国',
                costs: { tech: 65, military: 55, culture: 45, population: 40 }, 
                effects: { military: 70, tech: 60, culture: 50, population: 45, food: 30, environment: 25 },
                synergy: { military: 0.3, tech: 0.25, culture: 0.18 }
            },
            {
                key: 'creation_matrix', name: '创世矩阵', desc: '掌握创造和毁灭宇宙的终极力量',
                costs: { tech: 75, culture: 55, environment: 50, military: 45, population: 40, food: 30 }, 
                effects: { tech: 90, culture: 65, environment: 60, military: 55, population: 50, food: 40 },
                synergy: { tech: 0.35, culture: 0.25, environment: 0.22 }
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
    
    // 4. Add synergy actions when multiple resources are balanced and abundant
    if (stageActions[ACTION_TYPES.SYNERGY] && isResourcesBalanced(resources, stage) && isResourcesAbundant(resources, stage)) {
        availableActions.push(...stageActions[ACTION_TYPES.SYNERGY]);
    }
    
    // 5. Add emergency actions if resources are critically low
    Object.keys(emergencyActions).forEach(emergencyType => {
        const actions = emergencyActions[emergencyType];
        actions.forEach(action => {
            if (meetsRequirement(action.requirement, resources)) {
                availableActions.push(action);
            }
        });
    });
    
    // 6. If we don't have enough actions, add basic actions from all categories
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
    
    // 7. Remove duplicates and unaffordable actions
    availableActions = removeDuplicates(availableActions);
    availableActions = availableActions.filter(action => canAffordAction(action, resources, stage));
    
    // 8. If still not enough actions, ensure we have at least some basic actions
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
    
    // 9. Select final actions with priority weighting
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

function isResourcesBalanced(resources, stage) {
    const getResourcesForStage = window.getResourcesForStage || (() => []);
    const stageResources = getResourcesForStage(stage);
    
    if (stageResources.length === 0) return false;
    
    let balancedCount = 0;
    stageResources.forEach(resourceConfig => {
        const currentValue = resources[resourceConfig.key] || 0;
        // Consider balanced if resource is above warning threshold but not critically low
        if (currentValue > resourceConfig.warning && currentValue <= resourceConfig.warning * 3) {
            balancedCount++;
        }
    });
    
    return balancedCount >= Math.floor(stageResources.length * 0.6); // At least 60% of resources are balanced
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
