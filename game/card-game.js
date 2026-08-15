"use strict";

const CARD_SCHEMA_VERSION = 2;
const CARD_STORAGE_KEY = "class-card-sandbox-v2";
const CARD_SAVES_KEY = "class-card-sandbox-saves-v2";
const LEGACY_KEYS = ["growth-path-classroom-v1", "growth-path-classroom-saves-v1"];
const CARD_TYPES = {
  opportunity:{name:"机遇",symbol:"＊"}, challenge:{name:"挑战",symbol:"⚡"}, decision:{name:"抉择",symbol:"↗"}
};
const SCOPE_NAMES = {personal:"个人",pair:"搭档",class:"全班"};
const CONFLICT_NAMES = {family:"家庭矛盾",teacher:"师生矛盾",familyTeacher:"家庭与师生",class:"班级分歧"};
const PAIRS = [
  {id:"desk",members:[0,5],name:"同桌",theme:"计划与弹性"},
  {id:"physics",members:[1,3],name:"物理学习搭档",theme:"开口与融入"},
  {id:"classwork",members:[2,4],name:"班级任务搭档",theme:"行动与节奏"}
];
const WEEK_STORIES = [
  {theme:"新座位、真实作息和起点",stage:"第一周 · 周一早读前",title:"42天和一张新座位表",line:"倒计时开始时，班里还在处理一次普通的调座位。",body:[
    "周一早读，学习委员从办公室抱回一叠年级统一印发的冲刺安排表。表格从早上六点半排到晚上十点半，基础练习、错题整理和晚间打卡已经印好。班主任方老师让大家先别照抄，把通勤、训练、家务和晚饭这些确实不能使用的时间划出来。",
    "同一天，赵思齐因为刚转学被安排到第四组，原来的两组同桌也跟着调整。有人主动帮他认老师和功能教室，有人只是把桌面往自己这边挪了挪；被调开的朋友约好下课再说，却连续两个课间都没有找到合适的开头。",
    "午休前，几张计划表在同学之间传着看。有人发现别人每天多做一套卷子，又把刚划掉的任务写了回去。方老师没有评价谁写得最多，只要求放学前交一份下周确实能执行的版本。第一周的麻烦不是不会安排，而是承认每个人的生活本来就不一样。"
  ]},
  {theme:"周末承诺与家庭安排",stage:"第二周 · 星期五放学后",title:"周六只有一份时间表",line:"答疑、球赛、家庭安排和已经答应别人的事情撞在一起。",body:[
    "星期五最后一节课结束前，班级群连着出现三条通知：数学专题答疑改到周六上午，校篮球队的九年级告别赛提前开场，毕业照服装需要周一带来。陈子航把训练时间改了两遍，周雨桐想起自己早就答应陪弟弟参加学校活动。",
    "回到家后，新的安排又各不相同。林晓晨的妈妈临时换班，吴辰安的父母周六只有中午能一起吃饭，赵思齐家里还在处理搬家后没拆完的纸箱。大人并不是故意占用时间，学生也不能把已经答应的事情临时推给别人。",
    "班级群里有人问能不能把所有活动都取消，过了几分钟又把消息撤回。周末仍然只有一天，每保住一件事，都要有人重新安排另一件事。第二周不要求大家证明考试最重要，而是要把承诺、责任和真正可用的时间说清楚。"
  ]},
  {theme:"模拟考、群聊与误会",stage:"第三周 · 周三下午",title:"一张截图少了前半句",line:"成绩公布后，一段不完整的聊天记录改变了两个人的理解。",body:[
    "周三下午，答题卡从第一排传到后排。有人马上翻到排名，有人把卷子扣在桌面。晚饭后，班级群里出现一张年级排名截图，紧接着又有人转发了一小段私聊，看起来像是在议论赵思齐这次退步。",
    "原消息的前半句没有被截进去。周雨桐当时是在解释小组分工，赵思齐却只看到了后半段。他没有在群里追问，第二天早读也没有像往常一样把物理资料放到两人中间。转发截图的人很快撤回消息，但看过的人已经不止一个。",
    "方老师原本只想用成绩分析错因，现在还要决定排名应该公开到什么程度。学生则要处理另一件更难量化的事：是立即在群里解释、先私下把话说完整，还是等情绪过去。第三周的分歧同时发生在卷面和关系里。"
  ]},
  {theme:"毕业短片、求助与合作",stage:"第四周 · 星期二班会",title:"镜头拍了第五遍",line:"班级开始准备毕业短片，合作问题从练习册延伸到真实任务。",body:[
    "星期二班会，方老师把毕业短片交给全班自己完成，成片只要三分钟。有人负责采访，有人拍摄和剪辑，也有人整理旧照片。赵思齐看着照片名单停了一会儿，他转来不到一个学期，几乎没有出现在过去的班级活动里。",
    "何嘉宁担心成片太仓促，同一句开场连续拍了五遍；吴辰安找到几个新剪辑模板，文件越建越多。陈子航负责催进度，语气一急就替别人改了分工。原本是一次留下回忆的活动，很快也出现了赶时间、怕拖累和不好意思求助的问题。",
    "第三周没说完的误会仍在影响搭档，有人只在群里回复收到，有人开始尝试私下解释。第四周的合作不只是把任务交上去，还要决定谁有发言权、什么程度算完成，以及帮助别人时能不能留下对方亲自完成的部分。"
  ]},
  {theme:"暴雨、疲劳与计划调整",stage:"第五周 · 倒计时十天",title:"公交到站时间一直在变",line:"生活没有因为临近考试暂停，一场雨让原本勉强成立的安排失效。",body:[
    "周一下午开始下大雨，放学时公交软件上的到站时间一直往后跳。林晓晨在站台等了四十分钟，赵思齐父母都被堵在新城区，吴辰安回家后还要自己解决晚饭。毕业短片的最后一段也没有按原计划拍完。",
    "第二天早读，有人趴在桌上补觉，有人把昨天没完成的任务全部挪到今晚。家长开始担心手机、晚归和睡眠，方老师也发现最后十天的统一加量让几个人越来越慢。大人想减少风险，学生却容易把删任务理解成自己不够努力。",
    "第五周允许计划真的变短。无论是晚到的公交、没剪完的视频，还是做不完的练习，都必须从同一份时间里重新安排。资源归零不是淘汰，而是要求人物删减一件事、找一个具体的人求助，并说出什么时候执行。"
  ]},
  {theme:"考场准备、毕业照与告别",stage:"第六周 · 考前两天",title:"书包里还有借来的东西",line:"最后两天既要准备考试，也要处理一段初中生活留下的小事。",body:[
    "考点通知和毕业照安排在同一天发下来。方老师带大家核对准考证、文具、路线和午饭，摄影老师则要求第二天穿齐校服。有人回家试路线，有人发现校服袖口还没洗，也有人终于想起借来的计算器和书一直没有归还。",
    "毕业短片只来得及保留一个不太整齐的版本。赵思齐第一次出现在班级合照的中间，周雨桐和他的误会已经解释过，却还没有恢复到原来的说话方式。几张写了一半的便签夹在书里，有人准备交出去，也有人决定不在考前逼对方回应。",
    "最后两天不再增加宏大任务，只处理真正会影响入场和关系的事情：路线有没有备用、物品由谁补齐、借来的东西怎样归还、没说完的话是否需要现在开口。六个人带进考场的不只是知识，还有过去五周形成的安排和相处方式。"
  ]}
];

