"use strict";

const CARD_SCHEMA_VERSION = 2;
const CARD_STORAGE_KEY = "class-card-sandbox-v2";
const CARD_SAVES_KEY = "class-card-sandbox-saves-v2";
const LEGACY_KEYS = ["growth-path-classroom-v1", "growth-path-classroom-saves-v1"];
const CARD_TYPES = {
  opportunity:{name:"机遇",symbol:"＊"}, challenge:{name:"挑战",symbol:"⚡"}, decision:{name:"抉择",symbol:"↗"}
};
const SCOPE_NAMES = {personal:"个人",pair:"搭档",class:"全班"};
const PAIRS = [
  {id:"desk",members:[0,5],name:"同桌",theme:"计划与弹性"},
  {id:"physics",members:[1,3],name:"物理学习搭档",theme:"开口与融入"},
  {id:"classwork",members:[2,4],name:"班级任务搭档",theme:"行动与节奏"}
];
const WEEK_STORIES = [
  {theme:"目标、作息和起点",stage:"第一周 · 周一早读前",title:"倒计时写上黑板",line:"六份生活节奏不同的计划，在同一间教室里同时开始。",body:[
    "周一早读铃还没响，班主任在黑板右上角写下“距离中考四十二天”。粉笔灰落到讲台边，六个人都看见了这行字，却没有人用同一种姿势坐着：有人立刻翻开计划本，有人把模拟卷往书里推了推，也有人先看了一眼同桌。",
    "老师把六只档案袋放到第一排，没有发统一作息表。林晓晨要计算通勤，周雨桐要面对一直没问出口的物理题，陈子航要给训练留下位置；赵思齐、何嘉宁和吴辰安也各有不能被一张表格抹平的生活。第一周先不追赶进度，先看清自己从哪里出发。"
  ]},
  {theme:"家庭、训练与学习冲突",stage:"第二周 · 星期五放学后",title:"星期六只能过一次",line:"家庭安排、训练和复习撞在一起，取舍开始留下代价。",body:[
    "星期五最后一节课刚结束，班级群连续跳出三条通知：周六有专题答疑，综合练习周一上交，体育馆训练临时提前。窗外的天已经暗下来，大家在课桌边修改原来的周末安排，有人擦掉一整行，又很快重新写满。",
    "同一项选择放到不同家庭里，重量并不相同。陪弟弟、和外婆吃饭、回应父母的担心、履行对球队的承诺，都不是可以随手删去的“干扰”。这一周的牌会逼近这些冲突：每得到一点知识或时间，都要说明它从哪里来，又挤掉了什么。"
  ]},
  {theme:"模拟考和班级情绪",stage:"第三周 · 周三下午",title:"成绩单传到最后一排",line:"一张成绩单落到六个人手里，引出六种不同的第一反应。",body:[
    "周三下午，答题卡从第一排传到后排。教室里先是纸张摩擦声，随后有人长出一口气，有人马上去找排名，也有人把卷子扣在桌面。班主任没有先讲分数，只在黑板上写下：错在哪里、为什么错、明天先改哪一步。",
    "分数会影响班里的空气。一个人的沉默可能让同桌误以为不想说话，一句随口比较也可能把另一个人推回座位。第三周不要求迅速振作，先辨认每个人怎样理解这次结果，再决定哪些信息值得留下，哪些情绪需要有人接住。"
  ]},
  {theme:"求助、合作和资料共享",stage:"第四周 · 晚自习后",title:"教室里还亮着三盏灯",line:"有人缺资料，有人缺开口的勇气，也有人需要别人提醒停下来。",body:[
    "晚自习结束十分钟后，值日生已经扫到最后一组，教室里还有几个人没走。赵思齐在补转学前缺的专题资料，周雨桐把电学题的疑问写了三种问法，吴辰安正准备展示一个新工具。大家手里恰好有别人暂时缺少的东西。",
    "互助不是替对方做完，也不是永远由同一个人照顾另一个人。有人提供方法，也可能需要别人帮他守住时间；有人这次先开口，下次可以负责整理共同资料。第四周会让搭档关系真正进入选择：说明需要、确认边界，然后各自完成属于自己的那一步。"
  ]},
  {theme:"压力、疲劳和计划调整",stage:"第五周 · 倒计时十天",title:"计划表开始装不下",line:"越接近考试，越容易把焦虑误写成更多任务。",body:[
    "倒计时进入十天，课桌上的纸越来越多：错题清单、准考证通知、家长留言和没做完的专题卷。有人把休息划掉，有人不断寻找新方法，也有人因为一天没按计划完成，就想在第二天塞进双倍任务。",
    "这一周允许承认资源真的会用完。勇气、知识或时间降到零，不代表人物被淘汰，而是必须暂停扩张计划：删掉或缩减一件事，找一个具体的人求助，约定执行时间。调整不是退步，它要留下可以检查的动作，而不是一句“以后合理安排”。"
  ]},
  {theme:"考场准备和最后取舍",stage:"第六周 · 考前两天",title:"书包里最后留下什么",line:"最后一周不再添加宏大计划，只留下考场里真正用得上的动作。",body:[
    "考点通知发下来后，班主任用一节班会检查准考证、文具、路线和睡眠。黑板上没有新的提分清单，只写着四句话：看清题目；卡住先跳；留出检查时间；紧张时把注意力放回下一步。",
    "六个人回看过去五周，发现留下来的不只是资源数字。一次开口改变了搭档相处的方式，一次删减保护了睡眠，一次失误让复盘从情绪变成动作。最后六张牌不会决定谁的人生更好，只会让每个人确认：进入考场时，自己准备带走哪一种做法。"
  ]}
];

const PERSONAL_CONTEXT = [
  ["通勤计划被临时变化打断", "把不会的题藏在整齐笔记后面", "训练与订正争抢同一段时间", "转学后的资料和同伴仍不熟悉", "一次小失误很容易被放大", "新工具和消息不断切走注意力"],
  ["妈妈与外婆的作息很难同时配合", "答应陪弟弟的时间已经写进周末", "队友在等一份明确的训练答复", "父母也在适应新城市的工作", "家人的关心常常落到排名上", "父母轮班，晚上的节奏要自己守住"],
  ["做题速度没有跟上原先计划", "一道电学题仍然没有问出口", "疲劳让熟悉题也看漏条件", "新旧教材进度没有完全接上", "排名变化盖住了稳定的基础", "切换任务造成了不必要的失分"],
  ["需要练习在计划改变时开口", "需要把问题直接说给搭档听", "需要有人一起判断体力边界", "需要一次明确的加入邀请", "需要把检查清单变成共享方法", "需要把工具真正用到完成任务"],
  ["补做标记已经挤满计划表边缘", "照顾别人后仍不愿说明疲惫", "训练后还想按满状态安排难题", "担心求助会让父母更不安", "一道难题正在吞掉其他科目", "收藏的方法比完成的练习更多"],
  ["要为交通和入场留出余量", "要把提问经验变成考场自救", "要在兴奋和疲劳之间守住节奏", "要把陌生考点先变成可观察路线", "要允许检查结束后真正停笔", "要让手机回到联系工具的位置"]
];

const PERSONALIZED_CARD_STORIES = {
  "w2-o-personal":[
    "周五晚饭后，妈妈把周六排班表放到桌上。她早上七点半去社区医院，外婆九点要去取药，林晓晨原计划九点到十一点整理数学错题。三件事撞在一起，晓晨本来准备把复习挪到深夜。妈妈没有替她决定，只请她说清哪段时间最不能再被打断。家里可以调整一项安排，但晓晨也要明确自己仍会负责什么。",
    "周五晚上，爸爸还在外地出差，妈妈说明天九点半要送弟弟去作文班。周雨桐原本答应陪弟弟检查作业，也计划用上午订正两道一直没问出口的物理题。她正准备把物理推到晚上，妈妈却把周末表摊开，请她先说明需要哪段安静时间。家里愿意分担一次，但不能把照顾弟弟的事情全部留给妈妈。",
    "周五晚饭时，陈子航说周六训练临时延长到十一点半，妈妈也提醒他下午要去爷爷奶奶家吃饭。训练后的休息、家庭安排和模拟卷订正挤在一起，他仍习惯说晚上都能补完。爸爸把车钥匙放回桌上，请子航先报出一个真实可完成的时间段。家里愿意改一次出发安排，但他必须承认训练后需要恢复，也要完成自己的订正。",
    "周五晚上，新家的纸箱还堆在客厅。周六九点安装师傅上门，父母原本都要加班，赵思齐默认自己留下等候；可他十点已经约好补转学前缺下的专题。父亲发现时间冲突后，拿出排班表问他希望家里替他接住哪一件事。父母可以换一次班或调整拆箱计划，思齐则要第一次把学校里的真实需要说完整。",
    "周五晚饭后，爷爷说明早要去菜场，父母中午还安排了和亲戚吃饭。何嘉宁原计划上午按清单复盘模拟卷，想到饭桌上可能再次被问排名，她已经准备把复盘推到深夜。妈妈看见她反复擦改时间表，提出全家重新排一次周六。家里可以缩短一项安排，但嘉宁要说清自己需要的是复盘时间，不是躲开所有关于成绩的谈话。",
    "周五晚上，父母的周六轮班刚好错开：妈妈早班，爸爸下午班，一家人只有中午能一起吃饭。吴辰安本想趁独自在家看完三段学习视频，再做练习，却知道消息一响就会不断切换。爸爸请他把需要保护的专注时段写进家庭群。父母可以减少一次临时提醒或调整午饭时间，辰安也要承诺按时完成一项看得见的练习。"
  ]
};

const PERSONALIZED_OPTION_DETAILS = {
  "w2-o-personal":[
    ["请妈妈前一晚准备好取药材料，晓晨八点四十陪外婆出门；回家后十点到十一点半不再安排买菜或家务，专门完成数学错题整理。","晓晨照常陪外婆取药，妈妈下班前负责买菜，外婆把午饭改成简餐；三人共同腾出下午两点到三点的复习时间。"],
    ["请妈妈周六九点半送弟弟上课，雨桐守住九点到十点半订正物理；十一点后由她检查弟弟作文，不能把承诺直接取消。","雨桐先陪弟弟检查四十分钟作业，妈妈负责接送；午饭后家里保持安静一小时，让她完成两道物理题并把问题发给老师。"],
    ["请父母把去爷爷奶奶家的出发时间推迟到下午两点，子航训练后先休息半小时，再用十二点到一点订正模拟卷。","保留原定家庭午饭，由爸爸提前告知可能晚到；子航把订正拆成训练前二十分钟和晚上四十分钟，并取消额外加题。"],
    ["请父亲上午换班留在家等安装师傅，思齐九点四十出门参加专题补课；下午由他独立完成两个纸箱的整理。","父亲负责前半小时交接，思齐把补课改为线上参加；安装结束后他向老师补问缺失部分，并和父母一起整理客厅一小时。"],
    ["请父母把亲戚午饭推迟到十二点半，嘉宁守住九点到十点半复盘模拟卷；复盘结束后正常参加聚餐。","保留聚餐时间，但全家约定饭桌上只问一道嘉宁愿意讨论的错题；爷爷负责买菜，她在下午完成一小时复盘。"],
    ["请父母在上午九点到十点半只处理紧急电话，不在家庭群连续提醒；辰安关闭其他通知，完成二十道基础题后主动报完成。","午饭提前到十一点半，父母各自上班后不再追加家务；辰安把下午两点到三点设为专注时段，只做一份练习，不打开新视频。"]
  ]
};

