import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

/** Maps Studio documents to front-end locations for Presentation navigation. */
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    post: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled post",
            href: `/blog/${doc?.slug ?? ""}`,
          },
          { title: "Blog index", href: "/blog" },
        ],
      }),
    }),
    tag: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled tag",
            href: `/blog/tag/${doc?.slug ?? ""}`,
          },
          { title: "Blog index", href: "/blog" },
        ],
      }),
    }),
    author: defineLocations({
      select: { title: "name" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Author", href: "/blog" }],
      }),
    }),
  },
};
