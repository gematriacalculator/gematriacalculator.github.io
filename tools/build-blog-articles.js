const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://gematriacalculator.github.io';
const updated = 'June 2026';
const isoDate = '2026-06-09';

const articles = [
  {
    slug: 'what-is-gematria',
    category: 'Beginner Guide',
    title: 'What Is Gematria? Meaning and Methods',
    cardTitle: 'What Is Gematria?',
    description: 'Learn what gematria means, how letter values work, major calculation methods, simple examples, and responsible ways to interpret results.',
    sections: [
      ['What Is Gematria?', [
        'Gematria is a letter-number system where letters are assigned numerical values and then added together to create a total for a word, name, or phrase. The result can be compared with other words or studied as a symbolic number.',
        'The key idea is simple, but the method matters. A value is only meaningful inside the system used to calculate it. For example, a word calculated with Simple Gematria should not be mixed with a Hebrew or reverse method unless the comparison clearly labels each system.'
      ]],
      ['Where Gematria Comes From', [
        'Gematria is most closely associated with Hebrew letter traditions, where letters also carry numerical values. Over time, people also created English and Latin-letter systems so modern readers could study names, phrases, and symbolic patterns in languages written with the Latin alphabet.',
        'Because different languages use different scripts and traditions, gematria should be handled with context. A Hebrew spelling, an English translation, and an English transliteration can all produce different values because they are different inputs.'
      ]],
      ['How Gematria Calculation Works', [
        'A gematria calculation has three parts: the input text, the value table, and the total. First, write the word or phrase exactly as you want to study it. Next, choose the method. Then replace every supported letter with its value and add the numbers.',
        'A good calculator also shows the letter-by-letter breakdown. The breakdown is important because it lets you verify which letters were counted, which symbols were ignored, and whether the selected method matches your notes.'
      ]],
      ['Common Gematria Methods', [
        'Simple Gematria uses A1 through Z26. English Gematria on this website uses A6 through Z156, which means each alphabet position is multiplied by six. Reverse Ordinal flips the alphabet so A equals 26 and Z equals 1. Full Reduction reduces Latin letters to repeating 1 through 9 values.',
        'The Hebrew Gematria Calculator uses Hebrew letters and standard Hebrew values, including common final letter forms. If your source word is Hebrew, it is usually clearer to calculate the Hebrew spelling directly instead of relying only on a transliteration.'
      ]],
      ['Simple Gematria Example', [
        'Using Simple Gematria, LIGHT becomes L(12) + I(9) + G(7) + H(8) + T(20), for a total of 56. In English Gematria, the same word becomes L(72) + I(54) + G(42) + H(48) + T(120), for a total of 336.',
        'Both results are correct inside their own methods. The mistake would be treating 56 and 336 as interchangeable, or comparing one method against another without clearly saying that the rules changed.'
      ]],
      ['How to Use a Gematria Calculator Correctly', [
        'Enter the exact word, name, or phrase, then choose one method before calculating. After the result appears, review the total, digital root, word count, character count, and letter breakdown. If the spelling or method changes, calculate again.',
        'For deeper study, compare related words using the same method. A name and nickname, a phrase and shorter phrase, or two Hebrew spellings can make useful comparison sets when the rules stay consistent.'
      ]],
      ['What Gematria Can and Cannot Tell You', [
        'Gematria can help with symbolic reflection, textual study, journaling, creative naming, and pattern comparison. It can also make language feel more concrete because every letter choice becomes visible in the arithmetic.',
        'Gematria should not be used as proof, prediction, or advice for major decisions. A shared value can be interesting, but it does not automatically prove two words have the same meaning or that an event is guaranteed.'
      ]],
      ['Beginner Study Workflow', [
        'Start with one word or phrase and calculate it in one method. Save the exact input, total, method, and breakdown. Then calculate two or three closely related words with the same method and write a short note about what you notice.',
        'After that, you can compare another method in a separate note. Keeping methods separated makes the study easier to repeat, easier to explain, and easier to correct if a spelling choice changes later.'
      ]]
    ],
    faqs: [
      ['What does gematria mean?', 'Gematria is a symbolic letter-number system that assigns values to letters and adds them to calculate words, names, or phrases.'],
      ['How do you calculate gematria?', 'Choose a method, replace each supported letter with its value, and add the values together to get the total.'],
      ['Which gematria method should beginners use?', 'Simple Gematria is the easiest starting point because it uses A1 through Z26, but English Gematria and Hebrew Gematria are useful for different questions.'],
      ['Does spelling change a gematria value?', 'Yes. Different spellings, transliterations, initials, or word order can change the total.'],
      ['Is gematria a prediction tool?', 'No. Gematria is best used for education, symbolic reflection, spiritual exploration, or entertainment, not as a prediction or decision-making system.']
    ],
    related: [
      ['/english-gematria-calculator', 'English Gematria Calculator'],
      ['/hebrew-gematria-calculator', 'Hebrew Gematria Calculator'],
      ['/blog/gematria-number-meanings', 'Gematria Number Meanings']
    ],
  },
  {
    slug: 'english-gematria-explained',
    category: 'Method Guide',
    title: 'English Gematria Explained: A6-Z156 Values',
    cardTitle: 'English Gematria Explained',
    description: 'Learn how English gematria uses A6 to Z156 values, how to calculate words accurately, and how to compare results without mixing methods.',
    sections: [
      ['What Is English Gematria?', [
        'English gematria is a Latin-letter value system that gives every letter from A to Z a number. On this site, English gematria uses six-step values: A equals 6, B equals 12, C equals 18, and the pattern continues through Z equals 156. It is simple enough for quick calculation, but different enough from A1 to Z26 to reveal another layer of comparison.',
        'The most important thing to know is that English gematria is method-based. The value is not stored inside a word by itself. The value appears when you choose a table, apply that table consistently, and add the letters. That is why the calculator always shows the selected method and the letter breakdown.'
      ]],
      ['English Gematria Value Pattern', [
        'The pattern is easy to remember because it follows the alphabet and multiplies each position by 6. A is the first letter, so A is 6. B is the second letter, so B is 12. C is the third letter, so C is 18. The same rule continues until Z, the twenty-sixth letter, becomes 156.',
        'This makes English gematria useful when you want a broader numerical range than Simple Gematria. A short word can produce a larger total, and longer phrases become easier to distinguish from each other.'
      ]],
      ['How to Calculate English Gematria', [
        'Start by writing the word or phrase exactly as you want to study it. Ignore spaces, punctuation, and unsupported symbols. Then replace each supported letter with its English gematria value and add the numbers. Capital letters and lowercase letters count the same way.',
        'For example, LIGHT becomes L(72) + I(54) + G(42) + H(48) + T(120). The total is 336. The calculator does the arithmetic instantly, but the breakdown is still important because it lets you verify every counted letter.'
      ]],
      ['Common English Gematria Examples', [
        'LIGHT totals 336 in English Gematria, GEMATRIA totals 444, and STRAWBERRIES totals 942. Examples like these are useful because each total can be checked directly against the letter breakdown.',
        'If a match catches your attention, check the spelling, method, and breakdown first. Then compare related words with the same method. Consistent method use is what keeps the comparison honest.'
      ]],
      ['English vs Simple Gematria', [
        'Simple Gematria uses A1 through Z26, while English Gematria multiplies those same positions by 6. The systems are closely related, but the totals are not interchangeable. If LOVE is 54 in Simple Gematria, it is 324 in English Gematria because every letter value has been scaled by 6.',
        'Use Simple Gematria when you want a compact alphabet value. Use English Gematria when you want the A6 to Z156 table. If you compare both, record both methods separately.'
      ]],
      ['Best Practices for Clear Results', [
        'Keep the spelling stable, choose one method at a time, and save the exact input with the total. If you change a plural, remove a hyphen, add initials, or switch from a nickname to a full phrase, recalculate the value.',
        'For deeper study, compare related words in a small group rather than collecting random matches. A focused group gives the number more context and makes your notes easier to understand later.'
      ]]
    ],
    faqs: [
      ['What is English gematria?', 'English gematria is a letter-number method where A equals 6, B equals 12, and values continue by sixes through Z equals 156.'],
      ['Is English gematria the same as Simple Gematria?', 'No. Simple Gematria uses A1 to Z26, while English Gematria multiplies those positions by 6.'],
      ['Does capitalization change the value?', 'No. Uppercase and lowercase letters are counted the same way.'],
      ['Why should I check the letter breakdown?', 'The breakdown shows exactly which letters were counted, making the total easier to verify and compare.']
    ],
    related: [
      ['/english-gematria-calculator', 'English Gematria Calculator'],
      ['/reverse-gematria-calculator', 'Reverse Gematria Calculator'],
      ['/blog/gematria-number-meanings', 'Gematria Number Meanings']
    ],
  },
  {
    slug: 'hebrew-vs-english-gematria',
    category: 'Comparison Guide',
    title: 'Hebrew vs English Gematria Guide',
    cardTitle: 'Hebrew vs English Gematria',
    description: 'Compare Hebrew gematria and English gematria, including scripts, value tables, transliteration issues, examples, and responsible interpretation.',
    sections: [
      ['Why Hebrew and English Gematria Are Different', [
        'Hebrew gematria and English gematria both connect letters with numbers, but they are not the same system. Hebrew gematria is based on Hebrew letters and traditional Hebrew letter values. English gematria is based on the Latin alphabet and a chosen English value table.',
        'Because the alphabets, languages, and traditions are different, a value from one system should not be treated as automatically equivalent to a value from the other. The calculator can help you compare, but the method must stay clear.'
      ]],
      ['Hebrew Gematria Basics', [
        'Standard Hebrew gematria gives values to Hebrew letters such as aleph, bet, gimel, and tav. The sequence starts with small values, moves through tens, and reaches hundreds. Common final forms such as final kaf, final mem, final nun, final pe, and final tsadi are also counted by this calculator.',
        'For the clearest result, enter Hebrew words in Hebrew letters. Transliteration can vary, and a Latin spelling may not represent the exact Hebrew spelling you intend to study.'
      ]],
      ['English Gematria Basics', [
        'English gematria uses the Latin alphabet. On this website, English Gematria specifically means the A6 to Z156 table. Other Latin-letter methods, such as Simple Gematria and Reverse Ordinal, answer different questions.',
        'This is why the method label in the result matters. A phrase calculated with A6 to Z156 is not the same kind of result as a phrase calculated with Hebrew letter values.'
      ]],
      ['The Transliteration Problem', [
        'Many users try to compare a Hebrew word written in English letters with the same word written in Hebrew letters. This can be useful for notes, but it can also create confusion. A transliteration is an approximation, not the original spelling.',
        'For example, the same Hebrew sound may be written several ways in English. Each spelling can produce a different Latin-letter value. If your question is about a Hebrew word, use the Hebrew spelling whenever possible.'
      ]],
      ['How to Compare Both Systems Responsibly', [
        'The safest approach is to calculate each form separately and label each result clearly. Write the Hebrew word, the Hebrew value, the English transliteration, the English method, and the English value. That keeps each layer visible.',
        'After that, compare the results as observations rather than conclusions. A shared number may be worth noting, but it does not prove that two systems are saying the same thing.'
      ]],
      ['When to Use Each Calculator', [
        'Use the Hebrew Gematria Calculator when your input is written in Hebrew letters. Use the English Gematria Calculator when your input is written with the Latin alphabet and you want A6 to Z156 values. Use the Reverse Gematria Calculator when you want A26 to Z1 values.',
        'If you are studying a name, try the Name Gematria Calculator and keep the exact spelling in your notes. Names often have multiple forms, and each form deserves its own calculation.'
      ]]
    ],
    faqs: [
      ['Is Hebrew gematria older than English gematria?', 'Hebrew gematria is connected with older Hebrew letter traditions, while modern English systems adapt letter-number study to the Latin alphabet.'],
      ['Can I calculate Hebrew words in English letters?', 'You can, but it becomes an English transliteration calculation, not a direct Hebrew-letter calculation.'],
      ['Do final Hebrew letters change the total?', 'This calculator counts common final Hebrew forms with their standard values.'],
      ['Can two different systems share the same number?', 'Yes, but a shared value should be treated as an observation, not proof of a hidden connection.']
    ],
    related: [
      ['/hebrew-gematria-calculator', 'Hebrew Gematria Calculator'],
      ['/english-gematria-calculator', 'English Gematria Calculator'],
      ['/blog/english-gematria-explained', 'English Gematria Explained']
    ],
  },
  {
    slug: 'how-to-calculate-name-gematria',
    category: 'Name Guide',
    title: 'Name Gematria: How to Calculate Names',
    cardTitle: 'How to Calculate Name Gematria',
    description: 'Learn how to calculate name gematria clearly, compare first names and full names, choose spelling consistently, and interpret name values responsibly.',
    sections: [
      ['What Is Name Gematria?', [
        'Name gematria applies a letter-number method to a personal name, family name, nickname, pen name, business name, or initials. Each supported letter receives a value, and the calculator adds those values into a total.',
        'Names feel personal, so name gematria should be handled with care. A number can support reflection or creative comparison, but it should not be used as a judgment about someone\'s personality, future, worth, or relationships.'
      ]],
      ['First Name vs Full Name', [
        'A first name usually creates a shorter value and can be useful for quick comparison. A full name includes more letters and often produces a larger total. Neither version is automatically better. They answer different symbolic questions.',
        'If you compare both, write them as separate entries. For example, calculate the first name alone, then calculate the full name exactly as written. Do not merge those results unless your note clearly explains why.'
      ]],
      ['Choosing the Right Spelling', [
        'Spelling is one of the biggest sources of confusion in name gematria. A nickname, middle initial, accent mark, hyphen, married name, or alternate transliteration can change the total. Before you calculate, decide which form you are studying.',
        'For repeatable notes, save the exact input. If you later test another spelling, treat it as a new result rather than a correction of the first one.'
      ]],
      ['Which Method Should You Use?', [
        'Use Simple Gematria if you want the familiar A1 to Z26 scale. Use English Gematria if you want A6 to Z156 values. Use Full Reduction for a compact 1 to 9 style total. Use Hebrew Gematria only when the name is written in Hebrew letters.',
        'The best method is the one that matches your question and stays consistent across the comparison. Switching methods halfway through can make the notes look meaningful while hiding the fact that the rules changed.'
      ]],
      ['Name Gematria Example', [
        'The name ANNA in Simple Gematria is A(1) + N(14) + N(14) + A(1), for a total of 30. DAVID in Simple Gematria is D(4) + A(1) + V(22) + I(9) + D(4), for a total of 40.',
        'These totals are easy to calculate by hand, but the calculator helps prevent arithmetic mistakes and shows the breakdown for quick checking.'
      ]],
      ['Responsible Interpretation', [
        'A name value can be used for journaling, creative naming, symbolic comparison, or spiritual reflection. It should not be used to label a person or predict an outcome.',
        'If a value feels meaningful, slow down and ask what the number helps you notice. Then look at the name itself, the language, the context, and the reason you chose that method.'
      ]]
    ],
    faqs: [
      ['Should I calculate my first name or full name?', 'You can calculate both, but keep them as separate results because they answer different symbolic questions.'],
      ['Do nicknames count?', 'Yes. A nickname can be calculated as its own spelling, but it should not be mixed with a full legal name unless that is your stated comparison.'],
      ['Can name gematria predict personality?', 'No. Name gematria is symbolic and interpretive, not a reliable way to judge personality or destiny.'],
      ['Does changing spelling change the value?', 'Yes. Different spellings can produce different values, so save the exact input with every result.']
    ],
    related: [
      ['/name-gematria-calculator', 'Name Gematria Calculator'],
      ['/blog/english-gematria-explained', 'English Gematria Explained'],
      ['/blog/gematria-number-meanings', 'Gematria Number Meanings']
    ],
  },
  {
    slug: 'gematria-number-meanings',
    category: 'Interpretation Guide',
    title: 'Gematria Number Meanings Guide',
    cardTitle: 'Gematria Number Meanings',
    description: 'Learn how to read gematria number meanings carefully, compare values, use digital roots, and avoid over-interpreting symbolic results.',
    sections: [
      ['What Are Gematria Number Meanings?', [
        'Gematria number meanings are interpretive notes attached to totals produced by a gematria calculation. After a word, name, or phrase is calculated, the number can be studied as a symbolic value or compared with nearby values.',
        'A number meaning is not a fixed rule. It is a guide for reflection. Culture, language, method, spelling, and personal context all affect how a value should be read.'
      ]],
      ['Start With the Calculation', [
        'Before interpreting a number, check the calculation. Confirm the input, method, total, and letter breakdown. If the spelling is wrong or the method changed, the interpretation is built on a shaky result.',
        'Good interpretation starts with clean arithmetic. That is why the calculator shows the method and counted letters instead of only showing the final number.'
      ]],
      ['Use Meanings as Prompts', [
        'A useful number meaning should open a question, not close it. For example, a value associated with beginnings may invite you to think about initiation, focus, or independence. It does not prove that an event will begin or that a decision is correct.',
        'Treat the meaning as a prompt for study, journaling, or comparison. If it does not fit the context, do not force it.'
      ]],
      ['Digital Roots and Larger Values', [
        'The digital root reduces a total to a single digit by adding its digits until one digit remains. For example, 775 becomes 7 + 7 + 5 = 19, and 1 + 9 = 10, then 1 + 0 = 1. The root can offer a compact secondary note.',
        'The original total still matters. Do not replace the full number with the digital root. Use the root as an additional lens when it helps.'
      ]],
      ['Comparing Related Values', [
        'The strongest comparisons usually come from related words calculated with the same method. Compare a name with a nickname, a phrase with a shorter phrase, or a Hebrew spelling with another Hebrew spelling. Keep unrelated matches in a separate note.',
        'If several related values point toward the same theme, that may be worth studying. If one isolated value looks dramatic, verify the breakdown and context before giving it weight.'
      ]],
      ['How to Avoid Over-Interpretation', [
        'Avoid using gematria values as instructions for money, health, law, religion, relationships, or major life decisions. Symbolic tools are not substitutes for evidence, expertise, or personal responsibility.',
        'A balanced reading includes both curiosity and restraint. Notice the pattern, write it down, compare it carefully, and leave room for uncertainty.'
      ]]
    ],
    faqs: [
      ['Are gematria number meanings fixed?', 'No. They are interpretive and may vary by tradition, method, language, and context.'],
      ['What is a digital root?', 'A digital root is a single-digit reduction made by adding the digits of a number until one digit remains.'],
      ['Should I use number meanings before checking the breakdown?', 'No. Check the input, method, and letter breakdown first so the interpretation rests on a correct result.'],
      ['Can number meanings predict outcomes?', 'No. They are symbolic prompts for reflection, not predictions or advice.']
    ],
    related: [
      ['/gematria-number-meanings/', 'Gematria Number Meanings Guide'],
      ['/blog/how-to-calculate-name-gematria', 'How to Calculate Name Gematria'],
      ['/english-gematria-calculator', 'English Gematria Calculator']
    ],
  },
];

