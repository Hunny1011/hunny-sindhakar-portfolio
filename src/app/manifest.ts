import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hunny Sindhakar — UI/UX Designer",
    short_name: "Hunny Sindhakar",
    description: "Portfolio of Hunny Sindhakar, UI/UX designer in Ahmedabad, India.",
    start_url: "/",
    display: "standalone",
    background_color: "#fef8f3",
    theme_color: "#fef8f3",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
