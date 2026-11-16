/* Seguimiento de solicitudes — DEMO.
   Los folios de abajo son ficticios y viven en este archivo.
   Para un sistema real, sustituir `buscarFolio` por una llamada a un API. */
(function () {
  "use strict";

  var ETAPAS = ["Recibida", "En revisión", "Resolución", "Entregada"];

  var FOLIOS_DEMO = {
    "IS-2026-0001": {
      tramite: "Solicitud de apoyo alimentario",
      etapa: 1,
      estado: "En revisión",
      tono: "warn",
      nota: "Tu solicitud está siendo revisada. No necesitas hacer nada por ahora.",
      actualizado: "2026-11-10"
    },
    "IS-2026-0002": {
      tramite: "Credencial para personas con discapacidad",
      etapa: 3,
      estado: "Entregada",
      tono: "ok",
      nota: "Tu credencial fue entregada. Conserva tu comprobante.",
      actualizado: "2026-11-05"
    },
    "IS-2026-0003": {
      tramite: "Registro al padrón de beneficiarios",
      etapa: 1,
      estado: "Faltan documentos",
      tono: "bad",
      nota: "Falta adjuntar un comprobante de domicilio vigente. Acude a ventanilla para completarlo.",
      actualizado: "2026-11-12"
    }
  };

  var form = document.getElementById("form-seguimiento");
  var input = document.getElementById("folio");
  var out = document.getElementById("resultado");
  if (!form || !input || !out) return;

  function buscarFolio(folio) {
    return FOLIOS_DEMO[folio] || null;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function render(folio, data) {
    out.textContent = "";
    out.hidden = false;

    if (!data) {
      var notice = el("div", "notice");
      notice.appendChild(el("p", "", "No encontramos el folio " + folio + ". Revisa que esté escrito igual que en tu comprobante."));
      out.appendChild(notice);
      return;
    }

    out.appendChild(el("h2", "", data.tramite));

    var meta = el("p");
    meta.appendChild(el("span", "badge " + data.tono, data.estado));
    meta.appendChild(document.createTextNode(" Folio " + folio + " · Actualizado el " + data.actualizado));
    out.appendChild(meta);
    out.appendChild(el("p", "", data.nota));

    var timeline = el("ol", "timeline");
    ETAPAS.forEach(function (etapa, i) {
      var li = el("li", i < data.etapa ? "done" : i === data.etapa ? "current" : "", etapa);
      timeline.appendChild(li);
    });
    out.appendChild(timeline);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var folio = input.value.trim().toUpperCase();
    if (!folio) {
      input.focus();
      return;
    }
    render(folio, buscarFolio(folio));
    out.focus();
  });
})();
