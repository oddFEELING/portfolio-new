import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

/** Configures the portfolio Studio, its content structure, and registered schemas. */
export default defineConfig({
  name: 'default',
  title: 'Emmanuel Portfolio',

  projectId: 'frur52ku',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
