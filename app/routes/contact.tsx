import resumeUrl from "@/assets/Emmanuel_Alawode_Resume.pdf?url";
import { Highlighter } from "@/components/ui/highlighter";
import { useSidebar } from "@/components/ui/sidebar";
import {
  IconArrowDown,
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconCheck,
  IconCopy,
  IconDownload,
  IconMail,
  type TablerIcon,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Route } from "./+types/contact";

const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as [number, number, number, number];
const BACK_OUT = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: EASE_OUT_QUART },
});

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Contact — Emmanuel Alawode" },
    {
      name: "description",
      content: "Channels open. Ways to reach Emmanuel Alawode.",
    },
  ];
}

type Channel = {
  callsign: string;
  label: string;
  handle: string;
  value: string;
  href: string;
  Icon: TablerIcon;
};

const channels: Channel[] = [
  {
    callsign: "01",
    label: "Email",
    handle: "primary",
    value: "alawodeemmanuel2@gmail.com",
    href: "mailto:alawodeemmanuel2@gmail.com",
    Icon: IconMail,
  },
  {
    callsign: "02",
    label: "GitHub",
    handle: "@oddFEELING",
    value: "github.com/oddFEELING",
    href: "https://github.com/oddFEELING",
    Icon: IconBrandGithub,
  },
  {
    callsign: "03",
    label: "LinkedIn",
    handle: "/in/alawodeemmanuel",
    value: "linkedin.com/in/alawodeemmanuel",
    href: "https://www.linkedin.com/in/alawodeemmanuel/",
    Icon: IconBrandLinkedin,
  },
  {
    callsign: "04",
    label: "X",
    handle: "@_oddFEELING",
    value: "x.com/_oddFEELING",
    href: "https://x.com/_oddFEELING",
    Icon: IconBrandX,
  },
];

function useLondonTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) {
    return "--:--:--";
  }
  return now.toLocaleTimeString("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function ChannelRow({
  channel,
  index,
}: {
  channel: Channel;
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const rowDelay = 0.62 + index * 0.12;

  const handleCopy = async () => {
    const text = channel.href.startsWith("mailto:")
      ? channel.value
      : channel.href;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  const isMail = channel.href.startsWith("mailto:");

  return (
    <article className="group relative grid grid-cols-[auto_1fr] items-stretch border-b transition-colors duration-300 hover:bg-muted/30 md:grid-cols-[auto_1fr_auto]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-[#FF9800] transition-transform duration-300 group-hover:scale-y-100"
      />
      <div className="flex items-center justify-center border-r px-4 md:px-6">
        <motion.span
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block font-mono text-3xl text-muted-foreground/30 tabular-nums leading-none transition-colors duration-300 group-hover:text-[#FF9800] md:text-5xl"
          initial={{ opacity: 0, scale: 0.6 }}
          transition={{
            duration: 0.45,
            delay: rowDelay,
            ease: BACK_OUT,
          }}
        >
          {channel.callsign}
        </motion.span>
      </div>

      <motion.div
        animate={{ opacity: 1 }}
        className="flex min-w-0 flex-col gap-1.5 px-4 py-5 md:px-6 md:py-6"
        initial={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          delay: rowDelay + 0.18,
          ease: EASE_OUT_QUART,
        }}
      >
        <div className="flex items-center gap-2">
          <channel.Icon
            className="shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-[#FF9800]"
            size={16}
            stroke={1.5}
          />
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em] transition-colors duration-300 group-hover:text-[#FF9800]">
            {channel.label}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="truncate font-mono text-muted-foreground text-xs">
            {channel.handle}
          </span>
        </div>
        <p className="truncate font-medium text-base md:text-lg">
          {channel.value}
        </p>
      </motion.div>

      <motion.div
        animate={{ opacity: 1 }}
        className="col-span-2 flex items-stretch border-t md:col-span-1 md:border-t-0 md:border-l"
        initial={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          delay: rowDelay + 0.32,
          ease: EASE_OUT_QUART,
        }}
      >
        <button
          aria-label={`Copy ${channel.label}`}
          className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground md:flex-none md:px-5 md:py-0"
          onClick={handleCopy}
          type="button"
        >
          {copied ? (
            <>
              <IconCheck
                className="text-[#FF9800]"
                size={16}
                stroke={1.5}
              />
              <span className="font-mono text-[#FF9800] text-xs uppercase tracking-[0.3em]">
                Copied
              </span>
            </>
          ) : (
            <>
              <IconCopy size={16} stroke={1.5} />
              <span className="font-mono text-xs uppercase tracking-[0.3em]">
                Copy
              </span>
            </>
          )}
        </button>
        <a
          className="flex flex-1 items-center justify-center gap-2 border-l px-4 py-3 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground md:flex-none md:px-5 md:py-0"
          href={channel.href}
          rel={isMail ? undefined : "noreferrer"}
          target={isMail ? undefined : "_blank"}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em]">
            Open
          </span>
          <IconArrowUpRight size={16} stroke={1.5} />
        </a>
      </motion.div>
    </article>
  );
}

