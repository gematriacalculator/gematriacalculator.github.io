const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://gematriacalculator.github.io';
const updated = 'June 9, 2026';

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

function head({ title, description, route, name }) {
  const url = `${site}${route}`;
  const fullTitle = `${title} - Gematria Calculator`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    description,
    inLanguage: 'en-US',
    dateModified: '2026-06-09',
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  };
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(fullTitle)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><link rel="icon" type="image/png" href="/assets/images/favicon.png"><link rel="stylesheet" href="/assets/css/styles.css"><meta property="og:title" content="${escapeHtml(fullTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/images/og-image.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(fullTitle)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${site}/assets/images/og-image.png">${jsonLd(schema)}${jsonLd(breadcrumb)}`;
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

function bullets(items) {
  return `<ul class="association-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function renderPage(page) {
  return `${head(page)}${nav()}<main id="main-content"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-current="page">${escapeHtml(page.name)}</span></li></ol></nav><section class="page-hero"><p class="eyebrow">Gematria Calculator</p><h1>${escapeHtml(page.name)}</h1><p>${escapeHtml(page.lede)}</p></section><section class="content-section"><p><strong>Last updated:</strong> ${updated}</p><p>${page.intro}</p></section>${page.sections.join('')}</main>${footer()}`;
}

const privacyPage = {
  file: 'privacy-policy.html',
  route: '/privacy-policy',
  name: 'Privacy Policy',
  title: 'Privacy Policy',
  description: 'Read the Gematria Calculator privacy policy covering calculator input, cookies, Google AdSense, analytics, third-party services, and user choices.',
  lede: 'How Gematria Calculator handles calculator input, cookies, advertising disclosures, analytics, third-party services, and contact information.',
  intro: 'This Privacy Policy explains how Gematria Calculator handles information when you use this website. The website is designed as a public, browser-based educational tool and does not require an account.',
  sections: [
    section('Information We Do Not Intentionally Collect', `<p>Gematria Calculator does not ask you to create an account, does not request passwords, and does not intentionally store calculator input on a private application server. Calculator text is processed in your browser by the page scripts.</p><p>If you use a shareable result URL, the text, method, and value may appear in the address bar as URL parameters. That URL may be visible in your browser history, to anyone you share it with, and potentially to hosting or security logs that process page requests.</p>`),
    section('Information Collected Automatically', `<p>Like most websites, this site and its hosting provider may automatically receive technical information such as IP address, browser type, device type, pages visited, referring URL, date and time, and general performance data. This information is used for security, troubleshooting, analytics, and maintaining the website.</p>`),
    section('Information You Send Voluntarily', `<p>If you contact us through the <a href="/contact">contact page</a> or another contact method, we may receive the information you choose to provide, such as your name, email address, website URL, correction request, or message content. We use that information to respond to your request, improve the website, and keep reasonable records of communications.</p>`),
    section('Cookies and Similar Technologies', `<p>Cookies are small files or identifiers stored by a browser. This website does not require account login cookies. However, third-party services such as hosting, analytics, consent tools, and advertising partners may use cookies, web beacons, IP addresses, or similar identifiers to provide services, measure performance, prevent abuse, and serve or measure ads.</p>`),
    section('Google AdSense and Advertising', `<p>This website may display Google AdSense ads or other third-party ads. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables Google and its partners to serve ads based on visits to this site and other sites on the Internet.</p>${bullets([
      'Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" rel="noopener">Google Ads Settings</a>.',
      'Users can learn more about how Google uses information from sites and apps that use Google services at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">Google partner sites policy</a>.',
      'Users may also visit <a href="https://www.aboutads.info/" rel="noopener">aboutads.info</a> for choices about some third-party personalized advertising cookies.',
      'If other ad vendors or ad networks are used, they may also use cookies or similar technologies according to their own privacy policies.',
    ])}`),
    section('Analytics', `<p>Analytics tools may be used to understand aggregate usage patterns such as popular pages, device types, traffic sources, and performance. Analytics should not be used to intentionally store calculator input. If analytics are added or changed, this page may be updated to describe the relevant service.</p>`),
    section('Third-Party Services', `<p>The website may use third-party services for hosting, advertising, analytics, security, search visibility, or contact handling. These services may process information according to their own policies. Current or future services may include GitHub Pages, Google Search Console, Google AdSense, Google Analytics, or similar website tools.</p>`),
    section('Children\'s Privacy', `<p>This website is intended for a general audience and is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information through the website, please contact us so we can review the request.</p>`),
    section('Your Choices', bullets([
      'You can disable or delete cookies through your browser settings.',
      'You can opt out of personalized Google advertising through Google Ads Settings.',
      'You can avoid putting private information into the calculator or shareable URLs.',
      'You can contact us to ask about privacy concerns or request correction of content you submitted voluntarily.',
    ])),
    section('Data Security', `<p>We use a static website structure where practical and limit the information intentionally requested from users. No website can guarantee perfect security, but we aim to keep the site simple, transparent, and low-risk for ordinary calculator use.</p>`),
    section('Changes to This Policy', `<p>This Privacy Policy may be updated when the website, advertising setup, analytics setup, or legal requirements change. The updated date at the top of this page shows the latest revision.</p>`),
    section('Contact', `<p>For privacy questions, cookie questions, or correction requests, please use the <a href="/contact">contact page</a>.</p>`),
  ],
};

