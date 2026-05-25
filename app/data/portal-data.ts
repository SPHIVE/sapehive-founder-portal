export const PORTAL_PASSWORD = "sapehive2025";

export const MOTIVATIONAL_QUOTES = [
  { text: "The best startups begin with the audacity to believe you can change the world.", author: "Paul Graham" },
  { text: "Move fast and break things — then build something that lasts forever.", author: "Sapehive Creed" },
  { text: "We are here to put a dent in the universe. Otherwise why else even be here?", author: "Steve Jobs" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "Build things that matter. Obsess over users. Ship relentlessly.", author: "YC Motto" },
  { text: "A startup is a company designed to grow fast. Everything else follows.", author: "Paul Graham" },
  { text: "Vision without execution is hallucination. Execute with precision.", author: "Sapehive Creed" },
  { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs" },
  { text: "It's not about ideas. It's about making ideas happen.", author: "Scott Belsky" },
  { text: "Do or do not. There is no try. We do.", author: "Sapehive Creed" },
];

export const VISION_STATEMENT = "Sapehive is building the intelligence layer for the next generation of human collaboration — where every team thinks, moves, and creates at the speed of thought.";

export const MISSION_STATEMENT = "We exist to eliminate friction between human ideas and their execution. Our platform is the hive mind that makes great teams legendary.";

export const WHY_WE_STARTED = "We built Sapehive because we lived the pain of building in silos. We saw brilliant people in brilliant teams fail because information didn't flow, decisions weren't aligned, and context was always lost. We decided enough was enough. The future of work deserves better tools — and we're here to build them.";

export const STARTUP_PHILOSOPHY = [
  { title: "Ship or Die", body: "Speed is everything in the early days. A shipped product with flaws beats a perfect product never launched." },
  { title: "User Obsession", body: "Every decision starts with the user. Every sprint ends with a user conversation. No exceptions." },
  { title: "Long-Term Thinking", body: "We optimize for decades, not quarters. The compounding of good decisions is our moat." },
  { title: "Radical Transparency", body: "We share everything internally. No hidden agendas. No politics. Just truth and trust." },
  { title: "Brutal Focus", body: "We say no to 99 things to say a legendary yes to the one that matters most right now." },
];

export const YC_MILESTONES = [
  { id: "idea", label: "Idea", description: "The spark that started it all", icon: "💡", completed: true },
  { id: "mvp", label: "MVP", description: "First working version shipped", icon: "🛠️", completed: true },
  { id: "users", label: "Users", description: "First 100 real users onboarded", icon: "👥", completed: false, current: true },
  { id: "revenue", label: "Revenue", description: "First dollar earned", icon: "💰", completed: false },
  { id: "yc", label: "YC", description: "Y Combinator acceptance", icon: "🚀", completed: false },
];

export const TEAM_GOALS = {
  weekly: [
    { id: "w1", text: "Launch beta to 50 waitlist users", progress: 75, done: false },
    { id: "w2", text: "Complete onboarding flow redesign", progress: 90, done: false },
    { id: "w3", text: "Fix top 5 critical bugs from feedback", progress: 60, done: false },
    { id: "w4", text: "Conduct 10 user interviews", progress: 40, done: false },
  ],
  monthly: [
    { id: "m1", text: "Reach 500 active users", progress: 35, done: false },
    { id: "m2", text: "Ship analytics dashboard v1", progress: 50, done: false },
    { id: "m3", text: "Close first 3 paying customers", progress: 20, done: false },
    { id: "m4", text: "YC application submission", progress: 80, done: false },
  ],
  longterm: [
    { id: "l1", text: "$1M ARR milestone", progress: 5, done: false },
    { id: "l2", text: "Series A fundraise", progress: 10, done: false },
    { id: "l3", text: "10,000 teams on platform", progress: 3, done: false },
    { id: "l4", text: "International expansion — 10 markets", progress: 0, done: false },
  ],
};

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "🚀 Beta Launch is LIVE",
    body: "We just opened the doors to our first 50 beta users. Monitor feedback religiously. Every bug is a gift. Every compliment is fuel.",
    author: "Founder",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    pinned: true,
    type: "milestone" as const,
  },
  {
    id: "a2",
    title: "📋 YC Application — Final Sprint",
    body: "We're 3 weeks out from the YC deadline. The next 21 days define the next 21 years. Stay focused. Stay hungry. Ship.",
    author: "Founder",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    pinned: false,
    type: "founder" as const,
  },
  {
    id: "a3",
    title: "💡 Product Insight from User Calls",
    body: "Top feedback theme: users want collaboration features before analytics. Adjusting roadmap priority. Real-time co-editing moves to Sprint 4.",
    author: "Product",
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    pinned: false,
    type: "update" as const,
  },
];

export const MUSIC_TRACKS = [
  {
    id: "t1",
    title: "Midnight Blueprint",
    mood: "Deep Focus",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7b3dc7d0d5.mp3",
  },
  {
    id: "t2",
    title: "Silicon Horizon",
    mood: "Visionary",
    url: "https://cdn.pixabay.com/download/audio/2022/01/27/audio_d0c6ff1bca.mp3",
  },
  {
    id: "t3",
    title: "Late Night Build",
    mood: "Late-Night Coding",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    id: "t4",
    title: "Founder's March",
    mood: "Motivational",
    url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_5e50870562.mp3",
  },
];
