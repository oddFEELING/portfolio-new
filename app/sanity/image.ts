import type { SanityImageSource } from "@sanity/image-url";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

/** Builds image URLs with Sanity crop and hotspot metadata. */
const builder = imageUrlBuilder(client);

/** Builds a Sanity image URL from an image field or hotspot source. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
