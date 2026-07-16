import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { resolve } from "./presentation/resolve";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

/** Configures Studio structure, Presentation preview, and registered schemas. */
export default defineConfig({
  name: "default",
  title: "Emmanuel Portfolio",

  projectId: "frur52ku",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN || "http://localhost:5173",
        preview: "/blog",
        previewMode: {
          enable: "/api/preview-mode/enable",
          disable: "/api/preview-mode/disable",
        },
      },
      resolve,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