const PERSONAL_CONTEXT = [
  ["晚高峰让到家时间每天都不一样", "原同桌被调开后不知道怎样继续说话", "训练安排占着固定时段", "刚转来还认不全老师和教室", "总想把每项任务都做得没有差错", "新座位旁边正好靠近班级充电区"],
  ["妈妈换班后外婆的安排需要有人接手", "已经答应陪弟弟参加周末活动", "球队告别赛等着明确答复", "父母和自己都还在适应搬家后的生活", "家庭聚餐里总有人问起成绩", "父母轮班，一家人只有中午能一起吃饭"],
  ["群消息很多，却无法确认截图来自谁", "原本解释分工的话被截掉了前半句", "队友的玩笑和成绩比较混在一起", "刚融入班级就成了聊天里的主角", "很想立即证明截图中的判断不准确", "总能看到新消息，却分不清哪条需要回应"],
  ["通勤让拍摄时间总比别人少一段", "想解释误会，又怕在群里越说越乱", "催进度时容易直接替别人安排", "旧照片里很少出现自己的身影", "一句开场反复拍了五次仍不满意", "新模板越试越多，成片却迟迟没有导出"],
  ["公交晚点打乱了晚饭和到家时间", "照顾弟弟后仍不愿承认自己已经疲惫", "训练、拍摄和复习都想保留", "父母被堵在新城区，只能自己处理晚饭", "没完成的清单越抄越长", "手机既接收家里消息，也不断带来新任务"],
  ["需要为公交、入场和午饭留出余量", "有一张解释过却还没送出的便签", "要归还队服并和队友确认最后安排", "第一次站进班级毕业照的中间", "要接受毕业短片留下一个不完美版本", "书包里还有借来的计算器和没回完的消息"]
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
  "w1-d-personal":"早读结束后，{self}把自己的作息写在冲刺表背面：通勤、家务或训练占掉的时间一项也没有省略。直接照表能马上开始，提出替代方案则要主动解释限制，也要证明自己不是在逃避共同目标。",
  "w1-o-pair":"两个人用不同颜色圈出不能挪动和可以调整的时间，还发现彼此正好看见了对方忽略的部分。纸上的空格没有变多，但接下来遇到变化时，他们知道可以先问谁。",
  "w1-d-pair":"他们把约定写在便签上，又一起划掉一句太像命令的话。每天检查或按需开口都可能有用，前提是先分清什么是提醒，什么会让人感到被管着。",
  "w1-c-class":"贴纸越贴越密，原来只写三项的同学也拿起笔补到了第六项。几分钟里，教室里的焦虑像接力一样传开，连还没想好目标的人也开始担心自己落后。",

  "w2-c-personal":"餐桌上的周末表被来回改了两次。家人并非故意占用复习时间，{self}也不能把所有责任都推开；真正需要谈清的是哪件事必须由自己完成，哪件事可以由家里换人，以及学习任务具体延到什么时候。",
  "w2-d-personal":"窗外已经有人准备出门，桌上的专题卷也刚翻到第一页。{self}知道无论选哪一边，另一件事都需要重新安排，而不是留到周日晚上再匆忙补救。",
  "w2-c-pair":"{partner}低头看着那枚已经被勾上的选项，手指在桌边停了几秒。{self}这才意识到，替别人省时间和替别人作决定不是同一件事，好意也需要先经过询问。",
  "w2-d-pair":"资料上有几处两个人都想看的批注，他们先后翻到同一页，又各自看了一眼时间。怎么使用这份资料，也在考验他们能否说清自己的节奏并遵守约定。",
  "w2-o-class":"清单贴到后墙后，有人补上家里能提供打印，有人写下可以一起核对路线。那些原本分散在各个家庭里的支持被看见后，班级第一次有了可以共同调用的资源。",

  "w3-o-personal":"{self}拿起红笔，没有急着把正确答案抄满空白，而是在题号旁标出最可能的原因。一个模糊的坏结果被拆开后，终于出现了第二天可以验证的步骤。",
  "w3-c-personal":"放学后，走廊里的人声渐渐远了，{self}仍坐在原位反复看总分。卷面上其实留着不少线索，但自责把视线牢牢困在一个数字上，复盘迟迟没有开始。",
  "w3-d-personal":"讲台前已经排了两个人，答疑时间正在一分一分减少。{self}需要判断眼下缺的是一段安静整理的时间，还是一个能把思路推进下去的具体回答。",
  "w3-o-pair":"桌面上摊着两张分数不同的答题卡，却没有人先去看对方的总分。给出选择后，他们都松了一点力气，也更容易说清此刻究竟需要陪伴、方法还是暂时安静。",
  "w3-c-pair":"上课铃响后，两个人仍各自翻着卷子，原本准备一起看的题一页也没动。那句比较没有真正回答谁的问题，反而让双方都忙着证明自己并不是较差的那一个。",
  "w3-d-class":"投票纸从前排传到后排。支持公开的同学想知道自己与目标的距离，反对的同学担心走廊里的议论会跟着排名一起出现。班主任把决定交给全班，但要求多数方案必须给另一种需要留下保护办法。",

  "w4-o-personal":"对方顺着{self}指的位置看了一遍，只追问了两个条件，问题便缩小到一个步骤。{self}回到座位后重新做了一次，确认得到的不是现成答案，而是一条能继续走的路。",
  "w4-c-personal":"文件名安静地躺在聊天列表里，旁边的未读提示已经消失。{self}每次想到要打开就觉得又多了一项任务，直到晚饭后才发现，收到帮助和真正使用帮助之间还隔着一次安排。",
  "w4-d-personal":"{self}翻开自己的错题本，三处待复盘的标记还没有处理。答应老师意味着要从个人计划里让出时间；拒绝连续答疑也不能只说自己很忙，必须给出一种同学真正能使用的替代帮助。",
  "w4-c-pair":"任务完成得很快，{partner}却只能看着最终结果猜中间发生了什么。{self}也发现自己承担得越多，越没有时间确认对方是否真正参与，合作表面顺利却失去了来回。",
  "w4-d-pair":"两个人把最近几次互助写在纸上，发现有效的支援都很具体，也都没有替谁完成最后一步。要不要现在启用，需要他们共同确认触发条件，而不是临时凭感觉决定。",
  "w4-o-class":"下课后，文件盒前很快排起短队，但每个人只能拿走一页，也必须留下使用后的标记。共享开始有了秩序，资料的价值不再取决于页数，而在于是否真的帮助人解决问题。",

  "w5-o-personal":"{self}盯着被划去的那一行，起初仍有些不踏实，过了一会儿才把注意力移回正在做的题。计划变短以后，桌面没有那么拥挤，完成的标准也终于重新变得清楚。",
  "w5-c-personal":"手机被放到餐桌中央，家长等着{self}提出办法。完全交给家长管理能立刻减少干扰，却可能让{self}觉得失去决定权；短期试行保留了自主空间，也必须留下能让家人检查的记录。",
  "w5-d-personal":"新的清单有好几项看起来都可能有用，{self}却找不到一段完整时间把它们塞进去。越接近考试，新增内容带来的安心越短，真正的代价往往要到第二天疲惫时才出现。",
  "w5-o-pair":"被提醒的人先有些不服气，低头重看刚才的题，才发现条件确实漏了两遍。随后两个人交换计划表，各自删掉一项，提醒不再只是一个人对另一个人的单向照顾。",
  "w5-d-pair":"视频邀请停在屏幕上，两个人都没有立刻按下接听。守住约定很重要，但把疲惫伪装成陪伴也没有意义；无论继续还是取消，都要给下一步留下准确时间。",
  "w5-c-class":"有人笑着报出凌晨睡觉的时间，教室里立刻响起几声惊叹，也有人悄悄合上原本的休息计划。口号制造了短暂的冲劲，却正在把疲惫包装成值得比较的成绩。",

  "w6-o-personal":"走到考点门口时，{self}特意停下看了公交站、校门和入场通道的位置，还记下备用入口。回程路上，担心没有完全消失，但已经能被拆成几项可以提前处理的小事。",
  "w6-c-personal":"下载进度刚走到一半，{self}看了一眼已经整理好的书包和床头闹钟。此刻最难的不是判断资料有没有用，而是承认最后一晚已经不适合再开启一套新的复习路线。",
  "w6-d-personal":"桌上摆着近三次成绩、两所学校的通勤时间和招生资料。家长与老师说完理由后都停下来等{self}回答。选择任何方向都不能只靠一句喜欢或稳妥，还要写出风险、备选和下一步准备。",
  "w6-o-pair":"消息发出后，两边都没有继续追问分数、进度或遗漏的知识点。短短一句确认让人知道对方在，也让这一晚仍然属于各自的休息和准备。",
  "w6-c-pair":"{partner}的手指越握越紧，{self}说到一半终于注意到这个变化。临考前的信息越多不一定越有帮助，他们需要把提醒缩到对方真正愿意接住的一件事。",
  "w6-d-class":"最后几张投票纸交上来时，教室里比平时安静。无论多数人选中哪一项，另一项需求都不会消失；全班需要给它安排一个短而明确的补充位置。"
};

const CARD_ACTION_OPTIONS = {
  "w1-o-personal":[
    {label:"现在回应，并说出一个真实日常",effects:{self:{courage:1,time:1}}},
    {label:"先记住名字，午休再问一件小事",effects:{self:{knowledge:1,time:1}}}
  ],
  "w1-c-personal":[
    {label:"先报平安，再取消今晚一项任务",effects:{self:{time:-1,courage:1}}},
    {label:"完成值日安排，把两项任务移到明天",effects:{self:{time:-2,knowledge:1}}}
  ],
  "w1-o-pair":[
    {label:"陪他认路，也介绍一处午休地点",effects:{self:{courage:1},partner:{courage:1},bond:1}},
    {label:"画一张小地图，标出三个常用地点",effects:{self:{time:1},partner:{time:1}}}
  ],
  "w1-c-class":[
    {label:"停止转发照片，只整理可参考的方法",effects:{all:{courage:1,time:-1}}},
    {label:"继续分享，但遮住姓名和学习时长",effects:{all:{knowledge:1,time:-2}}}
  ],

  "w2-o-personal":[
    {label:"请家人帮忙守住一段安静时间",effects:{self:{time:2}}},
    {label:"共同调整一项家庭安排",effects:{self:{time:1,courage:1}}}
  ],
  "w2-c-personal":[
    {label:"履行先前承诺，把新增安排缩短",effects:{self:{time:-1,courage:1}}},
    {label:"请家人接手一项，并完成当面交接",effects:{self:{time:1,courage:1}}}
  ],
  "w2-c-pair":[
    {label:"向看过消息的人更正原来的猜测",effects:{self:{courage:-1},partner:{courage:1},bond:1}},
    {label:"先私下说明，约好周一一起澄清",effects:{self:{time:-1},partner:{time:-1}}}
  ],
  "w2-o-class":[
    {label:"只登记不能临时取消的承诺时段",effects:{all:{time:1,courage:1}}},
    {label:"匿名统计冲突时段，由老师调整一次",effects:{all:{knowledge:1,time:1}}}
  ],

  "w3-o-personal":[
    {label:"先收完器材，回教室再查完整消息",effects:{self:{time:1,courage:1}}},
    {label:"利用这十分钟问清截图从哪里来",effects:{self:{knowledge:1,courage:1}}}
  ],
  "w3-c-personal":[
    {label:"只联系最先转发的人，确认原始来源",effects:{self:{time:-1,knowledge:1}}},
    {label:"关掉群聊，明早请老师协助澄清",effects:{self:{courage:-1,time:1}}}
  ],
  "w3-o-pair":[
    {label:"一起按时间顺序读完完整记录",effects:{self:{courage:1},partner:{courage:1},bond:1}},
    {label:"各自复述误会来自哪一句话",effects:{self:{knowledge:1},partner:{knowledge:1},bond:1}}
  ],
  "w3-c-pair":[
    {label:"停止追问，约定放学后再听答复",effects:{self:{time:-1},partner:{courage:1},bond:1}},
    {label:"先各自冷静，第二天午休再谈",effects:{self:{time:1,courage:-1},partner:{time:1,courage:-1}}}
  ],

  "w4-o-personal":[
    {label:"认领采访提纲，今晚交出五个问题",effects:{self:{courage:1,knowledge:1}}},
    {label:"认领场记，负责文件名和拍摄顺序",effects:{self:{courage:1,time:1}}}
  ],
  "w4-c-personal":[
    {label:"删掉新模板，先导出能播放的初版",effects:{self:{knowledge:1,time:-1}}},
    {label:"整理文件后交接，请同学完成导出",effects:{self:{courage:-1,time:1}}}
  ],
  "w4-c-pair":[
    {label:"恢复原视频，征得同意后再修改",effects:{self:{time:-1},partner:{courage:1},bond:1}},
    {label:"保留新版，但把最终选择交给搭档",effects:{self:{time:-2},partner:{knowledge:1}}}
  ],
  "w4-o-class":[
    {label:"每人推荐一张普通但真实的旧照片",effects:{all:{courage:1}}},
    {label:"为缺少旧照片的人补拍生活镜头",effects:{all:{knowledge:1,time:-1}}}
  ],

  "w5-o-personal":[
    {label:"按家里给出的路线走，并定时报位置",effects:{self:{time:2,courage:1}}},
    {label:"联系备用接送人，再从最近车站出发",effects:{self:{time:1,knowledge:1}}}
  ],
  "w5-c-personal":[
    {label:"现在停止，收拾书桌并按时睡觉",effects:{self:{time:-1,courage:1}}},
    {label:"改做十分钟轻量复盘，再立刻结束",effects:{self:{time:-2,knowledge:1}}}
  ],
  "w5-o-pair":[
    {label:"一起等到接送信息确认，再分别回家",effects:{self:{courage:1},partner:{courage:1},bond:1}},
    {label:"查好备用路线，约定十分钟后离开",effects:{self:{time:1},partner:{time:1}}}
  ],
  "w5-c-class":[
    {label:"不统一留校，逐一登记真正需要",effects:{all:{courage:1,time:-1}}},
    {label:"保留留校，但允许通勤困难者退出",effects:{all:{knowledge:1,time:-2}}}
  ],

  "w6-o-personal":[
    {label:"按真实时间再走一遍考点路线",effects:{self:{time:2,courage:1}}},
    {label:"整理物品、入口和备用方案清单",effects:{self:{knowledge:1,time:1}}}
  ],
  "w6-c-personal":[
    {label:"当面归还，并请对方确认收到",effects:{self:{courage:1,time:-1}}},
    {label:"交给老师保管，再发消息说明",effects:{self:{knowledge:1,time:-1}}}
  ],
  "w6-o-pair":[
    {label:"归还物品，并夹一张不催回复的便签",effects:{self:{courage:1},partner:{courage:1},bond:1}},
    {label:"先归还物品，约好考后再继续谈",effects:{self:{time:1},partner:{time:1},bond:1}}
  ],
  "w6-c-pair":[
    {label:"收回追问，让对方考后再回答",effects:{self:{courage:1},partner:{courage:1},bond:1}},
    {label:"结束谈话，各自整理入场材料",effects:{self:{courage:-1,time:1},partner:{time:1}}}
  ]
};

