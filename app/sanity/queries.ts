import { defineQuery } from "groq";

/** Published posts for the blog index, newest first. */
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
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

/** Single published post by slug, including body and related picks. */
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && defined(publishedAt) && !(_id in path("drafts.**"))][0]{
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
    relatedPosts[]->[defined(publishedAt) && !(_id in path("drafts.**"))]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt
    }
  }
`);

/** Slugs + dates for sitemap generation. */
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))]{
    "slug": slug.current,
    publishedAt
  }
`);

/** All tags that have at least one published post. */
export const TAGS_QUERY = defineQuery(`
  *[_type == "tag" && count(*[_type == "post" && defined(publishedAt) && !(_id in path("drafts.**")) && references(^._id)]) > 0]
  | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

/** One tag by slug. */
export const TAG_QUERY = defineQuery(`
  *[_type == "tag" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

/** Published posts that reference a tag slug. */
export const TAG_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))
    && $tagSlug in tags[]->slug.current]
  | order(publishedAt desc) {
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

/** Tag slugs for sitemap (tags with at least one published post). */
export const TAG_SLUGS_QUERY = defineQuery(`
  *[_type == "tag" && defined(slug.current)
    && count(*[_type == "post" && defined(publishedAt) && !(_id in path("drafts.**")) && references(^._id)]) > 0]{
    "slug": slug.current
  }
`);

/** Candidate posts for related-post fallback (exclude current). */
export const RELATED_CANDIDATES_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))
    && _id != $postId]
  | order(publishedAt desc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "tagSlugs": tags[]->slug.current
  }
`);
