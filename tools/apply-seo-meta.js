const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const localizedPrefixes = new Set(['de', 'es', 'fr', 'he', 'hi', 'pt']);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function routeForFile(file) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const parts = rel.split('/');
  const localized = localizedPrefixes.has(parts[0]);
  const localRel = localized ? parts.slice(1).join('/') : rel;

  if (localRel === 'index.html') return { route: '/', localized };
  if (localRel === '404.html' || localRel === '404/index.html') return { route: '/404', localized };
  if (localRel.endsWith('/index.html')) {
    return { route: `/${localRel.replace(/\/index\.html$/, '/')}`, localized };
  }
  return { route: `/${localRel.replace(/\.html$/, '')}`, localized };
}

function metaForRoute(route) {
  const exact = {
    '/': {
      title: 'Gematria Calculator - Word & Name Tool',
      description: 'Calculate English, reverse, name, and Hebrew gematria values with letter-by-letter breakdowns for words, names, and phrases.',
      keywords: 'gematria calculator, english gematria, hebrew gematria, name gematria, word value calculator',
    },
    '/english-gematria-calculator': {
      title: 'English Gematria Calculator - A6-Z156',
      description: 'Calculate English gematria A6 to Z156 values for words, names, and phrases with a clear letter-by-letter breakdown.',
      keywords: 'english gematria calculator, A6 Z156, english gematria, gematria value, word value calculator',
    },
    '/reverse-gematria-calculator': {
      title: 'Reverse Gematria Calculator - A26-Z1',
      description: 'Calculate reverse gematria A26 to Z1 values for words, names, and phrases with instant letter-by-letter totals.',
      keywords: 'reverse gematria calculator, A26 Z1, reverse ordinal, gematria value, word calculator',
    },
    '/name-gematria-calculator': {
      title: 'Name Gematria Calculator',
      description: 'Calculate the gematria value of a first name, full name, nickname, or initials with a detailed letter breakdown.',
      keywords: 'name gematria calculator, name value calculator, full name gematria, nickname gematria, gematria calculator',
    },
    '/hebrew-gematria-calculator': {
      title: 'Hebrew Gematria Calculator',
      description: 'Calculate Hebrew gematria values with standard Hebrew letter values, final forms, and a clear letter breakdown.',
      keywords: 'hebrew gematria calculator, hebrew letter values, gematria hebrew, hebrew numerology, gematria calculator',
    },
    '/gematria-number-meanings/': {
      title: 'Gematria Number Meanings Guide',
      description: 'Learn gematria number meanings with calculation methods, shared-value examples, interpretation tips, related calculators, and FAQs.',
      keywords: 'gematria number meanings, number meaning guide, gematria interpretation, shared value examples, digital root meanings',
    },
    '/blog/': {
      title: 'Gematria Blog - Guides and Meanings',
      description: 'Read gematria guides, method explanations, number meanings, and tips for English, Hebrew, name, and reverse calculators.',
      keywords: 'gematria blog, gematria guide, english gematria guide, hebrew gematria guide, number meanings',
    },
    '/blog/what-is-gematria': {
      title: 'What Is Gematria? Meaning Guide',
      description: 'Learn what gematria means, how letter values work, common methods, simple examples, and responsible interpretation.',
      keywords: 'what is gematria, gematria meaning, gematria methods, letter values, gematria guide',
    },
    '/blog/english-gematria-explained': {
      title: 'English Gematria A6-Z156 Guide',
      description: 'Learn English gematria A6 to Z156 values, calculation steps, examples, and clear comparison tips.',
      keywords: 'english gematria explained, A6 Z156 values, english gematria guide, gematria examples, letter values',
    },
    '/blog/hebrew-vs-english-gematria': {
      title: 'Hebrew vs English Gematria Guide',
      description: 'Compare Hebrew and English gematria, scripts, value tables, transliteration issues, examples, and interpretation tips.',
      keywords: 'hebrew vs english gematria, hebrew gematria, english gematria, transliteration gematria, value tables',
    },
    '/blog/how-to-calculate-name-gematria': {
      title: 'Name Gematria Calculation Guide',
      description: 'Learn how to calculate name gematria, compare first and full names, choose spelling, and read name values responsibly.',
      keywords: 'name gematria, calculate name gematria, first name value, full name gematria, name calculator',
    },
    '/blog/gematria-number-meanings': {
      title: 'Gematria Number Meanings Guide',
      description: 'Learn how to read gematria number meanings, compare values, use digital roots, and avoid forced patterns.',
      keywords: 'gematria number meanings, digital root, symbolic numbers, gematria interpretation, number guide',
    },
    '/about': {
      title: 'About Gematria Calculator',
      description: 'Learn about Gematria Calculator, its purpose, methods, editorial approach, accuracy checks, and responsible symbolic use.',
      keywords: 'about gematria calculator, gematria tool, calculator methods, editorial policy, gematria accuracy',
    },
    '/contact': {
      title: 'Contact Gematria Calculator',
      description: 'Contact Gematria Calculator for corrections, calculator feedback, privacy questions, article ideas, and content updates.',
      keywords: 'contact gematria calculator, calculator feedback, gematria corrections, privacy questions, article suggestions',
    },
    '/privacy-policy': {
      title: 'Privacy Policy - Gematria Calculator',
      description: 'Read how Gematria Calculator handles calculator input, cookies, Google AdSense, analytics, third-party services, and user choices.',
      keywords: 'gematria calculator privacy, privacy policy, cookies, google adsense, calculator data',
    },
    '/terms': {
      title: 'Terms and Conditions - Gematria Calculator',
      description: 'Read Gematria Calculator terms covering permitted use, educational purpose, ads, external links, and liability limits.',
      keywords: 'gematria calculator terms, terms and conditions, permitted use, calculator terms, website terms',
    },
    '/disclaimer': {
      title: 'Disclaimer - Gematria Calculator',
      description: 'Read the disclaimer about symbolic interpretation, calculator accuracy, professional advice limits, ads, and external links.',
      keywords: 'gematria disclaimer, calculator disclaimer, symbolic interpretation, gematria accuracy, professional advice',
    },
    '/404': {
      title: 'Page Not Found - Gematria Calculator',
      description: 'The requested page could not be found. Return to gematria calculators, number meanings, blog guides, or contact pages.',
      keywords: 'gematria calculator, page not found, calculators, number meanings, gematria blog',
    },
  };

  return exact[route] || {
    title: 'Gematria Calculator',
    description: 'Calculate gematria values and explore educational guides, number meanings, and symbolic interpretation notes.',
    keywords: 'gematria calculator, gematria value, letter values, number meanings, symbolic interpretation',
  };
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function upsertMeta(html, attr, name, value) {
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`, 'i');
  if (pattern.test(html)) return html.replace(pattern, `$1${escaped}$2`);

  if (attr === 'name' && name === 'keywords') {
    const descPattern = /(<meta\s+name="description"\s+content="[^"]*">)/i;
    if (descPattern.test(html)) return html.replace(descPattern, `$1<meta name="keywords" content="${escaped}">`);
  }

  const anchor = /(<meta\s+name="robots"\s+content="[^"]*">)/i;
  if (anchor.test(html)) return html.replace(anchor, `<meta ${attr}="${name}" content="${escaped}">$1`);
  return html.replace('</head>', `<meta ${attr}="${name}" content="${escaped}"></head>`);
}

let updated = 0;
for (const file of walkHtml(root)) {
  const { route, localized } = routeForFile(file);
  const meta = metaForRoute(route);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  if (!localized) {
    html = setTitle(html, meta.title);
    html = upsertMeta(html, 'name', 'description', meta.description);
    html = upsertMeta(html, 'property', 'og:title', meta.title);
    html = upsertMeta(html, 'property', 'og:description', meta.description);
    html = upsertMeta(html, 'name', 'twitter:title', meta.title);
    html = upsertMeta(html, 'name', 'twitter:description', meta.description);
  }
  html = upsertMeta(html, 'name', 'keywords', meta.keywords);
  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    updated += 1;
  }
}

console.log(`SEO metadata updated in ${updated} HTML files.`);
