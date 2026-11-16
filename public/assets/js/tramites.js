/* Filtro de trámites por texto y categoría (sin dependencias). */
(function () {
  "use strict";

  var search = document.getElementById("filtro-texto");
  var category = document.getElementById("filtro-categoria");
  var list = document.getElementById("lista-tramites");
  var count = document.getElementById("conteo");
  var empty = document.getElementById("sin-resultados");
  if (!search || !category || !list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll("[data-nombre]"));

  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function apply() {
    var q = normalize(search.value.trim());
    var cat = category.value;
    var visible = 0;

    items.forEach(function (item) {
      var haystack = normalize(item.getAttribute("data-nombre") + " " + item.getAttribute("data-resumen"));
      var matchText = !q || haystack.indexOf(q) !== -1;
      var matchCat = !cat || item.getAttribute("data-categoria") === cat;
      var show = matchText && matchCat;
      item.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = visible + (visible === 1 ? " trámite encontrado" : " trámites encontrados");
    if (empty) empty.hidden = visible !== 0;
  }

  var form = document.getElementById("form-filtros");
  if (form) form.addEventListener("submit", function (event) { event.preventDefault(); });

  search.addEventListener("input", apply);
  category.addEventListener("change", apply);
  apply();
})();
