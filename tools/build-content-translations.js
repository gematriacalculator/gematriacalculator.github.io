const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const cachePath = path.join(__dirname, 'i18n-content-cache.json');
const siteLanguages = ['es', 'fr', 'de', 'pt', 'hi', 'he'];
const localizedRoots = new Set(['de', 'es', 'fr', 'he', 'hi', 'pt']);
const separator = 'ZXQ_TRANSLATE_SEPARATOR_ZXQ';

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || localizedRoots.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
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

function isTranslatable(value) {
  const text = value.trim();
  if (!text) return false;
  if (text.length === 1 && /^[A-Z0-9]$/.test(text)) return false;
  if (/^[A-Z0-9\s+().:=,-]+$/.test(text) && /[A-Z]/.test(text)) return false;
  if (/^[\d\s+().:=,-]+$/.test(text)) return false;
  if (/^[\u0590-\u05ff\s]+$/.test(text)) return false;
  if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(text)) return false;
  return /[A-Za-z]/.test(text);
}

function collectStrings() {
  const strings = new Set();
  for (const file of walkHtml(root)) {
    let html = fs.readFileSync(file, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<textarea[\s\S]*?<\/textarea>/gi, ' ');

    html.replace(/>\s*([^<>]+?)\s*</g, (match, raw) => {
      const text = htmlUnescape(raw).replace(/\s+/g, ' ').trim();
      if (isTranslatable(text)) strings.add(text);
      return match;
    });

    html.replace(/\s(?:placeholder|aria-label|title|alt)="([^"]*)"/gi, (match, raw) => {
      const text = htmlUnescape(raw).replace(/\s+/g, ' ').trim();
      if (isTranslatable(text)) strings.add(text);
      return match;
    });
  }
  return Array.from(strings).sort((a, b) => a.localeCompare(b));
}

function loadCache() {
  if (!fs.existsSync(cachePath)) return { translations: {} };
  try {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch {
    return { translations: {} };
  }
}

function protectText(text) {
  const tokens = [];
  const pattern = /(https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|[A-Z]{2,}(?:\s+(?:and|or|vs)\s+[A-Z]{2,})*|[A-Z]\s*=\s*\d+|[A-Z]\(\d+\)|[\u0590-\u05ff]+)/g;
  const protectedText = text.replace(pattern, (match) => {
    const token = `ZXQPH${tokens.length}ZXQ`;
    tokens.push([token, match]);
    return token;
  });
  return { protectedText, tokens };
}

function restoreText(text, tokens) {
  let restored = text;
  for (const [token, original] of tokens) {
    restored = restored.replace(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), original);
  }
  return restored.replace(/\s+/g, ' ').trim();
}

function chunkItems(items, maxChars = 4500, maxItems = 35) {
  const chunks = [];
  let current = [];
  let length = 0;
  for (const item of items) {
    const nextLength = length + item.protectedText.length + separator.length + 2;
    if (current.length && (current.length >= maxItems || nextLength > maxChars)) {
      chunks.push(current);
      current = [];
      length = 0;
    }
    current.push(item);
    length += item.protectedText.length + separator.length + 2;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

async function translateChunk(lang, chunk) {
  const query = chunk.map((item) => item.protectedText).join(`\n${separator}\n`);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation request failed for ${lang}: ${response.status}`);
  const data = await response.json();
  const translated = data[0].map((part) => part[0]).join('');
  const pieces = translated.split(new RegExp(`\\s*${separator}\\s*`));
  if (pieces.length !== chunk.length) {
    if (chunk.length === 1) return [restoreText(translated, chunk[0].tokens)];
    const results = [];
    for (const item of chunk) {
      results.push((await translateChunk(lang, [item]))[0]);
    }
    return results;
  }
  return pieces.map((piece, index) => restoreText(piece, chunk[index].tokens));
}

async function main() {
  const strings = collectStrings();
  const cache = loadCache();
  cache.translations = cache.translations || {};

  for (const lang of siteLanguages) {
    cache.translations[lang] = cache.translations[lang] || {};
    const missing = strings
      .filter((text) => !cache.translations[lang][text])
      .map((text) => ({ source: text, ...protectText(text) }));

    if (!missing.length) {
      console.log(`${lang}: 0 new translations`);
      continue;
    }

    let completed = 0;
    for (const chunk of chunkItems(missing)) {
      const translated = await translateChunk(lang, chunk);
      translated.forEach((value, index) => {
        cache.translations[lang][chunk[index].source] = value;
      });
      completed += chunk.length;
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n', 'utf8');
      console.log(`${lang}: ${completed}/${missing.length}`);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  }

  cache.generatedAt = new Date().toISOString();
  cache.sourceCount = strings.length;
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  console.log(`Content translation cache ready: ${strings.length} source strings`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
