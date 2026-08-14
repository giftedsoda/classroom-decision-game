"use strict";

const STORAGE_KEY = "growth-path-classroom-v1";
const SAVE_SLOTS_KEY = "growth-path-classroom-saves-v1";
const MAX_ROUNDS = 6;
const TEAM_COLORS = ["#1f5b46", "#3d6681", "#a94a42", "#68597b", "#8a6426", "#52604b"];
const CORE_KEYS = ["courage", "knowledge", "time"];
const RESOURCE_META = {
  courage: { name: "勇气", max: 12 },
  knowledge: { name: "知识", max: 12 },
  time: { name: "时间", max: 12 },
  energy: { name: "能量币", max: 6 },
};
const ROLES = ["掷骰与移动员", "事件卡朗读员", "资源管理员", "风险评估员", "方案记录员", "时间提醒员", "发言人", "支持观察员"];
const STUDENT_PROFILES = [
  { id:"xiaocheng", name:"林晓晨", background:"住在城市另一端，和妈妈、外婆一起生活。做事有计划，也习惯把麻烦留给自己解决。", story:[
    "林晓晨家离学校很远，每天六点多就要出门。妈妈在社区医院上早班，外婆负责准备早饭；晚上三个人常常要到八点后才能一起吃饭。晓晨不愿让家人担心，总说“我在车上已经复习过了”。",
    "晓晨喜欢画公交线路和整理手账，书桌上的计划表总是很清楚。可是计划一旦被堵车、临时值日或家里的事情打乱，就容易因为“今天没有照表完成”而闷闷不乐，也不太会主动删减任务。"
  ], family:"和妈妈、外婆同住；家人关系亲近，但三个人的作息经常错开。", personality:"安静、可靠，喜欢手账和画路线图；不愿意给别人添麻烦。", goal:"稳住数学基础，同时给计划留下弹性", strength:"执行力强，能把大任务拆成小步骤，也很守时。", weakness:"计划被打乱时容易自责，常把所有任务都硬塞回当天。", pressure:"长距离通勤、整块时间少、遇事不爱求助", challenges:[
    { title:"公交临时改线", text:"晚高峰公交临时改线，林晓晨回家比平时晚了四十分钟。妈妈还在值班，外婆等着一起吃饭，原定的数学订正和英语背诵也撞在了一起。", effects:{time:-2}, task:"替晓晨重新排序今晚的任务：保留一项、缩短一项、明确延后一项。" },
    { title:"计划表被打乱", text:"晓晨原本准备在车上背单词，可车厢太拥挤，一页也没看成。到家后又想把所有内容补回来，结果盯着计划表迟迟没有开始。", effects:{knowledge:-1,time:-1}, task:"设计一个不依赖通勤环境的备用方案，并写一句允许计划改变的话。" }
  ]},
  { id:"yutong", name:"周雨桐", background:"和父母、读小学的弟弟生活在一起。表达细腻、很会照顾别人，却害怕暴露自己的不会。", story:[
    "周雨桐的爸爸常出差，妈妈在家附近工作，放学后雨桐会先陪弟弟写一会儿作业。家里很重视学习，但大人问起成绩时，最常说的是“你一直很稳，我们不担心你”。这句话既是信任，也让雨桐更怕让大家失望。",
    "雨桐喜欢读小说、给同学写生日卡，也擅长把课堂笔记整理得清清楚楚。朋友遇到烦恼时总愿意找她，可轮到自己不会物理题时，她会把问题写进本子，却担心提问显得基础差。"
  ], family:"与父母、弟弟同住；常照顾弟弟，家人信任她，也默认她不太需要帮助。", personality:"细腻、有同理心，喜欢阅读和写卡片；在意别人怎么看自己。", goal:"补上物理薄弱点，练习把“不懂”说出口", strength:"表达和整理能力强，善于倾听，也能发现细节。", weakness:"过分维护“表现稳定”的形象，遇到难题容易拖延求助。", pressure:"害怕让家人失望，也担心提问会显得自己不够好", challenges:[
    { title:"问题写了却没问", text:"周雨桐把一道反复做错的电学题抄进错题本，课后答疑时却又把手放下了。晚上妈妈说“你一向让人省心”，她更不知道该怎么开口。", effects:{knowledge:-1,courage:-1}, task:"替雨桐写一句可以直接向老师或同伴提出的问题，不解释也不道歉。" },
    { title:"弟弟打断复习", text:"弟弟拿着作业来求助，雨桐不忍心拒绝，原定的物理订正被推迟。等弟弟睡下，她已经很累，却仍不愿告诉家人自己需要安静时间。", effects:{time:-2}, task:"设计一句友善但清楚的边界表达，并安排一个之后帮助弟弟的时间。" }
  ]},
  { id:"zihang", name:"陈子航", background:"校篮球队后卫，和父母住在学校附近。热情、有行动力，但经常高估自己剩下的体力和时间。", story:[
    "陈子航的爸爸年轻时也爱打球，常陪他看比赛；妈妈支持训练，却担心中考前受伤和成绩波动。家里没有要求他退出校队，但每次晚归看到餐桌上留的饭菜，子航都会觉得自己两边都不能辜负。",
    "他在队里会主动鼓励失误的同伴，也不怕重复练基本功。可一到学习计划上，常凭一句“我晚上补得完”接下太多任务。训练后明明已经很累，仍会硬撑着刷难题，第二天才发现效率很低。"
  ], family:"与父母同住；父亲理解运动热爱，母亲担心备考节奏，家里会讨论但没有替他决定。", personality:"外向、讲义气，喜欢篮球和比赛；遇事先行动，较少停下来估算代价。", goal:"保留篮球训练，同时建立可持续的复习节奏", strength:"有毅力、团队意识强，失败后愿意再试一次。", weakness:"容易高估体力和时间，不擅长提前沟通冲突。", pressure:"训练与复习撞期，也担心辜负队友和家人的支持", challenges:[
    { title:"训练与模拟考冲突", text:"教练临时安排加训，正好撞上模拟考订正。队友说少一个后卫很难练，妈妈也提醒他别再把订正拖到深夜。陈子航无法把两件事都完整做完。", effects:{time:-2}, task:"提出一个包含提前沟通、明确取舍和补做时间的方案。" },
    { title:"训练后还想硬撑", text:"训练结束后双腿发酸，陈子航仍照计划打开压轴题。二十分钟过去，他反复看同一个条件，却不肯承认今天的体力已经见底。", effects:{knowledge:-1,time:-1}, task:"把今晚的任务改成适合疲惫状态的版本，并写出停止条件。" }
  ]},
  { id:"siqi", name:"赵思齐", background:"因为父亲工作调动刚转学，和父母搬进新的小区。独立、观察力强，但习惯等别人先接纳自己。", story:[
    "赵思齐以前一直和爷爷奶奶住得很近，这学期跟着父母搬到新城市。父母也在适应新工作，常问“新学校还好吗”，思齐每次都回答“挺好的”，不想让他们觉得搬家是一个错误。周末还会和旧同学视频，却很少提自己在新班级的尴尬。",
    "思齐喜欢拼模型和拍建筑照片，面对陌生环境会先认真观察规则。这样的谨慎让他很少出错，也让他在小组讨论里错过开口时机；有时别人以为他不想参与，其实他只是还没确定怎样加入。"
  ], family:"随父母刚搬到新城市；和爷爷奶奶、旧同学保持联系，三个人都在适应新生活。", personality:"独立、谨慎，喜欢模型和建筑摄影；熟悉以后会有不少幽默想法。", goal:"跟上复习节奏，并建立至少一段可靠的同伴连接", strength:"观察和整理能力强，能在陌生信息中找到规律。", weakness:"过于等待合适时机，很少主动说明自己缺少什么。", pressure:"教材进度、同伴关系和生活环境同时变化", challenges:[
    { title:"缺了一份旧资料", text:"老师提到上月讲过的专题资料，赵思齐转学后没有拿到。父母最近都在加班，他不想再拿学校的事让他们操心，也不知道该先问谁。", effects:{knowledge:-1,courage:-1}, task:"列出两条获取资料的路径，并替思齐写出第一句询问。" },
    { title:"小组讨论插不上话", text:"同伴已经形成固定分工，赵思齐几次想补充自己的思路，却都慢了一步。大家不是故意忽略他，但也没有意识到他一直没发言。", effects:{courage:-2}, task:"设计一句加入讨论的开场白，再给小组写一条主动邀请新成员的做法。" }
  ]},
  { id:"jianing", name:"何嘉宁", background:"和父母、爷爷同住，成绩一直比较稳定。认真负责、善于总结，也会把一次失误看得过重。", story:[
    "何嘉宁的父母工作忙，爷爷负责接送和晚饭。家人很为她自豪，亲戚聚会时常问排名。父母会说“别给自己太大压力”，却也会忍不住追问每道错题为什么丢分。嘉宁知道大家是关心她，因此更想维持那个“从不让人担心”的自己。",
    "她喜欢烘焙，做饼干时会精确称量每一种材料；学习上也擅长建立错题索引和检查清单。可一旦结果不如预期，就会反复检查、否定原来的方法，甚至为了做对一道难题挤掉休息和其他科目。"
  ], family:"与父母、爷爷同住；家人为她骄傲，也容易把关心集中在成绩和排名上。", personality:"认真、自律，喜欢烘焙和制作清单；对自己比对别人严格得多。", goal:"保持稳定应考节奏，学会把失误当作信息", strength:"基础扎实、复盘细致，能长期坚持并对承诺负责。", weakness:"完美主义，容易把局部失误扩大成对自己的否定。", pressure:"害怕成绩波动，也害怕辜负家人的信任", challenges:[
    { title:"亲戚问起排名", text:"模拟考总分只下降几分，但排名变化明显。晚饭时亲戚在电话里随口问“这次还是前面吧”，何嘉宁笑着带过，回房后却反复比较成绩单，迟迟没有开始复盘。", effects:{courage:-2}, task:"把“我退步了”改写成一个可验证、可行动的问题。" },
    { title:"一道难题耗时过久", text:"何嘉宁想把一道压轴题彻底做对，不知不觉用掉了原计划复习三科的时间。爷爷提醒她休息，她却觉得现在停下就是认输。", effects:{time:-3}, task:"为难题设置停止条件，并安排之后的回看时间。" }
  ]},
  { id:"chenan", name:"吴辰安", background:"父母轮班，很多晚上需要自己安排学习和晚饭。好奇、学得快，也很容易被新鲜信息带走注意力。", story:[
    "吴辰安的父母都实行轮班制，一家人的晚饭时间不固定。父母会在家庭群里提醒作业和睡觉，辰安通常回复得很快，却常常一边吃饭、一边看班级消息和学习视频。没有人盯着时，他享受自主，也会把“再看一个”拖到很晚。",
    "辰安喜欢拆旧电子产品、研究软件功能，遇到新方法往往一下就能理解。他也乐于给同学介绍工具，但对重复练习很快失去耐心；做题卡住时，会不断切换视频和应用，感觉自己一直在学习，真正完成的任务却不多。"
  ], family:"与父母同住；父母轮班、陪伴时间不固定，家庭沟通很多通过手机完成。", personality:"好奇、反应快，喜欢电子产品和研究新工具；讨厌单调和等待。", goal:"建立稳定专注时段，把“知道方法”变成“完成练习”", strength:"理解新概念快，敢尝试工具，也愿意分享发现。", weakness:"容易追逐新鲜感，低估切换任务和晚睡的成本。", pressure:"晚上缺少固定节奏，手机既是联系工具也是干扰来源", challenges:[
    { title:"家庭群与班级群同时响", text:"妈妈在家庭群里问有没有吃饭，班级群又连续发布通知。吴辰安每次都顺手点开，原本四十分钟的练习被切成很多小段。", effects:{time:-2}, task:"设计一个不漏重要联系、又能保护专注时间的手机使用规则。" },
    { title:"新方法看了很多", text:"吴辰安连续收藏了三个“中考提分方法”视频，觉得每个都有用。到了睡觉时间，真正需要提交的练习还没完成，第二天模拟考又看错了熟悉题目的条件。", effects:{knowledge:-1,time:-1}, task:"替辰安选定今晚唯一要完成的任务，并制定停止浏览的时间。" }
  ]}
];
const STORY_CHAPTERS = [
  { round:1, stage:"第一周 · 目标盘点", title:"把四十二天摊在桌面上", line:"第一张计划表不是写满任务，而是先弄清谁正在过怎样的生活。", body:[
    "周一早读铃响前，班主任把一张四十二天的月历贴在黑板右侧。最后一天被红笔圈住，前面的格子却都是空的。有人立刻开始数还能做几套卷子，也有人盯着那只红圈，半天没有翻开书。老师没有发统一计划表，只让六组把各自的人物档案放在桌面中央。",
    "林晓晨的公交车每天几点到站，周雨桐为什么把不会的题藏进错题本，陈子航训练结束后还剩多少体力，这些细节都写在档案里。老师在黑板上画出三栏：勇气、知识、时间。勇气不是胆子大不大，而是愿不愿意面对薄弱项；知识要靠订正、提问和练习留下来；时间则会被通勤、家庭、训练和睡眠一点点占用。",
    "第一个小组把棋子放在起点。骰子决定这周计划推进得顺不顺，落脚格则会把档案里的生活带进游戏：可能遇到帮得上忙的人，也可能突然撞上原本没有写进计划的事情。"
  ], cue:"本轮开始前，先替这位学生圈出最需要保护的一项资源。掷骰后记录：这一步为什么值得走，哪件事暂时不能同时做到？" },
  { round:2, stage:"第二周 · 复习分岔", title:"星期六只能过一次", line:"补习、家人、训练和休息排在同一天，选择开始留下代价。", body:[
    "第二周的星期五，班级群里接连弹出三条通知：周末有一次自愿参加的专题讲解，体育馆训练时间临时提前，下周一还要收一份综合练习。消息发出不到十分钟，六份原本整齐的计划表都出现了划痕。",
    "周雨桐答应陪弟弟去图书馆，陈子航的队友在等训练安排，何嘉宁想把错题全部重新做一遍。每件事单独看都合理，放在同一个周末却不可能全部完成。走到抉择格时，小组必须替人物选一条路：稳健路线能补一项资源或留下风险护盾；冲刺路线能让下轮多走一步，但要立刻支付勇气或时间。",
    "没有哪一个按钮写着“正确答案”。选择补习可能增加知识，也会挤掉休息和家庭时间；选择外出可能让人重新有力气，也意味着一些练习要另找时间。选择之后，计划表上的空白必须由小组自己解释。"
  ], cue:"遇到抉择卡时，用完整的一句话回答：“我们选择……，会得到……，同时愿意承担……。”理由必须符合人物档案，不能只看资源数字。" },
  { round:3, stage:"第三周 · 模拟考后", title:"成绩单发下来的那节课", line:"同一张成绩单落到不同人手里，会触发完全不同的反应。", body:[
    "周三下午最后一节课，模拟考答题卡从第一排传到最后一排。教室里先是纸张摩擦的声音，随后有人轻轻叹气，有人赶紧去看同桌的总分。班主任没有马上讲排名，只在黑板上写了三个问题：错在哪里？为什么会错？明天能做哪一步？",
    "林晓晨发现两道会做的题来不及写完；周雨桐又把想问的问题压在书下面；何嘉宁只盯着排名变化，没注意到大部分基础题仍然稳定。挑战格会从人物自己的生活和习惯里抽出一件事，小组不能用“以后更努力”结束讨论，必须写下一条第二天就能执行的补救办法。",
    "这一轮结束时，全班还会共同遇到一次变化：薄弱项集中暴露、老师提供新的复盘方法，或者原定安排突然冲突。公共事件会同时改变六组资源，但每个人承受变化的方式仍然不同。"
  ], cue:"处理专属挑战时，先说人物最可能出现的第一反应，再给出一个具体动作。第三轮结束前由教师发布一次公共事件，六组共同承担结果。" },
  { round:4, stage:"第四周 · 同伴互助", title:"晚自习后还亮着的两盏灯", line:"有人缺时间，有人缺方法，也有人只是缺一句“你可以问我”。", body:[
    "晚自习结束后，教室里还留着几个人。赵思齐在找转学前缺失的复习资料，吴辰安刚发现一个好用的错题整理工具，周雨桐把一道电学题写了三种问法，却还没决定去问谁。大家手里都有一点别人暂时缺少的东西。",
    "合作不是免费获得资源。发起合作的两组都要先支付一点勇气，因为开口求助、承认自己缺少什么，或者把自己的时间分给别人，都需要做决定。一组最多转移两点勇气、知识或时间；资源管理员要真实记录这次帮助由谁付出、由谁收到。",
    "讲完一道题不等于替别人完成复习，借出时间也不能解决所有问题。合作完成后，两组都要说一句理由：一方说明为什么愿意帮，另一方说明准备怎样使用这份帮助。"
  ], cue:"本局每组只有一次发起合作的机会。不要等资源归零才考虑求助；先判断谁拥有对方此刻最缺的资源，再决定是否支付勇气。" },
  { round:5, stage:"第五周 · 压力管理", title:"计划表开始装不下的时候", line:"越接近中考，越容易把焦虑误写成更多任务。", body:[
    "倒计时进入最后十天，课桌上的纸越来越多：准考证通知、错题清单、家长写来的提醒、还没有完成的专题卷。陈子航训练后睡得更晚，吴辰安收藏的新方法比做完的练习多，林晓晨的计划表边缘已经写满了补做标记。",
    "如果勇气、知识或时间降到零，棋子不会被淘汰，但会进入调整状态。下一轮固定前进三格，也不能继续获得能量币。小组必须停下来写出一条调整策略：删掉什么、把什么拆小、向谁求助、什么时候停止。写清楚以后，人物才能继续走。",
    "能量币在这一周尤其重要。它可以换一次重掷，也可以抵消一点眼前的损失，却不能把所有代价抹掉。资源管理员要提醒全组：这枚币现在用掉，是为了保护哪一个更重要的安排？"
  ], cue:"若进入调整状态，不接受“合理安排时间”这类空话。策略必须包含一个动作、一个时间点和一个可以求助的人；使用能量币前也要说清保护目标。" },
  { round:6, stage:"第六周 · 考场前夜", title:"书包里最后留下什么", line:"最后一周不再添加宏大的计划，只留下考场里用得上的动作。", body:[
    "考点通知发下来后，班主任用一节班会检查准考证、文具、路线和作息。黑板上没有新的知识清单，只写着四句话：先看清题目；卡住时先跳过；留出检查时间；紧张时把注意力放回下一步。",
    "六组的棋子陆续靠近第25格。有人已经抵达考场，有人还差两三步，但每张路线图上都留下了选择和修改的痕迹。资源的多少不再只是结算数字：勇气记录曾经怎样面对害怕的事，知识记录哪些不会的内容被弄懂，时间记录哪些安排被保住、哪些被放下。",
    "最后的成长策略单要从游戏记录里找证据。小组需要挑出一次关键选择、一次付出的代价、一次受挫后的调整，再把它改写成考试当天或日常学习中能够直接照做的步骤。"
  ], cue:"结算前翻看本组行动记录，不要临时编一句口号。用“当……发生时，我们先……，如果仍然……，就……”写出一条可以执行的策略。" },
];
const STORY_PROLOGUE = {
  stage:"序章 · 倒计时启动", title:"距离中考还有六周",
  body:[
    "周一早读前，班主任关掉投影，在黑板中央写下“距离中考四十二天”。粉笔停了一会儿，又在下面补了一句：“这四十二天，不会按照计划安静地过去。”教室后排有人在算还能刷多少套题，前排有人把刚发下来的模拟卷折进书里。",
    "讲台上摆着六个牛皮纸档案袋和一张25格路线图。档案里不是成绩排名，而是六个同龄人的生活：谁每天要坐很久的公交，谁要照顾弟弟，谁舍不得离开球队，谁刚刚转进这个班。"
  ],
  mission:"每个小组支持一位虚构学生，替他或她走过接下来的六周。骰子会带来计划之外的变化，落脚格会触发机遇、挑战和抉择；勇气、知识与时间会增加，也会因为具体选择被消耗。你们不需要替人物安排一条完美路线，只需要让每一步都说得出理由，并在走不动时改一次计划。",
};

