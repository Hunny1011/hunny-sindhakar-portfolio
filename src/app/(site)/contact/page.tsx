import { ContactForm } from "@/components/site/contact-form";
import { CopyEmail } from "@/components/site/copy-email";
import { Breadcrumbs, FrameLabel } from "@/components/site/frame";
import { SocialIcon } from "@/components/site/icons";
import { StatusPill } from "@/components/site/status-pill";
import { TrackedLink } from "@/components/site/tracked-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getProfile, getSettings, getSocialLinks } from "@/lib/data";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { Statement } from "@/components/site/statement";

export async function generateMetadata() {
  const profile = await getProfile();
  return buildMetadata({
    title: `Contact ${profile.name}`,
    description: `Hire or work with ${profile.name}, ${profile.role} in ${profile.location}. ${profile.availability_note ?? ""}`.trim(),
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [profile, settings, socials] = await Promise.all([getProfile(), getSettings(), getSocialLinks()]);
  const first = profile.name.split(" ")[0];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
      <header id="overview" data-layer="Overview" className="page-head mb-12">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title max-w-[16ch]">
          <Statement text={settings.hero_comment} />
        </h1>
      </header>

      <div className="contact-grid">
        <section id="write" data-layer="Message" aria-label="Send a message">
          <FrameLabel name="Form · Message" size="Auto layout" />
          <div className="frame form-frame">
            <ContactForm firstName={first} />
          </div>
        </section>

        <aside id="direct" data-layer="Direct" className="side-card" aria-label="Other ways to reach me">
          <div>
            <p className="side-card__h">Status</p>
            <StatusPill availability={profile.availability} note={profile.availability_note} />
          </div>
          <div>
            <p className="side-card__h">Email</p>
            <div className="email-row">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
            <div className="mt-3">
              <CopyEmail email={profile.email} from="contact" />
            </div>
          </div>
          <div>
            <p className="side-card__h">Based in</p>
            <p className="m-0 font-medium">
              {profile.location}, {profile.country}
            </p>
          </div>
          {socials.filter((s) => s.platform !== "email").length > 0 && (
            <div>
              <p className="side-card__h">Elsewhere</p>
              <ul className="socials">
                {socials
                  .filter((s) => s.platform !== "email")
                  .map((s) => (
                    <li key={s.id}>
                      <TrackedLink className="ai-btn" href={s.url} target="_blank" rel="noopener me" event="social_click" params={{ platform: s.platform, from: "contact" }}>
                        <SocialIcon platform={s.platform} />
                        {s.label}
                      </TrackedLink>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