const CARD_STORY_EXTENSIONS = {
  "w1-o-personal":"写完后，{self}没有马上往空白处增加任务，而是用铅笔把这一格轻轻圈住。那二十分钟第一次不代表偷懒，而是为堵车、值日或疲惫留下周转的余地。",
  "w1-c-personal":"台灯下，{self}把橡皮在计划表上来回擦了两次，最后停在最不紧急的一项旁边。真正难的不是继续写，而是接受今天确实不可能把所有事情都做完。",
  "w1-d-personal":"预备铃快响时，{self}还捏着两页不同的练习，周围已经有人开始收书。眼前的选择会改变今晚的任务顺序，也会影响明早坐进教室时还剩多少精力。",
  "w1-o-pair":"两个人用不同颜色圈出不能挪动和可以调整的时间，还发现彼此正好看见了对方忽略的部分。纸上的空格没有变多，但接下来遇到变化时，他们知道可以先问谁。",
  "w1-d-pair":"他们把约定写在便签上，又一起划掉一句太像命令的话。每天检查或按需开口都可能有用，前提是先分清什么是提醒，什么会让人感到被管着。",
  "w1-c-class":"贴纸越贴越密，原来只写三项的同学也拿起笔补到了第六项。几分钟里，教室里的焦虑像接力一样传开，连还没想好目标的人也开始担心自己落后。",

  "w2-c-personal":"手机屏幕上同时停着家人、老师和同伴的消息，{self}几次打开对话框又退出来。拖延并没有让冲突消失，只让原本可以商量的时间变得越来越短。",
  "w2-d-personal":"窗外已经有人准备出门，桌上的专题卷也刚翻到第一页。{self}知道无论选哪一边，另一件事都需要重新安排，而不是留到周日晚上再匆忙补救。",
  "w2-c-pair":"{partner}低头看着那枚已经被勾上的选项，手指在桌边停了几秒。{self}这才意识到，替别人省时间和替别人作决定不是同一件事，好意也需要先经过询问。",
  "w2-d-pair":"资料上有几处两个人都想看的批注，他们先后翻到同一页，又各自看了一眼时间。怎么使用这份资料，也在考验他们能否说清自己的节奏并遵守约定。",
  "w2-o-class":"清单贴到后墙后，有人补上家里能提供打印，有人写下可以一起核对路线。那些原本分散在各个家庭里的支持被看见后，班级第一次有了可以共同调用的资源。",

  "w3-o-personal":"{self}拿起红笔，没有急着把正确答案抄满空白，而是在题号旁标出最可能的原因。一个模糊的坏结果被拆开后，终于出现了第二天可以验证的步骤。",
  "w3-c-personal":"放学后，走廊里的人声渐渐远了，{self}仍坐在原位反复看总分。卷面上其实留着不少线索，但自责把视线牢牢困在一个数字上，复盘迟迟没有开始。",
  "w3-d-personal":"讲台前已经排了两个人，答疑时间正在一分一分减少。{self}需要判断眼下缺的是一段安静整理的时间，还是一个能把思路推进下去的具体回答。",
  "w3-o-pair":"桌面上摊着两张分数不同的答题卡，却没有人先去看对方的总分。给出选择后，他们都松了一点力气，也更容易说清此刻究竟需要陪伴、方法还是暂时安静。",
  "w3-c-pair":"上课铃响后，两个人仍各自翻着卷子，原本准备一起看的题一页也没动。那句比较没有真正回答谁的问题，反而让双方都忙着证明自己并不是较差的那一个。",
  "w3-d-class":"投票纸从前排传到后排，有人很快勾选，也有人握着笔迟迟没有落下。班主任提醒大家，先做哪件事不仅影响十分钟的效率，也会决定谁愿意在接下来开口。",

  "w4-o-personal":"对方顺着{self}指的位置看了一遍，只追问了两个条件，问题便缩小到一个步骤。{self}回到座位后重新做了一次，确认得到的不是现成答案，而是一条能继续走的路。",
  "w4-c-personal":"文件名安静地躺在聊天列表里，旁边的未读提示已经消失。{self}每次想到要打开就觉得又多了一项任务，直到晚饭后才发现，收到帮助和真正使用帮助之间还隔着一次安排。",
  "w4-d-personal":"草稿纸上已经留下三行推导，说明{self}并非毫无头绪；但同一个地方也被擦改了两次。继续尝试还是开口求助，都需要先给这道题画出明确的时间边界。",
  "w4-c-pair":"任务完成得很快，{partner}却只能看着最终结果猜中间发生了什么。{self}也发现自己承担得越多，越没有时间确认对方是否真正参与，合作表面顺利却失去了来回。",
  "w4-d-pair":"两个人把最近几次互助写在纸上，发现有效的支援都很具体，也都没有替谁完成最后一步。要不要现在启用，需要他们共同确认触发条件，而不是临时凭感觉决定。",
  "w4-o-class":"下课后，文件盒前很快排起短队，但每个人只能拿走一页，也必须留下使用后的标记。共享开始有了秩序，资料的价值不再取决于页数，而在于是否真的帮助人解决问题。",

  "w5-o-personal":"{self}盯着被划去的那一行，起初仍有些不踏实，过了一会儿才把注意力移回正在做的题。计划变短以后，桌面没有那么拥挤，完成的标准也终于重新变得清楚。",
  "w5-c-personal":"台灯照着同一道题，{self}第三次读到一半才发现又跳过了条件。此刻增加时长已经换不来同等的效果，停下、收拾书桌和安排明早的第一步反而更需要勇气。",
  "w5-d-personal":"新的清单有好几项看起来都可能有用，{self}却找不到一段完整时间把它们塞进去。越接近考试，新增内容带来的安心越短，真正的代价往往要到第二天疲惫时才出现。",
  "w5-o-pair":"被提醒的人先有些不服气，低头重看刚才的题，才发现条件确实漏了两遍。随后两个人交换计划表，各自删掉一项，提醒不再只是一个人对另一个人的单向照顾。",
  "w5-d-pair":"视频邀请停在屏幕上，两个人都没有立刻按下接听。守住约定很重要，但把疲惫伪装成陪伴也没有意义；无论继续还是取消，都要给下一步留下准确时间。",
  "w5-c-class":"有人笑着报出凌晨睡觉的时间，教室里立刻响起几声惊叹，也有人悄悄合上原本的休息计划。口号制造了短暂的冲劲，却正在把疲惫包装成值得比较的成绩。",

  "w6-o-personal":"走到考点门口时，{self}特意停下看了公交站、校门和入场通道的位置，还记下备用入口。回程路上，担心没有完全消失，但已经能被拆成几项可以提前处理的小事。",
  "w6-c-personal":"下载进度刚走到一半，{self}看了一眼已经整理好的书包和床头闹钟。此刻最难的不是判断资料有没有用，而是承认最后一晚已经不适合再开启一套新的复习路线。",
  "w6-d-personal":"候考区里有人低头翻页，也有人靠着墙安静呼吸。{self}只能选择一种节奏，并把注意力留在眼前二十分钟，而不是不断猜测别人此刻是否准备得更多。",
  "w6-o-pair":"消息发出后，两边都没有继续追问分数、进度或遗漏的知识点。短短一句确认让人知道对方在，也让这一晚仍然属于各自的休息和准备。",
  "w6-c-pair":"{partner}的手指越握越紧，{self}说到一半终于注意到这个变化。临考前的信息越多不一定越有帮助，他们需要把提醒缩到对方真正愿意接住的一件事。",
  "w6-d-class":"最后几张投票纸交上来时，教室里比平时安静。无论多数人选中哪一项，另一项需求都不会消失；全班需要给它安排一个短而明确的补充位置。"
};

const CARD_ACTION_OPTIONS = {
  "w1-o-personal":[
    {label:"保留空白，专门承接临时变化",effects:{self:{time:2}}},
    {label:"拿出一半空白，整理当天薄弱点",effects:{self:{knowledge:1,courage:1}}}
  ],
  "w1-c-personal":[
    {label:"删去最低优先级的一项，按时休息",effects:{self:{time:-1,courage:1}}},
    {label:"保留核心任务，把一项明确移到明天",effects:{self:{time:-2,knowledge:1}}}
  ],
  "w1-o-pair":[
    {label:"互相圈出一个需要提醒的时间点",effects:{self:{knowledge:1},partner:{courage:1},bond:1}},
    {label:"共同找出一段可以调整的机动时间",effects:{self:{time:1},partner:{time:1}}}
  ],
  "w1-c-class":[
    {label:"每人删掉一项难以完成的任务",effects:{all:{time:-1,courage:1}}},
    {label:"不删任务，但只保留三个本周重点",effects:{all:{time:-2,knowledge:1}}}
  ],

  "w2-o-personal":[
    {label:"请家人帮忙守住一段安静时间",effects:{self:{time:2}}},
    {label:"共同调整一项家庭安排",effects:{self:{time:1,courage:1}}}
  ],
  "w2-c-personal":[
    {label:"先联系相关的人，缩短一项安排",effects:{self:{time:-1,courage:1}}},
    {label:"完成最重要的一项，其余明确改期",effects:{self:{time:-2,knowledge:1}}}
  ],
  "w2-c-pair":[
    {label:"收回替对方做的决定，重新询问需要",effects:{self:{courage:-1},partner:{courage:1},bond:1}},
    {label:"保留原安排，但约定结束后共同复盘",effects:{self:{time:-1},partner:{time:-1}}}
  ],
  "w2-o-class":[
    {label:"优先协调全班需要的安静时段",effects:{all:{time:1,courage:1}}},
    {label:"优先建立打印与资料共享支持",effects:{all:{knowledge:1}}}
  ],

  "w3-o-personal":[
    {label:"按不会、看漏、超时分类全部错题",effects:{self:{knowledge:2}}},
    {label:"只重做最典型的一题并写下原因",effects:{self:{knowledge:1,time:1}}}
  ],
  "w3-c-personal":[
    {label:"先向一位同伴说出真实感受，再看卷面",effects:{self:{courage:-1,time:1}}},
    {label:"独处十分钟，随后只圈一处错因",effects:{self:{courage:-2,knowledge:1}}}
  ],
  "w3-o-pair":[
    {label:"先各自安静十分钟，再交换需要",effects:{self:{courage:1},partner:{courage:1},bond:1}},
    {label:"直接选一道共同错题开始复盘",effects:{self:{knowledge:1},partner:{knowledge:1},bond:1}}
  ],
  "w3-c-pair":[
    {label:"停止比较，改为交换一道典型错题",effects:{self:{knowledge:1,time:-1},partner:{knowledge:1,time:-1},bond:1}},
    {label:"暂时分开复盘，放学前再确认一次",effects:{self:{time:1,courage:-1},partner:{time:1,courage:-1}}}
  ],

  "w4-o-personal":[
    {label:"带着已做步骤向老师提一个问题",effects:{self:{courage:1,knowledge:1}}},
    {label:"请搭档只提示下一步，不直接讲答案",effects:{self:{courage:1,time:1}}}
  ],
  "w4-c-personal":[
    {label:"今晚只处理资料中最相关的一页",effects:{self:{knowledge:1,time:-1}}},
    {label:"先归档资料，保住原定复习任务",effects:{self:{knowledge:-1,time:1}}}
  ],
  "w4-c-pair":[
    {label:"把一个关键部分交还给搭档完成",effects:{self:{time:-1},partner:{knowledge:1},bond:1}},
    {label:"先完成任务，再留时间讲清中间步骤",effects:{self:{time:-2},partner:{knowledge:1}}}
  ],
  "w4-o-class":[
    {label:"每人贡献一页真正使用过的资料",effects:{all:{knowledge:1}}},
    {label:"按薄弱点组成临时讲解搭档",effects:{all:{courage:1,time:-1}}}
  ],

  "w5-o-personal":[
    {label:"直接删掉一项低收益任务",effects:{self:{time:2,courage:1}}},
    {label:"保留任务，但为它设置二十分钟上限",effects:{self:{time:1,knowledge:1}}}
  ],
  "w5-c-personal":[
    {label:"现在停止，收拾书桌并按时睡觉",effects:{self:{time:-1,courage:1}}},
    {label:"改做十分钟轻量复盘，再立刻结束",effects:{self:{time:-2,knowledge:1}}}
  ],
  "w5-o-pair":[
    {label:"互相删掉一项低收益任务",effects:{self:{time:1},partner:{time:1},bond:1}},
    {label:"约定一个疲劳信号，出现就提醒暂停",effects:{self:{courage:1},partner:{courage:1},bond:1}}
  ],
  "w5-c-class":[
    {label:"改写口号，并增加统一停止时间",effects:{all:{time:-1,courage:1}}},
    {label:"保留冲刺任务，但每人只选一个重点",effects:{all:{knowledge:1,time:-2}}}
  ],

  "w6-o-personal":[
    {label:"按真实时间再走一遍考点路线",effects:{self:{time:2,courage:1}}},
    {label:"整理物品、入口和备用方案清单",effects:{self:{knowledge:1,time:1}}}
  ],
  "w6-c-personal":[
    {label:"停止下载，把新资料留到考试后",effects:{self:{courage:1}}},
    {label:"只保存一页，十分钟后关闭手机",effects:{self:{time:-1,knowledge:1}}}
  ],
  "w6-o-pair":[
    {label:"只确认路线、文具和见面时间",effects:{self:{time:1},partner:{time:1},bond:1}},
    {label:"各发一句支持，不再追问复习进度",effects:{self:{courage:1},partner:{courage:1},bond:1}}
  ],
  "w6-c-pair":[
    {label:"停下提醒，先问对方现在需要什么",effects:{self:{courage:1},partner:{courage:-1},bond:1}},
    {label:"结束讨论，各自回到入场准备",effects:{self:{courage:-1,time:1},partner:{courage:-1,time:1}}}
  ]
};

