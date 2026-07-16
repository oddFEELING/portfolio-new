import { stegaClean } from "@sanity/client/stega";
import { data, useLoaderData } from "react-router";
import { PostList, type PostListItem } from "@/components/blog/post-list";
import { NavDock } from "@/components/navigation/nav-dock";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { buildMeta } from "@/lib/seo";
import { useQuery } from "@/sanity/loader";
import { loadQuery } from "@/sanity/loader.server";
import { tagPostsQueryFor, tagQueryFor } from "@/sanity/preview-queries";
import { getPreviewData } from "@/sanity/session.server";
import type { Route } from "./+types/blog.tag.$slug";

const POST_COUNT_WIDTH = 3;

type TagDocument = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
};

/** Loads a tag and its posts (published or preview); missing tags → 404. */
export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;

  if (!slug) {
    throw data(null, { status: 404 });
  }

  const { preview, options } = await getPreviewData(request);
  const tagQuery = tagQueryFor(preview);
  const postsQuery = tagPostsQueryFor(preview);

  const [tagResult, postsResult] = await Promise.all([
    loadQuery<TagDocument | null>(tagQuery, { slug }, options),
    loadQuery<PostListItem[]>(postsQuery, { tagSlug: slug }, options),
  ]);

  if (!tagResult.data) {
    throw data(null, { status: 404 });
  }

  return {
    postsInitial: postsResult,
    postsParams: { tagSlug: slug },
    postsQuery,
    preview,
    tagInitial: tagResult,
    tagParams: { slug },
    tagQuery,
  };
}

/** Builds tag-archive metadata with stega cleaned for head safety. */
export function meta({ data: routeData }: Route.MetaArgs) {
  const tag = routeData?.tagInitial?.data;

  if (!tag) {
    return buildMeta({
      noindex: true,
      path: "/blog",
      title: "Tag not found",
    });
  }

  const title = stegaClean(tag.title);
  const description = stegaClean(
    tag.description || `Posts tagged ${title} by Emmanuel Alawode.`
  );
  const slug = stegaClean(tag.slug);

  return buildMeta({
    description,
    path: `/blog/tag/${slug}`,
    title: `Tag · ${title}`,
  });
}

/** Tag archive — same list treatment as the index, scoped to one tag. */
export default function BlogTagArchive() {
  const {
    postsInitial,
    postsParams,
    postsQuery,
    preview,
    tagInitial,
    tagParams,
    tagQuery,
  } = useLoaderData<typeof loader>();
  const { data: tag } = useQuery<TagDocument | null>(tagQuery, tagParams, {
    initial: tagInitial,
  });
  const { data: posts } = useQuery<PostListItem[]>(postsQuery, postsParams, {
    initial: postsInitial,
  });

  if (!tag) {
    return null;
  }

  const postCount = String(posts.length).padStart(POST_COUNT_WIDTH, "0");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-stretch border-b">
        <NavDock />
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-6">
          <PageBreadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: stegaClean(tag.slug) },
            ]}
            suffix={preview ? " · Preview" : undefined}
          />
          <span className="font-mono text-muted-foreground text-xs tabular-nums tracking-[0.2em]">
            {postCount}
          </span>
        </div>
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