const OPTION_DETAILS = {
  "w1-o-personal":["告诉对方自己每天坐哪班公交或放学后要做什么，再问一句对方的名字，给下次谈话留下具体开头。","先把对方名字记在课表边，午休时再问饮水机或作业本怎么轮值，用一件小事把招呼接下去。"],
  "w1-c-personal":["在站台先给家人报平安，把今晚最低优先级的一项划掉，并写明十点前停止。","完成值日带来的现实后果，把两项任务分别移到周三午休和晚饭后，不用熬夜补齐。"],
  "w1-d-personal":["把统一表贴进计划本，连续执行到下周一；每天只记录实际完成量和冲突时段，周一带数据再和老师谈调整。","今天放学前交一张替代表：保留每天基础练习和一次错题复盘，同时写明通勤、家务或训练占用的具体时段。"],
  "w1-o-pair":["陪赵思齐走到实验楼和体育馆，再告诉他午休可以去图书角；途中两人也各说一件放学后的日常。","在便签上画出教室、办公室和实验楼，标出三个地点和一位可以询问的人，放到赵思齐桌上。"],
  "w1-d-pair":["每天放学前在走廊碰面两分钟，只确认第二天是否需要提醒，不把新同桌拉进旧约定。","不再固定检查；需要帮助的人主动发一条具体消息，对方当天没空可以直接说明。"],
  "w1-c-class":["请最初转发的人撤回照片，全班只整理三种可借鉴的方法，不再展示谁做得最多。","允许自愿分享，但必须遮住姓名、起床时间和学习时长，讨论只针对计划是否能执行。"],

  "w2-o-personal":["和家人约定周六上午九点到十点不安排家务或外出，结束后主动报告完成情况。","从接送、做饭或陪伴家人中选一项重新分工，并把新的开始与结束时间写进家庭群。"],
  "w2-c-personal":["保留最早答应的接送、比赛或聚会，把后来增加的安排缩短一小时，并立即通知另一方新的到达时间。","请家人接手一项固定责任，{self}仍完成另一项；当面说清负责人、开始时间和需要交接的物品。"],
  "w2-d-personal":["参加原先答应的比赛、社团或家庭活动，提前领取答疑材料，并约定周一向同学补问一处难点。","当天退出原活动，先把队服、名单或家庭任务交接给具体的人，再按时参加学校答疑。"],
  "w2-c-pair":["{self}在原群里说明此前只是猜测，并补上{partner}手机不在身边的事实；不替对方解释家庭细节。","两人先私下核对经过，约好周一早读一起向受影响的同学说明，不在周末继续扩大讨论。"],
  "w2-d-pair":["两人约在周一早读前一起找方老师，由{partner}说明家庭冲突，{self}只补充临时活动的时间。","{self}当天先向老师报备缺席，不代说家庭原因；{partner}周一自己补充，并确认之后怎样补上任务。"],
  "w2-o-class":["只写训练、接送、家庭聚会等已经答应且不能临时取消的时段，不登记家长职业、成绩或家庭困难。","不写姓名，只统计周六上午、下午和晚上各有多少冲突；老师据人数调整一次答疑时间。"],

  "w3-o-personal":["把器材送回仓库后再回教室查看完整记录，先确认受影响的人，不在操场上边猜边转述。","利用这十分钟只问最初看到截图的人消息来自哪里，不讨论谁考得好，也不急着公开回应。"],
  "w3-c-personal":["只联系最先转发的人索要原图和时间，不逐条回复评论；晚上九点后停止查看群消息。","保存现有截图后关掉群聊，第二天早读把材料交给方老师，请老师协助确认传播范围。"],
  "w3-d-personal":["先私下把完整上下文发给直接受影响的人，听完对方理解后，再共同决定是否需要在群里澄清。","在班级群发完整记录，只说明被截掉的事实，不公开额外私聊；发完后停止争论。"],
  "w3-o-pair":["两人从最早一条消息开始按时间读完记录，分别标出原话、转述和猜测，先把事实放回原位。","两人各用一分钟复述自己当时误解了哪句话，对方只纠正事实，不要求立刻恢复原来的关系。"],
  "w3-c-pair":["{self}停止追问，把问题改成放学后愿不愿意再谈；{partner}可以选择回答、改期或暂时不谈。","两人先分开整理情绪，约在第二天午休谈十分钟；期间不让第三位同学替任何一方传话。"],
  "w3-d-class":["只公开名次变化，不公布具体分数；允许学生选择匿名编号，并约定排名信息不拍照、不转发，三天后收集一次班级感受。","老师只公布不会、看漏和超时三类错因比例；全班按主要错因分组，每组整理一条第二天可以执行的复盘动作。"],

  "w4-o-personal":["认领采访提纲，今晚先写五个不涉及成绩和家庭隐私的问题，第二天请两位同学试答。","认领场记，统一视频文件名并排好拍摄顺序；不负责表演，也不替剪辑者决定取舍。"],
  "w4-c-personal":["关掉新模板，只按班会确定的结构剪出能从头播放的初版，九点半前导出并发到群里。","先把文件按人物和场景整理好，写一张交接清单，请有空的同学导出；{self}负责第二天核对。"],
  "w4-d-personal":["接下三天协调，但只在午休和放学前各检查一次；不替任何人重拍，也不承担所有修改。","向老师说明完整协调会影响现有安排，只认领旧照片排序或采访提纲，并给出明确交付时间。"],
  "w4-c-pair":["把移走的原视频恢复到共享文件夹，向{partner}说明改动理由；只有对方同意后才使用新版。","两版都保留，由{partner}在午休前做最终选择；{self}只负责说明时间和画面差异。"],
  "w4-d-pair":["保留当前镜头，在停顿处补一行字幕；两人今天不再占用其他安排重新拍摄。","只重拍一次，开拍前说清修改点；无论结果如何都使用这一版，不继续追求完全整齐。"],
  "w4-o-class":["每人推荐一张普通但能说明班级生活的照片，例如值日、运动会候场或午休，不按获奖多少筛选。","请旧照片较少的同学各选一个熟悉地点补拍十秒，镜头内容和是否露脸由本人决定。"],

  "w5-o-personal":["按家里发来的接送地点和时间行动，每到一个换乘点只报一次位置，不在雨里反复改变路线。","先联系备用接送人确认能否到达，再走到最近的有遮雨棚车站；联系不上就返回学校门卫室。"],
  "w5-c-personal":["由家长保管手机两周，每天只在晚饭后查看二十分钟；同时写清归还日期和可以提前取用的紧急情况。","先试行三天：学习时手机放在客厅，晚九点统一查看消息；每天记录被打断次数，第三天晚上和家长根据记录重谈。"],
  "w5-d-personal":["把短片缺失部分压缩成三十秒最小版本，同时删掉今晚一项重复练习，九点半前结束。","退出剩余制作，把素材、文件名和未完成处一次交给接手同学；今晚按原计划休息。"],
  "w5-o-pair":["两人在站台等到接送人确认位置后再分别回家，超过十分钟就一起回门卫室，不擅自去找车辆。","帮对方查好一条备用公交路线并截图，十分钟后按约离开；到家后各自发一条确认消息。"],
  "w5-d-pair":["通话只处理短片文件和一道必须说明的问题，二十分钟到点立即结束，不再临时增加任务。","今晚取消；现在把文件位置和未完成处发清楚，并约在明天午休用十分钟确认交接。"],
  "w5-c-class":["取消统一留校，由需要补交或确实需要答疑的人登记二十分钟时段，其他人按原通勤安排离校。","保留四十分钟留校，但公交换乘、家庭接送或照顾责任受影响的人可以说明后退出，不公开理由。"],

  "w6-o-personal":["按考试当天的出门时间走一遍路线，同时记下堵车时换乘的站点和最晚出发时间。","逐项检查准考证、文具、入口和闹钟，缺一项就当场补齐，不再增加复习资料。"],
  "w6-c-personal":["第二天早读当面交还物品，请对方检查并说收到；若有损坏或缺件，当场说明，不把东西悄悄放下。","把物品装袋写好姓名，交给方老师或班长保管，再发一条说明；由接收人回复确认后才算完成。"],
  "w6-d-personal":["把更高目标列为第一志愿，同时写出可接受的备选学校、分数风险和最后两天仍要完成的准备，再向家长与老师确认。","按兴趣、通勤和家庭承受条件选择更匹配的方向，同时用近三次成绩说明依据，并保留一个分数相近的备选方案。"],
  "w6-o-pair":["把物品交还时夹一张两句话的便签：只说明自己的误解和歉意，不写请你马上回复。","先确认物品完整归还，再约定中考结束后找十分钟继续谈；今天不把关系是否恢复变成新任务。"],
  "w6-c-pair":["{self}收回刚才的追问，明确{partner}可以考后再回答；两人只核对物品是否已经归还。","现在停止谈话，各自回座位整理准考证和文具；不再请旁人代传答案或判断谁对谁错。"],
  "w6-d-class":["全班跟随投影逐项核对准考证、文具、路线和备用联系人；发现缺项的人当场写下补齐负责人。","用五分钟补拍一个不要求整齐口号的全班镜头；物品核对改由各搭档按清单完成并签字。"]
};