export default function Contact() {
  const { toggleSidebar } = useSidebar();
  const londonTime = useLondonTime();

  return (
    <div className="flex md:h-[calc(100dvh-1rem)] md:overflow-hidden">
      {/* ~ =================================== ~ */}
      {/* -- Weirdly placed sidebar trigger -- */}
      {/* ~ =================================== ~ */}
      <button
        aria-label="Toggle sidebar"
        className="nav-attn-text group flex shrink-0 items-center justify-center border-r border-[#FF9800]/30 px-2 transition-colors duration-300 hover:bg-[#FF9800]/10 sm:px-3"
        onClick={toggleSidebar}
        type="button"
      >
        <span className="rotate-180 font-mono text-[0.65rem] uppercase tracking-[0.4em] [writing-mode:vertical-rl] sm:text-xs">
          ◂ TOGGLE_SIGNAL ◂ [ NAV ]
        </span>
      </button>

      {/* ~ =================================== ~ */}
      {/* -- Main column -- */}
      {/* ~ =================================== ~ */}
      <div className="flex min-w-0 flex-1 flex-col md:overflow-hidden">
        {/* ~ ============= header ============= ~ */}
        <header className="grid grid-cols-1 border-b md:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-4 px-4 py-10 md:px-6 md:py-12">
            <motion.p
              className="font-mono text-muted-foreground text-xs uppercase tracking-[0.4em]"
              {...fadeUp(0.1)}
            >
              // 04 — OPEN_CHANNEL
            </motion.p>
            <h1 className="font-semibold text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Open{" "}
              <Highlighter action="underline" color="#FF9800" strokeWidth={2}>
                channel
              </Highlighter>
              <span className="text-[#FF9800]">.</span>
            </h1>
            <motion.p
              className="max-w-md text-muted-foreground text-sm leading-relaxed md:text-base"
              {...fadeUp(0.28)}
            >
              I read everything that lands here. Pick the frequency that suits
              you; pings, threads, cold notes, all welcome.
            </motion.p>
          </div>

          <aside className="relative overflow-hidden border-t md:border-t-0 md:border-l">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px)",
              }}
            />
            <dl className="relative z-10 flex h-full flex-col">
              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6"
                initial={{ opacity: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.22,
                  ease: EASE_OUT_QUART,
                }}
              >
                <dt className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
                  Status
                </dt>
                <dd className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Online
                </dd>
              </motion.div>
              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6"
                initial={{ opacity: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.28,
                  ease: EASE_OUT_QUART,
                }}
              >
                <dt className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
                  Location
                </dt>
                <dd className="font-mono text-xs uppercase tracking-[0.3em]">
                  London · UK
                </dd>
              </motion.div>
              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6"
                initial={{ opacity: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.34,
                  ease: EASE_OUT_QUART,
                }}
              >
                <dt className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
                  Local
                </dt>
                <dd className="font-mono text-xs uppercase tabular-nums tracking-[0.3em]">
                  {londonTime} GMT
                </dd>
              </motion.div>
              <motion.div
                animate={{ opacity: 1 }}
                className="flex flex-1 items-center justify-between gap-4 px-4 py-3 md:px-6"
                initial={{ opacity: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.4,
                  ease: EASE_OUT_QUART,
                }}
              >
                <dt className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
                  Reply
                </dt>
                <dd className="font-mono text-xs uppercase tracking-[0.3em]">
                  Within 24h
                </dd>
              </motion.div>
            </dl>
          </aside>
        </header>

        {/* ~ ============= résumé as channel 00 ============= ~ */}
        <a
          className="group/dl relative grid grid-cols-[auto_1fr] items-stretch border-b transition-colors duration-300 hover:bg-muted/30 md:grid-cols-[auto_1fr_auto]"
          download="Emmanuel_Alawode_Resume.pdf"
          href={resumeUrl}
        >
          <div className="flex items-center justify-center border-r px-4 md:px-6">
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block font-mono text-3xl text-muted-foreground/30 tabular-nums leading-none transition-colors duration-300 group-hover/dl:text-[#FF9800] md:text-5xl"
              initial={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.45, delay: 0.5, ease: BACK_OUT }}
            >
              00
            </motion.span>
          </div>

          <motion.div
            animate={{ opacity: 1 }}
            className="flex min-w-0 flex-col gap-1.5 px-4 py-5 md:px-6 md:py-6"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.68, ease: EASE_OUT_QUART }}
          >
            <div className="flex items-center gap-2">
              <IconDownload
                className="shrink-0 text-muted-foreground transition-colors duration-300 group-hover/dl:text-[#FF9800]"
                size={16}
                stroke={1.5}
              />
              <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em] transition-colors duration-300 group-hover/dl:text-[#FF9800]">
                Résumé
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="truncate font-mono text-muted-foreground text-xs">
                2026
              </span>
            </div>
            <p className="truncate font-medium text-base md:text-lg">
              Emmanuel_Alawode_Resume.pdf
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1 }}
            className="col-span-2 flex items-stretch border-t md:col-span-1 md:border-t-0 md:border-l"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.82, ease: EASE_OUT_QUART }}
          >
            <span className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-muted-foreground transition-colors group-hover/dl:bg-muted/40 group-hover/dl:text-foreground md:flex-none md:px-5 md:py-0">
              <span className="font-mono text-xs uppercase tracking-[0.3em]">
                Download
              </span>
              <IconArrowDown size={16} stroke={1.5} />
            </span>
          </motion.div>
        </a>

        {/* ~ ============= channel strip ============= ~ */}
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3 md:px-6 md:py-2"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.46, ease: EASE_OUT_QUART }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
            Channels
          </span>
          <span className="font-mono text-muted-foreground/60 text-xs uppercase tracking-[0.3em]">
            {channels.length} open
          </span>
        </motion.div>

        <section className="scrollbar-thin md:min-h-0 md:flex-1 md:overflow-y-auto">
          {channels.map((channel, index) => (
            <ChannelRow
              channel={channel}
              index={index}
              key={channel.callsign}
            />
          ))}
        </section>

        {/* ~ ============= footer transmission ============= ~ */}
        <motion.footer
          animate={{ opacity: 1 }}
          className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 md:px-6"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.85, ease: EASE_OUT_QUART }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
            ▒ TRANSMISSION OPEN · END OF FEED ▒
          </span>
          <a
            className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em] underline underline-offset-4 transition-colors hover:text-[#FF9800]"
            href="mailto:alawodeemmanuel2@gmail.com"
          >
            Send the first packet →
          </a>
        </motion.footer>
      </div>
    </div>
  );
}