function articleUrl(slug) {
  return `${site}/blog/${slug}`;
}

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

function header(activeTitle, description, slug) {
  const url = articleUrl(slug);
  const title = `${activeTitle} - Gematria Calculator`;
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><link rel="icon" type="image/png" href="/assets/images/favicon.png"><link rel="stylesheet" href="/assets/css/styles.css"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/images/og-image.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${site}/assets/images/og-image.png">`;
}

function nav() {
  return `</head><body><a class="skip-link" href="#main-content">Skip to main content</a><header class="site-header"><nav class="site-nav" aria-label="Main navigation"><a class="site-logo" href="/" aria-label="Gematria Calculator home"><img src="/assets/images/logo.svg" alt="" width="36" height="36"><span>Gematria Calculator</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="menu-icon" aria-hidden="true"></span><span>Menu</span></button><ul class="nav-menu" id="main-menu"><li><a href="/">Home</a></li><li><a href="/english-gematria-calculator">English</a></li><li><a href="/reverse-gematria-calculator">Reverse</a></li><li><a href="/name-gematria-calculator">Name</a></li><li><a href="/hebrew-gematria-calculator">Hebrew</a></li><li><a href="/gematria-number-meanings/">Number Meanings</a></li><li><a href="/blog/">Blog</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><section class="footer-brand" aria-label="About this website"><a class="footer-logo" href="/"><img src="/assets/images/logo.svg" alt="" width="32" height="32"><span>Gematria Calculator</span></a><p>Gematria Calculator is a free online tool for calculating English, reverse, name, and Hebrew gematria values. Use it for educational, symbolic, spiritual, and entertainment purposes.</p></section><nav aria-label="Footer navigation"><ul class="footer-links"><li><a href="/">Home</a></li><li><a href="/english-gematria-calculator">English Gematria Calculator</a></li><li><a href="/reverse-gematria-calculator">Reverse Gematria Calculator</a></li><li><a href="/name-gematria-calculator">Name Gematria Calculator</a></li><li><a href="/hebrew-gematria-calculator">Hebrew Gematria Calculator</a></li><li><a href="/gematria-number-meanings/">Number Meanings</a></li><li><a href="/blog/">Blog</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms">Terms</a></li><li><a href="/disclaimer">Disclaimer</a></li></ul></nav><p class="copyright">Copyright &copy; 2026 Gematria Calculator. All rights reserved.</p></div></footer><script src="/assets/js/i18n.js" defer></script><script src="/assets/js/main.js" defer></script><script src="/assets/js/calculators.js" defer></script></body></html>`;
}

