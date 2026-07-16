import type { SanityImageSource } from "@sanity/image-url";
import { Link } from "react-router";
import { urlFor } from "@/sanity/image";

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  coverImage?: SanityImageSource | null;
  tags?: Array<{
    _id: string;
    title: string;
    slug: string;
  }> | null;
};

type PostListProps = {
  posts: PostListItem[];
};

const COVER_IMAGE_WIDTH = 320;
const COVER_IMAGE_HEIGHT = 240;

/** Formats a published date for compact, locale-stable display. */
const formatPublishedDate = (publishedAt: string) =>
  new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(publishedAt));

/** Renders published posts as a flush stack of bordered rows. */
export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-semibold text-2xl tracking-tight">No posts yet.</p>
        <p className="mt-2 max-w-sm text-muted-foreground text-sm">
          Notes on engineering, AI systems, and building for the web will appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="-mb-px">
      {posts.map((post) => (
        <article
          className="group grid gap-5 border-b p-5 transition-colors hover:bg-muted/30 md:grid-cols-[minmax(0,1fr)_10rem] md:p-7"
          key={post._id}
        >
          <div className="min-w-0">
            <time
              className="font-mono text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]"
              dateTime={post.publishedAt}
            >
              {formatPublishedDate(post.publishedAt)}
            </time>
            <h2 className="mt-2 font-semibold text-2xl leading-tight tracking-tight md:text-3xl">
              <Link
                className="transition-colors group-hover:text-[#FF9800]"
                to={`/blog/${post.slug}`}
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground text-sm leading-relaxed md:text-base">
              {post.excerpt}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    className="border px-2 py-1 font-mono text-[0.65rem] text-muted-foreground uppercase tracking-wider"
                    key={tag._id}
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.coverImage && (
            <img
              alt=""
              className="aspect-[4/3] w-full object-cover md:self-start"
              height={120}
              loading="lazy"
              src={urlFor(post.coverImage)
                .width(COVER_IMAGE_WIDTH)
                .height(COVER_IMAGE_HEIGHT)
                .url()}
              width={160}
            />
          )}
        </article>
      ))}
    </div>
  );
}
