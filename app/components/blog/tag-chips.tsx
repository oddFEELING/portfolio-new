import { stegaClean } from "@sanity/client/stega";
import { Link } from "react-router";

export type BlogTag = {
  _id: string;
  title: string;
  slug: string;
};

type TagChipsProps = {
  tags: BlogTag[];
  /** Highlights the active filter/archive chip when set. */
  activeSlug?: string | null;
  /** Archive links go to tag pages; filter links use `?tag=` on the index. */
  linkTo?: "archive" | "filter";
  /** When filtering, show an All chip that clears the query. */
  showAll?: boolean;
};

const chipClassName =
  "border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider transition-colors";

/** Renders bordered mono tag chips as links for filter or archive navigation. */
export function TagChips({
  tags,
  activeSlug = null,
  linkTo = "archive",
  showAll = false,
}: TagChipsProps) {
  if (tags.length === 0 && !showAll) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {showAll ? (
        <Link
          aria-current={activeSlug ? undefined : "page"}
          className={`${chipClassName} ${
            activeSlug
              ? "border-border text-muted-foreground hover:text-foreground"
              : "border-foreground text-foreground"
          }`}
          to="/blog"
        >
          All
        </Link>
      ) : null}
      {tags.map((tag) => {
        const slug = stegaClean(tag.slug);
        const isActive = activeSlug === slug;
        const to =
          linkTo === "filter" ? `/blog?tag=${slug}` : `/blog/tag/${slug}`;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`${chipClassName} ${
              isActive
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            key={tag._id}
            to={to}
          >
            {tag.title}
          </Link>
        );
      })}
    </div>
  );
}