function articlePage(article) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: isoDate,
    dateModified: isoDate,
    author: { '@type': 'Organization', name: 'Gematria Calculator' },
    publisher: { '@type': 'Organization', name: 'Gematria Calculator' },
    mainEntityOfPage: articleUrl(article.slug),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}/blog/` },
      { '@type': 'ListItem', position: 3, name: article.cardTitle, item: articleUrl(article.slug) },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  const sections = article.sections.map(([heading, paragraphs]) => {
    return `<section class="content-section"><h2>${escapeHtml(heading)}</h2>${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}</section>`;
  }).join('');
  const faq = `<section class="content-section faq-section" id="faq"><div class="section-heading"><h2>FAQ</h2></div><div class="faq-list">${article.faqs.map(([question, answer]) => `<details class="faq-item"><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div></section>`;
  const related = `<section class="content-section"><div class="section-heading"><h2>Related Guides and Tools</h2><p>Continue with the calculator or guide that matches your next question.</p></div><div class="card-grid">${article.related.map(([href, label]) => `<article class="info-card"><h3><a href="${href}">${escapeHtml(label)}</a></h3><p>Open this related resource to keep the method, context, and interpretation clear.</p></article>`).join('')}</div></section>`;
  const disclaimer = '<section class="content-section disclaimer-box"><h2>Disclaimer</h2><p>Gematria meanings are symbolic and interpretive. This website is for educational, spiritual, and entertainment purposes only. It should not be used as financial, legal, medical, religious, or life decision advice.</p></section>';
  return `${header(article.title, article.description, article.slug)}${jsonLd(articleSchema)}${jsonLd(faqSchema)}${jsonLd(breadcrumbSchema)}${nav()}<main id="main-content"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/blog/">Blog</a></li><li><span aria-current="page">${escapeHtml(article.cardTitle)}</span></li></ol></nav><article class="blog-article"><header class="page-hero"><p class="eyebrow">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p>Last updated: ${updated}</p></header>${sections}${related}${faq}${disclaimer}</article></main>${footer()}`;
}

function latestCards(className = 'blog-card') {
  return articles.map((article) => {
    const href = `/blog/${article.slug}`;
    if (className === 'info-card') {
      return `<article class="info-card"><h3><a href="${href}">${escapeHtml(article.cardTitle)}</a></h3><p>${escapeHtml(article.description)}</p></article>`;
    }
    return `<article class="blog-card"><p class="category-label">${escapeHtml(article.category)}</p><h3><a href="${href}">${escapeHtml(article.cardTitle)}</a></h3><p>${escapeHtml(article.description)}</p><p class="updated">Last updated: ${updated}</p></article>`;
  }).join('');
}

function updateSection(file, pattern, replacement) {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, 'utf8');
  if (!pattern.test(before)) throw new Error(`Section replacement failed in ${file}`);
  const after = before.replace(pattern, replacement);
  if (before !== after) fs.writeFileSync(full, after, 'utf8');
}

