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
            },
            {
                key: 'leadership_establishment', name: '建立领导', desc: '确立部落权威领导结构',
                costs: { food: 12, population: 5 }, effects: { order: 18, tech: 8, population: 6 },
                triggers: ['opportunity'], amplifies: ['order']
            },
            {
                key: 'ritual_order', name: '仪式秩序', desc: '通过宗教仪式强化社会秩序',
                costs: { food: 15 }, effects: { order: 20, population: 10, tech: 5 },
                triggers: ['opportunity'], amplifies: ['order', 'population']
            },
            {
                key: 'abundant_gathering', name: '丰收采集', desc: '趁机大量采集果实、种子和药材',
                costs: { population: 10 }, effects: { food: 30, tech: 8, environment: -3 },
                triggers: ['opportunity'], amplifies: ['food', 'tech']
            },
            {
                key: 'spiritual_awakening', name: '精神觉醒', desc: '利用良机进行精神启蒙，增强族群凝聚力',
                costs: { food: 8, population: 6 }, effects: { order: 25, population: 12, tech: 10 },
                triggers: ['opportunity'], amplifies: ['order', 'population']
            },
            {
                key: 'territory_expansion', name: '领地扩张', desc: '趁势扩大部落控制范围',
                costs: { population: 12, food: 10 }, effects: { environment: 18, population: 15, order: 8 },
                triggers: ['opportunity'], amplifies: ['environment', 'population']
            },
            {
                key: 'ancestral_wisdom', name: '祖先智慧', desc: '深挖祖先留下的知识宝藏',
                costs: { food: 12, order: 8 }, effects: { tech: 25, population: 8, order: 10 },
                triggers: ['opportunity'], amplifies: ['tech', 'order']
            },
            {
                key: 'seasonal_celebration', name: '季节庆典', desc: '举办盛大的季节庆祝活动',
                costs: { food: 18, population: 8 }, effects: { order: 30, population: 20, environment: 8 },
                triggers: ['opportunity'], amplifies: ['order', 'population']
            },
            {
                key: 'nature_symbiosis', name: '自然共生', desc: '建立与自然的深度共生关系',
                costs: { population: 8, order: 5 }, effects: { environment: 25, food: 15, tech: 12 },
                triggers: ['opportunity'], amplifies: ['environment', 'food']
            },
            {
                key: 'tribal_cooperation', name: '部落合作', desc: '与邻近部落建立合作关系',
                costs: { food: 15, order: 10 }, effects: { population: 25, tech: 15, environment: 5 },
                triggers: ['opportunity'], amplifies: ['population', 'tech']
            },
            {
                key: 'resource_abundance', name: '资源富集', desc: '充分利用丰富的自然资源',
                costs: { population: 15, environment: 8 }, effects: { food: 35, tech: 12, order: 8 },
                triggers: ['opportunity'], amplifies: ['food', 'tech']
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
            },
            {
                key: 'conflict_resolution', name: '冲突调解', desc: '通过长者调解化解部落内部冲突',
                costs: { food: 6, population: 3 }, effects: { order: 15, population: 8 },
                triggers: ['crisis'], counters: ['order']
            },
            {
                key: 'tradition_reinforcement', name: '传统强化', desc: '重申部落传统规范来维持秩序',
                costs: { food: 8 }, effects: { order: 12, tech: 5 },
                triggers: ['crisis'], counters: ['order']
            },
            {
                key: 'emergency_foraging', name: '紧急觅食', desc: '动员所有人手寻找应急食物',
                costs: { population: 5, environment: 8 }, effects: { food: 18, tech: 5 },
                triggers: ['crisis'], counters: ['food']
            },
            {
                key: 'shelter_reinforcement', name: '庇护加固', desc: '加固现有住所抵御恶劣天气',
                costs: { population: 8, tech: 5 }, effects: { environment: 15, population: 8, order: 5 },
                triggers: ['crisis'], counters: ['environment', 'population']
            },
            {
                key: 'healing_ritual', name: '治疗仪式', desc: '举行传统治疗仪式挽救生命',
                costs: { food: 10, order: 5 }, effects: { population: 15, tech: 8 },
                triggers: ['crisis'], counters: ['population']
            },
            {
                key: 'sacred_protection', name: '神圣守护', desc: '请求祖先灵魂保护部落度过危机',
                costs: { food: 12, tech: 6 }, effects: { order: 20, population: 10, environment: 8 },
                triggers: ['crisis'], counters: ['order', 'population']
            },
            {
                key: 'collective_defense', name: '集体防御', desc: '组织全族人手共同抵御威胁',
                costs: { food: 10, population: 5 }, effects: { population: 12, order: 15, tech: 8 },
                triggers: ['crisis'], counters: ['population', 'order']
            },
            {
                key: 'migration_preparation', name: '迁徙准备', desc: '准备必要时进行部落迁徙',
                costs: { order: 8, tech: 5 }, effects: { environment: 12, population: 8, food: 10 },
                triggers: ['crisis'], counters: ['environment', 'population']
            },
            {
                key: 'emergency_sharing', name: '紧急分享', desc: '实行严格的资源共享制度',
                costs: { order: 10 }, effects: { food: 12, population: 10, environment: 5 },
                triggers: ['crisis'], counters: ['food', 'population']
            },
            {
                key: 'crisis_leadership', name: '危机领导', desc: '临时建立强有力的危机应对领导',
                costs: { population: 6, food: 8 }, effects: { order: 18, tech: 10, population: 5 },
                triggers: ['crisis'], counters: ['order']
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
            },
            {
                key: 'social_organization', name: '社会组织', desc: '用技术知识建立部落组织秩序',
                costs: { tech: 10, food: 8 }, effects: { order: 18, population: 5 },
                converts: { from: 'tech', to: 'order', ratio: 1.8 }
            },
            {
                key: 'order_to_efficiency', name: '秩序效率', desc: '有序的组织提高生产效率',
                costs: { order: 8, population: 6 }, effects: { food: 15, tech: 8 },
                converts: { from: 'order', to: 'food', ratio: 1.9 }
            },
            {
                key: 'knowledge_preservation', name: '知识保存', desc: '将技术知识转化为可传承的形式',
                costs: { tech: 10, food: 8 }, effects: { order: 15, population: 8, tech: 5 },
                converts: { from: 'tech', to: 'order', ratio: 1.5 }
            },
            {
                key: 'resource_optimization', name: '资源优化', desc: '优化现有资源的使用效率',
                costs: { order: 8, tech: 6 }, effects: { food: 15, environment: 8, population: 5 },
                converts: { from: 'order', to: 'multiple', ratio: 1.2 }
            },
            {
                key: 'survival_specialization', name: '生存专化', desc: '让部分族人专门从事特定生存技能',
                costs: { population: 12, food: 10 }, effects: { tech: 18, environment: 12, order: 8 },
                converts: { from: 'population', to: 'tech', ratio: 1.5 }
            },
            {
                key: 'spiritual_energy', name: '精神力量', desc: '将精神信仰转化为实际行动力',
                costs: { order: 15, tech: 8 }, effects: { population: 20, food: 12 },
                converts: { from: 'order', to: 'population', ratio: 1.33 }
            },
            {
                key: 'natural_observation', name: '自然观察', desc: '观察自然现象获得实用知识',
                costs: { environment: 12, population: 8 }, effects: { tech: 16, food: 10, order: 6 },
                converts: { from: 'environment', to: 'tech', ratio: 1.33 }
            },
            {
                key: 'communal_labor', name: '集体劳动', desc: '组织集体劳动提高生产效率',
                costs: { order: 10, population: 6 }, effects: { food: 20, environment: 8 },
                converts: { from: 'order', to: 'food', ratio: 2 }
            },
            {
                key: 'environmental_adaptation', name: '环境适应', desc: '深度适应自然环境获得优势',
                costs: { environment: 10, tech: 8 }, effects: { population: 15, food: 12, order: 8 },
                converts: { from: 'environment', to: 'population', ratio: 1.5 }
            },
            {
                key: 'wisdom_application', name: '智慧应用', desc: '将积累的智慧转化为实际产出',
                costs: { tech: 12, order: 8 }, effects: { food: 18, population: 10, environment: 6 },
                converts: { from: 'tech', to: 'food', ratio: 1.5 }
            },
            {
                key: 'population_efficiency', name: '人力效率', desc: '提高现有人口的工作效率',
                costs: { population: 8, order: 10 }, effects: { food: 18, tech: 12, environment: 6 },
                converts: { from: 'population', to: 'multiple', ratio: 1.4 }
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
            },
            {
                key: 'hunting_grounds', name: '狩猎场建设', desc: '开发专门的狩猎区域',
                costs: { population: 10, environment: 8 }, effects: { food: 8 },
                investment: { turns: 3, returns: { food: 20, population: 6 } }
            },
            {
                key: 'water_source', name: '水源开发', desc: '挖掘和保护稳定的水源',
                costs: { population: 12, tech: 8 }, effects: { environment: 10 },
                investment: { turns: 4, returns: { population: 15, environment: 12, food: 10 } }
            },
            {
                key: 'shelter_complex', name: '居住群落', desc: '建设永久性的居住建筑群',
                costs: { population: 15, food: 12, tech: 10 }, effects: { order: 8 },
                investment: { turns: 5, returns: { population: 20, order: 15, environment: 8 } }
            },
            {
                key: 'spiritual_center', name: '精神中心', desc: '建立部落的宗教和仪式中心',
                costs: { food: 15, population: 8, order: 10 }, effects: { tech: 6 },
                investment: { turns: 4, returns: { order: 20, population: 12, tech: 10 } }
            },
            {
                key: 'food_cache', name: '食物储备', desc: '建立大型食物储存设施',
                costs: { population: 12, tech: 8, environment: 6 }, effects: { food: 10 },
                investment: { turns: 3, returns: { food: 25, population: 8 } }
            },
            {
                key: 'tribal_paths', name: '部落道路', desc: '开辟连接各地的道路网络',
                costs: { population: 18, food: 10 }, effects: { order: 6 },
                investment: { turns: 4, returns: { food: 15, order: 12, tech: 8 } }
            },
            {
                key: 'knowledge_stones', name: '知识石碑', desc: '在石头上刻录重要知识',
                costs: { tech: 15, population: 8, food: 10 }, effects: { order: 5 },
                investment: { turns: 3, returns: { tech: 18, order: 12 } }
            },
            {
                key: 'healing_garden', name: '草药园', desc: '培育各种药用植物',
                costs: { population: 10, environment: 6, food: 8 }, effects: { tech: 5 },
                investment: { turns: 4, returns: { population: 15, environment: 10, tech: 12 } }
            }
        ],
        [ACTION_TYPES.EMERGENCY]: [
            {
                key: 'last_resort_hunt', name: '绝地狩猎', desc: '动员所有战斗力进行危险但必要的狩猎',
                costs: { population: 15, environment: 10 }, effects: { food: 35, tech: 8 },
                emergency: true, triggers: ['food_critical']
            },
            {
                key: 'population_sacrifice', name: '人员牺牲', desc: '让一部分人承担风险为其他人争取生存机会',
                costs: { population: 20, order: 12 }, effects: { food: 25, environment: 15, tech: 10 },
                emergency: true, triggers: ['multiple_critical']
            },
            {
                key: 'environmental_exodus', name: '环境迁徙', desc: '被迫迁移到新的环境以求生存',
                costs: { population: 10, food: 15, order: 10 }, effects: { environment: 25, population: 5 },
                emergency: true, triggers: ['environment_critical']
            },
            {
                key: 'desperation_innovation', name: '绝望创新', desc: '在绝境中激发出前所未有的创新能力',
                costs: { population: 12, food: 20, environment: 8 }, effects: { tech: 30, order: 8 },
                emergency: true, triggers: ['tech_needed']
            },
            {
                key: 'survival_cannibalism', name: '极限求生', desc: '采用极端手段延续族群生存',
                costs: { population: 18, order: 20 }, effects: { food: 30, environment: -5 },
                emergency: true, triggers: ['food_critical', 'population_critical']
            },
            {
                key: 'order_revolution', name: '秩序重建', desc: '彻底重组社会结构以应对危机',
                costs: { population: 15, food: 12, tech: 10 }, effects: { order: 35, population: 8 },
                emergency: true, triggers: ['order_critical']
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'seasonal_cycle', name: '季节循环', desc: '遵循自然规律，平衡发展各方面',
                costs: { population: 10, food: 8, order: 5 }, 
                effects: { population: 8, food: 12, environment: 10, tech: 6, order: 8 },
                synergy: { population: 0.1, food: 0.12, environment: 0.08 }
            },
            {
                key: 'tribal_festival', name: '部落节庆', desc: '举办传统庆典，增强凝聚力',
                costs: { food: 15, order: 8 }, 
                effects: { population: 12, tech: 8, environment: 5, order: 15 },
                synergy: { population: 0.15, order: 0.18 }
            },
            {
                key: 'harmony_council', name: '和谐议会', desc: '建立部落议事制度，实现全面和谐发展',
                costs: { population: 12, food: 10, tech: 8, order: 6 }, 
                effects: { population: 15, food: 12, tech: 10, order: 20, environment: 8 },
                synergy: { order: 0.25, population: 0.12, tech: 0.1 }
            },
            {
                key: 'nature_unity', name: '自然融合', desc: '实现人与自然的完美和谐统一',
                costs: { population: 15, food: 12, environment: 10, tech: 8 }, 
                effects: { population: 20, food: 18, environment: 15, tech: 12, order: 10 },
                synergy: { environment: 0.2, population: 0.15, food: 0.12 }
            },
            {
                key: 'wisdom_circle', name: '智慧圆桌', desc: '集体决策产生超越个体的智慧',
                costs: { population: 18, tech: 12, order: 10 }, 
                effects: { tech: 25, order: 20, population: 12, food: 10 },
                synergy: { tech: 0.25, order: 0.2, population: 0.1 }
            },
            {
                key: 'abundance_sharing', name: '丰饶分享', desc: '通过分享实现所有资源的协调增长',
                costs: { food: 20, population: 12, order: 15, environment: 8 }, 
                effects: { food: 25, population: 18, order: 18, environment: 12, tech: 10 },
                synergy: { food: 0.15, population: 0.18, order: 0.12 }
            },
            {
                key: 'spiritual_ecology', name: '精神生态', desc: '将精神信仰与生态平衡相结合',
                costs: { order: 15, environment: 12, tech: 10, population: 8 }, 
                effects: { order: 22, environment: 18, tech: 15, population: 15, food: 12 },
                synergy: { order: 0.22, environment: 0.18, tech: 0.12 }
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
            },
            {
                key: 'institutional_development', name: '制度建设', desc: '趁势建立完善的村庄管理制度',
                costs: { food: 20, tech: 12 }, effects: { order: 25, culture: 15, population: 8 },
                triggers: ['opportunity'], amplifies: ['order', 'culture']
            },
            {
                key: 'social_hierarchy', name: '社会分层', desc: '建立基于农业财富的社会等级',
                costs: { food: 18, population: 10 }, effects: { order: 22, military: 12, culture: 10 },
                triggers: ['opportunity'], amplifies: ['order', 'military']
            },
            {
                key: 'irrigation_expansion', name: '灌溉扩建', desc: '大规模扩建灌溉系统',
                costs: { population: 18, tech: 12, military: 8 }, effects: { food: 40, environment: 15, population: 12 },
                triggers: ['opportunity'], amplifies: ['food', 'environment']
            },
            {
                key: 'tool_revolution', name: '工具革新', desc: '全面推广新农具和技术',
                costs: { tech: 15, food: 20, population: 12 }, effects: { tech: 35, food: 25, military: 10 },
                triggers: ['opportunity'], amplifies: ['tech', 'food']
            },
            {
                key: 'trade_network', name: '贸易网络', desc: '建立与其他村落的贸易关系',
                costs: { food: 25, military: 10, tech: 8 }, effects: { food: 30, culture: 20, population: 15, order: 12 },
                triggers: ['opportunity'], amplifies: ['food', 'culture']
            },
            {
                key: 'agricultural_festival', name: '农业庆典', desc: '举办丰收庆典提升士气',
                costs: { food: 30, order: 12 }, effects: { population: 30, culture: 25, order: 20, environment: 8 },
                triggers: ['opportunity'], amplifies: ['population', 'culture']
            },
            {
                key: 'warrior_training', name: '武士训练', desc: '建立专业武士阶层',
                costs: { food: 25, population: 15, tech: 10 }, effects: { military: 35, order: 18, culture: 12 },
                triggers: ['opportunity'], amplifies: ['military', 'order']
            },
            {
                key: 'knowledge_preservation', name: '知识记录', desc: '系统记录农业和手工业知识',
                costs: { tech: 18, food: 15, population: 10 }, effects: { tech: 40, culture: 20, order: 15 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'settlement_expansion', name: '聚落扩张', desc: '建立新的农业聚落',
                costs: { population: 25, food: 20, military: 12 }, effects: { population: 35, food: 30, environment: 10, order: 15 },
                triggers: ['opportunity'], amplifies: ['population', 'food']
            },
            {
                key: 'craft_specialization', name: '手工专业化', desc: '发展专业手工业者',
                costs: { population: 20, tech: 15, food: 18 }, effects: { tech: 30, culture: 25, food: 15, military: 10 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
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
            },
            {
                key: 'village_council', name: '村庄议会', desc: '建立村庄议事会解决纠纷',
                costs: { food: 15, population: 8 }, effects: { order: 20, culture: 12 },
                triggers: ['crisis'], counters: ['order']
            },
            {
                key: 'law_enforcement', name: '执法队伍', desc: '组建维护秩序的执法队伍',
                costs: { military: 8, food: 10 }, effects: { order: 18, military: 5 },
                triggers: ['crisis'], counters: ['order', 'military']
            },
            {
                key: 'conflict_mediation', name: '冲突调解', desc: '建立解决土地和财产纠纷的机制',
                costs: { culture: 10, food: 8 }, effects: { order: 15, population: 8 },
                triggers: ['crisis'], counters: ['order', 'population']
            },
            {
                key: 'emergency_granary', name: '紧急粮仓', desc: '快速建立应急粮食储备',
                costs: { population: 15, tech: 10, military: 8 }, effects: { food: 35, order: 12 },
                triggers: ['crisis'], counters: ['food', 'order']
            },
            {
                key: 'fortress_construction', name: '要塞建设', desc: '紧急建造防御要塞',
                costs: { population: 20, food: 18, tech: 12 }, effects: { military: 30, population: 10, order: 15 },
                triggers: ['crisis'], counters: ['military', 'population']
            },
            {
                key: 'water_management', name: '水利管理', desc: '建立完善的水利防护系统',
                costs: { population: 18, tech: 15, military: 10 }, effects: { environment: 25, food: 20, population: 8 },
                triggers: ['crisis'], counters: ['environment', 'food']
            },
            {
                key: 'medical_corps', name: '医疗队', desc: '组建专业医疗救护队伍',
                costs: { tech: 15, food: 12, culture: 8 }, effects: { population: 25, tech: 10, order: 12 },
                triggers: ['crisis'], counters: ['population', 'tech']
            },
            {
                key: 'cultural_unity', name: '文化团结', desc: '通过文化活动增强社会凝聚力',
                costs: { culture: 15, food: 20, population: 10 }, effects: { order: 30, population: 15, culture: 18 },
                triggers: ['crisis'], counters: ['order', 'population']
            },
            {
                key: 'technology_sharing', name: '技术共享', desc: '在村落间分享先进技术应对危机',
                costs: { tech: 20, food: 15, culture: 12 }, effects: { tech: 25, food: 18, military: 12, order: 10 },
                triggers: ['crisis'], counters: ['tech', 'food']
            },
            {
                key: 'environmental_restoration', name: '生态恢复', desc: '大规模恢复受损的生态环境',
                costs: { population: 25, tech: 18, food: 15 }, effects: { environment: 35, food: 25, population: 12 },
                triggers: ['crisis'], counters: ['environment', 'food']
            },
            {
                key: 'social_reform', name: '社会改革', desc: '改革社会制度以应对危机',
                costs: { culture: 20, order: 15, food: 18 }, effects: { order: 35, culture: 25, population: 15 },
                triggers: ['crisis'], counters: ['order', 'culture']
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
            },
            {
                key: 'culture_to_order', name: '礼仪制度', desc: '用文化传统建立社会秩序',
                costs: { culture: 15, food: 8 }, effects: { order: 22, population: 6 },
                converts: { from: 'culture', to: 'order', ratio: 1.47 }
            },
            {
                key: 'order_to_productivity', name: '有序生产', desc: '良好秩序提升生产效率',
                costs: { order: 12, population: 10 }, effects: { food: 20, tech: 8 },
                converts: { from: 'order', to: 'food', ratio: 1.67 }
            },
            {
                key: 'population_to_military', name: '征兵制度', desc: '将人口转化为军事力量',
                costs: { population: 15, food: 12 }, effects: { military: 20, order: 8 },
                converts: { from: 'population', to: 'military', ratio: 1.33 }
            },
            {
                key: 'food_to_culture', name: '富足文化', desc: '丰富的粮食促进文化发展',
                costs: { food: 25, population: 8 }, effects: { culture: 20, order: 12 },
                converts: { from: 'food', to: 'culture', ratio: 0.8 }
            },
            {
                key: 'military_to_order', name: '军事管理', desc: '用军事力量维护社会秩序',
                costs: { military: 18, food: 10 }, effects: { order: 25, population: 8 },
                converts: { from: 'military', to: 'order', ratio: 1.39 }
            },
            {
                key: 'tech_to_military', name: '武器制造', desc: '用技术制造更好的武器装备',
                costs: { tech: 20, population: 12, food: 15 }, effects: { military: 30, order: 10 },
                converts: { from: 'tech', to: 'military', ratio: 1.5 }
            },
            {
                key: 'culture_to_tech', name: '文化创新', desc: '文化发展推动技术进步',
                costs: { culture: 18, food: 12, population: 8 }, effects: { tech: 25, order: 10 },
                converts: { from: 'culture', to: 'tech', ratio: 1.39 }
            },
            {
                key: 'environment_to_culture', name: '自然美学', desc: '从自然环境中汲取文化灵感',
                costs: { environment: 15, population: 10 }, effects: { culture: 18, tech: 8, order: 6 },
                converts: { from: 'environment', to: 'culture', ratio: 1.2 }
            },
            {
                key: 'multi_resource_optimization', name: '综合优化', desc: '多资源协调转化获得最大效益',
                costs: { food: 15, tech: 12, military: 10 }, effects: { population: 20, culture: 15, order: 18, environment: 8 },
                converts: { from: 'multiple', to: 'multiple', ratio: 1.2 }
            },
            {
                key: 'military_to_order', name: '武力维序', desc: '用军事力量维护社会秩序',
                costs: { military: 10, food: 8 }, effects: { order: 18, population: -3 },
                converts: { from: 'military', to: 'order', ratio: 1.8 }
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
            },
            {
                key: 'blacksmith_forge', name: '铁匠铺', desc: '建立专业的金属加工设施',
                costs: { population: 12, tech: 15, food: 18 }, effects: { military: 8 },
                investment: { turns: 4, returns: { tech: 20, military: 15, culture: 8 } }
            },
            {
                key: 'road_network', name: '道路网络', desc: '连接各村落的交通网络',
                costs: { population: 25, food: 20, military: 12 }, effects: { order: 10 },
                investment: { turns: 5, returns: { food: 18, military: 12, order: 20, culture: 10 } }
            },
            {
                key: 'temple_complex', name: '神庙建筑群', desc: '建立宗教和文化中心',
                costs: { population: 20, food: 25, tech: 15, culture: 12 }, effects: { order: 15 },
                investment: { turns: 6, returns: { culture: 30, order: 25, population: 15, tech: 12 } }
            },
            {
                key: 'market_establishment', name: '集市建设', desc: '建立定期贸易集市',
                costs: { population: 15, food: 20, military: 8, order: 10 }, effects: { culture: 8 },
                investment: { turns: 3, returns: { food: 25, culture: 18, tech: 12, order: 15 } }
            },
            {
                key: 'defensive_walls', name: '防御城墙', desc: '环绕聚落的石制防御墙',
                costs: { population: 30, tech: 20, food: 25, military: 15 }, effects: { order: 12 },
                investment: { turns: 6, returns: { military: 35, population: 20, order: 25 } }
            },
            {
                key: 'school_system', name: '学校体系', desc: '建立正式的教育机构',
                costs: { culture: 20, food: 25, population: 18 }, effects: { tech: 12 },
                investment: { turns: 4, returns: { tech: 30, culture: 25, order: 18, population: 12 } }
            }
        ],
        [ACTION_TYPES.EMERGENCY]: [
            {
                key: 'scorched_earth', name: '焦土政策', desc: '破坏自己的资源防止敌人获得',
                costs: { food: 30, environment: 20, population: 15 }, effects: { military: 35, order: 12 },
                emergency: true, triggers: ['military_critical']
            },
            {
                key: 'mass_conscription', name: '全民征兵', desc: '征召所有能战斗的人员',
                costs: { population: 25, food: 20, order: 15 }, effects: { military: 40, culture: -10 },
                emergency: true, triggers: ['population_critical', 'military_critical']
            },
            {
                key: 'emergency_migration', name: '紧急迁徙', desc: '整个村落迁移到安全地区',
                costs: { food: 25, order: 20, military: 15 }, effects: { environment: 30, population: 18 },
                emergency: true, triggers: ['environment_critical']
            },
            {
                key: 'resource_cannibalization', name: '资源拆解', desc: '拆解现有设施获得紧急资源',
                costs: { tech: 20, culture: 15, order: 12 }, effects: { food: 35, population: 15, military: 20 },
                emergency: true, triggers: ['food_critical']
            },
            {
                key: 'revolutionary_government', name: '革命政府', desc: '推翻现有秩序建立新体制',
                costs: { culture: 25, population: 20, military: 15 }, effects: { order: 45, tech: 20 },
                emergency: true, triggers: ['order_critical']
            },
            {
                key: 'desperate_innovation', name: '绝望革新', desc: '在危机中强制推行技术创新',
                costs: { population: 20, food: 25, culture: 15 }, effects: { tech: 40, military: 15, order: 10 },
                emergency: true, triggers: ['tech_needed']
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'agricultural_revolution', name: '农业革命', desc: '全面革新农业生产方式',
                costs: { population: 20, tech: 15, food: 25, order: 12 }, 
                effects: { food: 30, tech: 15, military: 10, environment: -5, order: 18 },
                synergy: { food: 0.2, tech: 0.15, order: 0.18 }
            },
            {
                key: 'village_confederation', name: '村落联盟', desc: '建立村落间的合作网络',
                costs: { population: 15, food: 18, military: 10, order: 15 }, 
                effects: { population: 20, military: 15, tech: 10, order: 22 },
                synergy: { population: 0.1, military: 0.12, order: 0.2 }
            },
            {
                key: 'harvest_festival', name: '丰收庆典', desc: '庆祝丰收，加强社会凝聚力',
                costs: { food: 20, order: 10 }, 
                effects: { population: 15, tech: 8, military: 8, environment: 5, order: 18 },
                synergy: { population: 0.12, order: 0.15 }
            },
            {
                key: 'early_civilization', name: '早期文明', desc: '农业社会向城市文明的全面过渡',
                costs: { food: 30, tech: 20, military: 15, order: 20, culture: 12 }, 
                effects: { food: 25, tech: 25, military: 18, order: 30, culture: 20, population: 15 },
                synergy: { order: 0.25, tech: 0.18, culture: 0.15 }
            },
            {
                key: 'prosperity_cycle', name: '繁荣循环', desc: '建立各资源相互促进的良性循环',
                costs: { food: 25, tech: 18, military: 12, culture: 15, order: 20 }, 
                effects: { food: 30, tech: 22, military: 15, culture: 20, order: 25, population: 18 },
                synergy: { food: 0.15, tech: 0.12, culture: 0.18, order: 0.2 }
            },
            {
                key: 'agricultural_mastery', name: '农业精通', desc: '达到农业技术的巅峰水平',
                costs: { tech: 25, food: 35, environment: 15, population: 20 }, 
                effects: { tech: 30, food: 40, environment: 20, population: 25, culture: 15 },
                synergy: { tech: 0.2, food: 0.25, environment: 0.15 }
            },
            {
                key: 'social_harmony', name: '社会和谐', desc: '实现社会各阶层的和谐统一',
                costs: { culture: 20, order: 25, population: 18, food: 22 }, 
                effects: { culture: 28, order: 32, population: 25, food: 20, tech: 15, military: 12 },
                synergy: { culture: 0.22, order: 0.25, population: 0.18 }
            }
        ]
    },

    // === 城邦文明阶段 (2) ===
    2: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'trade_expansion', name: '贸易扩张', desc: '大力发展对外贸易',
                costs: { military: 8, culture: 12, order: 6 }, effects: { culture: 25, food: 20, tech: 10, order: 8 },
                triggers: ['opportunity'], amplifies: ['culture', 'tech']
            },
            {
                key: 'cultural_festival', name: '文化庆典', desc: '举办盛大的文化活动',
                costs: { food: 15, culture: 10, order: 5 }, effects: { culture: 30, population: 12, order: 10 },
                triggers: ['opportunity'], amplifies: ['culture']
            },
            {
                key: 'technological_breakthrough', name: '技术突破', desc: '推动科学技术飞跃发展',
                costs: { culture: 15, population: 12, order: 8 }, effects: { tech: 35, military: 10, food: 8, order: 12 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'military_conquest', name: '军事征服', desc: '发动对外征服获取资源',
                costs: { military: 15, population: 10, food: 12, order: 10 }, effects: { military: 20, population: 18, culture: 8, order: -5 },
                triggers: ['opportunity'], amplifies: ['military', 'population']
            },
            {
                key: 'urban_prosperity', name: '城市繁荣', desc: '推动城市全面发展',
                costs: { food: 18, tech: 10, order: 8 }, effects: { population: 25, culture: 15, military: 8, order: 15 },
                triggers: ['opportunity'], amplifies: ['population']
            },
            {
                key: 'merchant_guilds', name: '商人行会', desc: '建立强大的商业组织',
                costs: { culture: 20, order: 15, food: 12 }, effects: { culture: 35, tech: 18, food: 25, military: 10 },
                triggers: ['opportunity'], amplifies: ['culture', 'tech']
            },
            {
                key: 'architectural_marvels', name: '建筑奇迹', desc: '建造令人惊叹的城市建筑',
                costs: { tech: 25, population: 20, food: 18, culture: 15 }, effects: { culture: 40, order: 25, population: 15, tech: 20 },
                triggers: ['opportunity'], amplifies: ['culture', 'order']
            },
            {
                key: 'naval_dominance', name: '海上霸权', desc: '建立强大的海军力量',
                costs: { tech: 20, military: 18, food: 15, culture: 12 }, effects: { military: 35, culture: 20, food: 30, tech: 15 },
                triggers: ['opportunity'], amplifies: ['military', 'culture']
            },
            {
                key: 'philosophical_schools', name: '哲学学派', desc: '建立知识和智慧的学术中心',
                costs: { culture: 25, tech: 20, order: 15 }, effects: { culture: 45, tech: 30, order: 20, population: 12 },
                triggers: ['opportunity'], amplifies: ['culture', 'tech']
            },
            {
                key: 'diplomatic_alliances', name: '外交联盟', desc: '与其他城邦建立互利联盟',
                costs: { culture: 20, military: 15, order: 18 }, effects: { culture: 30, military: 25, food: 20, tech: 18, order: 22 },
                triggers: ['opportunity'], amplifies: ['culture', 'military']
            },
            {
                key: 'artisan_quarters', name: '工匠区', desc: '发展专业工匠社区',
                costs: { population: 18, culture: 15, tech: 12 }, effects: { tech: 35, culture: 25, military: 15, food: 18 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'religious_revival', name: '宗教复兴', desc: '推动宗教文化的复兴运动',
                costs: { culture: 22, order: 18, food: 15 }, effects: { culture: 40, order: 30, population: 20, tech: 15 },
                triggers: ['opportunity'], amplifies: ['culture', 'order']
            },
            {
                key: 'economic_boom', name: '经济繁荣', desc: '推动城市经济全面繁荣',
                costs: { tech: 18, culture: 15, military: 12, order: 10 }, effects: { food: 35, culture: 25, tech: 20, population: 25, military: 15 },
                triggers: ['opportunity'], amplifies: ['food', 'culture']
            },
            {
                key: 'military_academy', name: '军事学院', desc: '建立专业军事教育机构',
                costs: { military: 20, tech: 18, culture: 15, order: 12 }, effects: { military: 40, tech: 25, culture: 20, order: 18 },
                triggers: ['opportunity'], amplifies: ['military', 'tech']
            },
            {
                key: 'cultural_hegemony', name: '文化霸权', desc: '确立地区文化领导地位',
                costs: { culture: 30, order: 20, military: 15, tech: 18 }, effects: { culture: 50, order: 25, military: 20, tech: 22, population: 18 },
                triggers: ['opportunity'], amplifies: ['culture', 'order']
            },
            {
                key: 'technological_revolution', name: '技术革命', desc: '引领时代的技术变革',
                costs: { tech: 30, culture: 25, food: 20, population: 15 }, effects: { tech: 50, culture: 30, military: 25, food: 30, order: 20 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'artisan_guild', name: '工匠行会', desc: '建立专业工匠组织',
                costs: { population: 12, culture: 10, order: 6 }, effects: { tech: 20, culture: 15, food: 10, order: 12 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'bureaucratic_expansion', name: '官僚扩张', desc: '扩大行政管理体系',
                costs: { population: 15, tech: 12, culture: 10 }, effects: { order: 30, tech: 10, culture: 8 },
                triggers: ['opportunity'], amplifies: ['order']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'fortify_city', name: '加固城防', desc: '强化城市防御设施',
                costs: { population: 15, food: 12, tech: 8, order: 10 }, effects: { military: 25, culture: 5, order: 8 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'diplomatic_mission', name: '外交使团', desc: '派遣使者缓解外部压力',
                costs: { culture: 15, food: 10, order: 8 }, effects: { military: 8, culture: 12, order: 12 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'cultural_preservation', name: '文化保护', desc: '保护传统文化免受冲击',
                costs: { population: 10, tech: 8, order: 6 }, effects: { culture: 20, population: 8, order: 10 },
                triggers: ['crisis'], counters: ['culture']
            },
            {
                key: 'emergency_mobilization', name: '紧急动员', desc: '动员全城应对危机',
                costs: { culture: 12, food: 15, order: 12 }, effects: { population: 20, military: 15, order: -8 },
                triggers: ['crisis'], counters: ['population', 'military']
            },
            {
                key: 'knowledge_preservation', name: '知识保护', desc: '保护重要技术和知识',
                costs: { culture: 10, population: 8, order: 5 }, effects: { tech: 18, culture: 10, order: 8 },
                triggers: ['crisis'], counters: ['tech']
            },
            {
                key: 'resource_rationing', name: '资源配给', desc: '实施严格的资源分配制度',
                costs: { culture: 8, military: 5, order: 15 }, effects: { food: 15, population: 10, environment: 5, order: 10 },
                triggers: ['crisis'], counters: ['food', 'population']
            },
            {
                key: 'plague_quarantine', name: '瘟疫隔离', desc: '建立隔离制度控制疫病传播',
                costs: { tech: 10, military: 8, order: 12 }, effects: { population: 15, culture: -5, order: 15 },
                triggers: ['crisis'], counters: ['population']
            },
            {
                key: 'judicial_reform', name: '司法改革', desc: '完善法律制度维护秩序',
                costs: { tech: 12, culture: 10 }, effects: { order: 25, culture: 8, population: 5 },
                triggers: ['crisis'], counters: ['order']
            },
            {
                key: 'citizen_militia', name: '公民民兵', desc: '组织市民武装保卫城邦',
                costs: { population: 20, culture: 15, order: 12 }, effects: { military: 30, population: 10, order: 15 },
                triggers: ['crisis'], counters: ['military', 'population']
            },
            {
                key: 'cultural_revival', name: '文化复兴', desc: '通过文化复兴运动应对危机',
                costs: { tech: 15, food: 18, military: 10 }, effects: { culture: 35, order: 20, population: 15 },
                triggers: ['crisis'], counters: ['culture', 'order']
            },
            {
                key: 'technological_sanctuary', name: '技术庇护', desc: '保护和发展关键技术',
                costs: { culture: 20, military: 15, order: 18 }, effects: { tech: 35, culture: 15, order: 12 },
                triggers: ['crisis'], counters: ['tech', 'culture']
            },
            {
                key: 'urban_agriculture', name: '城市农业', desc: '在城市内部发展农业生产',
                costs: { population: 25, tech: 18, order: 15 }, effects: { food: 40, environment: 12, population: 18 },
                triggers: ['crisis'], counters: ['food', 'environment']
            },
            {
                key: 'democratic_assembly', name: '民主集会', desc: '建立民主决策机制化解危机',
                costs: { culture: 25, population: 20, tech: 15 }, effects: { order: 40, culture: 20, population: 15 },
                triggers: ['crisis'], counters: ['order', 'culture']
            },
            {
                key: 'alliance_network', name: '联盟网络', desc: '与其他城邦建立防御联盟',
                costs: { culture: 20, military: 18, food: 15, order: 12 }, effects: { military: 35, culture: 25, order: 20, tech: 15 },
                triggers: ['crisis'], counters: ['military', 'culture']
            },
            {
                key: 'economic_stabilization', name: '经济稳定', desc: '采取措施稳定城邦经济',
                costs: { tech: 20, culture: 18, military: 12 }, effects: { food: 35, population: 20, order: 25, culture: 15 },
                triggers: ['crisis'], counters: ['food', 'population']
            },
            {
                key: 'environmental_protection', name: '环境保护', desc: '实施环境保护措施',
                costs: { tech: 25, culture: 20, food: 15 }, effects: { environment: 40, population: 15, culture: 18, tech: 12 },
                triggers: ['crisis'], counters: ['environment', 'population']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'culture_to_tech', name: '学术研究', desc: '将文化资源投入技术研究',
                costs: { culture: 15, food: 8, order: 5 }, effects: { tech: 25, population: 3, order: 8 },
                converts: { from: 'culture', to: 'tech', ratio: 1.67 }
            },
            {
                key: 'military_to_culture', name: '和平发展', desc: '削减军费发展文化',
                costs: { military: 12, order: 6 }, effects: { culture: 20, tech: 8, order: 10 },
                converts: { from: 'military', to: 'culture', ratio: 1.67 }
            },
            {
                key: 'tech_to_military', name: '军事革新', desc: '用技术优势强化军力',
                costs: { tech: 12, food: 10, order: 8 }, effects: { military: 18, culture: 5, order: 5 },
                converts: { from: 'tech', to: 'military', ratio: 1.5 }
            },
            {
                key: 'population_to_culture', name: '文化教育', desc: '投入人力发展文化教育',
                costs: { population: 15, food: 12, order: 8 }, effects: { culture: 25, tech: 8, order: 12 },
                converts: { from: 'population', to: 'culture', ratio: 1.67 }
            },
            {
                key: 'food_to_population', name: '人口增长', desc: '用充足粮食支持人口增长',
                costs: { food: 20, culture: 8, order: 5 }, effects: { population: 25, military: 5, order: 8 },
                converts: { from: 'food', to: 'population', ratio: 1.25 }
            },
            {
                key: 'culture_to_military', name: '文化动员', desc: '用文化凝聚力增强军事力量',
                costs: { culture: 18, population: 10, order: 8 }, effects: { military: 22, tech: 5, order: -5 },
                converts: { from: 'culture', to: 'military', ratio: 1.22 }
            },
            {
                key: 'tech_to_food', name: '技术农业', desc: '运用技术大幅提升农业产量',
                costs: { tech: 15, population: 12, order: 6 }, effects: { food: 30, environment: -8, order: 5 },
                converts: { from: 'tech', to: 'food', ratio: 2 }
            },
            {
                key: 'order_to_military', name: '秩序动员', desc: '运用社会秩序组织军事力量',
                costs: { order: 20, population: 10 }, effects: { military: 28, order: 5 },
                converts: { from: 'order', to: 'military', ratio: 1.4 }
            },
            {
                key: 'culture_to_order', name: '文化规范', desc: '通过文化传统强化社会秩序',
                costs: { culture: 18, population: 8 }, effects: { order: 25, culture: 8 },
                converts: { from: 'culture', to: 'order', ratio: 1.39 }
            },
            {
                key: 'scholars_academy', name: '学者学院', desc: '将文化资源转化为技术研究',
                costs: { culture: 25, order: 15 }, effects: { tech: 35, culture: -15, population: 10 },
                converts: { from: 'culture', to: 'tech', ratio: 1.4 }
            },
            {
                key: 'warrior_engineers', name: '战士工程师', desc: '军事人员转为技术建设',
                costs: { military: 30, food: 20 }, effects: { tech: 40, military: -20, order: 15 },
                converts: { from: 'military', to: 'tech', ratio: 1.33 }
            },
            {
                key: 'agricultural_innovation', name: '农业创新', desc: '技术改进农业生产',
                costs: { tech: 20, culture: 18 }, effects: { food: 40, environment: 15, tech: -12, population: 12 },
                converts: { from: 'tech', to: 'food', ratio: 2.0 }
            },
            {
                key: 'population_mobilization', name: '人口动员', desc: '动员人口投入文化建设',
                costs: { population: 30, order: 20 }, effects: { culture: 35, military: 18, population: -15 },
                converts: { from: 'population', to: 'culture', ratio: 1.17 }
            },
            {
                key: 'cultural_military', name: '文化军事化', desc: '文化价值转化为军事力量',
                costs: { culture: 25, order: 20 }, effects: { military: 40, culture: -15, order: 15, population: 10 },
                converts: { from: 'culture', to: 'military', ratio: 1.6 }
            },
            {
                key: 'ecological_technology', name: '生态技术', desc: '环境保护转化为技术发展',
                costs: { environment: 30, culture: 18 }, effects: { tech: 35, culture: 15, environment: -12, food: 20 },
                converts: { from: 'environment', to: 'tech', ratio: 1.17 }
            },
            {
                key: 'military_agriculture', name: '军事农业', desc: '军事组织转向农业生产',
                costs: { military: 25, order: 15 }, effects: { food: 35, environment: 20, military: -15, population: 18 },
                converts: { from: 'military', to: 'food', ratio: 1.4 }
            },
            {
                key: 'institutional_culture', name: '制度文化', desc: '秩序制度促进文化发展',
                costs: { order: 25, tech: 18 }, effects: { culture: 40, order: -12, population: 15, tech: 10 },
                converts: { from: 'order', to: 'culture', ratio: 1.6 }
            },
            {
                key: 'food_surplus_military', name: '余粮军队', desc: '充足食物供应强化军事',
                costs: { food: 30, population: 20 }, effects: { military: 35, culture: 18, food: -18, order: 15 },
                converts: { from: 'food', to: 'military', ratio: 1.17 }
            },
            {
                key: 'demographic_order', name: '人口秩序', desc: '人口增长强化社会秩序',
                costs: { population: 25, culture: 20 }, effects: { order: 35, culture: 15, population: -10, tech: 12 },
                converts: { from: 'population', to: 'order', ratio: 1.4 }
            },
            {
                key: 'environmental_culture', name: '环境文化', desc: '环境意识转化为文化价值',
                costs: { environment: 25, tech: 15 }, effects: { culture: 35, order: 20, environment: -10, population: 15 },
                converts: { from: 'environment', to: 'culture', ratio: 1.4 }
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
            },
            {
                key: 'defensive_walls', name: '城墙建设', desc: '建造坚固的城市防御工事',
                costs: { military: 25, population: 30, tech: 20 }, effects: { order: 15 },
                investment: { turns: 6, returns: { military: 35, order: 25, population: 15 } }
            },
            {
                key: 'water_system', name: '供水系统', desc: '建设先进的城市供水网络',
                costs: { tech: 25, population: 20, culture: 15 }, effects: { environment: 10 },
                investment: { turns: 5, returns: { population: 30, environment: 20, food: 18 } }
            },
            {
                key: 'cultural_district', name: '文化区', desc: '建立集中的文化艺术区域',
                costs: { culture: 30, population: 25, food: 15 }, effects: { tech: 12 },
                investment: { turns: 4, returns: { culture: 40, population: 20, order: 15 } }
            },
            {
                key: 'military_academy', name: '军事学院', desc: '建立专业的军事训练机构',
                costs: { military: 20, culture: 25, tech: 18 }, effects: { population: 10 },
                investment: { turns: 5, returns: { military: 35, tech: 20, order: 18 } }
            },
            {
                key: 'agricultural_terraces', name: '农业梯田', desc: '开发山地农业种植系统',
                costs: { population: 35, tech: 15, environment: 20 }, effects: { culture: 8 },
                investment: { turns: 6, returns: { food: 40, environment: 25, population: 20 } }
            },
            {
                key: 'artisan_workshops', name: '工匠作坊', desc: '建立专业手工艺生产中心',
                costs: { culture: 22, tech: 18, population: 15 }, effects: { military: 5 },
                investment: { turns: 4, returns: { culture: 25, tech: 22, food: 15 } }
            },
            {
                key: 'temple_complex', name: '神庙群', desc: '建设宏伟的宗教建筑群',
                costs: { culture: 35, population: 25, food: 20 }, effects: { tech: 10 },
                investment: { turns: 7, returns: { culture: 45, order: 30, population: 25 } }
            },
            {
                key: 'harbor_development', name: '港口发展', desc: '扩建和完善港口设施',
                costs: { tech: 20, population: 30, military: 15 }, effects: { culture: 12 },
                investment: { turns: 5, returns: { food: 30, culture: 25, tech: 20 } }
            },
            {
                key: 'road_network', name: '道路网络', desc: '建设连接各地的道路系统',
                costs: { population: 40, tech: 25, military: 18 }, effects: { environment: -5 },
                investment: { turns: 6, returns: { culture: 30, military: 25, order: 20 } }
            },
            {
                key: 'granary_system', name: '粮仓体系', desc: '建立大规模粮食储存系统',
                costs: { tech: 22, population: 25, culture: 15 }, effects: { military: 8 },
                investment: { turns: 4, returns: { food: 35, order: 20, population: 18 } }
            },
            {
                key: 'observatory', name: '天文观测台', desc: '建设科学研究观测设施',
                costs: { tech: 30, culture: 20, population: 15 }, effects: { food: 5 },
                investment: { turns: 5, returns: { tech: 40, culture: 25, order: 15 } }
            }
        ],
        [ACTION_TYPES.EMERGENCY]: [
            {
                key: 'martial_law', name: '戒严令', desc: '实施紧急军事管制',
                costs: { military: 15, order: 20 }, effects: { military: 25, order: 15, population: -10, culture: -8 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'emergency_conscription', name: '紧急征兵', desc: '强制征召所有可用人员',
                costs: { population: 30, food: 15 }, effects: { military: 40, population: -15, order: -5 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'food_rationing', name: '粮食配给', desc: '实施严格的食物分配制度',
                costs: { order: 15, culture: 10 }, effects: { food: 25, population: 10, culture: -5 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'cultural_mobilization', name: '文化总动员', desc: '动员所有文化资源应对危机',
                costs: { culture: 25, population: 20 }, effects: { order: 30, military: 20, culture: -10 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'technological_rush', name: '技术突击', desc: '集中所有资源进行技术突破',
                costs: { culture: 20, population: 25, order: 15 }, effects: { tech: 35, culture: -10, population: -5 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'evacuation_protocol', name: '疏散协议', desc: '组织人口向安全区域转移',
                costs: { military: 20, order: 25 }, effects: { population: 15, environment: 10, military: -10 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'resource_requisition', name: '资源征收', desc: '强制征收所有可用物资',
                costs: { order: 25, military: 15 }, effects: { food: 20, tech: 15, military: 10, culture: -8, order: -5 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'environmental_sanctuary', name: '环境避难所', desc: '建立紧急环境保护区',
                costs: { tech: 20, population: 30 }, effects: { environment: 35, population: -10, food: 15 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'alliance_emergency', name: '联盟紧急求援', desc: '向盟友城邦紧急求助',
                costs: { culture: 25, military: 15, order: 10 }, effects: { food: 20, military: 25, tech: 15, culture: -5 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'citizen_sanctuary', name: '公民庇护', desc: '保护核心人口群体',
                costs: { food: 25, order: 20, tech: 15 }, effects: { population: 20, culture: 15, order: 10, food: -10 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'emergency_innovation', name: '紧急创新', desc: '在危机中推动技术创新',
                costs: { tech: 15, culture: 20, population: 15 }, effects: { tech: 30, military: 15, order: 10, culture: -8 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'social_cohesion', name: '社会凝聚', desc: '强化社会团结应对危机',
                costs: { culture: 30, order: 15 }, effects: { order: 35, population: 15, military: 12, culture: -10 },
                triggers: ['disaster'], urgency: 'high'
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'golden_age', name: '黄金时代', desc: '推动文明全面繁荣发展',
                costs: { population: 25, culture: 20, tech: 15, food: 20, order: 18 }, 
                effects: { population: 20, culture: 25, tech: 20, military: 15, food: 15, order: 25 },
                synergy: { all: 0.15, order: 0.2 }
            },
            {
                key: 'city_state_alliance', name: '城邦联盟', desc: '与其他城邦建立同盟关系',
                costs: { military: 15, culture: 18, food: 12, order: 15 }, 
                effects: { military: 20, culture: 15, tech: 12, population: 10, order: 20 },
                synergy: { military: 0.12, culture: 0.1, order: 0.15 }
            },
            {
                key: 'cultural_synthesis', name: '文化融合', desc: '融合不同文化创造新文明',
                costs: { culture: 22, population: 15, order: 12 }, 
                effects: { culture: 30, tech: 15, military: 10, food: 8, order: 18 },
                synergy: { culture: 0.18, tech: 0.1, order: 0.12 }
            },
            {
                key: 'civic_constitution', name: '公民宪法', desc: '制定完善的城邦法律体系',
                costs: { culture: 20, tech: 15, order: 25 }, 
                effects: { order: 40, culture: 15, tech: 12, population: 10 },
                synergy: { order: 0.25, culture: 0.1 }
            },
            {
                key: 'intellectual_renaissance', name: '智识复兴', desc: '推动知识、艺术、技术的全面复兴',
                costs: { culture: 25, tech: 20, population: 18, food: 15 }, 
                effects: { culture: 35, tech: 30, population: 15, order: 20 },
                synergy: { culture: 0.2, tech: 0.18, order: 0.1 }
            },
            {
                key: 'maritime_hegemony', name: '海上霸权', desc: '建立海上贸易和军事优势',
                costs: { military: 25, tech: 20, culture: 15, food: 18 }, 
                effects: { military: 30, culture: 25, food: 20, tech: 15 },
                synergy: { military: 0.15, culture: 0.12, food: 0.1 }
            },
            {
                key: 'democratic_innovation', name: '民主创新', desc: '创新政治制度和公民参与机制',
                costs: { culture: 30, order: 20, population: 15 }, 
                effects: { order: 35, culture: 25, population: 20, tech: 12 },
                synergy: { order: 0.2, culture: 0.15, population: 0.1 }
            },
            {
                key: 'economic_prosperity', name: '经济繁荣', desc: '实现全面的经济繁荣发展',
                costs: { tech: 20, culture: 18, population: 25, order: 15 }, 
                effects: { food: 35, culture: 20, population: 25, tech: 18 },
                synergy: { food: 0.18, population: 0.12, culture: 0.1 }
            },
            {
                key: 'cultural_hegemony', name: '文化霸权', desc: '建立区域文化影响力和软实力',
                costs: { culture: 35, population: 20, order: 18, tech: 15 }, 
                effects: { culture: 45, order: 25, population: 18, military: 15 },
                synergy: { culture: 0.25, order: 0.12, population: 0.08 }
            },
            {
                key: 'technological_breakthrough', name: '技术突破', desc: '实现重大技术创新和应用',
                costs: { tech: 30, culture: 25, population: 20, food: 15 }, 
                effects: { tech: 40, military: 20, environment: 15, order: 18 },
                synergy: { tech: 0.2, military: 0.1, environment: 0.08 }
            },
            {
                key: 'environmental_harmony', name: '环境和谐', desc: '实现人与自然的和谐发展',
                costs: { environment: 20, culture: 25, tech: 18, population: 15 }, 
                effects: { environment: 40, population: 25, food: 30, culture: 20 },
                synergy: { environment: 0.22, population: 0.12, food: 0.15 }
            }
        ]
    },

    // === 帝国时代阶段 (3) ===
    3: {
        [ACTION_TYPES.AMPLIFY]: [
            {
                key: 'imperial_expansion', name: '帝国扩张', desc: '大规模军事征服行动',
                costs: { military: 20, population: 15, food: 20, order: 15 }, 
                effects: { military: 30, population: 25, culture: 15, order: -10 },
                triggers: ['opportunity'], amplifies: ['military', 'population']
            },
            {
                key: 'cultural_hegemony', name: '文化霸权', desc: '推广帝国文化和价值观',
                costs: { culture: 25, food: 15, order: 12 }, 
                effects: { culture: 40, tech: 15, military: 10, order: 18 },
                triggers: ['opportunity'], amplifies: ['culture']
            },
            {
                key: 'technological_empire', name: '技术帝国', desc: '推动帝国范围内的技术革新',
                costs: { tech: 20, culture: 18, population: 15, order: 20 }, 
                effects: { tech: 45, military: 15, food: 20, order: 25 },
                triggers: ['opportunity'], amplifies: ['tech']
            },
            {
                key: 'imperial_bureaucracy', name: '帝国官僚', desc: '建立庞大的行政管理体系',
                costs: { population: 25, tech: 18, culture: 15 }, 
                effects: { order: 40, tech: 15, culture: 12, population: 10 },
                triggers: ['opportunity'], amplifies: ['order']
            },
            {
                key: 'provincial_system', name: '行省制度', desc: '建立统一的地方管理制度',
                costs: { military: 15, culture: 20, order: 18 }, 
                effects: { order: 35, military: 12, culture: 15, tech: 10 },
                triggers: ['opportunity'], amplifies: ['order', 'military']
            },
            {
                key: 'imperial_census', name: '帝国人口普查', desc: '大规模人口登记和管理',
                costs: { culture: 15, tech: 12, food: 18, order: 10 }, 
                effects: { population: 35, military: 12, culture: 10, order: 20 },
                triggers: ['opportunity'], amplifies: ['population']
            },
            {
                key: 'tribute_expansion', name: '贡赋扩张', desc: '扩大贡赋制度获取更多资源',
                costs: { military: 18, culture: 12, order: 8 }, 
                effects: { food: 40, tech: 12, culture: 15, order: 5 },
                triggers: ['opportunity'], amplifies: ['food']
            },
            {
                key: 'military_engineering', name: '军事工程', desc: '大规模军事建设项目',
                costs: { tech: 25, population: 20, military: 15 }, 
                effects: { military: 40, tech: 20, order: 25 },
                triggers: ['opportunity'], amplifies: ['military', 'tech']
            },
            {
                key: 'imperial_navy', name: '帝国海军', desc: '建立强大的海上力量',
                costs: { tech: 30, military: 25, food: 20 }, 
                effects: { military: 45, culture: 20, food: 15 },
                triggers: ['opportunity'], amplifies: ['military']
            },
            {
                key: 'grand_construction', name: '宏伟建设', desc: '建造标志性的帝国建筑',
                costs: { population: 35, tech: 25, culture: 20 }, 
                effects: { culture: 50, order: 30, tech: 15 },
                triggers: ['opportunity'], amplifies: ['culture', 'order']
            },
            {
                key: 'imperial_academy', name: '帝国学院', desc: '建立帝国最高学府',
                costs: { culture: 30, tech: 25, food: 20 }, 
                effects: { tech: 50, culture: 25, population: 15 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'territorial_consolidation', name: '领土整合', desc: '深化对新征服领土的控制',
                costs: { military: 25, order: 30, culture: 20 }, 
                effects: { order: 45, military: 20, population: 25 },
                triggers: ['opportunity'], amplifies: ['order', 'population']
            },
            {
                key: 'trade_empire', name: '贸易帝国', desc: '建立跨地区贸易网络',
                costs: { culture: 25, tech: 20, military: 15 }, 
                effects: { food: 45, culture: 25, tech: 20 },
                triggers: ['opportunity'], amplifies: ['food', 'culture']
            },
            {
                key: 'imperial_culture', name: '帝国文化', desc: '推广统一的帝国文化认同',
                costs: { culture: 35, population: 25, order: 20 }, 
                effects: { culture: 55, order: 25, population: 15 },
                triggers: ['opportunity'], amplifies: ['culture', 'order']
            },
            {
                key: 'resource_exploitation', name: '资源开发', desc: '大规模开发帝国境内资源',
                costs: { tech: 25, population: 30, military: 15 }, 
                effects: { food: 40, tech: 20, environment: -15 },
                triggers: ['opportunity'], amplifies: ['food', 'tech']
            },
            {
                key: 'imperial_roads', name: '帝国道路', desc: '建设连通帝国的道路网',
                costs: { tech: 20, population: 35, order: 25 }, 
                effects: { order: 35, military: 25, culture: 20 },
                triggers: ['opportunity'], amplifies: ['order', 'military']
            },
            {
                key: 'diplomatic_expansion', name: '外交扩张', desc: '通过外交手段扩大影响力',
                costs: { culture: 30, tech: 20, food: 25 }, 
                effects: { culture: 40, order: 30, military: 15 },
                triggers: ['opportunity'], amplifies: ['culture', 'order']
            },
            {
                key: 'population_mobilization', name: '人口总动员', desc: '全面动员帝国人力资源',
                costs: { food: 30, order: 25, culture: 20 }, 
                effects: { population: 50, military: 30, order: 15 },
                triggers: ['opportunity'], amplifies: ['population', 'military']
            }
        ],
        [ACTION_TYPES.COUNTER]: [
            {
                key: 'legion_defense', name: '军团防御', desc: '调动精锐军团抵御外敌',
                costs: { food: 25, military: 15, order: 12 }, effects: { military: 35, population: 10, order: 8 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'imperial_decree', name: '帝国法令', desc: '颁布紧急法令稳定局势',
                costs: { culture: 20, military: 10, order: 15 }, effects: { culture: 25, population: 15, military: 5, order: 20 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'border_fortification', name: '边境要塞', desc: '在边境建立防御工事',
                costs: { population: 20, tech: 15, food: 18, order: 10 }, effects: { military: 30, culture: 8, order: 12 },
                triggers: ['crisis'], counters: ['military']
            },
            {
                key: 'imperial_propaganda', name: '帝国宣传', desc: '加强意识形态控制',
                costs: { culture: 18, tech: 10, order: 12 }, effects: { culture: 25, population: 12, military: 8, order: 18 },
                triggers: ['crisis'], counters: ['culture', 'population']
            },
            {
                key: 'strategic_reserves', name: '战略储备', desc: '建立大规模资源储备',
                costs: { food: 30, tech: 12, military: 10, order: 15 }, effects: { food: 20, population: 15, military: 12, order: 10 },
                triggers: ['crisis'], counters: ['food', 'population']
            },
            {
                key: 'imperial_academy', name: '帝国学院', desc: '建立帝国级别的知识机构',
                costs: { culture: 22, population: 15, order: 10 }, effects: { tech: 30, culture: 15, military: 8, order: 15 },
                triggers: ['crisis'], counters: ['tech']
            },
            {
                key: 'provincial_autonomy', name: '行省自治', desc: '给予地方更多自主权',
                costs: { military: 12, culture: 15, order: 20 }, effects: { population: 20, culture: 18, food: 10, order: -8 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'imperial_justice', name: '帝国司法', desc: '建立统一的司法体系',
                costs: { tech: 18, culture: 15 }, effects: { order: 30, culture: 12, population: 8 },
                triggers: ['crisis'], counters: ['order']
            },
            {
                key: 'imperial_intelligence', name: '帝国情报', desc: '建立强大的情报网络',
                costs: { culture: 25, tech: 20, order: 15 }, effects: { military: 30, order: 25, culture: 15 },
                triggers: ['crisis'], counters: ['military', 'order']
            },
            {
                key: 'diplomatic_alliance', name: '外交联盟', desc: '与外国建立战略联盟',
                costs: { culture: 30, military: 20, food: 25 }, effects: { military: 40, culture: 20, tech: 15 },
                triggers: ['crisis'], counters: ['military', 'culture']
            },
            {
                key: 'imperial_reconstruction', name: '帝国重建', desc: '快速重建受损的基础设施',
                costs: { tech: 25, population: 30, food: 20 }, effects: { order: 35, population: 20, environment: 15 },
                triggers: ['crisis'], counters: ['order', 'population']
            },
            {
                key: 'emergency_taxation', name: '紧急税收', desc: '实施临时紧急税收政策',
                costs: { order: 20, culture: 15 }, effects: { food: 30, military: 20, order: -10, population: -5 },
                triggers: ['crisis'], counters: ['food', 'military']
            },
            {
                key: 'imperial_medical', name: '帝国医疗', desc: '建立帝国医疗救助体系',
                costs: { tech: 20, culture: 25, food: 15 }, effects: { population: 35, environment: 20, order: 15 },
                triggers: ['crisis'], counters: ['population', 'environment']
            },
            {
                key: 'cultural_unity', name: '文化统一', desc: '强化帝国文化认同',
                costs: { culture: 35, order: 25 }, effects: { culture: 30, order: 20, population: 15, military: 10 },
                triggers: ['crisis'], counters: ['culture', 'order']
            },
            {
                key: 'technological_defense', name: '技术防御', desc: '运用先进技术防御危机',
                costs: { tech: 30, military: 20, food: 15 }, effects: { tech: 25, military: 30, environment: 15 },
                triggers: ['crisis'], counters: ['tech', 'military']
            },
            {
                key: 'imperial_logistics', name: '帝国后勤', desc: '建立高效的资源调配系统',
                costs: { tech: 25, order: 20, population: 15 }, effects: { food: 35, military: 20, tech: 15 },
                triggers: ['crisis'], counters: ['food', 'military']
            },
            {
                key: 'environmental_protection', name: '环境保护', desc: '实施帝国环境保护政策',
                costs: { tech: 30, culture: 20, order: 25 }, effects: { environment: 40, population: 15, food: 20 },
                triggers: ['crisis'], counters: ['environment', 'population']
            },
            {
                key: 'imperial_treasury', name: '帝国国库', desc: '动用国家储备应对危机',
                costs: { order: 30, culture: 20 }, effects: { food: 30, military: 25, tech: 20, population: 15 },
                triggers: ['crisis'], counters: ['food', 'military']
            }
        ],
        [ACTION_TYPES.CONVERT]: [
            {
                key: 'tribute_system', name: '贡赋制度', desc: '建立贡赋体系获取资源',
                costs: { military: 15, culture: 10, order: 8 }, effects: { food: 30, tech: 10, order: 12 },
                converts: { from: 'military', to: 'food', ratio: 2 }
            },
            {
                key: 'imperial_bureaucracy', name: '帝国官僚', desc: '完善行政体系提升效率',
                costs: { culture: 20, food: 15, order: 10 }, effects: { tech: 25, military: 8, order: 18 },
                converts: { from: 'culture', to: 'tech', ratio: 1.25 }
            },
            {
                key: 'military_colonization', name: '军事殖民', desc: '派遣军队开拓新领土',
                costs: { military: 18, food: 20, order: 12 }, effects: { population: 30, culture: 10, environment: -8, order: -5 },
                converts: { from: 'military', to: 'population', ratio: 1.67 }
            },
            {
                key: 'imperial_taxation', name: '帝国税收', desc: '建立完善的税收体系',
                costs: { culture: 18, population: 12, order: 15 }, effects: { food: 25, tech: 15, military: 10, order: 8 },
                converts: { from: 'culture', to: 'food', ratio: 1.39 }
            },
            {
                key: 'tech_dissemination', name: '技术传播', desc: '在帝国内推广先进技术',
                costs: { tech: 20, culture: 15, order: 10 }, effects: { population: 25, food: 20, military: 12, order: 15 },
                converts: { from: 'tech', to: 'population', ratio: 1.25 }
            },
            {
                key: 'cultural_assimilation', name: '文化同化', desc: '将征服地区纳入帝国文化',
                costs: { population: 18, military: 15, order: 12 }, effects: { culture: 30, tech: 12, order: 20 },
                converts: { from: 'population', to: 'culture', ratio: 1.67 }
            },
            {
                key: 'order_to_military', name: '帝国征召', desc: '利用社会秩序大规模征兵',
                costs: { order: 25, population: 15 }, effects: { military: 35, order: 8 },
                converts: { from: 'order', to: 'military', ratio: 1.4 }
            },
            {
                key: 'military_to_order', name: '军事管制', desc: '用军事力量维护帝国秩序',
                costs: { military: 20, culture: 10 }, effects: { order: 30, military: 5 },
                converts: { from: 'military', to: 'order', ratio: 1.5 }
            },
            {
                key: 'imperial_workshops', name: '帝国工坊', desc: '技术转化为生产力',
                costs: { tech: 25, population: 20, order: 15 }, effects: { food: 40, military: 15, tech: -10 },
                converts: { from: 'tech', to: 'food', ratio: 1.6 }
            },
            {
                key: 'agricultural_slaves', name: '农业奴隶', desc: '人口转为农业劳动力',
                costs: { population: 30, military: 15, order: 20 }, effects: { food: 45, population: -15, order: 10 },
                converts: { from: 'population', to: 'food', ratio: 1.5 }
            },
            {
                key: 'imperial_scholars', name: '帝国学者', desc: '文化精英转为技术研究',
                costs: { culture: 30, food: 20, order: 15 }, effects: { tech: 45, culture: -18, population: 10 },
                converts: { from: 'culture', to: 'tech', ratio: 1.5 }
            },
            {
                key: 'veteran_settlement', name: '老兵定居', desc: '退役军人转为平民人口',
                costs: { military: 25, food: 20, culture: 15 }, effects: { population: 35, order: 20, military: -15 },
                converts: { from: 'military', to: 'population', ratio: 1.4 }
            },
            {
                key: 'environmental_restoration', name: '环境修复', desc: '技术投入环境保护',
                costs: { tech: 35, culture: 20, order: 15 }, effects: { environment: 50, food: 25, tech: -20 },
                converts: { from: 'tech', to: 'environment', ratio: 1.43 }
            },
            {
                key: 'cultural_military', name: '文化军事化', desc: '文化价值转化为军事力量',
                costs: { culture: 30, population: 20, order: 18 }, effects: { military: 45, culture: -18, order: 15 },
                converts: { from: 'culture', to: 'military', ratio: 1.5 }
            },
            {
                key: 'population_culture', name: '人口文化化', desc: '人口增长促进文化发展',
                costs: { population: 35, food: 25, order: 15 }, effects: { culture: 40, tech: 20, population: -20 },
                converts: { from: 'population', to: 'culture', ratio: 1.14 }
            },
            {
                key: 'order_infrastructure', name: '秩序基建', desc: '社会秩序转化为基础设施',
                costs: { order: 30, population: 25, culture: 15 }, effects: { tech: 35, food: 30, order: -15 },
                converts: { from: 'order', to: 'tech', ratio: 1.17 }
            },
            {
                key: 'food_expansion', name: '粮食扩张', desc: '充足食物支持人口增长',
                costs: { food: 40, tech: 15, culture: 20 }, effects: { population: 50, military: 20, food: -25 },
                converts: { from: 'food', to: 'population', ratio: 1.25 }
            },
            {
                key: 'environmental_culture', name: '环境文化', desc: '环境保护转化为文化价值',
                costs: { environment: 30, tech: 20, population: 15 }, effects: { culture: 40, order: 25, environment: -15 },
                converts: { from: 'environment', to: 'culture', ratio: 1.33 }
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
            },
            {
                key: 'imperial_palace', name: '帝国宫殿', desc: '建造象征帝国威严的宫殿群',
                costs: { culture: 40, population: 35, tech: 30, food: 25 }, effects: { military: 15 },
                investment: { turns: 8, returns: { culture: 50, order: 40, population: 25, tech: 20 } }
            },
            {
                key: 'aqueduct_system', name: '输水工程', desc: '建设帝国级别的供水系统',
                costs: { tech: 35, population: 40, military: 20 }, effects: { culture: 10 },
                investment: { turns: 6, returns: { population: 45, environment: 30, food: 35 } }
            },
            {
                key: 'imperial_mint', name: '帝国造币厂', desc: '建立标准化货币系统',
                costs: { tech: 25, culture: 30, military: 15, food: 20 }, effects: { population: 10 },
                investment: { turns: 5, returns: { culture: 35, food: 30, tech: 25, order: 20 } }
            },
            {
                key: 'strategic_fortresses', name: '战略要塞', desc: '在关键位置建设军事要塞',
                costs: { military: 35, tech: 25, population: 30, food: 25 }, effects: { culture: 8 },
                investment: { turns: 7, returns: { military: 50, order: 35, population: 20 } }
            },
            {
                key: 'imperial_observatory', name: '帝国天文台', desc: '建设大规模天文观测设施',
                costs: { tech: 40, culture: 30, population: 25 }, effects: { military: 10 },
                investment: { turns: 6, returns: { tech: 55, culture: 30, order: 25 } }
            },
            {
                key: 'provincial_capitals', name: '行省首府', desc: '在各行省建设管理中心',
                costs: { order: 30, population: 35, culture: 25, tech: 20 }, effects: { environment: 5 },
                investment: { turns: 6, returns: { order: 45, culture: 30, population: 25, military: 20 } }
            },
            {
                key: 'imperial_fleet', name: '帝国舰队', desc: '建造强大的海军舰队',
                costs: { military: 30, tech: 35, population: 25, food: 30 }, effects: { culture: 12 },
                investment: { turns: 7, returns: { military: 55, culture: 25, tech: 30, food: 20 } }
            },
            {
                key: 'cultural_monuments', name: '文化纪念碑', desc: '建设彰显帝国文化的纪念建筑',
                costs: { culture: 35, population: 30, tech: 25, food: 20 }, effects: { military: 8 },
                investment: { turns: 5, returns: { culture: 45, order: 30, population: 25 } }
            },
            {
                key: 'agricultural_estates', name: '农业庄园', desc: '建立大规模农业生产基地',
                costs: { population: 40, tech: 25, military: 20, culture: 15 }, effects: { order: 10 },
                investment: { turns: 6, returns: { food: 50, population: 30, environment: 20 } }
            },
            {
                key: 'imperial_archives', name: '帝国档案馆', desc: '建设知识保存和管理中心',
                costs: { culture: 30, tech: 35, population: 20, food: 15 }, effects: { military: 5 },
                investment: { turns: 5, returns: { tech: 40, culture: 35, order: 25 } }
            }
        ],
        [ACTION_TYPES.SYNERGY]: [
            {
                key: 'imperial_golden_age', name: '帝国盛世', desc: '帝国达到全面繁荣的巅峰',
                costs: { population: 35, culture: 30, tech: 25, military: 25, food: 30, order: 25 }, 
                effects: { population: 40, culture: 35, tech: 30, military: 30, food: 25, environment: 10, order: 35 },
                synergy: { all: 0.2, order: 0.25 }
            },
            {
                key: 'pax_imperia', name: '帝国和平', desc: '建立长久的帝国和平秩序',
                costs: { military: 25, culture: 25, food: 20, order: 30 }, 
                effects: { population: 30, culture: 25, tech: 20, food: 18, environment: 8, order: 40 },
                synergy: { population: 0.15, culture: 0.12, tech: 0.1, order: 0.3 }
            },
            {
                key: 'imperial_synthesis', name: '帝国融合', desc: '融合各民族文化创造新文明',
                costs: { culture: 28, population: 22, tech: 18, order: 20 }, 
                effects: { culture: 35, tech: 25, military: 20, population: 15, order: 25 },
                synergy: { culture: 0.18, tech: 0.15, order: 0.18 }
            },
            {
                key: 'imperial_codex', name: '帝国法典', desc: '制定统一的帝国法律体系',
                costs: { tech: 25, culture: 30, order: 35 }, 
                effects: { order: 50, culture: 20, tech: 15, population: 12 },
                synergy: { order: 0.35, culture: 0.15 }
            }
        ],
        [ACTION_TYPES.EMERGENCY]: [
            {
                key: 'imperial_mobilization', name: '帝国总动员', desc: '全帝国紧急战争动员',
                costs: { order: 25, culture: 20 }, effects: { military: 50, population: -10, culture: -15, order: -10 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'emergency_conscription', name: '紧急征兵', desc: '强制征召所有适龄人员',
                costs: { population: 40, food: 20 }, effects: { military: 60, population: -20, order: -8 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'imperial_rationing', name: '帝国配给', desc: '实施全国性资源配给制',
                costs: { order: 30, military: 15 }, effects: { food: 40, population: 15, culture: -10, order: -5 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'technological_requisition', name: '技术征收', desc: '强制征收所有技术资源',
                costs: { order: 25, military: 20 }, effects: { tech: 45, military: 25, culture: -12, order: -8 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'population_evacuation', name: '人口疏散', desc: '大规模人口疏散计划',
                costs: { military: 30, tech: 20, order: 25 }, effects: { population: 20, environment: 15, military: -15 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'imperial_treasury_raid', name: '国库动用', desc: '动用所有国家储备',
                costs: { order: 35, culture: 25 }, effects: { food: 35, military: 30, tech: 25, order: -15, culture: -10 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'cultural_preservation', name: '文化保护', desc: '紧急保护帝国文化遗产',
                costs: { tech: 25, military: 20, food: 15 }, effects: { culture: 40, order: 15, tech: -10 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'environmental_emergency', name: '环境紧急状态', desc: '宣布环境紧急状态',
                costs: { tech: 30, order: 25, population: 20 }, effects: { environment: 45, population: -10, food: 20 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'imperial_alliance_call', name: '帝国盟约', desc: '紧急召集所有盟友支援',
                costs: { culture: 35, military: 25, order: 20 }, effects: { military: 45, food: 30, tech: 20, culture: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'scorched_earth', name: '焦土政策', desc: '实施焦土战术阻止敌人',
                costs: { military: 20, order: 30 }, effects: { military: 25, environment: -25, food: -20, population: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'imperial_retreat', name: '帝国撤退', desc: '有序撤退保存核心力量',
                costs: { military: 25, order: 20, culture: 15 }, effects: { population: 15, tech: 20, military: 10, environment: 10 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'emergency_innovation', name: '紧急创新', desc: '危机中的技术突破',
                costs: { tech: 20, culture: 25, population: 20 }, effects: { tech: 40, military: 20, order: 15, culture: -10 },
                triggers: ['disaster'], urgency: 'critical'
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
            },
            {
                key: 'steam_revolution', name: '蒸汽革命', desc: '大规模应用蒸汽动力技术',
                costs: { tech: 35, population: 25, food: 20 }, effects: { tech: 50, population: 30, military: 20, environment: -20 },
                triggers: ['opportunity'], amplifies: ['tech', 'population']
            },
            {
                key: 'railway_expansion', name: '铁路扩张', desc: '建设覆盖全国的铁路网络',
                costs: { tech: 30, population: 35, military: 15 }, effects: { culture: 40, military: 25, food: 30, environment: -15 },
                triggers: ['opportunity'], amplifies: ['culture', 'military']
            },
            {
                key: 'industrial_cities', name: '工业城市', desc: '建设大型工业城市群',
                costs: { population: 40, tech: 25, food: 30 }, effects: { population: 60, tech: 35, culture: 25, environment: -25 },
                triggers: ['opportunity'], amplifies: ['population', 'tech']
            },
            {
                key: 'colonial_expansion', name: '殖民扩张', desc: '向海外扩张获取原料和市场',
                costs: { military: 30, tech: 25, culture: 20 }, effects: { food: 50, military: 40, culture: 30, environment: -10 },
                triggers: ['opportunity'], amplifies: ['food', 'military']
            },
            {
                key: 'education_reform', name: '教育改革', desc: '建立现代化教育体系',
                costs: { culture: 30, tech: 25, food: 20 }, effects: { culture: 45, tech: 30, population: 25 },
                triggers: ['opportunity'], amplifies: ['culture', 'tech']
            },
            {
                key: 'scientific_revolution', name: '科学革命', desc: '推动科学研究和技术创新',
                costs: { tech: 40, culture: 30, population: 20 }, effects: { tech: 60, culture: 25, military: 20 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'financial_capitalism', name: '金融资本主义', desc: '发展现代金融和银行体系',
                costs: { culture: 35, tech: 20, order: 25 }, effects: { food: 40, culture: 30, tech: 25, order: 20 },
                triggers: ['opportunity'], amplifies: ['food', 'culture']
            },
            {
                key: 'urban_planning', name: '城市规划', desc: '科学规划和建设现代城市',
                costs: { tech: 25, culture: 30, population: 25 }, effects: { population: 45, culture: 35, order: 30, environment: 10 },
                triggers: ['opportunity'], amplifies: ['population', 'culture']
            },
            {
                key: 'technological_innovation', name: '技术创新', desc: '推动各领域技术突破',
                costs: { tech: 35, culture: 25, food: 25 }, effects: { tech: 55, military: 25, culture: 20, order: 15 },
                triggers: ['opportunity'], amplifies: ['tech', 'military']
            },
            {
                key: 'mass_media', name: '大众传媒', desc: '发展报纸、电报等大众媒体',
                costs: { tech: 20, culture: 35, population: 15 }, effects: { culture: 50, order: 25, population: 20 },
                triggers: ['opportunity'], amplifies: ['culture', 'order']
            },
            {
                key: 'agricultural_revolution', name: '农业革命', desc: '用工业技术改造农业生产',
                costs: { tech: 30, population: 30, food: 20 }, effects: { food: 60, population: 35, tech: 20, environment: -15 },
                triggers: ['opportunity'], amplifies: ['food', 'population']
            },
            {
                key: 'international_trade', name: '国际贸易', desc: '建立全球贸易网络',
                costs: { military: 25, culture: 30, tech: 20 }, effects: { food: 45, culture: 40, tech: 25, military: 15 },
                triggers: ['opportunity'], amplifies: ['food', 'culture']
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
            },
            {
                key: 'industrial_safety', name: '工业安全', desc: '建立工业安全防护标准',
                costs: { tech: 25, culture: 20, order: 15 }, effects: { population: 30, tech: 15, order: 20 },
                triggers: ['crisis'], counters: ['population', 'tech']
            },
            {
                key: 'social_insurance', name: '社会保险', desc: '建立工人社会保障制度',
                costs: { culture: 30, order: 25, food: 20 }, effects: { population: 35, culture: 20, order: 25 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'public_health', name: '公共卫生', desc: '建立现代公共卫生体系',
                costs: { tech: 25, culture: 20, food: 25 }, effects: { population: 40, environment: 20, culture: 15 },
                triggers: ['crisis'], counters: ['population', 'environment']
            },
            {
                key: 'urban_infrastructure', name: '城市基础设施', desc: '改善城市供水、排污等基础设施',
                costs: { tech: 30, population: 25, food: 20 }, effects: { population: 35, environment: 25, order: 20 },
                triggers: ['crisis'], counters: ['population', 'environment']
            },
            {
                key: 'emergency_response', name: '紧急响应', desc: '建立工业事故应急响应体系',
                costs: { tech: 20, military: 25, culture: 15 }, effects: { population: 25, tech: 15, military: 20, order: 15 },
                triggers: ['crisis'], counters: ['population', 'tech']
            },
            {
                key: 'economic_regulation', name: '经济调节', desc: '政府干预调节经济危机',
                costs: { culture: 25, order: 30, military: 15 }, effects: { food: 30, culture: 20, order: 25, population: 15 },
                triggers: ['crisis'], counters: ['food', 'culture']
            },
            {
                key: 'technological_backup', name: '技术备份', desc: '建立技术故障备用系统',
                costs: { tech: 35, culture: 20, order: 20 }, effects: { tech: 30, population: 20, military: 15, order: 25 },
                triggers: ['crisis'], counters: ['tech', 'population']
            },
            {
                key: 'worker_education', name: '工人教育', desc: '提高工人技能和安全意识',
                costs: { culture: 30, tech: 20, food: 15 }, effects: { population: 30, culture: 25, tech: 20 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'environmental_restoration', name: '环境修复', desc: '治理工业污染和环境破坏',
                costs: { tech: 40, culture: 25, order: 20 }, effects: { environment: 45, population: 20, culture: 15 },
                triggers: ['crisis'], counters: ['environment', 'population']
            },
            {
                key: 'international_cooperation', name: '国际合作', desc: '通过国际合作应对危机',
                costs: { culture: 35, military: 20, food: 25 }, effects: { culture: 30, military: 25, tech: 20, food: 15 },
                triggers: ['crisis'], counters: ['culture', 'military']
            },
            {
                key: 'crisis_management', name: '危机管理', desc: '建立专业危机管理机构',
                costs: { order: 30, culture: 25, tech: 20 }, effects: { order: 40, population: 20, culture: 15, tech: 15 },
                triggers: ['crisis'], counters: ['order', 'population']
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
            },
            {
                key: 'resource_industrialization', name: '资源工业化', desc: '将自然资源转化为工业原料',
                costs: { environment: 30, tech: 20, population: 15 }, effects: { food: 40, tech: 25, environment: -20 },
                converts: { from: 'environment', to: 'food', ratio: 1.33 }
            },
            {
                key: 'scientific_military', name: '科学军事化', desc: '科学技术转化为军事优势',
                costs: { tech: 30, culture: 20, order: 15 }, effects: { military: 45, tech: -15, order: 20 },
                converts: { from: 'tech', to: 'military', ratio: 1.5 }
            },
            {
                key: 'industrial_culture', name: '工业文化', desc: '工业成就转化为文化自信',
                costs: { tech: 25, population: 20, food: 15 }, effects: { culture: 40, order: 25, tech: -10 },
                converts: { from: 'tech', to: 'culture', ratio: 1.6 }
            },
            {
                key: 'food_industrialization', name: '食品工业化', desc: '农业产品工业化加工',
                costs: { food: 35, tech: 20, population: 15 }, effects: { tech: 30, culture: 20, food: -20 },
                converts: { from: 'food', to: 'tech', ratio: 0.86 }
            },
            {
                key: 'cultural_education', name: '文化教育', desc: '文化价值转化为人才培养',
                costs: { culture: 30, food: 20, order: 15 }, effects: { population: 40, tech: 25, culture: -15 },
                converts: { from: 'culture', to: 'population', ratio: 1.33 }
            },
            {
                key: 'military_infrastructure', name: '军事基础设施', desc: '军事建设促进基础设施发展',
                costs: { military: 25, tech: 20, order: 15 }, effects: { food: 35, culture: 20, military: -15 },
                converts: { from: 'military', to: 'food', ratio: 1.4 }
            },
            {
                key: 'order_efficiency', name: '秩序效率', desc: '社会秩序转化为生产效率',
                costs: { order: 30, culture: 20, population: 15 }, effects: { tech: 35, food: 25, order: -15 },
                converts: { from: 'order', to: 'tech', ratio: 1.17 }
            },
            {
                key: 'technological_environment', name: '技术环保', desc: '技术投入环境保护',
                costs: { tech: 40, culture: 25, order: 20 }, effects: { environment: 50, population: 20, tech: -25 },
                converts: { from: 'tech', to: 'environment', ratio: 1.25 }
            },
            {
                key: 'industrial_order', name: '工业秩序', desc: '工业组织转化为社会秩序',
                costs: { tech: 25, population: 30, culture: 20 }, effects: { order: 40, military: 20, tech: -15 },
                converts: { from: 'tech', to: 'order', ratio: 1.6 }
            },
            {
                key: 'population_culture', name: '人口文化化', desc: '人口素质提升促进文化发展',
                costs: { population: 35, food: 25, tech: 20 }, effects: { culture: 45, order: 25, population: -20 },
                converts: { from: 'population', to: 'culture', ratio: 1.29 }
            },
            {
                key: 'environmental_agriculture', name: '生态农业', desc: '环境保护转化为可持续农业',
                costs: { environment: 25, tech: 30, culture: 20 }, effects: { food: 45, population: 20, environment: -10 },
                converts: { from: 'environment', to: 'food', ratio: 1.8 }
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
            },
            {
                key: 'industrial_complex', name: '工业综合体', desc: '建设大型工业生产综合体',
                costs: { tech: 40, population: 35, food: 30, military: 20 }, effects: { culture: 15 },
                investment: { turns: 8, returns: { tech: 35, population: 30, food: 25, military: 20 } }
            },
            {
                key: 'transport_revolution', name: '交通革命', desc: '建设现代化交通运输网络',
                costs: { tech: 35, population: 30, culture: 25, food: 25 }, effects: { military: 12 },
                investment: { turns: 6, returns: { culture: 30, food: 25, tech: 20, population: 20 } }
            },
            {
                key: 'urban_expansion', name: '城市扩建', desc: '大规模城市建设和扩展',
                costs: { population: 40, tech: 30, food: 35, culture: 20 }, effects: { environment: -10 },
                investment: { turns: 7, returns: { population: 50, culture: 35, tech: 25, order: 25 } }
            },
            {
                key: 'mining_industry', name: '采矿工业', desc: '建立现代化采矿工业体系',
                costs: { tech: 30, population: 35, military: 20, environment: 25 }, effects: { culture: 10 },
                investment: { turns: 6, returns: { tech: 25, food: 30, military: 25, environment: -15 } }
            },
            {
                key: 'chemical_industry', name: '化工产业', desc: '发展现代化学工业',
                costs: { tech: 35, population: 25, food: 20, environment: 20 }, effects: { military: 15 },
                investment: { turns: 5, returns: { tech: 30, military: 25, food: 20, environment: -10 } }
            },
            {
                key: 'textile_industry', name: '纺织工业', desc: '建立大规模纺织生产体系',
                costs: { population: 30, tech: 25, culture: 20, food: 25 }, effects: { environment: -5 },
                investment: { turns: 4, returns: { culture: 30, population: 25, food: 20, tech: 15 } }
            },
            {
                key: 'shipbuilding_industry', name: '造船工业', desc: '发展现代造船工业',
                costs: { tech: 30, military: 25, population: 25, food: 20 }, effects: { culture: 12 },
                investment: { turns: 6, returns: { military: 35, tech: 25, culture: 20, food: 15 } }
            },
            {
                key: 'banking_system', name: '银行体系', desc: '建立现代金融银行体系',
                costs: { culture: 35, tech: 25, order: 30, food: 20 }, effects: { population: 10 },
                investment: { turns: 5, returns: { culture: 30, order: 25, tech: 20, food: 25 } }
            },
            {
                key: 'public_works', name: '公共工程', desc: '大规模公共基础设施建设',
                costs: { population: 40, tech: 30, order: 25, food: 30 }, effects: { culture: 15 },
                investment: { turns: 7, returns: { population: 35, order: 30, culture: 25, environment: 15 } }
            },
            {
                key: 'technical_schools', name: '技术学校', desc: '建立职业技术教育体系',
                costs: { culture: 30, tech: 25, population: 20, food: 20 }, effects: { military: 8 },
                investment: { turns: 5, returns: { tech: 30, culture: 25, population: 25 } }
            },
            {
                key: 'industrial_parks', name: '工业园区', desc: '建设现代化工业园区',
                costs: { tech: 35, population: 30, culture: 25, environment: 20 }, effects: { order: 15 },
                investment: { turns: 6, returns: { tech: 40, population: 25, culture: 20, food: 20 } }
            }
        ],
        [ACTION_TYPES.EMERGENCY]: [
            {
                key: 'industrial_mobilization', name: '工业总动员', desc: '全面动员工业生产力',
                costs: { order: 30, culture: 25 }, effects: { tech: 50, military: 40, population: -15, environment: -20 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'emergency_production', name: '紧急生产', desc: '紧急大规模生产必需品',
                costs: { tech: 25, population: 30 }, effects: { food: 50, military: 30, tech: -15, environment: -25 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'workforce_conscription', name: '劳动力征召', desc: '强制征召所有可用劳动力',
                costs: { population: 35, order: 25 }, effects: { tech: 40, food: 35, population: -20, culture: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'resource_rationing', name: '资源配给', desc: '实施严格的资源配给制度',
                costs: { order: 35, military: 20 }, effects: { food: 40, tech: 25, culture: -10, order: -15 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'emergency_infrastructure', name: '应急基础设施', desc: '快速建设应急基础设施',
                costs: { tech: 30, population: 35, military: 20 }, effects: { population: 25, tech: 20, environment: 15 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'industrial_conversion', name: '工业转换', desc: '将民用工业转为军用生产',
                costs: { tech: 25, culture: 20, order: 25 }, effects: { military: 50, tech: 20, culture: -15, food: -10 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'emergency_evacuation', name: '紧急疏散', desc: '大规模人口疏散行动',
                costs: { military: 30, tech: 20, order: 30 }, effects: { population: 20, environment: 20, military: -15 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'technology_requisition', name: '技术征收', desc: '政府征收所有技术资源',
                costs: { order: 40, military: 25 }, effects: { tech: 60, military: 30, culture: -20, order: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'environmental_sacrifice', name: '环境牺牲', desc: '暂时放弃环保集中解决危机',
                costs: { order: 25, culture: 30 }, effects: { tech: 35, food: 40, military: 25, environment: -40 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'social_discipline', name: '社会纪律', desc: '实施严格的社会管制',
                costs: { military: 25, order: 35 }, effects: { order: 30, tech: 25, population: 20, culture: -20 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'international_aid', name: '国际援助', desc: '请求国际社会紧急援助',
                costs: { culture: 40, military: 20, order: 25 }, effects: { food: 35, tech: 30, military: 20, culture: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'emergency_innovation', name: '紧急创新', desc: '在危机中推动技术突破',
                costs: { tech: 30, culture: 25, population: 25 }, effects: { tech: 50, military: 25, order: 20, culture: -10 },
                triggers: ['disaster'], urgency: 'critical'
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
            },
            {
                key: 'industrial_renaissance', name: '工业复兴', desc: '工业革命带来全面复兴',
                costs: { tech: 30, culture: 30, food: 25, population: 25 }, 
                effects: { tech: 35, culture: 35, food: 30, population: 30, military: 20, order: 25 },
                synergy: { tech: 0.12, culture: 0.15, food: 0.1, population: 0.12 }
            },
            {
                key: 'steam_age_prosperity', name: '蒸汽时代繁荣', desc: '蒸汽技术带来空前繁荣',
                costs: { tech: 35, food: 30, population: 20, military: 15 }, 
                effects: { tech: 40, food: 35, population: 25, military: 20, culture: 18, environment: -8 },
                synergy: { tech: 0.14, food: 0.12, population: 0.1 }
            },
            {
                key: 'industrial_diplomacy', name: '工业外交', desc: '以工业实力开展国际外交',
                costs: { tech: 25, culture: 35, military: 20, order: 25 }, 
                effects: { culture: 40, military: 25, order: 30, tech: 20, food: 20, population: 15 },
                synergy: { culture: 0.16, military: 0.1, order: 0.12 }
            },
            {
                key: 'transportation_revolution', name: '交通革命', desc: '交通技术彻底改变社会',
                costs: { tech: 30, population: 25, food: 25, culture: 20 }, 
                effects: { tech: 35, population: 30, food: 30, culture: 25, military: 15, order: 20 },
                synergy: { tech: 0.12, population: 0.12, food: 0.1, culture: 0.1 }
            },
            {
                key: 'manufacturing_mastery', name: '制造业精通', desc: '制造业技术达到巅峰',
                costs: { tech: 40, population: 30, food: 20, environment: 15 }, 
                effects: { tech: 45, population: 35, food: 25, military: 25, culture: 20, environment: -10 },
                synergy: { tech: 0.15, population: 0.12, military: 0.08 }
            },
            {
                key: 'urban_civilization', name: '城市文明', desc: '工业化催生现代城市文明',
                costs: { population: 35, culture: 30, tech: 25, order: 20 }, 
                effects: { population: 40, culture: 35, tech: 30, order: 25, food: 20, military: 15 },
                synergy: { population: 0.14, culture: 0.15, tech: 0.1, order: 0.1 }
            },
            {
                key: 'scientific_method', name: '科学方法', desc: '科学方法系统化应用',
                costs: { tech: 35, culture: 25, population: 20, food: 20 }, 
                effects: { tech: 45, culture: 30, population: 25, food: 25, military: 18, environment: 10 },
                synergy: { tech: 0.18, culture: 0.12, population: 0.08 }
            },
            {
                key: 'energy_mastery', name: '能源掌控', desc: '完全掌控蒸汽和电力能源',
                costs: { tech: 40, environment: 25, population: 25, food: 20 }, 
                effects: { tech: 50, population: 30, food: 25, military: 20, culture: 15, environment: -15 },
                synergy: { tech: 0.2, population: 0.1, food: 0.08 }
            },
            {
                key: 'global_trade_network', name: '全球贸易网络', desc: '建立覆盖全球的贸易体系',
                costs: { culture: 35, military: 25, tech: 25, food: 25 }, 
                effects: { culture: 40, military: 30, tech: 30, food: 30, population: 20, order: 15 },
                synergy: { culture: 0.15, military: 0.1, tech: 0.1, food: 0.1 }
            },
            {
                key: 'industrial_education', name: '工业教育', desc: '建立适应工业时代的教育体系',
                costs: { culture: 30, tech: 25, population: 30, food: 20 }, 
                effects: { culture: 35, tech: 35, population: 35, food: 25, military: 15, order: 20 },
                synergy: { culture: 0.12, tech: 0.14, population: 0.12 }
            },
            {
                key: 'mechanical_precision', name: '机械精密', desc: '机械制造达到精密化水平',
                costs: { tech: 35, population: 25, culture: 20, military: 15 }, 
                effects: { tech: 45, population: 30, culture: 25, military: 25, food: 20, order: 15 },
                synergy: { tech: 0.16, population: 0.1, culture: 0.08, military: 0.1 }
            },
            {
                key: 'industrial_harmony', name: '工业和谐', desc: '工业发展与社会和谐并存',
                costs: { tech: 25, culture: 35, population: 25, order: 30 }, 
                effects: { tech: 30, culture: 40, population: 30, order: 35, food: 25, environment: 15 },
                synergy: { culture: 0.15, population: 0.1, order: 0.12, environment: 0.05 }
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
            },
            {
                key: 'internet_economy', name: '互联网经济', desc: '网络经济模式快速发展',
                costs: { tech: 30, culture: 20, population: 15 }, effects: { culture: 35, tech: 25, food: 30, order: 20 },
                triggers: ['opportunity'], amplifies: ['culture', 'food']
            },
            {
                key: 'space_technology', name: '太空技术', desc: '航天技术突飞猛进',
                costs: { tech: 40, military: 25, food: 20 }, effects: { tech: 50, military: 35, culture: 20, environment: 15 },
                triggers: ['opportunity'], amplifies: ['tech', 'military']
            },
            {
                key: 'genetic_engineering', name: '基因工程', desc: '基因技术革命性突破',
                costs: { tech: 35, culture: 20, population: 20 }, effects: { population: 45, tech: 30, food: 25, environment: 20 },
                triggers: ['opportunity'], amplifies: ['population', 'tech']
            },
            {
                key: 'nanotechnology', name: '纳米技术', desc: '纳米科技全面应用',
                costs: { tech: 40, culture: 25, environment: 15 }, effects: { tech: 55, military: 30, environment: 25, population: 15 },
                triggers: ['opportunity'], amplifies: ['tech', 'environment']
            },
            {
                key: 'renewable_energy', name: '可再生能源', desc: '清洁能源技术大规模应用',
                costs: { tech: 35, environment: 30, culture: 20 }, effects: { environment: 50, tech: 30, population: 25, culture: 15 },
                triggers: ['opportunity'], amplifies: ['environment', 'tech']
            },
            {
                key: 'digital_governance', name: '数字治理', desc: '政府数字化管理革命',
                costs: { tech: 30, order: 25, culture: 20 }, effects: { order: 40, tech: 25, culture: 20, population: 15 },
                triggers: ['opportunity'], amplifies: ['order', 'tech']
            },
            {
                key: 'smart_cities', name: '智慧城市', desc: '城市智能化全面建设',
                costs: { tech: 35, population: 30, order: 20 }, effects: { population: 40, tech: 30, order: 25, environment: 20 },
                triggers: ['opportunity'], amplifies: ['population', 'tech']
            },
            {
                key: 'automated_production', name: '自动化生产', desc: '生产过程全面自动化',
                costs: { tech: 40, population: 25, food: 20 }, effects: { tech: 45, food: 40, population: 20, military: 15 },
                triggers: ['opportunity'], amplifies: ['tech', 'food']
            },
            {
                key: 'global_communication', name: '全球通信', desc: '即时全球通信网络建立',
                costs: { tech: 30, culture: 25, military: 15 }, effects: { culture: 40, tech: 25, military: 25, order: 20 },
                triggers: ['opportunity'], amplifies: ['culture', 'military']
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
            },
            {
                key: 'information_regulation', name: '信息监管', desc: '建立信息内容监管体系',
                costs: { order: 25, culture: 20, military: 15 }, effects: { order: 30, culture: 18, population: 15 },
                triggers: ['crisis'], counters: ['order', 'culture']
            },
            {
                key: 'digital_literacy', name: '数字素养', desc: '全民数字技能教育',
                costs: { culture: 30, tech: 20, food: 15 }, effects: { culture: 35, population: 25, tech: 15 },
                triggers: ['crisis'], counters: ['culture', 'population']
            },
            {
                key: 'cyber_crime_prevention', name: '网络犯罪防范', desc: '打击网络犯罪活动',
                costs: { military: 25, tech: 20, order: 18 }, effects: { military: 30, order: 25, culture: 15 },
                triggers: ['crisis'], counters: ['military', 'order']
            },
            {
                key: 'algorithm_transparency', name: '算法透明', desc: '要求算法决策过程透明化',
                costs: { culture: 25, tech: 22, order: 15 }, effects: { culture: 30, tech: 18, population: 20 },
                triggers: ['crisis'], counters: ['culture', 'tech']
            },
            {
                key: 'data_sovereignty', name: '数据主权', desc: '保护国家数据安全',
                costs: { military: 30, tech: 25, order: 20 }, effects: { military: 35, order: 30, tech: 20 },
                triggers: ['crisis'], counters: ['military', 'order']
            },
            {
                key: 'tech_monopoly_break', name: '技术垄断打破', desc: '打破科技巨头垄断',
                costs: { order: 35, culture: 25, military: 20 }, effects: { order: 30, culture: 25, population: 25, tech: 15 },
                triggers: ['crisis'], counters: ['order', 'culture']
            },
            {
                key: 'digital_mental_health', name: '数字心理健康', desc: '应对数字时代心理问题',
                costs: { culture: 30, population: 25, tech: 15 }, effects: { population: 35, culture: 25, environment: 15 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'automation_unemployment', name: '自动化失业', desc: '解决自动化导致的失业',
                costs: { culture: 35, food: 30, order: 20 }, effects: { population: 30, culture: 25, food: 20 },
                triggers: ['crisis'], counters: ['population', 'culture']
            },
            {
                key: 'environmental_monitoring', name: '环境监控', desc: '技术手段监控环境变化',
                costs: { tech: 25, environment: 20, culture: 15 }, effects: { environment: 30, tech: 20, population: 15 },
                triggers: ['crisis'], counters: ['environment', 'tech']
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
            },
            {
                key: 'bioeconomy', name: '生物经济', desc: '生物技术转化为经济资源',
                costs: { tech: 30, population: 25, culture: 15 }, effects: { food: 40, environment: 20, tech: -10 },
                converts: { from: 'tech', to: 'food', ratio: 1.33 }
            },
            {
                key: 'cultural_ai', name: '文化AI', desc: '人工智能创造文化内容',
                costs: { tech: 35, culture: 20, population: 15 }, effects: { culture: 45, order: 20, tech: -15 },
                converts: { from: 'tech', to: 'culture', ratio: 1.29 }
            },
            {
                key: 'social_networks', name: '社交网络', desc: '网络平台增强社会联系',
                costs: { tech: 25, culture: 30, food: 15 }, effects: { population: 35, order: 25, tech: -10 },
                converts: { from: 'culture', to: 'population', ratio: 1.17 }
            },
            {
                key: 'digital_governance_system', name: '数字治理系统', desc: '技术手段提升政府效率',
                costs: { tech: 30, order: 25, culture: 20 }, effects: { order: 40, military: 20, tech: -15 },
                converts: { from: 'tech', to: 'order', ratio: 1.33 }
            },
            {
                key: 'virtual_military', name: '虚拟军事', desc: '网络空间军事能力',
                costs: { tech: 35, military: 20, order: 15 }, effects: { military: 50, culture: 15, tech: -20 },
                converts: { from: 'tech', to: 'military', ratio: 1.43 }
            },
            {
                key: 'eco_restoration_tech', name: '生态修复技术', desc: '技术手段修复环境',
                costs: { tech: 40, environment: 15, culture: 20 }, effects: { environment: 60, population: 20, tech: -25 },
                converts: { from: 'tech', to: 'environment', ratio: 1.5 }
            },
            {
                key: 'knowledge_economy', name: '知识经济', desc: '知识转化为生产力',
                costs: { culture: 35, tech: 25, population: 20 }, effects: { tech: 45, food: 25, culture: -20 },
                converts: { from: 'culture', to: 'tech', ratio: 1.29 }
            },
            {
                key: 'digital_healthcare', name: '数字医疗', desc: '信息技术革新医疗服务',
                costs: { tech: 30, culture: 25, food: 20 }, effects: { population: 45, environment: 15, tech: -15 },
                converts: { from: 'tech', to: 'population', ratio: 1.5 }
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
            },
            {
                key: 'quantum_internet', name: '量子互联网', desc: '建设量子通信网络',
                costs: { tech: 45, culture: 25, military: 20, food: 18 }, effects: { order: 15 },
                investment: { turns: 8, returns: { tech: 40, military: 30, culture: 20, order: 25 } }
            },
            {
                key: 'artificial_biosphere', name: '人工生物圈', desc: '建设封闭生态系统',
                costs: { tech: 40, environment: 35, population: 30, food: 25 }, effects: { culture: 20 },
                investment: { turns: 9, returns: { environment: 45, population: 35, food: 30, tech: 25 } }
            },
            {
                key: 'digital_twin_earth', name: '数字孪生地球', desc: '建立地球的完整数字模型',
                costs: { tech: 50, culture: 30, population: 25, environment: 20 }, effects: { military: 18 },
                investment: { turns: 10, returns: { tech: 45, culture: 25, environment: 30, military: 25 } }
            },
            {
                key: 'brain_computer_interface', name: '脑机接口', desc: '开发人脑与计算机直连技术',
                costs: { tech: 42, culture: 35, population: 30, food: 20 }, effects: { environment: 10 },
                investment: { turns: 7, returns: { tech: 40, population: 35, culture: 30 } }
            },
            {
                key: 'molecular_assembler', name: '分子组装器', desc: '开发原子级精确制造技术',
                costs: { tech: 48, population: 25, food: 30, military: 20 }, effects: { culture: 15 },
                investment: { turns: 9, returns: { tech: 45, food: 35, military: 30, population: 20 } }
            },
            {
                key: 'global_climate_control', name: '全球气候控制', desc: '建设全球气候调节系统',
                costs: { tech: 45, environment: 40, population: 35, culture: 25 }, effects: { military: 12 },
                investment: { turns: 12, returns: { environment: 50, tech: 35, population: 30, culture: 20 } }
            },
            {
                key: 'virtual_reality_world', name: '虚拟现实世界', desc: '建设完整的虚拟世界系统',
                costs: { tech: 40, culture: 40, population: 30, food: 25 }, effects: { order: 18 },
                investment: { turns: 8, returns: { culture: 45, tech: 35, population: 30, order: 25 } }
            },
            {
                key: 'space_colonies', name: '太空殖民地', desc: '建设可持续的太空居住设施',
                costs: { tech: 50, population: 40, food: 35, military: 25 }, effects: { environment: 20 },
                investment: { turns: 12, returns: { population: 45, tech: 40, military: 30, environment: 25 } }
            },
            {
                key: 'artificial_general_intelligence', name: '通用人工智能', desc: '开发具有人类智能的AI系统',
                costs: { tech: 55, culture: 30, population: 25, food: 20 }, effects: { military: 20 },
                investment: { turns: 10, returns: { tech: 60, culture: 25, military: 35, population: 20 } }
            },
            {
                key: 'global_sensor_network', name: '全球传感网络', desc: '建设覆盖全球的智能传感器网络',
                costs: { tech: 35, military: 25, environment: 20, population: 20 }, effects: { culture: 12 },
                investment: { turns: 6, returns: { tech: 30, military: 30, environment: 25, culture: 15 } }
            },
            {
                key: 'bioengineering_labs', name: '生物工程实验室', desc: '建设先进的生物技术研发设施',
                costs: { tech: 40, culture: 30, population: 35, food: 25 }, effects: { order: 15 },
                investment: { turns: 7, returns: { tech: 35, population: 40, food: 30, culture: 25 } }
            }
        ],
        [ACTION_TYPES.EMERGENCY]: [
            {
                key: 'cyber_warfare_defense', name: '网络战防御', desc: '应对大规模网络攻击',
                costs: { tech: 40, military: 35, order: 25 }, effects: { military: 50, tech: 30, order: 20, culture: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'ai_containment', name: 'AI控制', desc: '防止人工智能失控',
                costs: { tech: 45, culture: 30, military: 25 }, effects: { tech: 40, order: 35, military: 20, population: -10 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'digital_blackout_recovery', name: '数字断电恢复', desc: '从全球网络瘫痪中恢复',
                costs: { tech: 40, population: 35, military: 30 }, effects: { tech: 45, population: 30, food: 25, culture: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'bio_plague_response', name: '生物瘟疫应对', desc: '应对生物技术造成的疫情',
                costs: { tech: 35, culture: 30, population: 40 }, effects: { population: 35, tech: 30, environment: 20, food: -20 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'climate_emergency', name: '气候紧急状态', desc: '应对极端气候变化',
                costs: { tech: 35, environment: 30, culture: 25 }, effects: { environment: 40, population: 25, tech: 20, food: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'space_debris_cleanup', name: '太空垃圾清理', desc: '清理威胁太空设施的垃圾',
                costs: { tech: 30, military: 25, food: 20 }, effects: { tech: 25, military: 20, environment: 30, culture: 15 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'genetic_contamination', name: '基因污染控制', desc: '控制基因工程造成的污染',
                costs: { tech: 40, environment: 35, culture: 25 }, effects: { environment: 45, population: 20, tech: 15, food: -10 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'quantum_instability', name: '量子不稳定', desc: '修复量子技术造成的空间扭曲',
                costs: { tech: 50, culture: 30, military: 25 }, effects: { tech: 45, environment: 25, population: 20, order: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'neural_link_virus', name: '神经链接病毒', desc: '清除脑机接口中的恶意程序',
                costs: { tech: 35, culture: 35, population: 30 }, effects: { tech: 30, population: 35, culture: 25, military: -10 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'virtual_reality_collapse', name: '虚拟现实崩溃', desc: '从虚拟世界系统崩溃中恢复',
                costs: { tech: 30, culture: 40, population: 25 }, effects: { culture: 35, population: 30, tech: 25, order: -15 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'orbital_facility_emergency', name: '轨道设施紧急', desc: '抢救失控的太空设施',
                costs: { tech: 35, military: 30, population: 25 }, effects: { tech: 30, military: 25, population: 20, environment: 15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'information_warfare', name: '信息战争', desc: '应对大规模信息操作攻击',
                costs: { culture: 40, military: 30, order: 25 }, effects: { culture: 35, military: 35, order: 30, tech: -10 },
                triggers: ['disaster'], urgency: 'critical'
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
            },
            {
                key: 'cyber_physical_fusion', name: '赛博物理融合', desc: '数字世界与物理世界完全融合',
                costs: { tech: 40, culture: 30, population: 35, environment: 25 }, 
                effects: { tech: 45, culture: 35, population: 40, environment: 30, military: 20, order: 25 },
                synergy: { tech: 0.18, culture: 0.15, population: 0.14, environment: 0.12 }
            },
            {
                key: 'global_consciousness', name: '全球意识', desc: '人类集体意识网络的形成',
                costs: { tech: 35, culture: 45, population: 40, order: 25 }, 
                effects: { culture: 50, population: 45, order: 35, tech: 30, military: 15, environment: 20 },
                synergy: { culture: 0.22, population: 0.18, order: 0.15 }
            },
            {
                key: 'quantum_civilization', name: '量子文明', desc: '基于量子技术的全新文明形态',
                costs: { tech: 50, military: 30, culture: 25, population: 30 }, 
                effects: { tech: 60, military: 40, culture: 30, population: 35, food: 25, environment: 20 },
                synergy: { tech: 0.25, military: 0.18, culture: 0.1, population: 0.12 }
            },
            {
                key: 'bio_digital_synthesis', name: '生物数字合成', desc: '生物技术与数字技术的完美结合',
                costs: { tech: 40, population: 35, culture: 30, environment: 30 }, 
                effects: { tech: 45, population: 45, culture: 35, environment: 40, food: 30, military: 20 },
                synergy: { tech: 0.15, population: 0.2, culture: 0.12, environment: 0.15 }
            },
            {
                key: 'stellar_preparation', name: '星际准备', desc: '为进入星际时代做全面准备',
                costs: { tech: 45, military: 35, culture: 30, population: 35 }, 
                effects: { tech: 50, military: 45, culture: 35, population: 40, food: 25, environment: 20 },
                synergy: { tech: 0.2, military: 0.18, culture: 0.12, population: 0.15 }
            },
            {
                key: 'post_human_society', name: '后人类社会', desc: '超越传统人类局限的新社会形态',
                costs: { tech: 50, culture: 40, population: 30, order: 35 }, 
                effects: { tech: 55, culture: 45, population: 40, order: 40, military: 25, environment: 25 },
                synergy: { tech: 0.22, culture: 0.2, population: 0.15, order: 0.16 }
            },
            {
                key: 'information_transcendence', name: '信息超越', desc: '彻底超越物质限制的信息存在',
                costs: { tech: 55, culture: 35, population: 25, military: 30 }, 
                effects: { tech: 65, culture: 40, military: 35, population: 30, order: 30, environment: 15 },
                synergy: { tech: 0.28, culture: 0.18, military: 0.15 }
            },
            {
                key: 'virtual_immortality', name: '虚拟永生', desc: '通过数字技术实现意识永生',
                costs: { tech: 45, culture: 40, population: 40, order: 30 }, 
                effects: { culture: 50, population: 50, tech: 40, order: 35, military: 20, environment: 15 },
                synergy: { culture: 0.25, population: 0.25, tech: 0.15, order: 0.12 }
            },
            {
                key: 'network_civilization', name: '网络文明', desc: '完全基于信息网络的文明形态',
                costs: { tech: 40, culture: 35, military: 25, order: 35 }, 
                effects: { tech: 50, culture: 45, military: 35, order: 45, population: 30, environment: 20 },
                synergy: { tech: 0.2, culture: 0.18, military: 0.12, order: 0.18 }
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
            },
            {
                key: 'black_hole_mining', name: '黑洞开采', desc: '从黑洞中提取无限能源',
                costs: { tech: 70, military: 40, population: 30 }, effects: { tech: 90, military: 50, food: 45, environment: 35 },
                triggers: ['opportunity'], amplifies: ['tech', 'military']
            },
            {
                key: 'parallel_universe', name: '平行宇宙', desc: '开拓平行宇宙殖民地',
                costs: { tech: 60, culture: 45, environment: 35 }, effects: { tech: 75, culture: 55, population: 50, environment: 30 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'cosmic_ascension', name: '宇宙飞升', desc: '文明升华至高维存在',
                costs: { tech: 80, culture: 50, population: 40 }, effects: { tech: 100, culture: 65, population: 45, military: 35 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'universal_consciousness', name: '宇宙意识', desc: '连接宇宙所有智慧生命',
                costs: { culture: 60, tech: 55, population: 35 }, effects: { culture: 80, tech: 70, population: 50, military: 25 },
                triggers: ['opportunity'], amplifies: ['culture', 'tech']
            },
            {
                key: 'reality_transcendence', name: '现实超越', desc: '超越物理现实的限制',
                costs: { tech: 75, culture: 45, environment: 40 }, effects: { tech: 95, culture: 60, environment: 55, population: 30 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
            },
            {
                key: 'galactic_terraforming', name: '银河地球化', desc: '改造整个星系的生态环境',
                costs: { tech: 55, environment: 50, population: 40 }, effects: { environment: 70, population: 60, food: 50, tech: 35 },
                triggers: ['opportunity'], amplifies: ['environment', 'population']
            },
            {
                key: 'quantum_evolution', name: '量子进化', desc: '推动生命向量子层面进化',
                costs: { tech: 65, population: 45, culture: 35 }, effects: { population: 65, tech: 55, culture: 45, military: 30 },
                triggers: ['opportunity'], amplifies: ['population', 'tech']
            },
            {
                key: 'intergalactic_network', name: '星系间网络', desc: '建立跨星系通信网络',
                costs: { tech: 50, culture: 40, military: 30 }, effects: { tech: 65, culture: 50, military: 40, food: 25 },
                triggers: ['opportunity'], amplifies: ['tech', 'culture']
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
            },
            {
                key: 'cosmic_quarantine', name: '宇宙隔离', desc: '隔离危险的星系或现象',
                costs: { military: 50, tech: 40, culture: 30 }, effects: { military: 45, tech: 35, culture: 25, environment: 30 },
                triggers: ['crisis'], counters: ['military', 'tech']
            },
            {
                key: 'dimensional_stabilizer', name: '维度稳定器', desc: '稳定多维空间结构',
                costs: { tech: 60, environment: 35, culture: 25 }, effects: { tech: 50, environment: 45, culture: 30, population: 20 },
                triggers: ['crisis'], counters: ['tech', 'environment']
            },
            {
                key: 'universal_peace_treaty', name: '宇宙和平条约', desc: '缔结全宇宙和平协议',
                costs: { culture: 50, military: 35, tech: 30 }, effects: { culture: 55, military: 30, tech: 25, population: 35 },
                triggers: ['crisis'], counters: ['culture', 'military']
            },
            {
                key: 'dark_matter_containment', name: '暗物质控制', desc: '控制暗物质的威胁',
                costs: { tech: 55, military: 40, environment: 30 }, effects: { tech: 45, military: 35, environment: 35, population: 25 },
                triggers: ['crisis'], counters: ['tech', 'military']
            },
            {
                key: 'cosmic_immune_system', name: '宇宙免疫系统', desc: '建立抵御宇宙威胁的免疫机制',
                costs: { tech: 45, population: 40, culture: 35 }, effects: { population: 45, tech: 35, culture: 30, environment: 25 },
                triggers: ['crisis'], counters: ['population', 'tech']
            },
            {
                key: 'multiversal_defense', name: '多元宇宙防御', desc: '防御来自其他宇宙的威胁',
                costs: { tech: 65, military: 45, culture: 35 }, effects: { tech: 55, military: 50, culture: 30, environment: 20 },
                triggers: ['crisis'], counters: ['tech', 'military']
            },
            {
                key: 'temporal_paradox_resolution', name: '时间悖论解决', desc: '修复时间旅行造成的悖论',
                costs: { tech: 50, culture: 45, population: 30 }, effects: { tech: 45, culture: 40, population: 35, environment: 25 },
                triggers: ['crisis'], counters: ['tech', 'culture']
            },
            {
                key: 'galactic_evacuation', name: '银河疏散', desc: '大规模星系间人口疏散',
                costs: { military: 40, tech: 35, population: 50 }, effects: { population: 45, military: 35, tech: 30, environment: 20 },
                triggers: ['crisis'], counters: ['population', 'military']
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
            },
            {
                key: 'dark_energy_conversion', name: '暗能量转换', desc: '将暗能量转化为可用资源',
                costs: { tech: 55, environment: 30, military: 25 }, effects: { food: 55, tech: -25, environment: 20 },
                converts: { from: 'tech', to: 'food', ratio: 1.0 }
            },
            {
                key: 'time_energy_harvest', name: '时间能量收割', desc: '从时间流中提取能量',
                costs: { tech: 60, culture: 35, population: 30 }, effects: { military: 65, tech: -30, culture: 20 },
                converts: { from: 'tech', to: 'military', ratio: 1.08 }
            },
            {
                key: 'dimensional_mining', name: '维度采矿', desc: '从高维空间开采资源',
                costs: { tech: 50, military: 40, environment: 25 }, effects: { food: 50, population: 35, tech: -25 },
                converts: { from: 'tech', to: 'food', ratio: 1.0 }
            },
            {
                key: 'cosmic_soul_forge', name: '宇宙灵魂熔炉', desc: '锻造和升华生命灵魂',
                costs: { culture: 45, tech: 40, population: 35 }, effects: { population: 60, culture: -20, tech: 25 },
                converts: { from: 'culture', to: 'population', ratio: 1.33 }
            },
            {
                key: 'galactic_metamorphosis', name: '银河变形', desc: '改造整个银河系结构',
                costs: { tech: 65, environment: 40, military: 30 }, effects: { environment: 70, tech: -35, military: 20 },
                converts: { from: 'tech', to: 'environment', ratio: 1.08 }
            },
            {
                key: 'universal_military_draft', name: '宇宙征兵', desc: '从整个宇宙征召军队',
                costs: { population: 50, culture: 35, tech: 30 }, effects: { military: 75, population: -25, culture: 20 },
                converts: { from: 'population', to: 'military', ratio: 1.5 }
            },
            {
                key: 'civilization_synthesis', name: '文明融合', desc: '融合多个文明的精华',
                costs: { culture: 50, military: 30, tech: 35 }, effects: { tech: 60, culture: -25, military: 15 },
                converts: { from: 'culture', to: 'tech', ratio: 1.2 }
            },
            {
                key: 'stellar_ecology', name: '恒星生态', desc: '在恒星中建立生命系统',
                costs: { environment: 40, tech: 45, population: 30 }, effects: { population: 55, environment: -20, tech: 25 },
                converts: { from: 'environment', to: 'population', ratio: 1.38 }
            },
            {
                key: 'quantum_military_complex', name: '量子军事综合体', desc: '量子层面的军事工业',
                costs: { tech: 55, food: 35, culture: 25 }, effects: { military: 70, tech: -30, food: 20 },
                converts: { from: 'tech', to: 'military', ratio: 1.27 }
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
            },
            {
                key: 'omega_point', name: '欧米茄点', desc: '建设宇宙进化的终极目标点',
                costs: { tech: 80, culture: 60, population: 45, military: 40 }, effects: { environment: 25 },
                investment: { turns: 20, returns: { tech: 100, culture: 80, population: 60, military: 50 } }
            },
            {
                key: 'universe_foundry', name: '宇宙熔炉', desc: '建造创造新宇宙的终极工厂',
                costs: { tech: 75, military: 50, environment: 45, food: 35 }, effects: { culture: 20 },
                investment: { turns: 18, returns: { tech: 90, military: 60, environment: 55, culture: 40 } }
            },
            {
                key: 'consciousness_nexus', name: '意识枢纽', desc: '建立连接所有智慧生命的意识网络',
                costs: { culture: 65, tech: 50, population: 55, military: 30 }, effects: { food: 20 },
                investment: { turns: 15, returns: { culture: 75, tech: 60, population: 65, military: 35 } }
            },
            {
                key: 'temporal_observatory', name: '时间观测台', desc: '建设观察和研究时间的超级设施',
                costs: { tech: 60, culture: 45, environment: 35, population: 30 }, effects: { military: 18 },
                investment: { turns: 12, returns: { tech: 70, culture: 50, environment: 40, population: 35 } }
            },
            {
                key: 'galactic_genesis_engine', name: '银河创世引擎', desc: '建造能够创造星系的超级机器',
                costs: { tech: 70, military: 45, environment: 50, food: 40 }, effects: { culture: 25 },
                investment: { turns: 16, returns: { tech: 85, military: 55, environment: 65, culture: 35 } }
            },
            {
                key: 'infinity_gate', name: '无限之门', desc: '建设通往无限可能性的门户',
                costs: { tech: 85, culture: 55, population: 45, military: 35 }, effects: { environment: 20 },
                investment: { turns: 22, returns: { tech: 110, culture: 70, population: 55, military: 45 } }
            },
            {
                key: 'universal_will', name: '宇宙意志', desc: '建立代表整个宇宙意志的超级实体',
                costs: { culture: 70, tech: 60, population: 50, environment: 40 }, effects: { military: 22 },
                investment: { turns: 25, returns: { culture: 90, tech: 80, population: 65, environment: 50 } }
            },
            {
                key: 'dimensional_shipyard', name: '维度造船厂', desc: '建造跨维度的超级舰队工厂',
                costs: { tech: 65, military: 50, population: 40, food: 30 }, effects: { culture: 18 },
                investment: { turns: 12, returns: { military: 60, tech: 45, population: 35, culture: 25 } }
            },
            {
                key: 'transcendence_chamber', name: '超越舱', desc: '建立提升生命层次的超越设施',
                costs: { culture: 60, tech: 45, population: 50, environment: 30 }, effects: { military: 15 },
                investment: { turns: 10, returns: { culture: 50, tech: 35, population: 45, environment: 25 } }
            },
            {
                key: 'cosmic_lighthouse', name: '宇宙灯塔', desc: '建立指引宇宙航行的超级信标',
                costs: { tech: 50, military: 40, culture: 30, environment: 25 }, effects: { population: 15 },
                investment: { turns: 8, returns: { tech: 40, military: 35, culture: 25, population: 20 } }
            }
        ],
        [ACTION_TYPES.EMERGENCY]: [
            {
                key: 'universal_exodus', name: '宇宙大逃亡', desc: '全文明向其他宇宙大规模逃离',
                costs: { tech: 60, military: 50, population: 70 }, effects: { tech: 45, military: 40, population: 50, culture: -20 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'reality_reboot', name: '现实重启', desc: '重启当前现实以避免灾难',
                costs: { tech: 80, culture: 60, environment: 50 }, effects: { tech: 60, culture: 45, environment: 65, population: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'dimensional_evacuation', name: '维度疏散', desc: '将文明疏散到安全的维度空间',
                costs: { tech: 55, population: 60, military: 40 }, effects: { population: 45, tech: 40, military: 30, food: -25 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'cosmic_sacrifice', name: '宇宙献祭', desc: '献祭部分文明来拯救核心',
                costs: { population: 80, culture: 50, military: 40 }, effects: { population: 40, culture: 35, military: 25, tech: 30 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'timeline_escape', name: '时间线逃脱', desc: '逃离当前时间线到安全的平行时空',
                costs: { tech: 70, culture: 45, population: 50 }, effects: { tech: 50, culture: 35, population: 40, environment: 20 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'universe_merger', name: '宇宙合并', desc: '与其他宇宙合并以获得拯救力量',
                costs: { tech: 65, military: 55, environment: 45 }, effects: { tech: 55, military: 45, environment: 35, culture: 25 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'transcendence_escape', name: '超越逃脱', desc: '将文明超越到更高层次以避免毁灭',
                costs: { culture: 60, tech: 55, population: 45 }, effects: { culture: 50, tech: 45, population: 35, military: 20 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'quantum_resurrection', name: '量子复活', desc: '利用量子技术复活已死的文明部分',
                costs: { tech: 75, culture: 40, military: 35 }, effects: { population: 50, tech: 55, culture: 30, environment: -15 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'universal_reset', name: '宇宙重置', desc: '重置整个宇宙状态回到安全点',
                costs: { tech: 90, culture: 60, population: 50 }, effects: { tech: 70, culture: 45, population: 40, military: 30 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'infinity_protocol', name: '无限协议', desc: '启动文明的无限生存协议',
                costs: { tech: 70, military: 45, culture: 50 }, effects: { tech: 60, military: 40, culture: 45, population: 25 },
                triggers: ['disaster'], urgency: 'critical'
            },
            {
                key: 'cosmic_preservation', name: '宇宙保存', desc: '将文明保存在宇宙级保护容器中',
                costs: { tech: 60, environment: 50, population: 40 }, effects: { environment: 40, population: 35, tech: 45, food: 20 },
                triggers: ['disaster'], urgency: 'high'
            },
            {
                key: 'multiversal_backup', name: '多元宇宙备份', desc: '在多个宇宙中创建文明备份',
                costs: { tech: 65, culture: 45, military: 35 }, effects: { tech: 55, culture: 40, military: 30, population: 20 },
                triggers: ['disaster'], urgency: 'critical'
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
            },
            {
                key: 'galactic_godhood', name: '银河神性', desc: '文明获得神一般的力量和地位',
                costs: { tech: 80, culture: 70, population: 60, military: 50 }, 
                effects: { tech: 100, culture: 85, population: 75, military: 65, food: 45, environment: 40 },
                synergy: { tech: 0.3, culture: 0.28, population: 0.25, military: 0.2 }
            },
            {
                key: 'multiversal_consciousness', name: '多元宇宙意识', desc: '意识跨越多个宇宙的存在',
                costs: { culture: 75, tech: 65, population: 55, environment: 45 }, 
                effects: { culture: 90, tech: 80, population: 70, environment: 60, military: 40, food: 35 },
                synergy: { culture: 0.32, tech: 0.25, population: 0.22, environment: 0.18 }
            },
            {
                key: 'infinite_evolution', name: '无限进化', desc: '获得永无止境的进化能力',
                costs: { tech: 70, population: 65, culture: 55, military: 45 }, 
                effects: { tech: 85, population: 80, culture: 70, military: 60, food: 50, environment: 45 },
                synergy: { tech: 0.25, population: 0.28, culture: 0.22, military: 0.18 }
            },
            {
                key: 'reality_sovereignty', name: '现实主权', desc: '成为现实的绝对主宰者',
                costs: { tech: 85, military: 60, culture: 50, environment: 55 }, 
                effects: { tech: 105, military: 80, culture: 70, environment: 75, population: 55, food: 40 },
                synergy: { tech: 0.35, military: 0.25, culture: 0.2, environment: 0.22 }
            },
            {
                key: 'temporal_mastery', name: '时间主宰', desc: '完全掌控时间的流逝和命运',
                costs: { tech: 75, culture: 60, population: 50, food: 45 }, 
                effects: { tech: 95, culture: 80, population: 70, food: 60, military: 50, environment: 40 },
                synergy: { tech: 0.28, culture: 0.25, population: 0.22, food: 0.18 }
            },
            {
                key: 'dimensional_transcendence', name: '维度超越', desc: '超越所有维度限制的存在',
                costs: { tech: 80, culture: 65, environment: 60, military: 50 }, 
                effects: { tech: 100, culture: 85, environment: 80, military: 70, population: 60, food: 45 },
                synergy: { tech: 0.3, culture: 0.25, environment: 0.25, military: 0.2 }
            },
            {
                key: 'universal_architect', name: '宇宙建筑师', desc: '设计和建造宇宙的终极存在',
                costs: { tech: 85, environment: 70, culture: 60, population: 55 }, 
                effects: { tech: 110, environment: 90, culture: 80, population: 75, military: 55, food: 50 },
                synergy: { tech: 0.35, environment: 0.3, culture: 0.25, population: 0.22 }
            },
            {
                key: 'cosmic_unity', name: '宇宙统一', desc: '实现所有存在的完美统一',
                costs: { tech: 70, culture: 75, population: 65, environment: 60, military: 50, food: 45 }, 
                effects: { tech: 90, culture: 95, population: 85, environment: 80, military: 70, food: 65 },
                synergy: { tech: 0.25, culture: 0.32, population: 0.28, environment: 0.25, military: 0.2, food: 0.18 }
            },
            {
                key: 'eternal_perfection', name: '永恒完美', desc: '达到永恒不变的完美状态',
                costs: { tech: 90, culture: 80, population: 70, military: 60, food: 50, environment: 65 }, 
                effects: { tech: 120, culture: 110, population: 100, military: 90, food: 80, environment: 90 },
                synergy: { tech: 0.4, culture: 0.38, population: 0.35, military: 0.3, food: 0.25, environment: 0.3 }
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
