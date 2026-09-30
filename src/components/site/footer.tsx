import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildAskAiUrl } from "@/lib/site";
import type { AiLink, Profile, SiteSettings, SocialLink } from "@/lib/types";
import { AiGlyph, SocialIcon } from "./icons";
import { PAGES } from "./nav";
import { TrackedLink } from "./tracked-link";
import { CopyEmail } from "./copy-email";

export function Footer({
  profile,
  socials,
  aiLinks,
  settings,
}: {
  profile: Profile;
  socials: SocialLink[];
  aiLinks: AiLink[];
  settings: SiteSettings;
}) {
  const year = new Date().getFullYear();
  const [first, ...rest] = profile.name.split(" ");
  return (
    <footer className="footer" data-layer="Footer">
      <div className="footer__inner">
        {aiLinks.length > 0 && (
          <section className="ask-ai" aria-labelledby="ask-ai-title">
            <div>
              <h2 id="ask-ai-title" className="ask-ai__title">
                Ask AI about <em>{first}</em>
              </h2>
              <p className="ask-ai__sub">Opens your assistant with a ready-made question about her work.</p>
            </div>
            <ul className="ask-ai__list">
              {aiLinks.map((ai) => (
                <li key={ai.id}>
                  <TrackedLink
                    className="ai-btn"
                    href={buildAskAiUrl(ai.url_template, settings.ask_ai_prompt)}
                    target="_blank"
                    rel="noopener"
                    event="ask_ai_click"
                    params={{ ai: ai.name, from: "footer" }}
                  >
                    <AiGlyph name={ai.name} />
                    {ai.name}
                    <ArrowUpRight className="ai-btn__ext" aria-hidden />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="footer__grid">
          <div>
            <p className="footer__big">
              {first} <em>{rest.join(" ")}</em>
            </p>
          </div>
          <nav aria-label="Footer">
            <h2 className="footer__h">Pages</h2>
            <ul className="footer__list">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="footer__h">Elsewhere</h2>
            <ul className="footer__list">
              {socials
                .filter((s) => s.platform !== "email")
                .map((s) => (
                  <li key={s.id}>
                    <TrackedLink href={s.url} target="_blank" rel="noopener me" event="social_click" params={{ platform: s.platform }}>
                      <SocialIcon platform={s.platform} />
                      {s.label}
                    </TrackedLink>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="footer__h">Say hello</h2>
            <ul className="footer__list">
              <li>
                <a href={`mailto:${profile.email}`} className="break-all">
                  {profile.email}
                </a>
              </li>
              <li>
                <CopyEmail email={profile.email} from="footer" className="" />
              </li>
              <li>
                <span className="text-[14px] text-ink-3">
                  {profile.location}, {profile.country}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__legal">
          <span>
            Designed by {profile.name} · © {year}
          </span>
          <span>Built as a live canvas — press ⌘K or I</span>
        </div>
      </div>
    </footer>
  );
}
