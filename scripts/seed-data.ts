// Initial site content, taken from the resume (doc/resume-hunny-sindhakar-ui-ux.pdf),
// Behance (behance-snapshot.json) and Medium. After seeding, everything is edited in /admin.
import behance from "./behance-snapshot.json";

type BehanceProject = { name: string; url: string; published: number; tags: string[]; tools: string[]; images: string[] };
const be = behance as Record<string, BehanceProject>;

export const profile = {
  id: 1,
  name: "Hunny Sindhakar",
  alternate_names: ["Hunny Sindhkar"],
  headline: "UI/UX designer turning complex ideas into clean, intuitive digital products.",
  role: "Executive UI/UX Designer",
  company: "Bombay Softwares",
  company_url: "https://www.bombaysoftwares.com",
  location: "Ahmedabad, Gujarat",
  country: "India",
  email: "hunnysindhkar01@gmail.com",
  short_bio:
    "Design maverick on a mission to elevate digital aesthetics. I transform concepts into immersive user experiences for web and mobile.",
  long_bio:
    "I’m Hunny Sindhakar, a UI/UX designer passionate about crafting digital experiences that are as intuitive as they are beautiful. My design philosophy blends clarity, emotion and purpose, turning complex ideas into clean, functional and engaging user journeys.\n\nSince 2022 I’ve designed AI products, SaaS dashboards, HR and project-management tools, dating, taxi, matrimonial and e-commerce apps — first at Immence in Vadodara and now as Executive UI/UX Designer at Bombay Softwares in Ahmedabad. Before that I worked as a graphic designer, which still shapes my eye for typography, colour and detail.\n\nFrom wireframes to high-fidelity prototypes, I work in Figma, Adobe XD, Illustrator, Canva and LottieFiles, and I stay closely aligned with developers, product teams and stakeholders through Jira, Trello and Slack. Forever learning, always designing with purpose.",
  answer_block:
    "Hunny Sindhakar is a UI/UX designer based in Ahmedabad, India, working as Executive UI/UX Designer at Bombay Softwares. Since 2022 she has designed web and mobile products including an AI document-chat app (Botstream), HRM and project-management tools, and dating, taxi, matrimonial and e-commerce apps, using Figma, Adobe XD, Illustrator and LottieFiles.",
  photo_url: null,
  resume_url: null,
  availability: "open",
  availability_note: "Open to new opportunities and freelance projects",
  languages: ["English", "Hindi", "Marathi", "Gujarati"],
  core_skills: [
    "UI/UX Design (Web & Mobile)",
    "Wireframing & Prototyping",
    "Visual Design & Typography",
    "Design Systems & Components",
    "Icon Design & Microinteractions",
    "User-Centered Problem Solving",
    "Cross-Team Collaboration",
  ],
};

