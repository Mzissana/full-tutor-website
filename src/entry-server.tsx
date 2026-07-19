import { renderToString } from 'react-dom/server';
import App from './App';
import { PAGE_PATHS, pageFromPathname } from './navigation';
import { getPageSeo } from './seo';
import { renderSeoHead } from './seo-server';

export const routes = Object.values(PAGE_PATHS);

export function render(url: string) {
  const page = pageFromPathname(url.split(/[?#]/, 1)[0]);
  if (page === null) {
    throw new Error(`Cannot prerender unknown route: ${url}`);
  }
  const seo = getPageSeo(page);

  return {
    appHtml: renderToString(<App initialUrl={url} />),
    headHtml: renderSeoHead(seo),
  };
}
