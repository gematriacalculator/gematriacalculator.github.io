(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    var menu = document.getElementById('main-menu');
    if (!button || !menu) return;

    button.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        menu.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        menu.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function setupFilters() {
    var articleFilter = document.querySelector('[data-article-filter]');
    if (articleFilter) {
      var cards = [].slice.call(document.querySelectorAll('.blog-card'));
      articleFilter.addEventListener('input', function () {
        var query = articleFilter.value.trim().toLowerCase();
        cards.forEach(function (card) {
          card.classList.toggle('hidden-by-filter', Boolean(query) && card.textContent.toLowerCase().indexOf(query) === -1);
        });
      });
    }
  }

  function setupContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var status = form.querySelector('[data-form-status]');
    var recipient = form.getAttribute('data-recipient') || 'calculatorefy@gmail.com';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var subject = (form.querySelector('[name="subject"]') || {}).value || '';
      var pageUrl = (form.querySelector('[name="pageUrl"]') || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';

      name = name.trim();
      email = email.trim();
      subject = subject.trim();
      pageUrl = pageUrl.trim();
      message = message.trim();

      if (!name || !email || !subject || !message) {
        if (status) status.textContent = 'Please complete your name, email, subject, and message.';
        return;
      }

      var body = [
        'Name: ' + name,
        'Email: ' + email,
        pageUrl ? 'Page URL: ' + pageUrl : '',
        '',
        message
      ].filter(Boolean).join('\n');

      var mailto = 'mailto:' + encodeURIComponent(recipient)
        + '?subject=' + encodeURIComponent('[Gematria Calculator] ' + subject)
        + '&body=' + encodeURIComponent(body);

      if (status) status.textContent = 'Opening your email app with the message prepared.';
      window.location.href = mailto;
    });
  }

  function setupReveal() {
    var selectors = [
      '.content-section',
      '.info-card',
      '.blog-card',
      '.example-card',
      '.note-card',
      '.table-wrap',
      '.faq-item'
    ];
    var elements = [].slice.call(document.querySelectorAll(selectors.join(',')));
    if (!elements.length) return;

    elements.forEach(function (element) {
      element.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) {
        element.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  ready(function () {
    setupMenu();
    setupFilters();
    setupContactForm();
    setupReveal();
  });
}());