if (document.documentElement.dataset.gameMode !== "classCards") {
const tiles = [
  [1,"start","起点","整装出发"], [2,"opportunity","机遇","抽取机遇卡"], [3,"normal","普通","继续前进"],
  [4,"choice","抉择","稳健 / 冲刺"], [5,"challenge","挑战","抽取挑战卡"], [6,"normal","普通","继续前进"],
  [7,"resource","资源","勇气 +2"], [8,"opportunity","机遇","抽取机遇卡"], [9,"normal","普通","继续前进"],
  [10,"choice","抉择","稳健 / 冲刺"], [11,"challenge","挑战","抽取挑战卡"], [12,"opportunity","机遇","抽取机遇卡"],
  [13,"normal","普通","继续前进"], [14,"resource","资源","知识 +2"], [15,"challenge","挑战","抽取挑战卡"],
  [16,"choice","抉择","稳健 / 冲刺"], [17,"normal","普通","继续前进"], [18,"opportunity","机遇","抽取机遇卡"],
  [19,"challenge","挑战","抽取挑战卡"], [20,"resource","资源","时间 +3"], [21,"normal","普通","继续前进"],
  [22,"choice","抉择","稳健 / 冲刺"], [23,"opportunity","机遇","抽取机遇卡"], [24,"challenge","挑战","抽取挑战卡"],
  [25,"finish","中考考场","考前结算"],
].map(([number,type,title,effect]) => ({ number,type,title,effect }));

const opportunityCards = [
  { title:"参加竞赛并获奖", text:"你的投入被看见，也收获了新的经验。", effects:{knowledge:2,energy:1} },
  { title:"被老师公开表扬", text:"一次肯定，让你更愿意表达自己的想法。", effects:{courage:1} },
  { title:"多出三天自由时间", text:"意外空出的时间，可以重新安排计划。", effects:{time:3} },
  { title:"认识志同道合的朋友", text:"同行者带来支持，也带来新的见识。", effects:{courage:1,knowledge:1} },
  { title:"发现免费学习平台", text:"合适的工具提高了学习效率。", effects:{knowledge:2} },
  { title:"家人给予大力支持", text:"被理解和支持，让你更有力量继续前进。", effects:{courage:2} },
];

const decisionCards = [
  { title:"周末怎样安排？", text:"参加补习班，还是和家人外出？", a:{label:"参加补习班",effects:{knowledge:2,time:-2}}, b:{label:"和家人外出",effects:{courage:2,time:-1}} },
  { title:"发现同学作弊", text:"告诉老师真实情况，还是暂时假装没看见？", a:{label:"告诉老师",effects:{courage:2}}, b:{label:"假装没看见",effects:{courage:-1,time:1}} },
  { title:"选择发展方向", text:"选择感兴趣的方向，还是看起来更稳妥的方向？", a:{label:"选择兴趣",effects:{courage:1,knowledge:1}}, b:{label:"选择稳妥",effects:{time:2}} },
  { title:"是否申请班干部？", text:"申请锻炼自己，还是暂时专注学习？", a:{label:"申请班干部",effects:{courage:1,energy:1}}, b:{label:"专注学习",effects:{knowledge:2}} },
];

function newTeam(index) {
  const profile = STUDENT_PROFILES[index];
  return {
    id:index + 1, profileId:profile.id, name:profile.name, color:TEAM_COLORS[index], position:1,
    resources:{courage:5,knowledge:5,time:10,energy:0},
    completedTurn:false, usedEnergy:false, usedCooperation:false, sprintBonus:false,
    troubleNext:false, troubleActive:false, troubleStrategy:"", shield:0, finished:false,
    history:[], strategy:{choice:"",cost:"",challenge:"",adjustment:"",transfer:""}, score:null,
  };
}

function initialState() {
  return { phase:"setup", round:1, activeTeam:0, rolled:null, pendingMove:0, publicEventDone:false, sound:true, story:{prologueSeen:false,chaptersSeen:[],profilesSeen:[]}, undoVersion:3, undoStack:[], teams:Array.from({length:6},(_,i)=>newTeam(i)) };
}

let state = normalizeState(loadState() || initialState());
let modalLocked = false;
let tokenMoving = false;

const $ = (id) => document.getElementById(id);
const els = {
  board:$("board"), phaseLabel:$("phaseLabel"), roundLabel:$("roundLabel"), teacherMessage:$("teacherMessage"),
  publicEventButton:$("publicEventButton"), teamBadge:$("teamBadge"), currentTeamTitle:$("currentTeamTitle"),
  resourceGrid:$("resourceGrid"), conditionChip:$("conditionChip"), positionLabel:$("positionLabel"), roleLabel:$("roleLabel"),
  die:$("die"), movePreview:$("movePreview"), actionButton:$("actionButton"), energyButton:$("energyButton"),
  cooperateButton:$("cooperateButton"), undoButton:$("undoButton"), restartGameButton:$("restartGameButton"), turnNote:$("turnNote"), teamList:$("teamList"), progressCopy:$("progressCopy"),
  resetButton:$("resetButton"), saveButton:$("saveButton"), helpButton:$("helpButton"), storyButton:$("storyButton"), storyRibbon:$("storyRibbon"),
  storyStage:$("storyStage"), storyChapter:$("storyChapter"), storyLine:$("storyLine"), soundButton:$("soundButton"), renameButton:$("renameButton"),
  studentBackground:$("studentBackground"), studentGoal:$("studentGoal"), studentStrength:$("studentStrength"), studentPressure:$("studentPressure"),
  modalBackdrop:$("modalBackdrop"), modal:$("modal"), modalClose:$("modalClose"), modalKicker:$("modalKicker"),
  modalTitle:$("modalTitle"), modalBody:$("modalBody"), modalActions:$("modalActions"),
};

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function normalizeState(value) {
  value.story ||= {prologueSeen:value.phase !== "setup",chaptersSeen:[]};
  value.story.chaptersSeen ||= [];
  value.story.profilesSeen ||= [];
  if (value.undoVersion !== 3) {
    value.undoVersion = 3;
    value.undoStack = (value.undoStack || []).filter(entry => !/^查看.+背景$/.test(entry.label));
  }
  value.undoStack ||= [];
  value.teams ||= Array.from({length:6},(_,i)=>newTeam(i));
  value.teams.forEach((team,index) => {
    const profile = STUDENT_PROFILES[index];
    if (!team.profileId) { team.profileId = profile.id; team.name = profile.name; }
  });
  return value;
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function captureUndoState() {
  const snapshot = JSON.parse(JSON.stringify(state));
  snapshot.undoStack = [];
  return snapshot;
}
function pushUndoStep(label) {
  state.undoStack ||= [];
  state.undoStack.push({label,state:captureUndoState()});
}
function undoLastStep() {
  if (tokenMoving || !state.undoStack?.length) return;
  const remaining = state.undoStack;
  const entry = remaining.pop();
  state = normalizeState(entry.state);
  state.undoStack = remaining;
  tokenMoving = false;
  forceCloseModal();
  saveState(); render(); playTone(330,.08);
  if (state.phase === "setup") showPrologue();
}
function undoModalAction() {
  return {label:`↶ 撤回：${state.undoStack.at(-1)?.label || "上一项操作"}`,secondary:true,onClick:undoLastStep};
}
function loadSaveSlots() {
  try { return JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY)) || {}; } catch { return {}; }
}
function formatSaveTime(value) {
  if (!value) return "空档位";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "已有存档" : date.toLocaleString("zh-CN", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });
}
function saveSummary(snapshot) {
  if (!snapshot?.state) return "空档位";
  const savedState = snapshot.state;
  const positions = (savedState.teams || []).map(team => team.position).join(" / ");
  const round = savedState.phase === "setup" ? "尚未开始" : `第${savedState.round || 1}轮`;
  return `${round} · 位置 ${positions || "-"}`;
}
function saveSnapshot(slot) {
  const slots = loadSaveSlots();
  slots[slot] = { savedAt: new Date().toISOString(), state: JSON.parse(JSON.stringify(state)) };
  localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
  showSaveLoadModal(`已保存到档位 ${slot}`);
}
function loadSnapshot(slot) {
  const snapshot = loadSaveSlots()[slot];
  if (!snapshot?.state) return;
  state = normalizeState(JSON.parse(JSON.stringify(snapshot.state)));
  saveState(); forceCloseModal(); render();
}
function deleteSnapshot(slot) {
  const slots = loadSaveSlots();
  delete slots[slot];
  localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
  showSaveLoadModal(`已清除档位 ${slot}`);
}
function showSaveLoadModal(message="") {
  const slots = loadSaveSlots();
  const slotMarkup = [1,2,3].map(slot => {
    const snapshot = slots[slot];
    return `<article class="save-slot ${snapshot ? "has-save" : "empty"}">
      <div><strong>档位 ${slot}</strong><span>${snapshot ? formatSaveTime(snapshot.savedAt) : "尚未存档"}</span><small>${snapshot ? saveSummary(snapshot) : "保存当前六周备考进度"}</small></div>
      <div class="save-slot-actions"><button class="secondary-button" data-save="${slot}">保存</button><button class="secondary-button" data-load="${slot}" ${snapshot ? "" : "disabled"}>读档</button><button class="text-button save-delete" data-delete="${slot}" ${snapshot ? "" : "disabled"}>清除</button></div>
    </article>`;
  }).join("");
  openModal({kicker:"本地存档",title:"保存或读取备考进度",body:`<p>存档保存在当前浏览器中，适合课间暂停或更换小组继续体验。</p>${message ? `<div class="save-message">${message}</div>` : ""}<div class="save-slots">${slotMarkup}</div>`,actions:[{label:"关闭",onClick:forceCloseModal}]});
  [1,2,3].forEach(slot => {
    els.modalBody.querySelector(`[data-save="${slot}"]`)?.addEventListener("click", () => saveSnapshot(slot));
    els.modalBody.querySelector(`[data-load="${slot}"]`)?.addEventListener("click", () => loadSnapshot(slot));
    els.modalBody.querySelector(`[data-delete="${slot}"]`)?.addEventListener("click", () => deleteSnapshot(slot));
  });
}
function activeTeam() { return state.teams[state.activeTeam]; }
function studentProfile(team) { return STUDENT_PROFILES.find(profile => profile.id === team.profileId) || STUDENT_PROFILES[team.id-1]; }
function studentChallenge(team) {
  const challenges = studentProfile(team).challenges;
  const challengeCount = team.history.filter(entry => entry.note.includes("挑战「")).length;
  return challenges[(state.round + challengeCount) % challenges.length];
}
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function effectText(effects) {
  return Object.entries(effects).map(([key,value]) => `${RESOURCE_META[key].name}${value >= 0 ? "+" : ""}${value}`).join("，");
}
function seededPick(list, salt=0) {
  const team = activeTeam();
  const idx = (state.round * 7 + team.id * 5 + team.history.length * 3 + salt) % list.length;
  return list[idx];
}

