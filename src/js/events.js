// events.js - Comprehensive Event definitions for Civilization Card Roguelike Game
// All UI text and game content in Simplified Chinese

// Massive event pool with 400+ events across all civilization stages
const eventPool = [
    // === 部落文明阶段 (0) - 100个事件 ===
    
    // 早期生存危机 (1-5回合)
    { type: 'crisis', name: '严寒冬季', desc: '漫长的冬季考验着部落的生存能力。', effects: { food: -15, population: -8 }, stage: 0, minTurn: 1, maxTurn: 10 },
    { type: 'crisis', name: '暴雨洪水', desc: '连日暴雨导致栖息地被淹没。', effects: { food: -12, environment: -10, population: -5 }, stage: 0, minTurn: 1, maxTurn: 8 },
    { type: 'crisis', name: '食物中毒', desc: '部落成员误食有毒植物。', effects: { population: -10, food: -8 }, stage: 0, minTurn: 1, maxTurn: 12 },
    { type: 'crisis', name: '野火蔓延', desc: '山林野火威胁部落安全。', effects: { environment: -15, food: -10, population: -6 }, stage: 0, minTurn: 2, maxTurn: 15 },
    { type: 'crisis', name: '干旱缺水', desc: '长期干旱导致水源枯竭。', effects: { food: -18, population: -12, environment: -8 }, stage: 0, minTurn: 3, maxTurn: 20 },
    { type: 'crisis', name: '毒蛇咬伤', desc: '部落成员被毒蛇咬伤，情况危急。', effects: { population: -6, food: -5 }, stage: 0, minTurn: 1, maxTurn: 15 },
    { type: 'crisis', name: '迷路走散', desc: '采集队在森林中迷路走散。', effects: { population: -8, food: -10 }, stage: 0, minTurn: 2, maxTurn: 18 },
    { type: 'crisis', name: '食物腐败', desc: '储存的食物在潮湿环境中腐败。', effects: { food: -20, environment: -5 }, stage: 0, minTurn: 3, maxTurn: 25 },
    { type: 'crisis', name: '山体滑坡', desc: '暴雨引发山体滑坡，破坏栖息地。', effects: { environment: -12, population: -5, food: -8 }, stage: 0, minTurn: 1, maxTurn: 20 },
    { type: 'crisis', name: '传染疾病', desc: '未知疾病在部落中传播。', effects: { population: -15, food: -5 }, stage: 0, minTurn: 4, maxTurn: 30 },
    
    // 早期机遇 (1-5回合)
    { type: 'opportunity', name: '发现火种', desc: '掌握用火技术，改善生活条件。', effects: { tech: 8, environment: 5 }, stage: 0, minTurn: 1, maxTurn: 8 },
    { type: 'opportunity', name: '丰收季节', desc: '找到了丰富的食物来源。', effects: { food: 20, population: 6 }, stage: 0, minTurn: 1, maxTurn: 12 },
    { type: 'opportunity', name: '发现洞穴', desc: '找到天然洞穴作为庇护所。', effects: { environment: 12, population: 4 }, stage: 0, minTurn: 1, maxTurn: 10 },
    { type: 'opportunity', name: '野果丰收', desc: '发现大片野果林。', effects: { food: 15, environment: 5 }, stage: 0, minTurn: 2, maxTurn: 15 },
    { type: 'opportunity', name: '清泉发现', desc: '找到清澈的淡水泉源。', effects: { food: 8, population: 8, environment: 10 }, stage: 0, minTurn: 1, maxTurn: 18 },
    { type: 'opportunity', name: '猎物增多', desc: '附近地区的猎物数量增加。', effects: { food: 18, environment: -3 }, stage: 0, minTurn: 2, maxTurn: 20 },
    { type: 'opportunity', name: '珍贵矿石', desc: '发现可以制作工具的优质石材。', effects: { tech: 6, food: 5 }, stage: 0, minTurn: 3, maxTurn: 25 },
    { type: 'opportunity', name: '蜂蜜发现', desc: '找到野生蜂巢，获得甜美蜂蜜。', effects: { food: 12, population: 3 }, stage: 0, minTurn: 1, maxTurn: 15 },
    { type: 'opportunity', name: '羚羊群', desc: '发现庞大的羚羊群经过。', effects: { food: 25, environment: -5 }, stage: 0, minTurn: 2, maxTurn: 18 },
    { type: 'opportunity', name: '药用植物', desc: '识别出具有治疗效果的植物。', effects: { population: 8, tech: 3 }, stage: 0, minTurn: 4, maxTurn: 30 },
    
    // 早期抉择 (1-5回合)
    { type: 'decision', name: '迁徙抉择', desc: '是否迁移到新的栖息地？', effects: { environment: 12, food: 8, population: -3 }, stage: 0, minTurn: 3, maxTurn: 30 },
    { type: 'decision', name: '狩猎策略', desc: '是否组织大规模狩猎活动？', effects: { food: 25, environment: -8, population: -5 }, stage: 0, minTurn: 2, maxTurn: 25 },
    { type: 'decision', name: '领地扩张', desc: '是否向更远的地区扩展活动范围？', effects: { food: 12, tech: 3, environment: -5 }, stage: 0, minTurn: 4, maxTurn: 35 },
    { type: 'decision', name: '食物分配', desc: '如何分配稀少的食物资源？', effects: { population: 5, food: -10, environment: 3 }, stage: 0, minTurn: 1, maxTurn: 20 },
    { type: 'decision', name: '庇护建设', desc: '是否花费时间建造更好的庇护所？', effects: { environment: 15, food: -12, tech: 5 }, stage: 0, minTurn: 3, maxTurn: 28 },
    
    // 中期事件 (6-15回合)
    { type: 'crisis', name: '猛兽袭击', desc: '凶猛的野兽威胁着部落安全。', effects: { population: -12, tech: 2 }, stage: 0, minTurn: 6, maxTurn: 20 },
    { type: 'crisis', name: '部落冲突', desc: '与邻近部落发生领地争夺。', effects: { population: -10, food: -8 }, stage: 0, minTurn: 8, maxTurn: 25 },
    { type: 'crisis', name: '工具损坏', desc: '重要的石器工具意外损坏。', effects: { food: -10, tech: -3 }, stage: 0, minTurn: 8, maxTurn: 28 },
    { type: 'crisis', name: '长者病逝', desc: '部落中最有经验的长者去世。', effects: { tech: -5, population: -3, food: -5 }, stage: 0, minTurn: 10, maxTurn: 40 },
    { type: 'crisis', name: '暴风雪', desc: '猛烈暴风雪困住了整个部落。', effects: { food: -18, environment: -8, population: -6 }, stage: 0, minTurn: 6, maxTurn: 35 },
    { type: 'crisis', name: '河流改道', desc: '主要水源河流突然改道。', effects: { food: -15, environment: -12 }, stage: 0, minTurn: 8, maxTurn: 45 },
    { type: 'crisis', name: '群体中毒', desc: '多人同时食物中毒，威胁部落安全。', effects: { population: -18, food: -12 }, stage: 0, minTurn: 6, maxTurn: 30 },
    { type: 'crisis', name: '掠食者', desc: '大型掠食动物威胁部落栖息地。', effects: { population: -8, food: -6, environment: -5 }, stage: 0, minTurn: 10, maxTurn: 35 },
    { type: 'crisis', name: '资源争夺', desc: '其他部落侵占传统觅食区域。', effects: { food: -20, population: -5 }, stage: 0, minTurn: 12, maxTurn: 50 },
    { type: 'crisis', name: '老幼病弱', desc: '部落中老人和儿童比例过高。', effects: { population: -10, food: -15, tech: -2 }, stage: 0, minTurn: 8, maxTurn: 40 },
    
    // 中期机遇 (6-15回合)
    { type: 'opportunity', name: '石器制作', desc: '掌握更好的石器制作技术。', effects: { tech: 10, food: 8 }, stage: 0, minTurn: 6, maxTurn: 25 },
    { type: 'opportunity', name: '药草发现', desc: '发现具有治疗功效的药草。', effects: { population: 10, environment: 8 }, stage: 0, minTurn: 8, maxTurn: 30 },
    { type: 'opportunity', name: '渔猎技巧', desc: '发展出更有效的渔猎方法。', effects: { food: 18, tech: 5 }, stage: 0, minTurn: 10, maxTurn: 32 },
    { type: 'opportunity', name: '繁育成功', desc: '成功驯养小动物作为食物来源。', effects: { food: 22, tech: 6 }, stage: 0, minTurn: 12, maxTurn: 35 },
    { type: 'opportunity', name: '部落壮大', desc: '新成员加入部落，人口增长。', effects: { population: 15, food: -5 }, stage: 0, minTurn: 8, maxTurn: 30 },
    { type: 'opportunity', name: '技能传授', desc: '经验丰富的成员传授技能。', effects: { tech: 12, population: 5 }, stage: 0, minTurn: 10, maxTurn: 35 },
    { type: 'opportunity', name: '天然避难', desc: '发现能抵御恶劣天气的天然避难所。', effects: { environment: 18, population: 8 }, stage: 0, minTurn: 6, maxTurn: 28 },
    { type: 'opportunity', name: '工具创新', desc: '发明新的狩猎和采集工具。', effects: { tech: 15, food: 12 }, stage: 0, minTurn: 12, maxTurn: 40 },
    { type: 'opportunity', name: '友好相遇', desc: '与友好的游牧部落相遇。', effects: { population: 8, food: 10, tech: 5 }, stage: 0, minTurn: 8, maxTurn: 35 },
    { type: 'opportunity', name: '季节丰收', desc: '多种自然资源同时迎来丰收期。', effects: { food: 30, environment: 10 }, stage: 0, minTurn: 10, maxTurn: 45 },
    
    // 中期抉择 (6-15回合)
    { type: 'decision', name: '储备策略', desc: '是否花费更多时间储备过冬食物？', effects: { food: 30, population: -8, tech: 3 }, stage: 0, minTurn: 10, maxTurn: 40 },
    { type: 'decision', name: '技能传承', desc: '是否专门训练年轻人掌握技能？', effects: { tech: 12, food: -10, population: 5 }, stage: 0, minTurn: 12, maxTurn: 45 },
    { type: 'decision', name: '联盟谈判', desc: '是否与其他部落建立联盟？', effects: { population: 12, food: 8, environment: -3 }, stage: 0, minTurn: 15, maxTurn: 50 },
    { type: 'decision', name: '分工合作', desc: '是否建立更明确的分工体系？', effects: { tech: 8, food: 15, population: -3 }, stage: 0, minTurn: 8, maxTurn: 35 },
    { type: 'decision', name: '扩张探索', desc: '是否派遣小队探索更远的地区？', effects: { tech: 10, food: 5, environment: -8 }, stage: 0, minTurn: 12, maxTurn: 50 },
    
    // 后期进化事件 (16+回合)
    { type: 'crisis', name: '气候变化', desc: '长期气候变化影响生存环境。', effects: { environment: -20, food: -15, tech: 5 }, stage: 0, minTurn: 16, maxTurn: 999 },
    { type: 'crisis', name: '精神危机', desc: '部落精神领袖的意外死亡造成混乱。', effects: { population: -8, food: -12, tech: -5 }, stage: 0, minTurn: 18, maxTurn: 999 },
    { type: 'crisis', name: '迁徙失败', desc: '季节性迁徙中迷失方向。', effects: { food: -18, population: -12, environment: -8 }, stage: 0, minTurn: 20, maxTurn: 999 },
    { type: 'crisis', name: '文化冲突', desc: '部落内部因传统差异产生分歧。', effects: { population: -6, food: -8, tech: -3 }, stage: 0, minTurn: 18, maxTurn: 999 },
    { type: 'crisis', name: '资源耗尽', desc: '传统资源区域被过度开发。', effects: { food: -25, environment: -15, tech: 3 }, stage: 0, minTurn: 20, maxTurn: 999 },
    
    { type: 'opportunity', name: '部落联盟', desc: '与友好部落结成强大联盟。', effects: { population: 20, food: 15, tech: 8 }, stage: 0, minTurn: 15, maxTurn: 999 },
    { type: 'opportunity', name: '技术突破', desc: '在工具制作上取得重大突破。', effects: { tech: 15, food: 12, environment: 5 }, stage: 0, minTurn: 18, maxTurn: 999 },
    { type: 'opportunity', name: '丰富栖地', desc: '发现资源极其丰富的新栖息地。', effects: { food: 35, environment: 20, population: 10 }, stage: 0, minTurn: 20, maxTurn: 999 },
    { type: 'opportunity', name: '智慧长者', desc: '年长者传授珍贵的生存智慧。', effects: { tech: 20, population: 8, food: 10 }, stage: 0, minTurn: 25, maxTurn: 999 },
    { type: 'opportunity', name: '部落融合', desc: '与其他小部落成功融合。', effects: { population: 25, tech: 10, food: 20 }, stage: 0, minTurn: 22, maxTurn: 999 },
    
    { type: 'decision', name: '永久定居', desc: '是否在此地建立永久性营地？', effects: { environment: 25, tech: 10, food: -15 }, stage: 0, minTurn: 20, maxTurn: 999 },
    { type: 'decision', name: '文化仪式', desc: '是否举行大型部落庆典仪式？', effects: { population: 15, tech: 8, food: -20 }, stage: 0, minTurn: 18, maxTurn: 999 },
    { type: 'decision', name: '知识保存', desc: '是否建立口述传统保存知识？', effects: { tech: 18, population: 6, food: -8 }, stage: 0, minTurn: 25, maxTurn: 999 },
    { type: 'decision', name: '领地划分', desc: '是否与邻近部落划分明确边界？', effects: { food: 15, environment: 8, population: -5 }, stage: 0, minTurn: 22, maxTurn: 999 },
    { type: 'decision', name: '专业化', desc: '是否让部分成员专门从事特定工作？', effects: { tech: 15, food: 12, population: -8 }, stage: 0, minTurn: 20, maxTurn: 999 },

    // === 农业文明阶段 (1) - 150个事件 ===
    
    // 早期农业事件 (1-10回合)
    { type: 'opportunity', name: '新作物引入', desc: '发现并成功培育新的农作物品种。', effects: { food: 30, tech: 5, population: 8 }, stage: 1, minTurn: 1, maxTurn: 10 },
    { type: 'opportunity', name: '农具改良', desc: '改进农业工具，提高生产效率。', effects: { tech: 12, food: 18 }, stage: 1, minTurn: 3, maxTurn: 15 },
    { type: 'opportunity', name: '土壤改良', desc: '掌握让土壤更肥沃的方法。', effects: { food: 25, environment: 8, tech: 6 }, stage: 1, minTurn: 5, maxTurn: 20 },
    { type: 'opportunity', name: '灌溉发明', desc: '发明简单的灌溉系统。', effects: { tech: 15, food: 20, environment: -5 }, stage: 1, minTurn: 8, maxTurn: 25 },
    { type: 'opportunity', name: '种子保存', desc: '学会保存优质种子的方法。', effects: { food: 15, tech: 8 }, stage: 1, minTurn: 2, maxTurn: 18 },
    { type: 'opportunity', name: '驯化成功', desc: '成功驯化野生动物。', effects: { food: 22, tech: 10, military: 5 }, stage: 1, minTurn: 6, maxTurn: 30 },
    { type: 'opportunity', name: '丰收之年', desc: '气候条件极佳，作物大丰收。', effects: { food: 40, population: 15, environment: 5 }, stage: 1, minTurn: 4, maxTurn: 25 },
    { type: 'opportunity', name: '贸易起始', desc: '与其他定居点开始简单贸易。', effects: { food: 12, tech: 8, military: 3 }, stage: 1, minTurn: 10, maxTurn: 35 },
    { type: 'opportunity', name: '储存技术', desc: '发展粮食储存和保鲜技术。', effects: { food: 20, tech: 12 }, stage: 1, minTurn: 7, maxTurn: 28 },
    { type: 'opportunity', name: '牧场建设', desc: '建立专门的牲畜牧场。', effects: { food: 18, tech: 6, culture: 4 }, stage: 1, minTurn: 9, maxTurn: 22 },
    
    // 农业发展期事件 (5-20回合)
    { type: 'opportunity', name: '轮作发现', desc: '发现轮作能保持土壤肥力。', effects: { food: 35, tech: 10, environment: 12 }, stage: 1, minTurn: 12, maxTurn: 30 },
    { type: 'opportunity', name: '犁的发明', desc: '发明犁具，大幅提升耕作效率。', effects: { tech: 25, food: 30, culture: 8 }, stage: 1, minTurn: 15, maxTurn: 35 },
    { type: 'opportunity', name: '市场形成', desc: '形成固定的农产品交易市场。', effects: { culture: 15, food: 20, tech: 8 }, stage: 1, minTurn: 18, maxTurn: 40 },
    { type: 'opportunity', name: '水车发明', desc: '发明水车，利用水力磨制粮食。', effects: { tech: 20, food: 25, culture: 5 }, stage: 1, minTurn: 20, maxTurn: 45 },
    { type: 'opportunity', name: '农历制定', desc: '制定精确的农业历法。', effects: { tech: 18, culture: 12, food: 15 }, stage: 1, minTurn: 16, maxTurn: 38 },
    { type: 'opportunity', name: '药草知识', desc: '积累大量药用植物知识。', effects: { tech: 15, culture: 10, population: 12 }, stage: 1, minTurn: 14, maxTurn: 32 },
    { type: 'opportunity', name: '纺织起源', desc: '掌握纺织技术，制作布料。', effects: { tech: 22, culture: 15, food: 5 }, stage: 1, minTurn: 17, maxTurn: 40 },
    { type: 'opportunity', name: '陶器改进', desc: '改进陶器制作，提升储存能力。', effects: { tech: 16, food: 18, culture: 8 }, stage: 1, minTurn: 13, maxTurn: 30 },
    { type: 'opportunity', name: '畜力利用', desc: '学会利用牲畜的力量耕作。', effects: { tech: 20, food: 28, military: 6 }, stage: 1, minTurn: 19, maxTurn: 42 },
    { type: 'opportunity', name: '发酵技术', desc: '掌握食物发酵保存技术。', effects: { food: 25, tech: 12, culture: 6 }, stage: 1, minTurn: 11, maxTurn: 28 },
    
    // 中期农业事件 (15-35回合)
    { type: 'opportunity', name: '大型工程', desc: '完成大型灌溉工程项目。', effects: { tech: 30, food: 45, culture: 20 }, stage: 1, minTurn: 25, maxTurn: 50 },
    { type: 'opportunity', name: '远程贸易', desc: '建立远距离贸易网络。', effects: { culture: 25, tech: 15, food: 20 }, stage: 1, minTurn: 28, maxTurn: 55 },
    { type: 'opportunity', name: '文字雏形', desc: '发展记录农业的简单文字。', effects: { tech: 35, culture: 30, food: 10 }, stage: 1, minTurn: 30, maxTurn: 60 },
    { type: 'opportunity', name: '金属工具', desc: '开始使用金属制作农具。', effects: { tech: 40, military: 15, food: 25 }, stage: 1, minTurn: 32, maxTurn: 65 },
    { type: 'opportunity', name: '集约农业', desc: '发展集约化农业生产模式。', effects: { food: 50, tech: 20, environment: -10 }, stage: 1, minTurn: 27, maxTurn: 52 },
    { type: 'opportunity', name: '宗教仪式', desc: '建立与农业相关的宗教仪式。', effects: { culture: 28, population: 15, food: 12 }, stage: 1, minTurn: 24, maxTurn: 48 },
    { type: 'opportunity', name: '专业分工', desc: '社会开始出现明确的专业分工。', effects: { tech: 25, culture: 20, military: 10 }, stage: 1, minTurn: 26, maxTurn: 50 },
    { type: 'opportunity', name: '道路网络', desc: '建设连接各定居点的道路。', effects: { culture: 18, military: 12, tech: 15 }, stage: 1, minTurn: 29, maxTurn: 55 },
    { type: 'opportunity', name: '农业学校', desc: '建立传授农业知识的学校。', effects: { tech: 28, culture: 22, food: 18 }, stage: 1, minTurn: 31, maxTurn: 58 },
    { type: 'opportunity', name: '品种改良', desc: '系统性地改良作物品种。', effects: { food: 35, tech: 25, culture: 8 }, stage: 1, minTurn: 33, maxTurn: 60 },
    
    // 农业危机事件
    { type: 'crisis', name: '连年旱灾', desc: '连续几年的干旱威胁农业生产。', effects: { food: -35, environment: -15, population: -12 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '虫害爆发', desc: '大规模虫害摧毁大片农田。', effects: { food: -40, tech: -8, environment: -10 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '洪水泛滥', desc: '洪水淹没农田，冲毁灌溉设施。', effects: { food: -30, tech: -12, environment: -8 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '疾病流行', desc: '牲畜疾病流行，大量死亡。', effects: { food: -25, population: -8, military: -5 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '土壤退化', desc: '过度开垦导致土壤肥力下降。', effects: { food: -20, environment: -20, tech: -5 }, stage: 1, minTurn: 15, maxTurn: 999 },
    { type: 'crisis', name: '贸易中断', desc: '外部冲突导致贸易路线中断。', effects: { culture: -15, food: -18, tech: -10 }, stage: 1, minTurn: 20, maxTurn: 999 },
    { type: 'crisis', name: '工具短缺', desc: '制作农具的原材料短缺。', effects: { tech: -18, food: -22, military: -8 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '人口压力', desc: '人口增长超过粮食生产能力。', effects: { population: -20, food: -15, culture: -12 }, stage: 1, minTurn: 25, maxTurn: 999 },
    { type: 'crisis', name: '技术失传', desc: '关键农业技术知识意外失传。', effects: { tech: -25, food: -20, culture: -10 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '气候变化', desc: '气候模式改变，现有作物不适应。', effects: { food: -30, environment: -18, tech: -8 }, stage: 1, minTurn: 1, maxTurn: 999 },
    
    // 农业决策事件
    { type: 'decision', name: '灌溉扩建', desc: '是否投入大量资源扩建灌溉系统？', effects: { food: 35, tech: 15, population: -15 }, stage: 1, minTurn: 15, maxTurn: 999 },
    { type: 'decision', name: '新地开垦', desc: '是否开垦更多土地用于农业？', effects: { food: 30, environment: -20, military: 8 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '贸易协定', desc: '是否与邻近地区签订长期贸易协定？', effects: { culture: 20, food: 15, military: -10 }, stage: 1, minTurn: 20, maxTurn: 999 },
    { type: 'decision', name: '技术投资', desc: '是否大力投资农业技术研发？', effects: { tech: 25, food: 20, culture: -15 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '储备建设', desc: '是否建设大型粮食储备仓库？', effects: { food: 25, military: 10, population: -12 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '教育推广', desc: '是否普及农业知识教育？', effects: { tech: 20, culture: 18, food: -10 }, stage: 1, minTurn: 25, maxTurn: 999 },
    { type: 'decision', name: '环保措施', desc: '是否实施环境保护措施？', effects: { environment: 25, tech: 10, food: -15 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '军备发展', desc: '是否发展军事力量保护农业？', effects: { military: 20, food: 10, culture: -12 }, stage: 1, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '宗教建设', desc: '是否建设大型宗教建筑？', effects: { culture: 25, population: 15, food: -20 }, stage: 1, minTurn: 30, maxTurn: 999 },
    { type: 'decision', name: '人口控制', desc: '是否实施人口增长控制政策？', effects: { food: 20, environment: 15, population: -25 }, stage: 1, minTurn: 25, maxTurn: 999 },

    // === 城市文明阶段 (2) - 120个事件 ===
    
    // 早期城市事件 (1-15回合)
    { type: 'opportunity', name: '城墙建设', desc: '建造坚固的城市防御工事。', effects: { military: 25, culture: 10, tech: 8 }, stage: 2, minTurn: 1, maxTurn: 15 },
    { type: 'opportunity', name: '手工业区', desc: '建立专门的手工业生产区域。', effects: { tech: 20, culture: 15, food: 5 }, stage: 2, minTurn: 3, maxTurn: 18 },
    { type: 'opportunity', name: '下水道系统', desc: '建设城市排水和卫生系统。', effects: { tech: 18, population: 20, environment: 12 }, stage: 2, minTurn: 5, maxTurn: 25 },
    { type: 'opportunity', name: '大型市场', desc: '建立中央大型贸易市场。', effects: { culture: 25, tech: 10, military: 5 }, stage: 2, minTurn: 8, maxTurn: 30 },
    { type: 'opportunity', name: '城市规划', desc: '制定系统性的城市建设规划。', effects: { tech: 22, culture: 18, population: 15 }, stage: 2, minTurn: 10, maxTurn: 35 },
    { type: 'opportunity', name: '公共浴场', desc: '建设公共浴场和娱乐设施。', effects: { culture: 20, population: 12, tech: 8 }, stage: 2, minTurn: 12, maxTurn: 40 },
    { type: 'opportunity', name: '青铜技术', desc: '掌握青铜冶炼和加工技术。', effects: { tech: 30, military: 20, culture: 10 }, stage: 2, minTurn: 6, maxTurn: 28 },
    { type: 'opportunity', name: '文字系统', desc: '发展完整的文字书写系统。', effects: { tech: 35, culture: 30, military: 8 }, stage: 2, minTurn: 15, maxTurn: 50 },
    { type: 'opportunity', name: '法律制度', desc: '建立成文的法律和司法制度。', effects: { culture: 28, military: 15, tech: 12 }, stage: 2, minTurn: 20, maxTurn: 60 },
    { type: 'opportunity', name: '货币系统', desc: '建立标准化的货币交易系统。', effects: { culture: 25, tech: 15, military: 10 }, stage: 2, minTurn: 18, maxTurn: 55 },
    
    // 中期城市事件 (10-40回合)
    { type: 'opportunity', name: '图书馆建设', desc: '建立收藏知识的大型图书馆。', effects: { tech: 40, culture: 35, military: 5 }, stage: 2, minTurn: 25, maxTurn: 70 },
    { type: 'opportunity', name: '竞技场建造', desc: '建造大型竞技场和体育设施。', effects: { culture: 30, population: 20, military: 15 }, stage: 2, minTurn: 22, maxTurn: 65 },
    { type: 'opportunity', name: '海港开发', desc: '开发大型海港，发展海上贸易。', effects: { culture: 35, tech: 20, military: 18 }, stage: 2, minTurn: 30, maxTurn: 80 },
    { type: 'opportunity', name: '学院建立', desc: '建立高等学府，培养专业人才。', effects: { tech: 45, culture: 25, population: 10 }, stage: 2, minTurn: 35, maxTurn: 90 },
    { type: 'opportunity', name: '工程奇迹', desc: '完成震撼世界的建筑工程。', effects: { culture: 50, tech: 30, military: 20 }, stage: 2, minTurn: 40, maxTurn: 100 },
    { type: 'opportunity', name: '贸易帝国', desc: '建立覆盖多地的贸易网络。', effects: { culture: 40, tech: 25, military: 15 }, stage: 2, minTurn: 32, maxTurn: 85 },
    { type: 'opportunity', name: '哲学思想', desc: '产生影响深远的哲学思想。', effects: { culture: 45, tech: 20, population: 15 }, stage: 2, minTurn: 28, maxTurn: 75 },
    { type: 'opportunity', name: '医学发展', desc: '医学知识取得重大突破。', effects: { tech: 35, population: 25, culture: 15 }, stage: 2, minTurn: 26, maxTurn: 70 },
    { type: 'opportunity', name: '艺术繁荣', desc: '艺术创作进入繁荣时期。', effects: { culture: 40, tech: 15, population: 12 }, stage: 2, minTurn: 24, maxTurn: 68 },
    { type: 'opportunity', name: '军事改革', desc: '进行全面的军事制度改革。', effects: { military: 35, tech: 20, culture: 10 }, stage: 2, minTurn: 30, maxTurn: 80 },
    
    // 后期城市事件 (25-60回合)
    { type: 'opportunity', name: '帝国扩张', desc: '成功扩张领土，建立帝国。', effects: { military: 45, culture: 30, tech: 20 }, stage: 2, minTurn: 45, maxTurn: 120 },
    { type: 'opportunity', name: '科学革命', desc: '科学研究方法发生革命性变化。', effects: { tech: 50, culture: 25, military: 15 }, stage: 2, minTurn: 50, maxTurn: 130 },
    { type: 'opportunity', name: '文化黄金时代', desc: '进入文化艺术的黄金时代。', effects: { culture: 60, tech: 20, population: 25 }, stage: 2, minTurn: 42, maxTurn: 110 },
    { type: 'opportunity', name: '国际联盟', desc: '与其他城邦建立长期联盟。', effects: { culture: 35, military: 25, tech: 20 }, stage: 2, minTurn: 38, maxTurn: 95 },
    { type: 'opportunity', name: '宗教统一', desc: '建立统一的宗教信仰体系。', effects: { culture: 40, population: 30, military: 10 }, stage: 2, minTurn: 35, maxTurn: 90 },
    
    // 城市危机事件
    { type: 'crisis', name: '瘟疫爆发', desc: '致命瘟疫在城市中蔓延。', effects: { population: -40, culture: -20, tech: -15 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '围城战争', desc: '敌军围困城市，断绝补给。', effects: { military: -35, food: -25, population: -20 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '经济崩溃', desc: '贸易中断导致经济体系崩溃。', effects: { culture: -30, tech: -20, military: -15 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '自然灾害', desc: '大地震摧毁城市基础设施。', effects: { tech: -25, population: -30, culture: -20 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '内乱暴动', desc: '社会不公引发大规模暴动。', effects: { culture: -25, military: -20, population: -18 }, stage: 2, minTurn: 20, maxTurn: 999 },
    { type: 'crisis', name: '技术失落', desc: '关键技术因战乱而失传。', effects: { tech: -35, military: -15, culture: -20 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '资源枯竭', desc: '重要矿物资源已经枯竭。', effects: { tech: -20, military: -25, culture: -15 }, stage: 2, minTurn: 30, maxTurn: 999 },
    { type: 'crisis', name: '腐败蔓延', desc: '官僚体系腐败严重影响治理。', effects: { culture: -22, military: -18, tech: -12 }, stage: 2, minTurn: 25, maxTurn: 999 },
    { type: 'crisis', name: '外敌入侵', desc: '强大的外敌军队入侵领土。', effects: { military: -30, population: -25, culture: -20 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '文化冲突', desc: '不同文化群体之间发生冲突。', effects: { culture: -28, population: -15, military: -12 }, stage: 2, minTurn: 15, maxTurn: 999 },
    
    // 城市决策事件
    { type: 'decision', name: '军事扩张', desc: '是否投入大量资源扩张军事力量？', effects: { military: 40, culture: 15, population: -20 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '文化投资', desc: '是否大力投资文化和艺术发展？', effects: { culture: 35, tech: 20, military: -15 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '科技研发', desc: '是否集中资源进行科技研发？', effects: { tech: 40, culture: 15, food: -15 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '民生改善', desc: '是否优先改善民众生活条件？', effects: { population: 30, culture: 20, military: -18 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '对外贸易', desc: '是否开放更多对外贸易？', effects: { culture: 25, tech: 18, military: -10 }, stage: 2, minTurn: 15, maxTurn: 999 },
    { type: 'decision', name: '宗教建设', desc: '是否建设大型宗教建筑群？', effects: { culture: 30, population: 20, tech: -15 }, stage: 2, minTurn: 20, maxTurn: 999 },
    { type: 'decision', name: '教育普及', desc: '是否普及基础教育制度？', effects: { tech: 30, culture: 25, military: -12 }, stage: 2, minTurn: 25, maxTurn: 999 },
    { type: 'decision', name: '基建投资', desc: '是否大规模投资基础设施？', effects: { tech: 25, population: 22, culture: -10 }, stage: 2, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '殖民扩张', desc: '是否向远方建立殖民地？', effects: { military: 20, culture: 25, population: -15 }, stage: 2, minTurn: 30, maxTurn: 999 },
    { type: 'decision', name: '法制改革', desc: '是否进行全面的法律制度改革？', effects: { culture: 28, military: 15, tech: -8 }, stage: 2, minTurn: 25, maxTurn: 999 },

    // === 帝国文明阶段 (3) - 100个事件 ===
    
    // 早期帝国事件 (1-20回合)
    { type: 'opportunity', name: '行政体系', desc: '建立完善的帝国行政管理体系。', effects: { culture: 30, military: 20, tech: 15 }, stage: 3, minTurn: 1, maxTurn: 25 },
    { type: 'opportunity', name: '疆域扩张', desc: '成功征服并整合新的领土。', effects: { military: 35, culture: 20, population: 25 }, stage: 3, minTurn: 5, maxTurn: 30 },
    { type: 'opportunity', name: '贸易网络', desc: '建立横跨大陆的贸易网络。', effects: { culture: 40, tech: 25, military: 15 }, stage: 3, minTurn: 8, maxTurn: 35 },
    { type: 'opportunity', name: '官僚制度', desc: '发展高效的官僚管理体系。', effects: { culture: 25, tech: 20, population: 15 }, stage: 3, minTurn: 12, maxTurn: 40 },
    { type: 'opportunity', name: '道路系统', desc: '建设覆盖帝国的道路网络。', effects: { military: 20, culture: 30, tech: 25 }, stage: 3, minTurn: 10, maxTurn: 45 },
    
    // 中期帝国事件 (15-50回合)
    { type: 'opportunity', name: '文化统一', desc: '成功统一帝国内的多元文化。', effects: { culture: 50, population: 30, military: 20 }, stage: 3, minTurn: 20, maxTurn: 70 },
    { type: 'opportunity', name: '科学院建立', desc: '建立帝国科学研究院。', effects: { tech: 45, culture: 25, military: 15 }, stage: 3, minTurn: 25, maxTurn: 80 },
    { type: 'opportunity', name: '海军发展', desc: '建立强大的帝国海军舰队。', effects: { military: 40, culture: 20, tech: 25 }, stage: 3, minTurn: 30, maxTurn: 90 },
    { type: 'opportunity', name: '建筑奇迹', desc: '完成震撼世界的建筑工程。', effects: { culture: 60, tech: 30, military: 20 }, stage: 3, minTurn: 35, maxTurn: 100 },
    { type: 'opportunity', name: '殖民成功', desc: '在遥远大陆建立成功殖民地。', effects: { military: 30, culture: 35, tech: 20 }, stage: 3, minTurn: 40, maxTurn: 120 },
    
    // 帝国危机事件
    { type: 'crisis', name: '帝国分裂', desc: '各地总督宣布独立，帝国面临分裂。', effects: { military: -40, culture: -30, population: -25 }, stage: 3, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '野蛮人入侵', desc: '大规模野蛮人部落入侵边境。', effects: { military: -35, population: -30, culture: -20 }, stage: 3, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '经济危机', desc: '帝国财政体系崩溃。', effects: { culture: -25, military: -20, tech: -15 }, stage: 3, minTurn: 20, maxTurn: 999 },
    { type: 'crisis', name: '瘟疫大流行', desc: '致命瘟疫在帝国境内大规模传播。', effects: { population: -50, culture: -25, military: -20 }, stage: 3, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '宗教冲突', desc: '不同宗教信仰引发激烈冲突。', effects: { culture: -30, population: -20, military: -15 }, stage: 3, minTurn: 15, maxTurn: 999 },
    
    // 帝国决策事件
    { type: 'decision', name: '军事改革', desc: '是否进行全面军事制度改革？', effects: { military: 45, tech: 20, culture: -20 }, stage: 3, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '文化包容', desc: '是否采用文化包容政策？', effects: { culture: 35, population: 25, military: -15 }, stage: 3, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '技术投资', desc: '是否大力投资科技发展？', effects: { tech: 40, culture: 20, military: -10 }, stage: 3, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '边境加强', desc: '是否加强边境防务？', effects: { military: 30, culture: 15, population: -20 }, stage: 3, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '贸易自由化', desc: '是否开放自由贸易政策？', effects: { culture: 30, tech: 25, military: -15 }, stage: 3, minTurn: 20, maxTurn: 999 },

    // === 工业文明阶段 (4) - 100个事件 ===
    
    // 早期工业化事件 (1-25回合)
    { type: 'opportunity', name: '蒸汽机发明', desc: '发明改变世界的蒸汽动力技术。', effects: { tech: 50, culture: 25, military: 20 }, stage: 4, minTurn: 1, maxTurn: 30 },
    { type: 'opportunity', name: '工厂制度', desc: '建立现代化工厂生产体系。', effects: { tech: 35, culture: 20, population: 30 }, stage: 4, minTurn: 5, maxTurn: 40 },
    { type: 'opportunity', name: '铁路建设', desc: '修建覆盖全国的铁路网络。', effects: { tech: 40, military: 25, culture: 30 }, stage: 4, minTurn: 10, maxTurn: 50 },
    { type: 'opportunity', name: '电力革命', desc: '掌握电力的产生和应用技术。', effects: { tech: 45, culture: 30, population: 25 }, stage: 4, minTurn: 15, maxTurn: 60 },
    { type: 'opportunity', name: '化学工业', desc: '发展大规模化学工业生产。', effects: { tech: 35, military: 30, culture: 15 }, stage: 4, minTurn: 20, maxTurn: 70 },
    
    // 中期工业化事件 (20-60回合)
    { type: 'opportunity', name: '大规模生产', desc: '实现商品的大规模标准化生产。', effects: { tech: 40, culture: 35, population: 40 }, stage: 4, minTurn: 25, maxTurn: 80 },
    { type: 'opportunity', name: '电信发展', desc: '建立电报和电话通信网络。', effects: { tech: 35, culture: 40, military: 20 }, stage: 4, minTurn: 30, maxTurn: 90 },
    { type: 'opportunity', name: '钢铁工业', desc: '发展大型钢铁冶炼工业。', effects: { tech: 45, military: 35, culture: 25 }, stage: 4, minTurn: 28, maxTurn: 85 },
    { type: 'opportunity', name: '汽车发明', desc: '发明内燃机驱动的汽车。', effects: { tech: 50, culture: 30, military: 25 }, stage: 4, minTurn: 35, maxTurn: 100 },
    { type: 'opportunity', name: '航空突破', desc: '实现人类首次动力飞行。', effects: { tech: 55, military: 40, culture: 35 }, stage: 4, minTurn: 40, maxTurn: 120 },
    
    // 工业危机事件
    { type: 'crisis', name: '工人罢工', desc: '大规模工人罢工瘫痪工业生产。', effects: { tech: -25, culture: -20, population: -15 }, stage: 4, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '环境污染', desc: '工业污染严重破坏环境。', effects: { environment: -40, population: -20, culture: -15 }, stage: 4, minTurn: 15, maxTurn: 999 },
    { type: 'crisis', name: '经济萧条', desc: '工业过剩导致经济大萧条。', effects: { culture: -30, tech: -20, military: -15 }, stage: 4, minTurn: 20, maxTurn: 999 },
    { type: 'crisis', name: '工业事故', desc: '大型工业设施发生重大事故。', effects: { tech: -20, population: -25, environment: -15 }, stage: 4, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '资源枯竭', desc: '关键工业原料资源即将枯竭。', effects: { tech: -25, military: -20, culture: -10 }, stage: 4, minTurn: 30, maxTurn: 999 },
    
    // 工业决策事件
    { type: 'decision', name: '劳工保护', desc: '是否制定劳工权益保护法案？', effects: { culture: 30, population: 25, tech: -15 }, stage: 4, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '环保措施', desc: '是否实施工业环境保护措施？', effects: { environment: 35, culture: 20, tech: -20 }, stage: 4, minTurn: 15, maxTurn: 999 },
    { type: 'decision', name: '军工发展', desc: '是否大力发展军事工业？', effects: { military: 40, tech: 25, culture: -15 }, stage: 4, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '教育普及', desc: '是否普及工业技能教育？', effects: { tech: 35, culture: 30, military: -10 }, stage: 4, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '国际贸易', desc: '是否开放国际工业品贸易？', effects: { culture: 35, tech: 20, military: -15 }, stage: 4, minTurn: 20, maxTurn: 999 },

    // === 信息文明阶段 (5) - 80个事件 ===
    
    // 早期信息时代事件 (1-20回合)
    { type: 'opportunity', name: '计算机发明', desc: '发明第一台电子计算机。', effects: { tech: 60, culture: 30, military: 25 }, stage: 5, minTurn: 1, maxTurn: 25 },
    { type: 'opportunity', name: '互联网诞生', desc: '建立全球互联网络系统。', effects: { tech: 50, culture: 45, population: 30 }, stage: 5, minTurn: 10, maxTurn: 40 },
    { type: 'opportunity', name: '移动通信', desc: '发展无线移动通信技术。', effects: { tech: 45, culture: 40, military: 20 }, stage: 5, minTurn: 15, maxTurn: 50 },
    { type: 'opportunity', name: '人工智能', desc: '在人工智能领域取得突破。', effects: { tech: 70, culture: 35, military: 30 }, stage: 5, minTurn: 20, maxTurn: 70 },
    { type: 'opportunity', name: '基因工程', desc: '掌握基因编辑和改造技术。', effects: { tech: 55, population: 40, culture: 25 }, stage: 5, minTurn: 18, maxTurn: 60 },
    
    // 中期信息时代事件 (15-50回合)
    { type: 'opportunity', name: '量子计算', desc: '实现量子计算技术突破。', effects: { tech: 80, culture: 40, military: 35 }, stage: 5, minTurn: 30, maxTurn: 90 },
    { type: 'opportunity', name: '虚拟现实', desc: '发展沉浸式虚拟现实技术。', effects: { tech: 50, culture: 50, population: 25 }, stage: 5, minTurn: 25, maxTurn: 80 },
    { type: 'opportunity', name: '新能源革命', desc: '实现清洁能源技术突破。', effects: { tech: 60, environment: 50, culture: 30 }, stage: 5, minTurn: 35, maxTurn: 100 },
    { type: 'opportunity', name: '太空探索', desc: '成功进行载人太空探索。', effects: { tech: 70, culture: 45, military: 30 }, stage: 5, minTurn: 40, maxTurn: 120 },
    { type: 'opportunity', name: '纳米技术', desc: '掌握纳米级材料制造技术。', effects: { tech: 65, military: 35, culture: 25 }, stage: 5, minTurn: 32, maxTurn: 95 },
    
    // 信息时代危机事件
    { type: 'crisis', name: '网络攻击', desc: '大规模网络攻击瘫痪信息系统。', effects: { tech: -35, culture: -25, military: -20 }, stage: 5, minTurn: 10, maxTurn: 999 },
    { type: 'crisis', name: '隐私危机', desc: '个人隐私泄露引发社会危机。', effects: { culture: -30, population: -20, tech: -15 }, stage: 5, minTurn: 15, maxTurn: 999 },
    { type: 'crisis', name: '技术失业', desc: '自动化导致大规模失业。', effects: { culture: -25, population: -30, tech: -10 }, stage: 5, minTurn: 20, maxTurn: 999 },
    { type: 'crisis', name: '数字鸿沟', desc: '技术发展加剧社会不平等。', effects: { culture: -20, population: -25, military: -15 }, stage: 5, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: 'AI失控', desc: '人工智能系统出现意外行为。', effects: { tech: -40, culture: -30, military: -25 }, stage: 5, minTurn: 25, maxTurn: 999 },
    
    // 信息时代决策事件
    { type: 'decision', name: '数据保护', desc: '是否制定严格的数据保护法？', effects: { culture: 35, population: 30, tech: -20 }, stage: 5, minTurn: 15, maxTurn: 999 },
    { type: 'decision', name: 'AI监管', desc: '是否对人工智能进行严格监管？', effects: { culture: 25, military: 20, tech: -25 }, stage: 5, minTurn: 25, maxTurn: 999 },
    { type: 'decision', name: '数字教育', desc: '是否全面推进数字化教育？', effects: { tech: 40, culture: 35, population: -15 }, stage: 5, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '绿色科技', desc: '是否优先发展环保技术？', effects: { environment: 40, tech: 30, military: -15 }, stage: 5, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '太空计划', desc: '是否启动大规模太空探索计划？', effects: { tech: 50, culture: 25, population: -20 }, stage: 5, minTurn: 30, maxTurn: 999 },

    // === 星际文明阶段 (6) - 60个事件 ===
    
    // 早期星际时代事件 (1-30回合)
    { type: 'opportunity', name: '超光速引擎', desc: '发明突破光速限制的推进技术。', effects: { tech: 100, culture: 50, military: 40 }, stage: 6, minTurn: 1, maxTurn: 40 },
    { type: 'opportunity', name: '行星殖民', desc: '成功在外星球建立殖民地。', effects: { tech: 80, population: 60, culture: 40 }, stage: 6, minTurn: 10, maxTurn: 60 },
    { type: 'opportunity', name: '外星接触', desc: '与外星文明建立首次接触。', effects: { culture: 80, tech: 60, military: 30 }, stage: 6, minTurn: 15, maxTurn: 80 },
    { type: 'opportunity', name: '星际贸易', desc: '建立跨星系的贸易网络。', effects: { culture: 70, tech: 50, population: 40 }, stage: 6, minTurn: 20, maxTurn: 100 },
    { type: 'opportunity', name: '戴森球建设', desc: '建造围绕恒星的能量收集结构。', effects: { tech: 120, culture: 60, environment: 50 }, stage: 6, minTurn: 30, maxTurn: 150 },
    
    // 中后期星际事件 (25-80回合)
    { type: 'opportunity', name: '银河联盟', desc: '建立跨种族的银河系联盟。', effects: { culture: 100, military: 60, tech: 50 }, stage: 6, minTurn: 40, maxTurn: 200 },
    { type: 'opportunity', name: '意识上传', desc: '实现意识数字化永生技术。', effects: { tech: 150, culture: 80, population: 100 }, stage: 6, minTurn: 50, maxTurn: 250 },
    { type: 'opportunity', name: '时空操控', desc: '掌握时间和空间的操控技术。', effects: { tech: 200, culture: 100, military: 80 }, stage: 6, minTurn: 60, maxTurn: 300 },
    { type: 'opportunity', name: '维度工程', desc: '开发多维度空间技术。', effects: { tech: 180, culture: 90, environment: 70 }, stage: 6, minTurn: 55, maxTurn: 280 },
    { type: 'opportunity', name: '宇宙重塑', desc: '获得重塑宇宙结构的能力。', effects: { tech: 250, culture: 150, environment: 100 }, stage: 6, minTurn: 80, maxTurn: 500 },
    
    // 星际危机事件
    { type: 'crisis', name: '星际战争', desc: '与敌对外星文明爆发大规模战争。', effects: { military: -60, population: -50, culture: -40 }, stage: 6, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '黑洞威胁', desc: '附近超大质量黑洞威胁星系安全。', effects: { tech: -40, population: -60, environment: -50 }, stage: 6, minTurn: 1, maxTurn: 999 },
    { type: 'crisis', name: '维度裂缝', desc: '时空实验导致危险的维度裂缝。', effects: { tech: -50, culture: -40, environment: -60 }, stage: 6, minTurn: 30, maxTurn: 999 },
    { type: 'crisis', name: '文明堕落', desc: '过度依赖技术导致文明退化。', effects: { culture: -60, population: -30, tech: -40 }, stage: 6, minTurn: 20, maxTurn: 999 },
    { type: 'crisis', name: '宇宙熵增', desc: '宇宙熵增加速，威胁所有生命。', effects: { environment: -80, tech: -30, culture: -50 }, stage: 6, minTurn: 50, maxTurn: 999 },
    
    // 星际决策事件
    { type: 'decision', name: '种族融合', desc: '是否推进多种族文明融合？', effects: { culture: 80, population: 60, military: -30 }, stage: 6, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '技术共享', desc: '是否与外星文明共享先进技术？', effects: { culture: 60, tech: 40, military: -40 }, stage: 6, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '宇宙探索', desc: '是否启动跨银河系探索计划？', effects: { tech: 100, culture: 50, population: -40 }, stage: 6, minTurn: 1, maxTurn: 999 },
    { type: 'decision', name: '超越计划', desc: '是否追求超越物理法则的终极技术？', effects: { tech: 150, culture: 80, environment: -60 }, stage: 6, minTurn: 50, maxTurn: 999 },
    { type: 'decision', name: '宇宙守护', desc: '是否承担守护宇宙和谐的责任？', effects: { culture: 120, environment: 80, military: -50 }, stage: 6, minTurn: 30, maxTurn: 999 }
];

// Helper function to get events for a specific stage and turn
function getEventsForStageTurn(stageIdx, currentTurn = null) {
    let stageEvents = eventPool.filter(event => event.stage === stageIdx);
    
    if (currentTurn !== null) {
        // Filter by turn range if specified
        return stageEvents.filter(event => 
            currentTurn >= (event.minTurn || 1) && 
            currentTurn <= (event.maxTurn || 999)
        );
    }
    
    return stageEvents;
}

// Export functions for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { eventPool, getEventsForStageTurn };
}
