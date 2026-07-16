/** Lightweight post summary used for related-post lists. */
export type RelatedPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string | null;
  excerpt?: string | null;
};

type RelatedCandidate = RelatedPost & {
  tagSlugs?: Array<string | null> | null;
};

const DEFAULT_LIMIT = 3;

type RelatedPicker = {
  limit: number;
  picked: RelatedPost[];
  pickedIds: Set<string>;
};

/** Adds a post when it is valid and capacity remains. */
function tryPush(picker: RelatedPicker, post: RelatedPost | null | undefined) {
  if (!(post?.slug && post.title) || picker.pickedIds.has(post._id)) {
    return;
  }
  if (picker.picked.length >= picker.limit) {
    return;
  }
  picker.picked.push(post);
  picker.pickedIds.add(post._id);
}

/** True when a candidate shares any of the current post's tags. */
function sharesTag(candidate: RelatedCandidate, tagSet: Set<string>) {
  return (candidate.tagSlugs ?? []).some((slug) => slug && tagSet.has(slug));
}

/** Picks up to `limit` related posts: manual → shared tags → recent. */
export function resolveRelatedPosts(options: {
  manual: Array<RelatedPost | null> | null | undefined;
  candidates: RelatedCandidate[];
  currentTagSlugs: string[];
  limit?: number;
}): RelatedPost[] {
  const picker: RelatedPicker = {
    limit: options.limit ?? DEFAULT_LIMIT,
    picked: [],
    pickedIds: new Set(),
  };

  for (const post of options.manual ?? []) {
    tryPush(picker, post);
  }

  const tagSet = new Set(options.currentTagSlugs.filter(Boolean));
  if (tagSet.size > 0 && picker.picked.length < picker.limit) {
    for (const candidate of options.candidates) {
      if (sharesTag(candidate, tagSet)) {
        tryPush(picker, candidate);
      }
    }
  }

  if (picker.picked.length < picker.limit) {
    for (const candidate of options.candidates) {
      tryPush(picker, candidate);
    }
  }

  return picker.picked;
}
