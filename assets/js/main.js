document.addEventListener("DOMContentLoaded", () => {
  // ===== Mobil menü =====
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("is-open", isOpen);
    });

    // Ha mobilon linkre kattintanak, zárjuk be a menüt
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("open")) {
          navLinks.classList.remove("open");
          navToggle.classList.remove("is-open");
        }
      });
    });
  }

  // ===== Header shrink / box scrollra (jitter fix) =====
  let isHeaderScrolled = false;
  
  const onScrollHeader = () => {
    const y = window.scrollY || window.pageYOffset;
    
    // Ha még NINCS "összehúzva", és 60px alá görgettünk -> húzzuk össze
    if (!isHeaderScrolled && y > 60) {
      isHeaderScrolled = true;
      document.body.classList.add("header-scrolled");
    } 
    // Ha MÁR "össze van húzva", csak akkor nyissuk ki újra, ha szinte teljesen felértünk (10px)
    else if (isHeaderScrolled && y < 10) {
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

  // ===== Custom Cursor Logika (CSAK ASZTALON) =====
  // window.innerWidth >= 768 biztosítja, hogy mobilon/tableten NE induljon el!
  if (window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    
    if (dot && ring) {
      // Változók a "késleltetett" követéshez (Lerp)
      let mouseX = 0;
      let mouseY = 0;
      let ringX = 0;
      let ringY = 0;

      // Az egér pontos helyzetének lekérése
      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // A kis pötty azonnal a kurzor helyére ugrik
        dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      });

      // Animációs ciklus, hogy a gyűrű szépen, lágyan ússzon az egér után
      const animateRing = () => {
        // Mennyire gyorsan kövesse (0.15 = lágy követés)
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
        requestAnimationFrame(animateRing);
      };
      animateRing();

      // Hover effekt a linkeknél és gomboknál
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .nav-toggle');
      
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          ring.classList.add('hovered');
          dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%)) scale(1.5)`;
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('hovered');
          dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%)) scale(1)`;
        });
      });
    }
  }
    // ===== Referencia laptop váltó (csak references.html-en) =====
  const laptopSection = document.querySelector(".references-laptop");
  const screenImg = document.getElementById("reference-screen-image");
  const detail = document.getElementById("reference-detail");
  const tabs = document.querySelectorAll(".references-tab");

  if (laptopSection && screenImg && detail && tabs.length) {
    const refs = {
      energetika: {
        img: "assets/img/ref1.png",
        alt: "Energetikai tanúsító referencia oldal",
        title: "Energetikai tanúsító – letisztult, bizalomépítő felépítés.",
        text:
          "Az energetikai referencia egy átlátható, logikusan felépített oldal: árakkal, szolgáltatási területekkel és folyamattal.",
        bullets: [
          "Ártáblázat, szolgáltatási területek és folyamat egy oldalon.",
          "Levegős tipográfia, jól olvasható mobil nézet.",
          "Erős CTA gombok, egyértelmű kapcsolatfelvétel."
        ]
      },
      klima: {
        img: "assets/img/ref2.png",
        alt: "Klímaszerelő landing oldal",
        title: "Klímaszerelő landing – történet alapú one‑pager.",
        text:
          "A klímás referencia egy görgethető történet: probléma, megoldás, folyamat, garanciák és gyakori kérdések.",
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

      // Kép csere kis fade animációval
      screenImg.style.opacity = "0";
      setTimeout(() => {
        screenImg.src = data.img;
        screenImg.alt = data.alt;
        screenImg.style.transform = "scale(1.02)";
        screenImg.style.opacity = "1";
      }, 180);

      // Szöveg csere
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
        const key = tab.dataset.ref;
        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        renderRef(key);
      });
    });

    // Alapértelmezett referencia
    renderRef("energetika");
  }

});
