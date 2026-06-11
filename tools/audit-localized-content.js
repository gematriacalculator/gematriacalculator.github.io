const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const languages = ['de', 'es', 'fr', 'he', 'hi', 'pt'];
const ignoredDirs = new Set(['.git', 'node_modules', ...languages]);

function walkSourceHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    if (entry.isFile() && /^google[a-z0-9]+\.html$/i.test(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkSourceHtml(full, files);
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function routeForSource(file) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.slice(0, -'.html'.length)}`;
}

function localizedFile(lang, route) {
  if (route === '/') return path.join(root, lang, 'index.html');
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(root, lang, clean, 'index.html');
}

function htmlUnescape(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&copy;/g, '(c)')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sourcePhrases(html) {
  const phrases = new Set();
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');

  stripped.replace(/>\s*([^<>]+?)\s*</g, (match, raw) => {
    const text = htmlUnescape(raw).replace(/\s+/g, ' ').trim();
    if (text.length < 45) return match;
    if (!/[a-z]/.test(text)) return match;
    if (/^(Copyright|Last updated:|A=|B=|C=)/i.test(text)) return match;
    phrases.add(text);
    return match;
  });
  return Array.from(phrases);
}

const issues = [];
let checkedPages = 0;
let checkedPhrases = 0;

for (const sourceFile of walkSourceHtml(root)) {
  const route = routeForSource(sourceFile);
  if (route === '/404') continue;
  const phrases = sourcePhrases(fs.readFileSync(sourceFile, 'utf8'));
  checkedPhrases += phrases.length;

  for (const lang of languages) {
    const target = localizedFile(lang, route);
    if (!fs.existsSync(target)) {
      issues.push(`Missing localized page ${lang}${route}`);
      continue;
    }
    checkedPages += 1;
    const text = visibleText(fs.readFileSync(target, 'utf8'));
    const leaks = phrases.filter((phrase) => text.includes(phrase)).slice(0, 5);
    for (const leak of leaks) {
      issues.push(`Untranslated English text in ${path.relative(root, target).replace(/\\/g, '/')}: ${leak.slice(0, 120)}`);
    }
  }
}

const summary = {
  checkedPages,
  checkedPhrases,
  issueCount: issues.length,
  issues: issues.slice(0, 80),
};

console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exit(1);
