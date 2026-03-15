document.addEventListener("DOMContentLoaded", () => {

  // ===== Aktuális oldal felismerése =====
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  const isCurrent = (href) => {
    const linkFile = href ? href.split('/').pop() : '';
    return (
      linkFile === currentFile ||
      (currentFile === '' && linkFile === 'index.html')
    );
  };

  // ===== Fejléc – aktuális oldal linkje span-ra cserélve (nem kattintható) =====
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (isCurrent(link.getAttribute('href'))) {
      const span = document.createElement('span');
      span.className = link.className + ' is-active';
      span.setAttribute('aria-current', 'page');
      span.textContent = link.textContent;
      link.parentNode.replaceChild(span, link);
    }
  });

  // ===== Lábléc – aktuális oldal linkje span-ra cserélve =====
  document.querySelectorAll('.footer-nav a').forEach(link => {
    if (isCurrent(link.getAttribute('href'))) {
      const span = document.createElement('span');
      span.className = 'footer-nav-current';
      span.setAttribute('aria-current', 'page');
      span.textContent = link.textContent;
      link.parentNode.replaceChild(span, link);
    }
  });

  // ===== Mobil menü =====
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("is-open", isOpen);
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("open")) {
          navLinks.classList.remove("open");
          navToggle.classList.remove("is-open");
        }
      });
    });
  }

  // ===== Header shrink scrollra =====
  let isHeaderScrolled = false;
  const onScrollHeader = () => {
    const y = window.scrollY || window.pageYOffset;
    if (!isHeaderScrolled && y > 60) {
      isHeaderScrolled = true;
      document.body.classList.add("header-scrolled");
    } else if (isHeaderScrolled && y < 10) {
      isHeaderScrolled = false;
      document.body.classList.remove("header-scrolled");
    }
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  // ===== Laptop scroll-vezérelt nyitás =====
  const laptopLid = document.getElementById("laptop-lid");
  const laptopWrapper = document.querySelector(".laptop-wrapper");

  if (laptopLid && laptopWrapper) {
    const updateLidAngle = () => {
      const rect = laptopWrapper.getBoundingClientRect();
      const windowH = window.innerHeight;
      const start = windowH * 0.95;
      const end   = windowH * 0.3;
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(1, Math.max(0, progress));
      const angle = 82 - (82 * progress);
      laptopLid.style.transform = `rotateX(${angle}deg)`;
    };
    window.addEventListener("scroll", updateLidAngle, { passive: true });
    updateLidAngle();
  }

  // ===== Referencia váltó =====
  const screenImg = document.getElementById("reference-screen-image");
  const screenLink = document.getElementById("laptop-screen-link");
  const detail = document.getElementById("reference-detail");
  const tabs = document.querySelectorAll(".references-tab");

  if (screenImg && detail && tabs.length) {
    const refs = {
      energetika: {
        img: "assets/img/ref1.jpg",
        alt: "Energetikai tanúsító referencia oldal",
        url: "https://energetikaitanusito1.hu",
        title: "Energetikai tanúsító – letisztult, bizalomépítő felépítés.",
        text: "Az energetikai referencia egy átlátható, logikusan felépített oldal: árakkal, szolgáltatási területekkel és folyamattal.",
        bullets: [
          "Ártáblázat, szolgáltatási területek és folyamat egy oldalon.",
          "Levegős tipográfia, jól olvasható mobil nézet.",
          "Erős CTA gombok, egyértelmű kapcsolatfelvétel."
        ]
      },
      klima: {
        img: "assets/img/ref2.jpg",
        alt: "Klímaszerelő landing oldal",
        url: "https://klimamed.hu",
        title: "Klímaszerelő landing – történet alapú one-pager.",
        text: "A klímás referencia egy görgethető történet: probléma, megoldás, folyamat, garanciák és gyakori kérdések.",
        bullets: [
          "Hero rész világos üzenettel és fókuszban az ajánlatkérés.",
          "Szolgáltatás szekciók ikonokkal és rövid leírással.",
          "Lépésről lépésre bemutatott folyamat, bizalomépítő tartalommal."
        ]
      }
    };

    const renderRef = (key) => {
      const data = refs[key];
      if (!data) return;
      screenImg.style.opacity = "0";
      setTimeout(() => {
        screenImg.src = data.img;
        screenImg.alt = data.alt;
        screenImg.style.opacity = "1";
      }, 200);
      if (screenLink) {
        screenLink.href = data.url;
        screenLink.setAttribute("aria-label", data.title + " megnyitása");
      }
      detail.querySelector(".references-detail-title").textContent = data.title;
      detail.querySelector(".references-detail-text").textContent = data.text;
      const list = detail.querySelector(".references-detail-list");
      list.innerHTML = "";
      data.bullets.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        renderRef(tab.dataset.ref);
      });
    });

    renderRef("energetika");
  }

  // ===== Custom Cursor =====
  if (window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768) {
    const dot = document.querySelector(".cursor-dot");
    if (dot) {
      let mouseX = 0, mouseY = 0;
      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      });
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .nav-toggle');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%)) scale(1.5)`;
        });
        el.addEventListener('mouseleave', () => {
          dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%)) scale(1)`;
        });
      });
    }
  }

});
