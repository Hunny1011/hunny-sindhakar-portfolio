import { emphasise } from "@/lib/format";

/** Renders an admin-edited statement with its italic emphasis (see `emphasise`). */
export function Statement({ text }: { text: string }) {
  return (
    <>
      {emphasise(text).map((part, i) => (part.em ? <em key={i}>{part.text}</em> : <span key={i}>{part.text}</span>))}
    </>
  );
}
