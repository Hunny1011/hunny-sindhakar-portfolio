import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { TrackedLink } from "./tracked-link";

export function PostList({ posts, from, headingLevel = "h3" }: { posts: Post[]; from: string; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const single = posts.length === 1;
  return (
    <div className={`posts ${single ? "posts--single" : ""}`}>
      {posts.map((post, i) => (
        <article key={post.id} className="post-card">
          <TrackedLink href={post.url} target="_blank" rel="noopener" event="social_click" params={{ platform: post.source, from }}>
            <span className="post-card__img">
              {post.cover_url ? (
                <Image
                  src={post.cover_url}
                  alt=""
                  fill
                  sizes={single ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 420px, 100vw"}
                  preload={from === "writing" && i === 0}
                />
              ) : (
                <span className="grid h-full place-items-center font-serif text-4xl italic text-ink-3">{post.title.slice(0, 1)}</span>
              )}
            </span>
            <span className="post-card__text">
              <span className="post-card__meta">
                <span>{post.source}</span>
                {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
                <ArrowUpRight className="ml-auto size-3.5" aria-hidden />
              </span>
              <H className="post-card__title">{post.title}</H>
              {post.excerpt && <span className="post-card__ex block">{post.excerpt}</span>}
              {single && <span className="link-arrow w-fit"><span className="capitalize">Read on {post.source}</span></span>}
              <span className="sr-only">(opens on {post.source} in a new tab)</span>
            </span>
          </TrackedLink>
        </article>
      ))}
    </div>
  );
}
