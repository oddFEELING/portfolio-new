import { stegaClean } from "@sanity/client/stega";
import { Link } from "react-router";
import type { RelatedPost } from "@/lib/blog/related";

type RelatedPostsProps = {
  posts: RelatedPost[];
};

/** Formats a published date for compact related-post rows. */
const formatPublishedDate = (publishedAt: string) =>
  new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(publishedAt));

/** Footer list of related posts beneath an article body. */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-16 border-t pt-10"
    >
      <h2
        className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]"
        id="related-posts-heading"
      >
        Related
      </h2>
      <ul className="-mb-px mt-4">
        {posts.map((post) => (
          <li className="border-b" key={post._id}>
            <Link
              className="block py-4 transition-colors hover:bg-muted/30"
              to={`/blog/${stegaClean(post.slug)}`}
            >
              {post.publishedAt ? (
                <time
                  className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-[0.2em]"
                  dateTime={post.publishedAt}
                >
                  {formatPublishedDate(post.publishedAt)}
                </time>
              ) : null}
              <span className="mt-1 block font-semibold text-lg tracking-tight">
                {post.title}
              </span>
              {post.excerpt ? (
                <span className="mt-1 block text-muted-foreground text-sm leading-relaxed">
                  {post.excerpt}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
