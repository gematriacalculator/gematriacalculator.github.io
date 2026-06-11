const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://gematriacalculator.github.io';
const localizedPrefixes = new Set(['de', 'es', 'fr', 'he', 'hi', 'pt']);
const plainInfoRoutes = new Set(['/about', '/contact', '/privacy-policy', '/terms', '/disclaimer']);
const calculatorPaths = [
  '/english-gematria-calculator',
  '/reverse-gematria-calculator',
  '/name-gematria-calculator',
  '/hebrew-gematria-calculator',
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function meta(html, attr, name) {
  const pattern = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`, 'i');
  return (html.match(pattern) || [])[1] || '';
}

function titleOf(html) {
  return (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
}

function routeFor(file) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const parts = rel.split('/');
  const localized = localizedPrefixes.has(parts[0]);
  const localRel = localized ? parts.slice(1).join('/') : rel;

  if (localRel === 'index.html') return { route: '/', localized, lang: localized ? parts[0] : 'en', rel };
  if (localRel === '404.html' || localRel === '404/index.html') return { route: '/404', localized, lang: localized ? parts[0] : 'en', rel };
  if (localRel.endsWith('/index.html')) return { route: `/${localRel.replace(/\/index\.html$/, '/')}`, localized, lang: localized ? parts[0] : 'en', rel };
  return { route: `/${localRel.replace(/\.html$/, '')}`, localized, lang: localized ? parts[0] : 'en', rel };
}

function urlFor(lang, route) {
  if (lang === 'en') return `${site}${route === '/' ? '/' : route}`;
  if (route === '/') return `${site}/${lang}/`;
  return `${site}/${lang}${route}${route.endsWith('/') ? '' : '/'}`;
}

function fileForPathname(pathname) {
  const clean = decodeURIComponent(pathname);
  if (clean === '/') return path.join(root, 'index.html');
  const withoutSlash = clean.replace(/^\//, '').replace(/\/$/, '');
  const asDirectory = path.join(root, withoutSlash, 'index.html');
  const asHtml = path.join(root, `${withoutSlash}.html`);
  if (clean.endsWith('/')) return asDirectory;
  if (fs.existsSync(asHtml)) return asHtml;
  return asDirectory;
}

const htmlFiles = walk(root);
const sitemap = fs.existsSync(path.join(root, 'sitemap.xml')) ? fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8') : '';
const robots = fs.existsSync(path.join(root, 'robots.txt')) ? fs.readFileSync(path.join(root, 'robots.txt'), 'utf8') : '';
const sitemapUrls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
const expectedSitemapUrls = [];
const issues = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const { route, lang, rel } = routeFor(file);
  const robotsMeta = meta(html, 'name', 'robots').toLowerCase();
  if (robotsMeta !== 'index, follow') continue;
  const normalizedRoute = route !== '/' && route.endsWith('/') ? route.slice(0, -1) : route;
  const isPlainInfoRoute = plainInfoRoutes.has(normalizedRoute);

  const title = titleOf(html).replace(/&amp;/g, '&');
  const description = meta(html, 'name', 'description').replace(/&amp;/g, '&');
  const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
  const expectedCanonical = urlFor(lang, route);
  const hreflangCount = (html.match(/<link\s+rel="alternate"\s+hreflang=/gi) || []).length;
  const ogTags = ['og:title', 'og:description', 'og:type', 'og:url', 'og:image'].filter((tag) => meta(html, 'property', tag));
  const hasBreadcrumbHtml = /<nav\s+class="breadcrumbs"/i.test(html);
  const hasBreadcrumbJson = /"@type"\s*:\s*"BreadcrumbList"/.test(html);
  const hasFaqHtml = /class="[^"]*\bfaq-section\b/i.test(html) && /class="[^"]*\bfaq-item\b/i.test(html);
  const hasFaqJson = /"@type"\s*:\s*"FAQPage"/.test(html);
  const calculatorLinks = calculatorPaths.filter((calculatorPath) => html.includes(`href="${calculatorPath}`) || html.includes(`href="/${lang}${calculatorPath}/`));
  const jsonLdCount = (html.match(/<script type="application\/ld\+json">/gi) || []).length;
  const internalLinks = Array.from(html.matchAll(/\s(?:href|action)="([^"]*)"/gi)).map((match) => match[1]).filter((href) => href && href.startsWith('/'));

  expectedSitemapUrls.push(expectedCanonical);

  if (!title || title.length > 60) issues.push(`${rel}: bad SEO title length (${title.length})`);
  if (!description || description.length > 150) issues.push(`${rel}: bad meta description length (${description.length})`);
  if (canonical !== expectedCanonical) issues.push(`${rel}: canonical mismatch`);
  if (hreflangCount < 8) issues.push(`${rel}: missing hreflang tags`);
  if (ogTags.length < 5) issues.push(`${rel}: incomplete Open Graph tags`);
  if (!hasBreadcrumbHtml || !hasBreadcrumbJson) issues.push(`${rel}: missing breadcrumbs`);
  if (isPlainInfoRoute && (hasFaqHtml || hasFaqJson)) issues.push(`${rel}: plain info page should not include FAQ section or FAQ schema`);
  if (isPlainInfoRoute && /class="[^"]*\brelated-calculators\b/i.test(html)) issues.push(`${rel}: plain info page should not include a related calculators block`);
  if (!isPlainInfoRoute && (!hasFaqHtml || !hasFaqJson)) issues.push(`${rel}: missing FAQ section or FAQ schema`);
  if (!isPlainInfoRoute && calculatorLinks.length < 2) issues.push(`${rel}: missing related calculator links`);
  if (internalLinks.length < 5) issues.push(`${rel}: too few internal links`);
  if (jsonLdCount < 2) issues.push(`${rel}: missing schema JSON-LD`);

  for (const href of internalLinks) {
    if (href.startsWith('/assets/')) continue;
    const pathname = href.split(/[?#]/)[0];
    const target = fileForPathname(pathname);
    if (!fs.existsSync(target)) issues.push(`${rel}: broken internal link ${href}`);
  }
}

if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) issues.push('robots.txt missing sitemap declaration');
if (!/^User-agent:\s*\*/m.test(robots) || !/^Allow:\s*\//m.test(robots)) issues.push('robots.txt does not allow crawling');
if (!sitemap.includes('<urlset')) issues.push('sitemap.xml is not a valid URL set');
if (sitemapUrls.some((url) => /\/404\/?$/.test(url))) issues.push('sitemap contains 404 pages');
if (sitemapUrls.some((url) => /\/number-meanings\/\d+/.test(url))) issues.push('sitemap contains removed number meaning pages');

const expectedSet = new Set(expectedSitemapUrls);
for (const url of expectedSitemapUrls) {
  if (!sitemapUrls.includes(url)) issues.push(`sitemap missing indexable URL ${url}`);
}
for (const url of sitemapUrls) {
  if (!expectedSet.has(url)) issues.push(`sitemap has unexpected URL ${url}`);
}

const summary = {
  indexablePages: expectedSitemapUrls.length,
  sitemapUrls: sitemapUrls.length,
  issueCount: issues.length,
  issues: issues.slice(0, 100),
};

console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exit(1);