const OPTION_DETAILS = {
  "w1-o-personal":["从今晚起，在每天计划末尾固定留20分钟；临时任务只能放进这段时间，不能继续往后加码。","用前10分钟列出当天最薄弱的一处，再用后10分钟只订正一道代表题，时间到就停。"],
  "w1-c-personal":["今晚九点半前划掉收益最低的一项，在计划表旁写明原因，并保证十点半前上床。","保留最重要的订正，把另一项写到明天具体时段，不用一句以后补上含糊带过。"],
  "w1-d-personal":["先用15分钟处理最害怕的部分，只圈出一道仍不会的题，明早带着它去问人。","在30分钟内完成10道基础题，错题只做标记，时间到后不继续追加。"],
  "w1-o-pair":["两人各自在作息表上圈出明天最容易被打断的20分钟，并约定开始前只发一次提醒。","把周四晚自习后的30分钟设为共同机动时间，临时任务先放进这段时间再决定取舍。"],
  "w1-d-pair":["每天晚上九点互发一次计划照片，只回复完成或需调整，不评价对方做得多不多。","约定一个求助暗号，只有对方主动发出时才查看计划，十分钟内结束讨论。"],
  "w1-c-class":["每人当场划掉一项本周难以完成的任务，并在贴纸背面写下删去它的理由。","每人给任务标上1、2、3三个优先级，本周只检查前三项，其余不计入完成度。"],

  "w2-o-personal":["和家人约定周六上午九点到十点不安排家务或外出，结束后主动报告完成情况。","从接送、做饭或陪伴家人中选一项重新分工，并把新的开始与结束时间写进家庭群。"],
  "w2-c-personal":["五分钟内联系最受影响的人，把一项活动缩短到30分钟，并说明自己何时离开。","只完成周一必须交的一项，其余任务分别写到周日晚上六点和下周一放学后。"],
  "w2-d-personal":["用90分钟完成一个薄弱专题，最后30分钟核对错因，不再打开第二份资料。","和家人外出两小时，出门前把今晚唯一保留的复习任务写在桌面便签上。"],
  "w2-c-pair":["当场擦掉替对方勾选的项目，先问对方需要提醒、陪同还是暂时不介入。","先照原安排完成，放学前留15分钟复盘这次决定，下次必须先得到对方确认。"],
  "w2-d-pair":["共同使用资料40分钟，只讨论提前标出的3道题，铃响后各自带走一条结论。","两人各使用25分钟，在封面写好交接时间，最晚周一早读前归还给下一位。"],
  "w2-o-class":["全班统一建议家长每天晚上八点到九点不临时增加安排，一周后反馈是否有效。","资料按科目和日期命名，每人每周最多上传一页真正使用过的内容，避免重复堆积。"],

  "w3-o-personal":["用三种颜色分别标记不会、看漏和超时，并统计哪一类最多，作为明天的第一项任务。","选失分最多的一类，只重做一道代表题；做完后遮住答案复述关键步骤。"],
  "w3-c-personal":["给一位可信任的同伴发一句真实感受，约十分钟后一起只看一道题，不讨论排名。","把计时器设为10分钟，允许自己暂时不看卷子；铃响后只圈出一处明天能改的地方。"],
  "w3-d-personal":["先用10分钟写出错因，若仍说不清，就把题号和卡住步骤记到答疑纸上。","带着写好的题号、已做步骤和一个具体问题排队，答疑结束后马上补记答案。"],
  "w3-o-pair":["两人各自安静10分钟，再从一起看题、听对方说或暂不讨论中选一种需要。","各挑一道共同失分题，用3分钟讲自己的思路，对方只负责指出一个断点。"],
  "w3-c-pair":["把总分盖住，只交换一道最典型的错题，分别说出错误发生在第几步。","先各自复盘20分钟，放学前再见5分钟，只确认是否找到错因，不比较数量。"],
  "w3-d-class":["先用3分钟看分数分布，再用7分钟讨论变化原因；任何人都可以选择不公开个人分数。","按不会、看漏和超时分成三组，每组只整理一条第二天能试行的办法。"],

  "w4-o-personal":["把已完成的三步写在纸上，只问老师从哪一步开始偏离，不要求完整讲解答案。","给搭档发题目照片并圈出卡点，请对方只提示下一步，自己在十分钟内继续完成。"],
  "w4-c-personal":["今晚八点半打开资料，只处理最相关的一页并完成其中两道题，20分钟后关闭文件。","把资料放入周五待看文件夹，先完成原计划；同时设定周五放学后的查看提醒。"],
  "w4-d-personal":["设15分钟计时器继续推导；若没有写出新步骤，立刻带着草稿向同伴提问。","现在就发出已做步骤和具体卡点，只接受一个提示，随后由自己完成剩余过程。"],
  "w4-c-pair":["把尚未提交的关键部分交回搭档，约定晚自习结束前由对方独立完成并说明思路。","先按时交付，之后留10分钟讲清中间步骤，再让搭档不看答案重做一遍。"],
  "w4-d-pair":["约定出现连续看漏两次或时间归零时才能支援，每次只减轻一点损失。","把可能需要支援的情形写在便签上，第五周再决定是否启用，本周不临时动用。"],
  "w4-o-class":["每人提交一页用过的资料，页首必须写适用题型和使用日期，不收整套未筛选文件。","三人一组，每人带一道具体问题，轮流讲5分钟；听者最后复述而不是抄答案。"],

  "w5-o-personal":["今晚开始前直接划掉一套与薄弱点重复的练习，并把省下的时间用于休息。","保留任务但设置20分钟计时，铃响只标记未完成处，不因为差一点就延长。"],
  "w5-c-personal":["现在合上书，写下明早六点五十分要做的第一题，十点前完成洗漱和上床。","只做10分钟错题分类，不碰新题；计时结束后把书放进书包并离开书桌。"],
  "w5-d-personal":["从新清单中只选8道针对题，晚九点半前结束，其余内容直接划去。","不启用新清单，保留原来的订正和睡眠时间，并把担心写成明天可核对的问题。"],
  "w5-o-pair":["交换计划表，各自替对方圈出一项低收益任务；是否删除仍由本人最后确认。","约定连续看漏两次作为疲劳信号，看到信号只提醒暂停，不继续讲题。"],
  "w5-d-pair":["把视频复习缩为20分钟，每人只讲一道错题，时间到立即结束通话。","今晚取消，并把下一次改到明天午休前20分钟；现在就把时间写进双方日程。"],
  "w5-c-class":["把黑板口号改成今晚十点半停止，第二天只检查是否做到，不比较学习时长。","每人只保留一个冲刺重点，每次练习最长30分钟，完成后必须离开座位休息。"],

  "w6-o-personal":["按考试当天的出门时间走一遍路线，同时记下堵车时换乘的站点和最晚出发时间。","逐项检查准考证、文具、入口和闹钟，缺一项就当场补齐，不再增加复习资料。"],
  "w6-c-personal":["立刻取消下载并删除文件，把手机切到勿扰模式，晚上九点后不再查看学习群。","只保存目录中最相关的一页，设10分钟计时；铃响后关闭手机并装入书包。"],
  "w6-d-personal":["只看一页写有5条提醒的纸，不翻新题；五分钟后折好放回书包。","收起资料，完成4轮缓慢呼吸，再默念遇到卡题时先跳过、最后回看的顺序。"],
  "w6-o-pair":["互发一条固定格式消息，只确认路线、文具和见面时间，确认后不再追问。","各发一句支持，只回应收到，不谈分数、复习量或可能遗漏的知识点。"],
  "w6-c-pair":["立刻停下提醒，问对方此刻需要路线确认还是安静等待，并等对方回答后再行动。","明确说先各自准备，约定入场队伍前见面；在此之前不再交换新的考试提醒。"],
  "w6-d-class":["全班跟随投影逐项核对物品和路线，发现缺项的人当场写下补齐负责人和时间。","六人各用20秒说一条受挫后的调整，记录员只记动作，不评价谁的方法更好。"]
};

