import { useTheme } from "@/components/providers/theme.provider";
import { Highlighter } from "@/components/ui/highlighter";
import { useSidebar } from "@/components/ui/sidebar";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconLayout,
  type TablerIcon,
} from "@tabler/icons-react";
import type { Route } from "./+types/landing";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Emmanuel Alawode" },
    { name: "description", content: "I build stuff. And they work." },
  ];
}

export default function Home() {
  const { setTheme, theme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="grid h-full w-full grid-cols-6 grid-rows-5">
      <header className="landing-section col-span-4 row-span-2 flex w-full flex-col justify-center gap-5 border p-4 md:p-8">
        <h1 className="w-full max-w-2xl font-semibold text-4xl">
          I&apos;m Emmanuel - A{" "}
          <Highlighter action="underline" color="#FF9800" strokeWidth={2}>
            Software Engineer
          </Highlighter>{" "}
          And I like to build stuff.
        </h1>
        <p className="w-full max-w-lg text-muted-foreground">
          I am a seasoned software engineer with 5+ years or experience shipping
          products for companies in a myraid of domains.
        </p>

        <div className="mt-5 flex w-max items-center space-x-3">
          <span
            className="cursor-pointer rounded-md border bg-muted/30 p-2 text-muted-foreground hover:border-muted-foreground hover:text-primary dark:bg-muted/40"
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
          >
            <IconLayout size={25} stroke={1.5} />
          </span>
          {socialLinks.map((item, idx) => (
            <span
              className="cursor-pointer rounded-md border p-2 text-muted-foreground hover:animate-pulse hover:border-muted-foreground hover:bg-muted/15 hover:text-primary"
              key={idx}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              role="button"
              tabIndex={0}
            >
              <item.Icon size={25} stroke={1.5} />
            </span>
          ))}
        </div>
      </header>

      <section className="landing-section col-span-2 row-span-2 border-y p-4 md:p-8">
        <h2 className="font-semibold text-2xl">My Tech Stack</h2>
        <p className="w-2/3 text-lg text-muted-foreground">Code n stuff</p>
      </section>

      <section className="landing-section col-span-6 row-span-1 border p-4 md:p-8">
        <p>This is a text </p>
      </section>

      <section className="landing-section col-span-6 row-span-2 border" />
    </div>
  );
}

const socialLinks: { Icon: TablerIcon; href: string }[] = [
  { Icon: IconBrandX, href: "https://x.com/emmanuelalawode" },
  { Icon: IconBrandInstagram, href: "https://x.com/emmanuelalawode" },
  { Icon: IconBrandLinkedin, href: "https://x.com/emmanuelalawode" },
  { Icon: IconBrandGithub, href: "https://x.com/emmanuelalawode" },
];
