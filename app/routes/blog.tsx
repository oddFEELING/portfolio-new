import { Link, useLoaderData } from "react-router";
import { PostList, type PostListItem } from "@/components/blog/post-list";
import { type BlogTag, TagChips } from "@/components/blog/tag-chips";
import { NavDock } from "@/components/navigation/nav-dock";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { buildMeta } from "@/lib/seo";
import { useQuery } from "@/sanity/loader";
import { loadQuery } from "@/sanity/loader.server";
import {
  postsQueryFor,
  tagPostsQueryFor,
  tagsQueryFor,
} from "@/sanity/preview-queries";
import { getPreviewData } from "@/sanity/session.server";
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

/** Loads published or preview posts (optionally filtered) plus tag chips. */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const activeTag = url.searchParams.get("tag");
  const { preview, options } = await getPreviewData(request);

  const postsQuery = activeTag
    ? tagPostsQueryFor(preview)
    : postsQueryFor(preview);
  const tagsQuery = tagsQueryFor(preview);
  const postsParams = activeTag ? { tagSlug: activeTag } : {};

  const [postsResult, tagsResult] = await Promise.all([
    loadQuery<PostListItem[]>(postsQuery, postsParams, options),
    loadQuery<BlogTag[]>(tagsQuery, {}, options),
  ]);

  return {
    activeTag,
    postsInitial: postsResult,
    postsParams,
    postsQuery,
    preview,
    tagsInitial: tagsResult,
    tagsQuery,
  };
}

/** Displays the Sanity-backed blog index with optional tag filtering. */
export default function Blog() {
  const {
    activeTag,
    postsInitial,
    postsParams,
    postsQuery,
    preview,
    tagsInitial,
    tagsQuery,
  } = useLoaderData<typeof loader>();
  const { data: posts } = useQuery<PostListItem[]>(postsQuery, postsParams, {
    initial: postsInitial,
  });
  const { data: tags } = useQuery<BlogTag[]>(
    tagsQuery,
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
        <NavDock />
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-6">
          <PageBreadcrumbs
            items={[{ label: "Blog" }]}
            suffix={preview ? " · Preview" : undefined}
          />
          <span className="font-mono text-muted-foreground text-xs tabular-nums tracking-[0.2em]">
            {postCount}
          </span>
        </div>
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
