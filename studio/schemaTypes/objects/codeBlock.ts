import {CodeIcon} from '@sanity/icons/Code'
import {defineField, defineType} from 'sanity'

/** Fenced code sample with language hint for syntax highlighting. */
export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code block',
  type: 'object',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      initialValue: 'typescript',
    }),
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 12,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {language: 'language', filename: 'filename', code: 'code'},
    prepare({language, filename, code}) {
      return {
        title: filename || `Code · ${language || 'text'}`,
        subtitle: typeof code === 'string' ? code.slice(0, 80) : '',
      }
    },
  },
})
