const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://gematriacalculator.github.io';
const languages = ['en', 'es', 'fr', 'de', 'pt', 'hi', 'he'];
const localizedLanguages = languages.filter((lang) => lang !== 'en');
const contentTranslations = loadContentTranslations();
const plainInfoRoutes = new Set(['/about', '/contact', '/privacy-policy', '/terms', '/disclaimer']);

const languageNames = {
  en: 'English',
  es: 'Espa\u00f1ol',
  fr: 'Fran\u00e7ais',
  de: 'Deutsch',
  pt: 'Portugu\u00eas',
  hi: '\u0939\u093f\u0928\u094d\u0926\u0940',
  he: '\u05e2\u05d1\u05e8\u05d9\u05ea',
};

const translations = {
  en: {
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    titleSuffix: 'Gematria Calculator',
    meta: {
      homeTitle: 'Gematria Calculator - Free Online Word, Name & Hebrew Gematria Tool',
      homeDescription: 'Use this free Gematria Calculator to calculate English, reverse, name, and Hebrew gematria values. Enter any word, phrase, or name and instantly find its number value.',
      genericDescription: 'Use this free multilingual Gematria Calculator to calculate word, name, phrase, and Hebrew values with a clear letter-by-letter breakdown.',
    },
    phrases: {},
  },
  es: {
    name: 'Spanish',
    nativeName: 'Espa\u00f1ol',
    dir: 'ltr',
    titleSuffix: 'Calculadora de Gematr\u00eda',
    meta: {
      homeTitle: 'Calculadora de Gematr\u00eda Gratis',
      homeDescription: 'Usa esta calculadora de gematr\u00eda gratis para calcular valores de gematr\u00eda inglesa, inversa, de nombres y hebrea con desglose por letras.',
      genericDescription: 'Usa esta calculadora de gematr\u00eda multiling\u00fce para calcular valores de palabras, nombres, frases y hebreo con un desglose claro por letras.',
    },
    phrases: {
      'Language': 'Idioma',
      'Home': 'Inicio',
      'English': 'Ingl\u00e9s',
      'Reverse': 'Inversa',
      'Name': 'Nombre',
      'Hebrew': 'Hebreo',
      'Number Meanings': 'Significados de n\u00fameros',
      'Blog': 'Blog',
      'About': 'Acerca de',
      'Contact': 'Contacto',
      'Gematria Calculator': 'Calculadora de Gematr\u00eda',
      'Free online calculator': 'Calculadora gratis en l\u00ednea',
      'Gematria tool': 'Herramienta de gematr\u00eda',
      'Text to calculate': 'Texto para calcular',
      'Type a word, name, or phrase': 'Escribe una palabra, nombre o frase',
      'Gematria method': 'M\u00e9todo de gematr\u00eda',
      'Calculate': 'Calcular',
      'Clear': 'Borrar',
      'Copy Result': 'Copiar resultado',
      'Share Result': 'Compartir resultado',
      'English Gematria': 'Gematr\u00eda inglesa',
      'Simple Gematria': 'Gematr\u00eda simple',
      'Jewish Gematria': 'Gematr\u00eda jud\u00eda',
      'Reverse Ordinal': 'Ordinal inverso',
      'Full Reduction': 'Reducci\u00f3n completa',
      'Reverse Full Reduction': 'Reducci\u00f3n completa inversa',
      'Hebrew Gematria': 'Gematr\u00eda hebrea',
      'Enter text, then click Calculate to see the result.': 'Escribe texto y haz clic en Calcular para ver el resultado.',
      'Enter text before copying the result.': 'Escribe texto antes de copiar el resultado.',
      'Enter text before sharing the result.': 'Escribe texto antes de compartir el resultado.',
      'No supported letters were found for this method.': 'No se encontraron letras compatibles para este m\u00e9todo.',
      'Total Value': 'Valor total',
      'Method': 'M\u00e9todo',
      'Digital Root': 'Ra\u00edz digital',
      'Words': 'Palabras',
      'Characters': 'Caracteres',
      'Input:': 'Entrada:',
      'Letter Breakdown': 'Desglose de letras',
      'Breakdown:': 'Desglose:',
      'Result copied to clipboard': 'Resultado copiado al portapapeles',
      'Result ready to share': 'Resultado listo para compartir',
      'Quick Examples': 'Ejemplos r\u00e1pidos',
      'Try Example': 'Probar ejemplo',
      'What Is Gematria?': '\u00bfQu\u00e9 es la gematr\u00eda?',
      'How to Use the Gematria Calculator': 'C\u00f3mo usar la calculadora de gematr\u00eda',
      'Click Calculate to view the result.': 'Haz clic en Calcular para ver el resultado.',
      'View the total value.': 'Consulta el valor total.',
      'Review the letter-by-letter breakdown.': 'Revisa el desglose letra por letra.',
      'Copy or share the result if needed.': 'Copia o comparte el resultado si lo necesitas.',
      'English Gematria Calculator': 'Calculadora de gematr\u00eda inglesa',
      'Reverse Gematria Calculator': 'Calculadora de gematr\u00eda inversa',
      'Name Gematria Calculator': 'Calculadora de gematr\u00eda de nombres',
      'Hebrew Gematria Calculator': 'Calculadora de gematr\u00eda hebrea',
      'Calculate Gematria Values': 'Calcular valores de gematr\u00eda',
      'Related Calculators': 'Calculadoras relacionadas',
      'Privacy Policy': 'Pol\u00edtica de privacidad',
      'Terms': 'T\u00e9rminos',
      'Disclaimer': 'Aviso legal',
      'Page Not Found': 'P\u00e1gina no encontrada',
    },
  },
  fr: {
    name: 'French',
    nativeName: 'Fran\u00e7ais',
    dir: 'ltr',
    titleSuffix: 'Calculateur de G\u00e9matrie',
    meta: {
      homeTitle: 'Calculateur de G\u00e9matrie Gratuit',
      homeDescription: 'Utilisez ce calculateur de g\u00e9matrie gratuit pour calculer les valeurs anglaises, invers\u00e9es, de noms et h\u00e9bra\u00efques avec un d\u00e9tail par lettre.',
      genericDescription: 'Utilisez ce calculateur de g\u00e9matrie multilingue pour calculer les valeurs de mots, noms, phrases et h\u00e9breu avec un d\u00e9tail clair par lettre.',
    },
    phrases: {
      'Language': 'Langue',
      'Home': 'Accueil',
      'English': 'Anglais',
      'Reverse': 'Invers\u00e9',
      'Name': 'Nom',
      'Hebrew': 'H\u00e9breu',
      'Number Meanings': 'Significations des nombres',
      'Blog': 'Blog',
      'About': '\u00c0 propos',
      'Contact': 'Contact',
      'Gematria Calculator': 'Calculateur de G\u00e9matrie',
      'Free online calculator': 'Calculateur gratuit en ligne',
      'Gematria tool': 'Outil de g\u00e9matrie',
      'Text to calculate': 'Texte \u00e0 calculer',
      'Type a word, name, or phrase': 'Saisissez un mot, un nom ou une phrase',
      'Gematria method': 'M\u00e9thode de g\u00e9matrie',
      'Calculate': 'Calculer',
      'Clear': 'Effacer',
      'Copy Result': 'Copier le r\u00e9sultat',
      'Share Result': 'Partager le r\u00e9sultat',
      'English Gematria': 'G\u00e9matrie anglaise',
      'Simple Gematria': 'G\u00e9matrie simple',
      'Jewish Gematria': 'G\u00e9matrie juive',
      'Reverse Ordinal': 'Ordinal invers\u00e9',
      'Full Reduction': 'R\u00e9duction compl\u00e8te',
      'Reverse Full Reduction': 'R\u00e9duction compl\u00e8te invers\u00e9e',
      'Hebrew Gematria': 'G\u00e9matrie h\u00e9bra\u00efque',
      'Enter text, then click Calculate to see the result.': 'Saisissez du texte puis cliquez sur Calculer pour voir le r\u00e9sultat.',
      'Enter text before copying the result.': 'Saisissez du texte avant de copier le r\u00e9sultat.',
      'Enter text before sharing the result.': 'Saisissez du texte avant de partager le r\u00e9sultat.',
      'No supported letters were found for this method.': 'Aucune lettre compatible n\u2019a \u00e9t\u00e9 trouv\u00e9e pour cette m\u00e9thode.',
      'Total Value': 'Valeur totale',
      'Method': 'M\u00e9thode',
      'Digital Root': 'Racine num\u00e9rique',
      'Words': 'Mots',
      'Characters': 'Caract\u00e8res',
      'Input:': 'Entr\u00e9e :',
      'Letter Breakdown': 'D\u00e9tail des lettres',
      'Breakdown:': 'D\u00e9tail :',
      'Result copied to clipboard': 'R\u00e9sultat copi\u00e9 dans le presse-papiers',
      'Result ready to share': 'R\u00e9sultat pr\u00eat \u00e0 partager',
      'Quick Examples': 'Exemples rapides',
      'Try Example': 'Essayer l\u2019exemple',
      'What Is Gematria?': 'Qu\u2019est-ce que la g\u00e9matrie ?',
      'How to Use the Gematria Calculator': 'Comment utiliser le calculateur de g\u00e9matrie',
      'Click Calculate to view the result.': 'Cliquez sur Calculer pour voir le r\u00e9sultat.',
      'View the total value.': 'Consultez la valeur totale.',
      'Review the letter-by-letter breakdown.': 'Consultez le d\u00e9tail lettre par lettre.',
      'Copy or share the result if needed.': 'Copiez ou partagez le r\u00e9sultat si n\u00e9cessaire.',
      'English Gematria Calculator': 'Calculateur de g\u00e9matrie anglaise',
      'Reverse Gematria Calculator': 'Calculateur de g\u00e9matrie invers\u00e9e',
      'Name Gematria Calculator': 'Calculateur de g\u00e9matrie des noms',
      'Hebrew Gematria Calculator': 'Calculateur de g\u00e9matrie h\u00e9bra\u00efque',
      'Calculate Gematria Values': 'Calculer des valeurs de g\u00e9matrie',
      'Related Calculators': 'Calculateurs associ\u00e9s',
      'Privacy Policy': 'Politique de confidentialit\u00e9',
      'Terms': 'Conditions',
      'Disclaimer': 'Avertissement',
      'Page Not Found': 'Page introuvable',
    },
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    titleSuffix: 'Gematria-Rechner',
    meta: {
      homeTitle: 'Gematria-Rechner Kostenlos',
      homeDescription: 'Nutzen Sie diesen kostenlosen Gematria-Rechner f\u00fcr englische, umgekehrte, Namens- und hebr\u00e4ische Werte mit klarer Buchstabenaufschl\u00fcsselung.',
      genericDescription: 'Nutzen Sie diesen mehrsprachigen Gematria-Rechner, um Wort-, Namens-, Satz- und hebr\u00e4ische Werte mit klarer Buchstabenaufschl\u00fcsselung zu berechnen.',
    },
    phrases: {
      'Language': 'Sprache',
      'Home': 'Startseite',
      'English': 'Englisch',
      'Reverse': 'Umgekehrt',
      'Name': 'Name',
      'Hebrew': 'Hebr\u00e4isch',
      'Number Meanings': 'Zahlenbedeutungen',
      'Blog': 'Blog',
      'About': '\u00dcber',
      'Contact': 'Kontakt',
      'Gematria Calculator': 'Gematria-Rechner',
      'Free online calculator': 'Kostenloser Online-Rechner',
      'Gematria tool': 'Gematria-Tool',
      'Text to calculate': 'Text zum Berechnen',
      'Type a word, name, or phrase': 'Wort, Namen oder Satz eingeben',
      'Gematria method': 'Gematria-Methode',
      'Calculate': 'Berechnen',
      'Clear': 'L\u00f6schen',
      'Copy Result': 'Ergebnis kopieren',
      'Share Result': 'Ergebnis teilen',
      'English Gematria': 'Englische Gematria',
      'Simple Gematria': 'Einfache Gematria',
      'Jewish Gematria': 'J\u00fcdische Gematria',
      'Reverse Ordinal': 'Umgekehrte Ordinalwerte',
      'Full Reduction': 'Vollst\u00e4ndige Reduktion',
      'Reverse Full Reduction': 'Umgekehrte vollst\u00e4ndige Reduktion',
      'Hebrew Gematria': 'Hebr\u00e4ische Gematria',
      'Enter text, then click Calculate to see the result.': 'Text eingeben und auf Berechnen klicken, um das Ergebnis zu sehen.',
      'Enter text before copying the result.': 'Geben Sie Text ein, bevor Sie das Ergebnis kopieren.',
      'Enter text before sharing the result.': 'Geben Sie Text ein, bevor Sie das Ergebnis teilen.',
      'No supported letters were found for this method.': 'F\u00fcr diese Methode wurden keine unterst\u00fctzten Buchstaben gefunden.',
      'Total Value': 'Gesamtwert',
      'Method': 'Methode',
      'Digital Root': 'Digitale Wurzel',
      'Words': 'W\u00f6rter',
      'Characters': 'Zeichen',
      'Input:': 'Eingabe:',
      'Letter Breakdown': 'Buchstabenaufschl\u00fcsselung',
      'Breakdown:': 'Aufschl\u00fcsselung:',
      'Result copied to clipboard': 'Ergebnis in die Zwischenablage kopiert',
      'Result ready to share': 'Ergebnis bereit zum Teilen',
      'Quick Examples': 'Schnelle Beispiele',
      'Try Example': 'Beispiel testen',
      'What Is Gematria?': 'Was ist Gematria?',
      'How to Use the Gematria Calculator': 'So verwenden Sie den Gematria-Rechner',
      'Click Calculate to view the result.': 'Klicken Sie auf Berechnen, um das Ergebnis zu sehen.',
      'View the total value.': 'Sehen Sie den Gesamtwert.',
      'Review the letter-by-letter breakdown.': 'Pr\u00fcfen Sie die Buchstabenaufschl\u00fcsselung.',
      'Copy or share the result if needed.': 'Kopieren oder teilen Sie das Ergebnis bei Bedarf.',
      'English Gematria Calculator': 'Englischer Gematria-Rechner',
      'Reverse Gematria Calculator': 'Umgekehrter Gematria-Rechner',
      'Name Gematria Calculator': 'Namens-Gematria-Rechner',
      'Hebrew Gematria Calculator': 'Hebr\u00e4ischer Gematria-Rechner',
      'Calculate Gematria Values': 'Gematria-Werte berechnen',
      'Related Calculators': 'Verwandte Rechner',
      'Privacy Policy': 'Datenschutzerkl\u00e4rung',
      'Terms': 'Bedingungen',
      'Disclaimer': 'Haftungsausschluss',
      'Page Not Found': 'Seite nicht gefunden',
    },
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Portugu\u00eas',
    dir: 'ltr',
    titleSuffix: 'Calculadora de Gematria',
    meta: {
      homeTitle: 'Calculadora de Gematria Gr\u00e1tis',
      homeDescription: 'Use esta calculadora de gematria gr\u00e1tis para calcular valores em ingl\u00eas, reverso, nomes e hebraico com detalhamento por letras.',
      genericDescription: 'Use esta calculadora de gematria multil\u00edngue para calcular valores de palavras, nomes, frases e hebraico com detalhamento claro por letras.',
    },
    phrases: {
      'Language': 'Idioma',
      'Home': 'In\u00edcio',
      'English': 'Ingl\u00eas',
      'Reverse': 'Reverso',
      'Name': 'Nome',
      'Hebrew': 'Hebraico',
      'Number Meanings': 'Significados dos n\u00fameros',
      'Blog': 'Blog',
      'About': 'Sobre',
      'Contact': 'Contato',
      'Gematria Calculator': 'Calculadora de Gematria',
      'Free online calculator': 'Calculadora online gr\u00e1tis',
      'Gematria tool': 'Ferramenta de gematria',
      'Text to calculate': 'Texto para calcular',
      'Type a word, name, or phrase': 'Digite uma palavra, nome ou frase',
      'Gematria method': 'M\u00e9todo de gematria',
      'Calculate': 'Calcular',
      'Clear': 'Limpar',
      'Copy Result': 'Copiar resultado',
      'Share Result': 'Compartilhar resultado',
      'English Gematria': 'Gematria inglesa',
      'Simple Gematria': 'Gematria simples',
      'Jewish Gematria': 'Gematria judaica',
      'Reverse Ordinal': 'Ordinal reverso',
      'Full Reduction': 'Redu\u00e7\u00e3o completa',
      'Reverse Full Reduction': 'Redu\u00e7\u00e3o completa reversa',
      'Hebrew Gematria': 'Gematria hebraica',
      'Enter text, then click Calculate to see the result.': 'Digite o texto e clique em Calcular para ver o resultado.',
      'Enter text before copying the result.': 'Digite texto antes de copiar o resultado.',
      'Enter text before sharing the result.': 'Digite texto antes de compartilhar o resultado.',
      'No supported letters were found for this method.': 'Nenhuma letra compat\u00edvel foi encontrada para este m\u00e9todo.',
      'Total Value': 'Valor total',
      'Method': 'M\u00e9todo',
      'Digital Root': 'Raiz digital',
      'Words': 'Palavras',
      'Characters': 'Caracteres',
      'Input:': 'Entrada:',
      'Letter Breakdown': 'Detalhamento das letras',
      'Breakdown:': 'Detalhamento:',
      'Result copied to clipboard': 'Resultado copiado para a \u00e1rea de transfer\u00eancia',
      'Result ready to share': 'Resultado pronto para compartilhar',
      'Quick Examples': 'Exemplos r\u00e1pidos',
      'Try Example': 'Testar exemplo',
      'What Is Gematria?': 'O que \u00e9 gematria?',
      'How to Use the Gematria Calculator': 'Como usar a calculadora de gematria',
      'Click Calculate to view the result.': 'Clique em Calcular para ver o resultado.',
      'View the total value.': 'Veja o valor total.',
      'Review the letter-by-letter breakdown.': 'Revise o detalhamento letra por letra.',
      'Copy or share the result if needed.': 'Copie ou compartilhe o resultado se precisar.',
      'English Gematria Calculator': 'Calculadora de gematria inglesa',
      'Reverse Gematria Calculator': 'Calculadora de gematria reversa',
      'Name Gematria Calculator': 'Calculadora de gematria de nomes',
      'Hebrew Gematria Calculator': 'Calculadora de gematria hebraica',
      'Calculate Gematria Values': 'Calcular valores de gematria',
      'Related Calculators': 'Calculadoras relacionadas',
      'Privacy Policy': 'Pol\u00edtica de privacidade',
      'Terms': 'Termos',
      'Disclaimer': 'Aviso',
      'Page Not Found': 'P\u00e1gina n\u00e3o encontrada',
    },
  },
  hi: {
    name: 'Hindi',
    nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940',
    dir: 'ltr',
    titleSuffix: '\u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930',
    meta: {
      homeTitle: '\u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930 - \u0936\u092c\u094d\u0926, \u0928\u093e\u092e \u0914\u0930 \u0939\u093f\u092c\u094d\u0930\u0942 \u0915\u0947 \u0932\u093f\u090f \u092e\u0941\u092b\u094d\u0924 \u091f\u0942\u0932',
      homeDescription: '\u0907\u0938 \u092e\u0941\u092b\u094d\u0924 \u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930 \u0938\u0947 \u0936\u092c\u094d\u0926, \u0928\u093e\u092e, \u0935\u093e\u0915\u094d\u092f\u093e\u0902\u0936 \u0914\u0930 \u0939\u093f\u092c\u094d\u0930\u0942 \u092e\u093e\u0928 \u0917\u0923\u0928\u093e \u0915\u0930\u0947\u0902.',
      genericDescription: '\u0936\u092c\u094d\u0926, \u0928\u093e\u092e, \u0935\u093e\u0915\u094d\u092f\u093e\u0902\u0936 \u0914\u0930 \u0939\u093f\u092c\u094d\u0930\u0942 \u092e\u093e\u0928 \u0915\u0940 \u0938\u094d\u092a\u0937\u094d\u091f \u0905\u0915\u094d\u0937\u0930-\u0926\u0930-\u0905\u0915\u094d\u0937\u0930 \u0917\u0923\u0928\u093e \u0915\u0930\u0947\u0902.',
    },
    phrases: {
      'Language': '\u092d\u093e\u0937\u093e',
      'Home': '\u0939\u094b\u092e',
      'English': '\u0905\u0902\u0917\u094d\u0930\u0947\u091c\u0940',
      'Reverse': '\u0909\u0932\u094d\u091f\u093e',
      'Name': '\u0928\u093e\u092e',
      'Hebrew': '\u0939\u093f\u092c\u094d\u0930\u0942',
      'Number Meanings': '\u0938\u0902\u0916\u094d\u092f\u093e \u0905\u0930\u094d\u0925',
      'Blog': '\u092c\u094d\u0932\u0949\u0917',
      'About': '\u092c\u093e\u0930\u0947 \u092e\u0947\u0902',
      'Contact': '\u0938\u0902\u092a\u0930\u094d\u0915',
      'Gematria Calculator': '\u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930',
      'Free online calculator': '\u092e\u0941\u092b\u094d\u0924 \u0911\u0928\u0932\u093e\u0907\u0928 \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930',
      'Text to calculate': '\u0917\u0923\u0928\u093e \u0915\u0947 \u0932\u093f\u090f \u091f\u0947\u0915\u094d\u0938\u094d\u091f',
      'Type a word, name, or phrase': '\u0936\u092c\u094d\u0926, \u0928\u093e\u092e \u092f\u093e \u0935\u093e\u0915\u094d\u092f\u093e\u0902\u0936 \u0932\u093f\u0916\u0947\u0902',
      'Gematria method': '\u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e \u0935\u093f\u0927\u093f',
      'Calculate': '\u0917\u0923\u0928\u093e \u0915\u0930\u0947\u0902',
      'Clear': '\u0938\u093e\u092b \u0915\u0930\u0947\u0902',
      'Copy Result': '\u092a\u0930\u093f\u0923\u093e\u092e \u0915\u0949\u092a\u0940 \u0915\u0930\u0947\u0902',
      'Share Result': '\u092a\u0930\u093f\u0923\u093e\u092e \u0938\u093e\u091d\u093e \u0915\u0930\u0947\u0902',
      'English Gematria': '\u0905\u0902\u0917\u094d\u0930\u0947\u091c\u0940 \u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e',
      'Simple Gematria': '\u0938\u0930\u0932 \u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e',
      'Jewish Gematria': '\u092f\u0939\u0942\u0926\u0940 \u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e',
      'Reverse Ordinal': '\u0909\u0932\u094d\u091f\u093e \u0915\u094d\u0930\u092e',
      'Full Reduction': '\u092a\u0942\u0930\u094d\u0923 \u0930\u093f\u0921\u0915\u094d\u0936\u0928',
      'Reverse Full Reduction': '\u0909\u0932\u094d\u091f\u093e \u092a\u0942\u0930\u094d\u0923 \u0930\u093f\u0921\u0915\u094d\u0936\u0928',
      'Hebrew Gematria': '\u0939\u093f\u092c\u094d\u0930\u0942 \u091c\u0947\u092e\u0948\u091f\u094d\u0930\u093f\u092f\u093e',
      'Enter text, then click Calculate to see the result.': '\u091f\u0947\u0915\u094d\u0938\u094d\u091f \u0932\u093f\u0916\u0947\u0902, \u092b\u093f\u0930 \u092a\u0930\u093f\u0923\u093e\u092e \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0917\u0923\u0928\u093e \u0915\u0930\u0947\u0902.',
      'Total Value': '\u0915\u0941\u0932 \u092e\u093e\u0928',
      'Method': '\u0935\u093f\u0927\u093f',
      'Digital Root': '\u0921\u093f\u091c\u093f\u091f\u0932 \u092e\u0942\u0932',
      'Words': '\u0936\u092c\u094d\u0926',
      'Characters': '\u0905\u0915\u094d\u0937\u0930',
      'Input:': '\u0907\u0928\u092a\u0941\u091f:',
      'Letter Breakdown': '\u0905\u0915\u094d\u0937\u0930 \u0935\u093f\u0935\u0930\u0923',
      'Breakdown:': '\u0935\u093f\u0935\u0930\u0923:',
      'Result copied to clipboard': '\u092a\u0930\u093f\u0923\u093e\u092e \u0915\u094d\u0932\u093f\u092a\u092c\u094b\u0930\u094d\u0921 \u092a\u0930 \u0915\u0949\u092a\u0940 \u0939\u0941\u0906',
      'Result ready to share': '\u092a\u0930\u093f\u0923\u093e\u092e \u0938\u093e\u091d\u093e \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0924\u0948\u092f\u093e\u0930 \u0939\u0948',
      'Privacy Policy': '\u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f',
      'Terms': '\u0936\u0930\u094d\u0924\u0947\u0902',
      'Disclaimer': '\u0905\u0938\u094d\u0935\u0940\u0915\u0930\u0923',
      'Page Not Found': '\u092a\u0943\u0937\u094d\u0920 \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e',
    },
  },
  he: {
    name: 'Hebrew',
    nativeName: '\u05e2\u05d1\u05e8\u05d9\u05ea',
    dir: 'rtl',
    titleSuffix: '\u05de\u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4',
    meta: {
      homeTitle: '\u05de\u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4 - \u05db\u05dc\u05d9 \u05d7\u05d9\u05e0\u05de\u05d9 \u05dc\u05de\u05d9\u05dc\u05d9\u05dd, \u05e9\u05de\u05d5\u05ea \u05d5\u05e2\u05d1\u05e8\u05d9\u05ea',
      homeDescription: '\u05d4\u05e9\u05ea\u05de\u05e9\u05d5 \u05d1\u05de\u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4 \u05d7\u05d9\u05e0\u05de\u05d9 \u05dc\u05d7\u05d9\u05e9\u05d5\u05d1 \u05e2\u05e8\u05db\u05d9 \u05de\u05d9\u05dc\u05d9\u05dd, \u05e9\u05de\u05d5\u05ea, \u05d1\u05d9\u05d8\u05d5\u05d9\u05d9\u05dd \u05d5\u05e2\u05d1\u05e8\u05d9\u05ea.',
      genericDescription: '\u05d7\u05e9\u05d1\u05d5 \u05e2\u05e8\u05db\u05d9 \u05de\u05d9\u05dc\u05d9\u05dd, \u05e9\u05de\u05d5\u05ea, \u05d1\u05d9\u05d8\u05d5\u05d9\u05d9\u05dd \u05d5\u05e2\u05d1\u05e8\u05d9\u05ea \u05e2\u05dd \u05e4\u05d9\u05e8\u05d5\u05d8 \u05d1\u05e8\u05d5\u05e8 \u05dc\u05e4\u05d9 \u05d0\u05d5\u05ea\u05d9\u05d5\u05ea.',
    },
    phrases: {
      'Language': '\u05e9\u05e4\u05d4',
      'Home': '\u05d1\u05d9\u05ea',
      'English': '\u05d0\u05e0\u05d2\u05dc\u05d9\u05ea',
      'Reverse': '\u05d4\u05e4\u05d5\u05da',
      'Name': '\u05e9\u05dd',
      'Hebrew': '\u05e2\u05d1\u05e8\u05d9\u05ea',
      'Number Meanings': '\u05de\u05e9\u05de\u05e2\u05d5\u05d9\u05d5\u05ea \u05de\u05e1\u05e4\u05e8\u05d9\u05dd',
      'Blog': '\u05d1\u05dc\u05d5\u05d2',
      'About': '\u05d0\u05d5\u05d3\u05d5\u05ea',
      'Contact': '\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8',
      'Gematria Calculator': '\u05de\u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4',
      'Free online calculator': '\u05de\u05d7\u05e9\u05d1\u05d5\u05df \u05de\u05e7\u05d5\u05d5\u05df \u05d7\u05d9\u05e0\u05de\u05d9',
      'Text to calculate': '\u05d8\u05e7\u05e1\u05d8 \u05dc\u05d7\u05d9\u05e9\u05d5\u05d1',
      'Type a word, name, or phrase': '\u05d4\u05e7\u05dc\u05d3 \u05de\u05d9\u05dc\u05d4, \u05e9\u05dd \u05d0\u05d5 \u05d1\u05d9\u05d8\u05d5\u05d9',
      'Gematria method': '\u05e9\u05d9\u05d8\u05ea \u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4',
      'Calculate': '\u05d7\u05e9\u05d1',
      'Clear': '\u05e0\u05e7\u05d4',
      'Copy Result': '\u05d4\u05e2\u05ea\u05e7 \u05ea\u05d5\u05e6\u05d0\u05d4',
      'Share Result': '\u05e9\u05ea\u05e3 \u05ea\u05d5\u05e6\u05d0\u05d4',
      'English Gematria': '\u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4 \u05d0\u05e0\u05d2\u05dc\u05d9\u05ea',
      'Simple Gematria': '\u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4 \u05e4\u05e9\u05d5\u05d8\u05d4',
      'Jewish Gematria': '\u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4 \u05d9\u05d4\u05d5\u05d3\u05d9\u05ea',
      'Reverse Ordinal': '\u05e1\u05d3\u05e8 \u05d4\u05e4\u05d5\u05da',
      'Full Reduction': '\u05e6\u05de\u05e6\u05d5\u05dd \u05de\u05dc\u05d0',
      'Reverse Full Reduction': '\u05e6\u05de\u05e6\u05d5\u05dd \u05de\u05dc\u05d0 \u05d4\u05e4\u05d5\u05da',
      'Hebrew Gematria': '\u05d2\u05d9\u05de\u05d8\u05e8\u05d9\u05d4 \u05e2\u05d1\u05e8\u05d9\u05ea',
      'Enter text, then click Calculate to see the result.': '\u05d4\u05e7\u05dc\u05d3 \u05d8\u05e7\u05e1\u05d8 \u05d5\u05dc\u05d7\u05e5 \u05d7\u05e9\u05d1 \u05db\u05d3\u05d9 \u05dc\u05e8\u05d0\u05d5\u05ea \u05d0\u05ea \u05d4\u05ea\u05d5\u05e6\u05d0\u05d4.',
      'Total Value': '\u05e2\u05e8\u05da \u05db\u05d5\u05dc\u05dc',
      'Method': '\u05e9\u05d9\u05d8\u05d4',
      'Digital Root': '\u05e9\u05d5\u05e8\u05e9 \u05e1\u05e4\u05e8\u05ea\u05d9',
      'Words': '\u05de\u05d9\u05dc\u05d9\u05dd',
      'Characters': '\u05ea\u05d5\u05d5\u05d9\u05dd',
      'Input:': '\u05e7\u05dc\u05d8:',
      'Letter Breakdown': '\u05e4\u05d9\u05e8\u05d5\u05d8 \u05d0\u05d5\u05ea\u05d9\u05d5\u05ea',
      'Breakdown:': '\u05e4\u05d9\u05e8\u05d5\u05d8:',
      'Result copied to clipboard': '\u05d4\u05ea\u05d5\u05e6\u05d0\u05d4 \u05d4\u05d5\u05e2\u05ea\u05e7\u05d4 \u05dc\u05dc\u05d5\u05d7',
      'Result ready to share': '\u05d4\u05ea\u05d5\u05e6\u05d0\u05d4 \u05de\u05d5\u05db\u05e0\u05d4 \u05dc\u05e9\u05d9\u05ea\u05d5\u05e3',
      'Privacy Policy': '\u05de\u05d3\u05d9\u05e0\u05d9\u05d5\u05ea \u05e4\u05e8\u05d8\u05d9\u05d5\u05ea',
      'Terms': '\u05ea\u05e0\u05d0\u05d9\u05dd',
      'Disclaimer': '\u05d4\u05e6\u05d4\u05e8\u05ea \u05d0\u05d7\u05e8\u05d9\u05d5\u05ea',
      'Page Not Found': '\u05d4\u05d3\u05e3 \u05dc\u05d0 \u05e0\u05de\u05e6\u05d0',
    },
  },
};

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function loadContentTranslations() {
  const file = path.join(__dirname, 'i18n-content-cache.json');
  if (!fs.existsSync(file)) return {};
  try {
    const cache = JSON.parse(fs.readFileSync(file, 'utf8'));
    return cache.translations || {};
  } catch {
    return {};
  }
}