const CARDS = [
  {id:"w1-o-personal",round:1,type:"opportunity",scope:"personal",title:"计划表留出一格空白",story:"周一午休，班主任没有催大家把四十二天排满，而是请{self}在每天计划末尾留出二十分钟空白。{self}想到自己正面对的“{context}”，第一次把备用安排也写进计划。",effects:{self:{time:1,courage:1}},task:"说出这段空白最可能用来承接哪一种变化。"},
  {id:"w1-c-personal",round:1,type:"challenge",scope:"personal",title:"第一天就没有照表完成",story:"周一晚上九点，{self}发现计划表上仍有两项没有完成。家里传来一句“早点休息吧”，可“{context}”让人很难停笔。继续硬撑看似勤奋，也可能把明天一起透支。",effects:{self:{time:-2}},task:"写下今晚保留、缩短和延后的任务各一项。"},
  {id:"w1-d-personal",round:1,type:"decision",scope:"personal",title:"先补短板还是先稳住节奏",story:"周二早读前，{self}手里同时放着薄弱专题和当天必须完成的基础练习。想到“{context}”，这四十分钟不可能兼顾全部。现在要决定先碰最害怕的部分，还是先建立一段稳定节奏。",options:[{label:"先处理薄弱项",effects:{self:{courage:1,knowledge:1,time:-1}}},{label:"先完成稳定练习",effects:{self:{knowledge:1,time:1}}}],task:"说明这项选择如何符合人物当下的生活，而不只看资源数字。"},
  {id:"w1-o-pair",round:1,type:"opportunity",scope:"pair",title:"同桌交换了一张真实作息表",story:"周三放学前，{self}和{partner}把各自一天的时间写在同一张纸上。两个人都发现，对方不是不够努力，只是被不同事情切开了时间。一次具体说明让计划与弹性有了共同语言。",effects:{self:{knowledge:1},partner:{courage:1},bond:1},task:"各说一句自己希望搭档提醒的事情。"},
  {id:"w1-d-pair",round:1,type:"decision",scope:"pair",title:"搭档要不要互相检查计划",story:"午休只剩十五分钟，{self}和{partner}讨论要不要每天互看计划。固定检查能减少拖延，也可能让人觉得被监督；只在需要时开口更自由，却要求双方先承认自己卡住了。",options:[{label:"约定每天固定检查",effects:{self:{time:1},partner:{time:1},bond:1}},{label:"需要时再主动开口",effects:{self:{courage:1},partner:{courage:1}}}],task:"定下一条双方都可以拒绝或修改的边界。"},
  {id:"w1-c-class",round:1,type:"challenge",scope:"class",title:"班级计划墙突然被写满",story:"周五班会，大家把目标贴上后，后排有人小声说“别人已经做这么多了”。比较的声音很快传开，六个人都想往自己的计划里再加任务。班主任停下计时器，请全班先删去一项并说明理由。",effects:{all:{time:-1}},task:"全班讨论30秒：删掉哪类看似努力、实际难以完成的任务？"},

  {id:"w2-o-personal",round:2,type:"opportunity",scope:"personal",title:"家里愿意重新排一次周六",story:"周五晚饭后，家人发现原定安排和复习撞在一起，决定把周六重新排一次。",effects:{self:{courage:1,time:1}},task:"选出谁调整哪一件事，并说明{self}仍要承担什么。"},
  {id:"w2-c-personal",round:2,type:"challenge",scope:"personal",title:"三件重要的事撞在星期六",story:"周六上午八点，{self}发现家庭安排、复习任务和原先承诺几乎同时开始。想到“{context}”，任何一项都不能假装不存在。犹豫拖掉了半小时，必须马上决定怎样沟通和取舍。",effects:{self:{time:-2,courage:-1}},task:"写出先联系谁、放弃或缩减什么、何时补做。"},
  {id:"w2-d-personal",round:2,type:"decision",scope:"personal",title:"周末空出的两小时怎么用",story:"周六下午，{self}意外空出两小时。桌上有一套薄弱专题，家人也提出一起出门走走。经历“{context}”之后，这段时间既能补知识，也可能用来恢复状态，不能把两边都完整塞进去。",options:[{label:"完成薄弱专题",effects:{self:{knowledge:2,time:-1}}},{label:"和家人短暂外出",effects:{self:{courage:2,time:-1}}}],task:"说明选择后另一件事如何安置。"},
  {id:"w2-c-pair",round:2,type:"challenge",scope:"pair",title:"一句“我替你决定了”",story:"午休时，{self}看见{partner}还没安排好周末，便直接替对方在共同计划上勾选了一项。出发点是想帮忙，{partner}却沉默了。两个人需要把关心和替人做决定之间的界线说清楚。",effects:{self:{courage:-1},partner:{courage:-1},bond:-1},task:"由双方各说一句：我需要的帮助是……，我不希望你替我……。"},
  {id:"w2-d-pair",round:2,type:"decision",scope:"pair",title:"一份资料，两种使用方式",story:"周日下午，{self}和{partner}只有一份整理好的专题资料。可以一起用四十分钟逐题讨论，也可以先由一人带回，第二天再交换。前者需要同步节奏，后者更灵活但可能让另一人等待。",options:[{label:"一起讨论关键题",effects:{self:{knowledge:1,time:-1},partner:{knowledge:1,time:-1},bond:1}},{label:"分时使用并约定归还",effects:{self:{time:1},partner:{time:1}}}],task:"写下结束时间或归还时间，避免含糊承诺。"},
  {id:"w2-o-class",round:2,type:"opportunity",scope:"class",title:"家长会改成了资源清单",story:"周一早上，班主任没有发布统一家庭要求，而是把家长们能提供的帮助整理成清单：安静时段、接送协调、打印资料和情绪陪伴。全班投票决定先使用最普遍需要的一项支持，并约定一周后反馈。",effects:{all:{time:1}},task:"全班讨论30秒：哪项帮助最具体，也最不容易变成额外压力？"},

  {id:"w3-o-personal",round:3,type:"opportunity",scope:"personal",title:"错题旁多了一个为什么",story:"成绩单发下后，老师没有要求{self}立刻订正全部，而是在一处失分旁写下“这是不会、看漏，还是时间不够？”“{context}”终于被拆成可以判断的原因，复盘有了入口。",effects:{self:{knowledge:2}},task:"把一次失分改写成可验证的问题。"},
  {id:"w3-c-personal",round:3,type:"challenge",scope:"personal",title:"第一反应盖住了卷面信息",story:"周三放学铃响，{self}仍盯着总分，没有翻到具体题目。想到“{context}”，自责的念头不断重复：我怎么又这样。二十分钟过去，却没有留下任何可用信息。情绪需要被承认，也要给复盘让出位置。",effects:{self:{courage:-2}},task:"先写出第一反应，再圈出明天能处理的一处信息。"},
  {id:"w3-d-personal",round:3,type:"decision",scope:"personal",title:"先独自复盘还是当场提问",story:"老师留出最后十五分钟答疑，{self}既可以先独立整理错因，也可以拿着最难开口的一题走到讲台前。面对“{context}”，两种方法都有效，但承担的压力和得到的信息不同。",options:[{label:"先独立整理错因",effects:{self:{knowledge:1,time:1}}},{label:"当场提出具体问题",effects:{self:{courage:2,knowledge:1}}}],task:"说出选择的停止条件：整理到何时，或具体问哪一句。"},
  {id:"w3-o-pair",round:3,type:"opportunity",scope:"pair",title:"搭档先问“你想怎么复盘”",story:"成绩出来后，{partner}没有追问{self}考了多少，只问：“你现在想一起看题，还是先安静十分钟？”{self}也把同样的选择还给对方。一次不越界的询问，让两个人都保住了复盘节奏。",effects:{self:{courage:1},partner:{courage:1},bond:1},task:"各提出一种帮助，并允许对方选择暂时不要。"},
  {id:"w3-c-pair",round:3,type:"challenge",scope:"pair",title:"比较分数让对话停住",story:"课间有人问起分数，{self}下意识拿自己和{partner}比较。话说出口后，两个人都开始解释，却没人再谈真正的错因。原本可以互补的复盘时间，被一场没有恶意的比较消耗掉。",effects:{self:{time:-1},partner:{time:-1},bond:-1},task:"把比较句改成一个双方都能回答的复盘问题。"},
  {id:"w3-d-class",round:3,type:"decision",scope:"class",title:"班会先讲排名还是先讲错因",story:"周五班会只剩十分钟，班主任让全班投票：先公开讨论分数变化，还是先按错因组成临时小组。前者能快速看见位置，后者能马上交换方法；任何选择都要照顾此刻的班级情绪和发言节奏。",options:[{label:"先讨论分数变化",effects:{all:{courage:-1,knowledge:1}}},{label:"先按错因组成小组",effects:{all:{knowledge:1,time:-1}}}],task:"全班讨论30秒并投票，再说出如何照顾少数意见。"},

  {id:"w4-o-personal",round:4,type:"opportunity",scope:"personal",title:"一句具体求助得到了回应",story:"晚自习后，{self}没有笼统地说自己什么都不会，而是指出一处卡住的步骤。面对“{context}”，老师或同伴只用了几分钟就确认问题所在。求助没有替代练习，却让下一步变得清楚。",effects:{self:{courage:1,knowledge:1}},task:"写出一句不道歉、不贬低自己的具体提问。"},
  {id:"w4-c-personal",round:4,type:"challenge",scope:"personal",title:"收到资料却没有真正使用",story:"周四晚上，{self}收到同学发来的整理资料，先回了一个“谢谢”，却因为“{context}”一直没有打开。帮助已经来到面前，若不安排具体使用时间，它仍会变成新的待办和压力。",effects:{self:{time:-1,knowledge:-1}},task:"从资料中选一页，并写明何时、用多长时间处理。"},
  {id:"w4-d-personal",round:4,type:"decision",scope:"personal",title:"这次要自己试还是马上求助",story:"一道题做到第三步时，{self}再次卡住。现在可以再独立尝试十五分钟，也可以立刻把已完成的步骤发给同伴。想到“{context}”，关键不是哪种方法更勇敢，而是怎样避免无边界地耗下去。",options:[{label:"再独立尝试十五分钟",effects:{self:{knowledge:1,time:-1}}},{label:"带着步骤向同伴求助",effects:{self:{courage:1,time:1}}}],task:"给选择加上明确的时间或问题边界。"},
  {id:"w4-c-pair",round:4,type:"challenge",scope:"pair",title:"好心帮忙变成了代做",story:"{self}看见{partner}赶时间，顺手把共同任务的关键部分全部完成。交上去很快，两个人却都说不清对方学到了什么。单方面承担让表面效率提高，也让关系里的说明和参与变少。",effects:{self:{time:-1},partner:{knowledge:-1},bond:-1},task:"重新分配一项必须由对方亲自完成的部分。"},
  {id:"w4-d-pair",round:4,type:"decision",scope:"pair",title:"搭档支援该留到什么时候",story:"{self}和{partner}发现彼此已经更了解对方的节奏。现在可以约定：一人资源受损时立即提醒并帮忙减轻一点；也可以继续积累默契，把支援留给更接近考场的时刻。",options:[{label:"现在建立明确支援规则",effects:{self:{courage:1},partner:{courage:1},bond:1}},{label:"保留弹性，先记录触发条件",effects:{self:{time:1},partner:{time:1}}}],task:"写出什么情况下可以支援，什么情况下仍需本人完成。"},
  {id:"w4-o-class",round:4,type:"opportunity",scope:"class",title:"共享资料架开始运转",story:"班级后墙多了三只文件盒，分别放基础题、易错点和考场提醒。每个人只需贡献一页自己真正用过的内容，也可以取走一页。资料不再属于少数整理得快的人，全班获得一次共同补缺机会。",effects:{all:{knowledge:1}},task:"全班讨论30秒：共享资料必须满足哪两条标准才不会越堆越乱？"},

  {id:"w5-o-personal",round:5,type:"opportunity",scope:"personal",title:"老师允许计划变短",story:"周一晚自习，老师巡视到{self}桌边，看见计划表边缘已经写满补做标记，只说：“今天删掉一项，也算完成计划。”面对“{context}”，这句许可让注意力重新回到最重要的任务。",effects:{self:{time:2,courage:1}},task:"删去一项收益低、代价高的任务，并说明判断依据。"},
  {id:"w5-c-personal",round:5,type:"challenge",scope:"personal",title:"疲劳被误认成不够努力",story:"晚上十点，{self}连续看错两次题目，却仍想用更晚睡来补救。想到“{context}”，身体已经给出信号，计划却还在追加。继续推进会失去时间，也可能让知识停留得更少。",effects:{self:{time:-2,knowledge:-1}},task:"写出今晚的停止条件、明早的第一步和一个求助对象。"},
  {id:"w5-d-personal",round:5,type:"decision",scope:"personal",title:"最后十天要加量还是减项",story:"倒计时只剩十天，{self}收到一份新的冲刺清单，同时原计划仍有未完成内容。面对“{context}”，可以增加练习覆盖面，也可以减少项目、守住睡眠和复盘，两条路都意味着放弃一部分可能性。",options:[{label:"增加一组针对练习",effects:{self:{knowledge:2,time:-2}}},{label:"减项并守住睡眠",effects:{self:{time:2,courage:1}}}],task:"说明选择后最可能担心什么，以及如何回应这种担心。"},
  {id:"w5-o-pair",round:5,type:"opportunity",scope:"pair",title:"搭档看见了对方的停止信号",story:"晚自习结束时，{self}仍准备继续加题，{partner}没有命令对方停下，而是指出刚才已经重复看漏条件。随后两个人也检查了彼此的计划，各删去一项低收益任务。提醒开始变成双向的。",effects:{self:{time:1},partner:{time:1},bond:1},task:"双方各写一个希望被提醒的疲劳信号。"},
  {id:"w5-d-pair",round:5,type:"decision",scope:"pair",title:"共同复习要不要临时取消",story:"{self}和{partner}原定晚上视频复习，但两个人都明显疲惫。照常进行能守住承诺，也可能只剩低效陪伴；临时取消能恢复体力，却要重新约定下一次，不能只说改天再继续。",options:[{label:"缩短为二十分钟复盘",effects:{self:{knowledge:1,time:-1},partner:{knowledge:1,time:-1},bond:1}},{label:"今晚取消并重约时间",effects:{self:{time:1},partner:{time:1}}}],task:"写出新的结束时间或下一次开始时间。"},
  {id:"w5-c-class",round:5,type:"challenge",scope:"class",title:"冲刺口号让全班集体加码",story:"早读前，黑板上被写下“最后十天拼到底”。几个人开始比较昨晚学到几点，原本准备休息的同学也临时加任务。班主任擦掉“到底”两个字，请全班重新定义什么叫有效冲刺，并留下停止标准。",effects:{all:{time:-1,courage:-1}},task:"全班讨论30秒：提出一条能观察、能停止、不会鼓励熬夜的冲刺标准。"},

  {id:"w6-o-personal",round:6,type:"opportunity",scope:"personal",title:"考场流程提前走了一遍",story:"考前两天，{self}按真实时间走完起床、出门、安检和入座流程。面对“{context}”，原本模糊的担心变成几项可检查动作。书包没有增加更多资料，心里却多出一点确定。",effects:{self:{courage:2,time:1}},task:"说出流程里最容易遗漏的一步和备用方案。"},
  {id:"w6-c-personal",round:6,type:"challenge",scope:"personal",title:"最后一晚又想增加新任务",story:"睡前九点，{self}看见群里有人分享新的押题资料，手已经点开下载。想到“{context}”，新内容带来短暂安心，也可能打乱已经练熟的节奏。手机亮着，必须在几分钟内做出安排。",effects:{self:{time:-1,courage:-1}},task:"决定资料如何处理，并写下今晚停止学习的具体时间。"},
  {id:"w6-d-personal",round:6,type:"decision",scope:"personal",title:"进考场前最后看什么",story:"入场前还有二十分钟，{self}可以翻看最后一页错题提醒，也可以收起资料，走一遍呼吸和答题顺序。面对“{context}”，两种准备保护的资源不同，选择后就不再来回切换。",options:[{label:"只看一页关键提醒",effects:{self:{knowledge:1,time:-1}}},{label:"收起资料稳定节奏",effects:{self:{courage:2}}}],task:"把选择写成考场前能直接照做的一句话。"},
  {id:"w6-o-pair",round:6,type:"opportunity",scope:"pair",title:"搭档只发来一句确认",story:"考前一晚，{self}和{partner}没有互相追问复习进度，只确认了文具、路线和睡觉时间。过去几周积累的了解让两个人知道，此刻不需要更多建议，一句“明早校门口见”已经足够。",effects:{self:{courage:1},partner:{courage:1},bond:1},task:"各说一句既支持对方、又不会增加压力的话。"},
  {id:"w6-c-pair",round:6,type:"challenge",scope:"pair",title:"临考提醒说得太多",story:"入场队伍前，{self}担心{partner}遗漏内容，一口气提醒了好几种可能失分的地方。{partner}越听越紧张，{self}也开始怀疑自己的准备。好意需要立刻收住，关系要回到清晰和信任。",effects:{self:{courage:-1},partner:{courage:-1},bond:-1},task:"把连续提醒缩成一句可执行的话，并确认对方是否需要。"},
  {id:"w6-d-class",round:6,type:"decision",scope:"class",title:"最后一节班会留下什么",story:"最后一节班会只剩五分钟，全班投票决定把时间用来核对物品与路线，还是每人说出一条受挫后的调整。前者降低现实遗漏，后者把六周经验带进考场，老师会照顾没有被选中的需要。",options:[{label:"统一核对物品和路线",effects:{all:{time:1}}},{label:"分享受挫后的调整",effects:{all:{courage:1}}}],task:"全班讨论30秒并投票，再为另一项安排一个补充办法。"}
];

