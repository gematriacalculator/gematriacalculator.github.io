(function () {
  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var METHOD_LABELS = {
    'simple-gematria': 'Simple Gematria',
    'english-gematria': 'English Gematria',
    'jewish-gematria': 'Jewish Gematria',
    'english-ordinal': 'Simple Gematria',
    'reverse-ordinal': 'Reverse Ordinal',
    'full-reduction': 'Full Reduction',
    'reverse-full-reduction': 'Reverse Full Reduction',
    'hebrew-gematria': 'Hebrew Gematria'
  };
  var JEWISH_VALUES = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 600,
    K: 10,
    L: 20,
    M: 30,
    N: 40,
    O: 50,
    P: 60,
    Q: 70,
    R: 80,
    S: 90,
    T: 100,
    U: 200,
    V: 700,
    W: 900,
    X: 300,
    Y: 400,
    Z: 500
  };
  var HEBREW_VALUES = {
    '\u05d0': 1,
    '\u05d1': 2,
    '\u05d2': 3,
    '\u05d3': 4,
    '\u05d4': 5,
    '\u05d5': 6,
    '\u05d6': 7,
    '\u05d7': 8,
    '\u05d8': 9,
    '\u05d9': 10,
    '\u05db': 20,
    '\u05da': 20,
    '\u05dc': 30,
    '\u05de': 40,
    '\u05dd': 40,
    '\u05e0': 50,
    '\u05df': 50,
    '\u05e1': 60,
    '\u05e2': 70,
    '\u05e4': 80,
    '\u05e3': 80,
    '\u05e6': 90,
    '\u05e5': 90,
    '\u05e7': 100,
    '\u05e8': 200,
    '\u05e9': 300,
    '\u05ea': 400
  };
  var lastResult;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function t(value) {
    if (window.GematriaI18n && typeof window.GematriaI18n.t === 'function') {
      return window.GematriaI18n.t(value);
    }
    return value;
  }

  function ordinalValue(letter) {
    var index = ALPHABET.indexOf(letter.toUpperCase());
    return index === -1 ? 0 : index + 1;
  }

  function getLetterBreakdown(input, method) {
    var activeMethod = method || 'english-gematria';
    var breakdown = [];

    Array.from(input || '').forEach(function (char) {
      var value = 0;
      var display = char;

      if (activeMethod === 'hebrew-gematria') {
        value = HEBREW_VALUES[char] || 0;
      } else {
        var upper = char.toUpperCase();
        var ordinal = ordinalValue(upper);
        if (!ordinal) return;

        display = upper;
        if (activeMethod === 'english-gematria') value = ordinal * 6;
        else if (activeMethod === 'jewish-gematria') value = JEWISH_VALUES[upper] || 0;
        else if (activeMethod === 'reverse-ordinal') value = 27 - ordinal;
        else if (activeMethod === 'full-reduction') value = ((ordinal - 1) % 9) + 1;
        else if (activeMethod === 'reverse-full-reduction') value = ((27 - ordinal - 1) % 9) + 1;
        else value = ordinal;
      }

      if (value) breakdown.push({ letter: display, value: value });
    });

    return breakdown;
  }

  function sum(input, method) {
    return getLetterBreakdown(input, method).reduce(function (total, item) {
      return total + item.value;
    }, 0);
  }

  function calculateSimpleGematria(input) {
    return sum(input, 'simple-gematria');
  }

  function calculateEnglishGematria(input) {
    return sum(input, 'english-gematria');
  }

  function calculateJewishGematria(input) {
    return sum(input, 'jewish-gematria');
  }

  function calculateEnglishOrdinal(input) {
    return calculateSimpleGematria(input);
  }

  function calculateReverseOrdinal(input) {
    return sum(input, 'reverse-ordinal');
  }

  function calculateFullReduction(input) {
    return sum(input, 'full-reduction');
  }

  function calculateReverseFullReduction(input) {
    return sum(input, 'reverse-full-reduction');
  }

  function calculateHebrewGematria(input) {
    return sum(input, 'hebrew-gematria');
  }

  function digitalRoot(total) {
    var value = Math.abs(Number(total) || 0);
    while (value > 9) {
      value = String(value).split('').reduce(function (next, digit) {
        return next + Number(digit);
      }, 0);
    }
    return value;
  }

  function calculate(input, method) {
    var activeMethod = method || 'english-gematria';
    var breakdown = getLetterBreakdown(input, activeMethod);
    var trimmed = (input || '').trim();
    var total = breakdown.reduce(function (currentTotal, item) {
      return currentTotal + item.value;
    }, 0);

    return {
      input: input || '',
      method: activeMethod,
      methodLabel: METHOD_LABELS[activeMethod] || METHOD_LABELS['english-gematria'],
      total: total,
      digitalRoot: digitalRoot(total),
      breakdown: breakdown,
      wordCount: trimmed ? trimmed.split(/\s+/).length : 0,
      characterCount: Array.from(input || '').length
    };
  }

  function renderResult(result, target) {
    lastResult = result;
    if (!target) target = document.querySelector('[data-calculator-result]');
    if (!target) return '';

    if (!result.input.trim()) {
      return resetResult(target);
    }

    target.hidden = false;
    var breakdown = result.breakdown.length
      ? '<ul class="breakdown-list">' + result.breakdown.map(function (item) {
        return '<li><span>' + escapeHtml(item.letter) + '</span> = ' + item.value + '</li>';
      }).join('') + '</ul>'
      : '<p>' + escapeHtml(t('No supported letters were found for this method.')) + '</p>';

    target.innerHTML = '<div class="result-summary">' +
      '<div><span>' + escapeHtml(t('Total Value')) + '</span><strong>' + result.total + '</strong></div>' +
      '<div><span>' + escapeHtml(t('Method')) + '</span><strong>' + escapeHtml(t(result.methodLabel)) + '</strong></div>' +
      '<div><span>' + escapeHtml(t('Digital Root')) + '</span><strong>' + result.digitalRoot + '</strong></div>' +
      '<div><span>' + escapeHtml(t('Words')) + '</span><strong>' + result.wordCount + '</strong></div>' +
      '<div><span>' + escapeHtml(t('Characters')) + '</span><strong>' + result.characterCount + '</strong></div>' +
      '</div><p><strong>' + escapeHtml(t('Input:')) + '</strong> ' + escapeHtml(result.input) + '</p><h3>' + escapeHtml(t('Letter Breakdown')) + '</h3>' + breakdown;
    return target.innerHTML;
  }

  function resetResult(target, message, keepVisible) {
    lastResult = null;
    if (!target) target = document.querySelector('[data-calculator-result]');
    if (!target) return '';
    target.innerHTML = '<p class="result-empty">' + escapeHtml(t(message || 'Enter text, then click Calculate to see the result.')) + '</p>';
    target.hidden = !keepVisible;
    return target.innerHTML;
  }

  function cleanResultUrl() {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    ['text', 'q', 'method', 'value'].forEach(function (key) {
      url.searchParams.delete(key);
    });
    if (url.hash === '#calculator') url.hash = '';
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function clearCalculator(root) {
    root = root || document.querySelector('[data-calculator]');
    if (!root) return;

    var input = root.querySelector('[data-calculator-input]');
    var method = root.querySelector('[data-calculator-method]');
    var result = root.querySelector('[data-calculator-result]');
    if (input) input.value = '';
    resetResult(result);
    cleanResultUrl();
    if (input) input.focus();
  }

  function resultText(result) {
    if (!result) return '';
    return [
      t('Input:') + ' ' + result.input,
      t('Method') + ': ' + t(result.methodLabel),
      t('Total Value') + ': ' + result.total,
      t('Digital Root') + ': ' + result.digitalRoot,
      t('Words') + ': ' + result.wordCount,
      t('Characters') + ': ' + result.characterCount,
      t('Breakdown:'),
      result.breakdown.map(function (item) {
        return item.letter + ' = ' + item.value;
      }).join(', ')
    ].join('\n');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    return Promise.resolve();
  }

  function showToast(message) {
    var toast = document.querySelector('[data-toast]');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('data-toast', '');
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  function copyResult(target) {
    if (!lastResult) {
      resetResult(target, 'Enter text before copying the result.', true);
      return Promise.resolve();
    }
    return copyText(resultText(lastResult)).then(function () {
      showToast(t('Result copied to clipboard'));
    });
  }

  function shareResult(target) {
    if (!lastResult) {
      resetResult(target, 'Enter text before sharing the result.', true);
      return Promise.resolve();
    }
    var text = resultText(lastResult);
    if (navigator.share) {
      return navigator.share({ title: 'Gematria Calculator Result', text: text, url: buildResultUrl(lastResult) }).then(function () {
        showToast(t('Result ready to share'));
      });
    }
    return copyText(text).then(function () {
      showToast(t('Result copied to clipboard'));
    });
  }

  function getUrlResult(root) {
    var params = new URLSearchParams(window.location.search);
    var text = params.get('text') || params.get('q') || '';
    if (!text) return null;

    var method = params.get('method') || root.getAttribute('data-default-method') || 'english-gematria';
    if (!METHOD_LABELS[method]) method = root.getAttribute('data-default-method') || 'english-gematria';
    return calculate(text, method);
  }

  function buildResultUrl(result) {
    var url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('text', result.input);
    url.searchParams.set('method', result.method);
    url.searchParams.set('value', String(result.total));
    url.hash = 'calculator';
    return url.toString();
  }

  function calculateAndNavigate(root) {
    var input = root.querySelector('[data-calculator-input]');
    var method = root.querySelector('[data-calculator-method]');
    var result = root.querySelector('[data-calculator-result]');
    var calculated = calculate(input.value, method.value);

    if (!calculated.input.trim()) {
      resetResult(result, 'Enter text, then click Calculate to see the result.', true);
      return;
    }

    renderResult(calculated, result);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', buildResultUrl(calculated));
    }
  }

  function markResultStale(root) {
    var result = root.querySelector('[data-calculator-result]');
    resetResult(result);
    cleanResultUrl();
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    document.querySelectorAll('[data-calculator]').forEach(function (root) {
      var input = root.querySelector('[data-calculator-input]');
      var method = root.querySelector('[data-calculator-method]');
      var defaultMethod = root.getAttribute('data-default-method') || 'english-gematria';
      if (defaultMethod && method) method.value = defaultMethod;

      var urlResult = getUrlResult(root);
      if (urlResult) {
        input.value = urlResult.input;
        method.value = urlResult.method;
        renderResult(urlResult, root.querySelector('[data-calculator-result]'));
      } else {
        resetResult(root.querySelector('[data-calculator-result]'));
      }

      input.addEventListener('input', function () { markResultStale(root); });
      method.addEventListener('change', function () { markResultStale(root); });
      root.querySelector('[data-calculate]').addEventListener('click', function () { calculateAndNavigate(root); });
      root.querySelector('[data-clear]').addEventListener('click', function () { clearCalculator(root); });
      root.querySelector('[data-copy]').addEventListener('click', function () { copyResult(root.querySelector('[data-calculator-result]')); });
      root.querySelector('[data-share]').addEventListener('click', function () { shareResult(root.querySelector('[data-calculator-result]')); });
    });

    document.querySelectorAll('[data-example]').forEach(function (button) {
      button.addEventListener('click', function () {
        var calculator = document.querySelector('[data-calculator]');
        if (!calculator) return;
        var input = calculator.querySelector('[data-calculator-input]');
        var method = calculator.querySelector('[data-calculator-method]');
        input.value = button.getAttribute('data-example') || '';
        if (button.getAttribute('data-method')) method.value = button.getAttribute('data-method');
        markResultStale(calculator);
        calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
        input.focus();
      });
    });
  });

  window.calculateSimpleGematria = calculateSimpleGematria;
  window.calculateEnglishGematria = calculateEnglishGematria;
  window.calculateJewishGematria = calculateJewishGematria;
  window.calculateEnglishOrdinal = calculateEnglishOrdinal;
  window.calculateReverseOrdinal = calculateReverseOrdinal;
  window.calculateFullReduction = calculateFullReduction;
  window.calculateReverseFullReduction = calculateReverseFullReduction;
  window.calculateHebrewGematria = calculateHebrewGematria;
  window.getLetterBreakdown = getLetterBreakdown;
  window.renderResult = renderResult;
  window.clearCalculator = clearCalculator;
  window.copyResult = copyResult;
  window.shareResult = shareResult;
  window.GematriaCalculator = {
    calculate: calculate,
    calculateSimpleGematria: calculateSimpleGematria,
    calculateEnglishGematria: calculateEnglishGematria,
    calculateJewishGematria: calculateJewishGematria,
    calculateEnglishOrdinal: calculateEnglishOrdinal,
    calculateReverseOrdinal: calculateReverseOrdinal,
    calculateFullReduction: calculateFullReduction,
    calculateReverseFullReduction: calculateReverseFullReduction,
    calculateHebrewGematria: calculateHebrewGematria,
    getLetterBreakdown: getLetterBreakdown
  };
}());
