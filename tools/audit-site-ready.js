const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://gematriacalculator.github.io';
const localizedPrefixes = new Set(['de', 'es', 'fr', 'he', 'hi', 'pt']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function htmlText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

  if (localRel === 'index.html') return { route: '/', localized, lang: localized ? parts[0] : 'en' };
  if (localRel === '404.html' || localRel === '404/index.html') return { route: '/404', localized, lang: localized ? parts[0] : 'en' };
  if (localRel.endsWith('/index.html')) {
    const route = `/${localRel.replace(/\/index\.html$/, '/')}`;
    return { route, localized, lang: localized ? parts[0] : 'en' };
  }
  return { route: `/${localRel.replace(/\.html$/, '')}`, localized, lang: localized ? parts[0] : 'en' };
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
const sitemapPath = path.join(root, 'sitemap.xml');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const sitemapUrls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
const expectedSitemap = [];
const issues = [];
let indexable = 0;
let noindex = 0;
let localizedIndexable = 0;
let totalWords = 0;
let minIndexableWords = null;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const { route, localized, lang } = routeFor(file);
  const routeKey = route === '/' ? '/' : route.replace(/\/$/, '');
  const shouldIndex = routeKey !== '/404';
  const robots = meta(html, 'name', 'robots').toLowerCase();
  const title = titleOf(html).replace(/&amp;/g, '&');
  const description = meta(html, 'name', 'description').replace(/&amp;/g, '&');
  const keywords = meta(html, 'name', 'keywords');
  const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
  const expectedCanonical = urlFor(lang, route);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const wordCount = htmlText(html).split(/\s+/).filter(Boolean).length;
  const jsonLdCount = (html.match(/<script type="application\/ld\+json">/gi) || []).length;

  if (shouldIndex) {
    indexable += 1;
    if (localized) localizedIndexable += 1;
    totalWords += wordCount;
    if (!minIndexableWords || wordCount < minIndexableWords.wordCount) minIndexableWords = { route: localized ? `/${lang}${route === '/' ? '/' : `${route}/`}` : route, wordCount };
    expectedSitemap.push(expectedCanonical);

    if (robots !== 'index, follow') issues.push(`Expected index, follow on ${rel}; found ${robots}`);
    if (!title || title.length > 60) issues.push(`Bad title length on ${rel}: ${title.length}`);
    if (!description || description.length > 150) issues.push(`Bad description length on ${rel}: ${description.length}`);
    if (!keywords) issues.push(`Missing meta keywords on ${rel}`);
    if (canonical !== expectedCanonical) issues.push(`Canonical mismatch on ${rel}: ${canonical}`);
    if (h1Count !== 1) issues.push(`Expected one h1 on ${rel}; found ${h1Count}`);
    if (wordCount < 250) issues.push(`Thin indexable page ${rel}: ${wordCount} words`);
    if (jsonLdCount < 1) issues.push(`Missing structured data on ${rel}`);
  } else {
    noindex += 1;
    if (robots !== 'noindex, follow') issues.push(`Expected noindex, follow on ${rel}; found ${robots}`);
  }

  if (/\/number-meanings\/\d+/.test(html) || html.includes('https://gematriacalculator.github.io/number-meanings/')) {
    issues.push(`Old number meaning URL found in ${rel}`);
  }
  if (/SearchAction/.test(html)) issues.push(`Obsolete SearchAction schema found in ${rel}`);
  if (/\b(lorem ipsum|demo blog post|sample article)\b/i.test(htmlText(html))) {
    issues.push(`Placeholder content found in ${rel}`);
  }

  const links = Array.from(html.matchAll(/\s(?:href|action)="([^"]*)"/gi)).map((match) => match[1]);
  for (const href of links) {
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|https?:\/\/|\/\/)/i.test(href)) continue;
    if (href.startsWith('/assets/')) continue;
    const pathname = href.split(/[?#]/)[0];
    const target = fileForPathname(pathname);
    if (!fs.existsSync(target)) issues.push(`Broken internal link from ${rel} to ${href}`);
  }
}

const expectedSet = new Set(expectedSitemap);
for (const url of expectedSitemap) {
  if (!sitemapUrls.includes(url)) issues.push(`Missing sitemap URL: ${url}`);
}
for (const url of sitemapUrls) {
  if (!expectedSet.has(url)) issues.push(`Unexpected sitemap URL: ${url}`);
}
if (fs.existsSync(path.join(root, 'number-meanings'))) issues.push('Old number-meanings directory still exists');

const css = fs.existsSync(path.join(root, 'assets', 'css', 'styles.css')) ? fs.readFileSync(path.join(root, 'assets', 'css', 'styles.css'), 'utf8') : '';
const mainJs = fs.existsSync(path.join(root, 'assets', 'js', 'main.js')) ? fs.readFileSync(path.join(root, 'assets', 'js', 'main.js'), 'utf8') : '';
for (const pattern of ['number-grid', 'number-range', 'data-number-filter']) {
  if (css.includes(pattern) || mainJs.includes(pattern)) issues.push(`Unused deleted-number-page code remains: ${pattern}`);
}

const summary = {
  htmlFiles: htmlFiles.length,
  indexable,
  noindex,
  localizedIndexable,
  sitemapUrls: sitemapUrls.length,
  averageIndexableWords: indexable ? Math.round(totalWords / indexable) : 0,
  minIndexableWords,
  issueCount: issues.length,
  issues: issues.slice(0, 80),
};

console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exit(1);
