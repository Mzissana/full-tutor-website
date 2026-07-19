import type { PageSeo } from './seo';

const SITE_NAME = 'MzissanaEnglish';

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function applySeoMetadata(seo: PageSeo) {
  document.title = seo.title;
  setMeta('meta[name="description"]', 'name', 'description', seo.description);
  setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow');
  setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'ru_RU');
  setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
  setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', seo.canonicalUrl);
  setMeta('meta[property="og:image"]', 'property', 'og:image', seo.image);
  setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', seo.image);
  setMeta('meta[property="og:image:type"]', 'property', 'og:image:type', seo.imageType);
  setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', String(seo.imageWidth));
  setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', String(seo.imageHeight));
  setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', seo.imageAlt);
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', seo.image);
  setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', seo.imageAlt);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = seo.canonicalUrl;

  let structuredData = document.head.querySelector<HTMLScriptElement>('#structured-data');
  if (!structuredData) {
    structuredData = document.createElement('script');
    structuredData.id = 'structured-data';
    structuredData.type = 'application/ld+json';
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify(seo.structuredData);
}
