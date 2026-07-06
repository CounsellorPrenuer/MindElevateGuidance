import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (rule) => rule.required() }),
    defineField({ name: 'excerpt', type: 'text', validation: (rule) => rule.required() }),
    defineField({ name: 'content', type: 'text', validation: (rule) => rule.required() }),
    defineField({ name: 'category', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'date', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'readTime', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
  ],
  preview: { select: { title: 'title', subtitle: 'category' } },
});
