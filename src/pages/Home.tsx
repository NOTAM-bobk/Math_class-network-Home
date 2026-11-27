import { Launcher } from "../components/Launcher";
import { useSeo } from "../lib/seo";
import { SITE } from "../data/site";
import "../launcher.css";

export default function Home() {
  useSeo({
    title: `${SITE.name} — math makes more sense together`,
    description: SITE.description,
    path: "/",
  });

  return <Launcher />;
}