function renderBoard() {
  els.board.innerHTML = "";
  tiles.forEach((tile,index) => {
    const row = Math.floor(index / 5);
    const colInRow = index % 5;
    const visualCol = row % 2 === 0 ? colInRow + 1 : 5 - colInRow;
    const cell = document.createElement("article");
    cell.className = `tile ${tile.type}`;
    cell.dataset.number = tile.number;
    cell.style.gridRow = row + 1;
    cell.style.gridColumn = visualCol;
    cell.innerHTML = `<span class="tile-number">${String(tile.number).padStart(2,"0")}</span><strong class="tile-title">${tile.title}</strong><span class="tile-effect">${tile.effect}</span><div class="tokens"></div>`;
    els.board.appendChild(cell);
  });
  state.teams.forEach(team => {
    const slot = els.board.querySelector(`[data-number="${team.position}"] .tokens`);
    if (!slot) return;
    const token = document.createElement("span"); token.className = "token"; token.textContent = team.id; token.style.background = team.color; token.title = `${team.name}：${studentProfile(team).goal}`; slot.appendChild(token);
  });
}

function renderResources(team) {
  els.resourceGrid.innerHTML = "";
  Object.entries(RESOURCE_META).forEach(([key,meta]) => {
    const node = $("resourceTemplate").content.firstElementChild.cloneNode(true);
    node.dataset.key = key;
    node.querySelector(".resource-name").textContent = meta.name;
    node.querySelector(".resource-value").textContent = team.resources[key];
    node.querySelector(".resource-max").textContent = `/ ${meta.max}`;
    els.resourceGrid.appendChild(node);
  });
}