const RESOURCE_KEYS = ["courage","knowledge","time","energy"];
const CORE_RESOURCE_KEYS = ["courage","knowledge","time"];
const RESOURCE_INFO = {courage:{name:"勇气",max:12},knowledge:{name:"知识",max:12},time:{name:"时间",max:12},energy:{name:"能量币",max:6}};
const TEAM_COLORS_V2 = ["#205b47","#426b84","#a84a43","#6c5a7e","#8a6426","#53614b"];

function makeTeam(index){
  const p=STUDENT_PROFILES[index];
  return {id:index+1,profileId:p.id,name:p.name,color:TEAM_COLORS_V2[index],resources:{courage:5,knowledge:5,time:10,energy:0},history:[],pendingAdjustment:[],adjustments:[],energyUsedRounds:[],strategy:null};
}
function shuffle(list){
  const copy=[...list];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
function createDecks(){
  return Object.fromEntries(Array.from({length:6},(_,i)=>{const round=i+1;return [round,shuffle(CARDS.filter(c=>c.round===round).map(c=>c.id))];}));
}
function createInitialState(){
  return {schemaVersion:CARD_SCHEMA_VERSION,phase:"setup",round:1,activeTeam:0,weeklyDecks:createDecks(),drawnCardIds:[],currentCardId:null,bonds:{desk:1,physics:1,classwork:1},pairAssistUsed:{desk:false,physics:false,classwork:false},roundSixRewardApplied:false,weeklyEchoes:[],story:{prologueSeen:false,profilesSeen:[],chaptersSeen:[]},teams:Array.from({length:6},(_,i)=>makeTeam(i)),undoStack:[],sound:true,reducedMotion:false,lastEvent:"人物的选择、代价和同伴影响会记录在这里。",strategy:null};
}
function clone(value){return JSON.parse(JSON.stringify(value));}
function normalizeCardState(value){
  if(!value||value.schemaVersion!==CARD_SCHEMA_VERSION)return createInitialState();
  value.undoStack||=[]; value.weeklyDecks||=createDecks(); value.drawnCardIds||=[]; value.weeklyEchoes||=[];
  value.story||={prologueSeen:false,profilesSeen:[],chaptersSeen:[]}; value.story.profilesSeen||=[]; value.story.chaptersSeen||=[];
  value.bonds||={desk:1,physics:1,classwork:1}; value.pairAssistUsed||={desk:false,physics:false,classwork:false};
  value.teams||=Array.from({length:6},(_,i)=>makeTeam(i));
  value.teams.forEach((team,i)=>{team.history||=[];team.pendingAdjustment||=[];team.adjustments||=[];team.energyUsedRounds||=[];team.color||=TEAM_COLORS_V2[i];});
  return value;
}
function loadCardState(){try{return normalizeCardState(JSON.parse(localStorage.getItem(CARD_STORAGE_KEY)));}catch{return createInitialState();}}
let game=loadCardState();
let modalLocked=false;
let isAnimating=false;

const byId=id=>document.getElementById(id);
const ui={phaseLabel:byId("phaseLabel"),roundLabel:byId("roundLabel"),weekTheme:byId("weekTheme"),deckCount:byId("deckCount"),storyRibbon:byId("storyRibbon"),storyStage:byId("storyStage"),storyChapter:byId("storyChapter"),storyLine:byId("storyLine"),eventCard:byId("eventCard"),cardSymbol:byId("cardSymbol"),cardMeta:byId("cardMeta"),cardTitle:byId("cardTitle"),cardPreview:byId("cardPreview"),currentTurn:byId("currentTurn"),drawHint:byId("drawHint"),drawButton:byId("drawButton"),lastEventText:byId("lastEventText"),studentAvatar:byId("studentAvatar"),currentStudentName:byId("currentStudentName"),studentBackground:byId("studentBackground"),studentGoal:byId("studentGoal"),studentPressure:byId("studentPressure"),profileButton:byId("profileButton"),resourceGrid:byId("resourceGrid"),conditionChip:byId("conditionChip"),actionProgress:byId("actionProgress"),partnerFocus:byId("partnerFocus"),turnNote:byId("turnNote"),studentList:byId("studentList"),progressCopy:byId("progressCopy"),bondList:byId("bondList"),soundButton:byId("soundButton"),motionButton:byId("motionButton"),storyButton:byId("storyButton"),saveButton:byId("saveButton"),undoButton:byId("undoButton"),helpButton:byId("helpButton"),resetButton:byId("resetButton"),modalBackdrop:byId("modalBackdrop"),modal:byId("modal"),modalClose:byId("modalClose"),modalKicker:byId("modalKicker"),modalTitle:byId("modalTitle"),modalBody:byId("modalBody"),modalActions:byId("modalActions")};

function saveGame(){localStorage.setItem(CARD_STORAGE_KEY,JSON.stringify(game));}
function captureState(){const snapshot=clone(game);snapshot.undoStack=[];return snapshot;}
function pushUndo(label){game.undoStack.push({label,state:captureState()});}
function undo(){
  if(isAnimating||modalLocked||!game.undoStack.length)return;
  const stack=game.undoStack;const entry=stack.pop();game=normalizeCardState(entry.state);game.undoStack=stack;closeModal(true);saveGame();render();playTone(330,.06);
  if(game.currentCardId)setTimeout(showCurrentCardModal,30);
}
function cardById(id){return CARDS.find(card=>card.id===id);}
function pairForStudent(index){return PAIRS.find(pair=>pair.members.includes(index));}
function partnerIndex(index){const pair=pairForStudent(index);return pair.members.find(i=>i!==index);}
function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
function escapeHtml(value=""){return String(value).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));}
function playTone(freq=440,duration=.08){
  if(!game.sound)return;
  try{const Ctx=window.AudioContext||window.webkitAudioContext;const ctx=new Ctx();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.frequency.value=freq;gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration);}catch{}
}
function effectEntries(effects={}){
  const entries=[];
  for(const [target,values] of Object.entries(effects)){
    if(target==="bond"){entries.push({key:"bond",text:`默契${values>0?"+":""}${values}`});continue;}
    const prefix=target==="partner"?"搭档·":target==="all"?"全班·":"";
    Object.entries(values).forEach(([key,val])=>entries.push({key,text:`${prefix}${RESOURCE_INFO[key].name}${val>0?"+":""}${val}`}));
  }
  return entries;
}
function formatEffects(effects={}){return effectEntries(effects).map(item=>item.text).join(" · ")||"资源不变";}
function effectChipsHtml(effects={}){const entries=effectEntries(effects);return `<div class="effect-chips">${entries.length?entries.map(item=>`<span class="effect-chip effect-${item.key}">${escapeHtml(item.text)}</span>`).join(""):`<span class="effect-chip">资源不变</span>`}</div>`;}
function renderStory(){
  const story=WEEK_STORIES[clamp(game.round,1,6)-1];ui.weekTheme.textContent=`第${game.round}周 · ${story.theme}`;ui.storyStage.textContent=story.stage;ui.storyChapter.textContent=story.title;ui.storyLine.textContent=story.line;
}
function renderCardStage(){
  const current=cardById(game.currentCardId);ui.eventCard.className="event-card back";
  if(current&&!isAnimating){ui.eventCard.classList.add("revealed",current.type);ui.cardSymbol.textContent=CARD_TYPES[current.type].symbol;ui.cardMeta.textContent=`${SCOPE_NAMES[current.scope]} · ${CARD_TYPES[current.type].name}`;ui.cardTitle.textContent=current.title;ui.cardPreview.textContent=current.task;}
  else{ui.cardSymbol.textContent="＊";ui.cardMeta.textContent="个人 · 机遇";ui.cardTitle.textContent="等待抽卡";ui.cardPreview.textContent="翻开这一周落到当前学生面前的事件。";}
  const remaining=(game.weeklyDecks[game.round]||[]).length;ui.deckCount.textContent=remaining;
  if(game.phase==="setup"){
    ui.currentTurn.textContent=`人物档案 ${game.story.profilesSeen.length} / 6`;ui.drawHint.textContent="先认识六位学生的家庭、优点、短板和目标，抽到的情景才会有意义。";ui.drawButton.textContent="查看人物档案";ui.drawButton.disabled=false;
  }else if(game.phase==="echo"){
    ui.currentTurn.textContent=`第 ${game.round} 周行动完成`;ui.drawHint.textContent="六张牌已经全部处理，查看资源与关系如何在这一周发生变化。";ui.drawButton.textContent="查看本周班级回声";ui.drawButton.disabled=false;
  }else if(game.phase==="final"){
    ui.currentTurn.textContent="六周行动全部完成";ui.drawHint.textContent="六位学生同时进入考前结算，从选择、调整和关系中生成各自的成长画像。";ui.drawButton.textContent="查看结局与成长策略单";ui.drawButton.disabled=false;
  }else{
    const team=game.teams[clamp(game.activeTeam,0,5)];ui.currentTurn.textContent=`第 ${game.round} 周 · ${team.name} 抽卡`;ui.drawHint.textContent=team.pendingAdjustment.length?"上次资源归零，请先完成调整任务，再抽取本周事件。":"牌堆已经洗好。每张牌只出现一次，撤回后仍会抽到同一张。";ui.drawButton.textContent=team.pendingAdjustment.length?"完成调整任务":"抽取本周事件";ui.drawButton.disabled=isAnimating||Boolean(game.currentCardId);
  }
}
function renderStudent(){
  const index=clamp(game.activeTeam,0,5),team=game.teams[index],profile=STUDENT_PROFILES[index],pair=pairForStudent(index),partner=game.teams[partnerIndex(index)];
  ui.studentAvatar.textContent=profile.name[0];ui.studentAvatar.style.background=team.color;ui.currentStudentName.textContent=profile.name;ui.studentBackground.textContent=profile.background;ui.studentGoal.textContent=profile.goal;ui.studentPressure.textContent=profile.pressure;
  ui.resourceGrid.innerHTML="";RESOURCE_KEYS.forEach(key=>{const item=document.createElement("div"),value=team.resources[key],max=RESOURCE_INFO[key].max;item.className=`resource-item resource-${key}`;item.style.setProperty("--resource-percent",`${Math.round(value/max*100)}%`);item.innerHTML=`<span class="resource-icon" aria-hidden="true">${RESOURCE_INFO[key].name[0]}</span><div class="resource-copy"><span class="resource-name">${RESOURCE_INFO[key].name}</span><div class="resource-number"><strong class="resource-value">${value}</strong><span class="resource-max">/ ${max}</span></div></div>`;ui.resourceGrid.append(item);});
  ui.conditionChip.textContent=team.pendingAdjustment.length?"等待调整":"状态稳定";ui.conditionChip.classList.toggle("trouble",team.pendingAdjustment.length>0);ui.actionProgress.textContent=`本周第 ${Math.min(index+1,6)} / 6 位`;
  const bond=game.bonds[pair.id];ui.partnerFocus.innerHTML=`<span>${pair.name} · ${escapeHtml(pair.theme)}</span><strong>${escapeHtml(team.name)} × ${escapeHtml(partner.name)}</strong><div class="bond-dots">${[1,2,3].map(n=>`<i class="bond-dot ${bond>=n?"filled":""}"></i>`).join("")}</div>`;
  ui.turnNote.textContent=team.history.at(-1)?.summary||"尚未开始行动。";
}
function renderClass(){
  const done=game.round===6&&game.phase==="final"?6:game.activeTeam;ui.progressCopy.textContent=`本周 ${game.phase==="echo"||game.phase==="final"?6:done} / 6 人完成`;
  ui.studentList.innerHTML="";game.teams.forEach((team,index)=>{const button=document.createElement("button");button.className=`student-card ${index===game.activeTeam&&game.phase==="playing"?"active":""} ${index<game.activeTeam||game.phase==="echo"||game.phase==="final"?"done":""}`;button.innerHTML=`<div class="student-card-head"><span class="student-index" style="background:${team.color}">${index+1}</span><strong>${escapeHtml(team.name)}</strong></div><small>${escapeHtml(STUDENT_PROFILES[index].goal)}</small><div class="resource-mini"><span>勇 ${team.resources.courage}</span><span>知 ${team.resources.knowledge}</span><span>时 ${team.resources.time}</span><span>能 ${team.resources.energy}</span></div>`;button.onclick=()=>showProfile(index);ui.studentList.append(button);});
}
function renderBonds(){
  ui.bondList.innerHTML=PAIRS.map(pair=>{const a=game.teams[pair.members[0]],b=game.teams[pair.members[1]],value=game.bonds[pair.id];let stateText=value>=3?"共同结局":value>=2?(game.pairAssistUsed[pair.id]?"支援已使用":"支援可用"):value===0?"需要沟通":"建立中";return `<article class="bond-card"><div class="bond-card-head"><div><strong>${escapeHtml(a.name)} × ${escapeHtml(b.name)}</strong><em>${pair.name} · ${escapeHtml(pair.theme)}</em></div><span class="bond-value">${value}/3</span></div><div class="bond-progress"><div class="bond-dots" aria-hidden="true">${[1,2,3].map(n=>`<i class="bond-dot ${value>=n?"filled":""}"></i>`).join("")}</div><span class="bond-state">${stateText}</span></div></article>`;}).join("");
}
function render(){
  document.body.classList.toggle("reduce-motion",game.reducedMotion);ui.soundButton.classList.toggle("active",game.sound);ui.motionButton.classList.toggle("active",game.reducedMotion);ui.motionButton.textContent=game.reducedMotion?"静":"动";
  ui.phaseLabel.textContent=game.phase==="setup"?"人物准备":game.phase==="echo"?"班级回声":game.phase==="final"?"考前结算":"同班事件";ui.roundLabel.textContent=`第 ${game.round} / 6 周`;ui.lastEventText.textContent=game.lastEvent;
  ui.undoButton.disabled=isAnimating||modalLocked||!game.undoStack.length;ui.undoButton.title=game.undoStack.length?`撤回：${game.undoStack.at(-1).label}`:"暂无可撤回操作";ui.undoButton.setAttribute("aria-label",ui.undoButton.title);
  renderStory();renderCardStage();renderStudent();renderClass();renderBonds();
}

