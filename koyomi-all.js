// ============================================================
// こよみ 七十二候 — 全ロジック1ファイル版
// data + engine + particles + sound(synth) + app
// 音はWeb Audioで合成。外部ファイル一切不要。
// ============================================================

// ===================== data.js =====================
// ============================================================
// 七十二候 — 全データ内蔵（バックエンド不要）
// k: 候名 / y: 読み / m,d: 開始日(概算・年により±1日) / s: 節気index
// p: 粒子 / snd: 環境音 / hana: 候の花 / shun: 旬の味 / t: 解説
// ============================================================

const SEKKI = [
  { n: '立春', y: 'りっしゅん', c: ['#0d1b2a', '#1b3a4b', '#88b3c4'],
    t: '暦の上で春がはじまる日。寒さの底で、光だけが先に春になる。' },
  { n: '雨水', y: 'うすい', c: ['#141f29', '#2c4a44', '#9ec3a8'],
    t: '雪が雨に変わり、氷がとけて水になる頃。農耕の支度をはじめる目安。' },
  { n: '啓蟄', y: 'けいちつ', c: ['#171f14', '#3a4d2e', '#b6c98a'],
    t: '土の中の虫が目覚める頃。「啓」はひらく、「蟄」は冬ごもりの虫。' },
  { n: '春分', y: 'しゅんぶん', c: ['#241b28', '#5d3a52', '#e8b4c8'],
    t: '昼と夜の長さがほぼ等しくなる日。自然をたたえ、生き物をいつくしむ。' },
  { n: '清明', y: 'せいめい', c: ['#16222c', '#3e5c6e', '#aacde0'],
    t: '万物が清らかで生き生きとする頃。「清浄明潔」を略したことば。' },
  { n: '穀雨', y: 'こくう', c: ['#17211c', '#34514a', '#8fb5a3'],
    t: '穀物をうるおす春の雨が降る頃。種まきの好機とされた。' },
  { n: '立夏', y: 'りっか', c: ['#101c12', '#2c5234', '#9ed27f'],
    t: '暦の上で夏がはじまる。新緑がかがやき、風が夏のにおいになる。' },
  { n: '小満', y: 'しょうまん', c: ['#142218', '#2f5c3a', '#cfe08a'],
    t: 'あらゆる命が満ちはじめる頃。麦の穂が育ち、ひと安心する時期。' },
  { n: '芒種', y: 'ぼうしゅ', c: ['#0c161e', '#1f3b4d', '#7fa8c9'],
    t: '芒（のぎ）のある穀物、稲や麦の種をまく頃。梅雨入りも近い。' },
  { n: '夏至', y: 'げし', c: ['#0a1222', '#1d2f5e', '#7d9be0'],
    t: '一年でもっとも昼が長い日。ここから夏の盛りへ向かう。' },
  { n: '小暑', y: 'しょうしょ', c: ['#0f1d2b', '#1f4a6e', '#8fc6e8'],
    t: '梅雨が明け、本格的な暑さがはじまる頃。暑中見舞いの季節。' },
  { n: '大暑', y: 'たいしょ', c: ['#1a1410', '#4a2c1a', '#ff9d5c'],
    t: '一年でもっとも暑い頃。打ち水や風鈴、涼の工夫が生きる。' },
  { n: '立秋', y: 'りっしゅう', c: ['#121826', '#2d3a55', '#c9a0c4'],
    t: '暦の上で秋がはじまる。残暑の中に、秋の気配を探す頃。' },
  { n: '処暑', y: 'しょしょ', c: ['#181622', '#3d3450', '#d9a86c'],
    t: '暑さが峠を越えて、朝夕に涼しさが宿る頃。台風の季節でもある。' },
  { n: '白露', y: 'はくろ', c: ['#121a22', '#2c4150', '#cfd8df'],
    t: '草花に朝露が宿り、白く光る頃。秋が本格的に訪れる。' },
  { n: '秋分', y: 'しゅうぶん', c: ['#1a1410', '#4a3220', '#e0b070'],
    t: '昼と夜の長さがほぼ等しくなる日。祖先をうやまい、故人をしのぶ。' },
  { n: '寒露', y: 'かんろ', c: ['#141020', '#3a2c4a', '#c0a0d8'],
    t: '草木に冷たい露がむすぶ頃。秋の長雨が終わり、空気が澄む。' },
  { n: '霜降', y: 'そうこう', c: ['#1e1410', '#5a2c1a', '#e07040'],
    t: '朝晩の冷え込みで霜が降りはじめる頃。紅葉が里へ降りてくる。' },
  { n: '立冬', y: 'りっとう', c: ['#10141c', '#26303f', '#8a9bb0'],
    t: '暦の上で冬がはじまる。木枯らしが吹き、冬支度の頃。' },
  { n: '小雪', y: 'しょうせつ', c: ['#0e121a', '#222d3d', '#aab8c9'],
    t: 'わずかに雪が降りはじめる頃。陽射しが弱まり、冷えこみが進む。' },
  { n: '大雪', y: 'たいせつ', c: ['#0a0e16', '#1a2433', '#d8e2ec'],
    t: '山々が雪をかぶり、平地にも雪が降る頃。動物たちも冬ごもり。' },
  { n: '冬至', y: 'とうじ', c: ['#0a0a16', '#1c1c3a', '#9090d0'],
    t: '一年でもっとも夜が長い日。柚子湯に入り、運の上昇を願う。' },
  { n: '小寒', y: 'しょうかん', c: ['#0c1218', '#1e2e3a', '#a8c8d8'],
    t: '「寒の入り」。ここから節分までが一年でもっとも寒い「寒の内」。' },
  { n: '大寒', y: 'だいかん', c: ['#081018', '#142838', '#c8e0f0'],
    t: '寒さの極み。この寒気を使って、味噌や酒の仕込みがはじまる。' },
];

