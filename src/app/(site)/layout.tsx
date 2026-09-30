import { Dock } from "@/components/site/dock";
import { Footer } from "@/components/site/footer";
import { LayersPanel } from "@/components/site/layers-panel";
import { ShellProvider, type PaletteData } from "@/components/site/shell-provider";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Toolbar } from "@/components/site/toolbar";
import { getAiLinks, getProfile, getProjects, getSettings, getSocialLinks } from "@/lib/data";
import { buildAskAiUrl } from "@/lib/site";

// The Canvas workspace shell for every public page (admin has its own layout).
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, settings, socials, projects, aiLinks] = await Promise.all([
    getProfile(),
    getSettings(),
    getSocialLinks(),
    getProjects(),
    getAiLinks(),
  ]);

  const palette: PaletteData = {
    email: profile.email,
    resumeUrl: profile.resume_url,
    projects: projects.map((p) => ({ slug: p.slug, title: p.title, kind: p.kind })),
    ai: aiLinks.map((a) => ({ name: a.name, url: buildAskAiUrl(a.url_template, settings.ask_ai_prompt) })),
  };

  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ShellProvider palette={palette}>
        <Toolbar availability={profile.availability} availabilityNote={profile.availability_note} />
        <div className="ruler" aria-hidden>
          {Array.from({ length: 40 }, (_, i) => (
            <span key={i}>{i * 100}</span>
          ))}
        </div>
        <LayersPanel location={`${profile.location.split(",")[0]}, ${profile.country}`} />
        <div className="canvas">
          <main id="main" className="canvas__inner" tabIndex={-1}>
            {children}
          </main>
          <Footer profile={profile} socials={socials} aiLinks={aiLinks} settings={settings} />
        </div>
        <Dock />
      </ShellProvider>
      <SmoothScroll />
    </div>
  );
}
