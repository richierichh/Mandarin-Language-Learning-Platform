import type { VocabularyEntry } from "./vocabulary.types";

/**
 * Initial Mandarin vocabulary for travellers and casual learners.
 * Categories: greetings, food, directions, transport, shopping.
 * Simplified Chinese (简体字); pinyin with tone marks.
 */
export const mandarinVocabulary: VocabularyEntry[] = [
  // —— Greetings ——
  { id: "g-1", chinese: "你好", pinyin: "nǐ hǎo", english: "Hello", category: "greetings" },
  { id: "g-2", chinese: "您好", pinyin: "nín hǎo", english: "Hello (formal)", category: "greetings" },
  { id: "g-3", chinese: "谢谢", pinyin: "xièxie", english: "Thank you", category: "greetings" },
  { id: "g-4", chinese: "不客气", pinyin: "bù kèqi", english: "You're welcome", category: "greetings" },
  { id: "g-5", chinese: "再见", pinyin: "zàijiàn", english: "Goodbye", category: "greetings" },
  { id: "g-6", chinese: "早上好", pinyin: "zǎoshang hǎo", english: "Good morning", category: "greetings" },
  { id: "g-7", chinese: "晚上好", pinyin: "wǎnshang hǎo", english: "Good evening", category: "greetings" },
  { id: "g-8", chinese: "对不起", pinyin: "duìbuqǐ", english: "Sorry / Excuse me", category: "greetings" },
  { id: "g-9", chinese: "没关系", pinyin: "méi guānxi", english: "No problem / It's okay", category: "greetings" },
  { id: "g-10", chinese: "请问", pinyin: "qǐngwèn", english: "May I ask... / Excuse me (when asking)", category: "greetings", notes: "Polite opener before a question" },

  // —— Food ——
  { id: "f-1", chinese: "水", pinyin: "shuǐ", english: "water", category: "food" },
  { id: "f-2", chinese: "茶", pinyin: "chá", english: "tea", category: "food" },
  { id: "f-3", chinese: "咖啡", pinyin: "kāfēi", english: "coffee", category: "food" },
  { id: "f-4", chinese: "米饭", pinyin: "mǐfàn", english: "rice", category: "food" },
  { id: "f-5", chinese: "面条", pinyin: "miàntiáo", english: "noodles", category: "food" },
  { id: "f-6", chinese: "包子", pinyin: "bāozi", english: "steamed bun", category: "food" },
  { id: "f-7", chinese: "饺子", pinyin: "jiǎozi", english: "dumplings", category: "food" },
  { id: "f-8", chinese: "啤酒", pinyin: "píjiǔ", english: "beer", category: "food" },
  { id: "f-9", chinese: "菜单", pinyin: "càidān", english: "menu", category: "food" },
  { id: "f-10", chinese: "买单", pinyin: "mǎidān", english: "bill / check", category: "food", notes: "Literally 'buy the bill'" },
  { id: "f-11", chinese: "好吃", pinyin: "hǎo chī", english: "delicious", category: "food" },
  { id: "f-12", chinese: "辣", pinyin: "là", english: "spicy", category: "food" },
  { id: "f-13", chinese: "不辣", pinyin: "bù là", english: "not spicy", category: "food" },
  { id: "f-14", chinese: "素", pinyin: "sù", english: "vegetarian", category: "food" },
  { id: "f-15", chinese: "牛肉", pinyin: "niúròu", english: "beef", category: "food" },
  { id: "f-16", chinese: "鸡肉", pinyin: "jīròu", english: "chicken", category: "food" },
  { id: "f-17", chinese: "猪肉", pinyin: "zhūròu", english: "pork", category: "food" },
  { id: "f-18", chinese: "我要这个", pinyin: "wǒ yào zhège", english: "I want this", category: "food", notes: "Also used when shopping" },

  // —— Directions ——
  { id: "d-1", chinese: "哪里", pinyin: "nǎlǐ", english: "where", category: "directions" },
  { id: "d-2", chinese: "这里", pinyin: "zhèlǐ", english: "here", category: "directions" },
  { id: "d-3", chinese: "那里", pinyin: "nàlǐ", english: "there", category: "directions" },
  { id: "d-4", chinese: "左", pinyin: "zuǒ", english: "left", category: "directions" },
  { id: "d-5", chinese: "右", pinyin: "yòu", english: "right", category: "directions" },
  { id: "d-6", chinese: "前", pinyin: "qián", english: "front", category: "directions" },
  { id: "d-7", chinese: "后", pinyin: "hòu", english: "back", category: "directions" },
  { id: "d-8", chinese: "直走", pinyin: "zhí zǒu", english: "go straight", category: "directions" },
  { id: "d-9", chinese: "拐弯", pinyin: "guǎiwān", english: "turn", category: "directions" },
  { id: "d-10", chinese: "左边", pinyin: "zuǒbian", english: "left side", category: "directions" },
  { id: "d-11", chinese: "右边", pinyin: "yòubian", english: "right side", category: "directions" },
  { id: "d-12", chinese: "附近", pinyin: "fùjìn", english: "nearby", category: "directions" },
  { id: "d-13", chinese: "远", pinyin: "yuǎn", english: "far", category: "directions" },
  { id: "d-14", chinese: "近", pinyin: "jìn", english: "near", category: "directions" },
  { id: "d-15", chinese: "厕所", pinyin: "cèsuǒ", english: "toilet / bathroom", category: "directions" },
  { id: "d-16", chinese: "在哪儿", pinyin: "zài nǎr", english: "where is (it)", category: "directions", notes: "Colloquial for 在哪里" },

  // —— Transport ——
  { id: "t-1", chinese: "出租车", pinyin: "chūzū chē", english: "taxi", category: "transport" },
  { id: "t-2", chinese: "地铁", pinyin: "dìtiě", english: "subway / metro", category: "transport" },
  { id: "t-3", chinese: "公共汽车", pinyin: "gōnggòng qìchē", english: "bus", category: "transport" },
  { id: "t-4", chinese: "火车", pinyin: "huǒchē", english: "train", category: "transport" },
  { id: "t-5", chinese: "飞机", pinyin: "fēijī", english: "plane", category: "transport" },
  { id: "t-6", chinese: "站", pinyin: "zhàn", english: "station / stop", category: "transport" },
  { id: "t-7", chinese: "票", pinyin: "piào", english: "ticket", category: "transport" },
  { id: "t-8", chinese: "机场", pinyin: "jīchǎng", english: "airport", category: "transport" },
  { id: "t-9", chinese: "火车站", pinyin: "huǒchē zhàn", english: "train station", category: "transport" },
  { id: "t-10", chinese: "地铁站", pinyin: "dìtiě zhàn", english: "subway station", category: "transport" },
  { id: "t-11", chinese: "去……怎么走", pinyin: "qù ... zěnme zǒu", english: "how do I get to...", category: "transport", notes: "Fill in the place, e.g. 去机场怎么走" },

  // —— Shopping ——
  { id: "s-1", chinese: "多少钱", pinyin: "duōshǎo qián", english: "how much (money)", category: "shopping" },
  { id: "s-2", chinese: "太贵了", pinyin: "tài guì le", english: "too expensive", category: "shopping" },
  { id: "s-3", chinese: "便宜", pinyin: "piányi", english: "cheap", category: "shopping" },
  { id: "s-4", chinese: "可以便宜一点吗", pinyin: "kěyǐ piányi yīdiǎn ma", english: "can you make it cheaper?", category: "shopping" },
  { id: "s-5", chinese: "我要这个", pinyin: "wǒ yào zhège", english: "I want this one", category: "shopping" },
  { id: "s-6", chinese: "不要", pinyin: "bù yào", english: "I don't want (it)", category: "shopping" },
  { id: "s-7", chinese: "换", pinyin: "huàn", english: "exchange", category: "shopping" },
  { id: "s-8", chinese: "人民币", pinyin: "rénmínbì", english: "RMB / Chinese yuan", category: "shopping" },
  { id: "s-9", chinese: "块", pinyin: "kuài", english: "yuan (colloquial)", category: "shopping", notes: "e.g. 十块 = 10 yuan" },
  { id: "s-10", chinese: "元", pinyin: "yuán", english: "yuan (formal)", category: "shopping" },
  { id: "s-11", chinese: "刷卡", pinyin: "shuā kǎ", english: "pay by card", category: "shopping" },
  { id: "s-12", chinese: "现金", pinyin: "xiànjīn", english: "cash", category: "shopping" },
];
