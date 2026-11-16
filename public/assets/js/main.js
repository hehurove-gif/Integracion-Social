/* Integración Social — MVP (no oficial)
   Menú móvil, año del pie de página y formulario de contacto (demo). */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // Menú móvil
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Año en el pie de página
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // Formulario de contacto (demo: no envía información a ningún servidor)
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.hidden = false;
      status.textContent =
        "Gracias. Este es un sitio de demostración: tu mensaje no se envió ni se guardó en ningún lugar.";
      form.reset();
      status.focus();
    });
  }
})();
