import { useLoaderData } from "react-router";
import { PostList, type PostListItem } from "@/components/blog/post-list";
import { useSidebar } from "@/components/ui/sidebar";
import { buildMeta } from "@/lib/seo";
import { useQuery } from "@/sanity/loader";
import { loadQuery } from "@/sanity/loader.server";
import { POSTS_QUERY } from "@/sanity/queries";
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

/** Loads published posts for server rendering and live preview hydration. */
export async function loader() {
  const params = {};
  const initial = await loadQuery<PostListItem[]>(POSTS_QUERY, params);

  return { initial, params, query: POSTS_QUERY };
}

/** Displays the live Sanity-backed blog index. */
export default function Blog() {
  const { toggleSidebar } = useSidebar();
  const { initial, params, query } = useLoaderData<typeof loader>();
  const { data: posts } = useQuery<PostListItem[]>(query, params, { initial });
  const postCount = String(posts.length).padStart(POST_COUNT_WIDTH, "0");

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
        {/* The vertical control keeps navigation available within the route header. */}
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
        <PostList posts={posts} />
      </main>
    </div>
  );
}
