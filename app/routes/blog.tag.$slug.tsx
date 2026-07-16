import { data, useLoaderData } from "react-router";
import { PostList, type PostListItem } from "@/components/blog/post-list";
import { useSidebar } from "@/components/ui/sidebar";
import { buildMeta } from "@/lib/seo";
import { useQuery } from "@/sanity/loader";
import { loadQuery } from "@/sanity/loader.server";
import { TAG_POSTS_QUERY, TAG_QUERY } from "@/sanity/queries";
import type { Route } from "./+types/blog.tag.$slug";

const POST_COUNT_WIDTH = 3;

type TagDocument = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
};

/** Loads a tag and its published posts; missing tags become 404s. */
export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;

  if (!slug) {
    throw data(null, { status: 404 });
  }

  const [tagResult, postsResult] = await Promise.all([
    loadQuery<TagDocument | null>(TAG_QUERY, { slug }),
    loadQuery<PostListItem[]>(TAG_POSTS_QUERY, { tagSlug: slug }),
  ]);

  if (!tagResult.data) {
    throw data(null, { status: 404 });
  }

  return {
    postsInitial: postsResult,
    postsParams: { tagSlug: slug },
    tagInitial: tagResult,
    tagParams: { slug },
  };
}

/** Builds tag-archive metadata from the Sanity tag document. */
export function meta({ data: routeData }: Route.MetaArgs) {
  const tag = routeData?.tagInitial?.data;

  if (!tag) {
    return buildMeta({
      noindex: true,
      path: "/blog",
      title: "Tag not found",
    });
  }

  return buildMeta({
    description:
      tag.description || `Posts tagged ${tag.title} by Emmanuel Alawode.`,
    path: `/blog/tag/${tag.slug}`,
    title: `Tag · ${tag.title}`,
  });
}

/** Tag archive — same list treatment as the index, scoped to one tag. */
export default function BlogTagArchive() {
  const { toggleSidebar } = useSidebar();
  const { postsInitial, postsParams, tagInitial, tagParams } =
    useLoaderData<typeof loader>();
  const { data: tag } = useQuery<TagDocument | null>(TAG_QUERY, tagParams, {
    initial: tagInitial,
  });
  const { data: posts } = useQuery<PostListItem[]>(
    TAG_POSTS_QUERY,
    postsParams,
    { initial: postsInitial }
  );

  if (!tag) {
    return null;
  }

  const postCount = String(posts.length).padStart(POST_COUNT_WIDTH, "0");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-stretch border-b">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-6">
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
            Blog &nbsp;/&nbsp; Tag &nbsp;/&nbsp; {tag.slug}
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
        <div className="border-b px-4 py-8 md:px-6 md:py-10">
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
            Tag
          </p>
          <h1 className="mt-3 font-semibold text-4xl tracking-tight md:text-5xl">
            {tag.title}
          </h1>
          {tag.description ? (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
              {tag.description}
            </p>
          ) : null}
        </div>

        <PostList
          emptyDescription="This tag has no published posts yet."
          emptyTitle="No posts with this tag."
          posts={posts}
        />
      </main>
    </div>
  );
}