const CARDS = [
  {id:"w1-o-personal",round:1,type:"opportunity",scope:"personal",title:"新座位旁有人先打了招呼",story:"调座位后的第一个课间，{self}还在整理书本，旁边的同学主动说明饮水机、作业本和充电区分别由谁负责。面对{context}，这次简短介绍没有解决所有陌生感，却让下一次开口容易了一点。",effects:{self:{courage:1,time:1}},task:"决定怎样回应这次招呼，并留下一个下次可以继续的话题。"},
  {id:"w1-c-personal",round:1,type:"challenge",scope:"personal",title:"值日结束后公交已经开走",story:"周二放学，{self}临时留下擦黑板和倒垃圾，走到站台时常坐的那班车刚开走。家里还不知道会晚到，原计划中的晚饭和任务也要后移。{self}需要先处理现实安排，而不是假装今晚仍会按原表进行。",effects:{self:{time:-2}},task:"写清先联系谁、取消什么，以及今晚最晚什么时候停止。"},
  {id:"w1-d-personal",round:1,type:"decision",scope:"personal",conflictSource:"teacher",title:"老师的统一冲刺表要不要照做",story:"周二早读前，班主任把统一冲刺表放到{self}桌上：每天一套基础卷、两页错题和一次晚间打卡。老师希望全班按同一节奏推进，{self}却想到{context}，表上的时间并不一定真实可用。老师说可以讨论，但今天放学前必须给出答复。",options:[{label:"先按统一表执行一周",effects:{self:{knowledge:1,time:-1}},relations:[{source:"teacher",status:"pending",title:"统一冲刺表",note:"先执行统一表，个人限制尚未谈妥"}]},{label:"提交个人替代表",effects:{self:{courage:2,time:-1}},relations:[{source:"teacher",status:"managed",title:"个人计划已提交",note:"说明限制并保留共同学习目标"}]}],task:"说明哪一项现实限制需要老师知道，以及本周愿意承担的任务。"},
  {id:"w1-o-pair",round:1,type:"opportunity",scope:"pair",title:"一起带新同学走了一遍校园",story:"午休时，{self}和{partner}发现赵思齐还分不清实验楼和体育馆的方向。两个人陪他走了一圈，也顺便说起各自放学后的安排。原本只围绕任务的搭档关系，多了一段与考试无关的共同经历。",effects:{self:{courage:1},partner:{courage:1},bond:1},task:"两个人各补充一条新同学真正可能用到的信息。"},
  {id:"w1-d-pair",round:1,type:"decision",scope:"pair",title:"调座位后还要不要维持原约定",story:"座位调整后，{self}和{partner}不再每天坐在一起。继续固定检查计划可以保留原来的联系，却可能让新同桌觉得被排除；改成需要时再联系更自然，也可能让两个人渐渐不再开口。",options:[{label:"保留每天一次简短确认",effects:{self:{time:1},partner:{time:1},bond:1}},{label:"改成需要时主动联系",effects:{self:{courage:1},partner:{courage:1}}}],task:"定下一条不会影响新座位关系的联系边界。"},
  {id:"w1-c-class",round:1,type:"challenge",scope:"class",title:"计划表被拍进班级群",story:"周四晚上，有人把几张任务写得最满的计划表拍进班级群，原意是分享参考。消息下面很快出现学习到几点的比较，几位同学又给自己的表格加了内容。第二天班会，全班需要决定怎样保留参考而不制造新的压力。",effects:{all:{time:-1}},task:"全班讨论30秒：计划表可以分享什么，不应该比较什么？"},

  {id:"w2-o-personal",round:2,type:"opportunity",scope:"personal",title:"家里愿意重新排一次周六",story:"周五晚饭后，家人发现原定安排和复习撞在一起，决定把周六重新排一次。",effects:{self:{courage:1,time:1}},task:"选出谁调整哪一件事，并说明{self}仍要承担什么。"},
  {id:"w2-c-personal",round:2,type:"challenge",scope:"personal",conflictSource:"family",title:"已经答应的周末安排撞在一起",story:"周六上午，{self}发现学校临时活动、家庭安排和早就答应别人的事情占用了同一段时间。家人不想让{self}把所有责任推开，也担心临时取消会让别人措手不及；{self}则觉得每个人都在等自己先让步。",options:[{label:"履行原承诺，缩减另一项安排",effects:{self:{time:-2,courage:1}},relations:[{source:"family",status:"managed",title:"周末责任重新分配",note:"保留先前承诺，并明确删减的任务"}]},{label:"请求家人接手一项责任并完成交接",effects:{self:{time:1,courage:1}},relations:[{source:"family",status:"managed",title:"家人接手一项责任",note:"说清负责人、时段和复盘时间"}]}],task:"写清不能临时消失的承诺、谁接手什么，以及怎样通知受影响的人。"},
  {id:"w2-d-personal",round:2,type:"decision",scope:"personal",title:"告别活动和专题答疑撞在一起",story:"周六上午，{self}原本答应参加一场初中阶段最后一次的球队、社团或家庭活动，学校却临时增加专题答疑。参加原活动是在履行承诺，改去答疑也有现实价值；无论选哪边，都必须提前交接，而不是当天失联。",options:[{label:"参加原活动并提前领取材料",effects:{self:{courage:2,time:-1}}},{label:"退出活动，完成交接后参加答疑",effects:{self:{knowledge:2,courage:-1}}}],task:"说明怎样通知另一方，以及准备补回哪一部分。"},
  {id:"w2-c-pair",round:2,type:"challenge",scope:"pair",title:"一条没回复的消息变成了猜测",story:"周六下午，{self}给{partner}发消息确认约定，几个小时都没有收到回复。{self}在群里提到对方可能临时反悔，{partner}晚上才解释手机一直在家长手里。没有恶意的猜测已经被别人看到，两个人需要处理留下的影响。",effects:{self:{courage:-1},partner:{courage:-1},bond:-1},task:"先确认事实，再决定需要向哪些人更正原来的说法。"},
  {id:"w2-d-pair",round:2,type:"decision",scope:"pair",title:"要不要替搭档向老师解释缺席",story:"{partner}因为家庭安排不能参加临时活动，请{self}帮忙向老师说明。直接代为解释能减少当下压力，却可能遗漏对方真正的限制；陪对方一起开口更完整，也需要双方重新约时间。",options:[{label:"陪搭档一起向老师说明",effects:{self:{courage:1},partner:{courage:1},bond:1}},{label:"先代为报备，再由搭档补充",effects:{self:{time:-1},partner:{time:1}}}],task:"写清哪些内容可以代说，哪些必须由本人说明。"},
  {id:"w2-o-class",round:2,type:"opportunity",scope:"class",title:"班级做了一张周末承诺表",story:"班主任发现临时通知让不少家庭重新排时间，便让全班只登记已经答应且不能突然消失的事情，例如接送、训练、家庭聚餐和社团活动。老师据此调整一次答疑时间，也要求每个人说明自己仍会完成的部分。",effects:{all:{time:1}},task:"全班讨论30秒：哪些信息足够帮助协调，又不会变成隐私展示？"},

  {id:"w3-o-personal",round:3,type:"opportunity",scope:"personal",title:"体育课后有十分钟没人谈分数",story:"成绩公布后的体育课，{self}和几位同学留在操场边收器材。大家只说周末活动和毕业照，没有追问分数。面对{context}，这十分钟没有解决问题，却让{self}从群消息和排名里暂时退出来，重新决定下一步。",effects:{self:{courage:1,time:1}},task:"选择十分钟后最先处理的一件事，而不是同时回应所有消息。"},
  {id:"w3-c-personal",round:3,type:"challenge",scope:"personal",title:"排名截图还在不同群里转发",story:"晚上，{self}发现排名截图已经出现在两个群里，下面还夹着没有上下文的评论。继续逐条解释会消耗整晚，完全不看又可能让误会继续。{self}需要先确认来源和影响范围，再决定回应到什么程度。",effects:{self:{courage:-1,time:-1}},task:"写出需要回应的人、可以暂缓的消息和停止查看的时间。"},
  {id:"w3-d-personal",round:3,type:"decision",scope:"personal",title:"先解释截图还是先让自己冷静",story:"午休时，{self}已经找到完整聊天记录，也知道误会出在哪里。现在可以立即把前后文发到群里，也可以先私下联系被影响的人，等双方说清后再决定是否公开。前者更快，后者能保留对方选择回应方式的空间。",options:[{label:"先私下说明，再决定是否公开",effects:{self:{courage:1,time:1}}},{label:"立即在群里发完整上下文",effects:{self:{courage:2,time:-1}}}],task:"说明需要澄清的事实，以及不准备公开的私人内容。"},
  {id:"w3-o-pair",round:3,type:"opportunity",scope:"pair",title:"完整聊天记录被找了回来",story:"{self}和{partner}终于看到了截图前后的完整内容。两个人没有立刻讨论谁反应过度，而是先确认哪些话是原意、哪些判断来自截取。事实被补全后，关系有了重新开口的基础。",effects:{self:{courage:1},partner:{courage:1},bond:1},task:"各说一句自己当时怎样理解，以及现在需要怎样修正。"},
  {id:"w3-c-pair",round:3,type:"challenge",scope:"pair",title:"解释变成了要求对方马上原谅",story:"{self}把完整记录交给{partner}后，急着问关系是不是已经恢复。{partner}还没有整理好感受，沉默又被理解成拒绝。一次本来必要的解释，因为要求立即得到结果，再次让两个人都失去耐心。",effects:{self:{time:-1},partner:{courage:-1},bond:-1},task:"把要求回应改成一个允许对方稍后回答的说法。"},
  {id:"w3-d-class",round:3,type:"decision",scope:"class",conflictSource:"teacher",title:"排名要不要公开给全班",story:"模拟考成绩出来后，班主任提出两个办法：公开每个人的排名变化，让大家看清位置；或者只公布全班错因分布，按问题组成复盘小组。老师认为透明能帮助调整目标，几位学生担心排名会变成新的标签。两种方案都会影响接下来几周的班级气氛。",options:[{label:"公开排名和变化",effects:{all:{courage:-1,knowledge:1}},relations:[{source:"teacher",target:"all",status:"pending",title:"排名公开分歧",note:"班级获得位置信息，但公开边界仍未谈妥"}]},{label:"只公开错因分布",effects:{all:{knowledge:1,time:-1}},relations:[{source:"teacher",target:"all",status:"managed",title:"改用错因分组",note:"保留复盘信息，暂不公开个人排名"}]}],task:"全班讨论30秒并投票，再说出如何照顾没有被选中的意见。"},

  {id:"w4-o-personal",round:4,type:"opportunity",scope:"personal",title:"毕业短片里找到了合适的位置",story:"分工表贴出后，{self}没有被安排到最显眼的镜头，却发现自己可以负责采访提纲、旧照片排序或场记。面对{context}，这个位置不需要假装擅长所有事情，也能让成片真正少一个缺口。",effects:{self:{courage:1,knowledge:1}},task:"选一项能独立完成的具体工作，并说出交付标准。"},
  {id:"w4-c-personal",round:4,type:"challenge",scope:"personal",title:"答应剪辑却一直没有开始",story:"周四晚上，{self}已经收到所有视频，却因为文件名混乱、模板太多或担心做不好，一直停在新建项目页面。群里不断有人问进度，{self}每次都回复马上开始，真正可用的成片仍然是空白。",effects:{self:{time:-1,knowledge:-1}},task:"删掉一个额外要求，选出今晚必须完成的最小版本。"},
  {id:"w4-d-personal",round:4,type:"decision",scope:"personal",conflictSource:"teacher",title:"老师请你临时做总协调",story:"方老师发现毕业短片的分工反复变化，请{self}临时负责三天协调。老师认为{self}做事可靠，能让任务按时结束；{self}却想到{context}，自己的时间已经被原有安排切得很碎。可以接下工作，也可以提出更小的替代责任。",options:[{label:"接下协调，但只负责两次检查",effects:{self:{knowledge:1,time:-2}},relations:[{source:"teacher",status:"managed",title:"协调任务已限定",note:"约定检查次数，不承担所有修改"}]},{label:"只负责一项固定交付",effects:{self:{courage:1,time:1}},relations:[{source:"teacher",status:"managed",title:"改为固定交付",note:"说明时间限制，并承担明确的一项任务"}]}],task:"说明能负责什么、不能负责什么，以及什么时候交付。"},
  {id:"w4-c-pair",round:4,type:"challenge",scope:"pair",title:"好心重拍变成了替对方做主",story:"{self}觉得{partner}拍得不够自然，没等对方确认就重新录了一版，还把原视频从共享文件夹移走。成片看起来更整齐，{partner}却发现自己的表达已经被换掉。效率提高了，参与感和信任却一起减少。",effects:{self:{time:-1},partner:{courage:-1},bond:-1},task:"把决定权还给对方，并明确哪些修改需要双方确认。"},
  {id:"w4-d-pair",round:4,type:"decision",scope:"pair",title:"保留不完美镜头还是重新拍",story:"{self}和{partner}负责的镜头有一点停顿，声音也不完全整齐，但意思清楚。重新拍可能更好，也会占用两个人原定的其他时间；保留当前版本能按时完成，却要接受成片不是每一秒都完美。",options:[{label:"保留当前镜头并补一行字幕",effects:{self:{time:1},partner:{time:1},bond:1}},{label:"重拍一次并设定停止次数",effects:{self:{knowledge:1,time:-1},partner:{knowledge:1,time:-1}}}],task:"写下什么程度算可以使用，以及最多再拍几次。"},
  {id:"w4-o-class",round:4,type:"opportunity",scope:"class",title:"旧照片补上了缺席的人",story:"整理照片时，全班发现很多同学只出现在角落或根本没有入镜。大家决定不按活动多少选照片，而是每人推荐一张能说明班级生活的普通画面。赵思齐也补拍了一段介绍新教室的镜头。",effects:{all:{courage:1}},task:"全班讨论30秒：怎样让短片不只属于最活跃的几个人？"},

  {id:"w5-o-personal",round:5,type:"opportunity",scope:"personal",title:"家里发来一条明确的接送安排",story:"暴雨开始后，{self}没有只收到一句注意安全。家人把能接送的时间、不能到达的地点和备用联系人一次说清，{self}也回复了自己的放学位置。面对{context}，不确定没有消失，但不再需要反复猜测。",effects:{self:{time:2,courage:1}},task:"补充一个备用路线或无法联系家人时的处理办法。"},
  {id:"w5-c-personal",round:5,type:"challenge",scope:"personal",conflictSource:"family",title:"家长提出暂时收走手机",story:"晚上十点，{self}连续看错题目，手机却还在不断跳出班级通知和学习视频。家长认为问题不是不会，而是{self}没有办法停下来，提出考前暂时收走手机或停止训练。{self}知道自己确实被新消息带走，却不愿意把所有决定权交出去。",options:[{label:"接受两周限时管理",effects:{self:{time:2,courage:-1}},relations:[{source:"family",status:"managed",title:"家长暂时管理手机",note:"约定查看时段和归还条件，不把管理变成无限监督"}]},{label:"提出三天试行规则",effects:{self:{courage:1,time:1}},relations:[{source:"family",status:"pending",title:"手机规则仍待检验",note:"先试行专注时段与停止时间，三天后看完成记录"}]}],task:"写清手机或训练如何管理、谁来检查、何时根据记录重新协商。"},
  {id:"w5-d-personal",round:5,type:"decision",scope:"personal",title:"短片收尾和冲刺任务都没有完成",story:"雨天打乱了拍摄，{self}负责的毕业短片部分仍缺一段，桌上还有新的冲刺清单。今晚可以先把班级承诺做完，也可以退出剩余制作、保住睡眠和个人安排。两种选择都需要向受影响的人明确交代。",options:[{label:"完成最小版本并删掉一项练习",effects:{self:{knowledge:1,time:-2,courage:1}}},{label:"退出收尾并完成交接",effects:{self:{time:2,courage:-1}}}],task:"说明今晚停止时间，以及怎样让接手的人拿到完整材料。"},
  {id:"w5-o-pair",round:5,type:"opportunity",scope:"pair",title:"雨里多等了十分钟",story:"放学时，{self}的车一直没到，{partner}没有替对方决定路线，只在有遮雨棚的站台多等了十分钟。两个人确认家长和备用联系人都知道位置后，再分别回家。一次有限度的陪伴让帮助没有变成新的风险。",effects:{self:{courage:1},partner:{courage:1},bond:1},task:"写出陪伴到什么时间，以及超过时间后的下一步。"},
  {id:"w5-d-pair",round:5,type:"decision",scope:"pair",title:"今晚还要不要继续视频通话",story:"{self}和{partner}原定晚上视频处理短片和复习问题，但两个人都明显疲惫。继续二十分钟能完成必要交接，也可能让通话再次拖长；今晚取消能恢复体力，却必须把文件、问题和下一次时间现在就说明。",options:[{label:"只做二十分钟必要交接",effects:{self:{knowledge:1,time:-1},partner:{knowledge:1,time:-1},bond:1}},{label:"今晚取消并立即交接文件",effects:{self:{time:1},partner:{time:1}}}],task:"写出结束时间、文件位置或下一次开始时间。"},
  {id:"w5-c-class",round:5,type:"challenge",scope:"class",title:"晚到名单变成了统一留校建议",story:"暴雨后，几名同学连续晚到或作业未完成，年级提出放学后统一多留四十分钟。这个安排能集中处理任务，却会让通勤、接送和家庭责任再次失效。方老师请全班先列出实际影响，再决定是否采用统一办法。",effects:{all:{time:-1,courage:-1}},task:"全班讨论30秒：统一留校需要保留哪些例外和退出条件？"},

  {id:"w6-o-personal",round:6,type:"opportunity",scope:"personal",title:"考场流程提前走了一遍",story:"考前两天，{self}按真实时间走完起床、出门、安检和入座流程。面对{context}，原本模糊的担心变成几项可检查动作。书包没有增加更多资料，心里却多出一点确定。",effects:{self:{courage:2,time:1}},task:"说出流程里最容易遗漏的一步和备用方案。"},
  {id:"w6-c-personal",round:6,type:"challenge",scope:"personal",title:"借来的物品还没有归还",story:"整理考试书包时，{self}发现里面还有同学的计算器、一本写了名字的笔记或一件借来的校服。明天可能是考前最后一次见面，直接放到对方桌上最快，却可能来不及确认是否收到。",effects:{self:{time:-1,courage:-1}},task:"决定怎样归还、由谁确认，以及对方不在时交给谁。"},
  {id:"w6-d-personal",round:6,type:"decision",scope:"personal",conflictSource:"familyTeacher",title:"志愿方向出现分歧",story:"考前两天，家长希望{self}选择分数线更稳的学校，老师认为{self}可以冲一所更高目标的学校；{self}想到{context}，也有自己在意的兴趣、通勤和生活安排。三个人约好只谈一次：不替{self}决定，但要求把依据和备选方案写清楚。",options:[{label:"冲击更高目标，同时保留备选",effects:{self:{courage:2,time:-1}},relations:[{source:"family",status:"managed",title:"志愿冲刺方案已协商",note:"保留备选线，并把风险和准备动作写清楚"},{source:"teacher",status:"managed",title:"志愿依据已协商",note:"用成绩、兴趣和通勤共同说明选择"}]},{label:"选择更匹配生活的方向",effects:{self:{courage:1,time:1}},relations:[{source:"family",status:"managed",title:"志愿取舍已协商",note:"说明兴趣、通勤和家庭条件，不把稳妥等同于退缩"},{source:"teacher",status:"managed",title:"志愿依据已协商",note:"用现实条件和长期目标解释选择"}]}],task:"写出选择依据、一个备选方案，以及准备怎样向家长和老师说明。"},
  {id:"w6-o-pair",round:6,type:"opportunity",scope:"pair",title:"一张便签和归还的物品",story:"{self}把借来的东西交给{partner}时，里面夹着一张很短的便签，只写清之前哪件事让自己误会或为难，没有要求对方现在回答。{partner}确认收到后，也把一件一直没机会归还的小物品放回桌面。",effects:{self:{courage:1},partner:{courage:1},bond:1},task:"各写一句只说明自己、不要求对方立即回应的话。"},
  {id:"w6-c-pair",round:6,type:"challenge",scope:"pair",title:"解释之后又要求对方马上回应",story:"考前最后一个课间，{self}终于说出之前没有讲清的事情，却紧接着追问{partner}是不是已经不介意了。{partner}正在整理入场材料，没有办法立刻回答。道歉和解释是必要的，要求马上恢复关系却增加了新的压力。",effects:{self:{courage:-1},partner:{courage:-1},bond:-1},task:"把追问改成一句允许对方考后再回答的话。"},
  {id:"w6-d-class",round:6,type:"decision",scope:"class",title:"最后五分钟留给核对还是补拍",story:"最后一节班会只剩五分钟。考场物品还需要统一核对，毕业短片也缺一段全班镜头。前者减少明天的遗漏，后者可能是考试前最后一次全班站在一起。无论选哪项，另一项都必须有明确的补充安排。",options:[{label:"统一核对物品和路线",effects:{all:{time:1}}},{label:"补拍一段全班毕业镜头",effects:{all:{courage:1}}}],task:"全班讨论30秒并投票，再为另一项安排负责人和时间。"}
];