const KO = [
  // ---- 立春 ----
  { k: '東風解凍', y: 'はるかぜこおりをとく', m: 2, d: 4, s: 0, p: 'snow', snd: 'stream',
    hana: '梅', shun: 'ふきのとう',
    t: '春の東風が吹き、川や湖の氷を解かしはじめる頃。' },
  { k: '黄鶯睍睆', y: 'うぐいすなく', m: 2, d: 9, s: 0, p: 'light', snd: 'birds',
    hana: '椿', shun: '公魚（わかさぎ）',
    t: '山里でうぐいすが「ホーホケキョ」と鳴きはじめる頃。' },
  { k: '魚上氷', y: 'うおこおりをいずる', m: 2, d: 14, s: 0, p: 'light', snd: 'stream',
    hana: '福寿草', shun: '蛤（はまぐり）',
    t: '割れた氷の間から、魚が跳ねあがる頃。' },
  // ---- 雨水 ----
  { k: '土脉潤起', y: 'つちのしょううるおいおこる', m: 2, d: 19, s: 1, p: 'rain', snd: 'rain',
    hana: '猫柳', shun: '春菊',
    t: '冷たい雨が温かい春の雨へ変わり、大地が潤いはじめる頃。' },
  { k: '霞始靆', y: 'かすみはじめてたなびく', m: 2, d: 24, s: 1, p: 'mist', snd: 'wind_soft',
    hana: '沈丁花', shun: '鰆（さわら）',
    t: '春霞が野山にたなびき、景色がやわらかく見える頃。' },
  { k: '草木萌動', y: 'そうもくめばえいずる', m: 3, d: 1, s: 1, p: 'light', snd: 'birds',
    hana: '菜の花', shun: '蕗（ふき）',
    t: '足元の草や木の芽が、いっせいに萌え出す頃。' },
  // ---- 啓蟄 ----
  { k: '蟄虫啓戸', y: 'すごもりむしとをひらく', m: 3, d: 5, s: 2, p: 'light', snd: 'birds',
    hana: '木蓮', shun: '浅蜊（あさり）',
    t: '冬ごもりしていた虫たちが、戸を開けて顔を出す頃。' },
  { k: '桃始笑', y: 'ももはじめてさく', m: 3, d: 10, s: 2, p: 'petals', snd: 'birds',
    hana: '桃', shun: '鰊（にしん）',
    t: '桃のつぼみがほころぶ頃。「笑う」は「咲く」の古いことば。' },
  { k: '菜虫化蝶', y: 'なむしちょうとなる', m: 3, d: 15, s: 2, p: 'light', snd: 'wind_soft',
    hana: '菫（すみれ）', shun: '新玉葱',
    t: '青虫がさなぎから羽化し、紋白蝶になる頃。' },
  // ---- 春分 ----
  { k: '雀始巣', y: 'すずめはじめてすくう', m: 3, d: 20, s: 3, p: 'light', snd: 'birds',
    hana: '雪柳', shun: '桜鯛',
    t: '雀が枯れ草や羽毛を集め、巣をつくりはじめる頃。' },
  { k: '桜始開', y: 'さくらはじめてひらく', m: 3, d: 25, s: 3, p: 'petals', snd: 'wind_soft',
    hana: '桜', shun: '桜餅',
    t: 'その春はじめての桜が、ほころびはじめる頃。' },
  { k: '雷乃発声', y: 'かみなりすなわちこえをはっす', m: 3, d: 30, s: 3, p: 'rain', snd: 'storm',
    hana: '山吹', shun: '飯蛸（いいだこ）',
    t: '遠くの空で春雷が鳴りはじめる頃。恵みの雨を呼ぶ。' },
  // ---- 清明 ----
  { k: '玄鳥至', y: 'つばめきたる', m: 4, d: 4, s: 4, p: 'light', snd: 'birds',
    hana: '蒲公英（たんぽぽ）', shun: '新若布（わかめ）',
    t: '海を渡って、燕が南からやってくる頃。' },
  { k: '鴻雁北', y: 'こうがんかえる', m: 4, d: 9, s: 4, p: 'mist', snd: 'wind_soft',
    hana: '山桜', shun: '筍（たけのこ）',
    t: '冬を越した雁が、北のシベリアへ帰ってゆく頃。' },
  { k: '虹始見', y: 'にじはじめてあらわる', m: 4, d: 14, s: 4, p: 'light', snd: 'stream',
    hana: '藤', shun: '桜海老',
    t: '雨上がりの空に、その年はじめての虹がかかる頃。' },
  // ---- 穀雨 ----
  { k: '葭始生', y: 'あしはじめてしょうず', m: 4, d: 20, s: 5, p: 'light', snd: 'stream',
    hana: '躑躅（つつじ）', shun: '蕨（わらび）',
    t: '水辺の葦が、芽を吹きはじめる頃。' },
  { k: '霜止出苗', y: 'しもやみてなえいずる', m: 4, d: 25, s: 5, p: 'mist', snd: 'stream',
    hana: '鈴蘭', shun: '鯵（あじ）',
    t: '霜が降りなくなり、稲の苗がすくすく育つ頃。' },
  { k: '牡丹華', y: 'ぼたんはなさく', m: 4, d: 30, s: 5, p: 'petals', snd: 'birds',
    hana: '牡丹', shun: '新茶',
    t: '百花の王・牡丹が、大輪の花を咲かせる頃。八十八夜もこの頃。' },
  // ---- 立夏 ----
  { k: '蛙始鳴', y: 'かわずはじめてなく', m: 5, d: 5, s: 6, p: 'rain', snd: 'frogs',
    hana: '杜若（かきつばた）', shun: '初鰹',
    t: '野原や田んぼで、蛙が鳴きはじめる頃。' },
  { k: '蚯蚓出', y: 'みみずいずる', m: 5, d: 10, s: 6, p: 'light', snd: 'stream',
    hana: '薔薇', shun: '蚕豆（そらまめ）',
    t: '土の中から蚯蚓が出てきて、大地を耕してくれる頃。' },
  { k: '竹笋生', y: 'たけのこしょうず', m: 5, d: 15, s: 6, p: 'light', snd: 'birds',
    hana: '卯の花', shun: '鱚（きす）',
    t: 'たけのこが、ひょっこりと顔を出す頃。' },
  // ---- 小満 ----
  { k: '蚕起食桑', y: 'かいこおきてくわをはむ', m: 5, d: 21, s: 7, p: 'light', snd: 'wind_soft',
    hana: '芍薬', shun: '苺',
    t: '蚕が桑の葉を盛んに食べ、育ってゆく頃。' },
  { k: '紅花栄', y: 'べにばなさかう', m: 5, d: 26, s: 7, p: 'petals', snd: 'birds',
    hana: '紅花', shun: '新生姜',
    t: '紅の染料となる紅花が、あたり一面に咲く頃。' },
  { k: '麦秋至', y: 'むぎのときいたる', m: 5, d: 31, s: 7, p: 'light', snd: 'wind_soft',
    hana: '麦の穂', shun: '枇杷（びわ）',
    t: '麦が金色に実り、収穫を迎える頃。麦にとっての「秋」。' },
  // ---- 芒種 ----
  { k: '螳螂生', y: 'かまきりしょうず', m: 6, d: 6, s: 8, p: 'light', snd: 'stream',
    hana: '紫陽花', shun: '鮎（あゆ）',
    t: '秋に生みつけられた卵から、かまきりが生まれる頃。' },
  { k: '腐草為螢', y: 'くされたるくさほたるとなる', m: 6, d: 11, s: 8, p: 'fireflies', snd: 'stream',
    hana: '梔子（くちなし）', shun: '梅の実',
    t: '蒸れた草の下から、蛍がふわりと舞いはじめる頃。昔の人は、朽ちた草が蛍に生まれ変わると考えた。' },
  { k: '梅子黄', y: 'うめのみきばむ', m: 6, d: 16, s: 8, p: 'rain', snd: 'rain',
    hana: '花菖蒲', shun: '杏（あんず）',
    t: '梅の実が熟して、黄色く色づく頃。梅雨の語源とも。' },
  // ---- 夏至 ----
  { k: '乃東枯', y: 'なつかれくさかるる', m: 6, d: 21, s: 9, p: 'light', snd: 'frogs',
    hana: '夏椿（沙羅）', shun: '茗荷（みょうが）',
    t: '夏枯草（うつぼぐさ）が黒ずみ、枯れたように見える頃。' },
  { k: '菖蒲華', y: 'あやめはなさく', m: 6, d: 26, s: 9, p: 'petals', snd: 'stream',
    hana: '菖蒲（あやめ）', shun: '鰯（いわし）',
    t: 'あやめが咲き、本格的な夏の訪れを告げる頃。' },
  { k: '半夏生', y: 'はんげしょうず', m: 7, d: 1, s: 9, p: 'rain', snd: 'rain',
    hana: '半夏（烏柄杓）', shun: '蛸（たこ）',
    t: '半夏が生える頃。田植えを終え、関西では蛸を食べる風習も。' },
  // ---- 小暑 ----
  { k: '温風至', y: 'あつかぜいたる', m: 7, d: 7, s: 10, p: 'light', snd: 'semi',
    hana: '朝顔', shun: '鰻（うなぎ）',
    t: '梅雨明けの熱い風が、吹きはじめる頃。七夕もこの日。' },
  { k: '蓮始開', y: 'はすはじめてひらく', m: 7, d: 12, s: 10, p: 'petals', snd: 'stream',
    hana: '蓮', shun: '素麺（そうめん）',
    t: '夜明けとともに、蓮の花が静かに開きはじめる頃。' },
  { k: '鷹乃学習', y: 'たかすなわちわざをならう', m: 7, d: 17, s: 10, p: 'light', snd: 'wind_soft',
    hana: '凌霄花（のうぜんかずら）', shun: '鱧（はも）',
    t: '鷹のひなが、飛び方や狩りを覚える頃。' },
  // ---- 大暑 ----
  { k: '桐始結花', y: 'きりはじめてはなをむすぶ', m: 7, d: 22, s: 11, p: 'petals', snd: 'semi',
    hana: '桐', shun: '西瓜（すいか）',
    t: '桐が梢高く、薄紫の花を咲かせる頃。' },
  { k: '土潤溽暑', y: 'つちうるおうてむしあつし', m: 7, d: 28, s: 11, p: 'mist', snd: 'semi',
    hana: '百日紅（さるすべり）', shun: '茄子',
    t: '大地が湿り気を帯び、蒸し暑さが増す頃。' },
  { k: '大雨時行', y: 'たいうときどきにふる', m: 8, d: 2, s: 11, p: 'rain', snd: 'storm',
    hana: '向日葵', shun: '鮑（あわび）',
    t: '入道雲がわき、夕立や雷雨が激しく降る頃。' },
  // ---- 立秋 ----
  { k: '涼風至', y: 'すずかぜいたる', m: 8, d: 7, s: 12, p: 'light', snd: 'furin',
    hana: '撫子', shun: '桃',
    t: '暑さの中に、ふと涼しい風が立ちはじめる頃。' },
  { k: '寒蝉鳴', y: 'ひぐらしなく', m: 8, d: 12, s: 12, p: 'stars', snd: 'higurashi',
    hana: '木槿（むくげ）', shun: '葡萄',
    t: '夕暮れに、ひぐらしがカナカナと鳴く頃。' },
  { k: '蒙霧升降', y: 'ふかききりまとう', m: 8, d: 17, s: 12, p: 'mist', snd: 'wind_soft',
    hana: '芙蓉', shun: '無花果（いちじく）',
    t: '朝夕、白く深い霧が立ちこめる頃。' },
  // ---- 処暑 ----
  { k: '綿柎開', y: 'わたのはなしべひらく', m: 8, d: 23, s: 13, p: 'light', snd: 'insects',
    hana: '綿花', shun: '梨',
    t: '綿の実を包む萼が開き、白い綿花が顔を出す頃。' },
  { k: '天地始粛', y: 'てんちはじめてさむし', m: 8, d: 28, s: 13, p: 'stars', snd: 'insects',
    hana: '萩', shun: '秋茄子',
    t: 'ようやく暑さが鎮まり、天地が静まりはじめる頃。' },
  { k: '禾乃登', y: 'こくものすなわちみのる', m: 9, d: 2, s: 13, p: 'light', snd: 'insects',
    hana: '稲穂', shun: '新米',
    t: '田の稲が実り、穂を垂らしはじめる頃。' },
  // ---- 白露 ----
  { k: '草露白', y: 'くさのつゆしろし', m: 9, d: 7, s: 14, p: 'light', snd: 'insects',
    hana: '桔梗', shun: '秋刀魚（さんま）',
    t: '草の葉に降りた朝露が、白く光って見える頃。' },
  { k: '鶺鴒鳴', y: 'せきれいなく', m: 9, d: 12, s: 14, p: 'light', snd: 'birds',
    hana: '彼岸花', shun: '里芋',
    t: '水辺で鶺鴒が、尾を上下に振りながら鳴く頃。' },
  { k: '玄鳥去', y: 'つばめさる', m: 9, d: 17, s: 14, p: 'mist', snd: 'wind_soft',
    hana: '葛の花', shun: '栗',
    t: '春に来た燕が、南の国へ帰ってゆく頃。' },
  // ---- 秋分 ----
  { k: '雷乃収声', y: 'かみなりすなわちこえをおさむ', m: 9, d: 22, s: 15, p: 'stars', snd: 'insects',
    hana: '金木犀', shun: '銀杏（ぎんなん）',
    t: '夏の雷が鳴りやみ、空が高くなる頃。' },
  { k: '蟄虫坏戸', y: 'むしかくれてとをふさぐ', m: 9, d: 28, s: 15, p: 'leaves', snd: 'insects',
    hana: '竜胆（りんどう）', shun: '松茸',
    t: '虫たちが土にもぐり、冬ごもりの支度をはじめる頃。' },
  { k: '水始涸', y: 'みずはじめてかるる', m: 10, d: 3, s: 15, p: 'light', snd: 'wind_soft',
    hana: '秋桜（コスモス）', shun: '柿',
    t: '田の水を抜き、稲刈りの支度をはじめる頃。' },
  // ---- 寒露 ----
  { k: '鴻雁来', y: 'こうがんきたる', m: 10, d: 8, s: 16, p: 'mist', snd: 'wind_soft',
    hana: '藤袴', shun: '鯖（さば）',
    t: '雁が北から、列をなして渡ってくる頃。' },
  { k: '菊花開', y: 'きくのはなひらく', m: 10, d: 13, s: 16, p: 'petals', snd: 'insects',
    hana: '菊', shun: '林檎',
    t: '菊の花が咲きはじめる頃。重陽の節句のころ。' },
  { k: '蟋蟀在戸', y: 'きりぎりすとにあり', m: 10, d: 18, s: 16, p: 'stars', snd: 'insects',
    hana: '紫式部（実）', shun: '太刀魚',
    t: '戸口で、こおろぎが鳴く頃。秋の夜長の音色。' },
  // ---- 霜降 ----
  { k: '霜始降', y: 'しもはじめてふる', m: 10, d: 23, s: 17, p: 'snow', snd: 'wind_winter',
    hana: '茶の花', shun: '新蕎麦',
    t: '山里に、はじめて霜が降りる頃。' },
  { k: '霎時施', y: 'こさめときどきふる', m: 10, d: 28, s: 17, p: 'rain', snd: 'rain',
    hana: '石蕗（つわぶき）', shun: '蓮根',
    t: 'ぱらぱらと、時雨が通り過ぎてゆく頃。' },
  { k: '楓蔦黄', y: 'もみじつたきばむ', m: 11, d: 2, s: 17, p: 'leaves', snd: 'wind_soft',
    hana: '紅葉', shun: '牡蠣（かき）',
    t: 'もみじや蔦が、鮮やかに色づく頃。' },
  // ---- 立冬 ----
  { k: '山茶始開', y: 'つばきはじめてひらく', m: 11, d: 7, s: 18, p: 'petals', snd: 'wind_winter',
    hana: '山茶花', shun: '蜜柑',
    t: '山茶花が咲きはじめ、冬の訪れを告げる頃。' },
  { k: '地始凍', y: 'ちはじめてこおる', m: 11, d: 12, s: 18, p: 'snow', snd: 'wind_winter',
    hana: '枇杷の花', shun: '大根',
    t: '大地が凍りはじめ、霜柱が立つ頃。' },
  { k: '金盞香', y: 'きんせんかさく', m: 11, d: 17, s: 18, p: 'light', snd: 'wind_soft',
    hana: '水仙', shun: '葱（ねぎ）',
    t: '水仙が咲き、清らかに香る頃。「金盞」は水仙の異名。' },
  // ---- 小雪 ----
  { k: '虹蔵不見', y: 'にじかくれてみえず', m: 11, d: 22, s: 19, p: 'mist', snd: 'wind_winter',
    hana: '柊（ひいらぎ）', shun: '帆立',
    t: '日差しが弱まり、虹を見かけなくなる頃。' },
  { k: '朔風払葉', y: 'きたかぜこのはをはらう', m: 11, d: 27, s: 19, p: 'leaves', snd: 'wind_winter',
    hana: '寒椿', shun: '白菜',
    t: '北風が、木々の葉を払い落とす頃。' },
  { k: '橘始黄', y: 'たちばなはじめてきばむ', m: 12, d: 2, s: 19, p: 'light', snd: 'wind_soft',
    hana: '橘', shun: '河豚（ふぐ）',
    t: '橘の実が、黄色く色づきはじめる頃。' },
  // ---- 大雪 ----
  { k: '閉塞成冬', y: 'そらさむくふゆとなる', m: 12, d: 7, s: 20, p: 'snow', snd: 'snow',
    hana: '南天（実）', shun: '鰤（ぶり）',
    t: '空が重い雲に閉ざされ、本格的な冬となる頃。' },
  { k: '熊蟄穴', y: 'くまあなにこもる', m: 12, d: 12, s: 20, p: 'snow', snd: 'snow',
    hana: '葉牡丹', shun: '蕪（かぶ）',
    t: '熊が穴に入り、冬ごもりをはじめる頃。' },
  { k: '鱖魚群', y: 'さけのうおむらがる', m: 12, d: 16, s: 20, p: 'snow', snd: 'stream',
    hana: '千両（実）', shun: '鱈（たら）',
    t: '鮭が群れをなし、生まれた川を遡る頃。' },
  // ---- 冬至 ----
  { k: '乃東生', y: 'なつかれくさしょうず', m: 12, d: 21, s: 21, p: 'stars', snd: 'snow',
    hana: '柚子', shun: '南瓜（かぼちゃ）',
    t: '夏枯草が、ひっそりと芽を出す頃。冬至、一陽来復。柚子湯に入る日。' },
  { k: '麋角解', y: 'さわしかのつのおつる', m: 12, d: 26, s: 21, p: 'snow', snd: 'snow',
    hana: '侘助（椿）', shun: '金目鯛',
    t: '大鹿の角が落ち、生え変わる頃。' },
  { k: '雪下出麦', y: 'ゆきわたりてむぎのびる', m: 12, d: 31, s: 21, p: 'snow', snd: 'snow',
    hana: '寒菊', shun: '黒豆',
    t: '降り積もる雪の下で、麦が静かに芽を伸ばす頃。年の瀬から正月へ。' },
  // ---- 小寒 ----
  { k: '芹乃栄', y: 'せりすなわちさかう', m: 1, d: 5, s: 22, p: 'light', snd: 'stream',
    hana: '芹', shun: '七草粥',
    t: '冷たい沢辺で、芹が青々と育つ頃。春の七草のひとつ。' },
  { k: '水泉動', y: 'しみずあたたかをふくむ', m: 1, d: 10, s: 22, p: 'light', snd: 'stream',
    hana: '蝋梅（ろうばい）', shun: '小松菜',
    t: '地中で凍っていた泉が、かすかに動きはじめる頃。' },
  { k: '雉始雊', y: 'きじはじめてなく', m: 1, d: 15, s: 22, p: 'snow', snd: 'wind_winter',
    hana: '寒牡丹', shun: '鮟鱇（あんこう）',
    t: '雉の雄が、雌を求めて鳴きはじめる頃。' },
  // ---- 大寒 ----
  { k: '款冬華', y: 'ふきのはなさく', m: 1, d: 20, s: 23, p: 'snow', snd: 'snow',
    hana: '蕗の薹', shun: '金柑',
    t: '雪の下から、ふきのとうが顔を出す頃。' },
  { k: '水沢腹堅', y: 'さわみずこおりつめる', m: 1, d: 25, s: 23, p: 'stars', snd: 'snow',
    hana: '寒紅梅', shun: '寒蜆（しじみ）',
    t: '沢の水が厚く凍りつめる、一年でもっとも寒い頃。' },
  { k: '鶏始乳', y: 'にわとりはじめてとやにつく', m: 1, d: 30, s: 23, p: 'light', snd: 'birds',
    hana: '節分草', shun: '福豆',
    t: '鶏が春の気配を感じ、卵を産みはじめる頃。節分、そして春へ。' },
];