function staticTranslationFor(lang, rawValue) {
  const key = htmlUnescape(rawValue).replace(/\s+/g, ' ').trim();
  if (!key) return '';
  return (contentTranslations[lang] && contentTranslations[lang][key])
    || (translations[lang] && translations[lang].phrases[key])
    || key;
}

function translateStaticHtml(html, lang) {
  if (lang === 'en') return html;
  const protectedBlocks = [];
  let next = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (block) => {
    const token = `<!--STATIC_I18N_BLOCK_${protectedBlocks.length}-->`;
    protectedBlocks.push(block);
    return token;
  });

  next = next.replace(/>([^<>]+)</g, (match, rawText) => {
    const leading = rawText.match(/^\s*/)[0];
    const trailing = rawText.match(/\s*$/)[0];
    const trimmed = rawText.trim();
    if (!trimmed) return match;
    const translated = staticTranslationFor(lang, trimmed);
    if (!translated || translated === htmlUnescape(trimmed)) return match;
    return `>${leading}${htmlEscape(translated)}${trailing}<`;
  });

  next = next.replace(/\s(placeholder|aria-label|title|alt)="([^"]*)"/gi, (match, attr, rawValue) => {
    const translated = staticTranslationFor(lang, rawValue);
    if (!translated || translated === htmlUnescape(rawValue)) return match;
    return ` ${attr}="${htmlEscape(translated)}"`;
  });

  return next.replace(/<!--STATIC_I18N_BLOCK_(\d+)-->/g, (match, index) => protectedBlocks[Number(index)] || match);
}