const termsPage = {
  file: 'terms.html',
  route: '/terms',
  name: 'Terms and Conditions',
  title: 'Terms and Conditions',
  description: 'Read the Gematria Calculator terms and conditions covering permitted use, educational purpose, intellectual property, ads, external links, and liability limits.',
  lede: 'Terms for using Gematria Calculator, including lawful use, educational purpose, content limits, advertisements, external links, and user responsibility.',
  intro: 'By accessing or using Gematria Calculator, you agree to these Terms and Conditions. If you do not agree with these terms, please do not use the website.',
  sections: [
    section('Use of the Website', `<p>You may use this website for personal, educational, symbolic, spiritual, research, journaling, and entertainment purposes. You agree not to misuse the website, interfere with its operation, attempt unauthorized access, scrape in a way that harms availability, or use the site for unlawful purposes.</p>`),
    section('Educational and Interpretive Content', `<p>Gematria Calculator provides calculators, letter tables, articles, and number meanings for learning and reflection. The website does not provide professional advice and does not claim that gematria values prove hidden facts, predict outcomes, or determine a person's character or future.</p>`),
    section('Calculator Results', `<p>We aim to make calculator logic clear and accurate, including letter-by-letter breakdowns where available. However, mistakes, browser issues, unsupported characters, transliteration choices, or method differences can affect results. You are responsible for verifying values before relying on them for study notes or comparisons.</p>`),
    section('User Responsibility', `<p>You are responsible for how you interpret and use calculator results, articles, and number meanings. Do not use this website as a substitute for financial, legal, medical, psychological, religious, professional, emergency, or life decision advice.</p>`),
    section('Intellectual Property', `<p>The website design, original text, page layout, calculator explanations, and original articles are owned by or licensed to Gematria Calculator unless otherwise noted. You may link to public pages for ordinary sharing. You may not copy, republish, sell, or present substantial portions of the website as your own without permission.</p>`),
    section('Advertising and Third-Party Services', `<p>The website may display advertisements, including Google AdSense or other third-party ads. Advertisements are provided by third parties and do not mean that Gematria Calculator endorses the advertised products, services, or claims. Third-party services may have their own terms and privacy policies.</p>`),
    section('External Links', `<p>This website may link to external websites for references, tools, privacy choices, or related content. External sites are not controlled by Gematria Calculator. We are not responsible for their content, policies, accuracy, security, or availability.</p>`),
    section('Prohibited Uses', bullets([
      'Do not use the website to harass, defame, threaten, or target another person.',
      'Do not use symbolic readings to make claims about another person as fact.',
      'Do not attempt to break, overload, reverse engineer, or interfere with the website.',
      'Do not use automated traffic, invalid ad clicks, paid-to-click activity, or other activity that violates advertising policies.',
    ])),
    section('No Warranties', `<p>The website is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted availability, error-free content, exact suitability for a particular purpose, or approval by any third-party program, including advertising programs.</p>`),
    section('Limitation of Liability', `<p>To the maximum extent permitted by applicable law, Gematria Calculator is not liable for losses, damages, decisions, missed opportunities, interpretations, or disputes arising from your use of the website, calculator results, articles, ads, or external links.</p>`),
    section('Changes to These Terms', `<p>We may update these Terms and Conditions when the website changes or when operational, legal, or advertising requirements change. Continued use of the website after updates means you accept the revised terms.</p>`),
    section('Contact', `<p>Questions about these Terms and Conditions can be sent through the <a href="/contact">contact page</a>.</p>`),
  ],
};