// 漢数字
const KAN = ['一','二','三','四','五','六','七','八','九'];
function kanjiNum(n) {
  if (n <= 9) return KAN[n - 1];
  if (n === 10) return '十';
  if (n < 20) return '十' + KAN[n - 11];
  const t = Math.floor(n / 10), o = n % 10;
  return KAN[t - 1] + '十' + (o ? KAN[o - 1] : '');
}

// 今日がどの候かを計算（年またぎ対応）
function findCurrentIndex(now = new Date()) {
  const y = now.getFullYear();
  let best = 0, bestTime = -Infinity;
  KO.forEach((k, i) => {
    [y, y - 1].forEach((yy) => {
      const t = new Date(yy, k.m - 1, k.d).getTime();
      if (t <= now.getTime() && t > bestTime) { bestTime = t; best = i; }
    });
  });
  return best;
}

// 候の期間ラベル「6月11日 — 6月15日頃」
function rangeLabel(i) {
  const a = KO[i];
  const b = KO[(i + 1) % KO.length];
  const end = new Date(2025, b.m - 1, b.d);
  end.setDate(end.getDate() - 1);
  return `${a.m}月${a.d}日 — ${end.getMonth() + 1}月${end.getDate()}日頃`;
}

// ===================== engine.js =====================
// ============================================================
// engine.js — シード乱数・色・月齢・刻・日替わり構図
// RN版 prng.js / daily.js を Web(Canvas) 向けに移植
// ============================================================