export const socialLinks = [
  { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/hunny-sindhakar", handle: "hunny-sindhakar", sort_order: 1 },
  { platform: "behance", label: "Behance", url: "https://www.behance.net/hunny-sindhakar", handle: "hunny-sindhakar", sort_order: 2 },
  { platform: "medium", label: "Medium", url: "https://medium.com/@hunnysindhakar", handle: "@hunnysindhakar", sort_order: 3 },
  { platform: "email", label: "Email", url: "mailto:hunnysindhkar01@gmail.com", handle: "hunnysindhkar01@gmail.com", sort_order: 4 },
];

export const experiences = [
  {
    company: "Bombay Softwares",
    role: "Executive – UI/UX Designer",
    location: "Ahmedabad, India",
    start_date: "2024-04-01",
    end_date: null,
    summary: "Leading UI/UX for AI, SaaS and consumer products across web and mobile.",
    bullets: [
      "Botstream: led UI/UX for an AI web app that summarises uploaded documents (PDF, CSV, databases, URLs) and lets users query a chatbot for simplified answers.",
      "Polls: designed a Gen Z dating app focused on intuitive navigation and interactive features.",
      "Sport betting analytics: designed a basketball web app that calculates winning risk with historical data and insights.",
      "PMO Tool and Task Planner: designed web tools for project management, task tracking and prioritisation.",
      "Taxi app: designed booking, live tracking and driver navigation flows.",
      "E-commerce redesign: led the redesign of an e-commerce platform to improve usability and conversion.",
      "Company website: designed several pages of the Bombay Softwares website.",
    ],
    sort_order: 1,
  },
  {
    company: "Immence",
    role: "UI/UX Designer",
    location: "Vadodara, India",
    start_date: "2022-10-01",
    end_date: "2024-02-29",
    summary: "Designed web and mobile products for international and white-label clients.",
    bullets: [
      "Drove the design of a matrimonial web app for a Melbourne-based client.",
      "Led the design of Immencer, a white-label HRM mobile and web app, with a user-centred, responsive interface.",
      "Created social media creatives and blog thumbnails that lifted brand engagement.",
    ],
    sort_order: 2,
  },
  {
    company: "Sayaji Advertisers",
    role: "Graphic Designer",
    location: "Vadodara, India",
    start_date: "2021-03-01",
    end_date: "2021-08-31",
    summary: "Print and social design for local brands and events.",
    bullets: [
      "Designed business cards, event posters and promotional material.",
      "Created social media posts, graphics and stickers aligned with brand aesthetics.",
    ],
    sort_order: 3,
  },
];

export const education = [
  { kind: "degree", title: "Bachelor of Commerce", institution: "Maharaja Sayajirao University of Baroda", location: "Vadodara, India", start_year: 2018, end_year: 2021, sort_order: 1 },
  { kind: "certification", title: "UI/UX Design", institution: "Weltec Institute", location: "Vadodara, India", start_year: null, end_year: 2022, sort_order: 2 },
  { kind: "certification", title: "Graphic Design", institution: "Arena Animation", location: "Vadodara, India", start_year: null, end_year: 2021, sort_order: 3 },
];

export const skills = [
  ["UI Design & Prototyping", ["Figma", "Adobe XD", "Canva"]],
  ["Iconography & Illustration", ["Adobe Illustrator", "Iconscout", "unDraw"]],
  ["Motion & Interaction", ["LottieFiles"]],
  ["Collaboration", ["Jira", "Trello", "Slack"]],
].flatMap(([group, names], g) =>
  (names as string[]).map((name, i) => ({ group_name: group as string, name, sort_order: g * 10 + i })),
);

export const faqs = [
  {
    question: "Who is Hunny Sindhakar?",
    answer: profile.answer_block,
  },
  {
    question: "What does Hunny Sindhakar design?",
    answer:
      "She designs web apps, mobile apps, SaaS dashboards and marketing websites — from research and wireframes to high-fidelity UI, prototypes, design systems and micro-interactions. Her work spans AI products, HR and project-management tools, fintech, dating, mobility, food delivery and e-commerce.",
  },
  {
    question: "Which design tools does she use?",
    answer:
      "Figma is her main tool for UI design, prototyping and design systems, alongside Adobe XD, Adobe Illustrator, Canva and LottieFiles for motion. She collaborates with developers and product teams through Jira, Trello and Slack.",
  },
  {
    question: "Where is Hunny Sindhakar based?",
    answer:
      "She is based in Ahmedabad, Gujarat, India, and works with teams in India and abroad — including clients in Australia. She is open to remote collaboration.",
  },
  {
    question: "Is Hunny available for work or freelance projects?",
    answer:
      "Yes. She is open to new opportunities and select freelance UI/UX projects. The quickest way to reach her is the contact form on this site or email at hunnysindhkar01@gmail.com.",
  },
  {
    question: "Which languages does she speak?",
    answer: "English, Hindi, Marathi and Gujarati.",
  },
].map((f, i) => ({ ...f, sort_order: i + 1 }));

export const posts = [
  {
    title: "UI vs. UX: If You Think They’re the Same, Read This!",
    url: "https://medium.com/@hunnysindhakar/ui-vs-ux-if-you-think-theyre-the-same-read-this-acd291ff513d",
    source: "medium",
    excerpt:
      "UI is how something looks; UX is how it feels when you use it. A simple, café-and-delivery-app guide to why great products need both.",
    cover_source: "https://cdn-images-1.medium.com/max/1024/1*sz7d4jqhvhoq0RgA3N3rRQ.png",
    published_at: "2025-03-25T15:00:32Z",
  },
];

export const aiLinks = [
  { name: "ChatGPT", url_template: "https://chatgpt.com/?q={prompt}" },
  { name: "Claude", url_template: "https://claude.ai/new?q={prompt}" },
  { name: "Perplexity", url_template: "https://www.perplexity.ai/search?q={prompt}" },
  { name: "Gemini", url_template: "https://www.google.com/search?udm=50&q={prompt}" },
  { name: "Grok", url_template: "https://grok.com/?q={prompt}" },
  { name: "Copilot", url_template: "https://copilot.microsoft.com/?q={prompt}" },
].map((a, i) => ({ ...a, sort_order: i + 1 }));

export const settings = {
  ask_ai_prompt:
    "Who is Hunny Sindhakar, the UI/UX designer from Ahmedabad, India? Summarise her experience, skills and best work using {url}",
  seo_default_title: "Hunny Sindhakar — UI/UX Designer in Ahmedabad, India",
  seo_default_description:
    "Portfolio of Hunny Sindhakar, UI/UX designer at Bombay Softwares, Ahmedabad. Case studies in AI, SaaS, HR, fintech and mobile app design.",
  hero_kicker: "UI/UX Designer · Ahmedabad, India",
  hero_statement: "Design maverick on a mission to elevate digital aesthetics.",
  hero_comment: "Let’s create something extraordinary together.",
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

type SeedProject = {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  kind: "case-study" | "concept" | "graphic";
  company?: string;
  client?: string;
  role?: string;
  year?: number;
  platforms: string[];
  summary: string;
  problem?: string;
  process?: string;
  solution?: string;
  outcome?: string;
  highlights?: string[];
  accent?: string;
  tags: string[];
  tools: string[];
  behanceId?: string;
  featured?: boolean;
};

const fromBehance = (id: string) => ({
  external_url: be[id].url,
  year: new Date(be[id].published * 1000).getFullYear(),
  images: be[id].images,
});

const projectList: SeedProject[] = [
  // --- Professional case studies (resume) ---------------------------------
  {
    slug: "botstream-ai-document-assistant",
    title: "Botstream",
    subtitle: "AI assistant that reads your documents and answers in plain language",
    category: "AI Product",
    kind: "case-study",
    company: "Bombay Softwares",
    role: "Lead UI/UX Designer",
    platforms: ["Web app"],
    summary:
      "Led the UI/UX for an AI-driven web app that summarises uploaded documents — PDFs, CSVs, databases and URLs — and lets users ask a chatbot for simplified answers.",
    problem:
      "Teams sit on long reports, spreadsheets and knowledge bases that take hours to read. The challenge was to make an AI tool that feels trustworthy and simple for non-technical users: upload anything, get a clear summary, and ask follow-up questions.",
    process:
      "Mapped the core journey (connect a source → processing → summary → conversation), studied chat-first AI products, and wireframed upload, source management and chat states. Iterated high-fidelity screens in Figma with the product and engineering teams.",
    solution:
      "A clean workspace with one entry point for every source type, clear processing feedback, a structured summary view, and a chat interface that keeps answers anchored to the uploaded source.",
    outcome: "Designed the end-to-end product experience from onboarding to chat, handed off to engineering with a reusable component set.",
    highlights: ["Multi-source upload (PDF, CSV, database, URL)", "Summary + chat in one workspace", "Clear AI processing states"],
    accent: "#7C5CFF",
    tags: ["AI", "Chatbot", "SaaS", "Web app"],
    tools: ["Figma"],
    featured: true,
  },
  {
    slug: "immencer-hrm-app",
    title: "Immencer HRM",
    subtitle: "White-label HR management for mobile and web",
    category: "SaaS · HR",
    kind: "case-study",
    company: "Immence",
    role: "Lead UI/UX Designer",
    platforms: ["Mobile app", "Web app"],
    summary:
      "Led the design of Immencer, a white-label HRM product for mobile and web, with a modern, responsive, user-centred interface.",
    problem:
      "HR tools are often dense and dated. As a white-label product, Immencer also had to look right under any client’s brand while staying easy for employees and HR admins.",
    process:
      "Defined employee and admin journeys (attendance, leave, profiles, approvals), built wireframes for mobile and web, and created a themeable component system so each client brand could be applied quickly.",
    solution:
      "A consistent HRM experience across phone and desktop, with a brand-ready design system and simplified everyday flows for employees.",
    outcome: "Delivered the mobile and web UI plus a themeable component library for white-label rollouts.",
    highlights: ["White-label theming", "Mobile + web parity", "Employee and admin journeys"],
    accent: "#00B2A9",
    tags: ["HRM", "SaaS", "White-label", "Design system"],
    tools: ["Figma", "Adobe Illustrator"],
    featured: true,
  },
  {
    slug: "sport-betting-analytics",
    title: "Sport Betting Analytics",
    subtitle: "Basketball analytics that estimates each team’s winning risk",
    category: "Sports · Data",
    kind: "case-study",
    company: "Bombay Softwares",
    role: "UI/UX Designer",
    platforms: ["Web app"],
    summary:
      "Designed a basketball-focused web app that calculates winning risk for teams and presents historical data and insights for strategic decisions.",
    problem: "Bettors and analysts need to read a lot of numbers fast. The UI had to make risk and history scannable without oversimplifying the data.",
    process: "Prioritised the key decisions users make before a game, then designed data-dense dashboards, comparisons and team detail views.",
    solution: "Clear risk indicators, head-to-head comparisons and historical trends organised around the upcoming match.",
    highlights: ["Risk visualisation", "Historical insights", "Data-dense dashboards"],
    accent: "#FF7A1A",
    tags: ["Dashboard", "Data visualisation", "Sports"],
    tools: ["Figma"],
  },
  {
    slug: "polls-gen-z-dating-app",
    title: "Polls",
    subtitle: "A playful dating app for Gen Z",
    category: "Social · Dating",
    kind: "case-study",
    company: "Bombay Softwares",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "Designed a dating app for Gen Z users, focused on intuitive navigation and interactive, poll-driven features.",
    problem: "Gen Z users expect dating apps to feel social and fun, not like filling in forms.",
    process: "Explored interaction patterns from social apps Gen Z already loves and prototyped quick, gesture-friendly flows.",
    solution: "Interactive polls as conversation starters, simple navigation and a bold, expressive visual style.",
    highlights: ["Poll-based interactions", "Gesture-friendly navigation"],
    accent: "#FF4D8D",
    tags: ["Mobile", "Dating", "Gen Z"],
    tools: ["Figma", "LottieFiles"],
  },
  {
    slug: "matrimonial-web-app",
    title: "Matrimonial Platform",
    subtitle: "Matchmaking web app for a Melbourne-based client",
    category: "Social · Matchmaking",
    kind: "case-study",
    company: "Immence",
    client: "Melbourne, Australia",
    role: "UI/UX Designer",
    platforms: ["Web app"],
    summary:
      "Drove the design of a matrimonial web app for a Melbourne-based client, balancing trust, cultural context and a visually rich experience.",
    problem: "Matrimonial platforms depend on trust: profiles, privacy and family involvement all need careful design.",
    process: "Studied the client’s audience, mapped profile creation, discovery and connection flows, and designed trust-building UI patterns.",
    solution: "A warm, visually compelling experience with detailed profiles, focused search and clear privacy controls.",
    highlights: ["Trust-first profile design", "International client"],
    accent: "#C2185B",
    tags: ["Web app", "Matchmaking"],
    tools: ["Figma", "Adobe XD"],
  },
  {
    slug: "taxi-booking-app",
    title: "Taxi App",
    subtitle: "Booking, live tracking and driver navigation",
    category: "Mobility",
    kind: "case-study",
    company: "Bombay Softwares",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "Created a seamless experience for booking rides, tracking them live and guiding drivers.",
    problem: "Riders and drivers use the product under time pressure; every extra tap matters.",
    process: "Designed rider and driver journeys side by side so both apps stay in sync at every ride state.",
    solution: "Quick booking, clear live-tracking states and a focused driver navigation view.",
    highlights: ["Rider + driver apps", "Real-time ride states"],
    accent: "#FFC400",
    tags: ["Mobile", "Mobility", "Maps"],
    tools: ["Figma"],
  },
  {
    slug: "ecommerce-redesign",
    title: "E-commerce Redesign",
    subtitle: "Redesigning an online store for usability and conversion",
    category: "E-commerce",
    kind: "case-study",
    company: "Bombay Softwares",
    role: "Lead UI/UX Designer",
    platforms: ["Web", "Mobile web"],
    summary: "Led the redesign of an e-commerce platform to improve usability and conversion.",
    problem: "The old store made products hard to find and checkout long, which cost sales.",
    process: "Audited the existing journey, identified friction in browsing and checkout, and redesigned key templates.",
    solution: "Cleaner navigation, clearer product pages and a shorter checkout.",
    highlights: ["UX audit", "Checkout simplification"],
    accent: "#2E7D32",
    tags: ["E-commerce", "Redesign", "Conversion"],
    tools: ["Figma"],
  },
  {
    slug: "pmo-project-management-tool",
    title: "PMO Tool",
    subtitle: "Project management for delivery teams",
    category: "SaaS · Productivity",
    kind: "case-study",
    company: "Bombay Softwares",
    role: "UI/UX Designer",
    platforms: ["Web app"],
    summary: "Designed user-friendly interfaces for a web-based project management tool, improving task organisation and collaboration.",
    highlights: ["Task organisation", "Team collaboration"],
    accent: "#3D5AFE",
    tags: ["SaaS", "Productivity"],
    tools: ["Figma"],
  },
  {
    slug: "task-planner-app",
    title: "Task Planner",
    subtitle: "Daily planning with tracking and priorities",
    category: "Productivity",
    kind: "case-study",
    company: "Bombay Softwares",
    role: "UI/UX Designer",
    platforms: ["Web app"],
    summary: "Created a daily task management web app with task tracking and prioritisation.",
    highlights: ["Prioritisation", "Daily view"],
    accent: "#00897B",
    tags: ["Productivity", "Web app"],
    tools: ["Figma"],
  },
  // --- Behance concept work ----------------------------------------------
  {
    slug: "stock-prediction-app",
    title: "Stock Prediction App",
    subtitle: "Dark-theme investing app with market predictions",
    category: "Fintech",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "A dark-theme mobile app for tracking popular stocks, funding a wallet and exploring price predictions.",
    accent: "#8B5CF6",
    tags: be["221786403"].tags,
    tools: be["221786403"].tools,
    behanceId: "221786403",
    featured: true,
  },
  {
    slug: "compliance-management-platform",
    title: "Compliance Management Platform",
    subtitle: "SaaS dashboard for tracking compliance",
    category: "SaaS · Web",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Web app"],
    summary: "A web platform that helps organisations manage compliance tasks, documents and status from one dashboard.",
    accent: "#4F46E5",
    tags: be["221784601"].tags,
    tools: be["221784601"].tools,
    behanceId: "221784601",
    featured: true,
  },
  {
    slug: "driver-safety-solution",
    title: "Driver Safety Solution",
    subtitle: "Website for AI helmet-detection technology",
    category: "Web · Safety",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Website"],
    summary: "A bold marketing website for a road-safety product that uses helmet detection to protect riders.",
    accent: "#7CCB2B",
    tags: be["209049655"].tags,
    tools: be["209049655"].tools,
    behanceId: "209049655",
    featured: true,
  },
  {
    slug: "chatbot-ai-landing-page",
    title: "Chatbot AI",
    subtitle: "Landing page: build a chatbot on your own business data",
    category: "AI · Web",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Website"],
    summary: "A landing page for an AI product that lets businesses create chatbots trained on their own data, with industry use cases.",
    accent: "#14B8A6",
    tags: be["208869417"].tags,
    tools: be["208869417"].tools,
    behanceId: "208869417",
  },
  {
    slug: "food-delivery-app",
    title: "Food Delivery App",
    category: "Food · Mobile",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "A food delivery app concept covering discovery, restaurant menus, cart and order tracking.",
    accent: "#FF5722",
    tags: be["221785563"].tags,
    tools: be["221785563"].tools,
    behanceId: "221785563",
    featured: true,
  },
  {
    slug: "meditation-app",
    title: "Meditation App",
    category: "Wellness · Mobile",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "A calm meditation and yoga app concept with guided sessions and a soothing visual language.",
    accent: "#6D9886",
    tags: be["221786023"].tags,
    tools: be["221786023"].tools,
    behanceId: "221786023",
  },
  {
    slug: "social-media-app",
    title: "Social Media App",
    category: "Social · Mobile",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "A social media app concept with feed, stories, profiles and messaging.",
    accent: "#E1306C",
    tags: be["221786173"].tags,
    tools: be["221786173"].tools,
    behanceId: "221786173",
  },
  {
    slug: "event-management-app",
    title: "Event Management App",
    category: "Events · Mobile",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "An app concept for discovering events, booking tickets and managing plans.",
    accent: "#F59E0B",
    tags: be["221785341"].tags,
    tools: be["221785341"].tools,
    behanceId: "221785341",
  },
  {
    slug: "laundry-service-app",
    title: "Laundry Service App",
    category: "Services · Mobile",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "An on-demand laundry app concept for scheduling pickups, choosing services and tracking orders.",
    accent: "#0EA5E9",
    tags: be["221785739"].tags,
    tools: be["221785739"].tools,
    behanceId: "221785739",
  },
  {
    slug: "tree-identification-app",
    title: "Tree Identification App",
    category: "Nature · Mobile",
    kind: "concept",
    role: "UI/UX Designer",
    platforms: ["Mobile app"],
    summary: "An app concept that identifies trees from a photo and shares details about each species.",
    accent: "#16A34A",
    tags: be["221786585"].tags,
    tools: be["221786585"].tools,
    behanceId: "221786585",
  },
  {
    slug: "book-cover-live-the-now",
    title: "Book Cover — Live The Now",
    category: "Graphic Design",
    kind: "graphic",
    role: "Graphic Designer",
    platforms: ["Print"],
    summary:
      "A minimal, modern book cover for a book about the transformative power of living in the present moment.",
    accent: "#A1887F",
    tags: be["209059019"].tags,
    tools: be["209059019"].tools,
    behanceId: "209059019",
  },
  {
    slug: "craft-tape-mockup",
    title: "Craft Tape Mockup",
    category: "Branding",
    kind: "graphic",
    role: "Graphic Designer",
    platforms: ["Print"],
    summary: "A branded craft tape mockup for stationery and packaging.",
    accent: "#B7791F",
    tags: be["218367727"].tags,
    tools: be["218367727"].tools,
    behanceId: "218367727",
  },
];

export const projects: (SeedProject & { external_url?: string; year?: number; images?: string[] })[] = projectList.map((p) =>
  p.behanceId ? { ...p, ...fromBehance(p.behanceId) } : p,
);