function renderTeams() {
  els.teamList.innerHTML = "";
  state.teams.forEach((team,index) => {
    const card = document.createElement("article");
    card.className = `team-card ${index === state.activeTeam ? "active" : ""} ${team.completedTurn ? "done" : ""}`;
    card.innerHTML = `<div class="team-card-head"><span class="team-index" style="background:${team.color}">${team.id}</span><strong>${team.name}</strong></div><span class="team-goal">${studentProfile(team).goal}</span><div class="team-meta"><span>${team.position} / 25</span><span>${team.finished ? "已到考场" : team.troubleNext || team.troubleActive ? "调整状态" : team.completedTurn ? "本轮完成" : "待行动"}</span></div><div class="mini-bar"><span style="width:${((team.position-1)/24)*100}%"></span></div>`;
    card.addEventListener("click", () => {
      if ((state.phase === "setup" || state.phase === "playing") && !state.teams[index].completedTurn && state.rolled === null) {
        state.activeTeam = index; saveState(); render();
      } else showTeamSummary(team);
    });
    els.teamList.appendChild(card);
  });
}

function render() {
  const team = activeTeam();
  const profile = studentProfile(team);
  renderBoard(); renderResources(team); renderTeams();
  els.teamBadge.textContent = team.id; els.teamBadge.style.background = team.color; els.currentTeamTitle.textContent = team.name;
  els.studentBackground.textContent = profile.background;
  els.studentGoal.textContent = profile.goal;
  els.studentStrength.textContent = profile.strength;
  els.studentPressure.textContent = profile.pressure;
  els.positionLabel.textContent = team.position;
  els.roleLabel.textContent = ROLES[(state.round - 1 + team.id - 1) % ROLES.length];
  els.conditionChip.textContent = team.finished ? "抵达考场" : team.troubleActive || team.troubleNext ? "调整状态" : "状态良好";
  els.conditionChip.classList.toggle("trouble", team.troubleActive || team.troubleNext);
  els.roundLabel.textContent = state.phase === "review" || state.phase === "finished" ? "游戏已完成" : `第 ${state.round} / ${MAX_ROUNDS} 轮`;
  els.phaseLabel.textContent = ({setup:"准备阶段",playing:"六周备考中",review:"考前复盘",finished:"课堂总结"})[state.phase];
  els.progressCopy.textContent = `${state.teams.filter(t=>t.completedTurn).length} / 6 组完成本轮`;
  els.soundButton.textContent = state.sound ? "♪" : "×";
  els.die.textContent = state.rolled ?? "?";
  els.movePreview.textContent = state.rolled ? `本次前进 ${state.pendingMove} 格` : team.troubleActive ? "调整回合：本轮固定3格" : team.sprintBonus ? "冲刺加成已就绪" : "等待掷骰";
  els.energyButton.disabled = tokenMoving || state.phase !== "playing" || team.resources.energy < 1 || team.usedEnergy || team.completedTurn || state.rolled === null;
  els.energyButton.textContent = state.rolled === null ? "使用能量币" : "能量币：重掷一次";
  els.cooperateButton.disabled = tokenMoving || state.phase !== "playing" || team.usedCooperation || team.resources.courage < 1 || team.completedTurn || state.rolled !== null;
  const undoEntry = state.undoStack?.at(-1);
  els.undoButton.disabled = tokenMoving || !undoEntry;
  const undoLabel = undoEntry ? `撤回：${undoEntry.label}` : "暂无可撤回操作";
  els.undoButton.textContent = "↶";
  els.undoButton.title = undoLabel;
  els.undoButton.setAttribute("aria-label", undoLabel);
  els.publicEventButton.disabled = tokenMoving || state.phase !== "playing" || state.round < 3 || state.publicEventDone || state.rolled !== null;
  const last = team.history.at(-1);
  els.turnNote.textContent = last ? last.note : "尚未开始行动。";
  if (state.phase === "setup") els.actionButton.textContent = "开始游戏";
  else if (state.phase === "playing" && team.completedTurn) els.actionButton.textContent = "本轮已完成";
  else if (state.phase === "playing" && state.rolled === null) els.actionButton.textContent = team.finished ? "完成本轮" : "掷骰前进";
  else if (state.phase === "playing") els.actionButton.textContent = "移动并处理事件";
  else if (state.phase === "review") els.actionButton.textContent = "填写备考策略单";
  else els.actionButton.textContent = "查看全班结局";
  els.actionButton.disabled = tokenMoving || (state.phase === "playing" && team.completedTurn);
  els.restartGameButton.disabled = tokenMoving;
  els.teacherMessage.textContent = teacherMessage();
  const chapter = state.phase === "setup" ? {stage:STORY_PROLOGUE.stage,title:"六位学生的倒计时开始",line:"六个小组分别支持一位学生，在不同处境中做出备考取舍。"} : STORY_CHAPTERS[Math.min(state.round,6)-1];
  els.storyStage.textContent = chapter.stage; els.storyChapter.textContent = chapter.title; els.storyLine.textContent = chapter.line;
}

