import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'customPlan',
  title: 'Custom Mentorship Packages',
  type: 'document',
  fields: [
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'label' }, validation: (rule) => rule.required() }),
    defineField({ name: 'amountLabel', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'text', validation: (rule) => rule.required() }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'imageUrl', type: 'url' }),
  ],
  preview: { select: { title: 'label', subtitle: 'amountLabel' } },
});
