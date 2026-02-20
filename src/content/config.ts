import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    publish: z.boolean().default(true),
    author: z.string().default('Jiang Bin'),
  }),
});

export const collections = { blog };
