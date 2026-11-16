/* Comportamientos del sitio: menú móvil, carrusel y niveles de lectura.
   Sin dependencias. Todo el contenido sigue siendo legible sin JavaScript. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Carrusel ---------- */
  // Sin reproducción automática: la persona decide cuándo avanzar.
  Array.prototype.forEach.call(document.querySelectorAll("[data-carousel]"), function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
    var controls = root.querySelector(".carousel-controls");
    if (slides.length < 2 || !controls) return;

    var prev = controls.querySelector("[data-prev]");
    var next = controls.querySelector("[data-next]");
    var dots = controls.querySelector(".carousel-dots");
    var status = controls.querySelector(".carousel-status");
    var current = 0;
    var dotButtons = [];

    slides.forEach(function (slide, i) {
      slide.setAttribute("aria-label", (i + 1) + " de " + slides.length);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carousel-dot";
      b.setAttribute("aria-label", "Ir a la diapositiva " + (i + 1));
      b.addEventListener("click", function () { show(i); });
      dots.appendChild(b);
      dotButtons.push(b);
    });

    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle("is-active", n === current);
      });
      dotButtons.forEach(function (b, n) {
        if (n === current) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
      if (status) status.textContent = (current + 1) + " de " + slides.length;
    }

    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(current - 1); }
      else if (e.key === "ArrowRight") { show(current + 1); }
    });

    show(0);
  });

  /* ---------- Niveles de lectura (básico → intermedio → práctico) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-levels]"), function (root) {
    var sections = Array.prototype.slice.call(root.querySelectorAll(".level"));
    var order = sections.map(function (s) { return s.getAttribute("data-level"); });
    var switcher = root.querySelector(".level-switch");
    var buttons = switcher ? Array.prototype.slice.call(switcher.querySelectorAll("[data-level-btn]")) : [];
    var gos = Array.prototype.slice.call(root.querySelectorAll("[data-go]"));

    function setLevel(idx) {
      sections.forEach(function (s, i) { s.hidden = i > idx; });
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(order.indexOf(b.getAttribute("data-level-btn")) === idx));
      });
      gos.forEach(function (g) {
        g.hidden = order.indexOf(g.getAttribute("data-go")) <= idx;
      });
    }

    function goTo(id) {
      var idx = order.indexOf(id);
      if (idx < 0) return;
      setLevel(idx);
      var heading = sections[idx].querySelector("h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { setLevel(order.indexOf(b.getAttribute("data-level-btn"))); });
    });
    gos.forEach(function (g) {
      g.addEventListener("click", function () { goTo(g.getAttribute("data-go")); });
    });

    if (switcher) switcher.hidden = false;
    var fromHash = order.indexOf(window.location.hash.replace("#", ""));
    setLevel(fromHash >= 0 ? fromHash : 0);
  });
})();
