const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://gematriacalculator.github.io';
const hubRoute = '/gematria-number-meanings/';
const hubUrl = `${site}${hubRoute}`;
const oldDir = path.join(root, 'number-meanings');
const hubFile = path.join(root, 'gematria-number-meanings', 'index.html');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function textContent(html) {
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

function countMatches(html, pattern) {
  return (html.match(pattern) || []).length;
}

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const issues = [];

if (fs.existsSync(oldDir)) {
  const oldPages = fs.readdirSync(oldDir).filter((file) => /^\d+\.html$/.test(file));
  if (oldPages.length) issues.push(`Old numeric number pages still exist: ${oldPages.length}`);
}

if (!fs.existsSync(hubFile)) {
  issues.push('Missing /gematria-number-meanings/ hub page');
} else {
  const html = read(hubFile);
  const title = titleOf(html);
  const description = meta(html, 'name', 'description');
  const robots = meta(html, 'name', 'robots');
  const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
  const words = textContent(html).split(/\s+/).filter(Boolean).length;

  if (title.length > 60) issues.push(`Hub title too long: ${title.length}`);
  if (description.length > 150) issues.push(`Hub description too long: ${description.length}`);
  if (!/index,\s*follow/i.test(robots)) issues.push(`Hub robots is not index/follow: ${robots}`);
  if (canonical !== hubUrl) issues.push(`Hub canonical mismatch: ${canonical}`);
  if (words < 900) issues.push(`Hub content is too thin: ${words} words`);
  if (countMatches(html, /<h2>/gi) < 8) issues.push('Hub needs more explanatory sections');
  if (countMatches(html, /<details class="faq-item">/gi) < 5) issues.push('Hub needs at least 5 FAQs');
  if (!html.includes('Examples of Words With the Same Value')) issues.push('Hub missing same-value examples');
  if (!html.includes('/english-gematria-calculator')) issues.push('Hub missing related calculator links');
}

const sitemap = fs.existsSync(path.join(root, 'sitemap.xml')) ? read(path.join(root, 'sitemap.xml')) : '';
if (sitemap) {
  if (/\/number-meanings\/\d+/.test(sitemap)) issues.push('Sitemap still contains old numeric number pages');
  if (sitemap.includes(`${site}/number-meanings/`)) issues.push('Sitemap still contains old number-meanings index');
  if (!sitemap.includes(hubUrl)) issues.push('Sitemap missing new gematria-number-meanings hub');
}

const oldLinks = walkHtml(root).filter((file) => {
  const html = read(file);
  return /href="\/number-meanings\/(?:\d+)?/.test(html) || /https:\/\/gematriacalculator\.github\.io\/number-meanings\//.test(html);
});
if (oldLinks.length) issues.push(`Old internal number-meanings links remain: ${oldLinks.length}`);

const summary = {
  hubExists: fs.existsSync(hubFile),
  oldNumericPages: fs.existsSync(oldDir) ? fs.readdirSync(oldDir).filter((file) => /^\d+\.html$/.test(file)).length : 0,
  issueCount: issues.length,
  issues: issues.slice(0, 40),
};

console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exit(1);