function openModal({kicker,title,body,actions=[],wide=false,card=false,locked=false}){
  modalLocked=locked;ui.modal.className=`modal ${wide?"wide-modal":""} ${card?"card-modal":""}`;ui.modalKicker.textContent=kicker;ui.modalTitle.textContent=title;ui.modalBody.innerHTML=body;ui.modalActions.innerHTML="";actions.forEach(action=>{const btn=document.createElement("button");btn.className=action.secondary?"secondary-button":"primary-button";btn.textContent=action.label;btn.disabled=Boolean(action.disabled);btn.onclick=action.onClick;ui.modalActions.append(btn);});ui.modalClose.disabled=locked;ui.modalBackdrop.classList.remove("hidden");render();
}
function closeModal(force=false){if(modalLocked&&!force)return;modalLocked=false;ui.modalBackdrop.classList.add("hidden");ui.modalBody.innerHTML="";ui.modalActions.innerHTML="";render();}
function showBriefing(){
  const cards=STUDENT_PROFILES.map((p,i)=>`<button class="briefing-card ${game.story.profilesSeen.includes(p.id)?"seen":""}" data-profile="${i}"><span class="student-avatar" style="background:${TEAM_COLORS_V2[i]}">${p.name[0]}</span><div><strong>${p.name}</strong><small>${escapeHtml(p.personality.split("；")[0])}</small><p>${escapeHtml(p.background)}</p></div><span class="profile-view-button">${game.story.profilesSeen.includes(p.id)?"已阅读":"查看背景"}</span></button>`).join("");
  openModal({kicker:"序章 · 人物准备",title:"先认识同一班的六位学生",wide:true,body:`<div class="story-body"><p>距离中考还有六周。六个小组各支持一位虚构学生，但他们不是六条彼此隔开的路线：他们坐在同一间教室，有固定搭档，也会被同一次模拟考、班会和资料共享同时影响。</p><p>请依次阅读六份档案。人物都有可依靠的长处，也有在压力下容易出现的习惯；家庭处境只解释生活限制，不代表能力高低。</p></div><div class="profile-briefing"><div class="briefing-heading"><strong>人物档案</strong><span>${game.story.profilesSeen.length} / 6 已查看</span></div>${cards}</div>`,actions:[{label:game.story.profilesSeen.length===6?"开始第一周":"阅读全部档案后开始",disabled:game.story.profilesSeen.length!==6,onClick:startGame}],locked:game.phase==="setup"});
  ui.modalBody.querySelectorAll("[data-profile]").forEach(btn=>btn.onclick=()=>showProfile(Number(btn.dataset.profile),true));
}
function showProfile(index,returnToBriefing=false){
  const p=STUDENT_PROFILES[index];if(!game.story.profilesSeen.includes(p.id)){game.story.profilesSeen.push(p.id);saveGame();}
  openModal({kicker:`人物档案 ${index+1} / 6`,title:p.name,wide:false,body:`<div class="profile-story">${p.story.map(text=>`<p>${escapeHtml(text)}</p>`).join("")}</div><div class="profile-sheet"><dl><div><dt>家庭与日常</dt><dd>${escapeHtml(p.family)}</dd></div><div><dt>性格与兴趣</dt><dd>${escapeHtml(p.personality)}</dd></div><div><dt>可以依靠的优点</dt><dd>${escapeHtml(p.strength)}</dd></div><div><dt>压力下的短板</dt><dd>${escapeHtml(p.weakness)}</dd></div><div><dt>六周目标</dt><dd>${escapeHtml(p.goal)}</dd></div></dl></div>`,actions:[{label:returnToBriefing?"返回人物列表":"关闭",onClick:()=>returnToBriefing?showBriefing():closeModal(true)}],locked:returnToBriefing});
}
function startGame(){if(game.story.profilesSeen.length!==6)return;pushUndo("开始六周故事");game.phase="playing";game.story.prologueSeen=true;game.lastEvent="六位学生的档案已读完。第一周牌堆已经洗好。";closeModal(true);saveGame();render();playTone(520,.09);showWeekStory();}
function showWeekStory(){
  const story=WEEK_STORIES[game.round-1];if(!game.story.chaptersSeen.includes(game.round)){game.story.chaptersSeen.push(game.round);saveGame();}
  openModal({kicker:story.stage,title:story.title,wide:true,body:`<div class="story-body">${story.body.map(p=>`<p>${escapeHtml(p)}</p>`).join("")}</div>`,actions:[{label:"进入本周",onClick:()=>closeModal(true)}]});
}
function personalizedText(text,index,round){
  const partner=game.teams[partnerIndex(index)],context=PERSONAL_CONTEXT[(round||game.round)-1][index];
  return text
    .replaceAll("“{context}”",context)
    .replaceAll("{self}",game.teams[index].name)
    .replaceAll("{partner}",partner.name)
    .replaceAll("{context}",context);
}
function personalizedStory(card,index){
  const custom=PERSONALIZED_CARD_STORIES[card.id]?.[index];
  return personalizedText(custom||`${card.story} ${CARD_STORY_EXTENSIONS[card.id]||""}`,index,card.round);
}
function personalizedOptionDetail(card,index,optionIndex,option){
  return personalizedText(PERSONALIZED_OPTION_DETAILS[card.id]?.[index]?.[optionIndex]||OPTION_DETAILS[card.id]?.[optionIndex]||option.label,index,card.round);
}
function drawCard(){
  if(game.phase!=="playing"||isAnimating||game.currentCardId)return;
  const team=game.teams[game.activeTeam];if(team.pendingAdjustment.length){showAdjustment(game.activeTeam);return;}
  const deck=game.weeklyDecks[game.round];if(!deck?.length)return;
  pushUndo(`${team.name}抽取第${game.round}周事件`);const id=deck.shift();game.currentCardId=id;game.drawnCardIds.push(id);isAnimating=true;saveGame();render();ui.drawButton.disabled=true;ui.eventCard.classList.add("drawing");
  const reduced=game.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches;setTimeout(()=>{ui.eventCard.classList.add("revealed",cardById(id).type);playTone(600,.07);},reduced?0:220);
  setTimeout(()=>{isAnimating=false;render();showCurrentCardModal();},reduced?10:850);
}
function mitigationHtml(effects){
  const team=game.teams[game.activeTeam],pair=pairForStudent(game.activeTeam),partner=game.teams[partnerIndex(game.activeTeam)];
  const actorEffects={},partnerEffects={};[effects.all||{},effects.self||{}].forEach(values=>Object.entries(values).forEach(([key,value])=>{actorEffects[key]=(actorEffects[key]||0)+value;}));[effects.all||{},effects.partner||{}].forEach(values=>Object.entries(values).forEach(([key,value])=>{partnerEffects[key]=(partnerEffects[key]||0)+value;}));
  const selfEntries=Object.entries(actorEffects).filter(([,value])=>value<0),partnerEntries=Object.entries(partnerEffects).filter(([,value])=>value<0);
  if(!selfEntries.length&&!partnerEntries.length)return "";
  const energyOptions=selfEntries.map(([key])=>`<option value="actor:${key}">${RESOURCE_INFO[key].name}</option>`).join("");
  const assistChoices=selfEntries.map(([key,value])=>({value:`actor:${key}`,name:team.name,supporter:partner.name,key,loss:value,canPay:partner.resources[key]+(partnerEffects[key]||0)>=1})).concat(partnerEntries.map(([key,value])=>({value:`partner:${key}`,name:partner.name,supporter:team.name,key,loss:value,canPay:team.resources[key]+(actorEffects[key]||0)>=1}))).filter(choice=>choice.canPay);
  const energy=Boolean(energyOptions)&&team.resources.energy>0&&!team.energyUsedRounds.includes(game.round),assist=assistChoices.length&&game.bonds[pair.id]>=2&&!game.pairAssistUsed[pair.id];if(!energy&&!assist)return "";
  const assistHtml=assist?`<div class="assist-decision"><span>由受损学生本人决定，支援者承担同类资源</span><label><input type="radio" name="pairAssist" value="" checked><i><strong>保留搭档支援</strong><small>本次按原资源结果执行</small></i></label>${assistChoices.map(choice=>`<label><input type="radio" name="pairAssist" value="${choice.value}"><i><strong>${choice.name}接受支援</strong><small>${choice.name}${RESOURCE_INFO[choice.key].name} ${choice.loss} → ${Math.min(0,choice.loss+1)}；${choice.supporter}${RESOURCE_INFO[choice.key].name}-1</small></i></label>`).join("")}</div>`:"";
  return `<div class="assist-box"><strong>可选的损失保护</strong>${energy?`<label class="energy-protect"><input type="checkbox" id="useEnergy"><span>使用1枚能量币，抵消1点 <select id="energyKey">${energyOptions}</select></span></label>`:""}${assistHtml}</div>`;
}
function optionsForCard(card){return card.options||CARD_ACTION_OPTIONS[card.id]||[];}
function showCurrentCardModal(){
  const card=cardById(game.currentCardId);if(!card)return;const index=game.activeTeam,type=CARD_TYPES[card.type],story=personalizedStory(card,index),options=optionsForCard(card);const scopeNote=card.scope==="pair"?`同时影响 ${game.teams[index].name} 与 ${game.teams[partnerIndex(index)].name}`:card.scope==="class"?"由全班讨论或投票，结果影响六位学生":"根据当前学生的背景处理";
  const body=`<div class="scope-note"><span class="tag ${card.type}">${type.symbol} ${type.name}</span><span class="tag">${SCOPE_NAMES[card.scope]}卡</span><span class="tag">${escapeHtml(scopeNote)}</span></div><p class="card-story">${escapeHtml(story)}</p><div class="task-box"><strong>本次关注</strong><br>${escapeHtml(personalizedText(card.task,index,card.round))}</div><div class="option-heading"><strong>选择一个执行方案</strong><span>先看具体行动，再比较资源代价</span></div><div class="choice-grid">${options.map((option,i)=>`<button class="choice-option" data-option="${i}"><strong>${String.fromCharCode(65+i)} · ${escapeHtml(option.label)}</strong><p>${escapeHtml(personalizedOptionDetail(card,index,i,option))}</p>${effectChipsHtml(option.effects)}</button>`).join("")}</div>${card.scope==="class"?`<label class="field-label">30秒讨论或投票记录<textarea class="strategy-field compact-field" id="classNote" placeholder="记录多数选择，以及另一种意见怎样被照顾"></textarea></label>`:""}<p class="form-error" id="cardError"></p>`;
  openModal({kicker:`第${card.round}周 · ${SCOPE_NAMES[card.scope]}${type.name}卡`,title:card.title,body,actions:[],card:true,locked:true});
  ui.modalBody.querySelectorAll("[data-option]").forEach(btn=>btn.onclick=()=>{const note=byId("classNote")?.value.trim()||"";if(card.scope==="class"&&!note){byId("cardError").textContent="请先记录全班30秒讨论或投票结果。";return;}const option=options[Number(btn.dataset.option)];showActionConfirm(card,option,note);});
}
function showActionConfirm(card,option,note){
  const body=`<p class="selected-action"><span>准备执行</span><strong>${escapeHtml(option.label)}</strong></p><div class="effect-box effect-result"><strong>执行后</strong>${effectChipsHtml(option.effects)}</div>${mitigationHtml(option.effects)}<label class="field-label">用一句话说明理由<textarea class="strategy-field compact-field" id="choiceReason" placeholder="这项做法更适合当前人物，因为……"></textarea></label><p class="form-error" id="cardError"></p>`;
  openModal({kicker:`第${card.round}周 · 确认行动`,title:card.title,body,actions:[{label:"返回重选",secondary:true,onClick:showCurrentCardModal},{label:"执行这个方案",onClick:()=>{const reason=byId("choiceReason").value.trim();if(!reason){byId("cardError").textContent="请用一句话说明为什么选择这个方案。";return;}attemptResolve(card,option.effects,`${option.label}：${reason}${note?`；全班记录：${note}`:""}`);}}],card:true,locked:true});
}
function attemptResolve(card,effects,label){
  const noteField=byId("actionNote"),note=noteField?.value.trim()||"";if(noteField&&!note){const error=byId("cardError")||document.createElement("p");error.className="form-error";error.textContent="请先写下具体行动或全班讨论记录。";if(!error.parentNode)ui.modalBody.append(error);return;}
  const mitigation={energy:byId("useEnergy")?.checked?byId("energyKey")?.value:null,assist:document.querySelector('input[name="pairAssist"]:checked')?.value||null};resolveCard(card,effects,`${label}${note?`：${note}`:""}`,mitigation);
}
function applyResource(teamIndex,key,delta,changes){
  const team=game.teams[teamIndex],before=team.resources[key],after=clamp(before+delta,0,RESOURCE_INFO[key].max);team.resources[key]=after;const actual=after-before;if(actual)changes.push({teamIndex,key,delta:actual});
}
function resolveCard(card,effects,decisionText,mitigation={}){
  const actor=game.activeTeam,pair=pairForStudent(actor),partner=partnerIndex(actor),adjusted=clone(effects),changes=[];
  for(const [target,values] of Object.entries(adjusted)){
    if(target==="bond"){const before=game.bonds[pair.id];game.bonds[pair.id]=clamp(before+values,0,3);if(game.bonds[pair.id]!==before)changes.push({bond:pair.id,delta:game.bonds[pair.id]-before});continue;}
    const targets=target==="self"?[actor]:target==="partner"?[partner]:target==="all"?game.teams.map((_,i)=>i):[];
    targets.forEach(i=>Object.entries(values).forEach(([key,delta])=>applyResource(i,key,delta,changes)));
  }
  if(mitigation.energy){const [,key]=mitigation.energy.split(":");applyResource(actor,key,1,changes);applyResource(actor,"energy",-1,changes);game.teams[actor].energyUsedRounds.push(game.round);}
  let assistSummary="";
  if(mitigation.assist&&!game.pairAssistUsed[pair.id]){const [target,key]=mitigation.assist.split(":"),supportedIndex=target==="partner"?partner:actor,supporterIndex=supportedIndex===actor?partner:actor;applyResource(supportedIndex,key,1,changes);applyResource(supporterIndex,key,-1,changes);game.pairAssistUsed[pair.id]=true;assistSummary=`${game.teams[supportedIndex].name}接受${game.teams[supporterIndex].name}的搭档支援`;}
  const affected=[...new Set(changes.filter(c=>c.teamIndex!==undefined).map(c=>c.teamIndex).concat(actor))];
  affected.forEach(i=>{const zeros=CORE_RESOURCE_KEYS.filter(key=>game.teams[i].resources[key]===0&&!game.teams[i].pendingAdjustment.includes(key));game.teams[i].pendingAdjustment.push(...zeros);});
  const resourceTotals=new Map(),bondChanges=[];changes.forEach(change=>{if(change.bond){bondChanges.push(change);return;}const id=`${change.teamIndex}:${change.key}`;resourceTotals.set(id,(resourceTotals.get(id)||0)+change.delta);});
  const netChanges=[...resourceTotals].filter(([,delta])=>delta!==0).map(([id,delta])=>{const [teamIndex,key]=id.split(":");return `${game.teams[Number(teamIndex)].name}${RESOURCE_INFO[key].name}${delta>0?"+":""}${delta}`;});
  bondChanges.forEach(change=>netChanges.push(`${PAIRS.find(p=>p.id===change.bond).name}默契${change.delta>0?"+":""}${change.delta}`));
  if(assistSummary)netChanges.unshift(assistSummary);
  const changeText=netChanges.join("、")||"资源保持不变";
  const cleanDecisionText=decisionText.replace(/[。！？!?]+$/g,"");
  const summary=`${CARD_TYPES[card.type].name}《${card.title}》：${cleanDecisionText}。${changeText}`;
  const record={round:game.round,actor,cardId:card.id,title:card.title,type:card.type,scope:card.scope,summary,changes:clone(changes)};
  affected.forEach(i=>game.teams[i].history.push(record));game.lastEvent=summary;game.currentCardId=null;game.activeTeam+=1;
  if(game.activeTeam>=6){game.activeTeam=5;game.phase="echo";game.weeklyEchoes.push(buildWeeklyEcho(game.round));}
  closeModal(true);
  saveGame();render();playTone(460,.08);if(game.phase==="echo")setTimeout(showWeeklyEcho,80);
}
function buildWeeklyEcho(round){
  const records=game.drawnCardIds.filter(id=>cardById(id)?.round===round).map(id=>{const card=cardById(id);const record=game.teams.flatMap(t=>t.history).find(h=>h.round===round&&h.cardId===id);return {cardId:id,actor:record?.actor??0,title:card.title,type:card.type,scope:card.scope,summary:record?.summary||"已完成"};});
  return {round,records,bonds:clone(game.bonds),createdAt:Date.now()};
}
function showWeeklyEcho(){
  const echo=game.weeklyEchoes.find(e=>e.round===game.round);const rows=(echo?.records||[]).map(r=>`<div class="echo-row"><strong>${escapeHtml(game.teams[r.actor].name)}</strong><span>${CARD_TYPES[r.type].symbol} ${escapeHtml(r.title)}</span><span class="echo-changes">${SCOPE_NAMES[r.scope]}</span></div>`).join("");
  openModal({kicker:`第${game.round}周 · 班级回声`,title:"六张牌在班里留下了什么",wide:true,body:`<div class="echo-list">${rows}</div><p>这一周没有用“谁走得更快”排名。请从六条记录中指出一次有代价的选择，以及一次影响到同伴或全班的行动。三组搭档的默契变化可在右侧栏查看。</p>`,actions:[{label:"撤回本周最后一张",secondary:true,onClick:()=>{closeModal(true);undo();}},{label:game.round===6?"进入考前结算":"进入下一周",onClick:advanceWeek}],locked:true});
}
function advanceWeek(){
  closeModal(true);if(game.round>=6){game.phase="final";game.activeTeam=5;game.lastEvent="六周36张事件牌全部处理完成，所有学生同时进入考前结算。";saveGame();render();showFinal();return;}
  game.round+=1;game.activeTeam=0;game.phase="playing";
  if(game.round===6&&!game.roundSixRewardApplied){PAIRS.filter(p=>game.bonds[p.id]>=3).forEach(pair=>pair.members.forEach(i=>applyResource(i,"energy",1,[])));game.roundSixRewardApplied=true;game.lastEvent="默契达到3的搭档进入第六周时，各获得1枚能量币。";}
  saveGame();render();showWeekStory();
}
function showAdjustment(index){
  const team=game.teams[index],key=team.pendingAdjustment[0];if(!key){render();return;}
  openModal({kicker:"资源归零 · 调整任务",title:`${team.name}需要先调整${RESOURCE_INFO[key].name}`,body:`<p>资源归零不会跳过本周。请把调整写成可以执行的安排，完成后${RESOURCE_INFO[key].name}恢复到1点。</p><label class="field-label">删掉或缩减的任务<textarea class="text-field" id="adjustCut"></textarea></label><label class="field-label">准备向谁求助<input class="text-field" id="adjustHelp"></label><label class="field-label">具体执行时间<input class="text-field" id="adjustWhen" placeholder="例如：今晚九点前"></label><p class="form-error" id="adjustError"></p>`,actions:[{label:"完成调整",onClick:()=>{const cut=byId("adjustCut").value.trim(),help=byId("adjustHelp").value.trim(),when=byId("adjustWhen").value.trim();if(!cut||!help||!when){byId("adjustError").textContent="三项都要写清楚，不能只填“合理安排”。";return;}pushUndo(`${team.name}完成资源调整`);team.resources[key]=1;team.pendingAdjustment.shift();team.adjustments.push({round:game.round,key,cut,help,when});game.lastEvent=`${team.name}缩减“${cut}”，向${help}求助，并约定${when}执行，${RESOURCE_INFO[key].name}恢复1点。`;closeModal(true);saveGame();render();if(team.pendingAdjustment.length)setTimeout(()=>showAdjustment(index),50);}}],locked:true});
}
function portrait(team){const core=CORE_RESOURCE_KEYS.map(key=>[key,team.resources[key]]).sort((a,b)=>b[1]-a[1]);if(Math.max(...core.map(x=>x[1]))-Math.min(...core.map(x=>x[1]))<=2)return "平衡成长者";return {courage:"探索者",knowledge:"学习者",time:"规划者"}[core[0][0]];}
function showFinal(){
  const endings=game.teams.map((team,i)=>{const pair=pairForStudent(i),shared=game.bonds[pair.id]>=3?`与${game.teams[partnerIndex(i)].name}形成“${pair.theme}”共同结局。`:"这段关系仍保留下一次主动沟通的空间。";const adjustment=team.adjustments.at(-1);return `<article class="ending-card"><h3>${escapeHtml(team.name)}</h3><span class="portrait">${portrait(team)}</span><p>${adjustment?`曾在资源归零后缩减“${escapeHtml(adjustment.cut)}”，并向${escapeHtml(adjustment.help)}求助。`:"六周中没有资源归零，但仍需要从记录中选出一次主动调整。"}</p><p>${escapeHtml(shared)}</p></article>`;}).join("");
  const strategy=game.strategy?`<div class="strategy-summary"><strong>已完成成长策略单</strong><br>${escapeHtml(game.strategy.transfer)}</div>`:"";
  openModal({kicker:"六周结算",title:"每个人都带着自己的方法进入考场",wide:true,body:`${strategy}<div class="ending-grid">${endings}</div>`,actions:[{label:"查看36次行动记录",secondary:true,onClick:showJournal},{label:game.strategy?"修改成长策略单":"填写成长策略单",onClick:showStrategyForm}]});
}
function showStrategyForm(){const s=game.strategy||{};openModal({kicker:"结课记录",title:"成长策略单",wide:true,body:`<label class="field-label">我们最重要的一次选择是什么？<textarea class="strategy-field" id="sChoice">${escapeHtml(s.choice||"")}</textarea></label><label class="field-label">当时牺牲了什么资源？<textarea class="strategy-field" id="sCost">${escapeHtml(s.cost||"")}</textarea></label><label class="field-label">遇到的困难是什么？<textarea class="strategy-field" id="sChallenge">${escapeHtml(s.challenge||"")}</textarea></label><label class="field-label">我们后来怎样调整？<textarea class="strategy-field" id="sAdjustment">${escapeHtml(s.adjustment||"")}</textarea></label><label class="field-label">这个策略怎样用于真实学习或生活？<textarea class="strategy-field" id="sTransfer">${escapeHtml(s.transfer||"")}</textarea></label><p class="form-error" id="strategyError"></p>`,actions:[{label:"返回结局",secondary:true,onClick:showFinal},{label:"完成策略单",onClick:()=>{const strategy={choice:byId("sChoice").value.trim(),cost:byId("sCost").value.trim(),challenge:byId("sChallenge").value.trim(),adjustment:byId("sAdjustment").value.trim(),transfer:byId("sTransfer").value.trim()};if(Object.values(strategy).some(v=>!v)){byId("strategyError").textContent="请完成五项记录，尽量引用游戏中的具体事件。";return;}pushUndo("完成成长策略单");game.strategy=strategy;saveGame();showFinal();}}]});}
function showJournal(){const rows=game.drawnCardIds.map(id=>{const card=cardById(id),record=game.teams.flatMap(team=>team.history).find(item=>item.cardId===id);return {round:card.round,name:game.teams[record?.actor??0].name,...record,title:card.title,type:card.type};});openModal({kicker:"六周行动记录",title:`已处理 ${game.drawnCardIds.length} / 36 张牌`,wide:true,body:`<div class="echo-list">${rows.map(r=>`<div class="echo-row"><strong>第${r.round}周</strong><span>${escapeHtml(r.name)} · ${escapeHtml(r.title)}</span><span class="echo-changes">${CARD_TYPES[r.type].name}</span></div>`).join("")}</div>`,actions:[{label:"返回结局",onClick:showFinal}]});}
function showRules(){openModal({kicker:"课堂规则",title:"六周同班抽卡沙盘",body:`<ul class="rule-list"><li>每周六张牌，机遇、挑战、抉择各2张；个人、搭档、全班为3、2、1张。</li><li>每张事件提供两个可执行方案。小组选择一项，再用一句话说明理由。</li><li>六位学生依次各抽一张，共6周、36次行动。没有骰子、地图和提前结束。</li><li>能量币每轮最多使用1枚，只能抵消当前卡牌造成的1点损失。</li><li>默契达到2解锁一次搭档支援：受损学生少损失1点，支援者损失同类资源1点；达到3的搭档进入第6周时各获得1枚能量币。</li><li>资源归零不跳过行动，完成“删减任务、求助对象、执行时间”后恢复1点。</li><li>抽卡与处理结果是一个撤回步骤。撤回后同一张牌回到牌堆顶部。</li></ul>`,actions:[{label:"知道了",onClick:()=>closeModal(true)}]});}
function showStoryIndex(){openModal({kicker:"六周故事",title:"同一间教室里的六个星期",wide:true,body:`<div class="echo-list">${WEEK_STORIES.map((s,i)=>`<button class="choice-option" data-week="${i+1}"><strong>第${i+1}周 · ${escapeHtml(s.theme)}</strong><span>${escapeHtml(s.title)}：${escapeHtml(s.line)}</span></button>`).join("")}</div>`,actions:[{label:"关闭",onClick:()=>closeModal(true)}]});ui.modalBody.querySelectorAll("[data-week]").forEach(btn=>btn.onclick=()=>{const s=WEEK_STORIES[Number(btn.dataset.week)-1];openModal({kicker:s.stage,title:s.title,wide:true,body:`<div class="story-body">${s.body.map(p=>`<p>${escapeHtml(p)}</p>`).join("")}</div>`,actions:[{label:"返回六周目录",onClick:showStoryIndex}]});});}
function loadSlots(){try{return JSON.parse(localStorage.getItem(CARD_SAVES_KEY))||{};}catch{return {};}}
function slotSummary(slot){if(!slot?.state)return "空档位";const s=slot.state;return `${s.phase==="setup"?"准备阶段":s.phase==="final"?"已结算":`第${s.round}周 · 第${Math.min((s.activeTeam||0)+1,6)}位`} · ${s.drawnCardIds?.length||0}/36张`;}
function showSaves(message=""){
  const slots=loadSlots(),legacy=LEGACY_KEYS.some(key=>localStorage.getItem(key));const list=[1,2,3].map(n=>{const slot=slots[n];return `<div class="save-slot"><div><strong>存档 ${n}</strong><span>${slot?new Date(slot.savedAt).toLocaleString("zh-CN"):"空档位"}</span><small>${slotSummary(slot)}</small></div><div class="save-slot-actions"><button class="secondary-button" data-save="${n}">保存</button><button class="secondary-button" data-load="${n}" ${slot?"":"disabled"}>读取</button></div></div>`;}).join("");
  openModal({kicker:"存档与读档",title:"保留本周牌序和当前学生",body:`${message?`<div class="save-note">${escapeHtml(message)}</div>`:""}${legacy?`<p class="incompatible">检测到旧地图版存档：版本不兼容，已保留原数据，不会自动迁移或删除。</p>`:""}<div class="save-slots">${list}</div>`,actions:[{label:"关闭",onClick:()=>closeModal(true)}]});
  ui.modalBody.querySelectorAll("[data-save]").forEach(btn=>btn.onclick=()=>{const n=btn.dataset.save;const data=loadSlots();data[n]={schemaVersion:CARD_SCHEMA_VERSION,savedAt:new Date().toISOString(),state:captureState()};localStorage.setItem(CARD_SAVES_KEY,JSON.stringify(data));showSaves(`已保存到存档 ${n}。`);});
  ui.modalBody.querySelectorAll("[data-load]").forEach(btn=>btn.onclick=()=>{const n=btn.dataset.load,slot=loadSlots()[n];if(!slot||slot.schemaVersion!==CARD_SCHEMA_VERSION){showSaves("该存档不兼容当前抽卡版。");return;}game=normalizeCardState(clone(slot.state));game.undoStack=[];saveGame();closeModal(true);render();if(game.phase==="setup")showBriefing();else if(game.currentCardId)setTimeout(showCurrentCardModal,30);});
}
function confirmReset(){openModal({kicker:"重新开始",title:"重新开始六周故事？",body:"<p>当前新版自动进度会回到人物准备阶段，手动存档仍会保留。旧地图版存档也不会被删除。</p>",actions:[{label:"取消",secondary:true,onClick:()=>closeModal(true)},{label:"确认重新开始",onClick:()=>{game=createInitialState();saveGame();closeModal(true);render();showBriefing();}}]});}

ui.drawButton.onclick=()=>{if(game.phase==="setup")showBriefing();else if(game.phase==="echo")showWeeklyEcho();else if(game.phase==="final")showFinal();else if(game.teams[game.activeTeam].pendingAdjustment.length)showAdjustment(game.activeTeam);else drawCard();};
ui.profileButton.onclick=()=>showProfile(clamp(game.activeTeam,0,5));ui.storyRibbon.onclick=()=>{if(game.phase==="setup")showBriefing();else showWeekStory();};ui.storyButton.onclick=showStoryIndex;ui.helpButton.onclick=showRules;ui.saveButton.onclick=()=>showSaves();ui.undoButton.onclick=undo;ui.resetButton.onclick=confirmReset;
ui.soundButton.onclick=()=>{game.sound=!game.sound;saveGame();render();if(game.sound)playTone(540,.06);};ui.motionButton.onclick=()=>{game.reducedMotion=!game.reducedMotion;saveGame();render();};ui.modalClose.onclick=()=>closeModal();ui.modalBackdrop.onclick=e=>{if(e.target===ui.modalBackdrop)closeModal();};document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

render();
if(game.phase==="setup")setTimeout(showBriefing,80);else if(game.currentCardId)setTimeout(showCurrentCardModal,80);
