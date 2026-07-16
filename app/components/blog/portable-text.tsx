import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import type { ReactNode } from "react";
import { urlFor } from "@/sanity/image";

/** YouTube video identifiers are exactly 11 characters. */
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

/** Normalizes the optional www prefix before matching YouTube hosts. */
const WWW_PREFIX_PATTERN = /^www\./;

/** Requests article images at a high-resolution content width. */
const POST_IMAGE_WIDTH = 1400;

/** Reserves a wide image area to limit layout shift while loading. */
const POST_IMAGE_HEIGHT = 788;

/** Describes a Portable Text image block with accessible alternative text. */
type PostImage = SanityImageSource & {
  alt?: string;
};

/** Describes a fenced code block stored in Sanity. */
type PostCodeBlock = {
  code?: string;
  filename?: string;
  language?: string;
};

/** Describes the supported callout tones and their text content. */
type PostCallout = {
  body?: string;
  tone?: "note" | "tip" | "warning";
};

/** Describes one keyed row in a Sanity table block. */
type PostTableRow = {
  _key: string;
  cells?: string[];
};

/** Describes a semantic table stored in Portable Text. */
type PostTable = {
  caption?: string;
  rows?: PostTableRow[];
};

/** Describes an external media or resource embed. */
type PostEmbed = {
  provider?: "generic" | "youtube";
  title?: string;
  url?: string;
};

/** Describes the URL value attached to a Portable Text link mark. */
type PostLink = {
  href?: string;
};

/** Supplies nested Portable Text content to semantic text components. */
type TextComponentProps = {
  children?: ReactNode;
};

/** Labels and styles each supported callout tone. */
const CALLOUT_STYLES = {
  note: {
    label: "Note",
    className: "border-border bg-muted/30",
    labelClassName: "text-muted-foreground",
  },
  tip: {
    label: "Tip",
    className: "border-foreground/40 bg-muted/30",
    labelClassName: "text-foreground",
  },
  warning: {
    label: "Warning",
    className: "border-[#FF9800]/70 bg-[#FF9800]/5",
    labelClassName: "text-[#FF9800]",
  },
} as const;

/** Extracts a video identifier from common YouTube URL formats. */
function getYouTubeId(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(WWW_PREFIX_PATTERN, "");
    let id: string | null | undefined;

    if (hostname === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean).at(0);
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
      } else {
        const [kind, candidate] = url.pathname.split("/").filter(Boolean);
        if (kind === "embed" || kind === "shorts" || kind === "live") {
          id = candidate;
        }
      }
    }

    return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Renders a styled second-level heading. */
function HeadingTwo({ children }: TextComponentProps) {
  return (
    <h2 className="mt-12 border-b pb-3 font-semibold text-2xl tracking-tight md:text-3xl">
      {children}
    </h2>
  );
}

/** Renders a compact third-level heading. */
function HeadingThree({ children }: TextComponentProps) {
  return (
    <h3 className="mt-8 font-semibold text-xl tracking-tight md:text-2xl">
      {children}
    </h3>
  );
}

/** Renders body copy with a readable line length and rhythm. */
function Paragraph({ children }: TextComponentProps) {
  return <p className="my-5 text-foreground/90 leading-7">{children}</p>;
}

/** Renders quoted text with a flush, boxy treatment. */
function Blockquote({ children }: TextComponentProps) {
  return (
    <blockquote className="my-8 border-foreground/40 border-l-4 bg-muted/30 px-5 py-4 text-foreground/80 italic">
      {children}
    </blockquote>
  );
}

/** Renders a bulleted list with consistent article spacing. */
function BulletList({ children }: TextComponentProps) {
  return <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>;
}

/** Renders a numbered list with consistent article spacing. */
function NumberList({ children }: TextComponentProps) {
  return <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>;
}

/** Renders a semantic list item. */
function ListItem({ children }: TextComponentProps) {
  return <li className="pl-1 leading-7">{children}</li>;
}

