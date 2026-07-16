import { Link, useLoaderData } from "react-router";
import { PostList, type PostListItem } from "@/components/blog/post-list";
import { type BlogTag, TagChips } from "@/components/blog/tag-chips";
import { useSidebar } from "@/components/ui/sidebar";
import { buildMeta } from "@/lib/seo";
import { useQuery } from "@/sanity/loader";
import { loadQuery } from "@/sanity/loader.server";
import { POSTS_QUERY, TAG_POSTS_QUERY, TAGS_QUERY } from "@/sanity/queries";
import type { Route } from "./+types/blog";

const POST_COUNT_WIDTH = 3;

/** Defines public metadata for the published blog index. */
export function meta(_: Route.MetaArgs) {
  return buildMeta({
    title: "Blog",
    description:
      "Notes from Emmanuel Alawode on AI systems, full-stack engineering, and the craft of shipping software.",
    path: "/blog",
  });
}

/** Loads published posts (optionally filtered) and tags used for chip filters. */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const activeTag = url.searchParams.get("tag");

  const [postsResult, tagsResult] = await Promise.all([
    activeTag
      ? loadQuery<PostListItem[]>(TAG_POSTS_QUERY, { tagSlug: activeTag })
      : loadQuery<PostListItem[]>(POSTS_QUERY, {}),
    loadQuery<BlogTag[]>(TAGS_QUERY, {}),
  ]);

  return {
    activeTag,
    postsInitial: postsResult,
    postsParams: activeTag ? { tagSlug: activeTag } : {},
    postsQuery: activeTag ? TAG_POSTS_QUERY : POSTS_QUERY,
    tagsInitial: tagsResult,
  };
}

/** Displays the Sanity-backed blog index with optional tag filtering. */
export default function Blog() {
  const { toggleSidebar } = useSidebar();
  const { activeTag, postsInitial, postsParams, postsQuery, tagsInitial } =
    useLoaderData<typeof loader>();
  const { data: posts } = useQuery<PostListItem[]>(postsQuery, postsParams, {
    initial: postsInitial,
  });
  const { data: tags } = useQuery<BlogTag[]>(
    TAGS_QUERY,
    {},
    {
      initial: tagsInitial,
    }
  );
  const postCount = String(posts.length).padStart(POST_COUNT_WIDTH, "0");
  const isFiltered = Boolean(activeTag);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-stretch border-b">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em]">
            Blog
          </span>
          <span className="font-mono text-muted-foreground text-xs tabular-nums tracking-[0.2em]">
            {postCount}
          </span>
        </div>
        <button
          aria-label="Toggle sidebar"
          className="nav-attn-text flex shrink-0 items-center justify-center border-[#FF9800]/30 border-l px-3 transition-colors duration-300 hover:bg-[#FF9800]/10"
          onClick={toggleSidebar}
          type="button"
        >
          <span className="rotate-180 font-mono text-xs uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
            <span className="md:hidden">Sidebar</span>
            <span className="hidden md:inline">Toggle Sidebar</span>
          </span>
        </button>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        {tags.length > 0 ? (
          <div className="border-b px-4 py-4 md:px-6">
            <TagChips
              activeSlug={activeTag}
              linkTo="filter"
              showAll
              tags={tags}
            />
          </div>
        ) : null}

        <PostList
          emptyDescription={
            isFiltered
              ? "Try another tag, or clear the filter to see every post."
              : "Notes on engineering, AI systems, and building for the web will appear here."
          }
          emptyTitle={isFiltered ? "No posts with this tag." : "No posts yet."}
          posts={posts}
        />

        {isFiltered && posts.length === 0 ? (
          <div className="flex justify-center pb-16">
            <Link
              className="font-mono text-muted-foreground text-xs uppercase tracking-wider underline underline-offset-4 hover:text-foreground"
              to="/blog"
            >
              Clear filter
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
