(function () {
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'es', 'fr', 'de', 'pt', 'hi', 'he'];
  var RTL = { he: true };
  var currentTranslations = { phrases: {}, attributes: {}, ui: {} };

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function pathParts() {
    return window.location.pathname.split('/').filter(Boolean);
  }

  function currentLanguage() {
    var first = pathParts()[0];
    return SUPPORTED.indexOf(first) > -1 && first !== DEFAULT_LANG ? first : DEFAULT_LANG;
  }

  function basePath() {
    var parts = pathParts();
    if (SUPPORTED.indexOf(parts[0]) > -1 && parts[0] !== DEFAULT_LANG) parts.shift();
    var clean = '/' + parts.join('/');
    if (clean === '/') return '/';
    clean = clean.replace(/\/index$/, '/').replace(/\.html$/, '');
    return clean.endsWith('/') ? clean : clean + '/';
  }

  function localizedPath(lang) {
    var base = basePath();
    if (lang === DEFAULT_LANG) return base === '/' ? '/' : base.replace(/\/$/, '');
    return '/' + lang + (base === '/' ? '/' : base);
  }

  function translate(value) {
    if (!value) return value;
    return currentTranslations.phrases[value] || value;
  }

  function translateTextNode(node) {
    var value = node.nodeValue;
    var trimmed = value.trim();
    if (!trimmed) return;
    var translated = translate(trimmed);
    if (translated === trimmed) return;
    node.nodeValue = value.replace(trimmed, translated);
  }

  function translateAttributes(element) {
    ['placeholder', 'aria-label', 'title', 'alt'].forEach(function (name) {
      var value = element.getAttribute(name);
      if (!value) return;
      var translated = currentTranslations.attributes[value] || translate(value);
      if (translated !== value) element.setAttribute(name, translated);
    });
  }

  function walkAndTranslate(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
    [].slice.call(root.querySelectorAll('[placeholder], [aria-label], [title], img[alt]')).forEach(translateAttributes);
  }

  function buildLanguageSwitcher(lang) {
    var nav = document.querySelector('.site-nav');
    var menuButton = document.querySelector('.menu-toggle');
    if (!nav || document.querySelector('[data-language-switcher]')) return;

    var label = document.createElement('label');
    label.className = 'language-switcher';
    label.setAttribute('aria-label', translate('Language'));

    var text = document.createElement('span');
    text.textContent = translate('Language');
    label.appendChild(text);

    var select = document.createElement('select');
    select.setAttribute('data-language-switcher', '');
    select.setAttribute('autocomplete', 'off');

    SUPPORTED.forEach(function (code) {
      var option = document.createElement('option');
      option.value = code;
      option.textContent = (currentTranslations.ui.languages && currentTranslations.ui.languages[code]) || code.toUpperCase();
      if (code === lang) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('change', function () {
      window.location.href = localizedPath(select.value) + window.location.search + window.location.hash;
    });

    label.appendChild(select);
    nav.insertBefore(label, menuButton || null);
  }

  async function loadTranslations(lang) {
    try {
      var response = await fetch('/assets/i18n/' + lang + '.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Missing translation file');
      currentTranslations = await response.json();
    } catch (error) {
      currentTranslations = { phrases: {}, attributes: {}, ui: {} };
      console.warn('Gematria translation fallback:', error.message);
    }
  }

  window.GematriaI18n = {
    currentLanguage: currentLanguage,
    localizedPath: localizedPath,
    t: translate,
    apply: function (root) {
      walkAndTranslate(root || document.body);
    }
  };

  ready(async function () {
    var lang = currentLanguage();
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL[lang] ? 'rtl' : 'ltr';
    await loadTranslations(lang);
    walkAndTranslate(document.body);
    buildLanguageSwitcher(lang);
  });
}());
