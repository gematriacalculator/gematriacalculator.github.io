const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://gematriacalculator.github.io';
const route = '/gematria-number-meanings/';
const updated = 'June 2026';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function head() {
  const title = 'Gematria Number Meanings Guide';
  const description = 'Learn gematria number meanings with calculation methods, shared-value examples, interpretation tips, related calculators, and FAQs.';
  const url = `${site}${route}`;
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: '2026-06-09',
    dateModified: '2026-06-09',
    author: { '@type': 'Organization', name: 'Gematria Calculator' },
    publisher: { '@type': 'Organization', name: 'Gematria Calculator' },
    mainEntityOfPage: url,
    inLanguage: 'en-US',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ['What do gematria numbers mean?', 'Gematria numbers are symbolic totals created by adding letter values from a selected method. Their meaning depends on the word, language, spelling, and system used.'],
      ['Are number meanings the same in every gematria system?', 'No. English, simple, reverse, Jewish, and Hebrew gematria use different value tables, so the same word can produce different totals and interpretations.'],
      ['Can two words have the same gematria value?', 'Yes. Shared values are common. A match is more useful when the words are related by topic, language, or method rather than selected randomly.'],
      ['Should every number have its own meaning page?', 'Not automatically. Strong number pages should be written slowly with unique examples, context, and human editing instead of generated in bulk.'],
      ['Can gematria predict events?', 'No. Gematria is a symbolic and educational tool. It should not be used as proof, prediction, or professional advice.'],
    ].map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
      { '@type': 'ListItem', position: 2, name: 'Gematria Number Meanings', item: url },
    ],
  };
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><link rel="icon" type="image/png" href="/assets/images/favicon.png"><link rel="stylesheet" href="/assets/css/styles.css"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/images/og-image.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${site}/assets/images/og-image.png">${jsonLd(webPageSchema)}${jsonLd(faqSchema)}${jsonLd(breadcrumbSchema)}`;
}

function nav() {
  return `</head><body><a class="skip-link" href="#main-content">Skip to main content</a><header class="site-header"><nav class="site-nav" aria-label="Main navigation"><a class="site-logo" href="/" aria-label="Gematria Calculator home"><img src="/assets/images/logo.svg" alt="" width="36" height="36"><span>Gematria Calculator</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="menu-icon" aria-hidden="true"></span><span>Menu</span></button><ul class="nav-menu" id="main-menu"><li><a href="/">Home</a></li><li><a href="/english-gematria-calculator">English</a></li><li><a href="/reverse-gematria-calculator">Reverse</a></li><li><a href="/name-gematria-calculator">Name</a></li><li><a href="/hebrew-gematria-calculator">Hebrew</a></li><li><a href="/gematria-number-meanings/">Number Meanings</a></li><li><a href="/blog/">Blog</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><section class="footer-brand" aria-label="About this website"><a class="footer-logo" href="/"><img src="/assets/images/logo.svg" alt="" width="32" height="32"><span>Gematria Calculator</span></a><p>Gematria Calculator is a free online tool for calculating English, reverse, name, and Hebrew gematria values. Use it for educational, symbolic, spiritual, and entertainment purposes.</p></section><nav aria-label="Footer navigation"><ul class="footer-links"><li><a href="/">Home</a></li><li><a href="/english-gematria-calculator">English Gematria Calculator</a></li><li><a href="/reverse-gematria-calculator">Reverse Gematria Calculator</a></li><li><a href="/name-gematria-calculator">Name Gematria Calculator</a></li><li><a href="/hebrew-gematria-calculator">Hebrew Gematria Calculator</a></li><li><a href="/gematria-number-meanings/">Number Meanings</a></li><li><a href="/blog/">Blog</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms">Terms</a></li><li><a href="/disclaimer">Disclaimer</a></li></ul></nav><p class="copyright">Copyright &copy; 2026 Gematria Calculator. All rights reserved.</p></div></footer><script src="/assets/js/i18n.js" defer></script><script src="/assets/js/main.js" defer></script><script src="/assets/js/calculators.js" defer></script></body></html>`;
}

