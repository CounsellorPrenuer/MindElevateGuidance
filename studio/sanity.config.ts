import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'MindElevate Studio',
  projectId: 'd8qf2ndh',
  dataset: 'production',
  plugins: [visionTool()],
  schema: {
    types: schemaTypes,
  },
});