function jsonEscapeNonAscii(json) {
  return json.replace(/[^\x00-\x7f]/g, (char) => {
    return Array.from(char)
      .map((part) => `\\u${part.charCodeAt(0).toString(16).padStart(4, '0')}`)
      .join('');
  });
}

function writeJsonFiles() {
  const dir = path.join(root, 'assets', 'i18n');
  fs.mkdirSync(dir, { recursive: true });
  for (const lang of languages) {
    const data = {
      ...translations[lang],
      ui: { languages: languageNames },
      attributes: translations[lang].phrases,
    };
    const json = JSON.stringify(data, null, 2) + '\n';
    fs.writeFileSync(path.join(dir, `${lang}.json`), jsonEscapeNonAscii(json), 'utf8');
  }
}

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || localizedLanguages.includes(entry.name)) continue;
    if (entry.isFile() && /^google[a-z0-9]+\.html$/i.test(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function routeForSource(file) {
  const relative = toPosix(path.relative(root, file));
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative.slice(0, -'.html'.length)}`;
}

function urlFor(lang, route) {
  if (lang === 'en') return `${site}${route}`;
  if (route === '/') return `${site}/${lang}/`;
  return `${site}/${lang}${route}${route.endsWith('/') ? '' : '/'}`;
}

function localizedFileFor(lang, route) {
  if (route === '/') return path.join(root, lang, 'index.html');
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(root, lang, clean, 'index.html');
}

function titleFor(lang, route, sourceTitle) {
  const locale = translations[lang];
  const t = (key) => locale.phrases[key] || key;
  if (route === '/') return locale.meta.homeTitle;
  if (route === '/english-gematria-calculator') return `${t('English Gematria Calculator')} - ${locale.titleSuffix}`;
  if (route === '/reverse-gematria-calculator') return `${t('Reverse Gematria Calculator')} - ${locale.titleSuffix}`;
  if (route === '/name-gematria-calculator') return `${t('Name Gematria Calculator')} - ${locale.titleSuffix}`;
  if (route === '/hebrew-gematria-calculator') return `${t('Hebrew Gematria Calculator')} - ${locale.titleSuffix}`;
  if (route === '/gematria-number-meanings/' && lang !== 'en') return `${t('Number Meanings')} - ${locale.titleSuffix}`;
  if (route === '/blog/') return `${t('Blog')} - ${locale.titleSuffix}`;
  if (route === '/blog/what-is-gematria' && lang !== 'en') return `${t('What Is Gematria?')} - ${locale.titleSuffix}`;
  if (route === '/blog/english-gematria-explained' && lang !== 'en') return `${t('English')} Gematria Guide - ${locale.titleSuffix}`;
  if (route === '/blog/hebrew-vs-english-gematria' && lang !== 'en') return `Hebrew vs ${t('English')} - ${locale.titleSuffix}`;
  if (route === '/blog/how-to-calculate-name-gematria' && lang !== 'en') return `${t('Name')} Gematria Guide - ${locale.titleSuffix}`;
  if (route === '/blog/gematria-number-meanings' && lang !== 'en') return `${t('Number Meanings')} Guide - ${locale.titleSuffix}`;
  if (route === '/about') return `${t('About')} - ${locale.titleSuffix}`;
  if (route === '/contact') return `${t('Contact')} - ${locale.titleSuffix}`;
  if (route === '/privacy-policy') return `${t('Privacy Policy')} - ${locale.titleSuffix}`;
  if (route === '/terms' && lang !== 'en') return `${t('Terms')} - ${locale.titleSuffix}`;
  if (route === '/disclaimer') return `${t('Disclaimer')} - ${locale.titleSuffix}`;
  if (route === '/404') return `${t('Page Not Found')} - ${locale.titleSuffix}`;
  return sourceTitle.replace(/Gematria Calculator/g, locale.titleSuffix);
}

function descriptionFor(lang, route, sourceDescription) {
  const locale = translations[lang];
  if (lang === 'en') return route === '/' ? locale.meta.homeDescription : sourceDescription;
  return route === '/' ? locale.meta.homeDescription : locale.meta.genericDescription;
}

function setTag(html, tag, value) {
  return html.replace(new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`, 'i'), `<${tag}>${htmlEscape(value)}</${tag}>`);
}

