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
      // Lefelé csúszik ki a képernyő alján
      banner.style.transform = 'translateY(100%)';
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
          <strong>Sütik beállítása</strong>
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
        bottom: 0;
        left: 0;
        width: 100%;
        background: #413a79;
        border-top: 1px solid rgba(13, 10, 41, 0.72);
        padding: 0.8rem 1.5rem;
        z-index: 9999;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
        transition: opacity 0.35s ease, transform 0.35s ease;
        opacity: 0;
        transform: translateY(100%);
        animation: wm-cookie-in 0.4s 0.2s ease forwards;
        box-sizing: border-box;
      }
      @keyframes wm-cookie-in {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .wm-cookie-inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
      .wm-cookie-text {
        flex: 1;
        min-width: 200px;
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .wm-cookie-text strong {
        font-size: 0.95rem;
        color: #fff;
        white-space: nowrap;
      }
      .wm-cookie-text p {
        font-size: 0.85rem;
        color: #e3e3e3;
        margin: 0;
        line-height: 1.4;
      }
      .wm-cookie-text a {
        color: #b4b8e7;
        text-decoration: underline;
      }
      .wm-cookie-buttons {
        display: flex;
        gap: 0.65rem;
        flex-shrink: 0;
      }
      .wm-btn-reject {
        padding: 0.45rem 1rem;
        border-radius: 6px;
        border: 1px solid rgba(212, 108, 108, 0.77);
        background: transparent;
        color: #fefefe;
        font-size: 0.85rem;
        cursor: pointer;
        transition: border-color 0.2s, color 0.2s;
      }
      .wm-btn-reject:hover { border-color: rgba(154, 98, 98, 0.69); color: #fff; }
      .wm-btn-accept {
        padding: 0.45rem 1.25rem;
        border-radius: 6px;
        border: none;
        background: #64ae74;
        color: #fff;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
      }
      .wm-btn-accept:hover { background: #2e8f48; }

      @media (max-width: 768px) {
        #wm-cookie-banner { padding: 1rem; }
        .wm-cookie-inner { flex-direction: column; align-items: stretch; gap: 1rem; }
        .wm-cookie-text { flex-direction: column; align-items: flex-start; gap: 0.3rem; }
        .wm-cookie-buttons { justify-content: flex-end; width: 100%; }
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

  function init() {
    const consent = getCookie(COOKIE_KEY);
    if (consent === 'accepted') {
      if (typeof window.loadGoogleAnalytics === 'function') {
        window.loadGoogleAnalytics();
      }
    } else if (consent === null) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
      } else {
        createBanner();
      }
    }
  }

  init();
})();
