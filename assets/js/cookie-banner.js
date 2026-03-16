/*
  ================================================================
  GDPR Süti Banner – websitemaker.hu
  ================================================================
  Automatikusan megjelenik az első látogatáskor.
  - Elfogadás → süti elmentve, Google Analytics betöltve
  - Elutasítás → csak funkcionális sütik futnak
  - 365 napig emlékezik a döntésre
  ================================================================
*/

(function () {
  const COOKIE_KEY = 'wm_cookie_consent';
  const COOKIE_DAYS = 365;

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, c) => {
      const [k, v] = c.split('=');
      return k === name ? decodeURIComponent(v) : acc;
    }, null);
  }

  function removeBanner() {
    const banner = document.getElementById('wm-cookie-banner');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(20px)';
      setTimeout(() => banner.remove(), 350);
    }
  }

  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'wm-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie hozzájárulás');
    banner.innerHTML = `
      <div class="wm-cookie-inner">
        <div class="wm-cookie-text">
          <strong>Sütiket beállítása</strong>
          <p>Az oldal Google Analytics sütiket használ a látogatottság mérésére. Ezek csak az elfogadás után töltődnek be. Bővebben az erről az <a href="privacy.html">Adatvédelmi tájékoztatóban</a>.</p>
        </div>
        <div class="wm-cookie-buttons">
          <button id="wm-cookie-reject" class="wm-btn-reject">Elutasítom</button>
          <button id="wm-cookie-accept" class="wm-btn-accept">Elfogadom</button>
        </div>
      </div>
    `;

    // Stílusok
    const style = document.createElement('style');
    style.textContent = `
      #wm-cookie-banner {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%) translateY(0);
        width: calc(100% - 2rem);
        max-width: 720px;
        background: #1a1a2e;
        border: 1px solid rgba(124,111,247,0.35);
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        z-index: 9999;
        box-shadow: 0 8px 40px rgba(0,0,0,0.45);
        transition: opacity 0.35s ease, transform 0.35s ease;
        opacity: 0;
        animation: wm-cookie-in 0.4s 0.5s ease forwards;
      }
      @keyframes wm-cookie-in {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      .wm-cookie-inner {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
      .wm-cookie-text {
        flex: 1;
        min-width: 200px;
      }
      .wm-cookie-text strong {
        display: block;
        font-size: 0.95rem;
        color: #fff;
        margin-bottom: 0.35rem;
      }
      .wm-cookie-text p {
        font-size: 0.82rem;
        color: #aaa;
        margin: 0;
        line-height: 1.55;
      }
      .wm-cookie-text a {
        color: #7c6ff7;
        text-decoration: underline;
      }
      .wm-cookie-buttons {
        display: flex;
        gap: 0.65rem;
        flex-shrink: 0;
      }
      .wm-btn-reject {
        padding: 0.55rem 1.1rem;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.15);
        background: transparent;
        color: #aaa;
        font-size: 0.85rem;
        cursor: pointer;
        transition: border-color 0.2s, color 0.2s;
      }
      .wm-btn-reject:hover { border-color: rgba(255,255,255,0.35); color: #fff; }
      .wm-btn-accept {
        padding: 0.55rem 1.25rem;
        border-radius: 8px;
        border: none;
        background: #7c6ff7;
        color: #fff;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
      }
      .wm-btn-accept:hover { background: #6357e0; }
      @media (max-width: 500px) {
        .wm-cookie-inner { flex-direction: column; align-items: flex-start; gap: 1rem; }
        .wm-cookie-buttons { width: 100%; }
        .wm-btn-reject, .wm-btn-accept { flex: 1; text-align: center; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById('wm-cookie-accept').addEventListener('click', () => {
      setCookie(COOKIE_KEY, 'accepted', COOKIE_DAYS);
      removeBanner();
      if (typeof window.loadGoogleAnalytics === 'function') {
        window.loadGoogleAnalytics();
      }
    });

    document.getElementById('wm-cookie-reject').addEventListener('click', () => {
      setCookie(COOKIE_KEY, 'rejected', COOKIE_DAYS);
      removeBanner();
    });
  }

  // Fő logika: ellenőrizzük van-e már döntés
  function init() {
    const consent = getCookie(COOKIE_KEY);
    if (consent === 'accepted') {
      // Már elfogadta korábban → azonnal töltjük az analytics-t
      if (typeof window.loadGoogleAnalytics === 'function') {
        window.loadGoogleAnalytics();
      }
    } else if (consent === null) {
      // Még nincs döntés → megjelenítjük a bannert
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
      } else {
        createBanner();
      }
    }
    // 'rejected' esetén nem töltünk be semmit
  }

  init();
})();
