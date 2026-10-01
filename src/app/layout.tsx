import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Hunny Sindhakar — UI/UX Designer", template: "%s · Hunny Sindhakar" },
  applicationName: "Hunny Sindhakar",
  authors: [{ name: "Hunny Sindhakar", url: SITE_URL }],
  creator: "Hunny Sindhakar",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#fef8f3",
};

// Runs before paint so there is no flash. Light is the default for everyone;
// dark only when the visitor has chosen it with the theme toggle (saved in localStorage).
const themeScript = `(function(){try{var t=localStorage.getItem("theme")==="dark"?"dark":"light";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-theme="light" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
