/**
 * i18n.js — Arabic/English language engine for the Jory Bakery site.
 *
 * Single responsibility: own the translation dictionary and apply/persist
 * the active language. Nothing outside this file mutates language state.
 *
 * How it works:
 * - Arabic is authored directly in the HTML (the source of truth), so on
 *   init() we capture every [data-i18n] element's current markup into
 *   translations.ar automatically — no need to hand-duplicate Arabic here.
 * - English lives in the `en` dictionary below, keyed the same way.
 * - apply(lang) swaps every [data-i18n] element's innerHTML from the
 *   active dictionary and flips the page direction (rtl/ltr) to match.
 */
const I18n = (() => {
  const STORAGE_KEY = 'jory_lang';
  const DEFAULT_LANG = 'ar';

  const translations = {
    ar: {}, // populated at init() from the DOM
    en: {
      'hero.title': '<span>Jory Factory</span>.. Your Partner in Baking Success',
      'hero.lead': 'We bake <b>more than 100,000 pieces</b> daily using the latest baking technology and consistent quality, with delivery covering every region of the Kingdom.',
      'hero.aud1': 'Wholesale Markets &amp; Supermarkets',
      'hero.aud2': 'Restaurants &amp; Cafés',
      'hero.aud3': 'Catering &amp; Food Supply',
      'hero.ctaSales': 'Contact Sales Team',
      'hero.ctaProducts': 'Product List',
      'why.eyebrow': 'Why Choose Jory as Your Supplier?',
      'why.title': 'Your Ideal Partner in the World of Baked Goods',
      'why.c1t': 'Consistent Quality',
      'why.c1d': 'Strict production standards ensure the same quality in every order, no matter how often you reorder.',
      'why.c2t': 'Competitive Prices',
      'why.c2d': 'Special wholesale pricing that boosts your profit margin compared to traditional supply, with no middlemen and no hidden costs.',
      'why.c3t': 'Regular Delivery Fleet',
      'why.c3d': 'Fixed delivery schedules with quantities that suit your needs, ensuring your business is always stocked.',
      'why.c4t': 'Daily Follow-up',
      'why.c4d': 'Continuous communication to track your orders and ensure on-time delivery without delay.',
      'coverage.eyebrow': 'Wide Coverage',
      'coverage.title': 'Our Fleet Covers All Regions of the Kingdom',
      'coverage.sub': 'Regular delivery with our own fleet to our customers across all regions of Saudi Arabia.',
      'products.eyebrow': 'Jory Product Range',
      'products.title': 'A Complete Range That Covers All Your Needs',
      'products.sub': 'All our products are available in sizes and sectors that suit the needs of markets, restaurants and catering alike.',
      'products.sectorMarket': 'Retail &amp; Wholesale Markets Sector',
      'products.sectorFood': 'Restaurants &amp; Catering Sector',
      'products.catTortilla': 'Tortilla Wraps',
      'products.catBurger': 'Burger Buns',
      'products.catRoll': 'Sandwich Rolls',
      'products.catJumbo': 'Jumbo Sandwich',
      'products.catToast': 'Toast Bread',
      'products.sizeLabel': 'Size:',
      'prod.tortWhite': 'White Flour Tortilla',
      'prod.tortWheat': 'Whole Wheat Tortilla',
      'prod.tortSpicy': 'Spicy Tortilla',
      'prod.bunPlain': 'Plain Burger Buns',
      'prod.bunSesame': 'Sesame Burger Buns',
      'prod.rollMkt': 'Plain Sandwich Roll',
      'prod.rollFood': 'Plain - Sesame - Potato Sandwich Roll',
      'prod.jumboMkt': 'Sesame Jumbo Sandwich',
      'prod.jumboFood': 'Sesame - Plain - Brioche - Potato Jumbo Sandwich',
      'prod.toastWhite': 'White Toast Bread',
      'prod.toastWheat': 'Whole Wheat Toast Bread',
      'size.w6_8_10': '6 - 8 - 10 inch',
      'size.8': '8 inch',
      'size.4': '4 inch',
      'size.18cm': '18 cm',
      'size.24cm': '24 cm',
      'size.600g': '600 grams',
      'size.w6_8_10_12': '6 - 8 - 10 - 12 inch',
      'size.mini': 'Mini 2.8 - 3.7 - 4 inch',
      'proof.eyebrow': 'Jory Bakery Factory',
      'proof.title': 'We provide daily supply to wholesale markets &amp; supermarkets, restaurants &amp; cafés, and catering &amp; food supply across all regions of the Kingdom',
      'proof.check1': 'Fresh baked goods daily',
      'proof.check2': 'Competitive wholesale prices',
      'proof.check3': 'Regular supply with quantities that suit your needs',
      'proof.cardTitle': 'Before choosing a supplier...',
      'proof.cardDesc': 'Try the quality yourself. Order your samples now and contact us for supply orders.',
      'proof.cardBtn': 'View Product List',
      'proof.whatsapp': 'WhatsApp',
      'proof.call': 'Call',
      'footer.brand': 'Jory Food Industries Factory',
      'footer.tagline': 'Produced by Al-Maseka Trading Co. on behalf of the brand owners',
      'footer.addr1': 'Kingdom of Saudi Arabia — Riyadh',
      'footer.addr2': 'P.O. Box 58123 Riyadh 11594',
      'footer.mapLink': 'View Factory Location on Map',
      'footer.copyright': '© All rights reserved to Jory Food Industries Factory',
      'meta.title': 'Jory Bakery Factory — Wholesale Supply for Restaurants, Cafés &amp; Grocery Stores Across the Kingdom',
      'meta.desc': 'Jory.. Your ideal partner in the world of baked goods. Wholesale supply for wholesale markets &amp; supermarkets, restaurants &amp; cafés, and catering &amp; food supply: tortillas, burger buns, sandwich rolls and toast bread. Production exceeding 100,000 pieces daily, competitive wholesale prices, and a fleet covering all regions of Saudi Arabia.'
    }
  };

  let metaDescTag = null;
  let toggleBtn = null;
  let currentLang = DEFAULT_LANG;

  function captureArabicDefaults(){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      translations.ar[el.getAttribute('data-i18n')] = el.innerHTML;
    });
    translations.ar['meta.title'] = document.title;
    translations.ar['meta.desc'] = metaDescTag ? metaDescTag.getAttribute('content') : '';
  }

  function apply(lang){
    const dict = translations[lang] || translations.ar;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    if(dict['meta.title']) document.title = dict['meta.title'];
    if(metaDescTag && dict['meta.desc']) metaDescTag.setAttribute('content', dict['meta.desc']);
    if(toggleBtn) toggleBtn.textContent = lang === 'ar' ? 'English' : 'العربية';

    localStorage.setItem(STORAGE_KEY, lang);
    currentLang = lang;
  }

  function toggle(){
    apply(currentLang === 'ar' ? 'en' : 'ar');
  }

  function init(){
    metaDescTag = document.querySelector('meta[name="description"]');
    toggleBtn = document.getElementById('langToggle');

    captureArabicDefaults();

    currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    apply(currentLang);

    if(toggleBtn) toggleBtn.addEventListener('click', toggle);
  }

  return { init, apply, toggle };
})();
