// Field definitions that drive the generic admin editors.
// Adding a column to a table only needs a new entry here to become editable.

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "list"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "image"
  | "file"
  | "url"
  | "json";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  wide?: boolean;
};

export type Collection = {
  table: string;
  title: string;
  singular: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  orderBy: string;
  sortable: boolean;
  fields: Field[];
};

export const collections = {
  projects: {
    table: "projects",
    title: "Projects",
    singular: "Project",
    description: "Case studies, concept projects and graphic work shown on /work.",
    titleField: "title",
    subtitleField: "category",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, help: "Used in /work/<slug>. Lowercase, dashes only." },
      { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft (hidden)" }, { value: "published", label: "Published" }] },
      { name: "featured", label: "Featured on home page", type: "boolean" },
      { name: "kind", label: "Type", type: "select", options: [{ value: "case-study", label: "Case study (client/company work)" }, { value: "concept", label: "Concept project" }, { value: "graphic", label: "Graphic design" }] },
      { name: "category", label: "Category", type: "text", required: true, placeholder: "AI Product, Fintech, SaaS · HR…" },
      { name: "subtitle", label: "Subtitle", type: "text", wide: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, wide: true, help: "1–2 sentences. Shown on cards, in search results and to AI engines." },
      { name: "company", label: "Company", type: "text" },
      { name: "client", label: "Client", type: "text" },
      { name: "role", label: "Your role", type: "text" },
      { name: "year", label: "Year", type: "number" },
      { name: "platforms", label: "Platforms", type: "list", help: "One per line: Web app, Mobile app…" },
      { name: "tools", label: "Tools", type: "list" },
      { name: "tags", label: "Tags", type: "list" },
      { name: "accent", label: "Accent colour", type: "text", placeholder: "#7C5CFF", help: "Used for the generated cover when there are no images." },
      { name: "problem", label: "What was the problem?", type: "textarea", wide: true },
      { name: "process", label: "How did you approach it?", type: "textarea", wide: true },
      { name: "solution", label: "What was the solution?", type: "textarea", wide: true },
      { name: "outcome", label: "What was the outcome?", type: "textarea", wide: true },
      { name: "highlights", label: "Highlights", type: "list", wide: true },
      { name: "metrics", label: "Metrics", type: "json", wide: true, help: 'List of {"label": "Conversion", "value": "+18%"}. Leave [] if none.' },
      { name: "cover_url", label: "Cover image", type: "image", wide: true },
      { name: "cover_alt", label: "Cover alt text", type: "text", wide: true },
      { name: "gallery", label: "Gallery", type: "json", wide: true, help: "Managed with the gallery uploader above." },
      { name: "external_url", label: "External link (Behance, live site)", type: "url", wide: true },
      { name: "seo_title", label: "SEO title (optional)", type: "text", wide: true },
      { name: "seo_description", label: "SEO description (optional)", type: "textarea", wide: true },
    ],
  },
  experiences: {
    table: "experiences",
    title: "Experience",
    singular: "Role",
    description: "Work history on /about, /resume and the home page.",
    titleField: "company",
    subtitleField: "role",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "company", label: "Company", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start date", type: "date", required: true },
      { name: "end_date", label: "End date", type: "date", help: "Leave empty for current role." },
      { name: "summary", label: "Summary", type: "textarea", wide: true },
      { name: "bullets", label: "Achievements", type: "list", wide: true, help: "One per line." },
    ],
  },
  education: {
    table: "education",
    title: "Education & certifications",
    singular: "Entry",
    description: "Degrees and certifications.",
    titleField: "title",
    subtitleField: "institution",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "kind", label: "Type", type: "select", options: [{ value: "degree", label: "Degree" }, { value: "certification", label: "Certification" }] },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "start_year", label: "Start year", type: "number" },
      { name: "end_year", label: "End year", type: "number" },
    ],
  },
  skills: {
    table: "skills",
    title: "Toolkit",
    singular: "Tool",
    description: "Tools grouped by category.",
    titleField: "name",
    subtitleField: "group_name",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "name", label: "Tool / skill", type: "text", required: true },
      { name: "group_name", label: "Group", type: "text", required: true, placeholder: "UI Design & Prototyping" },
    ],
  },
  testimonials: {
    table: "testimonials",
    title: "Testimonials",
    singular: "Testimonial",
    description: "Quotes from colleagues and clients. Hidden until marked visible.",
    titleField: "name",
    subtitleField: "company",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "quote", label: "Quote", type: "textarea", required: true, wide: true },
      { name: "avatar_url", label: "Photo", type: "image", wide: true },
      { name: "visible", label: "Visible on site", type: "boolean" },
    ],
  },
  faqs: {
    table: "faqs",
    title: "FAQ",
    singular: "Question",
    description: "Answers shown on the home page and to search/AI engines (FAQ schema).",
    titleField: "question",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "question", label: "Question", type: "text", required: true, wide: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, wide: true, help: "Start with the direct answer in the first sentence." },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  posts: {
    table: "posts",
    title: "Writing",
    singular: "Article",
    description: "Articles linked from /writing (Medium or elsewhere).",
    titleField: "title",
    subtitleField: "source",
    orderBy: "published_at",
    sortable: false,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "url", label: "Article URL", type: "url", required: true, wide: true },
      { name: "source", label: "Source", type: "text", placeholder: "medium" },
      { name: "published_at", label: "Published", type: "date" },
      { name: "excerpt", label: "Excerpt", type: "textarea", wide: true },
      { name: "cover_url", label: "Cover", type: "image", wide: true },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  social_links: {
    table: "social_links",
    title: "Social links",
    singular: "Link",
    description: "Profiles linked in the footer, about page and schema (sameAs).",
    titleField: "label",
    subtitleField: "url",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "platform", label: "Platform key", type: "text", required: true, placeholder: "linkedin, behance, dribbble…" },
      { name: "url", label: "URL", type: "url", required: true, wide: true },
      { name: "handle", label: "Handle", type: "text" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  ai_links: {
    table: "ai_links",
    title: "Ask-AI buttons",
    singular: "AI button",
    description: "Footer buttons that open an AI assistant with a question about Hunny. {prompt} is replaced by the prompt from Settings.",
    titleField: "name",
    subtitleField: "url_template",
    orderBy: "sort_order",
    sortable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "url_template", label: "URL template", type: "text", required: true, wide: true, placeholder: "https://chatgpt.com/?q={prompt}" },
      { name: "enabled", label: "Enabled", type: "boolean" },
    ],
  },
} satisfies Record<string, Collection>;

