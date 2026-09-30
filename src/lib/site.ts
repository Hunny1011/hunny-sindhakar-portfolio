export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Builds an "Ask AI" link: the prompt template's {url} becomes the site URL, then the prompt fills {prompt}.
export function buildAskAiUrl(urlTemplate: string, promptTemplate: string) {
  const prompt = promptTemplate.replaceAll("{url}", SITE_URL);
  return urlTemplate.replaceAll("{prompt}", encodeURIComponent(prompt));
}