const RESOURCE_KEYS = ["courage","knowledge","time"];
const CORE_RESOURCE_KEYS = ["courage","knowledge","time"];
const RESOURCE_INFO = {courage:{name:"勇气",max:12},knowledge:{name:"知识",max:12},time:{name:"时间",max:12}};
const RELATION_INFO = {family:{name:"家庭沟通"},teacher:{name:"师生沟通"}};
const TEAM_COLORS_V2 = ["#205b47","#426b84","#a84a43","#6c5a7e","#8a6426","#53614b"];

function makeTeam(index){
  const p=STUDENT_PROFILES[index];
  return {id:index+1,profileId:p.id,name:p.name,color:TEAM_COLORS_V2[index],resources:{courage:5,knowledge:5,time:10},history:[],pendingAdjustment:[],adjustments:[],adultRelations:{family:{status:"clear",title:"暂无待沟通事项",note:""},teacher:{status:"clear",title:"暂无待沟通事项",note:""}},strategy:null};
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
  return {schemaVersion:CARD_SCHEMA_VERSION,phase:"setup",round:1,activeTeam:0,weeklyDecks:createDecks(),drawnCardIds:[],currentCardId:null,bonds:{desk:1,physics:1,classwork:1},pairAssistUsed:{desk:false,physics:false,classwork:false},weeklyEchoes:[],story:{prologueSeen:false,profilesSeen:[],chaptersSeen:[]},teams:Array.from({length:6},(_,i)=>makeTeam(i)),undoStack:[],lastEvent:"人物的选择、代价和同伴影响会记录在这里。",strategy:null};
}
function clone(value){return JSON.parse(JSON.stringify(value));}
function normalizeCardState(value){
  if(!value||value.schemaVersion!==CARD_SCHEMA_VERSION)return createInitialState();
  value.undoStack||=[]; value.weeklyDecks||=createDecks(); value.drawnCardIds||=[]; value.weeklyEchoes||=[];
  value.story||={prologueSeen:false,profilesSeen:[],chaptersSeen:[]}; value.story.profilesSeen||=[]; value.story.chaptersSeen||=[];
  value.bonds||={desk:1,physics:1,classwork:1}; value.pairAssistUsed||={desk:false,physics:false,classwork:false};
  value.teams||=Array.from({length:6},(_,i)=>makeTeam(i));delete value.roundSixRewardApplied;delete value.sound;delete value.reducedMotion;
  value.teams.forEach((team,i)=>{team.history||=[];team.pendingAdjustment||=[];team.adjustments||=[];team.resources||={courage:5,knowledge:5,time:10};delete team.resources.energy;delete team.energyUsedRounds;team.adultRelations||={family:{status:"clear",title:"暂无待沟通事项",note:""},teacher:{status:"clear",title:"暂无待沟通事项",note:""}};team.adultRelations.family||={status:"clear",title:"暂无待沟通事项",note:""};team.adultRelations.teacher||={status:"clear",title:"暂无待沟通事项",note:""};team.color||=TEAM_COLORS_V2[i];});
  return value;
}
function loadCardState(){try{return normalizeCardState(JSON.parse(localStorage.getItem(CARD_STORAGE_KEY)));}catch{return createInitialState();}}
let game=loadCardState();
let modalLocked=false;
let cardDrawAnimating=false;

