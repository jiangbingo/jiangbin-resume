import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

const site = SITE || 'https://jiangbingo.github.io';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => {
    return data.publish !== false;
  });

  return rss({
    title: '江斌的技术博客',
    description: 'AI 应用工程师的技术分享 - RAG、LLM、Python 后端、深度学习等',
    site: context.site || site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        categories: post.data.tags,
      })),
    customData: `<language>zh-cn</language>`,
  });
}
