import type { VocabularyEntry } from "./vocabulary.types";

export const mandarinVocabulary: VocabularyEntry[] = [
  // ══════════════════════════════════════════
  //  GREETINGS - 10 levels, 5 words each
  // ══════════════════════════════════════════

  // Level 1 - Basics
  { id: "gr-1-1", chinese: "你好", pinyin: "nǐ hǎo", english: "Hello", category: "greetings", level: 1 },
  { id: "gr-1-2", chinese: "谢谢", pinyin: "xièxie", english: "Thank you", category: "greetings", level: 1 },
  { id: "gr-1-3", chinese: "再见", pinyin: "zàijiàn", english: "Goodbye", category: "greetings", level: 1 },
  { id: "gr-1-4", chinese: "是", pinyin: "shì", english: "Yes / Is", category: "greetings", level: 1 },
  { id: "gr-1-5", chinese: "不", pinyin: "bù", english: "No / Not", category: "greetings", level: 1 },

  // Level 2 - Polite basics
  { id: "gr-2-1", chinese: "您好", pinyin: "nín hǎo", english: "Hello (formal)", category: "greetings", level: 2 },
  { id: "gr-2-2", chinese: "不客气", pinyin: "bù kèqi", english: "You're welcome", category: "greetings", level: 2 },
  { id: "gr-2-3", chinese: "请", pinyin: "qǐng", english: "Please", category: "greetings", level: 2 },
  { id: "gr-2-4", chinese: "对不起", pinyin: "duìbuqǐ", english: "Sorry", category: "greetings", level: 2 },
  { id: "gr-2-5", chinese: "没关系", pinyin: "méi guānxi", english: "No problem", category: "greetings", level: 2 },

  // Level 3 - Time of day
  { id: "gr-3-1", chinese: "早上好", pinyin: "zǎoshang hǎo", english: "Good morning", category: "greetings", level: 3 },
  { id: "gr-3-2", chinese: "下午好", pinyin: "xiàwǔ hǎo", english: "Good afternoon", category: "greetings", level: 3 },
  { id: "gr-3-3", chinese: "晚上好", pinyin: "wǎnshang hǎo", english: "Good evening", category: "greetings", level: 3 },
  { id: "gr-3-4", chinese: "晚安", pinyin: "wǎn'ān", english: "Good night", category: "greetings", level: 3 },
  { id: "gr-3-5", chinese: "明天见", pinyin: "míngtiān jiàn", english: "See you tomorrow", category: "greetings", level: 3 },

  // Level 4 - How are you
  { id: "gr-4-1", chinese: "你好吗", pinyin: "nǐ hǎo ma", english: "How are you?", category: "greetings", level: 4 },
  { id: "gr-4-2", chinese: "我很好", pinyin: "wǒ hěn hǎo", english: "I'm fine", category: "greetings", level: 4 },
  { id: "gr-4-3", chinese: "还好", pinyin: "hái hǎo", english: "Not bad / So-so", category: "greetings", level: 4 },
  { id: "gr-4-4", chinese: "你呢", pinyin: "nǐ ne", english: "And you?", category: "greetings", level: 4 },
  { id: "gr-4-5", chinese: "最近怎么样", pinyin: "zuìjìn zěnmeyàng", english: "How have you been?", category: "greetings", level: 4 },

  // Level 5 - Introductions
  { id: "gr-5-1", chinese: "我叫", pinyin: "wǒ jiào", english: "My name is…", category: "greetings", level: 5 },
  { id: "gr-5-2", chinese: "你叫什么名字", pinyin: "nǐ jiào shénme míngzi", english: "What's your name?", category: "greetings", level: 5 },
  { id: "gr-5-3", chinese: "认识你很高兴", pinyin: "rènshi nǐ hěn gāoxìng", english: "Nice to meet you", category: "greetings", level: 5 },
  { id: "gr-5-4", chinese: "我是", pinyin: "wǒ shì", english: "I am…", category: "greetings", level: 5 },
  { id: "gr-5-5", chinese: "请问", pinyin: "qǐngwèn", english: "May I ask…", category: "greetings", level: 5, notes: "Polite opener before a question" },

  // Level 6 - Asking for help
  { id: "gr-6-1", chinese: "帮忙", pinyin: "bāngmáng", english: "Help / Give a hand", category: "greetings", level: 6 },
  { id: "gr-6-2", chinese: "请帮我", pinyin: "qǐng bāng wǒ", english: "Please help me", category: "greetings", level: 6 },
  { id: "gr-6-3", chinese: "可以吗", pinyin: "kěyǐ ma", english: "Is that okay?", category: "greetings", level: 6 },
  { id: "gr-6-4", chinese: "麻烦你", pinyin: "máfan nǐ", english: "Sorry to bother you", category: "greetings", level: 6 },
  { id: "gr-6-5", chinese: "没问题", pinyin: "méi wèntí", english: "No problem", category: "greetings", level: 6 },

  // Level 7 - Understanding
  { id: "gr-7-1", chinese: "我不懂", pinyin: "wǒ bù dǒng", english: "I don't understand", category: "greetings", level: 7 },
  { id: "gr-7-2", chinese: "我听不懂", pinyin: "wǒ tīng bù dǒng", english: "I can't understand (listening)", category: "greetings", level: 7 },
  { id: "gr-7-3", chinese: "请再说一次", pinyin: "qǐng zài shuō yī cì", english: "Please say it again", category: "greetings", level: 7 },
  { id: "gr-7-4", chinese: "慢一点", pinyin: "màn yīdiǎn", english: "A little slower", category: "greetings", level: 7 },
  { id: "gr-7-5", chinese: "我明白了", pinyin: "wǒ míngbai le", english: "I understand now", category: "greetings", level: 7 },

  // Level 8 - Languages
  { id: "gr-8-1", chinese: "你会说英语吗", pinyin: "nǐ huì shuō yīngyǔ ma", english: "Do you speak English?", category: "greetings", level: 8 },
  { id: "gr-8-2", chinese: "我会说一点中文", pinyin: "wǒ huì shuō yīdiǎn zhōngwén", english: "I speak a little Chinese", category: "greetings", level: 8 },
  { id: "gr-8-3", chinese: "英语", pinyin: "yīngyǔ", english: "English (language)", category: "greetings", level: 8 },
  { id: "gr-8-4", chinese: "中文", pinyin: "zhōngwén", english: "Chinese (language)", category: "greetings", level: 8 },
  { id: "gr-8-5", chinese: "翻译", pinyin: "fānyì", english: "Translate / Interpreter", category: "greetings", level: 8 },

  // Level 9 - Feelings
  { id: "gr-9-1", chinese: "太好了", pinyin: "tài hǎo le", english: "Great! / Awesome!", category: "greetings", level: 9 },
  { id: "gr-9-2", chinese: "好的", pinyin: "hǎo de", english: "Okay / Alright", category: "greetings", level: 9 },
  { id: "gr-9-3", chinese: "不好意思", pinyin: "bù hǎoyìsi", english: "Excuse me / Embarrassed", category: "greetings", level: 9 },
  { id: "gr-9-4", chinese: "真的吗", pinyin: "zhēn de ma", english: "Really?", category: "greetings", level: 9 },
  { id: "gr-9-5", chinese: "当然", pinyin: "dāngrán", english: "Of course", category: "greetings", level: 9 },

  // Level 10 - Farewell & thanks
  { id: "gr-10-1", chinese: "一路平安", pinyin: "yī lù píng'ān", english: "Have a safe trip", category: "greetings", level: 10 },
  { id: "gr-10-2", chinese: "保重", pinyin: "bǎozhòng", english: "Take care", category: "greetings", level: 10 },
  { id: "gr-10-3", chinese: "非常感谢", pinyin: "fēicháng gǎnxiè", english: "Thank you very much", category: "greetings", level: 10 },
  { id: "gr-10-4", chinese: "多谢", pinyin: "duōxiè", english: "Thanks a lot", category: "greetings", level: 10 },
  { id: "gr-10-5", chinese: "下次见", pinyin: "xià cì jiàn", english: "See you next time", category: "greetings", level: 10 },

  // ══════════════════════════════════════════
  //  FOOD - 10 levels, 5 words each
  // ══════════════════════════════════════════

  // Level 1 - Drinks
  { id: "fd-1-1", chinese: "水", pinyin: "shuǐ", english: "Water", category: "food", level: 1 },
  { id: "fd-1-2", chinese: "茶", pinyin: "chá", english: "Tea", category: "food", level: 1 },
  { id: "fd-1-3", chinese: "咖啡", pinyin: "kāfēi", english: "Coffee", category: "food", level: 1 },
  { id: "fd-1-4", chinese: "啤酒", pinyin: "píjiǔ", english: "Beer", category: "food", level: 1 },
  { id: "fd-1-5", chinese: "果汁", pinyin: "guǒzhī", english: "Juice", category: "food", level: 1 },

  // Level 2 - Staples
  { id: "fd-2-1", chinese: "米饭", pinyin: "mǐfàn", english: "Rice", category: "food", level: 2 },
  { id: "fd-2-2", chinese: "面条", pinyin: "miàntiáo", english: "Noodles", category: "food", level: 2 },
  { id: "fd-2-3", chinese: "面包", pinyin: "miànbāo", english: "Bread", category: "food", level: 2 },
  { id: "fd-2-4", chinese: "鸡蛋", pinyin: "jīdàn", english: "Egg", category: "food", level: 2 },
  { id: "fd-2-5", chinese: "豆腐", pinyin: "dòufu", english: "Tofu", category: "food", level: 2 },

  // Level 3 - Street food
  { id: "fd-3-1", chinese: "包子", pinyin: "bāozi", english: "Steamed bun", category: "food", level: 3 },
  { id: "fd-3-2", chinese: "饺子", pinyin: "jiǎozi", english: "Dumplings", category: "food", level: 3 },
  { id: "fd-3-3", chinese: "馒头", pinyin: "mántou", english: "Plain steamed bun", category: "food", level: 3 },
  { id: "fd-3-4", chinese: "烧烤", pinyin: "shāokǎo", english: "Barbecue", category: "food", level: 3 },
  { id: "fd-3-5", chinese: "煎饼", pinyin: "jiānbing", english: "Savoury crepe", category: "food", level: 3 },

  // Level 4 - Meats
  { id: "fd-4-1", chinese: "牛肉", pinyin: "niúròu", english: "Beef", category: "food", level: 4 },
  { id: "fd-4-2", chinese: "鸡肉", pinyin: "jīròu", english: "Chicken", category: "food", level: 4 },
  { id: "fd-4-3", chinese: "猪肉", pinyin: "zhūròu", english: "Pork", category: "food", level: 4 },
  { id: "fd-4-4", chinese: "鱼", pinyin: "yú", english: "Fish", category: "food", level: 4 },
  { id: "fd-4-5", chinese: "虾", pinyin: "xiā", english: "Shrimp", category: "food", level: 4 },

  // Level 5 - Vegetables & fruit
  { id: "fd-5-1", chinese: "蔬菜", pinyin: "shūcài", english: "Vegetables", category: "food", level: 5 },
  { id: "fd-5-2", chinese: "水果", pinyin: "shuǐguǒ", english: "Fruit", category: "food", level: 5 },
  { id: "fd-5-3", chinese: "苹果", pinyin: "píngguǒ", english: "Apple", category: "food", level: 5 },
  { id: "fd-5-4", chinese: "香蕉", pinyin: "xiāngjiāo", english: "Banana", category: "food", level: 5 },
  { id: "fd-5-5", chinese: "西瓜", pinyin: "xīguā", english: "Watermelon", category: "food", level: 5 },

  // Level 6 - Taste & preferences
  { id: "fd-6-1", chinese: "好吃", pinyin: "hǎo chī", english: "Delicious", category: "food", level: 6 },
  { id: "fd-6-2", chinese: "辣", pinyin: "là", english: "Spicy", category: "food", level: 6 },
  { id: "fd-6-3", chinese: "不辣", pinyin: "bù là", english: "Not spicy", category: "food", level: 6 },
  { id: "fd-6-4", chinese: "甜", pinyin: "tián", english: "Sweet", category: "food", level: 6 },
  { id: "fd-6-5", chinese: "咸", pinyin: "xián", english: "Salty", category: "food", level: 6 },

  // Level 7 - Ordering
  { id: "fd-7-1", chinese: "菜单", pinyin: "càidān", english: "Menu", category: "food", level: 7 },
  { id: "fd-7-2", chinese: "我要这个", pinyin: "wǒ yào zhège", english: "I want this", category: "food", level: 7 },
  { id: "fd-7-3", chinese: "来一份", pinyin: "lái yī fèn", english: "One serving, please", category: "food", level: 7 },
  { id: "fd-7-4", chinese: "买单", pinyin: "mǎidān", english: "Bill / Check", category: "food", level: 7 },
  { id: "fd-7-5", chinese: "打包", pinyin: "dǎbāo", english: "Takeaway / To go", category: "food", level: 7 },

  // Level 8 - Dietary needs
  { id: "fd-8-1", chinese: "素", pinyin: "sù", english: "Vegetarian", category: "food", level: 8 },
  { id: "fd-8-2", chinese: "不要肉", pinyin: "bù yào ròu", english: "No meat", category: "food", level: 8 },
  { id: "fd-8-3", chinese: "过敏", pinyin: "guòmǐn", english: "Allergic", category: "food", level: 8 },
  { id: "fd-8-4", chinese: "花生", pinyin: "huāshēng", english: "Peanut", category: "food", level: 8 },
  { id: "fd-8-5", chinese: "牛奶", pinyin: "niúnǎi", english: "Milk", category: "food", level: 8 },

  // Level 9 - Restaurant phrases
  { id: "fd-9-1", chinese: "有没有", pinyin: "yǒu méi yǒu", english: "Do you have…?", category: "food", level: 9 },
  { id: "fd-9-2", chinese: "推荐", pinyin: "tuījiàn", english: "Recommend", category: "food", level: 9 },
  { id: "fd-9-3", chinese: "服务员", pinyin: "fúwùyuán", english: "Waiter / Waitress", category: "food", level: 9 },
  { id: "fd-9-4", chinese: "筷子", pinyin: "kuàizi", english: "Chopsticks", category: "food", level: 9 },
  { id: "fd-9-5", chinese: "勺子", pinyin: "sháozi", english: "Spoon", category: "food", level: 9 },

  // Level 10 - Compliments & feedback
  { id: "fd-10-1", chinese: "非常好吃", pinyin: "fēicháng hǎochī", english: "Very delicious", category: "food", level: 10 },
  { id: "fd-10-2", chinese: "吃饱了", pinyin: "chī bǎo le", english: "I'm full", category: "food", level: 10 },
  { id: "fd-10-3", chinese: "再来一杯", pinyin: "zài lái yī bēi", english: "Another cup/glass", category: "food", level: 10 },
  { id: "fd-10-4", chinese: "干杯", pinyin: "gānbēi", english: "Cheers!", category: "food", level: 10 },
  { id: "fd-10-5", chinese: "多少钱", pinyin: "duōshǎo qián", english: "How much?", category: "food", level: 10 },

  // ══════════════════════════════════════════
  //  DIRECTIONS - 10 levels, 5 words each
  // ══════════════════════════════════════════

  // Level 1 - Where / here / there
  { id: "dr-1-1", chinese: "哪里", pinyin: "nǎlǐ", english: "Where", category: "directions", level: 1 },
  { id: "dr-1-2", chinese: "这里", pinyin: "zhèlǐ", english: "Here", category: "directions", level: 1 },
  { id: "dr-1-3", chinese: "那里", pinyin: "nàlǐ", english: "There", category: "directions", level: 1 },
  { id: "dr-1-4", chinese: "在哪儿", pinyin: "zài nǎr", english: "Where is…?", category: "directions", level: 1 },
  { id: "dr-1-5", chinese: "地图", pinyin: "dìtú", english: "Map", category: "directions", level: 1 },

  // Level 2 - Left / right / straight
  { id: "dr-2-1", chinese: "左", pinyin: "zuǒ", english: "Left", category: "directions", level: 2 },
  { id: "dr-2-2", chinese: "右", pinyin: "yòu", english: "Right", category: "directions", level: 2 },
  { id: "dr-2-3", chinese: "直走", pinyin: "zhí zǒu", english: "Go straight", category: "directions", level: 2 },
  { id: "dr-2-4", chinese: "前", pinyin: "qián", english: "Front / Forward", category: "directions", level: 2 },
  { id: "dr-2-5", chinese: "后", pinyin: "hòu", english: "Back / Behind", category: "directions", level: 2 },

  // Level 3 - Turning & sides
  { id: "dr-3-1", chinese: "左边", pinyin: "zuǒbian", english: "Left side", category: "directions", level: 3 },
  { id: "dr-3-2", chinese: "右边", pinyin: "yòubian", english: "Right side", category: "directions", level: 3 },
  { id: "dr-3-3", chinese: "拐弯", pinyin: "guǎiwān", english: "Turn", category: "directions", level: 3 },
  { id: "dr-3-4", chinese: "左拐", pinyin: "zuǒ guǎi", english: "Turn left", category: "directions", level: 3 },
  { id: "dr-3-5", chinese: "右拐", pinyin: "yòu guǎi", english: "Turn right", category: "directions", level: 3 },

  // Level 4 - Distance
  { id: "dr-4-1", chinese: "远", pinyin: "yuǎn", english: "Far", category: "directions", level: 4 },
  { id: "dr-4-2", chinese: "近", pinyin: "jìn", english: "Near", category: "directions", level: 4 },
  { id: "dr-4-3", chinese: "附近", pinyin: "fùjìn", english: "Nearby", category: "directions", level: 4 },
  { id: "dr-4-4", chinese: "多远", pinyin: "duō yuǎn", english: "How far?", category: "directions", level: 4 },
  { id: "dr-4-5", chinese: "走路", pinyin: "zǒulù", english: "Walk / On foot", category: "directions", level: 4 },

  // Level 5 - Landmarks
  { id: "dr-5-1", chinese: "路口", pinyin: "lùkǒu", english: "Intersection", category: "directions", level: 5 },
  { id: "dr-5-2", chinese: "红绿灯", pinyin: "hónglǜdēng", english: "Traffic light", category: "directions", level: 5 },
  { id: "dr-5-3", chinese: "对面", pinyin: "duìmiàn", english: "Opposite side", category: "directions", level: 5 },
  { id: "dr-5-4", chinese: "旁边", pinyin: "pángbiān", english: "Next to / Beside", category: "directions", level: 5 },
  { id: "dr-5-5", chinese: "十字路口", pinyin: "shízì lùkǒu", english: "Crossroad", category: "directions", level: 5 },

  // Level 6 - Up / down / floors
  { id: "dr-6-1", chinese: "上", pinyin: "shàng", english: "Up / Above", category: "directions", level: 6 },
  { id: "dr-6-2", chinese: "下", pinyin: "xià", english: "Down / Below", category: "directions", level: 6 },
  { id: "dr-6-3", chinese: "楼上", pinyin: "lóu shàng", english: "Upstairs", category: "directions", level: 6 },
  { id: "dr-6-4", chinese: "楼下", pinyin: "lóu xià", english: "Downstairs", category: "directions", level: 6 },
  { id: "dr-6-5", chinese: "几楼", pinyin: "jǐ lóu", english: "Which floor?", category: "directions", level: 6 },

  // Level 7 - Transport directions
  { id: "dr-7-1", chinese: "坐地铁", pinyin: "zuò dìtiě", english: "Take the subway", category: "directions", level: 7 },
  { id: "dr-7-2", chinese: "坐公交车", pinyin: "zuò gōngjiāo chē", english: "Take the bus", category: "directions", level: 7 },
  { id: "dr-7-3", chinese: "打车", pinyin: "dǎ chē", english: "Take a taxi", category: "directions", level: 7 },
  { id: "dr-7-4", chinese: "换乘", pinyin: "huàn chéng", english: "Transfer (transit)", category: "directions", level: 7 },
  { id: "dr-7-5", chinese: "到了", pinyin: "dào le", english: "Arrived / We're here", category: "directions", level: 7 },

  // Level 8 - Asking for directions
  { id: "dr-8-1", chinese: "怎么走", pinyin: "zěnme zǒu", english: "How do I get there?", category: "directions", level: 8 },
  { id: "dr-8-2", chinese: "去……怎么走", pinyin: "qù … zěnme zǒu", english: "How to get to…?", category: "directions", level: 8 },
  { id: "dr-8-3", chinese: "请问……在哪里", pinyin: "qǐngwèn … zài nǎlǐ", english: "Excuse me, where is…?", category: "directions", level: 8 },
  { id: "dr-8-4", chinese: "我迷路了", pinyin: "wǒ mílù le", english: "I'm lost", category: "directions", level: 8 },
  { id: "dr-8-5", chinese: "能带我去吗", pinyin: "néng dài wǒ qù ma", english: "Can you take me there?", category: "directions", level: 8 },

  // Level 9 - Compass & position
  { id: "dr-9-1", chinese: "东", pinyin: "dōng", english: "East", category: "directions", level: 9 },
  { id: "dr-9-2", chinese: "西", pinyin: "xī", english: "West", category: "directions", level: 9 },
  { id: "dr-9-3", chinese: "南", pinyin: "nán", english: "South", category: "directions", level: 9 },
  { id: "dr-9-4", chinese: "北", pinyin: "běi", english: "North", category: "directions", level: 9 },
  { id: "dr-9-5", chinese: "中间", pinyin: "zhōngjiān", english: "Middle / Between", category: "directions", level: 9 },

  // Level 10 - Advanced phrases
  { id: "dr-10-1", chinese: "过马路", pinyin: "guò mǎlù", english: "Cross the street", category: "directions", level: 10 },
  { id: "dr-10-2", chinese: "第一个路口", pinyin: "dì yī ge lùkǒu", english: "First intersection", category: "directions", level: 10 },
  { id: "dr-10-3", chinese: "在前面", pinyin: "zài qiánmiàn", english: "Up ahead", category: "directions", level: 10 },
  { id: "dr-10-4", chinese: "在后面", pinyin: "zài hòumiàn", english: "Behind / In the back", category: "directions", level: 10 },
  { id: "dr-10-5", chinese: "到了请告诉我", pinyin: "dào le qǐng gàosu wǒ", english: "Tell me when we arrive", category: "directions", level: 10 },

  // ══════════════════════════════════════════
  //  PLACES - 10 levels, 5 words each
  // ══════════════════════════════════════════

  // Level 1 - Essential places
  { id: "pl-1-1", chinese: "厕所", pinyin: "cèsuǒ", english: "Toilet / Bathroom", category: "places", level: 1 },
  { id: "pl-1-2", chinese: "洗手间", pinyin: "xǐshǒujiān", english: "Washroom / Restroom", category: "places", level: 1 },
  { id: "pl-1-3", chinese: "酒店", pinyin: "jiǔdiàn", english: "Hotel", category: "places", level: 1 },
  { id: "pl-1-4", chinese: "餐厅", pinyin: "cāntīng", english: "Restaurant", category: "places", level: 1 },
  { id: "pl-1-5", chinese: "商店", pinyin: "shāngdiàn", english: "Shop / Store", category: "places", level: 1 },

  // Level 2 - Transport hubs
  { id: "pl-2-1", chinese: "机场", pinyin: "jīchǎng", english: "Airport", category: "places", level: 2 },
  { id: "pl-2-2", chinese: "火车站", pinyin: "huǒchē zhàn", english: "Train station", category: "places", level: 2 },
  { id: "pl-2-3", chinese: "地铁站", pinyin: "dìtiě zhàn", english: "Subway station", category: "places", level: 2 },
  { id: "pl-2-4", chinese: "公交站", pinyin: "gōngjiāo zhàn", english: "Bus stop", category: "places", level: 2 },
  { id: "pl-2-5", chinese: "出租车站", pinyin: "chūzū chē zhàn", english: "Taxi stand", category: "places", level: 2 },

  // Level 3 - Shopping
  { id: "pl-3-1", chinese: "商场", pinyin: "shāngchǎng", english: "Mall / Shopping centre", category: "places", level: 3 },
  { id: "pl-3-2", chinese: "超市", pinyin: "chāoshì", english: "Supermarket", category: "places", level: 3 },
  { id: "pl-3-3", chinese: "便利店", pinyin: "biànlì diàn", english: "Convenience store", category: "places", level: 3 },
  { id: "pl-3-4", chinese: "市场", pinyin: "shìchǎng", english: "Market", category: "places", level: 3 },
  { id: "pl-3-5", chinese: "药店", pinyin: "yàodiàn", english: "Pharmacy", category: "places", level: 3 },

  // Level 4 - Services
  { id: "pl-4-1", chinese: "医院", pinyin: "yīyuàn", english: "Hospital", category: "places", level: 4 },
  { id: "pl-4-2", chinese: "银行", pinyin: "yínháng", english: "Bank", category: "places", level: 4 },
  { id: "pl-4-3", chinese: "警察局", pinyin: "jǐngchá jú", english: "Police station", category: "places", level: 4 },
  { id: "pl-4-4", chinese: "邮局", pinyin: "yóujú", english: "Post office", category: "places", level: 4 },
  { id: "pl-4-5", chinese: "大使馆", pinyin: "dàshǐguǎn", english: "Embassy", category: "places", level: 4 },

  // Level 5 - Landmarks & culture
  { id: "pl-5-1", chinese: "博物馆", pinyin: "bówùguǎn", english: "Museum", category: "places", level: 5 },
  { id: "pl-5-2", chinese: "公园", pinyin: "gōngyuán", english: "Park", category: "places", level: 5 },
  { id: "pl-5-3", chinese: "寺庙", pinyin: "sìmiào", english: "Temple", category: "places", level: 5 },
  { id: "pl-5-4", chinese: "图书馆", pinyin: "túshūguǎn", english: "Library", category: "places", level: 5 },
  { id: "pl-5-5", chinese: "电影院", pinyin: "diànyǐngyuàn", english: "Cinema", category: "places", level: 5 },

  // Level 6 - Food & drink venues
  { id: "pl-6-1", chinese: "咖啡馆", pinyin: "kāfēi guǎn", english: "Café", category: "places", level: 6 },
  { id: "pl-6-2", chinese: "酒吧", pinyin: "jiǔbā", english: "Bar", category: "places", level: 6 },
  { id: "pl-6-3", chinese: "茶馆", pinyin: "cháguǎn", english: "Teahouse", category: "places", level: 6 },
  { id: "pl-6-4", chinese: "小吃街", pinyin: "xiǎochī jiē", english: "Snack street", category: "places", level: 6 },
  { id: "pl-6-5", chinese: "夜市", pinyin: "yèshì", english: "Night market", category: "places", level: 6 },

  // Level 7 - Accommodation
  { id: "pl-7-1", chinese: "房间", pinyin: "fángjiān", english: "Room", category: "places", level: 7 },
  { id: "pl-7-2", chinese: "前台", pinyin: "qiántái", english: "Front desk", category: "places", level: 7 },
  { id: "pl-7-3", chinese: "钥匙", pinyin: "yàoshi", english: "Key", category: "places", level: 7 },
  { id: "pl-7-4", chinese: "电梯", pinyin: "diàntī", english: "Elevator / Lift", category: "places", level: 7 },
  { id: "pl-7-5", chinese: "入口", pinyin: "rùkǒu", english: "Entrance", category: "places", level: 7 },

  // Level 8 - Around the city
  { id: "pl-8-1", chinese: "出口", pinyin: "chūkǒu", english: "Exit", category: "places", level: 8 },
  { id: "pl-8-2", chinese: "停车场", pinyin: "tíngchē chǎng", english: "Parking lot", category: "places", level: 8 },
  { id: "pl-8-3", chinese: "加油站", pinyin: "jiāyóu zhàn", english: "Gas station", category: "places", level: 8 },
  { id: "pl-8-4", chinese: "广场", pinyin: "guǎngchǎng", english: "Square / Plaza", category: "places", level: 8 },
  { id: "pl-8-5", chinese: "桥", pinyin: "qiáo", english: "Bridge", category: "places", level: 8 },

  // Level 9 - Nature & leisure
  { id: "pl-9-1", chinese: "海滩", pinyin: "hǎitān", english: "Beach", category: "places", level: 9 },
  { id: "pl-9-2", chinese: "山", pinyin: "shān", english: "Mountain", category: "places", level: 9 },
  { id: "pl-9-3", chinese: "湖", pinyin: "hú", english: "Lake", category: "places", level: 9 },
  { id: "pl-9-4", chinese: "动物园", pinyin: "dòngwùyuán", english: "Zoo", category: "places", level: 9 },
  { id: "pl-9-5", chinese: "游泳池", pinyin: "yóuyǒng chí", english: "Swimming pool", category: "places", level: 9 },

  // Level 10 - Advanced place phrases
  { id: "pl-10-1", chinese: "景点", pinyin: "jǐngdiǎn", english: "Scenic spot / Attraction", category: "places", level: 10 },
  { id: "pl-10-2", chinese: "门票", pinyin: "ménpiào", english: "Admission ticket", category: "places", level: 10 },
  { id: "pl-10-3", chinese: "免费", pinyin: "miǎnfèi", english: "Free (no charge)", category: "places", level: 10 },
  { id: "pl-10-4", chinese: "开门时间", pinyin: "kāimén shíjiān", english: "Opening hours", category: "places", level: 10 },
  { id: "pl-10-5", chinese: "关门", pinyin: "guānmén", english: "Closed", category: "places", level: 10 },
];