const byId=id=>document.getElementById(id);
const ui={phaseLabel:byId("phaseLabel"),roundLabel:byId("roundLabel"),weekTheme:byId("weekTheme"),deckCount:byId("deckCount"),storyRibbon:byId("storyRibbon"),storyStage:byId("storyStage"),storyChapter:byId("storyChapter"),storyLine:byId("storyLine"),eventCard:byId("eventCard"),cardSymbol:byId("cardSymbol"),cardMeta:byId("cardMeta"),cardTitle:byId("cardTitle"),cardPreview:byId("cardPreview"),currentTurn:byId("currentTurn"),drawHint:byId("drawHint"),drawButton:byId("drawButton"),lastEventText:byId("lastEventText"),studentAvatar:byId("studentAvatar"),currentStudentName:byId("currentStudentName"),studentBackground:byId("studentBackground"),studentGoal:byId("studentGoal"),studentPressure:byId("studentPressure"),adultRelations:byId("adultRelations"),profileButton:byId("profileButton"),resourceGrid:byId("resourceGrid"),conditionChip:byId("conditionChip"),actionProgress:byId("actionProgress"),partnerFocus:byId("partnerFocus"),studentList:byId("studentList"),progressCopy:byId("progressCopy"),bondList:byId("bondList"),storyButton:byId("storyButton"),saveButton:byId("saveButton"),undoButton:byId("undoButton"),helpButton:byId("helpButton"),resetButton:byId("resetButton"),modalBackdrop:byId("modalBackdrop"),modal:byId("modal"),modalClose:byId("modalClose"),modalKicker:byId("modalKicker"),modalTitle:byId("modalTitle"),modalBody:byId("modalBody"),modalActions:byId("modalActions")};

