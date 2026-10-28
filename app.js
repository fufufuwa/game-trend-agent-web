/* Game Trend Agent — a browser-local, bilingual demonstration. No backend or publishing API. */
function weightedLength(value) {
  let total = 0;
  const plain = String(value).normalize('NFC').replace(/https?:\/\/[^\s<>]+/gu, () => { total += 23; return ''; });
  // ponytail: this preview estimator uses native graphemes; production approval must use twitter-text.
  const segments = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(plain)].map(part => part.segment)
    : Array.from(plain);
  for (const segment of segments) total += /[\u1100-\uFFFF]|\p{Extended_Pictographic}/u.test(segment) ? 2 : 1;
  return total;
}

if (typeof module !== 'undefined') module.exports = { weightedLength };

if (typeof document !== 'undefined') (() => {
  'use strict';
  const STORAGE_KEY = 'game-trend-agent-public-demo-v1';
  const COPY = {
    zh: {
      'nav.topics': '話題工作台', 'nav.sources': '來源雷達', 'nav.history': '發布記錄', 'nav.settings': '偏好設定',
      'app.name': 'Game Trend Agent', 'app.tagline': '玩家的下一個好話題',
      'demo.badge': '互動演示', 'demo.notice': '示例素材 · 資料只儲存在此瀏覽器 · 由你手動發布',
      'actions.reset': '重置演示', 'search.placeholder': '搜尋遊戲、話題或關鍵字…',
      'header.demo': '公開演示工作台', 'heading.eyebrow': '從玩家的角度出發',
      'stats.signal': '今天的靈感雷達', 'stats.caption': '示例素材 · 真實操作體驗',
      'stats.topics': '示例選題', 'stats.pending': '待審草稿', 'stats.approved': '已批准',
      'topics.selected': '精選話題', 'topics.quality': '有趣優先，不湊數。',
      'footer.note': '你的觀點，由你按下發布。', 'account.name': '玩家的編輯台', 'account.local': '本機優先 · 人工發布',
      topicsTitle: '好話題，留給玩家說。', topicsSubtitle: '從神評論到設計取捨，挑一則你真的想發的。',
      sourcesTitle: '把視野放到更多遊戲。', sourcesSubtitle: '固定關注，也給下一個意外驚喜留個位置。',
      historyTitle: '你發出去的，才算數。', historySubtitle: '手動登記實際正文，讓每一次表達都可回看。',
      settingsTitle: '這是你的玩家帳號。', settingsSubtitle: '選擇舒服的語言與介面，保留自己的口吻。',
      all: '全部來源', steam: 'Steam 評論', lemmy: 'Lemmy 社群', rss: '遊戲 RSS', heybox: '小黑盒導入',
      queue: '今日靈感', shown: '個話題', recommended: '值得打開', score: '話題潛力', sample: '演示素材',
      noResults: '還沒有符合的話題', trySearch: '換個關鍵字，或看看其他來源。',
      angle: '切入點', drafts: '三種口吻，一個自己的選擇', info: '資訊', roast: '吐槽', discussion: '討論',
      pending: '待審', approved: '已批准', rejected: '已拒絕', published: '已登記發布',
      version: '草稿版本', original: '初始草稿', generated: '演示新版本', protected: '人工版本已保護',
      edit: '開始編輯', save: '保存修改', approve: '批准此版本', reject: '略過此版本',
      copy: '複製已保存正文', regenerate: '新增演示版本', copied: '已複製，可以手動發布。',
      copyFail: '瀏覽器無法自動複製，請選取正文複製。', saved: '修改已保存，請重新審閱。',
      editNote: '已立即鎖定此版本。未保存的輸入也只保留在此瀏覽器；新增版本不會改動這裡。',
      lockedLanguage: '人工正文保留編輯時的語言，不隨介面切換翻譯。',
      unsaved: '有尚未保存的修改', saveFirst: '請先保存修改，再批准或登記發布。',
      protectedNote: '此版本的正文、來源快照和人工保護標記不會被演示重新生成覆蓋。',
      generatedNote: '已新增三個示例版本；你目前查看的版本保持原樣。',
      estimated: '估算加權字元', countNote: '演示計數，正式發布以 X 編輯器或 twitter-text 校驗為準。',
      tooLong: '正文過長，請縮短後再批准。', emptyDraft: '請先填入正文。',
      approveNote: '已批准。請自行複製到 X 發布；本頁不會替你發文。',
      rejectNote: '已略過這個版本，其他版本仍保留。',
      publish: '手動登記已發', publishTitle: '記下你實際發布的版本',
      publishHelp: '這個動作只新增本機演示記錄，不會連線或發布到 X。',
      actualText: '實際發布正文', actualDate: '發布時間', optionalUrl: 'X 連結（選填）',
      confirmPublish: '保存發布記錄', cancel: '取消', registered: '發布快照已保存在此瀏覽器。',
      approveFirst: '請先批准這個版本。', badUrl: '請輸入有效的 https://x.com/ 或 twitter.com/ 連結。',
      badDate: '請填寫有效的發布時間。', publishedNote: '這個話題已有發布快照，保留實際正文，不覆蓋歷史。',
      evidence: '保留出處，也保留自己的觀點', source: '來源', attribution: '歸屬', sourceLink: '遊戲／社群入口 ↗',
      evidenceNote: '這是為展示操作而撰寫的示例，並非已採集的真實評論；連結僅指向遊戲或社群入口。',
      mockAuthor: '演示玩家（虛構）', mockTime: '演示時間 · 非即時新聞',
      shareValue: '推薦理由', strength: '討論', resonance: '共鳴', novelty: '獨特',
      recent: '近期靈感', evergreen: '不怕過時', sourceStatus: '演示配置',
      sourceIntro: '一個有邊界的來源雷達', sourceIntroText: '正式版在 Windows 本機採集、評分與寫稿。此公開前端只展示流程，沒有連接你的本機資料庫或模型。',
      fixedPool: '固定關注', dynamicPool: '動態遊戲', dailyRotation: '每日輪換', games: '款遊戲',
      steamDescription: '固定六款＋動態十六款；獨立、RPG、Galgame、競技、生存建造與新作。',
      rssDescription: 'Gematsu 與 VGC 等 RSS；保留原文與時間，普通公告讓位給好話題。',
      lemmyDescription: 'Gaming 與 PC Gaming 社群，關注玩家趣聞和有意思的分歧。',
      heyboxDescription: '由你貼上公開評論分享連結；不可讀時補文字或截圖，不使用登入 Cookie。',
      importHeading: '試試公開連結導入', importDescription: '只在本機檢查連結格式，加入一則清楚標記的演示話題，不抓取連結內容。',
      importLabel: '小黑盒公開分享連結', importPlaceholder: 'https://api.xiaoheihe.cn/bbs/app/comment/share/page?comment_id=…',
      importAction: '加入導入演示', importBad: '請使用含數字 comment_id 的小黑盒公開評論分享連結。',
      importDuplicate: '這個演示連結已加入，請到工作台查看。', importDone: '已加入演示話題，沒有抓取或分析連結內容。',
      importedTitle: '你帶來的下一個玩家話題', importedAngle: '公開連結已在本機記錄。此演示不讀取網頁，請在正式版導入真實原文後再寫稿。',
      importedDraft: '一則好評論，有時比一整篇更新公告更值得聊。這裡先留一個位置，等原文和你的觀點。',
      emptyHistory: '下一篇，就從這裡開始。', emptyHistoryText: '批准喜歡的草稿、手動發布，再回來登記。演示不會替你發文。',
      backTopics: '去挑一則話題', historyImmutable: '保存實際發布正文的本機快照', viewPost: '查看貼文 ↗',
      language: '介面語言', appearance: '外觀', dark: '深色', light: '淺色',
      voiceTitle: '像玩家說話', voiceDescription: '可以調侃、可以尖銳，但別把別人的故事寫成自己的經歷。真實出處留著，個性也留著。',
      workflowTitle: '自動找靈感，最後由你決定', workflowDescription: '來源 → 話題評分 → 三版草稿 → 人工編輯與批准 → 複製 → 手動發布。',
      storageTitle: '這個演示記住什麼？', storageDescription: '語言、外觀、草稿修改、人工鎖與演示發布記錄保存在目前瀏覽器。不會讀取正式版資料，也沒有雲端同步。',
      resetConfirm: '已重置本頁演示資料，未改動其他網站或正式版資料。',
      storageUnavailable: '瀏覽器不允許儲存；目前操作只會保留到頁面重新載入。',
      reviewer: '人工審閱', manualOnly: '手動發布', revision: '版本', newSuffix: '換個切口：',
    },
    en: {
      'nav.topics': 'Topic desk', 'nav.sources': 'Source radar', 'nav.history': 'Post history', 'nav.settings': 'Preferences',
      'app.name': 'Game Trend Agent', 'app.tagline': 'Your next good gaming conversation',
      'demo.badge': 'Interactive demo', 'demo.notice': 'Sample content · Stored in this browser · You publish manually',
      'actions.reset': 'Reset demo', 'search.placeholder': 'Search games, topics, or keywords…',
      'header.demo': 'DEMO WORKSPACE', 'heading.eyebrow': 'THE PLAYER’S PERSPECTIVE',
      'stats.signal': 'Today’s inspiration radar', 'stats.caption': 'Sample stories · Real interactions',
      'stats.topics': 'Sample topics', 'stats.pending': 'Drafts to review', 'stats.approved': 'Approved',
      'topics.selected': 'Selected topics', 'topics.quality': 'Interesting first. No filler.',
      'footer.note': 'Your perspective. You press publish.', 'account.name': 'Player’s editorial desk', 'account.local': 'Local first · Human publishing',
      topicsTitle: 'Good stories. Your take.', topicsSubtitle: 'From brilliant reviews to design trade-offs. Pick something you actually want to post.',
      sourcesTitle: 'More games. More possibilities.', sourcesSubtitle: 'Follow your favorites. Leave room for an unexpected find.',
      historyTitle: 'Your words, out in the world.', historySubtitle: 'Record what you actually posted, and keep the final version.',
      settingsTitle: 'Your account. Your voice.', settingsSubtitle: 'Choose your language and look. Keep the personality.',
      all: 'All sources', steam: 'Steam reviews', lemmy: 'Lemmy community', rss: 'Gaming RSS', heybox: 'Heybox imports',
      queue: 'Today’s inspiration', shown: 'topics', recommended: 'Worth a look', score: 'Conversation potential', sample: 'Sample content',
      noResults: 'No topics found', trySearch: 'Try another keyword or explore a different source.',
      angle: 'The angle', drafts: 'Three voices. One personal take.', info: 'Informative', roast: 'Playful', discussion: 'Discussion',
      pending: 'Needs review', approved: 'Approved', rejected: 'Skipped', published: 'Recorded as posted',
      version: 'Draft version', original: 'Original draft', generated: 'New demo version', protected: 'Human version protected',
      edit: 'Start editing', save: 'Save changes', approve: 'Approve version', reject: 'Skip version',
      copy: 'Copy saved text', regenerate: 'Add demo versions', copied: 'Copied. Ready for you to post.',
      copyFail: 'Automatic copy is unavailable. Select and copy the draft text.', saved: 'Changes saved. Ready for another review.',
      editNote: 'This version is locked immediately. Unsaved input also stays in this browser; new versions cannot replace it.',
      lockedLanguage: 'Human text keeps its editing language when the interface language changes.',
      unsaved: 'Unsaved changes', saveFirst: 'Save your changes before approving or recording a post.',
      protectedNote: 'Demo regeneration cannot replace this version’s text, source snapshot, or human protection flag.',
      generatedNote: 'Three new sample versions added. The version you are viewing stays selected.',
      estimated: 'estimated weighted characters', countNote: 'Demo estimate. Validate production posts with X or twitter-text.',
      tooLong: 'The draft is too long. Shorten it before approval.', emptyDraft: 'Please enter some text first.',
      approveNote: 'Approved. Copy and publish on X yourself; this page never posts for you.',
      rejectNote: 'This version was skipped. Your other versions are still here.',
      publish: 'Record a manual post', publishTitle: 'Save the version you actually posted',
      publishHelp: 'This only adds a local demo record. It does not connect to or publish on X.',
      actualText: 'Actual published text', actualDate: 'Publication time', optionalUrl: 'X link (optional)',
      confirmPublish: 'Save post record', cancel: 'Cancel', registered: 'Post snapshot saved in this browser.',
      approveFirst: 'Approve this version first.', badUrl: 'Enter a valid https://x.com/ or twitter.com/ link.',
      badDate: 'Enter a valid publication time.', publishedNote: 'This topic already has a post snapshot. Its actual published text is preserved.',
      evidence: 'Keep the source. Keep your point of view.', source: 'Source', attribution: 'Attribution', sourceLink: 'Game / community page ↗',
      evidenceNote: 'Written for this demo, not collected from a real review. Links open a game or community page only.',
      mockAuthor: 'Demo player (fictional)', mockTime: 'Demo timestamp · Not live news',
      shareValue: 'Why it could travel', strength: 'Discussion', resonance: 'Relatable', novelty: 'Distinctive',
      recent: 'Fresh inspiration', evergreen: 'Evergreen', sourceStatus: 'Demo configuration',
      sourceIntro: 'A source radar with clear boundaries', sourceIntroText: 'The production app collects, ranks, and writes locally on Windows. This public frontend demonstrates the workflow without accessing your database or model.',
      fixedPool: 'Following', dynamicPool: 'Dynamic pool', dailyRotation: 'Daily rotation', games: 'games',
      steamDescription: 'Six favorites plus sixteen rotating games across indie, RPG, Galgame, competitive, survival-building, and new releases.',
      rssDescription: 'Gematsu and VGC RSS. Keep the original source and date; let interesting stories outrank routine announcements.',
      lemmyDescription: 'Gaming and PC Gaming communities, for player stories and disagreements worth talking about.',
      heyboxDescription: 'Bring a public comment link. Add text or a screenshot when it is unreadable. No login cookies.',
      importHeading: 'Try a public-link import', importDescription: 'Checks the link format locally and adds a labeled sample topic. It does not fetch the page.',
      importLabel: 'Heybox public share link', importPlaceholder: 'https://api.xiaoheihe.cn/bbs/app/comment/share/page?comment_id=…',
      importAction: 'Add import demo', importBad: 'Use a public Heybox comment share URL with a numeric comment_id.',
      importDuplicate: 'That sample link is already here. Find it on the topic desk.', importDone: 'Demo topic added. No page content was fetched or analyzed.',
      importedTitle: 'The next player story you bring', importedAngle: 'This public link is recorded locally. The demo does not read it; import real source text in the production app before writing.',
      importedDraft: 'A good player comment can be more interesting than a whole patch note. A space for the original words, and your own take.',
      emptyHistory: 'Your next post starts here.', emptyHistoryText: 'Approve a draft you like, post it yourself, then record it here. The demo never publishes for you.',
      backTopics: 'Find a topic', historyImmutable: 'A local snapshot of what you actually posted', viewPost: 'View post ↗',
      language: 'Interface language', appearance: 'Appearance', dark: 'Dark', light: 'Light',
      voiceTitle: 'Sound like a player', voiceDescription: 'Be funny. Be sharp. Just don’t turn someone else’s story into your personal experience. Keep both the source and your personality.',
      workflowTitle: 'Find inspiration automatically. Decide yourself.', workflowDescription: 'Sources → topic ranking → three drafts → human editing and approval → copy → manual publishing.',
      storageTitle: 'What does this demo remember?', storageDescription: 'Language, appearance, edits, human locks, and sample post records stay in this browser. No production data access and no cloud synchronization.',
      resetConfirm: 'This demo was reset. Other sites and production data were not changed.',
      storageUnavailable: 'Browser storage is unavailable. Your work will last only until this page reloads.',
      reviewer: 'Human review', manualOnly: 'Manual publishing', revision: 'Version', newSuffix: 'Another angle: ',
    },
  };
  const seeds = [
    {
      id: 'warframe', game: 'Warframe', source: 'steam', score: 94, category: ['玩家神評論', 'Brilliant review'], age: 'evergreen', icon: 'W', color: 'mint',
      title: ['玩了 1,800 小時，終於準備開始玩', '1,800 hours in. Finally ready to start.'],
      angle: ['裝備和外觀終於整理好，才算正式開局？玩家的「前置準備」沒有極限。', 'When the fashion and loadout are finally ready, the real game can begin. Preparation is a game of its own.'],
      reason: ['一句話就懂的反差，適合搭配評論存檔圖。', 'An instantly readable contrast, perfect beside a review archive card.'],
      sourceUrl: 'https://store.steampowered.com/app/230410/',
      drafts: {
        info: ['有一種 Warframe 進度：打完裝備、配好外觀，才覺得自己準備開始遊戲。\n\n有些人的新手教學，真的比別人的整個遊戲生涯還長。', 'Some Warframe players finish their loadouts and fashion before they feel ready to start.\n\nOne person’s tutorial is another person’s entire gaming career.'],
        roast: ['Warframe：先刷裝備，再配外觀，最後才開始玩。\n\n好消息，你終於畢業了。\n壞消息，畢業的是準備工作。', 'Warframe: farm the gear, perfect the fashion, then start playing.\n\nGood news: you graduated.\nBad news: it was from preparation.'],
        discussion: ['角色變強和角色變好看，你會先解決哪個？\n\nWarframe 最危險的不是下一個任務，是「我再調一下這個配色就走」。', 'Stronger build or better fashion: which comes first?\n\nThe most dangerous Warframe mission is “one more color adjustment, then I’m ready.”'],
      },
    },
    {
      id: 'stardew', game: 'Stardew Valley', source: 'steam', score: 91, category: ['共鳴吐槽', 'Relatable moment'], age: 'evergreen', icon: 'S', color: 'amber',
      title: ['「再玩一天」是最溫柔的時間陷阱', '“One more day” is a very polite time trap.'],
      angle: ['療癒農場怎麼玩成了凌晨三點的行程管理？', 'How did a relaxing farm become a 3 a.m. scheduling problem?'],
      reason: ['不需要熟悉版本，也能理解的玩家共同經歷。', 'You don’t need patch knowledge to understand the feeling.'],
      sourceUrl: 'https://store.steampowered.com/app/413150/',
      drafts: {
        info: ['Stardew Valley 的日程表很簡單：澆水、送禮、挖礦，然後在現實凌晨三點決定「再玩一天」。\n\n遊戲裡的生活井井有條，遊戲外的作息另當別論。', 'Stardew Valley schedule: water, gifts, mining. At 3 a.m. in real life, decide to play “one more day.”\n\nThe farm is organized. The sleep schedule is a separate project.'],
        roast: ['說好玩 Stardew Valley 是為了放鬆。\n\n結果腦子裡全是作物收益表、村民生日和魚的出勤時間。\n\n這不是下班，這是換了一家公司。', 'Play Stardew Valley to relax, they said.\n\nThen your head fills with crop margins, birthday calendars, and fish attendance schedules.\n\nThat isn’t clocking out. It’s changing employers.'],
        discussion: ['「再玩一天」到底是遊戲太好玩，還是結束一天的儀式感太強？\n\n種田遊戲最會抓住人的，也許不是收成，是永遠剛好有一件明天要做的事。', 'Is “one more day” about great gameplay, or the ritual of finishing a day?\n\nMaybe the strongest farming mechanic is always having exactly one thing to do tomorrow.'],
      },
    },
    {
      id: 'overwatch', game: 'Overwatch', source: 'heybox', score: 88, category: ['遊戲設計', 'Game design'], age: 'evergreen', icon: 'O', color: 'orange',
      title: ['你的本命位置，可能是排隊時間選的', 'Your main role might have been chosen by a queue.'],
      angle: ['想玩輸出卻嫌排太久，最後在坦克位找到了樂趣。這算妥協，還是發現？', 'Want damage, hate the wait, discover tank is fun. Is that compromise or a happy accident?'],
      reason: ['把小小的選角理由，變成每個多人玩家都能參與的問題。', 'A tiny role-choice story becomes a question any multiplayer player can join.'],
      sourceUrl: 'https://overwatch.blizzard.com/',
      drafts: {
        info: ['選角有時很務實：想打輸出，嫌排隊久，換坦克，然後發現也挺好玩。\n\n本命不一定是一見鍾情，也可能是等不下去了。', 'Role selection can be practical: want damage, hate the queue, pick tank, discover it’s fun.\n\nYour main isn’t always love at first sight. Sometimes you just got tired of waiting.'],
        roast: ['「我主坦。」\n「因為喜歡保護隊友？」\n「因為輸出排太久。」\n\n英雄的誕生，有時候就是這麼務實。', '“I main tank.”\n“Because you love protecting the team?”\n“Because the damage queue takes forever.”\n\nA surprisingly practical origin story.'],
        discussion: ['如果所有位置排隊一樣快，你還會玩現在的主職嗎？\n\n有些本命是自己選的，有些是配對系統慢慢養出來的。', 'If every role had the same queue time, would you still play your current main?\n\nSome mains are chosen. Others are slowly raised by matchmaking.'],
      },
    },
    {
      id: 'pet-cat', game: 'Indie games', source: 'lemmy', score: 85, category: ['遊戲趣聞', 'Gaming oddities'], age: 'evergreen', icon: 'i', color: 'purple',
      title: ['畫面、戰鬥都很好，為什麼不能摸貓？', 'Great combat. Great art. Why can’t I pet the cat?'],
      angle: ['認真評論最後敗給一個小互動。玩家對「好遊戲」的標準，很私人。', 'A serious review falls apart over one tiny interaction. A good game is a personal definition.'],
      reason: ['把玩家的奇怪評分標準講出來，本身就是笑點。', 'The strangely specific standard is the punchline.'],
      sourceUrl: 'https://lemmy.world/c/gaming',
      drafts: {
        info: ['玩家可以認真研究戰鬥系統，也可以因為不能摸貓而耿耿於懷。\n\n遊戲評價最有趣的部分，往往藏在規格表以外。', 'A player can study combat systems seriously and still care deeply about an unpettable cat.\n\nThe best part of a review often lives outside the feature list.'],
        roast: ['美術：優秀。\n戰鬥：流暢。\n音樂：出色。\n貓：不能摸。\n\n前面的努力，差點全毀在這一行。', 'Art: excellent.\nCombat: fluid.\nMusic: wonderful.\nCat: cannot be petted.\n\nA remarkably small line item to derail the whole review.'],
        discussion: ['你有沒有一個很私人、但一定會影響評價的小標準？\n\n能不能摸貓、能不能坐椅子、角色跑步好不好看——有時細節比系統還難妥協。', 'What tiny, personal detail changes your whole opinion of a game?\n\nPettable cats. Sittable chairs. A good running animation. Sometimes the small stuff is non-negotiable.'],
      },
    },
    {
      id: 'helldivers', game: 'HELLDIVERS 2', source: 'steam', score: 82, category: ['機制吐槽', 'Mechanics debate'], age: 'evergreen', icon: 'H', color: 'yellow',
      title: ['邊罵邊玩，是不好玩還是太在乎？', 'Still complaining. Still playing. Still caring?'],
      angle: ['喜歡一款遊戲，和對它的平衡決定不滿，可以同時存在。', 'Loving a game and disagreeing with its balance decisions can coexist.'],
      reason: ['留下真正的分歧空間，不把批評玩家簡化成矛盾的人。', 'Room for disagreement, without turning criticism into a contradiction.'],
      sourceUrl: 'https://store.steampowered.com/app/553850/',
      drafts: {
        info: ['一款多人遊戲的評論區，常常同時存在「真好玩」和「這次平衡到底在想什麼」。\n\n最愛玩的玩家，也可能是意見最多的人。', 'A multiplayer review section can contain both “this is great” and “what were they thinking with this balance patch?”\n\nThe most invested players may have the most complaints.'],
        roast: ['「這遊戲不行了。」\n「所以今晚不玩？」\n「幾點上線？」\n\n玩家和遊戲的關係，有時候連自己都解釋不清。', '“This game is finished.”\n“So, skipping tonight?”\n“What time are we logging on?”\n\nSome player-game relationships require their own translator.'],
        discussion: ['邊罵邊玩，到底是不好玩，還是太在乎？\n\n「喜歡所以才批評」有道理，但如果每次上線都只剩生氣，可能也值得給自己放個假。', 'Complaining while playing: is it bad, or do you care too much?\n\nCriticism can come from love. But if every session ends in anger, taking a break can be a perfectly good move.'],
      },
    },
    {
      id: 'steam-update', game: 'Steam', source: 'rss', score: 77, category: ['更新觀察', 'Update watch'], age: 'recent', icon: '↗', color: 'blue',
      title: ['成就越分越細，整理控和全成就黨都醒了', 'More achievement groups. More completionist feelings.'],
      angle: ['成就怎麼整理，會不會改變玩家追全收集的壓力？', 'Can the way achievements are organized change the pressure to complete them?'],
      reason: ['從功能介紹轉向玩家怎麼使用它，讓更新有可聊的地方。', 'Turn a feature description into a discussion of how players use it.'],
      sourceUrl: 'https://store.steampowered.com/news/',
      drafts: {
        info: ['成就分組聽起來是介面小事，對整理控可能是大型生活品質更新。\n\n一張清楚的清單，有時比多一枚徽章還讓人開心。', 'Achievement groups sound like a small interface detail. For an organization enthusiast, they could be a major quality-of-life upgrade.\n\nSometimes a tidy list beats another badge.'],
        roast: ['遊戲還沒通關，成就分類倒是先研究完了。\n\n整理清單也是遊戲內容，請尊重一下。', 'Haven’t finished the game. Have thoroughly studied the achievement categories.\n\nOrganizing the list is gameplay too. Respect the process.'],
        discussion: ['成就應該提醒你還有哪些玩法，還是給全收集一個明確終點？\n\n清單一旦變得更細，完成它會更輕鬆，還是更難放下？', 'Should achievements suggest things to try, or give completionists a clear finish line?\n\nWhen the list gets more detailed, does finishing feel easier—or harder to walk away from?'],
      },
    },
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const fresh = () => ({ language: 'zh', theme: 'dark', view: 'topics', selectedTopic: seeds[0].id, versions: {}, selectedVersions: {}, publications: [], imports: [] });
  let state = fresh();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && saved.versions && Array.isArray(saved.publications) && Array.isArray(saved.imports)) state = { ...state, ...saved };
  } catch { /* A damaged browser-local demo must not prevent a fresh start. */ }
  state.language = state.language === 'en' ? 'en' : 'zh';
  state.theme = state.theme === 'light' ? 'light' : 'dark';
  state.view = ['topics', 'sources', 'history', 'settings'].includes(state.view) ? state.view : 'topics';
  let query = '', filter = 'all', publishOpen = false, toastTimer;
  const $ = id => document.getElementById(id);
  const t = key => COPY[state.language][key] || key;
  const loc = pair => pair[state.language === 'zh' ? 0 : 1];
  const allTopics = () => [...seeds, ...state.imports.map(item => ({ id: item.id, game: 'Heybox', source: 'heybox', score: 0, category: ['連結導入示例', 'Import example'], age: 'evergreen', icon: '+', color: 'mint', title: [COPY.zh.importedTitle, COPY.en.importedTitle], angle: [COPY.zh.importedAngle, COPY.en.importedAngle], reason: [COPY.zh.importDescription, COPY.en.importDescription], sourceUrl: item.url, drafts: Object.fromEntries(['info', 'roast', 'discussion'].map(style => [style, [COPY.zh.importedDraft, COPY.en.importedDraft]])) }))];
  const currentTopic = () => allTopics().find(topic => topic.id === state.selectedTopic) || seeds[0];
  function versions(topic) {
    if (!Array.isArray(state.versions[topic.id]) || !state.versions[topic.id].length) {
      state.versions[topic.id] = ['info', 'roast', 'discussion'].map(style => ({ id: uid(), style, number: 1, text: { zh: topic.drafts[style][0], en: topic.drafts[style][1] }, locked: false, status: 'pending', evidence: { title: topic.title, url: topic.sourceUrl, author: 'demo', demo: true } }));
    }
    if (!state.versions[topic.id].some(version => version.id === state.selectedVersions[topic.id])) state.selectedVersions[topic.id] = state.versions[topic.id][0].id;
    return state.versions[topic.id];
  }
  const currentDraft = () => versions(currentTopic()).find(version => version.id === state.selectedVersions[currentTopic().id]);
  const savedText = draft => draft.locked ? draft.content : ['approved', 'published'].includes(draft.status) && draft.approvedText ? draft.approvedText : draft.text[state.language];
  const hasUnsaved = draft => draft.locked && draft.buffer !== draft.content;
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { toast(t('storageUnavailable')); }
  }
  function toast(message) {
    const element = $('toast');
    if (!element) return;
    element.textContent = message; element.hidden = false; element.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { element.hidden = true; element.classList.remove('visible'); }, 4000);
  }
  const button = (action, label, kind = 'subtle', extra = '') => `<button class="btn btn-${kind}" data-action="${action}" ${extra}>${esc(label)}</button>`;
  const tag = (label, kind = '') => `<span class="tag ${kind}">${esc(label)}</span>`;
  const statusTag = draft => tag(t(draft.status), `status-${draft.status}`);
  const publication = topic => state.publications.find(record => record.topicId === topic.id);

  function render() {
    document.documentElement.lang = state.language === 'zh' ? 'zh-Hant' : 'en';
    document.documentElement.dataset.theme = state.theme;
    document.body.dataset.theme = state.theme;
    document.body.classList.toggle('light', state.theme === 'light');
    document.querySelectorAll('[data-i18n]').forEach(element => { const key = element.dataset.i18n; if (COPY[state.language][key]) element.textContent = t(key); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-view]').forEach(element => {
      element.classList.toggle('active', element.dataset.view === state.view);
      element.setAttribute('aria-current', element.dataset.view === state.view ? 'page' : 'false');
    });
    if ($('language-toggle')) { $('language-toggle').textContent = state.language === 'zh' ? 'EN' : '繁中'; $('language-toggle').setAttribute('aria-label', state.language === 'zh' ? 'Switch to English' : '切換為繁體中文'); }
    if ($('view-title')) $('view-title').textContent = t(`${state.view}Title`);
    if ($('view-subtitle')) $('view-subtitle').textContent = t(`${state.view}Subtitle`);
    if ($('breadcrumb-current')) $('breadcrumb-current').textContent = t(`nav.${state.view}`);
    if ($('search-input')) { $('search-input').placeholder = t('search.placeholder'); $('search-input').value = query; }
    if ($('source-filter')) $('source-filter').innerHTML = ['all', 'steam', 'lemmy', 'rss', 'heybox'].map(value => `<option value="${value}" ${filter === value ? 'selected' : ''}>${esc(t(value))}</option>`).join('');
    const filterBar = document.querySelector('.filter-bar') || document.querySelector('.toolbar');
    if (filterBar) filterBar.hidden = state.view !== 'topics';
    const topics = allTopics();
    topics.forEach(topic => versions(topic));
    if ($('topic-count')) $('topic-count').textContent = topics.length;
    if ($('review-count')) $('review-count').textContent = topics.flatMap(topic => versions(topic)).filter(draft => draft.status === 'pending').length;
    if ($('approved-count')) $('approved-count').textContent = topics.filter(topic => versions(topic).some(draft => draft.status === 'approved')).length;
    const root = $('view-content');
    if (!root) return;
    root.innerHTML = state.view === 'topics' ? renderTopics() : state.view === 'sources' ? renderSources() : state.view === 'history' ? renderHistory() : renderSettings();
    persist();
  }

  function renderTopics() {
    const matches = allTopics().filter(topic => (filter === 'all' || topic.source === filter) && [topic.game, ...topic.title, ...topic.angle].join(' ').toLowerCase().includes(query.toLowerCase()));
    if (matches.length && !matches.some(topic => topic.id === state.selectedTopic)) {
      state.selectedTopic = matches[0].id;
      publishOpen = false;
      persist();
    }
    const selected = currentTopic();
    return `<div class="workspace-grid page-grid"><aside class="topic-list-panel panel"><div class="section-heading list-heading"><h2>${esc(t('queue'))}</h2><span>${matches.length} ${esc(t('shown'))}</span></div><div class="topic-list">${matches.length ? matches.map(topic => `<button class="topic-card ${selected.id === topic.id ? 'selected' : ''}" data-topic="${esc(topic.id)}" aria-pressed="${selected.id === topic.id}"><span class="topic-card-top"><span class="game-avatar ${topic.color}">${esc(topic.icon)}</span><span class="topic-game">${esc(topic.game)}<small>${esc(t(topic.source))}</small></span><span class="topic-score">${topic.score || '—'}<small>${esc(t('score'))}</small></span></span><strong>${esc(loc(topic.title))}</strong><span class="topic-summary">${esc(loc(topic.angle))}</span><span class="topic-card-bottom">${tag(loc(topic.category))}<span class="topic-age">${esc(t(topic.age))}</span></span>${publication(topic) ? `<span class="topic-published">✓ ${esc(t('published'))}</span>` : ''}</button>`).join('') : `<div class="empty-state"><strong>${esc(t('noResults'))}</strong><p>${esc(t('trySearch'))}</p></div>`}</div></aside>${matches.length ? renderDetail(selected) : ''}</div>`;
  }

  function renderDetail(topic) {
    const draft = currentDraft(), list = versions(topic), body = draft.locked ? draft.buffer : savedText(draft), posted = publication(topic);
    return `<section class="detail-panel panel" aria-label="${esc(t('reviewer'))}"><div class="detail-heading"><div class="eyebrow">${esc(topic.game)} <span>／</span> ${esc(t('sample'))}</div><h2>${esc(loc(topic.title))}</h2><p>${esc(loc(topic.angle))}</p><div class="detail-tags">${tag(loc(topic.category), 'accent')}${tag(t('manualOnly'))}${draft.locked ? tag('🔒 ' + t('protected'), 'protected') : ''}</div></div><div class="angle-card"><span class="field-label">${esc(t('shareValue'))}</span><p>${esc(loc(topic.reason))}</p></div><div class="draft-heading section-heading"><h3>${esc(t('drafts'))}</h3><span>${statusTag(draft)}</span></div><div class="draft-tabs" role="tablist" aria-label="${esc(t('drafts'))}">${['info', 'roast', 'discussion'].map(style => `<button role="tab" aria-selected="${draft.style === style}" class="draft-tab ${draft.style === style ? 'active' : ''}" data-style="${style}">${esc(t(style))}</button>`).join('')}</div><label class="version-row field-label" for="draft-version">${esc(t('version'))}<select id="draft-version">${list.map(version => `<option value="${esc(version.id)}" ${version.id === draft.id ? 'selected' : ''}>${esc(t(version.style))} · ${esc(t('revision'))} ${version.number} · ${esc(t(version.status))}${version.locked ? ' · 🔒' : ''}</option>`).join('')}</select></label>${draft.locked ? `<label class="sr-only" for="draft-editor">${esc(t('actualText'))}</label><textarea id="draft-editor" class="draft-text draft-editor" ${posted ? 'readonly' : ''}>${esc(body)}</textarea><p class="editor-note">${esc(t('editNote'))}</p><p class="editor-note">${esc(t('lockedLanguage'))}</p>` : `<div class="draft-text" id="saved-draft-text" tabindex="0">${esc(body)}</div>`}<div class="draft-meta"><span id="draft-counter" class="${weightedLength(body) > 280 ? 'over-limit' : ''}">${weightedLength(body)} / 280 ${esc(t('estimated'))}</span><span id="unsaved-note">${hasUnsaved(draft) ? esc(t('unsaved')) : ''}</span></div><p class="count-note">${esc(t('countNote'))}</p><div class="draft-actions">${!posted ? draft.locked ? button('save', t('save'), 'primary') : button('edit', t('edit'), 'primary') : ''}${button('copy', t('copy'))}${!posted ? button('approve', t('approve')) + button('reject', t('reject')) : ''}</div><div class="version-actions">${button('regenerate', t('regenerate'))}${draft.status === 'approved' && !posted ? button('publish', t('publish')) : ''}</div>${draft.locked ? `<p class="protection-note">⌁ ${esc(t('protectedNote'))}</p>` : ''}${posted ? `<p class="protection-note">✓ ${esc(t('publishedNote'))}</p>` : ''}${publishOpen && !posted ? renderPublishForm(draft) : ''}<details class="evidence-box"><summary>${esc(t('evidence'))}</summary><dl><dt>${esc(t('source'))}</dt><dd>${esc(t(topic.source))} · ${esc(t('sample'))}</dd><dt>${esc(t('attribution'))}</dt><dd>${esc(t('mockAuthor'))}</dd></dl><p>${esc(t('mockTime'))}</p><p>${esc(t('evidenceNote'))}</p><a href="${esc(draft.evidence.url)}" target="_blank" rel="noopener noreferrer">${esc(t('sourceLink'))}</a></details></section>`;
  }

  function renderPublishForm(draft) {
    const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    return `<form id="publish-form" class="publish-form panel"><h3>${esc(t('publishTitle'))}</h3><p>${esc(t('publishHelp'))}</p><label class="field-label" for="published-text">${esc(t('actualText'))}</label><textarea id="published-text" required maxlength="5000">${esc(savedText(draft))}</textarea><label class="field-label" for="published-date">${esc(t('actualDate'))}</label><input id="published-date" type="datetime-local" required value="${localDate}"><label class="field-label" for="published-url">${esc(t('optionalUrl'))}</label><input id="published-url" type="url" maxlength="2000" placeholder="https://x.com/…"><div class="draft-actions"><button class="btn btn-primary" type="submit">${esc(t('confirmPublish'))}</button>${button('cancel-publish', t('cancel'))}</div></form>`;
  }

  function renderSources() {
    return `<div class="sources-page"><section class="panel source-intro"><div><span class="eyebrow">SOURCE RADAR</span><h2>${esc(t('sourceIntro'))}</h2><p>${esc(t('sourceIntroText'))}</p></div><div class="source-metrics">${[['6', 'fixedPool'], ['16', 'dynamicPool'], ['8', 'dailyRotation']].map(([number, label]) => `<div class="metric"><strong>${number}</strong><span>${esc(t(label))}</span><small>${esc(t('games'))}</small></div>`).join('')}</div></section><section class="panel source-list">${[['steam', 'S', 'steamDescription', 'mint'], ['rss', 'R', 'rssDescription', 'blue'], ['lemmy', 'L', 'lemmyDescription', 'purple'], ['heybox', 'H', 'heyboxDescription', 'orange']].map(([name, icon, text, color]) => `<div class="source-row"><span class="game-avatar ${color}">${icon}</span><div><h3>${esc(t(name))}</h3><p>${esc(t(text))}</p></div>${tag(t('sourceStatus'))}</div>`).join('')}</section><section class="panel import-panel"><h2>${esc(t('importHeading'))}</h2><p>${esc(t('importDescription'))}</p><form id="import-form"><label class="field-label" for="import-url">${esc(t('importLabel'))}</label><div class="import-input-row"><input id="import-url" type="url" maxlength="4000" required placeholder="${esc(t('importPlaceholder'))}"><button class="btn btn-primary" type="submit">${esc(t('importAction'))}</button></div></form></section></div>`;
  }

  function renderHistory() {
    if (!state.publications.length) return `<section class="panel empty-state history-empty"><span class="empty-orbit" aria-hidden="true">↗</span><h2>${esc(t('emptyHistory'))}</h2><p>${esc(t('emptyHistoryText'))}</p>${button('back-topics', t('backTopics'), 'primary')}</section>`;
    return `<div class="history-list">${[...state.publications].reverse().map(record => `<article class="panel history-card"><div class="section-heading"><span class="eyebrow">${esc(record.game)}</span>${tag(t('published'), 'status-published')}</div><h2>${esc(record.title)}</h2><time datetime="${esc(record.at)}">${esc(new Date(record.at).toLocaleString(state.language === 'zh' ? 'zh-TW' : 'en-US'))}</time><div class="draft-text">${esc(record.text)}</div><div class="history-footer"><span>${esc(t('historyImmutable'))}</span>${record.url ? `<a href="${esc(record.url)}" target="_blank" rel="noopener noreferrer">${esc(t('viewPost'))}</a>` : ''}</div></article>`).join('')}</div>`;
  }

  function renderSettings() {
    return `<div class="settings-grid"><section class="panel preference-panel"><span class="eyebrow">MAKE IT YOURS</span><h2>${esc(t('language'))}</h2><div class="segmented-control">${[['zh', '繁體中文'], ['en', 'English']].map(([language, label]) => `<button class="btn ${state.language === language ? 'btn-primary' : 'btn-subtle'}" data-language="${language}" aria-pressed="${state.language === language}">${label}</button>`).join('')}</div><h2>${esc(t('appearance'))}</h2><div class="segmented-control">${['dark', 'light'].map(theme => `<button class="btn ${state.theme === theme ? 'btn-primary' : 'btn-subtle'}" data-theme-option="${theme}" aria-pressed="${state.theme === theme}">${esc(t(theme))}</button>`).join('')}</div></section><section class="panel preference-panel voice-panel"><span class="eyebrow">YOUR VOICE</span><h2>${esc(t('voiceTitle'))}</h2><p>${esc(t('voiceDescription'))}</p></section><section class="panel preference-panel"><h2>${esc(t('workflowTitle'))}</h2><p>${esc(t('workflowDescription'))}</p></section><section class="panel preference-panel"><h2>${esc(t('storageTitle'))}</h2><p>${esc(t('storageDescription'))}</p>${button('reset', t('actions.reset'))}</section></div>`;
  }

  function changeView(view) { state.view = view; publishOpen = false; render(); }
  function language(value) { state.language = value; publishOpen = false; render(); }
  function reset() { try { localStorage.removeItem(STORAGE_KEY); } catch {} state = fresh(); query = ''; filter = 'all'; publishOpen = false; render(); toast(t('resetConfirm')); }
  async function action(name) {
    if (name === 'reset') return reset();
    if (name === 'back-topics') return changeView('topics');
    const topic = currentTopic(), draft = currentDraft();
    if (name === 'copy') {
      try { await navigator.clipboard.writeText(savedText(draft)); toast(t('copied')); }
      catch { toast(t('copyFail')); }
      return;
    }
    if (name === 'cancel-publish') { publishOpen = false; render(); return; }
    if (name === 'regenerate') {
      const list = versions(topic), number = Math.max(...list.map(version => version.number)) + 1;
      for (const style of ['info', 'roast', 'discussion']) list.push({ id: uid(), style, number, text: { zh: COPY.zh.newSuffix + topic.drafts[style][0], en: COPY.en.newSuffix + topic.drafts[style][1] }, locked: false, status: 'pending', evidence: structuredClone(draft.evidence) });
      render(); toast(t('generatedNote')); return;
    }
    if (publication(topic)) { toast(t('publishedNote')); return; }
    if (name === 'edit') {
      if (!draft.locked) { draft.content = savedText(draft); draft.buffer = draft.content; draft.contentLanguage = state.language; draft.locked = true; }
      persist(); render(); $('draft-editor')?.focus(); return;
    }
    if (name === 'save') {
      if (draft.locked) { draft.content = draft.buffer; if (draft.status === 'approved') draft.status = 'pending'; }
      render(); toast(t('saved')); return;
    }
    if (name === 'approve' || name === 'publish') {
      if (hasUnsaved(draft)) { toast(t('saveFirst')); return; }
      if (!savedText(draft).trim()) { toast(t('emptyDraft')); return; }
      if (weightedLength(savedText(draft)) > 280) { toast(t('tooLong')); return; }
    }
    if (name === 'approve') {
      for (const version of versions(topic)) if (version.status === 'approved') version.status = 'pending';
      draft.approvedText = savedText(draft);
      draft.status = 'approved'; render(); toast(t('approveNote')); return;
    }
    if (name === 'reject') { draft.status = 'rejected'; render(); toast(t('rejectNote')); return; }
    if (name === 'publish') {
      if (draft.status !== 'approved') { toast(t('approveFirst')); return; }
      publishOpen = true; render(); $('published-text')?.focus();
    }
  }

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-view]');
    if (nav) { changeView(nav.dataset.view); return; }
    const card = event.target.closest('[data-topic]');
    if (card) { state.selectedTopic = card.dataset.topic; publishOpen = false; render(); return; }
    const style = event.target.closest('[data-style]');
    if (style) {
      const list = versions(currentTopic());
      state.selectedVersions[currentTopic().id] = [...list].reverse().find(version => version.style === style.dataset.style).id;
      publishOpen = false; render(); return;
    }
    const lang = event.target.closest('[data-language]');
    if (lang) { language(lang.dataset.language); return; }
    const theme = event.target.closest('[data-theme-option]');
    if (theme) { state.theme = theme.dataset.themeOption; render(); return; }
    const control = event.target.closest('[data-action]');
    if (control) { event.preventDefault(); action(control.dataset.action); }
  });
  $('language-toggle')?.addEventListener('click', () => language(state.language === 'zh' ? 'en' : 'zh'));
  $('demo-reset')?.addEventListener('click', reset);
  $('search-input')?.addEventListener('input', event => { query = event.target.value; if (state.view === 'topics') $('view-content').innerHTML = renderTopics(); });
  $('source-filter')?.addEventListener('change', event => { filter = event.target.value; render(); });
  document.addEventListener('change', event => {
    if (event.target.id === 'draft-version') { state.selectedVersions[currentTopic().id] = event.target.value; publishOpen = false; render(); }
  });
  document.addEventListener('input', event => {
    if (event.target.id !== 'draft-editor') return;
    const draft = currentDraft();
    if (!draft.locked || publication(currentTopic())) return;
    draft.buffer = event.target.value;
    persist();
    const counter = $('draft-counter');
    counter.textContent = `${weightedLength(draft.buffer)} / 280 ${t('estimated')}`;
    counter.classList.toggle('over-limit', weightedLength(draft.buffer) > 280);
    $('unsaved-note').textContent = hasUnsaved(draft) ? t('unsaved') : '';
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'import-form') {
      event.preventDefault();
      try {
        const url = new URL($('import-url').value);
        const ids = url.searchParams.getAll('comment_id');
        if (url.protocol !== 'https:' || url.hostname !== 'api.xiaoheihe.cn' || url.port || url.username || url.password || url.pathname !== '/bbs/app/comment/share/page' || ids.length !== 1 || !/^[1-9]\d{0,19}$/.test(ids[0])) throw new Error();
        const canonical = `https://api.xiaoheihe.cn/bbs/app/comment/share/page?comment_id=${ids[0]}`;
        if (state.imports.some(item => item.url === canonical)) { toast(t('importDuplicate')); return; }
        state.imports.push({ id: `import-${ids[0]}`, url: canonical }); render(); toast(t('importDone'));
      } catch { toast(t('importBad')); }
    }
    if (event.target.id === 'publish-form') {
      event.preventDefault();
      const topic = currentTopic(), draft = currentDraft(), text = $('published-text').value.trim(), date = new Date($('published-date').value), raw = $('published-url').value.trim();
      if (publication(topic)) { toast(t('publishedNote')); return; }
      if (draft.status !== 'approved' || hasUnsaved(draft)) { toast(t('saveFirst')); return; }
      if (!text) { toast(t('emptyDraft')); return; }
      if (weightedLength(text) > 280) { toast(t('tooLong')); return; }
      if (Number.isNaN(date.getTime())) { toast(t('badDate')); return; }
      let url = '';
      if (raw) {
        try { const parsed = new URL(raw); if (parsed.protocol !== 'https:' || !['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(parsed.hostname) || parsed.username || parsed.password || parsed.port) throw new Error(); url = parsed.href; }
        catch { toast(t('badUrl')); return; }
      }
      state.publications.push({ id: uid(), topicId: topic.id, draftId: draft.id, game: topic.game, title: loc(topic.title), text, at: date.toISOString(), url, evidence: structuredClone(draft.evidence) });
      draft.status = 'published'; publishOpen = false; render(); toast(t('registered'));
    }
  });
  window.GameTrendDemo = { weightedLength, getState: () => structuredClone(state), storageKey: STORAGE_KEY };
  render();
})();
