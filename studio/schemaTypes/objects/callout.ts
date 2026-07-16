import {InfoOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/** Inline note / tip / warning block inside post body. */
export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          {title: 'Note', value: 'note'},
          {title: 'Tip', value: 'tip'},
          {title: 'Warning', value: 'warning'},
        ],
        layout: 'radio',
      },
      initialValue: 'note',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {tone: 'tone', body: 'body'},
    prepare({tone, body}) {
      return {
        title: `Callout · ${tone ?? 'note'}`,
        subtitle: body,
      }
    },
  },
})
