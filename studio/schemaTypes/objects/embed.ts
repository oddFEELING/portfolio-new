import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/** External embed (YouTube or generic URL) rendered in the post body. */
export const embed = defineType({
  name: 'embed',
  title: 'Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {
        list: [
          {title: 'YouTube', value: 'youtube'},
          {title: 'Generic', value: 'generic'},
        ],
        layout: 'radio',
      },
      initialValue: 'generic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Accessible label / link text fallback when the embed cannot render.',
    }),
  ],
  preview: {
    select: {title: 'title', url: 'url', provider: 'provider'},
    prepare({title, url, provider}) {
      return {
        title: title || `Embed · ${provider ?? 'generic'}`,
        subtitle: url,
      }
    },
  },
})