/** Renders a secure external link or an in-site link when the URL is relative. */
function LinkMark({
  children,
  value,
}: TextComponentProps & { value?: PostLink }) {
  const href = value?.href;

  if (!href) {
    return <>{children}</>;
  }

  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <a
      className="underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-[#FF9800]"
      href={href}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

/** Renders inline code in a compact mono box. */
function InlineCode({ children }: TextComponentProps) {
  return (
    <code className="border bg-muted/50 px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  );
}

/** Renders strongly emphasized text. */
function StrongMark({ children }: TextComponentProps) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

/** Renders emphasized text. */
function EmphasisMark({ children }: TextComponentProps) {
  return <em>{children}</em>;
}

/** Renders a Sanity image at an article-friendly width. */
function PostImageBlock({ value }: { value: PostImage }) {
  return (
    <figure className="my-10">
      <img
        alt={value.alt ?? ""}
        className="h-auto w-full border object-cover"
        decoding="async"
        height={POST_IMAGE_HEIGHT}
        loading="lazy"
        src={urlFor(value).width(POST_IMAGE_WIDTH).url()}
        width={POST_IMAGE_WIDTH}
      />
    </figure>
  );
}

/** Renders source code as SSR-safe preformatted text with an optional label. */
function PostCodeBlockComponent({ value }: { value: PostCodeBlock }) {
  const code = value.code ?? "";
  const label = value.filename ?? value.language;

  return (
    <figure className="my-10 overflow-hidden border bg-zinc-950 text-zinc-100">
      {label ? (
        <figcaption className="border-zinc-800 border-b px-4 py-2 font-mono text-[0.65rem] text-zinc-400 uppercase tracking-[0.2em]">
          {label}
        </figcaption>
      ) : null}
      <pre className="m-0 overflow-x-auto p-4 font-mono text-sm leading-6">
        <code className="whitespace-pre font-mono">{code}</code>
      </pre>
    </figure>
  );
}

/** Renders a bordered note, tip, or warning callout. */
function PostCalloutBlock({ value }: { value: PostCallout }) {
  const tone = value.tone ?? "note";
  const style = CALLOUT_STYLES[tone] ?? CALLOUT_STYLES.note;

  return (
    <aside className={`my-8 border p-5 ${style.className}`}>
      <p
        className={`mb-2 font-mono text-[0.65rem] uppercase tracking-[0.24em] ${style.labelClassName}`}
      >
        {style.label}
      </p>
      <p className="text-foreground/90 leading-7">{value.body}</p>
    </aside>
  );
}

/** Renders a keyed row as table heading cells. */
function TableHeadingRow({ row }: { row: PostTableRow }) {
  return (
    <tr className="border-b bg-muted/40">
      {(row.cells ?? []).map((cell, index) => (
        <th
          className="border-r px-4 py-3 text-left font-mono text-xs uppercase tracking-wider last:border-r-0"
          key={`${row._key}-cell-${index}`}
          scope="col"
        >
          {cell}
        </th>
      ))}
    </tr>
  );
}

/** Renders a keyed row as table data cells. */
function TableBodyRow({ row }: { row: PostTableRow }) {
  return (
    <tr className="border-b last:border-b-0">
      {(row.cells ?? []).map((cell, index) => (
        <td
          className="border-r px-4 py-3 align-top text-sm last:border-r-0"
          key={`${row._key}-cell-${index}`}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}

/** Renders a semantic, horizontally scrollable data table. */
function PostTableBlock({ value }: { value: PostTable }) {
  const rows = value.rows ?? [];
  const hasHeading = rows.length > 1;
  const headingRow = hasHeading ? rows.at(0) : undefined;
  const bodyRows = hasHeading ? rows.slice(1) : rows;

  return (
    <div className="my-10 overflow-x-auto border">
      <table className="w-full border-collapse">
        {value.caption ? (
          <caption className="border-b px-4 py-3 text-left font-mono text-xs uppercase tracking-wider">
            {value.caption}
          </caption>
        ) : null}
        {headingRow ? (
          <thead>
            <TableHeadingRow row={headingRow} />
          </thead>
        ) : null}
        <tbody>
          {bodyRows.map((row) => (
            <TableBodyRow key={row._key} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Renders an embed URL as a secure external link. */
function EmbedLink({ title, url }: { title?: string; url: string }) {
  return (
    <a
      className="my-8 block border p-4 font-mono text-sm underline decoration-foreground/40 underline-offset-4 hover:decoration-[#FF9800]"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {title ?? url}
    </a>
  );
}

/** Renders valid YouTube embeds and safe link fallbacks for other URLs. */
function PostEmbedBlock({ value }: { value: PostEmbed }) {
  const url = value.url;

  if (!url) {
    return null;
  }

  if (value.provider !== "youtube") {
    return <EmbedLink title={value.title} url={url} />;
  }

  const videoId = getYouTubeId(url);

  if (!videoId) {
    return <EmbedLink title={value.title} url={url} />;
  }

  return (
    <div className="my-10 aspect-video overflow-hidden border bg-black">
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={value.title ?? "YouTube video"}
      />
    </div>
  );
}

/** Defines stable renderers for standard and custom Portable Text content. */
const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    blockquote: Blockquote,
    h2: HeadingTwo,
    h3: HeadingThree,
    normal: Paragraph,
  },
  list: {
    bullet: BulletList,
    number: NumberList,
  },
  listItem: {
    bullet: ListItem,
    number: ListItem,
  },
  marks: {
    code: InlineCode,
    em: EmphasisMark,
    link: LinkMark,
    strong: StrongMark,
  },
  types: {
    callout: PostCalloutBlock,
    codeBlock: PostCodeBlockComponent,
    embed: PostEmbedBlock,
    image: PostImageBlock,
    table: PostTableBlock,
  },
};

/** Renders a blog post body while handling absent content safely. */
export function PostPortableText({
  value,
}: {
  value: PortableTextBlock[] | null | undefined;
}) {
  if (!value?.length) {
    return null;
  }

  return <PortableText components={portableTextComponents} value={value} />;
}