function teacherMessage() {
  if (state.phase === "setup") return "六个小组各支持一位虚构学生。先阅读人物背景，再开始第一周。";
  if (state.phase === "review") return "六周备考结束。请各组完成备考策略单，再进行40秒分享。";
  if (state.phase === "finished") return "回顾选择、代价与调整。备考画像没有高低之分。";
  if (state.round === 3 && !state.publicEventDone) return "本轮结束前需发布一次全班公共事件。";
  return `${activeTeam().name}正在行动。其他组可观察其选择理由与资源变化。`;
}

function openModal({kicker,title,body,actions=[],locked=false,variant=""}) {
  modalLocked = locked;
  els.modal.classList.toggle("briefing-modal", variant === "briefing");
  els.modal.classList.toggle("profile-modal", variant === "profile");
  els.modalKicker.textContent = kicker; els.modalTitle.textContent = title; els.modalBody.innerHTML = body; els.modalBody.onclick = null; els.modalActions.innerHTML = "";
  const modalActions = [...actions];
  if (locked && state.undoStack?.length && !modalActions.some(action => action.label.includes("撤回"))) {
    modalActions.push({label:`↶ 撤回：${state.undoStack.at(-1).label}`,secondary:true,onClick:undoLastStep});
  }
  modalActions.forEach(action => {
    const button = document.createElement("button"); button.className = action.secondary ? "secondary-button" : "primary-button"; button.textContent = action.label;
    button.disabled = Boolean(action.disabled);
    if (action.id) button.id = action.id;
    button.addEventListener("click", action.onClick); els.modalActions.appendChild(button);
  });
  els.modalClose.style.display = locked ? "none" : "block";
  els.modalBackdrop.classList.remove("hidden");
}
function closeModal() { if (modalLocked) return; els.modalBackdrop.classList.add("hidden"); }
function forceCloseModal() { modalLocked = false; els.modalBackdrop.classList.add("hidden"); }

function startGame() {
  pushUndoStep("开始六周备考");
  state.phase = "playing"; state.round = 1; state.activeTeam = 0; state.teams.forEach(t => t.completedTurn = false);
  state.story.prologueSeen = true;
  saveState(); playTone(420,.08); render(); showRoundChapter(1,true);
}

function sceneMarkup(text, secondary="") {
  const paragraphs = Array.isArray(text) ? [...text] : [text];
  if (secondary) paragraphs.push(secondary);
  return `<div class="story-scene"><img src="assets/study-desk.svg" alt="中考备考桌面"><div>${paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("")}</div></div>`;
}

function profileMarkup(profile) {
  const story = (profile.story || [profile.background]).map(paragraph => `<p>${paragraph}</p>`).join("");
  return `<div class="profile-sheet">
    <div class="profile-story">${story}</div>
    <dl>
      <div><dt>家庭与生活</dt><dd>${profile.family}</dd></div>
      <div><dt>性格与爱好</dt><dd>${profile.personality}</dd></div>
      <div><dt>真正的优势</dt><dd>${profile.strength}</dd></div>
      <div><dt>容易卡住的地方</dt><dd>${profile.weakness}</dd></div>
      <div><dt>现实压力</dt><dd>${profile.pressure}</dd></div>
      <div><dt>这六周的目标</dt><dd>${profile.goal}</dd></div>
    </dl>
  </div>`;
}

function showPrologue() {
  const seen = state.story.profilesSeen || [];
  const allSeen = seen.length === STUDENT_PROFILES.length;
  const profileCards = STUDENT_PROFILES.map((profile,index) => `<article class="briefing-card ${seen.includes(profile.id) ? "seen" : ""}" data-profile-index="${index}"><span class="student-avatar" style="background:${TEAM_COLORS[index]}">${index + 1}</span><div><strong>${profile.name}</strong><small>${profile.goal} · ${profile.pressure}</small><p>${profile.background}</p></div><button type="button" class="secondary-button profile-view-button">${seen.includes(profile.id) ? "再次查看" : "查看背景"}</button></article>`).join("");
  openModal({kicker:STORY_PROLOGUE.stage,title:STORY_PROLOGUE.title,locked:true,variant:"briefing",
    body:`${sceneMarkup(STORY_PROLOGUE.body,STORY_PROLOGUE.mission)}<div class="story-quote">开始前，每组先打开自己支持的学生档案。请从里面找出一条容易被忽略的生活细节，并讨论：如果这件事突然发生变化，最先受到影响的是勇气、知识还是时间？</div><div class="profile-briefing"><div class="briefing-heading"><strong>六位学生角色导览</strong><span>${seen.length} / ${STUDENT_PROFILES.length} 已查看</span></div>${profileCards}</div>`,
    actions:[{id:"startWeekButton",label:allSeen?"打开六周倒计时表":"请先查看全部角色",disabled:!allSeen,onClick:()=>{if((state.story.profilesSeen||[]).length<STUDENT_PROFILES.length)return;forceCloseModal();startGame();}}]});
  els.modalBody.onclick = event => {
    const card = event.target.closest("[data-profile-index]");
    if (card) showProfileBriefing(Number(card.dataset.profileIndex));
  };
}

function showProfileBriefing(index) {
  const profile = STUDENT_PROFILES[index];
  state.story.profilesSeen ||= [];
  if (!state.story.profilesSeen.includes(profile.id)) {
    state.story.profilesSeen.push(profile.id);
    saveState(); render();
  }
  openModal({kicker:`角色 ${index + 1} / ${STUDENT_PROFILES.length}`,title:`${profile.name} · 学生档案`,locked:true,variant:"profile",body:`${profileMarkup(profile)}<div class="story-quote">请记住：你们不是替这位学生追求一个标准答案，而是帮助他/她在真实限制下做出下一步。</div>`,actions:[{label:"返回角色导览",onClick:()=>{forceCloseModal();showPrologue();}}]});
}

function showRoundChapter(round, locked=false) {
  const chapter=STORY_CHAPTERS[round-1];
  openModal({kicker:chapter.stage,title:chapter.title,locked,
    body:`${sceneMarkup(chapter.body)}<div class="story-quote"><strong>本章任务</strong><br>${chapter.cue}</div>${chapterOverview(round)}`,
    actions:[{label:round===1?"开始第一周计划":"进入下一周",onClick:()=>{if(!state.story.chaptersSeen.includes(round))state.story.chaptersSeen.push(round);forceCloseModal();saveState();render();}}]});
}

function chapterOverview(current=state.round) {
  return `<div class="chapter-map"><div class="${current<=2?"current":""}"><strong>第一阶段</strong>目标与安排</div><div class="${current>=3&&current<=4?"current":""}"><strong>第二阶段</strong>模拟与互助</div><div class="${current>=5?"current":""}"><strong>第三阶段</strong>稳态与应考</div></div>`;
}

