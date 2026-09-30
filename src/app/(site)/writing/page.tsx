import { Breadcrumbs, FrameLabel } from "@/components/site/frame";
import { MediumMark } from "@/components/site/icons";
import { PostList } from "@/components/site/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getPosts, getSocialLinks } from "@/lib/data";
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
          <PostList posts={posts} from="writing" headingLevel="h2" />
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
