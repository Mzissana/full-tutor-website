import type { PageSeo } from './seo';

const SITE_NAME = 'MzissanaEnglish';

export function renderSeoHead(seo: PageSeo): string {
  const escape = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const jsonLd = JSON.stringify(seo.structuredData).replace(/</g, '\\u003c');

  return [
    `<meta name="description" content="${escape(seo.description)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${escape(seo.canonicalUrl)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="ru_RU" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escape(seo.title)}" />`,
    `<meta property="og:description" content="${escape(seo.description)}" />`,
    `<meta property="og:url" content="${escape(seo.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escape(seo.image)}" />`,
    `<meta property="og:image:secure_url" content="${escape(seo.image)}" />`,
    `<meta property="og:image:type" content="${escape(seo.imageType)}" />`,
    `<meta property="og:image:width" content="${seo.imageWidth}" />`,
    `<meta property="og:image:height" content="${seo.imageHeight}" />`,
    `<meta property="og:image:alt" content="${escape(seo.imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(seo.title)}" />`,
    `<meta name="twitter:description" content="${escape(seo.description)}" />`,
    `<meta name="twitter:image" content="${escape(seo.image)}" />`,
    `<meta name="twitter:image:alt" content="${escape(seo.imageAlt)}" />`,
    `<title>${escape(seo.title)}</title>`,
    `<script id="structured-data" type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');
}
