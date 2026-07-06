import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'paymentPlan',
  title: 'Standard Mentoria Packages',
  type: 'document',
  fields: [
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'label' }, validation: (rule) => rule.required() }),
    defineField({ name: 'subgroup', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'amountLabel', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'paymentButtonId', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'features', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'label', subtitle: 'subgroup' } },
});
