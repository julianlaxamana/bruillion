// Prompt bank. Answers are listed roughly from most to least common guess;
// that order seeds a fake "crowd" so rarity feels real before anyone plays.
// Use "a|b|c" to give one answer several accepted spellings (first is canonical).

export type Prompt = { id: string; text: string; answers: string[] };

export const PROMPTS: Prompt[] = [
  {
    id: "fruit",
    text: "Name a fruit",
    answers: [
      "apple", "banana", "orange", "strawberry", "grape", "mango", "pineapple", "watermelon",
      "peach", "pear", "cherry", "blueberry", "kiwi", "lemon", "raspberry", "plum", "lime",
      "pomegranate", "papaya", "apricot", "coconut", "cantaloupe", "grapefruit", "blackberry",
      "fig", "nectarine", "dragonfruit|dragon fruit|pitaya", "passion fruit|passionfruit",
      "lychee|litchi", "guava", "persimmon", "date", "cranberry", "honeydew", "tangerine",
      "clementine", "avocado", "tomato", "starfruit|carambola", "jackfruit", "durian",
      "kumquat", "quince", "gooseberry", "mulberry", "elderberry", "rambutan", "mangosteen",
      "soursop|guanabana", "feijoa", "loquat", "salak|snake fruit", "cherimoya", "ackee",
      "tamarind", "boysenberry", "huckleberry", "currant", "yuzu", "olive",
    ],
  },
  {
    id: "europe",
    text: "Name a country in Europe",
    answers: [
      "france", "germany", "italy", "spain", "united kingdom|uk|england|britain|great britain",
      "portugal", "greece", "netherlands|holland", "switzerland", "sweden", "norway", "ireland",
      "poland", "belgium", "austria", "denmark", "finland", "russia", "ukraine", "iceland",
      "czech republic|czechia", "hungary", "croatia", "romania", "bulgaria", "serbia",
      "slovakia", "slovenia", "estonia", "latvia", "lithuania", "belarus", "luxembourg",
      "monaco", "malta", "cyprus", "albania", "montenegro", "bosnia and herzegovina|bosnia",
      "north macedonia|macedonia", "moldova", "andorra", "liechtenstein", "san marino",
      "vatican city|vatican|holy see", "kosovo", "scotland", "wales",
    ],
  },
  {
    id: "dog",
    text: "Name a dog breed",
    answers: [
      "golden retriever", "labrador|labrador retriever|lab", "german shepherd", "poodle",
      "bulldog", "beagle", "husky|siberian husky", "chihuahua", "pug", "dachshund|wiener dog",
      "rottweiler", "corgi|pembroke welsh corgi", "border collie", "boxer", "pit bull|pitbull",
      "shih tzu", "great dane", "yorkshire terrier|yorkie", "french bulldog|frenchie",
      "doberman|dobermann|doberman pinscher", "australian shepherd|aussie", "pomeranian",
      "dalmatian", "saint bernard|st bernard", "maltese", "bernese mountain dog",
      "cavalier king charles spaniel|cavalier", "cocker spaniel", "greyhound", "shiba inu",
      "akita", "bichon frise", "basset hound", "bloodhound", "whippet", "samoyed",
      "newfoundland", "weimaraner", "vizsla", "malamute|alaskan malamute", "jack russell terrier|jack russell",
      "schnauzer", "papillon", "basenji", "chow chow", "shar pei", "irish wolfhound",
      "afghan hound", "borzoi", "komondor", "xoloitzcuintli|xolo", "otterhound",
      "leonberger", "puli", "saluki", "lagotto romagnolo", "mudi",
    ],
  },
  {
    id: "instrument",
    text: "Name a musical instrument",
    answers: [
      "piano", "guitar", "drums|drum", "violin", "flute", "trumpet", "saxophone|sax", "cello",
      "clarinet", "bass|bass guitar", "harp", "trombone", "ukulele", "keyboard", "tuba",
      "oboe", "harmonica", "french horn|horn", "viola", "xylophone", "banjo", "accordion",
      "tambourine", "triangle", "recorder", "organ", "bagpipes|bagpipe", "double bass|upright bass",
      "mandolin", "bassoon", "cymbal|cymbals", "piccolo", "marimba", "sitar", "didgeridoo",
      "harpsichord", "glockenspiel", "theremin", "kazoo", "bongo|bongos", "maracas",
      "steel drum|steelpan", "lute", "zither", "koto", "erhu", "kalimba", "hurdy gurdy",
      "ocarina", "oud", "bouzouki", "shamisen", "balalaika", "celesta", "euphonium", "sousaphone",
    ],
  },
  {
    id: "ocean",
    text: "Name an animal that lives in the ocean",
    answers: [
      "shark", "whale", "dolphin", "octopus", "jellyfish", "fish", "starfish|sea star", "crab",
      "seal", "turtle|sea turtle", "squid", "lobster", "clownfish", "stingray|ray", "orca|killer whale",
      "shrimp", "sea horse|seahorse", "eel", "blue whale", "sea lion", "manta ray", "walrus",
      "tuna", "salmon", "sea urchin", "coral", "clam", "oyster", "otter|sea otter", "pufferfish|blowfish",
      "narwhal", "swordfish", "barracuda", "anglerfish", "krill", "plankton", "manatee", "dugong",
      "hammerhead shark|hammerhead", "beluga", "humpback whale", "sea cucumber", "nudibranch",
      "cuttlefish", "nautilus", "anemone|sea anemone", "barnacle", "mackerel", "sardine", "cod",
      "halibut", "marlin", "sunfish|mola", "lamprey", "hagfish", "isopod", "sea pen", "vampire squid",
    ],
  },
  {
    id: "state",
    text: "Name a US state",
    answers: [
      "california", "texas", "florida", "new york", "hawaii", "alaska", "washington", "ohio",
      "colorado", "arizona", "nevada", "oregon", "georgia", "michigan", "illinois", "massachusetts",
      "pennsylvania", "new jersey", "virginia", "north carolina", "tennessee", "louisiana", "utah",
      "minnesota", "maine", "montana", "idaho", "kentucky", "alabama", "south carolina",
      "wisconsin", "missouri", "indiana", "iowa", "kansas", "oklahoma", "new mexico", "mississippi",
      "arkansas", "nebraska", "maryland", "connecticut", "vermont", "new hampshire", "wyoming",
      "west virginia", "rhode island", "delaware", "south dakota", "north dakota",
    ],
  },
  {
    id: "vegetable",
    text: "Name a vegetable",
    answers: [
      "carrot", "broccoli", "potato", "lettuce", "cucumber", "spinach", "onion", "corn",
      "pepper|bell pepper", "tomato", "celery", "pea|peas", "cauliflower", "cabbage", "green bean|green beans",
      "zucchini|courgette", "asparagus", "kale", "eggplant|aubergine", "sweet potato", "garlic",
      "brussels sprout|brussels sprouts", "beet|beetroot", "radish", "mushroom", "squash", "pumpkin",
      "artichoke", "leek", "okra", "turnip", "parsnip", "bok choy", "arugula|rocket", "chard|swiss chard",
      "fennel", "kohlrabi", "rutabaga|swede", "jicama", "daikon", "watercress", "endive",
      "celeriac", "salsify", "romanesco", "taro", "cassava|yuca", "bamboo shoot|bamboo shoots",
      "lotus root", "fiddlehead|fiddleheads", "sunchoke|jerusalem artichoke", "edamame", "shallot",
    ],
  },
  {
    id: "rhyme-cat",
    text: "Name a word that rhymes with \"cat\"",
    answers: [
      "hat", "bat", "rat", "mat", "sat", "fat", "pat", "that", "flat", "chat", "splat", "brat",
      "vat", "spat", "gnat", "scat", "slat", "tat", "drat", "at", "combat", "format", "acrobat",
      "habitat", "diplomat", "thermostat", "aristocrat", "democrat", "bureaucrat", "laundromat",
      "copycat", "wombat", "doormat", "nonfat", "dingbat", "fiat", "cravat", "caveat", "begat",
      "sprat", "plait", "matte", "pitapat", "hazmat", "autocrat", "technocrat",
    ],
  },
  {
    id: "board-game",
    text: "Name a board game",
    answers: [
      "monopoly", "chess", "scrabble", "checkers|draughts", "clue|cluedo", "risk", "sorry",
      "candy land|candyland", "catan|settlers of catan", "the game of life|life|game of life",
      "battleship", "trivial pursuit", "connect four|connect 4", "backgammon", "go",
      "chutes and ladders|snakes and ladders", "operation", "pictionary", "ticket to ride",
      "guess who", "mouse trap|mousetrap", "stratego", "pandemic", "carcassonne", "mancala",
      "parcheesi|ludo", "othello|reversi", "chinese checkers", "trouble", "codenames",
      "azul", "wingspan", "dominion", "splendor", "twilight imperium", "gloomhaven",
      "terraforming mars", "agricola", "puerto rico", "power grid", "hive", "blokus",
      "diplomacy", "axis and allies", "shogi", "xiangqi", "pente", "tak", "root", "brass",
    ],
  },
  {
    id: "breakfast",
    text: "Name a breakfast food",
    answers: [
      "eggs|egg", "pancakes|pancake", "bacon", "cereal", "waffles|waffle", "toast", "oatmeal|porridge",
      "french toast", "sausage", "bagel", "yogurt|yoghurt", "muffin", "omelette|omelet", "hash browns",
      "croissant", "granola", "fruit", "breakfast burrito", "biscuits and gravy|biscuits", "donut|doughnut",
      "smoothie", "avocado toast", "grits", "crepe|crepes", "eggs benedict", "scrambled eggs",
      "cinnamon roll", "quiche", "frittata", "shakshuka", "congee", "chilaquiles", "huevos rancheros",
      "porridge", "kippers", "black pudding", "blintz|blintzes", "dutch baby", "scone", "danish",
      "breakfast sandwich", "corned beef hash", "polenta", "idli", "dosa", "paratha", "natto",
      "baked beans", "menemen", "khachapuri", "kaya toast", "upma", "poha",
    ],
  },
  {
    id: "color",
    text: "Name a color",
    answers: [
      "blue", "red", "green", "purple", "yellow", "orange", "pink", "black", "white", "brown",
      "gray|grey", "teal", "turquoise", "magenta", "cyan", "violet", "indigo", "maroon", "beige",
      "lavender", "gold", "silver", "navy", "crimson", "coral", "lime", "olive", "tan", "salmon",
      "mauve", "burgundy", "scarlet", "aqua", "chartreuse", "periwinkle", "fuchsia", "cerulean",
      "vermilion", "ochre", "sienna", "umber", "taupe", "puce", "celadon", "viridian", "amaranth",
      "cobalt", "sepia", "mint", "peach", "ivory", "khaki", "plum", "rust", "sage", "eggplant",
    ],
  },
  {
    id: "language",
    text: "Name a programming language",
    answers: [
      "python", "javascript|js", "java", "c++|cpp", "c", "c#|c sharp|csharp", "rust", "go|golang",
      "typescript|ts", "ruby", "swift", "kotlin", "php", "html", "sql", "r", "scala", "perl",
      "haskell", "lua", "dart", "matlab", "assembly|asm", "bash|shell", "objective-c|objective c",
      "julia", "elixir", "clojure", "fortran", "cobol", "lisp|common lisp", "erlang", "f#|f sharp",
      "ocaml", "zig", "scheme", "prolog", "pascal", "basic|visual basic", "groovy", "nim",
      "smalltalk", "ada", "racket", "elm", "crystal", "d", "apl", "forth", "brainfuck", "idris",
      "coq|rocq", "agda", "vhdl", "verilog", "solidity", "gleam", "odin",
    ],
  },
  {
    id: "sport",
    text: "Name a sport played with a ball",
    answers: [
      "soccer|football", "basketball", "baseball", "tennis", "volleyball", "american football",
      "golf", "rugby", "cricket", "hockey|field hockey", "softball", "bowling", "table tennis|ping pong",
      "dodgeball", "lacrosse", "handball", "badminton", "water polo", "pickleball", "squash",
      "kickball", "racquetball", "polo", "billiards|pool|snooker", "netball", "croquet", "bocce",
      "dodge ball", "beach volleyball", "four square", "tetherball", "jai alai", "sepak takraw",
      "hurling", "gaelic football", "australian rules football|aussie rules", "korfball",
      "pelota", "kabaddi", "bandy", "underwater rugby", "goalball", "roundball", "padel",
      "teqball", "footvolley", "cornhole", "wiffle ball|wiffleball", "stickball", "petanque",
    ],
  },
  {
    id: "capital-asia",
    text: "Name a capital city in Asia",
    answers: [
      "tokyo", "beijing", "seoul", "bangkok", "new delhi|delhi", "manila", "jakarta", "hanoi",
      "singapore", "kuala lumpur", "taipei", "kabul", "tehran", "baghdad", "riyadh", "islamabad",
      "kathmandu", "dhaka", "ulaanbaatar|ulan bator", "pyongyang", "jerusalem", "doha", "abu dhabi",
      "beirut", "damascus", "amman", "phnom penh", "vientiane", "colombo|sri jayawardenepura kotte",
      "naypyidaw|naypyitaw", "tashkent", "astana|nur-sultan", "bishkek", "dushanbe", "ashgabat",
      "muscat", "sanaa", "kuwait city", "manama", "thimphu", "male", "dili",
      "bandar seri begawan", "baku", "tbilisi", "yerevan", "ankara", "nicosia",
    ],
  },
];

