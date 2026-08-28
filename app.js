(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFinePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ------------------------------------------------------------------ */
  /* THEME TOGGLE (positive / negative)                                  */
  /* ------------------------------------------------------------------ */
  (function initTheme(){
    var root = document.documentElement;
    var toggle = document.getElementById("themeToggle");
    var label = document.getElementById("themeLabel");
    var stored = null;
    try { stored = localStorage.getItem("jb-theme"); } catch(e){}

    if (stored === "negative" || stored === "positive") {
      root.setAttribute("data-theme", stored);
      label.textContent = stored === "negative" ? "Negative" : "Positive";
    }

    toggle.addEventListener("click", function(){
      var current = root.getAttribute("data-theme");
      var next = current === "negative" ? "positive" : "negative";
      root.setAttribute("data-theme", next);
      label.textContent = next === "negative" ? "Negative" : "Positive";
      try { localStorage.setItem("jb-theme", next); } catch(e){}
    });
  })();

  /* ------------------------------------------------------------------ */
  /* CUSTOM CURSOR                                                       */
  /* ------------------------------------------------------------------ */
  if (isFinePointer && !reduceMotion) {
    var cursor = document.getElementById("cursor");
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    var tx = cx, ty = cy;

    window.addEventListener("mousemove", function(e){
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add("is-active");
    });
    window.addEventListener("mousedown", function(){ cursor.classList.add("is-down"); });
    window.addEventListener("mouseup", function(){ cursor.classList.remove("is-down"); });
    window.addEventListener("mouseleave", function(){ cursor.classList.remove("is-active"); });

    function raf(){
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('[data-cursor="hover"]').forEach(function(el){
      el.addEventListener("mouseenter", function(){ cursor.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function(){ cursor.classList.remove("is-hover"); });
    });
  }

  /* ------------------------------------------------------------------ */
  /* MAGNETIC BUTTONS                                                     */
  /* ------------------------------------------------------------------ */
  if (isFinePointer && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach(function(el){
      var strength = 18;
      el.addEventListener("mousemove", function(e){
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + (mx / r.width) * strength + "px," + (my / r.height) * strength + "px)";
      });
      el.addEventListener("mouseleave", function(){
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* CARD TILT                                                            */
  /* ------------------------------------------------------------------ */
  if (isFinePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function(card){
      var max = 7;
      card.style.transformStyle = "preserve-3d";
      card.addEventListener("mousemove", function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * max * 2;
        var ry = (px - 0.5) * max * 2;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* NAV: scroll state, hide-on-scroll-down, mobile menu                 */
  /* ------------------------------------------------------------------ */
  (function initNav(){
    var nav = document.getElementById("siteNav");
    var burger = document.getElementById("navBurger");
    var links = document.getElementById("navLinks");
    var lastY = window.scrollY;

    function onScroll(){
      var y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 20);
      if (y > lastY && y > 160 && !links.classList.contains("is-open")) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    burger.addEventListener("click", function(){
      var open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* SCROLL REVEAL                                                       */
  /* ------------------------------------------------------------------ */
  (function initReveal(){
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function(el){ el.classList.add("is-visible"); });
      return;
    }
    var groups = {};
    items.forEach(function(el){
      var parent = el.closest("section, .hero");
      var key = parent ? parent.id || "default" : "default";
      groups[key] = groups[key] || 0;
    });

    var counters = {};
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var el = entry.target;
          var parent = el.closest("section, .hero");
          var key = parent ? parent.id || "default" : "default";
          counters[key] = counters[key] || 0;
          var delay = Math.min(counters[key] * 70, 420);
          counters[key]++;
          el.style.transitionDelay = delay + "ms";
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function(el){ io.observe(el); });
  })();

  /* ------------------------------------------------------------------ */
  /* PROJECT MODAL                                                        */
  /* ------------------------------------------------------------------ */
  (function initModal(){
    var data = {
      greatharvest: { tag: "Brand Identity — 2026", title: "Great Harvest", role: "Brand & Packaging Direction", tools: "Illustrator, Photoshop", year: "2026",
        desc: "A soft-drink brand built on classic diner nostalgia for a college-age audience — flavourful, secret-recipe positioning balanced with a modern, business-ready identity system.",
        href: "https://www.behance.net/gallery/242573209/Great-Harvest-Soft-Drink-Brand-Identity" },
      mysoresandal: { tag: "Brand Refresh — 2026", title: "Mysore Sandal", role: "Identity Direction", tools: "Illustrator, Photoshop", year: "2026",
        desc: "A modern reimagining of a heritage soap brand — keeping the recognition equity of the original while bringing the visual language up to date.",
        href: "https://www.behance.net/gallery/245840141/Mysore-Sandal-A-Modern-Heritage-Reimagining" },
      campuspulse: { tag: "Poster Series — 2026", title: "Campus Pulse", role: "Concept & Layout", tools: "Illustrator, InDesign", year: "2026",
        desc: "A collection of event posters for college campus events — built for fast recognition on crowded noticeboards and social feeds alike.",
        href: "https://www.behance.net/gallery/246198043/Campus-Pulse-A-Collection-of-College-Event-Posters" },
      systemcore: { tag: "Ad Campaign — 2026", title: "System Core", role: "Campaign Design", tools: "Photoshop, Illustrator", year: "2026",
        desc: "A tech-focused ad campaign built around a confident, systems-driven visual language for a product-first audience.",
        href: "https://www.behance.net/gallery/246199369/System-Core-Tech-Campaigns" },
      jewelry: { tag: "Social Campaign — 2026", title: "Elegant Jewelry", role: "Art Direction", tools: "Photoshop, Illustrator", year: "2026",
        desc: "A social media poster series for a jewelry brand — refined, image-led compositions designed to hold up at thumbnail size.",
        href: "https://www.behance.net/gallery/246157791/Elegant-Jewelry-Social-Media-Posters" },
      grocery: { tag: "Retail Campaign — 2026", title: "Grocery Campaigns", role: "Promotion Design", tools: "Photoshop, Illustrator", year: "2026",
        desc: "A high-impact retail promotion series designed to move fast and communicate value at a glance.",
        href: "https://www.behance.net/gallery/246199157/Grocery-Campaigns-High-Impact-Retail-Promotion-Series" }
    };

    var modal = document.getElementById("projectModal");
    var backdrop = document.getElementById("modalBackdrop");
    var closeBtn = document.getElementById("modalClose");
    var cards = document.querySelectorAll(".work-card");
    var lastFocused = null;

    function openModal(key){
      var d = data[key];
      if (!d) return;
      document.getElementById("modalTag").textContent = d.tag;
      document.getElementById("modalTitle").textContent = d.title;
      document.getElementById("modalDesc").textContent = d.desc;
      document.getElementById("modalRole").textContent = d.role;
      document.getElementById("modalTools").textContent = d.tools;
      document.getElementById("modalYear").textContent = d.year;
      var link = document.getElementById("modalLink");
      if (link) link.href = d.href || "#";
      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal(){
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    cards.forEach(function(card){
      card.addEventListener("click", function(){ openModal(card.getAttribute("data-project")); });
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card.getAttribute("data-project")); }
      });
    });

    backdrop.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  })();

  /* ------------------------------------------------------------------ */
  /* COPY EMAIL                                                           */
  /* ------------------------------------------------------------------ */
  (function initCopyEmail(){
    var btn = document.getElementById("copyEmail");
    var hint = document.getElementById("copyHint");
    if (!btn) return;
    btn.addEventListener("click", function(){
      var email = btn.getAttribute("data-email");
      var done = function(){
        var original = hint.textContent;
        hint.textContent = "copied ✓";
        setTimeout(function(){ hint.textContent = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function(){
          window.location.href = "mailto:" + email;
        });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  })();

  /* ------------------------------------------------------------------ */
  /* BACK TO TOP                                                         */
  /* ------------------------------------------------------------------ */
  (function initBackToTop(){
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    btn.addEventListener("click", function(){
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* SCROLL CUE                                                           */
  /* ------------------------------------------------------------------ */
  (function initScrollCue(){
    var cue = document.getElementById("scrollCue");
    if (!cue) return;
    cue.addEventListener("click", function(){
      var target = document.getElementById("work");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  })();

})();