function showStoryJournal() {
  if(state.phase==="setup") {
    openModal({kicker:STORY_PROLOGUE.stage,title:STORY_PROLOGUE.title,body:`${sceneMarkup(STORY_PROLOGUE.body,STORY_PROLOGUE.mission)}${chapterOverview(1)}`,actions:[{label:"关闭",onClick:forceCloseModal}]});
    return;
  }
  const chapter=STORY_CHAPTERS[Math.min(state.round,6)-1];
  const trail=state.teams.flatMap(t=>t.history.map(h=>({team:t.name,...h}))).slice(-6);
  openModal({kicker:"六周备考故事",title:chapter.title,body:`${sceneMarkup(chapter.body)}${chapterOverview(state.round)}<div class="task-box"><strong>最近备考记录</strong><br>${trail.length?trail.map(h=>`${h.team}：${h.note}`).join("<br>"):"六个备考小组刚刚开始第一周计划。"}</div>`,actions:[{label:"关闭",onClick:forceCloseModal}]});
}

async function rollDice(recordUndo=true) {
  const team = activeTeam();
  if (team.finished) { completeTurn("已完成六周备考路线，本轮无需移动。"); return; }
  if (recordUndo) pushUndoStep(`${team.name}掷骰`);
  els.die.classList.add("rolling"); playTone(260,.06);
  let ticks = 0;
  const timer = setInterval(() => { els.die.textContent = 1 + Math.floor(Math.random()*6); ticks++; if (ticks > 10) clearInterval(timer); },55);
  await new Promise(r=>setTimeout(r,680)); clearInterval(timer); els.die.classList.remove("rolling");
  const result = 1 + Math.floor(Math.random()*6);
  state.rolled = result;
  const extra = result <= 2 ? 0 : result <= 4 ? 1 : 2;
  state.pendingMove = team.troubleActive ? 3 : 3 + extra + (team.sprintBonus ? 1 : 0);
  saveState(); playTone(520,.1); render();
}

function useEnergyReroll() {
  const team = activeTeam();
  if (team.resources.energy < 1 || team.usedEnergy || state.rolled === null) return;
  pushUndoStep(`${team.name}使用能量币重掷`);
  team.resources.energy--; team.usedEnergy = true; state.rolled = null; state.pendingMove = 0;
  team.history.push({round:state.round,note:"使用1枚能量币，选择重掷骰子。"});
  saveState(); render(); rollDice(false);
}

function waitForTokenStep() { return new Promise(resolve => setTimeout(resolve, 420)); }

async function moveTeam() {
  const team = activeTeam();
  const from = team.position;
  const destinationPosition = clamp(team.position + state.pendingMove,1,25);
  pushUndoStep(`${team.name}移动并处理事件`);
  tokenMoving = true;
  playTone(620,.12);
  for (let position = from + 1; position <= destinationPosition; position++) {
    team.sprintBonus = false;
    team.position = position;
    if (position === 25) team.finished = true;
    saveState(); render();
    const destination = els.board.querySelector(`[data-number="${position}"]`);
    if (destination) destination.classList.add("active-destination");
    await waitForTokenStep();
  }
  const tile = tiles[team.position-1];
  team.history.push({round:state.round,note:`从第${from}格前进${team.position-from}格，抵达第${team.position}格「${tile.title}」。`});
  state.rolled = null; state.pendingMove = 0;
  saveState(); render();
  const destination = els.board.querySelector(`[data-number="${team.position}"]`);
  if (destination) destination.classList.add("active-destination");
  await new Promise(resolve => setTimeout(resolve, 260));
  tokenMoving = false;
  resolveTile(tile);
}

function resolveTile(tile) {
  if (tile.type === "opportunity") return showOpportunity(seededPick(opportunityCards));
  if (tile.type === "challenge") return showChallenge(studentChallenge(activeTeam()));
  if (tile.type === "choice") return showBranchChoice();
  if (tile.type === "resource") {
    const effects = tile.number === 7 ? {courage:2} : tile.number === 14 ? {knowledge:2} : {time:3};
    return resolveEffectsWithEnergy(effects, `${tile.effect}`, () => completeTurn(`获得资源：${effectText(effects)}。`));
  }
  if (tile.type === "finish") return showFinishArrival();
  completeTurn("平稳前进，本格没有额外事件。");
}

function showOpportunity(card) {
  openModal({kicker:"[机遇] 抽到立即执行",title:card.title,locked:true,
    body:`<p>备考计划表翻到新的一页，一段真实的中考经历被写了下来。</p><p>${card.text}</p><div class="event-effect">${effectText(card.effects)}</div>`,
    actions:[{label:"收下这份成长",onClick:()=>{ forceCloseModal(); applyEffects(card.effects); completeTurn(`机遇「${card.title}」：${effectText(card.effects)}。`); }},undoModalAction()]});
}

function showChallenge(card) {
  const team = activeTeam();
  const profile = studentProfile(team);
  openModal({kicker:"[挑战] 必须面对",title:card.title,locked:true,
    body:`<div class="challenge-student"><span class="student-avatar" style="background:${team.color}">${team.id}</span><div><strong>${team.name}的特殊情景</strong><small>${profile.pressure}</small></div></div><p>${card.text}</p><div class="event-effect">${effectText(card.effects)}</div><div class="task-box"><strong>30秒小组任务</strong><br>${card.task}<br><small>请依据${team.name}的真实限制提出行动，不要只写“更加努力”。</small></div><label class="field-label">把补救方案写进${team.name}的复习计划</label><textarea id="challengeAnswer" class="strategy-field" placeholder="写下一条具体行动……"></textarea>`,
    actions:[{label:"完成挑战",onClick:()=>{
      const answer=$("challengeAnswer").value.trim(); if (!answer) { $("challengeAnswer").focus(); return; }
      activeTeam().strategy.adjustment = answer; forceCloseModal();
      resolveEffectsWithEnergy(card.effects, card.title, () => completeTurn(`挑战「${card.title}」：${effectText(card.effects)}；调整：${answer}`));
    }},undoModalAction()]});
}

function showDecisionCard() {
  const card = seededPick(decisionCards,2);
  const choose = (option,label) => {
    activeTeam().strategy.choice = `${card.title}：${label}`;
    activeTeam().strategy.cost = effectText(option.effects);
    forceCloseModal(); resolveEffectsWithEnergy(option.effects,label,()=>completeTurn(`抉择「${label}」：${effectText(option.effects)}。`));
  };
  openModal({kicker:"[抉择] 讨论60秒",title:card.title,locked:true,body:`<p>复习计划表上出现两种安排。两条路都能继续，但会留下不同的时间和知识记录。</p><p>${card.text}</p><div class="choice-grid"><button class="choice-option" id="choiceA"><strong>A · ${card.a.label}</strong>${effectText(card.a.effects)}</button><button class="choice-option" id="choiceB"><strong>B · ${card.b.label}</strong>${effectText(card.b.effects)}</button></div><label class="field-label">选择前先说清楚：收益是什么？代价是什么？</label>`,actions:[undoModalAction()]});
  $("choiceA").onclick=()=>choose(card.a,card.a.label); $("choiceB").onclick=()=>choose(card.b,card.b.label);
}

function showBranchChoice() {
  openModal({kicker:"分岔路口",title:"稳健，还是冲刺？",locked:true,
    body:`<p>先处理一张抉择卡，再决定下一段路采取哪种策略。</p><div class="choice-grid"><button class="choice-option" id="steady"><strong>稳健前进</strong>获得任一核心资源+1，或获得1点风险护盾。</button><button class="choice-option" id="sprint"><strong>选择冲刺</strong>支付勇气1或时间1，下轮额外前进1格。</button></div>`,actions:[undoModalAction()]});
  $("steady").onclick=()=>showSteadyOptions(); $("sprint").onclick=()=>showSprintOptions();
}

function showSteadyOptions() {
  openModal({kicker:"稳健路线",title:"选择一份保障",locked:true,body:`<p>稳健不改变本次移动。请选择一种收益。</p>`,actions:[
    ...CORE_KEYS.map(key=>({label:`${RESOURCE_META[key].name} +1`,onClick:()=>{forceCloseModal();applyEffects({[key]:1});showDecisionCard();}})),
    {label:"风险护盾 +1",secondary:true,onClick:()=>{activeTeam().shield=1;forceCloseModal();showDecisionCard();}}
  ]});
}

function showSprintOptions() {
  const team=activeTeam();
  const actions=[];
  if(team.resources.courage>0) actions.push({label:"支付勇气 1",onClick:()=>sprintPay("courage")});
  if(team.resources.time>0) actions.push({label:"支付时间 1",onClick:()=>sprintPay("time")});
  actions.push({label:"返回稳健路线",secondary:true,onClick:showSteadyOptions});
  openModal({kicker:"冲刺路线",title:"选择冲刺代价",locked:true,body:`<p>支付资源后，下轮额外前进1格。资源不能支付到0以下。</p>`,actions});
}
function sprintPay(key) { applyEffects({[key]:-1}); activeTeam().sprintBonus=true; forceCloseModal(); showDecisionCard(); }