/** Lowercase, strip punctuation/articles so "The Netherlands!" ~ "netherlands". */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+#\s-]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(the|a|an) /, "");
}

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return dp[a.length][b.length];
}

/** Returns the canonical answer for a guess, or null if it isn't accepted. */
export function matchAnswer(prompt: Prompt, guess: string): string | null {
  const g = normalize(guess);
  if (!g) return null;
  const variants = [g, g.replace(/es$/, ""), g.replace(/s$/, "")];
  let fuzzy: string | null = null;
  for (const entry of prompt.answers) {
    const aliases = entry.split("|").map(normalize);
    const canonical = entry.split("|")[0];
    if (aliases.some((a) => variants.includes(a) || variants.includes(a.replace(/s$/, ""))))
      return canonical;
    if (!fuzzy && g.length >= 5 && aliases.some((a) => a.length >= 5 && editDistance(a, g) <= 1))
      fuzzy = canonical;
  }
  return fuzzy;
}

/** Zipf-ish fake crowd so early players see believable rarity. */
export function seedCounts(prompt: Prompt): Map<string, number> {
  const m = new Map<string, number>();
  prompt.answers.forEach((entry, i) => {
    m.set(entry.split("|")[0], Math.max(1, Math.round(1200 / Math.pow(i + 1, 1.25))));
  });
  return m;
}

/** Points: rarer = more. 50% share ≈ 12pts, 5% ≈ 52pts, 0.5% ≈ 92pts, cap 100. */
export function pointsFor(share: number): number {
  if (share <= 0) return 100;
  return Math.max(1, Math.min(100, Math.round(-Math.log10(share) * 40)));
}

export const ROUNDS = 7;
export const SECONDS_PER_ROUND = 25;

/** Same 7 prompts for everyone on a given day. */
export function dailyPrompts(date: string): Prompt[] {
  let h = 2166136261;
  for (const c of date) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  const pool = [...PROMPTS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, ROUNDS);
}
