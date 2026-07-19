import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const template = await readFile(resolve(dist, 'index.html'), 'utf8');
const server = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const { render, routes } = await server.ssrLoadModule('/src/entry-server.tsx');

  for (const route of routes) {
    const { appHtml, headHtml } = render(route);
    const html = template
      .replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, `<!--seo-start-->\n    ${headHtml}\n    <!--seo-end-->`)
      .replace('<!--app-html-->', appHtml);
    const output = route === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${route}.html`);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html);
  }
} finally {
  await server.close();
}
