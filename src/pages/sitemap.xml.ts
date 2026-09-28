import type { APIRoute } from 'astro';
import { listActiveMenuProducts } from '@/lib/db/products';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://www.tkeños-sc.com';
  const products = await listActiveMenuProducts().catch(() => []);
  const now = new Date().toISOString().split('T')[0];

  const urls = [
    {
      loc: `${siteUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: '1.0',
    },
    ...products.map((p) => ({
      loc: `${siteUrl}/producto/${p.id}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
