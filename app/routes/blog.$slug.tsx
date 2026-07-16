import type { PortableTextBlock } from "@portabletext/types";
import { stegaClean } from "@sanity/client/stega";
import type { SanityImageSource } from "@sanity/image-url";
import { data } from "react-router";
import { PostPortableText } from "@/components/blog/portable-text";
import { RelatedPosts } from "@/components/blog/related-posts";
import { TagChips } from "@/components/blog/tag-chips";
import { useSidebar } from "@/components/ui/sidebar";
import { type RelatedPost, resolveRelatedPosts } from "@/lib/blog/related";
import { buildMeta } from "@/lib/seo";
import { urlFor } from "@/sanity/image";
import { useQuery } from "@/sanity/loader";
import { loadQuery } from "@/sanity/loader.server";
import {
  postQueryFor,
  relatedCandidatesQueryFor,
} from "@/sanity/preview-queries";
import { getPreviewData } from "@/sanity/session.server";
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
  _id: string;
  author?: {
    name?: string;
  } | null;
  body?: PortableTextBlock[] | null;
  coverImage?: PostImage | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  relatedPosts?: Array<RelatedPost | null> | null;
  seo?: {
    metaDescription?: string | null;
    metaTitle?: string | null;
    ogImage?: PostImage | null;
  } | null;
  slug: string;
  tags?: Array<{
    _id: string;
    title: string;
    slug: string;
  } | null> | null;
  title: string;
};

type RelatedCandidate = RelatedPost & {
  tagSlugs?: Array<string | null> | null;
};

/** Loads one post (published or preview) plus hybrid related posts. */
export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;

  if (!slug) {
    throw data(null, { status: 404 });
  }

  const { preview, options } = await getPreviewData(request);
  const query = postQueryFor(preview);
  const initial = await loadQuery<BlogPost | null>(query, { slug }, options);

  if (!initial.data) {
    throw data(null, { status: 404 });
  }

  const candidatesResult = await loadQuery<RelatedCandidate[]>(
    relatedCandidatesQueryFor(preview),
    { postId: initial.data._id },
    options
  );

  const currentTagSlugs = (initial.data.tags ?? [])
    .map((tag) => (tag?.slug ? stegaClean(tag.slug) : null))
    .filter((value): value is string => Boolean(value));

  const related = resolveRelatedPosts({
    candidates: candidatesResult.data ?? [],
    currentTagSlugs,
    manual: initial.data.relatedPosts,
  });

  return {
    initial,
    params: { slug },
    preview,
    query,
    related,
  };
}

/** Builds article metadata — stega cleaned so head tags stay SEO-safe. */
export function meta({ data: routeData }: Route.MetaArgs) {
  const post = routeData?.initial?.data;

  if (!post) {
    return buildMeta({
      noindex: true,
      path: "/blog",
      title: "Post not found",
    });
  }

  const title = stegaClean(post.seo?.metaTitle || post.title);
  const description = stegaClean(
    post.seo?.metaDescription || post.excerpt || undefined
  );
  const slug = stegaClean(post.slug);
  const imageSource = post.seo?.ogImage || post.coverImage;
  const image = imageSource
    ? urlFor(imageSource)
        .width(META_IMAGE_WIDTH)
        .height(META_IMAGE_HEIGHT)
        .url()
    : undefined;

  return buildMeta({
    description,
    image,
    imageAlt: stegaClean(post.coverImage?.alt || post.title),
    path: `/blog/${slug}`,
    title,
    type: "article",
  });
}

/** Displays a live Sanity-backed article while preserving the shared site chrome. */
export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { toggleSidebar } = useSidebar();
  const { initial, params, preview, query, related } = loaderData;
  const { data: post } = useQuery<BlogPost | null>(query, params, { initial });

  if (!post) {
    return null;
  }

  const tags = (post.tags ?? []).filter(
    (tag): tag is { _id: string; title: string; slug: string } =>
      Boolean(tag?._id && tag.title && tag.slug)
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6">
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
          BLOG &nbsp;/&nbsp; {stegaClean(post.slug)}
          {preview ? " · PREVIEW" : ""}
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
            {!post.publishedAt && preview ? "Draft" : null}
            {post.author?.name ? ` · ${post.author.name}` : null}
          </p>
          <h1 className="mt-4 font-semibold text-4xl tracking-tight md:text-5xl">
            {post.title}
          </h1>

          {tags.length > 0 ? (
            <div className="mt-4">
              <TagChips linkTo="archive" tags={tags} />
            </div>
          ) : null}

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

          <div className="prose-blog mt-10">
            <PostPortableText value={post.body} />
          </div>

          <RelatedPosts posts={related} />
        </div>
      </article>
    </div>
  );
}
