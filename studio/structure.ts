import type {StructureResolver} from 'sanity/structure'

/** Provides navigation for posts, tags, and the singleton author profile. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(S.documentTypeList('post').title('Posts')),
      S.listItem()
        .title('Tags')
        .schemaType('tag')
        .child(S.documentTypeList('tag').title('Tags')),
      S.listItem()
        .title('Author')
        .id('author')
        .child(S.document().schemaType('author').documentId('author').title('Author')),
    ])
