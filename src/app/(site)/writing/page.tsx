import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs, FrameLabel } from "@/components/site/frame";
import { MediumMark } from "@/components/site/icons";
import { TrackedLink } from "@/components/site/tracked-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getPosts, getSocialLinks } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { articleListJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Writing — notes on UI/UX design",
  description: "Articles by Hunny Sindhakar on UI and UX design, published on Medium.",
  path: "/writing",
});

export default async function WritingPage() {
  const [posts, socials] = await Promise.all([getPosts(), getSocialLinks()]);
  const medium = socials.find((s) => s.platform === "medium");

  return (
    <>
      <JsonLd
        data={[
          articleListJsonLd(posts),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Writing", path: "/writing" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Writing" }]} />
      <header id="overview" data-layer="Overview" className="page-head">
        <FrameLabel name="Writing" size={`${posts.length} ${posts.length === 1 ? "article" : "articles"}`} />
        <h1 className="page-title">
          Notes on <em>craft</em>
        </h1>
        <p className="lede">Plain-language pieces on UI, UX and the thinking between the two.</p>
      </header>

      <section id="articles" data-layer="Articles" aria-label="Articles" className="mt-12">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>New writing is on the way.</p>
            {medium && (
              <a className="btn btn--sm" href={medium.url} target="_blank" rel="noopener">
                <MediumMark /> Follow on Medium
              </a>
            )}
          </div>
        ) : (
          <div className="posts">
            {posts.map((post, i) => (
              <article key={post.id} className="post-card">
                <TrackedLink href={post.url} target="_blank" rel="noopener" event="social_click" params={{ platform: post.source, from: "writing" }}>
                  <span className="post-card__img">
                    {post.cover_url ? (
                      <Image src={post.cover_url} alt="" fill sizes="(min-width: 1024px) 420px, 100vw" preload={i === 0} />
                    ) : (
                      <span className="grid h-full place-items-center font-serif text-4xl italic text-ink-3">{post.title.slice(0, 1)}</span>
                    )}
                  </span>
                  <span className="post-card__meta">
                    <span>{post.source}</span>
                    {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
                    <ArrowUpRight className="ml-auto size-3.5" aria-hidden />
                  </span>
                  <h2 className="post-card__title">{post.title}</h2>
                  {post.excerpt && <p className="post-card__ex">{post.excerpt}</p>}
                  <span className="sr-only">(opens on {post.source} in a new tab)</span>
                </TrackedLink>
              </article>
            ))}
          </div>
        )}
        {medium && posts.length > 0 && (
          <p className="mt-12">
            <a className="link-arrow" href={medium.url} target="_blank" rel="noopener">
              <MediumMark className="size-4" />
              <span>More on Medium · {medium.handle}</span>
            </a>
          </p>
        )}
      </section>
    </>
  );
}