// mulberry32
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const dateSeed = (d) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex([r, g, b]) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
const shade = (hex, f) => rgbToHex(hexToRgb(hex).map((v) => v * f));
const mix = (a, b, t) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => A[i] + (B[i] - A[i]) * t));
};

// 月齢
function moonPhase(date) {
  const synodic = 29.530588853 * 86400000;
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  let p = ((date.getTime() - ref) % synodic) / synodic;
  if (p < 0) p += 1;
  return p;
}
function moonName(p) {
  if (p < 0.04 || p > 0.96) return '新月';
  if (p < 0.16) return '三日月';
  if (p < 0.30) return '上弦の月';
  if (p < 0.46) return '十三夜';
  if (p < 0.54) return '満月';
  if (p < 0.66) return '十六夜';
  if (p < 0.84) return '下弦の月';
  return '有明の月';
}

// 刻
function timeInfo(d = new Date()) {
  const h = d.getHours();
  if (h < 3)  return { n: '夜半', tint: 'rgba(14,22,66,0.22)', day: false };
  if (h < 6)  return { n: '暁',   tint: 'rgba(255,128,88,0.10)', day: false };
  if (h < 10) return { n: '朝',   tint: 'rgba(255,214,158,0.08)', day: true };
  if (h < 15) return { n: '昼',   tint: 'rgba(255,250,235,0.05)', day: true };
  if (h < 18) return { n: '夕',   tint: 'rgba(224,108,128,0.13)', day: true };
  if (h < 22) return { n: '宵',   tint: 'rgba(66,76,168,0.13)', day: false };
  return { n: '夜半', tint: 'rgba(14,22,66,0.22)', day: false };
}

