import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDuration, formatMonth } from "@/lib/format";
import type { Experience, Faq, Profile, Skill } from "@/lib/types";
import { CopyEmail } from "./copy-email";
import { ComponentGlyph, InstanceGlyph } from "./icons";
import { Statement } from "./statement";
import { StatusPill } from "./status-pill";
import { toneAt } from "./tones";

/** Experience as a version-history timeline. */
export function ExperienceList({ items, detailed = false, headingLevel = "h3" }: { items: Experience[]; detailed?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ol className="history">
      {items.map((e, i) => (
        <li key={e.id} className="history__item" data-current={!e.end_date} data-tone={toneAt(i + 1)}>
          <span className="history__dot" aria-hidden />
          <p className="history__when">
            {!e.end_date && <b>Current version</b>}
            <time dateTime={e.start_date}>{formatMonth(e.start_date)}</time> —{" "}
            {e.end_date ? <time dateTime={e.end_date}>{formatMonth(e.end_date)}</time> : "Present"}
            <br />
            {formatDuration(e.start_date, e.end_date)}
          </p>
          <div>
            <H className="history__role">{e.role}</H>
            <p className="history__co">
              {e.company}
              {e.location && <span> · {e.location}</span>}
            </p>
            {e.summary && <p className="history__sum">{e.summary}</p>}
            {detailed && e.bullets.length > 0 && (
              <ul className="history__bullets">
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Skills grouped as Figma-like component sets. */
export function SkillSets({ skills, headingLevel = "h3" }: { skills: Skill[]; headingLevel?: "h3" | "h4" }) {
  const H = headingLevel;
  const groups = new Map<string, Skill[]>();
  for (const s of skills) groups.set(s.group_name, [...(groups.get(s.group_name) ?? []), s]);
  return (
    <div className="sets">
      {[...groups].map(([group, list], i) => (
        <div key={group} data-tone={toneAt(i)}>
          <H className="set__label">
            <ComponentGlyph />
            {group}
          </H>
          <ul className="set__box">
            {list.map((s) => (
              <li key={s.id} className="instance">
                <InstanceGlyph />
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function CoreSkills({ items }: { items: string[] }) {
  return (
    <ol className="core">
      {items.map((s, i) => (
        <li key={s} data-tone={toneAt(i)}>
          {s}
        </li>
      ))}
    </ol>
  );
}

/** Accessible disclosure list (native details/summary). */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={f.id} name="faq" data-tone={toneAt(i)}>
          <summary>
            <span className="faq__n" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="m-0 font-[inherit] text-[length:inherit]">{f.question}</h3>
          </summary>
          <div className="faq__a">
            <p>{f.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** Honey sticky note call-to-action. */
export function ContactNote({ profile, text, id = "contact-cta" }: { profile: Profile; text: string; id?: string }) {
  return (
    <section id={id} data-layer="Contact" data-tone="sun" className="blk" aria-labelledby={`${id}-title`}>
      <div className="sticky-note">
        <p className="sticky-note__label" aria-hidden>
          Sticky note · from {profile.name.split(" ")[0]}
        </p>
        <h2 id={`${id}-title`} className="sticky-note__title">
          <Statement text={text} />
        </h2>
        <div className="sticky-note__row">
          <Link href="/contact" className="btn">
            Start a conversation <ArrowRight aria-hidden />
          </Link>
          <CopyEmail email={profile.email} from="cta" className="btn btn--line" />
          <StatusPill availability={profile.availability} note={profile.availability_note} />
        </div>
      </div>
    </section>
  );
}