export type CollectionKey = keyof typeof collections;

export const isCollectionKey = (key: string): key is CollectionKey => key in collections;

// Single-row forms.
export const profileFields: Field[] = [
  { name: "name", label: "Full name", type: "text", required: true },
  { name: "alternate_names", label: "Other spellings", type: "list", help: "One per line. Helps Google/AI link profiles that use a different spelling." },
  { name: "role", label: "Job title", type: "text", required: true },
  { name: "company", label: "Current company", type: "text" },
  { name: "company_url", label: "Company website", type: "url" },
  { name: "location", label: "City, State", type: "text", required: true },
  { name: "email", label: "Public email", type: "text", required: true },
  {
    name: "availability",
    label: "Availability",
    type: "select",
    options: [
      { value: "open", label: "Open to opportunities" },
      { value: "freelance", label: "Freelance only" },
      { value: "busy", label: "Not available" },
    ],
  },
  { name: "availability_note", label: "Availability note", type: "text", wide: true },
  { name: "headline", label: "Headline", type: "text", required: true, wide: true },
  { name: "short_bio", label: "Short bio", type: "textarea", required: true, wide: true },
  {
    name: "answer_block",
    label: "“Who is Hunny?” answer (AEO)",
    type: "textarea",
    required: true,
    wide: true,
    help: "40–60 words, third person, facts first. Search engines and AI assistants quote this.",
  },
  { name: "long_bio", label: "Full bio (About page)", type: "textarea", required: true, wide: true, help: "Separate paragraphs with a blank line." },
  { name: "core_skills", label: "Core skills", type: "list", wide: true },
  { name: "languages", label: "Languages", type: "list" },
  { name: "photo_url", label: "Profile photo", type: "image", wide: true },
  { name: "resume_url", label: "Resume PDF", type: "file", wide: true },
];

export const settingsFields: Field[] = [
  { name: "hero_kicker", label: "Hero kicker", type: "text", wide: true },
  { name: "hero_statement", label: "Hero statement", type: "textarea", wide: true },
  { name: "hero_comment", label: "Hero comment bubble", type: "text", wide: true },
  { name: "seo_default_title", label: "Default SEO title", type: "text", wide: true, help: "≈ 50–60 characters." },
  { name: "seo_default_description", label: "Default SEO description", type: "textarea", wide: true, help: "≈ 140–160 characters." },
  {
    name: "ask_ai_prompt",
    label: "Ask-AI prompt",
    type: "textarea",
    wide: true,
    help: "Question sent to ChatGPT, Claude, etc. from the footer. {url} becomes the site address.",
  },
];
