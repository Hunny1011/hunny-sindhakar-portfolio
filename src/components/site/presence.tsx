import type { Tone } from "./tones";

// Figma-style multiplayer presence in our brand colours. Generic roles, not real people.
const PEOPLE: { initial: string; name: string; tone: Tone }[] = [
  { initial: "H", name: "Hunny — owner", tone: "sun" },
  { initial: "R", name: "Recruiter", tone: "cobalt" },
  { initial: "D", name: "Dev", tone: "forest" },
  { initial: "P", name: "PM", tone: "flame" },
];

export function PresenceStack() {
  return (
    <ul className="presence" aria-label="Also on this canvas: a recruiter, a developer and a PM (illustrative)">
      {PEOPLE.map((p) => (
        <li key={p.initial} className="presence__item" data-tone={p.tone}>
          <span className="presence__avatar" tabIndex={0} role="img" aria-label={p.name} data-name={p.name}>
            <span aria-hidden>{p.initial}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ToneArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M3.5 2.2 20 9.4l-7.1 2.3-3 7.1z" fill="var(--c)" stroke="var(--surface)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Two collaborator cursors that drift around the hero (desktop, motion allowed only). */
export function GhostCursors() {
  return (
    <div className="ghosts" aria-hidden>
      <span className="ghost ghost--a" data-tone="cobalt">
        <ToneArrow />
        <span className="ghost__name">Recruiter</span>
      </span>
      <span className="ghost ghost--b" data-tone="forest">
        <ToneArrow />
        <span className="ghost__name">Dev</span>
      </span>
    </div>
  );
}
