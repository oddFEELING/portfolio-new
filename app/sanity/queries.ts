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
    relatedPosts[]->{
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