function moveBlogSearchBeforeLatest() {
  const full = path.join(root, 'blog', 'index.html');
  const before = fs.readFileSync(full, 'utf8');
  const latest = before.match(/<section class="content-section"><h2>Latest Articles<\/h2><div class="blog-grid">[\s\S]*?<\/div><\/section>/)?.[0];
  const search = before.match(/<section class="content-section"><h2>Search Articles<\/h2><div class="field-group compact-field">[\s\S]*?data-article-filter><\/div><\/section>/)?.[0];
  if (!latest || !search) throw new Error('Blog article or search section was not found.');

  const latestIndex = before.indexOf(latest);
  const searchIndex = before.indexOf(search);
  if (searchIndex < latestIndex) return;

  const withoutSearch = before.slice(0, searchIndex) + before.slice(searchIndex + search.length);
  const nextLatestIndex = withoutSearch.indexOf(latest);
  const after = withoutSearch.slice(0, nextLatestIndex) + search + withoutSearch.slice(nextLatestIndex);
  fs.writeFileSync(full, after, 'utf8');
}

for (const article of articles.filter((item) => item.sections)) {
  fs.writeFileSync(path.join(root, 'blog', `${article.slug}.html`), articlePage(article), 'utf8');
}

updateSection(
  'blog/index.html',
  /<section class="content-section"><h2>Latest Articles<\/h2><div class="blog-grid">[\s\S]*?<\/div><\/section>/,
  `<section class="content-section"><h2>Latest Articles</h2><div class="blog-grid">${latestCards('blog-card')}</div></section>`,
);

moveBlogSearchBeforeLatest();

updateSection(
  'index.html',
  /<section class="content-section"><div class="section-heading"><h2>Latest Gematria Articles<\/h2>[\s\S]*?<\/div><\/section>/,
  `<section class="content-section"><div class="section-heading"><h2>Latest Gematria Articles</h2><p>Fresh educational guides for learning gematria methods, examples, and number interpretation.</p></div><div class="card-grid">${latestCards('info-card')}</div></section>`,
);

console.log('Blog articles created and article listings updated.');