const GOLD = '#d9b667', GOLD_DEEP = '#a8822f';

// 日替わり構図（W,Hは描画時の実ピクセル）
function buildScene({ baseDate, sessionSeed, sekki, now, W, H }) {
  const dSeed = dateSeed(baseDate);
  const R = mulberry32(dSeed);
  const M = mulberry32(((sessionSeed ^ (dSeed * 2654435761)) >>> 0));
  const tod = timeInfo(now);
  const [c0, c1] = sekki.c;

  const sky = {
    top: shade(c0, 0.55 + R() * 0.3),
    mid: shade(mix(c0, c1, 0.6), 0.85 + R() * 0.3),
    bottom: shade(c1, 0.9 + R() * 0.4),
  };

  const phase = moonPhase(baseDate);
  const cel = {
    type: tod.day ? 'sun' : 'moon',
    x: W * (0.5 + R() * 0.38), y: H * (0.1 + R() * 0.14),
    r: (24 + R() * 26) * (W / 390), haloK: 2.6 + M() * 1.2,
    phase, color: tod.day ? '#f3dc9e' : '#f2ead2',
  };

  const clouds = Array.from({ length: 2 + Math.floor(R() * 4) }, () => ({
    cx: W * R(), cy: H * (0.05 + R() * 0.3),
    rx: (70 + R() * 170) * (W / 390), ry: (18 + R() * 42) * (W / 390),
    fill: shade(c0, 0.45 + R() * 0.3), o: 0.18 + R() * 0.25, dx: (M() - 0.5) * 24,
  }));

  const splashes = Array.from({ length: 1 + Math.floor(R() * 2) }, () => {
    const cx = W * (0.12 + R() * 0.76), cy = H * (0.06 + R() * 0.34);
    const rot = (R() * 180 + (M() - 0.5) * 10) * Math.PI / 180;
    return Array.from({ length: 3 }, (_, j) => ({
      cx: cx + (R() - 0.5) * 60, cy: cy + (R() - 0.5) * 36,
      rx: (60 + R() * 120) * (W / 390), ry: (8 + R() * 22) * (W / 390),
      rot: rot + j * (8 + R() * 14) * Math.PI / 180,
      o: 0.05 + R() * 0.09, fill: j === 1 ? GOLD : GOLD_DEEP,
    }));
  }).flat();

  const ridgeN = 2 + Math.floor(R() * 3);
  const ridges = Array.from({ length: ridgeN }, (_, i) => {
    const baseY = H * (0.52 + i * (0.34 / ridgeN) + R() * 0.05);
    const jag = (14 + R() * 55) * (H / 844);
    const segs = 6 + Math.floor(R() * 4);
    const pts = [];
    for (let s = 0; s <= segs; s++) pts.push([(W / segs) * s, baseY + (R() - 0.5) * 2 * jag]);
    return { pts, fill: shade(mix(c0, '#000000', 0.25), 0.95 - i * 0.22), o: 0.92 };
  });

  const hasWater = R() < 0.55;
  const water = hasWater ? {
    y: H * (0.8 + R() * 0.07), fill: shade(c0, 0.5),
    lines: Array.from({ length: 7 + Math.floor(R() * 8) }, () => ({
      x: W * R(), y: H * (0.82 + R() * 0.16), w: (14 + R() * 90) * (W / 390),
      o: 0.08 + R() * 0.3, gold: R() < 0.45,
    })),
  } : null;

  const flecks = Array.from({ length: 36 + Math.floor(R() * 44) }, () => ({
    x: W * R() + (M() - 0.5) * 36, y: H * R() * 0.72 + (M() - 0.5) * 24,
    r: (0.8 + R() * 2.2) * (W / 390), o: 0.22 + M() * 0.6,
  }));

  const grain = Array.from({ length: 46 }, () => ({
    x: W * R(), y: H * R(), r: (0.5 + R() * 1.1) * (W / 390), o: 0.02 + R() * 0.04,
  }));

  return { W, H, sky, cel, clouds, splashes, ridges, water, flecks, grain,
    vignette: 0.42 + R() * 0.22, tod };
}