const disclaimerPage = {
  file: 'disclaimer.html',
  route: '/disclaimer',
  name: 'Disclaimer',
  title: 'Disclaimer',
  description: 'Read the Gematria Calculator disclaimer about symbolic interpretation, calculator accuracy, professional advice limits, ads, external links, and responsible use.',
  lede: 'Important limits about gematria interpretations, number meanings, calculator accuracy, professional advice, advertisements, and external links.',
  intro: 'Gematria Calculator is a public educational website. The calculators, number meanings, and articles are provided for learning, symbolic reflection, spiritual exploration, journaling, and entertainment.',
  sections: [
    section('Symbolic and Interpretive Content', `<p>Gematria values and number meanings are symbolic and interpretive. They should be treated as prompts for reflection, not as fixed facts, guaranteed messages, supernatural proof, or predictions. The same number may be read differently depending on language, spelling, calculator method, tradition, and context.</p>`),
    section('No Professional Advice', `<p>This website does not provide financial, investment, legal, medical, health, psychological, religious, safety, emergency, or professional advice. Do not use gematria values or number meanings to make major decisions. For important matters, seek qualified professional guidance and rely on evidence appropriate to the situation.</p>`),
    section('No Predictions or Guarantees', `<p>The website does not predict destiny, relationships, personality, danger, success, illness, wealth, legal outcomes, spiritual status, or future events. Any interpretation should remain personal, careful, and non-coercive.</p>`),
    section('Calculator Accuracy', `<p>We aim to provide clear calculator methods and accurate letter breakdowns, but no calculator is guaranteed to be error-free. Results can vary because of spelling, transliteration, punctuation, unsupported characters, language choice, final Hebrew forms, or selected method. Always review the breakdown before making comparisons.</p>`),
    section('Religious and Spiritual Content', `<p>Some users study gematria in spiritual, religious, mystical, or cultural contexts. This website is not a religious authority and does not replace qualified teachers, clergy, tradition-specific sources, or personal judgment. Interpretive pages are general educational references.</p>`),
    section('Advertisements and Sponsored Content', `<p>The website may display advertisements, including Google AdSense or other third-party ads. Ads are served by third parties and should not be understood as endorsements by Gematria Calculator. Advertisers are responsible for their own claims, products, services, and landing pages.</p>`),
    section('External Links', `<p>External links may be included for user convenience, privacy choices, source references, or related information. We do not control external websites and are not responsible for their content, policies, or availability.</p>`),
    section('User Responsibility', `<p>You are responsible for how you use and interpret the website. Use gematria as a reflective tool, keep method labels clear, avoid making factual claims about others based on symbolic totals, and do not use the site in a way that harms yourself or another person.</p>`),
    section('Contact', `<p>If you notice an error, unclear statement, or content that should be corrected, please use the <a href="/contact">contact page</a>.</p>`),
  ],
};

for (const page of [privacyPage, termsPage, disclaimerPage]) {
  fs.writeFileSync(path.join(root, page.file), renderPage(page), 'utf8');
}

console.log('Legal pages created.');
