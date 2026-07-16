import { defineQuery } from "groq";
import {
  POST_QUERY,
  POSTS_QUERY,
  RELATED_CANDIDATES_QUERY,
  TAG_POSTS_QUERY,
  TAG_QUERY,
  TAGS_QUERY,
} from "@/sanity/queries";

/** Preview index — includes drafts / unpublished posts. */
export const POSTS_QUERY_PREVIEW = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  | order(coalesce(publishedAt, _updatedAt) desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage,
    tags[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

/** Preview post detail by slug — includes drafts. */
export const POST_QUERY_PREVIEW = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    author->{
      _id,
      name,
      "slug": slug.current,
      shortBio,
      avatar
    },
    tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    seo,
    relatedPosts[]->{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt
    }
  }
`);

/** Preview tag list — tags referenced by any post (including drafts). */
export const TAGS_QUERY_PREVIEW = defineQuery(`
  *[_type == "tag" && count(*[_type == "post" && references(^._id)]) > 0]
  | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

/** Preview posts for a tag slug — includes drafts. */
export const TAG_POSTS_QUERY_PREVIEW = defineQuery(`
  *[_type == "post" && defined(slug.current)
    && $tagSlug in tags[]->slug.current]
  | order(coalesce(publishedAt, _updatedAt) desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    coverImage,
    tags[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

/** Preview related candidates — includes drafts. */
export const RELATED_CANDIDATES_QUERY_PREVIEW = defineQuery(`
  *[_type == "post" && defined(slug.current) && _id != $postId]
  | order(coalesce(publishedAt, _updatedAt) desc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "tagSlugs": tags[]->slug.current
  }
`);

/** Picks published vs preview query variants for the blog index. */
export function postsQueryFor(preview: boolean) {
  return preview ? POSTS_QUERY_PREVIEW : POSTS_QUERY;
}

/** Picks published vs preview query variants for a single post. */
export function postQueryFor(preview: boolean) {
  return preview ? POST_QUERY_PREVIEW : POST_QUERY;
}

/** Picks published vs preview query variants for tags. */
export function tagsQueryFor(preview: boolean) {
  return preview ? TAGS_QUERY_PREVIEW : TAGS_QUERY;
}

/** Picks published vs preview query variants for tag archives. */
export function tagPostsQueryFor(preview: boolean) {
  return preview ? TAG_POSTS_QUERY_PREVIEW : TAG_POSTS_QUERY;
}

/** Tag document query is the same in preview (tag itself is not draft-filtered). */
export function tagQueryFor(_preview: boolean) {
  return TAG_QUERY;
}

/** Related candidates for article pages. */
export function relatedCandidatesQueryFor(preview: boolean) {
  return preview ? RELATED_CANDIDATES_QUERY_PREVIEW : RELATED_CANDIDATES_QUERY;
}