// Canvasへ描画
function drawScene(ctx, spec) {
  const { W, H, sky, cel, clouds, splashes, ridges, water, flecks, grain, vignette } = spec;

  // 空
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, sky.top); g.addColorStop(0.55, sky.mid); g.addColorStop(1, sky.bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // 天体の暈
  const halo = ctx.createRadialGradient(cel.x, cel.y, 0, cel.x, cel.y, cel.r * cel.haloK);
  halo.addColorStop(0, cel.color + '80');
  halo.addColorStop(0.5, cel.color + '28');
  halo.addColorStop(1, cel.color + '00');
  ctx.fillStyle = halo;
  ctx.fillRect(cel.x - cel.r * cel.haloK, cel.y - cel.r * cel.haloK, cel.r * cel.haloK * 2, cel.r * cel.haloK * 2);

  // 天体本体
  ctx.globalAlpha = 0.96; ctx.fillStyle = cel.color;
  ctx.beginPath(); ctx.arc(cel.x, cel.y, cel.r, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // 月相の影
  if (cel.type === 'moon') {
    const illum = 1 - Math.abs(cel.phase - 0.5) * 2;
    if (illum < 0.97) {
      const waxing = cel.phase < 0.5;
      const dx = (1 - illum) * cel.r * 1.7 * (waxing ? -1 : 1);
      ctx.globalAlpha = 0.94; ctx.fillStyle = sky.top;
      ctx.beginPath(); ctx.arc(cel.x + dx, cel.y - cel.r * 0.08, cel.r * 1.02, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  const ellipse = (cx, cy, rx, ry, rot, fill, o) => {
    ctx.save(); ctx.globalAlpha = o; ctx.fillStyle = fill;
    ctx.translate(cx, cy); if (rot) ctx.rotate(rot);
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };
  clouds.forEach((c) => ellipse(c.cx + c.dx, c.cy, c.rx, c.ry, 0, c.fill, c.o));
  splashes.forEach((s) => ellipse(s.cx, s.cy, s.rx, s.ry, s.rot, s.fill, s.o));

  // 山稜
  ridges.forEach((r) => {
    ctx.globalAlpha = r.o; ctx.fillStyle = r.fill;
    ctx.beginPath(); ctx.moveTo(0, H);
    r.pts.forEach((p) => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  });
  ctx.globalAlpha = 1;

  // 水面
  if (water) {
    ctx.globalAlpha = 0.85; ctx.fillStyle = water.fill;
    ctx.fillRect(0, water.y, W, H - water.y);
    water.lines.forEach((l) => {
      ctx.globalAlpha = l.o; ctx.fillStyle = l.gold ? '#d9b667' : '#ffffff';
      ctx.fillRect(l.x, l.y, l.w, 1.3 * (W / 390));
    });
    ctx.globalAlpha = 1;
  }

  // 金箔の散り
  flecks.forEach((f) => {
    ctx.globalAlpha = f.o; ctx.fillStyle = '#e3c878';
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
  });
  // 和紙の粒
  grain.forEach((gg) => {
    ctx.globalAlpha = gg.o; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(gg.x, gg.y, gg.r, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;

  // 口縁の暗がり
  const vig = ctx.createRadialGradient(W / 2, H * 0.46, 0, W / 2, H * 0.46, Math.max(W, H) * 0.75);
  vig.addColorStop(0, '#00000000'); vig.addColorStop(0.72, '#00000000');
  vig.addColorStop(1, rgbToHex([0, 0, 0]) + Math.round(vignette * 255).toString(16).padStart(2, '0'));
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

  // 刻の色調
  ctx.fillStyle = spec.tod.tint; ctx.fillRect(0, 0, W, H);
}

// ===================== particles.js =====================
// ============================================================
// particles.js — 季節の粒子（Canvasアニメーション）
// fireflies/petals/rain/snow/leaves/mist/light/stars/golddust
// 風のひと吹き(gust)で横に流れる
// ============================================================

const COUNTS = { fireflies: 16, petals: 22, snow: 30, rain: 30, leaves: 16,
  mist: 6, light: 14, stars: 40, golddust: 10 };
const rnd = (a, b) => a + Math.random() * (b - a);

class ParticleSystem {
  constructor(type, accent, W, H) {
    this.type = type; this.accent = accent; this.W = W; this.H = H;
    this.gust = 0;            // -1..1 外から設定
    this.init();
  }
  resize(W, H) { this.W = W; this.H = H; this.init(); }
  init() {
    const { W, H } = this;
    const n = COUNTS[this.type] || 12;
    this.ps = Array.from({ length: n }, () => this.spawn());
    // golddustは常駐で別管理
    this.gold = Array.from({ length: COUNTS.golddust }, () => this.spawnGold());
  }
  spawn() {
    const { W, H } = this; const t = this.type;
    const base = { x: rnd(0, W), y: rnd(0, H), seed: rnd(0, 1000) };
    if (t === 'fireflies') return { ...base, vx: rnd(-8, 8), vy: rnd(-12, -3), g: rnd(0, 1), gs: rnd(0.6, 1.4) };
    if (t === 'rain') return { ...base, y: rnd(-H, H), spd: rnd(620, 1000), len: rnd(28, 48) };
    if (t === 'petals' || t === 'leaves') return { ...base, y: rnd(-H, H), spd: rnd(40, 95), sway: rnd(20, 60), rot: rnd(0, 6.28), vr: rnd(-2, 2), size: rnd(7, 14) };
    if (t === 'snow') return { ...base, y: rnd(-H, H), spd: rnd(28, 70), sway: rnd(12, 40), size: rnd(2.5, 6) };
    if (t === 'mist') return { ...base, y: rnd(H * 0.1, H * 0.9), w: rnd(W * 0.6, W * 1.2), h: rnd(40, 110), spd: rnd(6, 16), o: rnd(0.04, 0.1) };
    if (t === 'stars') return { ...base, size: rnd(1, 2.6), tw: rnd(0, 6.28), ts: rnd(1.5, 4) };
    return { ...base, y: rnd(0, H), spd: rnd(20, 55), size: rnd(2, 6), o: rnd(0.15, 0.5) }; // light
  }
  spawnGold() {
    const { W, H } = this;
    return { x: rnd(0, W), y: rnd(0, H), spd: rnd(14, 40), size: rnd(1.2, 3), o: rnd(0.2, 0.6), seed: rnd(0, 1000) };
  }
  step(ctx, dt, t) {
    const { W, H } = this; const gustX = this.gust * 30;
    const drawGold = (p) => {
      p.y -= p.spd * dt; if (p.y < -10) { p.y = H + 10; p.x = rnd(0, W); }
      ctx.globalAlpha = p.o * (0.6 + 0.4 * Math.sin(t * 0.002 + p.seed));
      ctx.fillStyle = '#e3c878';
      ctx.beginPath(); ctx.arc(p.x + gustX * 0.6, p.y, p.size, 0, 6.28); ctx.fill();
    };

    for (const p of this.ps) this.drawOne(ctx, p, dt, t, gustX);
    for (const p of this.gold) drawGold(p);
    ctx.globalAlpha = 1;
  }
  drawOne(ctx, p, dt, t, gustX) {
    const { W, H } = this; const type = this.type;
    if (type === 'fireflies') {
      p.x += (p.vx + gustX * 0.4) * dt; p.y += p.vy * dt;
      p.g += p.gs * dt * (Math.sin(t * 0.001 + p.seed) > 0 ? 1 : -1);
      if (p.g < 0) p.g = 0; if (p.g > 1) p.g = 1;
      if (p.y < -20 || p.x < -20 || p.x > W + 20) { Object.assign(p, this.spawn(), { y: H + 10 }); }
      const a = p.g;
      ctx.globalAlpha = a * 0.3; ctx.fillStyle = '#d8ff9a';
      ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 6.28); ctx.fill();
      ctx.globalAlpha = a; ctx.fillStyle = '#eaffb0';
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.28); ctx.fill();
    } else if (type === 'rain') {
      p.y += p.spd * dt; p.x += gustX * 0.3 * dt;
      if (p.y > H + 40) { p.y = -40; p.x = rnd(0, W); }
      ctx.globalAlpha = 0.4; ctx.strokeStyle = '#bcd6ea'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 3, p.y + p.len); ctx.stroke();
    } else if (type === 'petals' || type === 'leaves') {
      p.y += p.spd * dt; p.rot += p.vr * dt;
      const sx = Math.sin(t * 0.001 + p.seed) * p.sway;
      if (p.y > H + 30) { p.y = -30; p.x = rnd(0, W); }
      ctx.save(); ctx.globalAlpha = 0.85;
      ctx.translate(p.x + sx + gustX, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = this.accent;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size * (type === 'petals' ? 0.38 : 0.5), 0, 0, 6.28);
      ctx.fill(); ctx.restore();
    } else if (type === 'snow') {
      p.y += p.spd * dt;
      const sx = Math.sin(t * 0.0008 + p.seed) * p.sway;
      if (p.y > H + 20) { p.y = -20; p.x = rnd(0, W); }
      ctx.globalAlpha = 0.9; ctx.fillStyle = '#f2f7fc';
      ctx.beginPath(); ctx.arc(p.x + sx + gustX, p.y, p.size, 0, 6.28); ctx.fill();
    } else if (type === 'mist') {
      p.x += (p.spd + gustX) * dt * 0.4; if (p.x > W) p.x = -p.w;
      ctx.globalAlpha = p.o; ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.w / 2, p.h / 2, 0, 0, 6.28); ctx.fill();
    } else if (type === 'stars') {
      p.tw += p.ts * dt;
      ctx.globalAlpha = 0.3 + 0.6 * Math.abs(Math.sin(p.tw));
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.28); ctx.fill();
    } else { // light
      p.y -= p.spd * dt; if (p.y < -10) { p.y = H + 10; p.x = rnd(0, W); }
      ctx.globalAlpha = p.o; ctx.fillStyle = this.accent;
      ctx.beginPath(); ctx.arc(p.x + gustX * 0.5, p.y, p.size, 0, 6.28); ctx.fill();
    }
  }
}

// ===================== sound_synth.js =====================
// ============================================================
// sound_synth.js — Web Audioで季節の音をその場合成（音声ファイル不要）
// 川/雨/風/雪/小鳥/蛙/蝉/ひぐらし/虫/風鈴/夕立 を波形生成
// ファイルが一切要らないので、アップロードで壊れる心配がない
// ============================================================
const SOUND_NAMES = {
  stream: '川のせせらぎ', rain: '雨の音', storm: '夕立と遠雷',
  wind_soft: 'そよ風', wind_winter: '木枯らし', snow: '雪のしじま',
  birds: '小鳥のさえずり', frogs: '蛙の合唱', semi: '蝉しぐれ',
  higurashi: 'ひぐらし', insects: '虫の音', furin: '風鈴',
};

class SoundManager {
  constructor() {
    this.ctx = null; this.master = null; this.muted = false;
    this.key = null; this.nodes = []; this.timers = []; this.started = false;
    this.baseVol = 0.22;
  }
  unlock() {
    if (this.started) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.baseVol;
      this.master.connect(this.ctx.destination);
      this.started = true;
      if (this.key) this._build(this.key);
    } catch (e) {}
  }
  play(key) {
    if (key === this.key && this.started) return;
    this.key = key;
    if (this.started) this._fadeTo(key);
  }
  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : this.baseVol, this.ctx.currentTime, 0.3);
  }
  _clear() {
    this.timers.forEach((t) => clearInterval(t)); this.timers = [];
    this.nodes.forEach((n) => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) {} });
    this.nodes = [];
  }
  _fadeTo(key) {
    // 簡易：一旦消して作り直す（マスターで0.6秒フェード）
    if (this.master) this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    setTimeout(() => {
      this._clear(); this._build(key);
      if (this.master && !this.muted) this.master.gain.setTargetAtTime(this.baseVol, this.ctx.currentTime, 0.4);
    }, 500);
  }

  // ---- 音色生成ヘルパ ----
  _noise(dur) {
    const sr = this.ctx.sampleRate, len = sr * dur;
    const buf = this.ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    return src;
  }
  _bp(freq, q) { const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; return f; }
  _lp(freq) { const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq; return f; }
  _hp(freq) { const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = freq; return f; }
  _gain(v) { const g = this.ctx.createGain(); g.gain.value = v; return g; }

  _chain(...nodes) {
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]);
    nodes[nodes.length - 1].connect(this.master);
    nodes.forEach((n) => this.nodes.push(n));
    if (nodes[0].start) nodes[0].start();
    return nodes;
  }

  // 連続ノイズ系（川・雨・風・雪）
  _bed(filterFreq, q, gain, lfoRate, lfoDepth) {
    const n = this._noise(2), f = this._bp(filterFreq, q), g = this._gain(gain);
    this._chain(n, f, g);
    if (lfoRate) {
      const lfo = this.ctx.createOscillator(); lfo.frequency.value = lfoRate;
      const lg = this.ctx.createGain(); lg.gain.value = lfoDepth;
      lfo.connect(lg); lg.connect(g.gain); lfo.start(); this.nodes.push(lfo, lg);
    }
    return g;
  }
  // 単発の音（鳥・虫・風鈴など）を鳴らすスケジューラ
  _sched(fn, minGap, maxGap) {
    const tick = () => { if (this.ctx) fn(); };
    const loop = () => {
      tick();
      const t = setTimeout(() => { if (this.timers.includes(t0)) { loop(); } },
        (minGap + Math.random() * (maxGap - minGap)) * 1000);
    };
    // setIntervalベースで簡潔に
    const t0 = setInterval(() => { tick(); }, ((minGap + maxGap) / 2) * 1000);
    this.timers.push(t0);
  }
  _ping(freq, dur, type, vol, decay) {
    const o = this.ctx.createOscillator(); o.type = type || 'sine'; o.frequency.value = freq;
    const g = this.ctx.createGain(); g.gain.value = 0;
    o.connect(g); g.connect(this.master);
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (decay || dur));
    o.start(t); o.stop(t + (decay || dur) + 0.05);
  }

  _build(key) {
    if (!this.ctx) return;
    switch (key) {
      case 'stream':
        this._bed(900, 0.8, 0.5, 0.4, 0.15); this._bed(2400, 1.2, 0.18, 1.7, 0.12); break;
      case 'rain':
        this._bed(3000, 0.6, 0.45, 0.3, 0.1);
        this._sched(() => this._ping(rnd(1800, 3500), 0.03, 'sine', 0.04, 0.05), 0.05, 0.15); break;
      case 'storm':
        this._bed(2200, 0.5, 0.5, 0.4, 0.12);
        this._sched(() => { const o = this.ctx.createOscillator(); o.type = 'sine'; o.frequency.value = rnd(40, 90);
          const g = this._gain(0); o.connect(g); g.connect(this.master); const t = this.ctx.currentTime;
          g.gain.linearRampToValueAtTime(0.5, t + 1.2); g.gain.exponentialRampToValueAtTime(0.001, t + 4);
          o.start(t); o.stop(t + 4.2); }, 6, 12); break;
      case 'wind_soft':
        this._bed(500, 1.0, 0.5, 0.18, 0.2); break;
      case 'wind_winter':
        this._bed(700, 1.5, 0.5, 0.28, 0.25); this._bed(1400, 3, 0.12, 0.5, 0.1); break;
      case 'snow':
        this._bed(300, 0.8, 0.4, 0.12, 0.15); break;
      case 'birds':
        this._bed(500, 0.6, 0.12, 0.2, 0.05);
        this._sched(() => { const n = 2 + Math.floor(Math.random() * 3); const fb = rnd(2200, 4000);
          for (let k = 0; k < n; k++) setTimeout(() => this._ping(fb * rnd(0.9, 1.3), 0.08, 'sine', 0.06, 0.1), k * 90); }, 1.5, 3.5); break;
      case 'frogs':
        this._bed(300, 0.7, 0.12, 0.2, 0.05);
        this._sched(() => { const f = rnd(220, 380);
          const o = this.ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
          const lp = this._lp(900); const g = this._gain(0); o.connect(lp); lp.connect(g); g.connect(this.master);
          const t = this.ctx.currentTime;
          for (let i = 0; i < 5; i++) { g.gain.setValueAtTime(0.08, t + i * 0.06); g.gain.setValueAtTime(0, t + i * 0.06 + 0.03); }
          o.start(t); o.stop(t + 0.4); }, 0.7, 1.8); break;
      case 'semi':
        this._bed(4500, 2, 0.18, 6, 0.08);
        this._bed(4300, 4, 0.12, 2.6, 0.1); break;
      case 'higurashi':
        this._bed(400, 0.6, 0.08, 0.2, 0.04);
        this._sched(() => { const fb = rnd(3800, 4200);
          for (let i = 0; i < 20; i++) setTimeout(() => this._ping(fb * (1.06 - 0.14 * i / 20), 0.05, 'sine', 0.05 * Math.sin(Math.PI * i / 20), 0.06), i * 105); }, 4, 7); break;
      case 'insects':
        this._bed(300, 0.6, 0.06, 0.15, 0.03);
        this._sched(() => { // 鈴虫リーン
          const o = this.ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = 4500;
          const g = this._gain(0); o.connect(g); g.connect(this.master); const t = this.ctx.currentTime;
          for (let i = 0; i < 30; i++) { g.gain.setValueAtTime(0.05, t + i * 0.025); g.gain.setValueAtTime(0, t + i * 0.025 + 0.012); }
          o.start(t); o.stop(t + 0.85); }, 1.7, 2.6); break;
      case 'furin':
        this._bed(400, 0.8, 0.05, 0.2, 0.05);
        this._sched(() => { const f0 = rnd(2400, 3100);
          [1, 2.76, 5.4].forEach((r, i) => this._ping(f0 * r, 2.5, 'sine', [0.12, 0.05, 0.02][i], 2.5)); }, 3, 7); break;
      default:
        this._bed(600, 1.0, 0.4, 0.2, 0.15);
    }
  }
}
const soundManager = new SoundManager();
// rnd は particles.js で定義済みのものを共用