function section(title, body) {
  return `<section class="content-section"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table class="gematria-table"><thead><tr>${headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function calculatorCards() {
  const links = [
    ['/english-gematria-calculator', 'English Gematria Calculator', 'Use A=6 through Z=156 values for English words, names, and phrases.'],
    ['/reverse-gematria-calculator', 'Reverse Gematria Calculator', 'Compare reverse alphabet values where A=26 and Z=1.'],
    ['/name-gematria-calculator', 'Name Gematria Calculator', 'Calculate first names, full names, nicknames, and initials.'],
    ['/hebrew-gematria-calculator', 'Hebrew Gematria Calculator', 'Calculate standard Hebrew letter values and common final forms.'],
  ];
  return `<div class="card-grid">${links.map(([href, title, text]) => `<article class="info-card"><h3><a href="${href}">${escapeHtml(title)}</a></h3><p>${escapeHtml(text)}</p></article>`).join('')}</div>`;
}

function page() {
  const sameValueRows = [
    ['LOVE and SUN', 'Simple Gematria', '54', 'L=12 + O=15 + V=22 + E=5; S=19 + U=21 + N=14'],
    ['FAITH and HOPE', 'Simple Gematria', '44', 'Both words total 44 in A=1 through Z=26 values.'],
    ['MICHAEL and OMNI', 'English Gematria', '306', 'English Gematria multiplies simple alphabet totals by 6.'],
    ['WISDOM and PRAYER', 'English Gematria', '498', 'Both words share the same A6-Z156 total.'],
    ['TRUTH and WORD', 'Reverse Ordinal', '48', 'Reverse values can create different matches than simple values.'],
    ['FIRE and GOLD', 'Reverse Ordinal', '70', 'A same-value match should still be checked for topic relevance.'],
    ['&#1513;&#1500;&#1493;&#1501;', 'Hebrew Gematria', '376', '&#1513;=300 + &#1500;=30 + &#1493;=6 + &#1501;=40'],
  ];
  const methodRows = [
    ['Simple Gematria', 'A=1, B=2, C=3 ... Z=26', 'Good for quick alphabet-value comparisons.'],
    ['English Gematria', 'A=6, B=12, C=18 ... Z=156', 'Common for English word and phrase totals.'],
    ['Reverse Ordinal', 'A=26, B=25, C=24 ... Z=1', 'Useful for comparing reverse alphabet patterns.'],
    ['Full Reduction', 'Letters reduce to 1-9 cycles', 'Useful when studying digital-root style patterns.'],
    ['Hebrew Gematria', 'Hebrew letters use traditional values', 'Use for Hebrew spelling, not English transliteration unless clearly labeled.'],
  ];
  const faq = `<section class="content-section faq-section" id="faq"><div class="section-heading"><h2>Gematria Number Meanings FAQ</h2></div><div class="faq-list"><details class="faq-item"><summary>What do gematria numbers mean?</summary><p>Gematria numbers are symbolic totals created by adding letter values from a chosen method. The number becomes useful only when the original word, spelling, language, and method are clear.</p></details><details class="faq-item"><summary>Why do meanings vary by system?</summary><p>Each system uses a different value table. Simple, English, reverse, reduction, Jewish, and Hebrew gematria can all produce different totals for related inputs.</p></details><details class="faq-item"><summary>Are same-value words always connected?</summary><p>No. Same-value words are starting points for comparison, not proof. The strongest comparisons share language, method, spelling discipline, and a meaningful topic link.</p></details><details class="faq-item"><summary>Should I look up a number before calculating?</summary><p>Calculate first. Then interpret the result after checking the method and letter breakdown. This keeps the reading grounded in an actual result.</p></details><details class="faq-item"><summary>Will this site publish individual number pages?</summary><p>Only selected number pages should be published slowly when they have enough unique examples, context, and human-edited content to help readers.</p></details></div></section>`;
  const disclaimer = '<section class="content-section disclaimer-box"><h2>Disclaimer</h2><p>Gematria meanings are symbolic and interpretive. This website is for educational, spiritual, and entertainment purposes only. It should not be used as financial, legal, medical, religious, or life decision advice.</p></section>';
  return `${head()}${nav()}<main id="main-content"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-current="page">Gematria Number Meanings</span></li></ol></nav><article class="blog-article"><header class="page-hero"><p class="eyebrow">People-first guide</p><h1>Gematria Number Meanings</h1><p>Learn how gematria numbers are created, why the same number can have different meanings, and how to compare results without forcing a hidden message.</p><p>Last updated: ${updated}</p></header>${section('What Gematria Numbers Mean', '<p>A gematria number is the total you get after assigning values to letters and adding them together. The number does not stand alone. It belongs to a word, name, phrase, spelling, language, and calculation method.</p><p>Because of that, a number meaning should be read as a symbolic lens rather than a fixed definition. A value can suggest themes such as balance, completion, speech, structure, reflection, or change, but those themes only become useful after the original text and method are checked.</p>')}${section('How Gematria Numbers Are Calculated', `<p>The calculation is simple: choose a method, give each supported letter its value, and add the values. The difference between methods is the value table.</p>${table(['Method', 'Value pattern', 'Best use'], methodRows)}<p>Capital letters and lowercase letters count the same. Spaces and punctuation are ignored. Hebrew gematria should be used with Hebrew letters, while English and reverse calculators are designed for Latin letters.</p>`)}${section('How to Interpret a Gematria Result', '<p>Start with the exact result, not with a random number. Write down the input, method, total, digital root, and letter breakdown. Then ask whether the number helps you compare related words or notice a symbolic pattern.</p><p>A careful interpretation asks: Was the spelling consistent? Was the same method used for every comparison? Are the compared words actually related by topic or language? Could a different spelling change the result? These questions keep the reading useful and honest.</p>')}${section('Examples of Words With the Same Value', `<p>Same-value words can be interesting, especially when the words are related in meaning or used inside the same study. They are not automatic proof of a hidden connection.</p>${table(['Words or name', 'Method', 'Value', 'Calculation note'], sameValueRows)}`)}${section('English and Reverse Gematria Examples', '<p>English Gematria multiplies simple alphabet positions by 6. That is why LOVE has a Simple value of 54 and an English Gematria value of 324. Reverse Gematria flips the alphabet, so A becomes 26 and Z becomes 1. This can create different matches, such as TRUTH and WORD both totaling 48 in Reverse Ordinal.</p><p>When comparing examples, keep each table separate. Do not mix an English Gematria value with a Reverse Ordinal value unless the comparison is clearly labeled as a cross-method comparison.</p>')}${section('Why Meanings Can Vary by System', '<p>Gematria has more than one value system. English words, Hebrew words, transliterations, reverse alphabets, and reduction methods do not answer the same question. A word can carry one value in Simple Gematria, another in English Gematria, and a completely different value in Reverse Ordinal.</p><p>This is why number meanings should be flexible. The method gives the number its frame. Without that frame, the meaning can become too vague or too easy to force.</p>')}${section('Related Calculators', `<p>Use the calculator that matches the language and method you want to study. Each tool shows the total and the letter-by-letter breakdown.</p>${calculatorCards()}`)}${section('Publishing Individual Number Pages', '<p>Individual number meaning pages should be published slowly and only when they add real value. A strong page should include original explanation, researched examples, same-value words, method-specific notes, FAQs, and human editing.</p><p>For now, this hub is the safest and cleanest reference page. It gives readers the method, interpretation rules, and examples without creating hundreds of thin pages.</p>')}${faq}${disclaimer}</article></main>${footer()}`;
}

fs.rmSync(path.join(root, 'number-meanings'), { recursive: true, force: true });
const dir = path.join(root, 'gematria-number-meanings');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.html'), page(), 'utf8');

console.log('Number meanings hub created and old number pages removed.');