function resolveEffectsWithEnergy(effects,source,done) {
  const team=activeTeam();
  const loss = Object.entries(effects).filter(([,v])=>v<0).reduce((sum,[,v])=>sum-v,0);
  if (loss>0 && team.resources.energy>0 && !team.usedEnergy) {
    openModal({kicker:"能量币机会",title:"要抵消1点损失吗？",locked:true,
      body:`<p>事件「${source}」将造成：${effectText(effects)}。</p><div class="event-effect">每轮最多使用1枚能量币。</div>`,actions:[
        {label:"使用能量币",onClick:()=>{team.resources.energy--;team.usedEnergy=true;const adjusted={...effects};const key=Object.keys(adjusted).find(k=>adjusted[k]<0);adjusted[key]++;forceCloseModal();applyEffects(adjusted);done();}},
        {label:"承担损失",secondary:true,onClick:()=>{forceCloseModal();applyEffects(effects);done();}}
      ]});
  } else { applyEffects(effects); done(); }
}

function applyEffects(effects) {
  const team=activeTeam();
  Object.entries(effects).forEach(([key,value])=>{
    if (value<0 && team.shield>0) { value++; team.shield=0; }
    team.resources[key]=clamp(team.resources[key]+value,0,RESOURCE_META[key].max);
  });
  if (CORE_KEYS.some(k=>team.resources[k]===0) && !team.troubleActive && !team.troubleNext) team.troubleNext=true;
  saveState(); render();
  Object.keys(effects).forEach(key=>{
    const node=els.resourceGrid.querySelector(`[data-key="${key}"]`); if(node){node.classList.add("changed");setTimeout(()=>node.classList.remove("changed"),750);}
  });
}

function showFinishArrival() {
  openModal({kicker:"抵达中考考场",title:"考场前的最后一张清单",locked:true,body:`${sceneMarkup("你们走到考场门口，桌面上摆着准考证、文具、错题本和最后一张复习清单。真正的准备不是把所有内容再塞进脑子，而是知道遇到不会的题、紧张的时刻和时间不够时，自己准备怎么做。")}<div class="portrait-result">本组将在第6轮结束后完成备考策略单，把一路上的经验写成考场可执行的步骤。</div>`,actions:[{label:"保存考前策略",onClick:()=>{forceCloseModal();completeTurn("抵达中考考场，带着备考策略等待结算。")}},undoModalAction()]});
}

function completeTurn(note) {
  const team=activeTeam();
  team.history.push({round:state.round,note});
  state.rolled=null;state.pendingMove=0;
  if(team.troubleNext && !team.troubleStrategy) return promptTrouble(note);
  finalizeTurn();
}

function promptTrouble() {
  openModal({kicker:"调整状态",title:"资源归零，先调整再前进",locked:true,
    body:`<p>下一轮固定前进3格，本轮不能再获得能量币。请先写下一条具体调整策略。</p><label class="field-label">我们的调整策略</label><textarea id="troubleAnswer" class="strategy-field" placeholder="例如：把任务拆成三步，并向同伴求助……"></textarea>`,
    actions:[{label:"保存调整策略",onClick:()=>{const v=$("troubleAnswer").value.trim();if(!v){$("troubleAnswer").focus();return;}const t=activeTeam();t.troubleStrategy=v;t.strategy.adjustment=v;forceCloseModal();finalizeTurn();}}]});
}

function finalizeTurn() {
  const team=activeTeam();
  team.completedTurn=true;
  if(team.troubleActive){team.troubleActive=false;team.troubleNext=false;team.troubleStrategy="";}
  saveState();
  const remaining=state.teams.findIndex(t=>!t.completedTurn);
  if(remaining>=0){state.activeTeam=remaining;saveState();render();return;}
  endRound();
}

function endRound() {
  if(state.round===3 && !state.publicEventDone) return showPublicEvent(true);
  if(state.round>=MAX_ROUNDS){state.phase="review";state.activeTeam=0;state.teams.forEach(t=>t.completedTurn=false);saveState();render();showReviewIntro();return;}
  state.round++;
  state.teams.forEach(t=>{t.completedTurn=false;t.usedEnergy=false;if(t.troubleNext)t.troubleActive=true;});
  state.activeTeam=0;saveState();render();showRoundChapter(state.round,true);
}

function showPublicEvent(required=false) {
  openModal({kicker:"第三周转折 · 模拟考成绩公布",title:"全班同时面对一张成绩单",locked:required,body:`${sceneMarkup("六个小组刚完成阶段模拟考，成绩单同时发到每个人手里。有人看到进步，有人看到失分，有人只看到排名。教师提醒：成绩是当前状态的反馈，不是中考结果。", "教师选择一项共同情境。它会改变资源，但不会给任何小组贴标签。")}<div class="choice-grid"><button class="choice-option" id="rain"><strong>连续错题暴露薄弱项</strong>所有组时间 -1</button><button class="choice-option" id="mentor"><strong>老师带来复盘方法</strong>所有组知识 +1</button><button class="choice-option" id="road"><strong>复习安排突然冲突</strong>每组选择勇气 -1 或时间 -1</button></div>`,actions:[]});
  $("rain").onclick=()=>applyPublic("连续错题暴露薄弱项",{time:-1});
  $("mentor").onclick=()=>applyPublic("老师带来复盘方法",{knowledge:1});
  $("road").onclick=()=>applyRoadClosure();
}

function applyPublic(name,effects) {
  pushUndoStep(`公共事件：${name}`);
  state.teams.forEach(team=>{
    Object.entries(effects).forEach(([key,v])=>team.resources[key]=clamp(team.resources[key]+v,0,RESOURCE_META[key].max));
    if(CORE_KEYS.some(key=>team.resources[key]===0) && !team.troubleActive) team.troubleNext=true;
    team.history.push({round:3,note:`公共事件「${name}」：${effectText(effects)}。`});
  });
  state.publicEventDone=true;forceCloseModal();saveState();render();
  if(state.teams.every(t=>t.completedTurn)) endRound();
}

function applyRoadClosure() {
  pushUndoStep("公共事件：复习安排冲突");
  state.teams.forEach(team=>{const key=team.resources.time>=team.resources.courage?"time":"courage";team.resources[key]=clamp(team.resources[key]-1,0,12);if(CORE_KEYS.some(k=>team.resources[k]===0)&&!team.troubleActive)team.troubleNext=true;team.history.push({round:3,note:`复习安排冲突：选择${RESOURCE_META[key].name}-1。`});});
  state.publicEventDone=true;forceCloseModal();saveState();render();if(state.teams.every(t=>t.completedTurn))endRound();
}

function cooperate() {
  const from=activeTeam();
  const targets=state.teams.filter(t=>t.id!==from.id);
  openModal({kicker:"合作机制",title:"选择合作小组",body:`<p>双方各支付勇气1点，${from.name}可向对方转移最多2点同一种核心资源。每组整局最多发起一次。</p><label class="field-label">合作对象</label><select id="coopTarget" class="text-field">${targets.map(t=>`<option value="${t.id}">${t.name}</option>`).join("")}</select><label class="field-label">转移资源</label><select id="coopResource" class="text-field">${CORE_KEYS.map(k=>`<option value="${k}">${RESOURCE_META[k].name}</option>`).join("")}</select><label class="field-label">转移数量</label><select id="coopAmount" class="text-field"><option>1</option><option>2</option></select><label class="field-label">为什么愿意合作？</label><input id="coopReason" class="text-field" placeholder="写下一句理由">`,actions:[{label:"确认合作",onClick:()=>{
    const target=state.teams.find(t=>t.id===Number($("coopTarget").value));const key=$("coopResource").value;const amount=Number($("coopAmount").value);const reason=$("coopReason").value.trim();
    if(!reason){$("coopReason").focus();return;}if(from.resources[key]<amount||target.resources.courage<1){alert("资源不足，无法完成这次合作。");return;}
    pushUndoStep(`${from.name}与${target.name}合作`);
    from.resources.courage--;target.resources.courage--;from.resources[key]-=amount;target.resources[key]=clamp(target.resources[key]+amount,0,12);
    [from,target].forEach(team=>{if(CORE_KEYS.some(k=>team.resources[k]===0)&&!team.troubleActive)team.troubleNext=true;});
    from.usedCooperation=true;from.history.push({round:state.round,note:`与${target.name}合作：转移${RESOURCE_META[key].name}${amount}点。理由：${reason}`});forceCloseModal();saveState();render();
  }},{label:"取消",secondary:true,onClick:forceCloseModal}]});
}

function showReviewIntro() {
  openModal({kicker:"中考前夜 · 最后一张清单",title:"把备考经验变成考场策略",body:`${sceneMarkup("有的小组已经完成目标，有的小组还在补最后的薄弱项。但每组都带着一路上的复习记录、错题和调整策略来到考前最后一次班会。现在，请把一次选择、一次代价和一次调整写成考场里能执行的步骤。", "策略不是保证分数的承诺，而是帮助自己在压力下继续行动的准备。")}<div class="story-quote">评价的重点不是剩余资源多少，而是能否说明：我为什么这样选，付出了什么，后来怎样继续。</div>`,actions:[{label:"开始填写备考策略",onClick:()=>{forceCloseModal();openStrategyForm();}}]});
}