function setMeta(html, selector, value) {
  const escaped = htmlEscape(value);
  const attr = selector.type === 'name' ? 'name' : 'property';
  const pattern = new RegExp(`(<meta\\s+${attr}="${selector.value}"\\s+content=")[^"]*(")`, 'i');
  return html.replace(pattern, `$1${escaped}$2`);
}

function setCanonical(html, href) {
  return html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${href}$2`);
}

function setOgUrl(html, href) {
  return html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${href}$2`);
}

function stripHtml(value) {
  return htmlUnescape(String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function pageLabel(html, route) {
  if (route === '/') return 'Home';
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [null, ''])[1];
  if (h1) return stripHtml(h1);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [null, ''])[1];
  return stripHtml(title).replace(/\s+-\s+.*$/, '') || 'Gematria Calculator';
}

function routePrefix(lang) {
  return lang === 'en' ? '' : `/${lang}`;
}

function localPath(lang, route) {
  if (lang === 'en') return route === '/' ? '/' : route;
  if (route === '/') return `/${lang}/`;
  return `/${lang}${route}${route.endsWith('/') ? '' : '/'}`;
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function insertBeforeHeadClose(html, addition) {
  return html.replace('</head>', `${addition}</head>`);
}

function insertBeforeMainClose(html, addition) {
  return html.replace('</main>', `${addition}</main>`);
}

function ensureBreadcrumbs(html, lang, route, href) {
  const label = pageLabel(html, route);
  const localizedHome = lang === 'en' ? 'Home' : staticTranslationFor(lang, 'Home');
  const localizedLabel = lang === 'en' ? label : staticTranslationFor(lang, label);
  let next = html;

  if (!/<nav\s+class="breadcrumbs"/i.test(next)) {
    const breadcrumb = route === '/'
      ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><span aria-current="page">${htmlEscape(localizedHome)}</span></li></ol></nav>`
      : `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="${localPath(lang, '/')}">${htmlEscape(localizedHome)}</a></li><li><span aria-current="page">${htmlEscape(localizedLabel)}</span></li></ol></nav>`;
    next = next.replace('<main id="main-content">', `<main id="main-content">${breadcrumb}`);
  }

  if (!/"@type"\s*:\s*"BreadcrumbList"/.test(next)) {
    const itemListElement = route === '/'
      ? [{ '@type': 'ListItem', position: 1, name: localizedHome, item: href }]
      : [
        { '@type': 'ListItem', position: 1, name: localizedHome, item: urlFor(lang, '/') },
        { '@type': 'ListItem', position: 2, name: localizedLabel, item: href },
      ];
    next = insertBeforeHeadClose(next, jsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    }));
  }

  return next;
}

function faqPairsForRoute(route) {
  const generic = [
    ['Which calculator should I use from this page?', 'Use the calculator that matches the language and method you want to study, then keep the same method for related comparisons.'],
    ['Can I use these pages for personal decisions?', 'No. Gematria pages are educational and interpretive, not financial, legal, medical, religious, or life decision advice.'],
    ['Why should I check the letter breakdown?', 'The breakdown shows which letters were counted and helps you verify the total before comparing or interpreting a result.'],
  ];
  const byRoute = {
    '/about': [
      ['What is the purpose of this website?', 'The site explains gematria calculators, letter values, examples, and responsible interpretation in a clear educational format.'],
      ['Who is this site for?', 'It is for readers who want to calculate word, name, phrase, and Hebrew letter values while seeing how each result was formed.'],
      ['How is content reviewed?', 'Pages focus on clear method labels, original explanations, calculator examples, and responsible language about symbolic interpretation.'],
    ],
    '/blog/': [
      ['Which gematria article should I read first?', 'Start with the beginner guide, then open the method guide that matches the calculator you plan to use.'],
      ['Are the blog guides connected to the calculators?', 'Yes. The guides explain the same methods used by the calculator pages and link to related tools for practical checking.'],
      ['Are blog interpretations predictive?', 'No. The articles treat gematria as symbolic education and reflection, not prediction or professional advice.'],
    ],
    '/privacy-policy': [
      ['Does the calculator save my input?', 'No. Calculator input is processed in your browser. Shared result URLs may contain the text you choose to include.'],
      ['Can ads or analytics use cookies?', 'Third-party services such as advertising or analytics providers may use cookies or similar technologies under their own policies.'],
      ['How can I ask a privacy question?', 'Use the contact page and avoid sending sensitive personal information.'],
    ],
    '/terms': [
      ['What is this website allowed for?', 'The website is for personal, educational, symbolic, spiritual, research, journaling, and entertainment use.'],
      ['Are calculator results guaranteed?', 'No. Users should verify spelling, method, supported characters, and the visible letter breakdown before relying on a result.'],
      ['Can I copy the website content?', 'You may link to public pages, but you may not republish substantial original content as your own without permission.'],
    ],
    '/disclaimer': [
      ['Is gematria professional advice?', 'No. Gematria content is symbolic and educational, not financial, legal, medical, religious, emergency, or professional advice.'],
      ['Can gematria predict events?', 'No. The website does not treat number values as proof, prediction, or guaranteed messages.'],
      ['Should I verify calculator results?', 'Yes. Always review the selected method, spelling, unsupported characters, and letter breakdown.'],
    ],
  };
  return byRoute[route] || generic;
}

function extractFaqPairs(html) {
  const pairs = [];
  html.replace(/<details[^>]*class="[^"]*\bfaq-item\b[^"]*"[^>]*>[\s\S]*?<summary>([\s\S]*?)<\/summary>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi, (match, question, answer) => {
    pairs.push([stripHtml(question), stripHtml(answer)]);
    return match;
  });
  return pairs;
}

function faqSection(pairs, heading = 'FAQ') {
  return `<section class="content-section faq-section" id="faq"><div class="section-heading"><h2>${htmlEscape(heading)}</h2></div><div class="faq-list">${pairs.map(([question, answer]) => `<details class="faq-item"><summary>${htmlEscape(question)}</summary><p>${htmlEscape(answer)}</p></details>`).join('')}</div></section>`;
}

function ensureFaq(html, lang, route) {
  let next = html;
  let pairs = extractFaqPairs(next);

  if (!pairs.length) {
    pairs = faqPairsForRoute(route);
    next = insertBeforeMainClose(next, faqSection(pairs));
  }

  if (!/"@type"\s*:\s*"FAQPage"/.test(next)) {
    next = insertBeforeHeadClose(next, jsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pairs.map(([question, answer]) => ({
        '@type': 'Question',
        name: lang === 'en' ? question : staticTranslationFor(lang, question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: lang === 'en' ? answer : staticTranslationFor(lang, answer),
        },
      })),
    }));
  }

  return next;
}

function relatedCalculatorSection() {
  const cards = [
    ['/english-gematria-calculator', 'English Gematria Calculator', 'Calculate English A6 to Z156 values with a clear letter-by-letter breakdown.'],
    ['/reverse-gematria-calculator', 'Reverse Gematria Calculator', 'Compare reverse alphabet values where A equals 26 and Z equals 1.'],
    ['/name-gematria-calculator', 'Name Gematria Calculator', 'Calculate first names, full names, nicknames, and initials consistently.'],
    ['/hebrew-gematria-calculator', 'Hebrew Gematria Calculator', 'Calculate standard Hebrew letter values and common final forms.'],
  ];
  return `<section class="content-section related-calculators"><div class="section-heading"><h2>Related Calculators</h2><p>Use the matching calculator when you want to test a word, name, phrase, or Hebrew spelling.</p></div><div class="card-grid">${cards.map(([href, title, text]) => `<article class="info-card"><h3><a href="${href}">${htmlEscape(title)}</a></h3><p>${htmlEscape(text)}</p></article>`).join('')}</div></section>`;
}

function ensureRelatedCalculators(html, route) {
  let next = html
    .replace(/<h2>Gematria Calculator Types<\/h2>/g, '<h2>Related Calculators</h2>')
    .replace(/<h2>Related Guides and Tools<\/h2>/g, '<h2>Related Calculators and Guides</h2>')
    .replace(/<h2>What We Offer<\/h2>/g, '<h2>Related Calculators</h2>');

  if (!/Related Calculators/i.test(next)) {
    next = insertBeforeMainClose(next, relatedCalculatorSection());
  }

  return next;
}

function enhanceSeoChecklist(html, lang, route, href) {
  if (route === '/404') return html;
  if (plainInfoRoutes.has(route)) return ensureBreadcrumbs(html, lang, route, href);
  let next = ensureRelatedCalculators(html, route);
  next = ensureFaq(next, lang, route);
  next = ensureBreadcrumbs(next, lang, route, href);
  return next;
}

function languageTag(lang) {
  return {
    en: 'en-US',
    es: 'es',
    fr: 'fr',
    de: 'de',
    pt: 'pt',
    hi: 'hi',
    he: 'he',
  }[lang] || lang;
}

function rewriteJsonLdValue(value, lang, href, description) {
  if (Array.isArray(value)) return value.map((item) => rewriteJsonLdValue(item, lang, href, description));
  if (!value || typeof value !== 'object') return value;
  const next = { ...value };
  for (const key of Object.keys(next)) {
    if ((key === 'url' || key === 'mainEntityOfPage') && typeof next[key] === 'string' && next[key].startsWith(site)) {
      next[key] = href;
      continue;
    }
    if (key === 'target' && typeof next[key] === 'string' && next[key].includes('/gematria-number-meanings/?q=')) {
      next[key] = `${urlFor(lang, '/gematria-number-meanings/')}?q={search_term_string}`;
      continue;
    }
    if (key === 'inLanguage') {
      next[key] = languageTag(lang);
      continue;
    }
    if (key === 'description' && typeof next[key] === 'string') {
      next[key] = description;
      continue;
    }
    next[key] = rewriteJsonLdValue(next[key], lang, href, description);
  }
  return next;
}

function rewriteJsonLd(html, lang, href, description) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, rawJson) => {
    try {
      const data = JSON.parse(rawJson.trim());
      const updated = rewriteJsonLdValue(data, lang, href, description);
      return `<script type="application/ld+json">${JSON.stringify(updated)}</script>`;
    } catch {
      return match;
    }
  });
}

function removeAlternates(html) {
  return html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+">/gi, '');
}

function alternateLinks(route) {
  const links = languages.map((lang) => `<link rel="alternate" hreflang="${lang}" href="${urlFor(lang, route)}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${urlFor('en', route)}">`);
  return links.join('');
}

function ensureI18nScript(html) {
  if (html.includes('/assets/js/i18n.js')) return html;
  return html.replace(
    '<script src="/assets/js/main.js" defer></script>',
    '<script src="/assets/js/i18n.js" defer></script><script src="/assets/js/main.js" defer></script>',
  );
}

function normalizeFooterLinks(html) {
  const links = [
    ['/', 'Home'],
    ['/english-gematria-calculator', 'English Gematria Calculator'],
    ['/reverse-gematria-calculator', 'Reverse Gematria Calculator'],
    ['/name-gematria-calculator', 'Name Gematria Calculator'],
    ['/hebrew-gematria-calculator', 'Hebrew Gematria Calculator'],
    ['/gematria-number-meanings/', 'Number Meanings'],
    ['/blog/', 'Blog'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
    ['/privacy-policy', 'Privacy Policy'],
    ['/terms', 'Terms'],
    ['/disclaimer', 'Disclaimer'],
  ];
  const list = links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('');
  return html.replace(/<ul class="footer-links">[\s\S]*?<\/ul>/i, `<ul class="footer-links">${list}</ul>`);
}

function rewriteInternalLinks(html, lang) {
  return html.replace(/\s(href|action)="([^"]*)"/g, (match, attr, rawUrl) => {
    if (!rawUrl || rawUrl.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawUrl)) return match;
    let parsed;
    try {
      parsed = new URL(rawUrl, site);
    } catch {
      return match;
    }
    if (parsed.origin !== site) return match;
    if (parsed.pathname.startsWith('/assets/')) return match;
    let route = parsed.pathname;
    if (route !== '/') route = route.replace(/\/$/, '');
    const localized = lang === 'en'
      ? route
      : route === '/'
        ? `/${lang}/`
        : `/${lang}${route}/`;
    return ` ${attr}="${localized}${parsed.search}${parsed.hash}"`;
  });
}

function sourceTitle(html) {
  return (html.match(/<title>([\s\S]*?)<\/title>/i) || [null, ''])[1].replace(/&amp;/g, '&');
}

function sourceDescription(html) {
  return (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [null, ''])[1].replace(/&amp;/g, '&');
}

function renderPage(sourceHtml, lang, route) {
  const locale = translations[lang];
  const title = titleFor(lang, route, sourceTitle(sourceHtml));
  const description = descriptionFor(lang, route, sourceDescription(sourceHtml));
  const href = urlFor(lang, route);
  const shouldIndex = route !== '/404';
  let html = sourceHtml;
  html = html.replace(/<html\b[^>]*>/i, `<html lang="${lang}" dir="${locale.dir}">`);
  html = setTag(html, 'title', title);
  html = setMeta(html, { type: 'name', value: 'description' }, description);
  html = setMeta(html, { type: 'name', value: 'robots' }, shouldIndex ? 'index, follow' : 'noindex, follow');
  html = setMeta(html, { type: 'property', value: 'og:title' }, title);
  html = setMeta(html, { type: 'property', value: 'og:description' }, description);
  html = setMeta(html, { type: 'name', value: 'twitter:title' }, title);
  html = setMeta(html, { type: 'name', value: 'twitter:description' }, description);
  html = ensureI18nScript(html);
  html = normalizeFooterLinks(html);
  html = enhanceSeoChecklist(html, lang, route, href);
  if (lang !== 'en') {
    html = rewriteInternalLinks(html, lang);
    html = translateStaticHtml(html, lang);
  }
  html = setCanonical(html, href);
  html = setOgUrl(html, href);
  html = rewriteJsonLd(html, lang, href, description);
  html = removeAlternates(html).replace('</head>', `${route === '/404' ? '' : alternateLinks(route)}</head>`);
  return html;
}

function writePages() {
  for (const lang of localizedLanguages) fs.rmSync(path.join(root, lang), { recursive: true, force: true });
  const sourceFiles = walkHtml(root).sort((a, b) => routeForSource(a).localeCompare(routeForSource(b)));
  for (const file of sourceFiles) {
    const sourceHtml = fs.readFileSync(file, 'utf8');
    const route = routeForSource(file);
    fs.writeFileSync(file, renderPage(sourceHtml, 'en', route), 'utf8');
    for (const lang of localizedLanguages) {
      const target = localizedFileFor(lang, route);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, renderPage(sourceHtml, lang, route), 'utf8');
    }
  }
  return sourceFiles.length;
}

function writeSitemap() {
  const urls = [];
  const sourceFiles = walkHtml(root).sort((a, b) => routeForSource(a).localeCompare(routeForSource(b)));
  for (const file of sourceFiles) {
    const route = routeForSource(file);
    if (route !== '/404') {
      for (const lang of languages) {
        urls.push(urlFor(lang, route));
      }
    }
  }
  const body = urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n');
  fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, 'utf8');
  return urls.length;
}

writeJsonFiles();
const sourceCount = writePages();
const sitemapCount = writeSitemap();
console.log(`Updated ${sourceCount} English pages`);
console.log(`Generated ${sourceCount * localizedLanguages.length} localized pages`);
console.log(`Sitemap URLs: ${sitemapCount}`);
