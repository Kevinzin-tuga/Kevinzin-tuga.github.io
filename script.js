(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const numberFormat = new Intl.NumberFormat("pt-PT");
  const formatNumber = value =>
    value === null || value === undefined || value === "" || !Number.isFinite(Number(value))
      ? "—"
      : numberFormat.format(Number(value));

  const tabButtons = $$(".nav-tab");
  const panels = $$(".tab-panel");
  const nav = $(".nav-right");
  const menu = $("#mobile-menu");

  function openTab(name) {
    const valid = tabButtons.some(button => button.dataset.tab === name);
    if (!valid) return;

    tabButtons.forEach(button => {
      const active = button.dataset.tab === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });

    panels.forEach(panel => {
      const active = panel.id === "tab-" + name;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });

    nav?.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
  }

  tabButtons.forEach(button =>
    button.addEventListener("click", () => openTab(button.dataset.tab))
  );

  $$("[data-go]").forEach(button =>
    button.addEventListener("click", () => openTab(button.dataset.go))
  );

  $$("[data-tab-link]").forEach(link =>
    link.addEventListener("click", event => {
      event.preventDefault();
      openTab(link.dataset.tabLink);
    })
  );

  const initialTab = location.hash.slice(1);
  if (tabButtons.some(button => button.dataset.tab === initialTab)) {
    openTab(initialTab);
  }

  menu?.addEventListener("click", () => {
    const expanded = nav?.classList.toggle("open") ?? false;
    menu.setAttribute("aria-expanded", String(expanded));
  });

  const year = $("#ano");
  if (year) year.textContent = String(new Date().getFullYear());

  const filterButtons = $$("[data-filter]");
  const projectCards = $$(".project[data-category]");
  const emptyMessage = $("#filter-empty");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      let visibleCount = 0;
      projectCards.forEach(card => {
        const visible =
          button.dataset.filter === "all" ||
          card.dataset.category === button.dataset.filter;
        card.hidden = !visible;
        if (visible) visibleCount++;
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    });
  });

  const setText = (selector, value) => {
    const element = $(selector);
    if (element) element.textContent = value;
  };

  fetch("data/curseforge.json", { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Não foi possível carregar os dados.");
      return response.json();
    })
    .then(data => {
      setText("#cf-followers", formatNumber(data.followers));
      setText("#cf-downloads", formatNumber(data.downloads));
      setText("#cf-projects", formatNumber(data.projects));

      const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
      const validDate = updatedAt && !Number.isNaN(updatedAt.getTime());
      setText(
        "#cf-updated",
        validDate
          ? "Atualizado " + new Intl.DateTimeFormat("pt-PT", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(updatedAt)
          : "Dados ainda não disponíveis"
      );
    })
    .catch(() => setText("#cf-updated", "Dados temporariamente indisponíveis"));
})();