// ===================== app.js =====================
// ============================================================
// app.js — こよみ七十二候 PWA 本体
// ============================================================
(function () {
  const now = new Date();
  const sessionSeed = Math.floor(Math.random() * 0xffffffff);
  const todayIndex = findCurrentIndex(now);
  let current = todayIndex;
  let muted = false;

  // DPR対応Canvas
  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildCurrent();
  }

  // 現在候のシーン・粒子
  let spec = null, particles = null, goldSys = null;
  let gust = 0, gustPhase = 0, nextGust = 6000, gustT = 0;
  let ripples = [];

  function baseDateFor(i) {
    const ko = KO[i];
    return i === todayIndex ? now : new Date(now.getFullYear(), ko.m - 1, ko.d);
  }
  function buildCurrent() {
    const ko = KO[current], sekki = SEKKI[ko.s];
    spec = buildScene({ baseDate: baseDateFor(current), sessionSeed, sekki, now, W, H });
    particles = new ParticleSystem(ko.p, sekki.c[2], W, H);
    renderUI();
  }

  // 描画ループ
  let last = performance.now();
  function loop(t) {
    const dt = Math.min((t - last) / 1000, 0.05); last = t;

    // 風のひと吹き
    gustT += dt * 1000;
    if (gustT > nextGust) { gustPhase = 1.6; gustT = 0; nextGust = 9000 + Math.random() * 11000; }
    if (gustPhase > 0) { gustPhase -= dt; gust = Math.sin((1.6 - gustPhase) / 1.6 * Math.PI) * (gustPhase > 0 ? 1 : 0); }
    else gust = 0;
    if (particles) particles.gust = gust;

    // ゆっくりした視点移動（KenBurns風）
    const kb = Math.sin(t * 0.00012) * 0.5 + 0.5;
    const sc = 1.03 + kb * 0.035;
    ctx.save();
    ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2);
    ctx.translate((kb - 0.5) * 12, (0.5 - kb) * 8);

    if (spec) drawScene(ctx, spec);
    if (particles) particles.step(ctx, dt, t);

    // 風で金がきらめく
    if (gust > 0.02) {
      const g = ctx.createLinearGradient(0, H * 0.2, W, H * 0.8);
      g.addColorStop(0, 'rgba(217,182,103,0)');
      g.addColorStop(0.5, `rgba(217,182,103,${gust * 0.07})`);
      g.addColorStop(1, 'rgba(217,182,103,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // 波紋（変形外で描く）
    ripples = ripples.filter((r) => {
      r.t += dt; const k = r.t / 0.95; if (k >= 1) return false;
      const rad = (0.15 + k * 2.75) * 65;
      ctx.globalAlpha = k < 0.15 ? k / 0.15 * 0.55 : (1 - k) * 0.55;
      ctx.strokeStyle = '#d9b667'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(r.x, r.y, rad, 0, 6.28); ctx.stroke();
      return true;
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(loop);
  }

  // UI（組版）
  const $ = (id) => document.getElementById(id);
  function renderUI() {
    const ko = KO[current], sekki = SEKKI[ko.s];
    // 枠ラベル
    const fc = '七十二候'.split('').map((c) => `<span class="fc">${c}</span>`).join('');
    const num = ('第' + kanjiNum(current + 1) + '候').split('').map((c) => `<span class="fc">${c}</span>`).join('');
    $('frame').innerHTML = fc + '<div class="div"></div>' + num +
      (current === todayIndex ? '<div id="today-mark">今日</div>' : '');
    // 題字
    const ts = ko.k.length <= 3 ? 68 : 56;
    const kanji = ko.k.split('').map((c) => `<div>${c}</div>`).join('');
    const ruby = ko.y.split('').map((c) => `<span>${c}</span>`).join('');
    $('title').style.setProperty('--ts', ts + 'px');
    $('title').innerHTML = `<div class="kanji">${kanji}</div><div class="ruby">${ruby}</div>`;
    // 解説・脇
    $('desc').textContent = ko.t;
    $('side').querySelector('.sekki').textContent = `${sekki.n}　${rangeLabel(current)}`;
    $('side').querySelector('.toki').textContent = `${spec.tod.n}の刻　${moonName(moonPhase(baseDateFor(current)))}`;
    // フッター
    $('fill').style.width = ((current + 1) / KO.length * 100) + '%';
    $('b-today').style.visibility = current === todayIndex ? 'hidden' : 'visible';
    $('b-sound').textContent = muted ? '♪ 消音中' : '♪ ' + (SOUND_NAMES[ko.snd] || '');
    $('b-sound').classList.toggle('off', muted);
    // 入場フェード
    ['frame', 'title', 'desc', 'hanko', 'side'].forEach((id, i) => {
      const el = $(id); el.classList.remove('in');
      setTimeout(() => el.classList.add('in'), 60 + i * 110);
    });
    // 音
    soundManager.play(ko.snd);
  }

  // ページ送り
  function go(i) {
    i = Math.max(0, Math.min(KO.length - 1, i));
    if (i === current) return;
    current = i;
    buildCurrent();
    if (navigator.vibrate) navigator.vibrate(8);
  }

  // スワイプ
  let sx = 0, sy = 0, swiping = false;
  const stage = document.getElementById('stage');
  stage.addEventListener('touchstart', (e) => {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiping = true;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (!swiping) return; swiping = false;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(current + (dx < 0 ? 1 : -1));   // 左スワイプ=次へ
    } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      // タップ=波紋
      addRipple(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  }, { passive: true });

  // PC用：クリックで波紋、矢印キーで送り
  stage.addEventListener('click', (e) => {
    if (e.target.closest('.btn') || e.target.closest('#shiori')) return;
    addRipple(e.clientX, e.clientY);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
  });

  function addRipple(x, y) {
    ripples.push({ x, y, t: 0 });
    if (ripples.length > 5) ripples.shift();
    soundManager.unlock();
    if (navigator.vibrate) navigator.vibrate(5);
  }

  // ボタン
  $('b-today').addEventListener('click', (e) => { e.stopPropagation(); go(todayIndex); });
  $('b-sound').addEventListener('click', (e) => {
    e.stopPropagation(); soundManager.unlock();
    muted = !muted; soundManager.setMuted(muted); renderUI();
  });
  $('b-shiori').addEventListener('click', (e) => { e.stopPropagation(); openShiori(); });

  // 栞
  function openShiori() {
    const ko = KO[current], sekki = SEKKI[ko.s];
    $('sh-head').textContent = '栞　—　' + ko.k;
    const col = (title, body) =>
      `<div class="col"><div class="ct v">${title}</div><div class="cr"></div><div class="cb v">${body}</div></div>`;
    $('cols').innerHTML =
      col('候の花', ko.hana) + col('旬の味', ko.shun) +
      col('節気のこと', `${sekki.n}（${sekki.y}）。${sekki.t}`) +
      col('いまの音', SOUND_NAMES[ko.snd] || '');
    $('shiori').classList.add('on');
  }
  $('shiori').addEventListener('click', () => $('shiori').classList.remove('on'));

  // iOS Safari & 未インストール時のみ「ホーム追加」案内
  function maybeShowA2HS() {
    const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (isiOS && !standalone && !localStorage.getItem('a2hs-dismissed')) {
      setTimeout(() => $('a2hs').classList.add('on'), 2500);
    }
  }
  $('a2hs-x').addEventListener('click', (e) => {
    e.stopPropagation(); $('a2hs').classList.remove('on');
    try { localStorage.setItem('a2hs-dismissed', '1'); } catch (e) {}
  });

  // 起動
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
  maybeShowA2HS();

  // 最初のタップ/クリックで音を解錠
  const unlockOnce = () => { soundManager.unlock(); window.removeEventListener('pointerdown', unlockOnce); };
  window.addEventListener('pointerdown', unlockOnce);

  // Service Worker（オフライン動作）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