function saveGame(){localStorage.setItem(CARD_STORAGE_KEY,JSON.stringify(game));}
function captureState(){const snapshot=clone(game);snapshot.undoStack=[];return snapshot;}
function pushUndo(label){game.undoStack.push({label,state:captureState()});}
function undo(){
  if(modalLocked||cardDrawAnimating||!game.undoStack.length)return;
  const stack=game.undoStack;const entry=stack.pop();game=normalizeCardState(entry.state);game.undoStack=stack;closeModal(true);saveGame();render();
  if(game.currentCardId)setTimeout(showCurrentCardModal,30);
}
function cardById(id){return CARDS.find(card=>card.id===id);}
function pairForStudent(index){return PAIRS.find(pair=>pair.members.includes(index));}
function partnerIndex(index){const pair=pairForStudent(index);return pair.members.find(i=>i!==index);}
function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
function escapeHtml(value=""){return String(value).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));}
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
  if(current){ui.eventCard.classList.add("revealed",current.type);if(cardDrawAnimating)ui.eventCard.classList.add("drawing");ui.cardSymbol.textContent=CARD_TYPES[current.type].symbol;ui.cardMeta.textContent=`${SCOPE_NAMES[current.scope]} · ${CARD_TYPES[current.type].name}`;ui.cardTitle.textContent=current.title;ui.cardPreview.textContent=current.task;}
  else{ui.cardSymbol.textContent="＊";ui.cardMeta.textContent="个人 · 机遇";ui.cardTitle.textContent="等待抽卡";ui.cardPreview.textContent="翻开这一周落到当前学生面前的事件。";}
  const remaining=(game.weeklyDecks[game.round]||[]).length;ui.deckCount.textContent=remaining;
  if(game.phase==="setup"){
    ui.currentTurn.textContent=`人物档案 ${game.story.profilesSeen.length} / 6`;ui.drawHint.textContent="先认识六位学生的家庭、优点、短板和目标，抽到的情景才会有意义。";ui.drawButton.textContent="查看人物档案";ui.drawButton.disabled=false;
  }else if(game.phase==="echo"){
    ui.currentTurn.textContent=`第 ${game.round} 周行动完成`;ui.drawHint.textContent="六张牌已经全部处理，查看资源与关系如何在这一周发生变化。";ui.drawButton.textContent="查看本周班级回声";ui.drawButton.disabled=false;
  }else if(game.phase==="final"){
    ui.currentTurn.textContent="六周行动全部完成";ui.drawHint.textContent="六位学生同时进入考前结算，从选择、调整和关系中生成各自的成长画像。";ui.drawButton.textContent="查看结局与成长策略单";ui.drawButton.disabled=false;
  }else{
    const team=game.teams[clamp(game.activeTeam,0,5)];ui.currentTurn.textContent=`第 ${game.round} 周 · ${team.name} 抽卡`;ui.drawHint.textContent=team.pendingAdjustment.length?"上次资源归零，请先完成调整任务，再抽取本周事件。":"牌堆已经洗好。每张牌只出现一次，撤回后仍会抽到同一张。";ui.drawButton.textContent=team.pendingAdjustment.length?"完成调整任务":"抽取本周事件";ui.drawButton.disabled=Boolean(game.currentCardId);
  }
}
function relationStatusLabel(relation){return relation.status==="pending"?"待沟通":relation.status==="managed"?"已协商":"暂无矛盾";}
function renderAdultRelations(team){
  return Object.entries(team.adultRelations||{}).map(([key,relation])=>`<div class="adult-relation ${relation.status}" title="${escapeHtml(relation.note||relation.title)}"><strong>${RELATION_INFO[key].name}</strong><span>${relationStatusLabel(relation)}</span>${relation.status!=="clear"?`<small>${escapeHtml(relation.title)}</small>`:""}</div>`).join("");
}
function renderStudent(){
  const index=clamp(game.activeTeam,0,5),team=game.teams[index],profile=STUDENT_PROFILES[index],pair=pairForStudent(index),partner=game.teams[partnerIndex(index)];
  ui.studentAvatar.textContent=profile.name[0];ui.studentAvatar.style.background=team.color;ui.currentStudentName.textContent=profile.name;ui.studentBackground.textContent=profile.background;ui.studentGoal.textContent=profile.goal;ui.studentPressure.textContent=profile.pressure;
  ui.adultRelations.innerHTML=renderAdultRelations(team);
  ui.resourceGrid.innerHTML="";RESOURCE_KEYS.forEach(key=>{const item=document.createElement("div"),value=team.resources[key],max=RESOURCE_INFO[key].max;item.className=`resource-item resource-${key}`;item.style.setProperty("--resource-percent",`${Math.round(value/max*100)}%`);item.innerHTML=`<span class="resource-icon" aria-hidden="true">${RESOURCE_INFO[key].name[0]}</span><div class="resource-copy"><span class="resource-name">${RESOURCE_INFO[key].name}</span><div class="resource-number"><strong class="resource-value">${value}</strong><span class="resource-max">/ ${max}</span></div></div>`;ui.resourceGrid.append(item);});
  ui.conditionChip.textContent=team.pendingAdjustment.length?"等待调整":"状态稳定";ui.conditionChip.classList.toggle("trouble",team.pendingAdjustment.length>0);ui.actionProgress.textContent=`本周第 ${Math.min(index+1,6)} / 6 位`;
  const bond=game.bonds[pair.id];ui.partnerFocus.innerHTML=`<span>${pair.name} · ${escapeHtml(pair.theme)}</span><strong>${escapeHtml(team.name)} × ${escapeHtml(partner.name)}</strong><div class="bond-dots">${[1,2,3].map(n=>`<i class="bond-dot ${bond>=n?"filled":""}"></i>`).join("")}</div>`;
}
function renderClass(){
  const done=game.round===6&&game.phase==="final"?6:game.activeTeam;ui.progressCopy.textContent=`本周 ${game.phase==="echo"||game.phase==="final"?6:done} / 6 人完成`;
  ui.studentList.innerHTML="";game.teams.forEach((team,index)=>{const button=document.createElement("button");button.className=`student-card ${index===game.activeTeam&&game.phase==="playing"?"active":""} ${index<game.activeTeam||game.phase==="echo"||game.phase==="final"?"done":""}`;button.innerHTML=`<div class="student-card-head"><span class="student-index" style="background:${team.color}">${index+1}</span><strong>${escapeHtml(team.name)}</strong></div><small>${escapeHtml(STUDENT_PROFILES[index].goal)}</small><div class="resource-mini"><span>勇 ${team.resources.courage}</span><span>知 ${team.resources.knowledge}</span><span>时 ${team.resources.time}</span></div>`;button.onclick=()=>showProfile(index);ui.studentList.append(button);});
}
function renderBonds(){
  ui.bondList.innerHTML=PAIRS.map(pair=>{const a=game.teams[pair.members[0]],b=game.teams[pair.members[1]],value=game.bonds[pair.id];let stateText=value>=3?"共同结局":value>=2?(game.pairAssistUsed[pair.id]?"支援已使用":"支援可用"):value===0?"需要沟通":"建立中";return `<article class="bond-card"><div class="bond-card-head"><div><strong>${escapeHtml(a.name)} × ${escapeHtml(b.name)}</strong><em>${pair.name} · ${escapeHtml(pair.theme)}</em></div><span class="bond-value">${value}/3</span></div><div class="bond-progress"><div class="bond-dots" aria-hidden="true">${[1,2,3].map(n=>`<i class="bond-dot ${value>=n?"filled":""}"></i>`).join("")}</div><span class="bond-state">${stateText}</span></div></article>`;}).join("");
}
function nextActionText(){
  if(game.phase==="setup"){
    const remaining=6-game.story.profilesSeen.length;
    return remaining>0?`继续查看人物档案，还剩${remaining}位学生未阅读。`:"六份档案已读完，点击开始第一周。";
  }
  if(game.phase==="echo")return game.round>=6?"查看第六周班级回声，然后进入考前结算。":`查看第${game.round}周班级回声，然后进入下一周。`;
  if(game.phase==="final")return game.strategy?"核对六组结局与能量币奖励，并将结果计入大活动。":"查看六组结局，并完成成长策略单。";
  const team=game.teams[clamp(game.activeTeam,0,5)];
  if(team.pendingAdjustment.length){const key=team.pendingAdjustment[0];return `先为${team.name}完成${RESOURCE_INFO[key].name}调整，再抽取本周事件牌。`;}
  if(game.currentCardId)return `为${team.name}选择一个具体行动方案；需要展开讨论时可口头说明理由。`;
  return `请${team.name}所在小组抽取第${game.round}周事件牌。`;
}
function render(){
  ui.phaseLabel.textContent=game.phase==="setup"?"人物准备":game.phase==="echo"?"班级回声":game.phase==="final"?"考前结算":"同班事件";ui.roundLabel.textContent=`第 ${game.round} / 6 周`;ui.lastEventText.textContent=nextActionText();
  ui.undoButton.disabled=modalLocked||cardDrawAnimating||!game.undoStack.length;ui.undoButton.title=game.undoStack.length?`撤回：${game.undoStack.at(-1).label}`:"暂无可撤回操作";ui.undoButton.setAttribute("aria-label",ui.undoButton.title);
  [ui.storyButton,ui.saveButton,ui.helpButton,ui.resetButton,ui.profileButton,ui.storyRibbon].forEach(control=>{control.disabled=cardDrawAnimating;});
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
function startGame(){if(game.story.profilesSeen.length!==6)return;pushUndo("开始六周故事");game.phase="playing";game.story.prologueSeen=true;game.lastEvent="六位学生的档案已读完。第一周牌堆已经洗好。";closeModal(true);saveGame();render();showWeekStory();}
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
  return personalizedText(custom||card.story,index,card.round);
}
function personalizedOptionDetail(card,index,optionIndex,option){
  return personalizedText(PERSONALIZED_OPTION_DETAILS[card.id]?.[index]?.[optionIndex]||OPTION_DETAILS[card.id]?.[optionIndex]||option.label,index,card.round);
}
function drawCard(){
  if(game.phase!=="playing"||game.currentCardId||cardDrawAnimating)return;
  const team=game.teams[game.activeTeam];if(team.pendingAdjustment.length){showAdjustment(game.activeTeam);return;}
  const deck=game.weeklyDecks[game.round];if(!deck?.length)return;
  pushUndo(`${team.name}抽取第${game.round}周事件`);const id=deck.shift();game.currentCardId=id;game.drawnCardIds.push(id);cardDrawAnimating=true;saveGame();render();
  const delay=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?0:760;
  setTimeout(()=>{cardDrawAnimating=false;render();showCurrentCardModal();},delay);
}
function mitigationHtml(effects){
  const team=game.teams[game.activeTeam],pair=pairForStudent(game.activeTeam),partner=game.teams[partnerIndex(game.activeTeam)];
  const actorEffects={},partnerEffects={};[effects.all||{},effects.self||{}].forEach(values=>Object.entries(values).forEach(([key,value])=>{actorEffects[key]=(actorEffects[key]||0)+value;}));[effects.all||{},effects.partner||{}].forEach(values=>Object.entries(values).forEach(([key,value])=>{partnerEffects[key]=(partnerEffects[key]||0)+value;}));
  const selfEntries=Object.entries(actorEffects).filter(([,value])=>value<0),partnerEntries=Object.entries(partnerEffects).filter(([,value])=>value<0);
  if(!selfEntries.length&&!partnerEntries.length)return "";
  const assistChoices=selfEntries.map(([key,value])=>({value:`actor:${key}`,name:team.name,supporter:partner.name,key,loss:value,canPay:partner.resources[key]+(partnerEffects[key]||0)>=1})).concat(partnerEntries.map(([key,value])=>({value:`partner:${key}`,name:partner.name,supporter:team.name,key,loss:value,canPay:team.resources[key]+(actorEffects[key]||0)>=1}))).filter(choice=>choice.canPay);
  const assist=assistChoices.length&&game.bonds[pair.id]>=2&&!game.pairAssistUsed[pair.id];if(!assist)return "";
  return `<div class="assist-box"><strong>可选的搭档支援</strong><div class="assist-decision"><span>由受损学生本人决定，支援者承担同类资源</span><label><input type="radio" name="pairAssist" value="" checked><i><strong>保留搭档支援</strong><small>本次按原资源结果执行</small></i></label>${assistChoices.map(choice=>`<label><input type="radio" name="pairAssist" value="${choice.value}"><i><strong>${choice.name}接受支援</strong><small>${choice.name}${RESOURCE_INFO[choice.key].name} ${choice.loss} → ${Math.min(0,choice.loss+1)}；${choice.supporter}${RESOURCE_INFO[choice.key].name}-1</small></i></label>`).join("")}</div></div>`;
}
function optionsForCard(card){return card.options||CARD_ACTION_OPTIONS[card.id]||[];}
function showCurrentCardModal(){
  const card=cardById(game.currentCardId);if(!card)return;const index=game.activeTeam,type=CARD_TYPES[card.type],story=personalizedStory(card,index),options=optionsForCard(card);const scopeNote=card.scope==="pair"?`同时影响 ${game.teams[index].name} 与 ${game.teams[partnerIndex(index)].name}`:card.scope==="class"?"由全班讨论或投票，结果影响六位学生":"根据当前学生的背景处理";
  const conflictTag=card.conflictSource?`<span class="tag conflict">${escapeHtml(CONFLICT_NAMES[card.conflictSource])}</span>`:"";
  const body=`<div class="scope-note"><span class="tag ${card.type}">${type.symbol} ${type.name}</span><span class="tag">${SCOPE_NAMES[card.scope]}卡</span>${conflictTag}<span class="tag">${escapeHtml(scopeNote)}</span></div><p class="card-story">${escapeHtml(story)}</p><div class="task-box"><strong>本次关注</strong><br>${escapeHtml(personalizedText(card.task,index,card.round))}</div><div class="option-heading"><strong>选择一个执行方案</strong><span>先看具体行动，再比较资源代价</span></div><div class="choice-grid">${options.map((option,i)=>`<button class="choice-option" data-option="${i}"><strong>${String.fromCharCode(65+i)} · ${escapeHtml(option.label)}</strong><p>${escapeHtml(personalizedOptionDetail(card,index,i,option))}</p>${effectChipsHtml(option.effects)}</button>`).join("")}</div>${card.scope==="class"?`<label class="field-label">30秒讨论或投票记录<textarea class="strategy-field compact-field" id="classNote" placeholder="记录多数选择，以及另一种意见怎样被照顾"></textarea></label>`:""}<p class="form-error" id="cardError"></p>`;
  openModal({kicker:`第${card.round}周 · ${SCOPE_NAMES[card.scope]}${type.name}卡`,title:card.title,body,actions:[],card:true,locked:true});
  ui.modalBody.querySelectorAll("[data-option]").forEach(btn=>btn.onclick=()=>{const note=byId("classNote")?.value.trim()||"";if(card.scope==="class"&&!note){byId("cardError").textContent="请先记录全班30秒讨论或投票结果。";return;}const option=options[Number(btn.dataset.option)];showActionConfirm(card,option,note);});
}
function showActionConfirm(card,option,note){
  const body=`<p class="selected-action"><span>准备执行</span><strong>${escapeHtml(option.label)}</strong></p><div class="effect-box effect-result"><strong>执行后</strong>${effectChipsHtml(option.effects)}</div>${mitigationHtml(option.effects)}<label class="field-label">选择理由 <span class="optional-mark">选填，可跳过</span><textarea class="strategy-field compact-field" id="choiceReason" placeholder="需要记录时，可写下这项做法为什么适合当前人物"></textarea></label>`;
  openModal({kicker:`第${card.round}周 · 确认行动`,title:card.title,body,actions:[{label:"返回重选",secondary:true,onClick:showCurrentCardModal},{label:"执行这个方案",onClick:()=>{const reason=byId("choiceReason").value.trim();attemptResolve(card,option,`${option.label}${reason?`：${reason}`:""}${note?`；全班记录：${note}`:""}`);}}],card:true,locked:true});
}
function attemptResolve(card,option,label){
  const noteField=byId("actionNote"),note=noteField?.value.trim()||"";if(noteField&&!note){const error=byId("cardError")||document.createElement("p");error.className="form-error";error.textContent="请先写下具体行动或全班讨论记录。";if(!error.parentNode)ui.modalBody.append(error);return;}
  const mitigation={assist:document.querySelector('input[name="pairAssist"]:checked')?.value||null};resolveCard(card,option.effects,`${label}${note?`：${note}`:""}`,mitigation,option.relations||[]);
}
function applyResource(teamIndex,key,delta,changes){
  const team=game.teams[teamIndex],before=team.resources[key],after=clamp(before+delta,0,RESOURCE_INFO[key].max);team.resources[key]=after;const actual=after-before;if(actual)changes.push({teamIndex,key,delta:actual});
}
function applyAdultRelations(actor,relations,changes){
  relations.forEach(relation=>{
    if(!RELATION_INFO[relation.source])return;
    const targets=relation.target==="all"?game.teams.map((_,i)=>i):[actor];
    targets.forEach(teamIndex=>{
      const before=clone(game.teams[teamIndex].adultRelations[relation.source]);
      const after={status:relation.status||"pending",title:relation.title||"待沟通事项",note:relation.note||""};
      game.teams[teamIndex].adultRelations[relation.source]=after;
      if(JSON.stringify(before)!==JSON.stringify(after))changes.push({teamIndex,relation:relation.source,status:after.status,title:after.title,note:after.note});
    });
  });
}
function resolveCard(card,effects,decisionText,mitigation={},relations=[]){
  const actor=game.activeTeam,pair=pairForStudent(actor),partner=partnerIndex(actor),adjusted=clone(effects),changes=[];
  for(const [target,values] of Object.entries(adjusted)){
    if(target==="bond"){const before=game.bonds[pair.id];game.bonds[pair.id]=clamp(before+values,0,3);if(game.bonds[pair.id]!==before)changes.push({bond:pair.id,delta:game.bonds[pair.id]-before});continue;}
    const targets=target==="self"?[actor]:target==="partner"?[partner]:target==="all"?game.teams.map((_,i)=>i):[];
    targets.forEach(i=>Object.entries(values).forEach(([key,delta])=>applyResource(i,key,delta,changes)));
  }
  let assistSummary="";
  if(mitigation.assist&&!game.pairAssistUsed[pair.id]){const [target,key]=mitigation.assist.split(":"),supportedIndex=target==="partner"?partner:actor,supporterIndex=supportedIndex===actor?partner:actor;applyResource(supportedIndex,key,1,changes);applyResource(supporterIndex,key,-1,changes);game.pairAssistUsed[pair.id]=true;assistSummary=`${game.teams[supportedIndex].name}接受${game.teams[supporterIndex].name}的搭档支援`;}
  applyAdultRelations(actor,relations,changes);
  const affected=[...new Set(changes.filter(c=>c.teamIndex!==undefined).map(c=>c.teamIndex).concat(actor))];
  affected.forEach(i=>{const zeros=CORE_RESOURCE_KEYS.filter(key=>game.teams[i].resources[key]===0&&!game.teams[i].pendingAdjustment.includes(key));game.teams[i].pendingAdjustment.push(...zeros);});
  const resourceTotals=new Map(),bondChanges=[],relationChanges=[];changes.forEach(change=>{if(change.bond){bondChanges.push(change);return;}if(change.relation){relationChanges.push(change);return;}const id=`${change.teamIndex}:${change.key}`;resourceTotals.set(id,(resourceTotals.get(id)||0)+change.delta);});
  const netChanges=[...resourceTotals].filter(([,delta])=>delta!==0).map(([id,delta])=>{const [teamIndex,key]=id.split(":");return `${game.teams[Number(teamIndex)].name}${RESOURCE_INFO[key].name}${delta>0?"+":""}${delta}`;});
  bondChanges.forEach(change=>netChanges.push(`${PAIRS.find(p=>p.id===change.bond).name}默契${change.delta>0?"+":""}${change.delta}`));
  relationChanges.forEach(change=>netChanges.push(`${game.teams[change.teamIndex].name}${RELATION_INFO[change.relation].name}：${change.status==="managed"?"已协商":"待沟通"}`));
  if(assistSummary)netChanges.unshift(assistSummary);
  const changeText=netChanges.join("、")||"资源保持不变";
  const cleanDecisionText=decisionText.replace(/[。！？!?]+$/g,"");
  const summary=`${CARD_TYPES[card.type].name}《${card.title}》：${cleanDecisionText}。${changeText}`;
  const record={round:game.round,actor,cardId:card.id,title:card.title,type:card.type,scope:card.scope,summary,changes:clone(changes)};
  affected.forEach(i=>game.teams[i].history.push(record));game.lastEvent=summary;game.currentCardId=null;game.activeTeam+=1;
  if(game.activeTeam>=6){game.activeTeam=5;game.phase="echo";game.weeklyEchoes.push(buildWeeklyEcho(game.round));}
  closeModal(true);
  saveGame();render();if(game.phase==="echo")setTimeout(showWeeklyEcho,80);
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
  saveGame();render();showWeekStory();
}
function showAdjustment(index){
  const team=game.teams[index],key=team.pendingAdjustment[0];if(!key){render();return;}
  openModal({kicker:"资源归零 · 调整任务",title:`${team.name}需要先调整${RESOURCE_INFO[key].name}`,body:`<p>资源归零不会跳过本周。请把调整写成可以执行的安排，完成后${RESOURCE_INFO[key].name}恢复到1点。</p><label class="field-label">删掉或缩减的任务<textarea class="text-field" id="adjustCut"></textarea></label><label class="field-label">准备向谁求助<input class="text-field" id="adjustHelp"></label><label class="field-label">具体执行时间<input class="text-field" id="adjustWhen" placeholder="例如：今晚九点前"></label><p class="form-error" id="adjustError"></p>`,actions:[{label:"完成调整",onClick:()=>{const cut=byId("adjustCut").value.trim(),help=byId("adjustHelp").value.trim(),when=byId("adjustWhen").value.trim();if(!cut||!help||!when){byId("adjustError").textContent="三项都要写清楚，不能只填“合理安排”。";return;}pushUndo(`${team.name}完成资源调整`);team.resources[key]=1;team.pendingAdjustment.shift();team.adjustments.push({round:game.round,key,cut,help,when});game.lastEvent=`${team.name}缩减“${cut}”，向${help}求助，并约定${when}执行，${RESOURCE_INFO[key].name}恢复1点。`;closeModal(true);saveGame();render();if(team.pendingAdjustment.length)setTimeout(()=>showAdjustment(index),50);}}],locked:true});
}
function portrait(team){const names={courage:"探索者",knowledge:"学习者",time:"规划者"},core=CORE_RESOURCE_KEYS.map(key=>[key,team.resources[key]]),values=core.map(([,value])=>value),highest=Math.max(...values);if(highest-Math.min(...values)<=2)return "平衡成长者";return core.filter(([,value])=>value===highest).map(([key])=>names[key]).join(" × ");}
function endingEnergyReward(team,index){
  const values=CORE_RESOURCE_KEYS.map(key=>team.resources[key]),minimum=Math.min(...values),adjusted=team.adjustments.length>0&&!team.pendingAdjustment.length;
  let selfManagement=0;if(!team.pendingAdjustment.length){if(minimum>=5||(adjusted&&minimum>=3))selfManagement=2;else if(minimum>=3||adjusted)selfManagement=1;}
  const bond=game.bonds[pairForStudent(index).id],managed=Object.values(team.adultRelations||{}).some(relation=>relation.status==="managed");
  const relationship=bond>=3||(bond>=2&&managed)?2:bond>=2||managed?1:0;
  return {completion:2,selfManagement,relationship,total:2+selfManagement+relationship};
}
function showFinal(){
  const rewards=game.teams.map(endingEnergyReward),totalEnergy=rewards.reduce((sum,reward)=>sum+reward.total,0);
  const endings=game.teams.map((team,i)=>{const pair=pairForStudent(i),reward=rewards[i],shared=game.bonds[pair.id]>=3?`与${game.teams[partnerIndex(i)].name}形成“${pair.theme}”共同结局。`:"这段关系仍保留下一次主动沟通的空间。";const adjustment=team.adjustments.at(-1),family=team.adultRelations.family,teacher=team.adultRelations.teacher,relationSummary=`家庭沟通：${relationStatusLabel(family)}；师生沟通：${relationStatusLabel(teacher)}。`;return `<article class="ending-card"><div class="ending-card-head"><div><h3>${escapeHtml(team.name)}</h3><span class="portrait">${portrait(team)}</span></div><div class="energy-award"><span>本环节奖励</span><strong>+${reward.total}枚</strong></div></div><div class="reward-breakdown"><span>完成旅程 +${reward.completion}</span><span>自我管理 +${reward.selfManagement}</span><span>关系成长 +${reward.relationship}</span></div><p>${adjustment?`曾在资源归零后缩减“${escapeHtml(adjustment.cut)}”，并向${escapeHtml(adjustment.help)}求助。`:"六周中没有资源归零，但仍需要从记录中选出一次主动调整。"}</p><p>${escapeHtml(relationSummary)}</p><p>${escapeHtml(shared)}</p></article>`;}).join("");
  const strategy=game.strategy?`<div class="strategy-summary"><strong>已完成成长策略单</strong><br>${escapeHtml(game.strategy.transfer)}</div>`:"";
  const energySummary=`<section class="energy-summary"><div><span>本环节六组合计</span><strong>${totalEnergy}枚能量币</strong></div><p>每组完成旅程固定获得2枚，再按自我管理和关系成长各获得0–2枚。请将本环节奖励计入大活动总能量币。</p></section>`;
  openModal({kicker:"六周结算",title:"每个人都带着自己的方法进入考场",wide:true,body:`${energySummary}${strategy}<div class="ending-grid">${endings}</div>`,actions:[{label:"查看36次行动记录",secondary:true,onClick:showJournal},{label:game.strategy?"修改成长策略单":"填写成长策略单",onClick:showStrategyForm}]});
}
function showStrategyForm(){const s=game.strategy||{};openModal({kicker:"结课记录",title:"成长策略单",wide:true,body:`<label class="field-label">我们最重要的一次选择是什么？<textarea class="strategy-field" id="sChoice">${escapeHtml(s.choice||"")}</textarea></label><label class="field-label">当时牺牲了什么资源？<textarea class="strategy-field" id="sCost">${escapeHtml(s.cost||"")}</textarea></label><label class="field-label">遇到的困难是什么？<textarea class="strategy-field" id="sChallenge">${escapeHtml(s.challenge||"")}</textarea></label><label class="field-label">我们后来怎样调整？<textarea class="strategy-field" id="sAdjustment">${escapeHtml(s.adjustment||"")}</textarea></label><label class="field-label">这个策略怎样用于真实学习或生活？<textarea class="strategy-field" id="sTransfer">${escapeHtml(s.transfer||"")}</textarea></label><p class="form-error" id="strategyError"></p>`,actions:[{label:"返回结局",secondary:true,onClick:showFinal},{label:"完成策略单",onClick:()=>{const strategy={choice:byId("sChoice").value.trim(),cost:byId("sCost").value.trim(),challenge:byId("sChallenge").value.trim(),adjustment:byId("sAdjustment").value.trim(),transfer:byId("sTransfer").value.trim()};if(Object.values(strategy).some(v=>!v)){byId("strategyError").textContent="请完成五项记录，尽量引用游戏中的具体事件。";return;}pushUndo("完成成长策略单");game.strategy=strategy;saveGame();showFinal();}}]});}
function showJournal(){const rows=game.drawnCardIds.map(id=>{const card=cardById(id),record=game.teams.flatMap(team=>team.history).find(item=>item.cardId===id);return {round:card.round,name:game.teams[record?.actor??0].name,...record,title:card.title,type:card.type};});openModal({kicker:"六周行动记录",title:`已处理 ${game.drawnCardIds.length} / 36 张牌`,wide:true,body:`<div class="echo-list">${rows.map(r=>`<div class="echo-row"><strong>第${r.round}周</strong><span>${escapeHtml(r.name)} · ${escapeHtml(r.title)}</span><span class="echo-changes">${CARD_TYPES[r.type].name}</span></div>`).join("")}</div>`,actions:[{label:"返回结局",onClick:showFinal}]});}
function showRules(){openModal({kicker:"课堂规则",title:"六周同班抽卡沙盘",body:`<ul class="rule-list"><li>每周六张牌，机遇、挑战、抉择各2张；个人、搭档、全班为3、2、1张。</li><li>每张事件提供两个可执行方案。小组选择一项；选择理由可以口头说明，也可以跳过不写。</li><li>六位学生依次各抽一张，共6周、36次行动。没有骰子、地图和提前结束。</li><li>家庭或师生矛盾来自立场、责任和现实条件不同。两个方案都可能合理，但资源代价与沟通结果不同。</li><li>成人矛盾不会淘汰学生。“待沟通”会留在学生侧栏，“已协商”会写入行动记录和最终结局。</li><li>课堂只讨论虚构人物，不要求任何学生公开自己的成绩、家庭情况或真实冲突。</li><li>能量币不属于本局角色资源，六周过程中不能获得或消耗，只在最终结算时作为大活动奖励发放。</li><li>每组完成六周固定获得2枚，再按自我管理和关系成长各获得0–2枚，最终共获得2–6枚。</li><li>默契达到2解锁一次搭档支援：受损学生少损失1点，支援者损失同类资源1点。</li><li>资源归零不跳过行动，完成“删减任务、求助对象、执行时间”后恢复1点。</li><li>抽卡与处理结果是一个撤回步骤。撤回后同一张牌回到牌堆顶部。</li></ul>`,actions:[{label:"知道了",onClick:()=>closeModal(true)}]});}
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
ui.modalClose.onclick=()=>closeModal();ui.modalBackdrop.onclick=e=>{if(e.target===ui.modalBackdrop)closeModal();};document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

render();
if(game.phase==="setup")setTimeout(showBriefing,80);else if(game.currentCardId)setTimeout(showCurrentCardModal,80);
