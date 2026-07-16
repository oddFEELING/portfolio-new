import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { data } from "react-router";
import { PostPortableText } from "@/components/blog/portable-text";
import { useSidebar } from "@/components/ui/sidebar";
import { buildMeta } from "@/lib/seo";
import { urlFor } from "@/sanity/image";
import { useQuery } from "@/sanity/loader";
import { loadQuery } from "@/sanity/loader.server";
import { POST_QUERY } from "@/sanity/queries";
import type { Route } from "./+types/blog.$slug";

/** Uses the standard wide social-card dimensions for article previews. */
const META_IMAGE_WIDTH = 1200;
const META_IMAGE_HEIGHT = 630;

/** Reserves a wide cover area to prevent layout shift while loading. */
const POST_COVER_WIDTH = 1400;
const POST_COVER_HEIGHT = 788;

/** Describes a Sanity image with optional accessible alternative text. */
type PostImage = SanityImageSource & {
  alt?: string;
};

/** Captures the post fields required by the public detail page. */
type BlogPost = {
  author?: {
    name?: string;
  } | null;
  body?: PortableTextBlock[] | null;
  coverImage?: PostImage | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  seo?: {
    metaDescription?: string | null;
    metaTitle?: string | null;
    ogImage?: PostImage | null;
  } | null;
  slug: string;
  tags?: Array<{
    _id: string;
    title?: string;
  } | null> | null;
  title: string;
};

/** Loads one published post and delegates missing slugs to the root 404 boundary. */
export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;

  if (!slug) {
    throw data(null, { status: 404 });
  }

  const initial = await loadQuery<BlogPost | null>(POST_QUERY, { slug });

  if (!initial.data) {
    throw data(null, { status: 404 });
  }

  return { initial, params: { slug }, query: POST_QUERY };
}

/** Builds article metadata from Sanity SEO fields with post-level fallbacks. */
export function meta({ data: routeData }: Route.MetaArgs) {
  const post = routeData?.initial?.data;

  if (!post) {
    return buildMeta({
      noindex: true,
      path: "/blog",
      title: "Post not found",
    });
  }

  const imageSource = post.seo?.ogImage || post.coverImage;
  const image = imageSource
    ? urlFor(imageSource)
        .width(META_IMAGE_WIDTH)
        .height(META_IMAGE_HEIGHT)
        .url()
    : undefined;

  return buildMeta({
    description: post.seo?.metaDescription || post.excerpt || undefined,
    image,
    imageAlt: post.coverImage?.alt || post.title,
    path: `/blog/${post.slug}`,
    title: post.seo?.metaTitle || post.title,
    type: "article",
  });
}

/** Displays a live Sanity-backed article while preserving the shared site chrome. */
export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { toggleSidebar } = useSidebar();
  const { initial, params, query } = loaderData;
  const { data: post } = useQuery<BlogPost | null>(query, params, { initial });

  if (!post) {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* The compact header keeps article context and navigation visible. */}
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6">
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
          BLOG &nbsp;/&nbsp; {post.slug}
        </span>
        <button
          aria-label="Toggle sidebar"
          className="font-mono text-muted-foreground text-xs uppercase tracking-wider"
          onClick={toggleSidebar}
          type="button"
        >
          Menu
        </button>
      </header>

      {/* The scrolling article keeps long-form content within the route viewport. */}
      <article className="min-h-0 flex-1 overflow-y-auto px-4 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : null}
            {post.author?.name ? ` · ${post.author.name}` : null}
          </p>
          <h1 className="mt-4 font-semibold text-4xl tracking-tight md:text-5xl">
            {post.title}
          </h1>

          {/* Tags remain descriptive text until dedicated archive routes exist. */}
          {post.tags?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) =>
                tag ? (
                  <li
                    className="font-mono text-muted-foreground text-xs uppercase tracking-wider"
                    key={tag._id}
                  >
                    {tag.title}
                  </li>
                ) : null
              )}
            </ul>
          ) : null}

          {/* The cover image introduces the article at a content-friendly width. */}
          {post.coverImage ? (
            <img
              alt={post.coverImage.alt || post.title}
              className="mt-8 w-full border object-cover"
              decoding="async"
              height={POST_COVER_HEIGHT}
              loading="eager"
              src={urlFor(post.coverImage).width(POST_COVER_WIDTH).url()}
              width={POST_COVER_WIDTH}
            />
          ) : null}

          {/* Portable Text renders the post body and supported custom blocks. */}
          <div className="prose-blog mt-10">
            <PostPortableText value={post.body} />
          </div>
        </div>
      </article>
    </div>
  );
}
