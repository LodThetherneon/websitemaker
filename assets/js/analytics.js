/*
  ================================================================
  Google Analytics 4 – feltételes betöltés (csak süti elfogadás után)
  ================================================================
  TEENDŐ: Cseréld ki a GA_MEASUREMENT_ID értékét a saját
  Google Analytics mérési azonosítódra.

  Hol találod:
  1. Menj ide: https://analytics.google.com
  2. Adminisztráció → Adatfolyamok → válaszd ki az oldalad
  3. Mérési azonosító: G-XXXXXXXXXX formátumú
  ================================================================
*/

const GA_MEASUREMENT_ID = 'G-ILLESZD_BE_IDE'; // pl. G-ABC1234567

function loadGoogleAnalytics() {
  if (GA_MEASUREMENT_ID.includes('ILLESZD_BE')) {
    console.warn('Analytics: Add meg a GA mérési azonosítót az analytics.js fájlban!');
    return;
  }

  // GA4 script betöltése
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true // GDPR: anonimizálja az IP-t
  });

  console.log('Google Analytics betöltve:', GA_MEASUREMENT_ID);
}

// Exportáljuk, hogy a cookie banner meg tudja hívni
window.loadGoogleAnalytics = loadGoogleAnalytics;