function openStrategyForm() {
  const team=activeTeam(), s=team.strategy;
  openModal({kicker:`${team.name} · 备考策略单`,title:"把经历转化为策略",locked:true,body:`
    <label class="field-label">1. 最重要的一次选择是什么？</label><textarea id="s1" class="strategy-field">${s.choice}</textarea>
    <label class="field-label">2. 当时牺牲了什么资源？为什么？</label><textarea id="s2" class="strategy-field">${s.cost}</textarea>
    <label class="field-label">3. 遇到的困难是什么？</label><textarea id="s3" class="strategy-field">${s.challenge}</textarea>
    <label class="field-label">4. 后来怎样调整？</label><textarea id="s4" class="strategy-field">${s.adjustment}</textarea>
    <label class="field-label">5. 怎样用于真实学习或生活？</label><textarea id="s5" class="strategy-field">${s.transfer}</textarea>`,actions:[{label:"保存并生成画像",onClick:()=>{
      const values=[1,2,3,4,5].map(i=>$("s"+i).value.trim());if(values.some(v=>!v)){alert("请完成5个问题后再提交。");return;}
      pushUndoStep(`${team.name}提交备考策略`);
      [s.choice,s.cost,s.challenge,s.adjustment,s.transfer]=values;team.score={reason:2,cost:2,adjustment:2};team.completedTurn=true;forceCloseModal();showPortrait(team);
    }}]});
}

function portrait(team) {
  const vals=CORE_KEYS.map(k=>team.resources[k]);
  if(Math.max(...vals)-Math.min(...vals)<=2)return "平衡成长者";
  const max=Math.max(...vals);const keys=CORE_KEYS.filter(k=>team.resources[k]===max);
  if(keys.length>1)return "平衡成长者";
  return {courage:"探索者",knowledge:"学习者",time:"规划者"}[keys[0]];
}

function showPortrait(team) {
  const name=portrait(team);const pass=(team.position>=22)&&CORE_KEYS.some(k=>team.resources[k]>=3)&&team.strategy.adjustment;
  const ending=portraitEnding(name,team);
  openModal({
    kicker:"备考结算",
    title:`${team.name} · ${name}`,
    locked:true,
    body:`<div class="portrait-result"><strong>${pass?"完成多元通关":"完成六周备考复盘"}</strong><br>最终位置：${team.position}/25<br>勇气 ${team.resources.courage} · 知识 ${team.resources.knowledge} · 时间 ${team.resources.time}</div><p class="ending-line">${ending}</p><p>准备一段40秒分享：关键选择是什么？你们承担了什么代价？后来怎样调整？</p>`,
    actions:[{label:"下一组",onClick:()=>{
      forceCloseModal();
      const next=state.teams.findIndex(t=>!t.completedTurn);
      if(next>=0){state.activeTeam=next;saveState();render();openStrategyForm();}
      else{state.phase="finished";state.activeTeam=0;saveState();render();showClassResults();}
    }}]
  });
}

function portraitEnding(name,team) {
  const action=team.strategy.adjustment || "在困难出现时停下来重新安排";
  const endings={
    "探索者":`你们把考前策略写成“先做最害怕的那一小步”。它提醒后来者：勇气不是不紧张，而是紧张时仍能开始行动。你们留下的做法是“${action}”。`,
    "学习者":`你们把考前策略写成“把错题变成下一次得分点”。它提醒后来者：不会的内容可以通过提问、订正和复盘变得更清楚。你们留下的做法是“${action}”。`,
    "规划者":`你们把考前策略写成一张有刻度的时间表。它提醒后来者：备考不是把每一分钟塞满，而是为重要任务安排合适的顺序。你们留下的做法是“${action}”。`,
    "平衡成长者":`你们把考前策略写成一张完整的考场清单。它提醒后来者：知识、时间和状态都要照顾，稳定地执行比临时加码更可靠。你们留下的做法是“${action}”。`,
  };
  return endings[name];
}

function showClassResults() {
  const rows=state.teams.map(t=>`<div class="portrait-result"><strong>${t.name} · ${portrait(t)}</strong><br>位置 ${t.position}/25 · 勇气 ${t.resources.courage} · 知识 ${t.resources.knowledge} · 时间 ${t.resources.time}</div>`).join("");
  openModal({kicker:"中考前夜 · 全班总结",title:"六种备考策略，带进同一间考场",body:`${sceneMarkup("六个小组把策略贴到教室后墙：有人写下先做最害怕的题型，有人写下错题复盘步骤，有人写下睡眠和时间安排。班主任提醒大家，真正能带进考场的不是一张完美计划，而是受挫后仍能调整的能力。")}${rows}<div class="story-quote">最后一句话：中考是一场重要的考试，但它不是对一个人的全部定义。今天练习的选择、复盘和坚持，也会继续服务于更长的人生。</div>`,actions:[{label:"带着策略进入考场",onClick:forceCloseModal}]});
}

function showTeamSummary(team) {
  openModal({kicker:`${team.name} · 状态`,title:`位置 ${team.position} / 25`,body:`<div class="event-effect">勇气 ${team.resources.courage} · 知识 ${team.resources.knowledge} · 时间 ${team.resources.time} · 能量币 ${team.resources.energy}</div><p>${team.history.slice(-4).map(h=>`第${h.round}轮：${h.note}`).join("<br>")||"暂无行动记录"}</p>`,actions:[{label:"关闭",onClick:forceCloseModal}]});
}

function renameCurrentTeam() {
  const team=activeTeam();
  const profile=studentProfile(team);
  openModal({kicker:`学生档案 · 第${team.id}组支持对象`,title:team.name,variant:"profile",body:`${profileMarkup(profile)}<div class="story-quote">请替${team.name}做出符合其处境的选择。人物没有标准路线，重点是理由、代价和调整。</div>`,actions:[{label:"关闭档案",onClick:forceCloseModal}]});
}

function showHelp() {
  openModal({kicker:"课堂游戏规则",title:"一轮怎样进行？",body:`<p>六个小组分别支持一位虚构学生。做决定前要考虑这位学生的目标、优势和现实压力，每一次行动都会在其复习计划中留下结果。</p><ol class="rule-list"><li>每组先阅读支持学生的档案，再轮换组内任务角色。</li><li>掷骰后基础前进3格；骰子1–2/3–4/5–6分别额外+0/+1/+2。</li><li>挑战格会触发该学生的特殊情景，小组要提出符合其处境的办法。</li><li>处理其他落脚格事件，并说明选择的收益和代价。</li><li>能量币可重掷或抵消1点损失，每轮最多使用1枚。</li><li>“撤回”只记录实际游戏操作，可依次撤回移动、掷骰、合作、公共事件和开始游戏；阅读角色档案不会产生撤回记录。</li></ol>`,actions:[{label:"明白了",onClick:forceCloseModal}]});
}

function resetGame() {
  openModal({kicker:"重新开始本局",title:"确定从头开始吗？",body:`<p>当前六组的行动、故事进度和策略单会被清除，游戏回到“距离中考还有六周”的准备阶段。</p><p class="save-note">手动存档不会被删除，你仍可以从“存档/读档”中恢复之前的进度。</p>`,actions:[{label:"确认重新开始",onClick:()=>{localStorage.removeItem(STORAGE_KEY);state=initialState();forceCloseModal();render();showPrologue();}},{label:"暂不重开",secondary:true,onClick:forceCloseModal}]});
}

let audioContext=null;
function playTone(freq,duration) {
  if(!state.sound)return;
  try{audioContext=audioContext||new(window.AudioContext||window.webkitAudioContext)();const osc=audioContext.createOscillator();const gain=audioContext.createGain();osc.frequency.value=freq;gain.gain.value=.035;osc.connect(gain);gain.connect(audioContext.destination);osc.start();gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);osc.stop(audioContext.currentTime+duration);}catch{}
}

els.actionButton.addEventListener("click",()=>{
  if(state.phase==="setup")return startGame();
  if(state.phase==="review")return openStrategyForm();
  if(state.phase==="finished")return showClassResults();
  if(state.rolled===null)return rollDice();
  moveTeam();
});
els.energyButton.addEventListener("click",useEnergyReroll);
els.cooperateButton.addEventListener("click",cooperate);
els.undoButton.addEventListener("click",undoLastStep);
els.publicEventButton.addEventListener("click",()=>showPublicEvent(false));
els.storyButton.addEventListener("click",showStoryJournal);
els.saveButton.addEventListener("click",()=>showSaveLoadModal());
els.storyRibbon.addEventListener("click",showStoryJournal);
els.renameButton.addEventListener("click",renameCurrentTeam);
els.helpButton.addEventListener("click",showHelp);
els.resetButton.addEventListener("click",resetGame);
els.restartGameButton.addEventListener("click",resetGame);
els.soundButton.addEventListener("click",()=>{state.sound=!state.sound;saveState();render();if(state.sound)playTone(440,.08);});
els.modalClose.addEventListener("click",closeModal);
els.modalBackdrop.addEventListener("click",e=>{if(e.target===els.modalBackdrop)closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

render();
if (state.phase === "setup" && !state.story.prologueSeen) showPrologue();
}
