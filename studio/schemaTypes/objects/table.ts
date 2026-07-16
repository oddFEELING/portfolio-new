import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Simple markdown-like table stored as rows of string cells. */
export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}) {
              const list = Array.isArray(cells) ? cells : []
              return {title: list.join(' | ') || 'Empty row'}
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {caption: 'caption', rows: 'rows'},
    prepare({caption, rows}) {
      const count = Array.isArray(rows) ? rows.length : 0
      return {
        title: caption || 'Table',
        subtitle: `${count} row${count === 1 ? '' : 's'}`,
      }
    },
  },
})
