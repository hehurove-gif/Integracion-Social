/* Comparador de candidaturas (CDMX).
   Lee /assets/data/comparador.json y dibuja la tabla comparativa.
   - "real": datos verificados por el equipo editorial (hoy vacío: aún no hay candidaturas registradas).
   - "ejemplo": datos FICTICIOS para demostrar el formato.
   Todo el texto se inserta con textContent (nunca innerHTML). */
(function () {
  "use strict";

  var DATA_URL = "/assets/data/comparador.json";

  var form = document.getElementById("compare-form");
  var selEleccion = document.getElementById("sel-eleccion");
  var selTema = document.getElementById("sel-tema");
  var chkEjemplo = document.getElementById("chk-ejemplo");
  var out = document.getElementById("compare-output");
  var solOut = document.getElementById("requests-output");
  if (!form || !selEleccion || !selTema || !chkEjemplo || !out || !solOut) return;

  var data = null;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function byText(a, b) {
    return a.nombre.localeCompare(b.nombre, "es");
  }

  function notProvided(v) {
    return v == null || v === "" ? "No proporcionado" : v;
  }

  function badge(text, kind) {
    return el("span", { class: "badge" + (kind ? " " + kind : ""), text: text });
  }

  function populateSelects() {
    data.elecciones.forEach(function (e) {
      selEleccion.appendChild(el("option", { value: e.id, text: e.nombre }));
    });
    selTema.appendChild(el("option", { value: "todos", text: "Todos los temas" }));
    data.temas.forEach(function (t) {
      selTema.appendChild(el("option", { value: t.id, text: t.nombre }));
    });
  }

  function currentSet() {
    return chkEjemplo.checked ? data.ejemplo : data.real;
  }

  function dlItem(dl, label, value) {
    dl.appendChild(el("dt", { text: label }));
    dl.appendChild(el("dd", { text: value }));
  }

  function buildFicha(p) {
    var dl = el("dl");
    dlItem(dl, "Texto original", notProvided(p.texto_original));
    dlItem(dl, "Acción propuesta", notProvided(p.accion));
    dlItem(dl, "Competencia del cargo", (data.competencias[p.competencia] || "Sin clasificar") +
      (p.competencia_nota ? ". " + p.competencia_nota : ""));
    dlItem(dl, "Instituciones que intervendrían", notProvided(p.instituciones));
    dlItem(dl, "Presupuesto o fuente de financiamiento", notProvided(p.presupuesto));
    dlItem(dl, "Plazo", notProvided(p.plazo));
    dlItem(dl, "Indicador de avance", notProvided(p.indicador));

    var fuente = p.fuente || {};
    var fuenteTxt = notProvided(fuente.titulo) + (fuente.fecha_consulta ? " · consultado: " + fuente.fecha_consulta : "");
    dl.appendChild(el("dt", { text: "Fuente" }));
    var dd = el("dd");
    if (fuente.url) {
      dd.appendChild(el("a", { href: fuente.url, rel: "noopener noreferrer", text: fuenteTxt }));
    } else {
      dd.appendChild(document.createTextNode(fuenteTxt));
    }
    dl.appendChild(dd);

    return el("div", { class: "ficha" }, [dl]);
  }

  function buildCell(c, tema) {
    var props = currentSet().propuestas.filter(function (p) {
      return p.candidatura === c.id && p.tema === tema.id;
    });

    if (!props.length) {
      var msg = c.estado_info === "sin-respuesta"
        ? "Información no disponible: solicitud sin respuesta al vencer el plazo."
        : c.estado_info === "pendiente"
          ? "Información pendiente: solicitud vigente, aún sin respuesta."
          : "No se ha registrado información sobre este tema.";
      return el("td", { class: "empty", text: msg });
    }

    var td = el("td");
    props.forEach(function (p) {
      td.appendChild(el("p", { text: p.resumen }));
      td.appendChild(el("div", { class: "cell-badges" }, [
        badge(data.competencias[p.competencia] || "Sin clasificar", ""),
        badge(data.procedencias[p.procedencia] || p.procedencia, "info"),
        badge("Estado: " + (data.estados_editoriales[p.estado] || p.estado),
          p.estado === "verificada" ? "ok" : (p.estado === "no-verificable" || p.estado === "incompleta") ? "warn" : "")
      ]));
      var details = el("details", null, [
        el("summary", { text: "Ver ficha completa" }),
        buildFicha(p)
      ]);
      td.appendChild(details);
    });
    return td;
  }

  function renderRequests(eleccionId) {
    clear(solOut);
    var set = currentSet();
    var rows = set.solicitudes.filter(function (s) { return s.eleccion === eleccionId; });
    if (!rows.length) {
      solOut.appendChild(el("p", { class: "notice", text: "Todavía no hay solicitudes de información registradas para esta elección." }));
      return;
    }
    var nombres = {};
    set.candidaturas.forEach(function (c) { nombres[c.id] = c.nombre; });

    var thead = el("thead", null, [el("tr", null, [
      el("th", { scope: "col", text: "Candidatura" }),
      el("th", { scope: "col", text: "Fecha de solicitud" }),
      el("th", { scope: "col", text: "Medio" }),
      el("th", { scope: "col", text: "Plazo" }),
      el("th", { scope: "col", text: "Resultado" })
    ])]);
    var tbody = el("tbody");
    rows.slice().sort(function (a, b) {
      return (nombres[a.candidatura] || "").localeCompare(nombres[b.candidatura] || "", "es");
    }).forEach(function (s) {
      tbody.appendChild(el("tr", null, [
        el("th", { scope: "row", text: nombres[s.candidatura] || s.candidatura }),
        el("td", { text: s.fecha }),
        el("td", { text: s.medio }),
        el("td", { text: s.plazo }),
        el("td", { text: s.resultado })
      ]));
    });
    var table = el("table", { class: "data" }, [
      el("caption", { text: "Mismo procedimiento, medio y plazo para todas las candidaturas de la elección." }),
      thead,
      tbody
    ]);
    solOut.appendChild(el("div", { class: "table-wrap" }, [table]));
  }

  function render() {
    clear(out);
    var eleccion = data.elecciones.filter(function (e) { return e.id === selEleccion.value; })[0];
    if (!eleccion) return;

    // Información real sobre el cargo (no es dato de ejemplo).
    out.appendChild(el("div", { class: "election-info" }, [
      el("p", null, [el("strong", { text: "Cargo: " }), eleccion.cargo]),
      el("p", null, [el("strong", { text: "Qué hace: " }), eleccion.hace]),
      el("p", null, [el("strong", { text: "De quién depende para cumplir propuestas: " }), eleccion.necesita]),
      el("p", null, [el("strong", { text: "Ámbito: " }), eleccion.ambito + " "]),
      el("p", { class: "small" }, [
        "Más sobre cada cargo en ",
        el("a", { href: "/aprende/cargos/", text: "Instituciones y cargos" }),
        "."
      ])
    ]));

    var set = currentSet();
    var cands = set.candidaturas.filter(function (c) { return c.eleccion === eleccion.id; }).sort(byText);

    if (!cands.length) {
      var texto = chkEjemplo.checked
        ? "No hay datos de ejemplo para esta elección. Prueba con «Alcaldía» o «Diputación federal»."
        : "Todavía no hay candidaturas registradas para esta elección. " + data.registro_candidaturas;
      out.appendChild(el("div", { class: "notice" }, [el("p", { text: texto })]));
      renderRequests(eleccion.id);
      return;
    }

    if (chkEjemplo.checked) {
      out.appendChild(el("div", { class: "notice" }, [
        el("p", null, [
          badge("Datos ficticios", "demo"),
          " " + data.meta.aviso_ejemplo
        ])
      ]));
    }

    // Temas con al menos una propuesta en esta elección (o el tema elegido).
    var temasConDatos = {};
    set.propuestas.forEach(function (p) {
      var c = cands.filter(function (x) { return x.id === p.candidatura; })[0];
      if (c) temasConDatos[p.tema] = true;
    });
    var temas = data.temas.filter(function (t) {
      return selTema.value === "todos" ? temasConDatos[t.id] : t.id === selTema.value;
    });

    var headRow = el("tr", null, [el("th", { scope: "col", text: "Dato" })]);
    cands.forEach(function (c) { headRow.appendChild(el("th", { scope: "col", text: c.nombre })); });

    var tbody = el("tbody");
    function simpleRow(label, fn) {
      var tr = el("tr", null, [el("th", { scope: "row", text: label })]);
      cands.forEach(function (c) { tr.appendChild(el("td", { text: fn(c) })); });
      tbody.appendChild(tr);
    }
    simpleRow("Partido que postula", function (c) { return c.partido || "Candidatura sin partido"; });
    simpleRow("Coalición o candidatura común", function (c) { return c.coalicion || "No aplica"; });
    simpleRow("Plataforma electoral registrada", function (c) { return notProvided(c.plataforma); });
    simpleRow("Estado de la información", function (c) { return data.estados_info[c.estado_info] || c.estado_info; });

    if (!temas.length) {
      var tr = el("tr", null, [el("th", { scope: "row", text: "Propuestas" })]);
      var td = el("td", { class: "empty", text: "No hay propuestas registradas para este tema." });
      td.setAttribute("colspan", String(cands.length));
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

    temas.forEach(function (t) {
      var tr = el("tr", null, [el("th", { scope: "row", text: t.nombre })]);
      cands.forEach(function (c) { tr.appendChild(buildCell(c, t)); });
      tbody.appendChild(tr);
    });

    var table = el("table", { class: "data" }, [
      el("caption", { text: "Candidaturas en orden alfabético. Una propuesta registrada no implica que sea viable ni correcta; la columna de competencia solo indica qué autoridades intervendrían." }),
      el("thead", null, [headRow]),
      tbody
    ]);
    out.appendChild(el("div", { class: "table-wrap" }, [table]));
    renderRequests(eleccion.id);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); });
  [selEleccion, selTema, chkEjemplo].forEach(function (c) { c.addEventListener("change", render); });

  fetch(DATA_URL, { headers: { Accept: "application/json" } })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (json) {
      data = json;
      populateSelects();
      // Estado inicial: elección con datos de ejemplo.
      selEleccion.value = "alcaldia";
      render();
    })
    .catch(function () {
      clear(out);
      out.appendChild(el("div", { class: "notice" }, [
        el("p", { text: "No se pudieron cargar los datos del comparador. Recarga la página o inténtalo más tarde." })
      ]));
    });
})();
