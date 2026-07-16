import {author} from './documents/author'
import {post} from './documents/post'
import {tag} from './documents/tag'
import {blockContent} from './objects/blockContent'
import {callout} from './objects/callout'
import {codeBlock} from './objects/codeBlock'
import {embed} from './objects/embed'
import {seo} from './objects/seo'
import {table} from './objects/table'

/** Registers all document and object schemas used by the Studio. */
export const schemaTypes = [
  // Documents
  author,
  tag,
  post,
  // Objects
  seo,
  blockContent,
  callout,
  codeBlock,
  embed,
  table,
]
