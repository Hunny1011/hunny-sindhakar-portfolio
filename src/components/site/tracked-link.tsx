"use client";

import { track } from "@/lib/analytics";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  params?: Record<string, string | number | boolean | undefined>;
};

// A plain <a> that reports a click to analytics (external links, downloads, Ask-AI buttons).
export function TrackedLink({ event, params, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}
