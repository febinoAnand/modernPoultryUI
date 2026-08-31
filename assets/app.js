/* ============================================================
   Shared app behavior: auth guard, sidebar toggle, logout,
   active-nav highlighting. Included on every protected page.
   ============================================================ */

(function () {
  "use strict";

  var SESSION_KEY = "ui_session";

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = "index.html";
    }
  }

  function login(email, orgId) {
    sessionStorage.setItem(SESSION_KEY, "true");
    sessionStorage.setItem("ui_user_email", email);
    if (orgId) sessionStorage.setItem("ui_org_id", orgId);
    else sessionStorage.removeItem("ui_org_id");
  }

  function getOrgId() {
    return sessionStorage.getItem("ui_org_id") || "";
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("ui_user_email");
    sessionStorage.removeItem("ui_org_id");
    window.location.href = "index.html";
  }

  function initSidebar() {
    var sidebar = document.querySelector(".sidebar");
    var backdrop = document.querySelector(".sidebar-backdrop");
    var toggleBtn = document.querySelector(".menu-toggle");

    if (!sidebar || !toggleBtn) return;

    function open() {
      sidebar.classList.add("open");
      if (backdrop) backdrop.classList.add("show");
    }

    function close() {
      sidebar.classList.remove("open");
      if (backdrop) backdrop.classList.remove("show");
    }

    toggleBtn.addEventListener("click", function () {
      sidebar.classList.contains("open") ? close() : open();
    });

    if (backdrop) backdrop.addEventListener("click", close);
  }

  function initLogout() {
    var logoutBtns = document.querySelectorAll("[data-logout]");
    logoutBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        logout();
      });
    });
  }

  function initUserBadge() {
    var email = sessionStorage.getItem("ui_user_email") || "vijay@gmail";
    var nameEls = document.querySelectorAll("[data-user-name]");
    var initialEl = document.querySelector("[data-user-initial]");
    var label = email.split("@")[0];
    var display = label.charAt(0).toUpperCase() + label.slice(1);
    nameEls.forEach(function (el) { el.textContent = display; });
    if (initialEl) initialEl.textContent = label.charAt(0).toUpperCase();
  }

  function positionActionMenu(id) {
    var trigger = document.querySelector('[data-menu-toggle="' + id + '"]');
    var menu = document.querySelector('[data-menu="' + id + '"]');
    if (!trigger || !menu) return;

    var triggerRect = trigger.getBoundingClientRect();
    var menuRect = menu.getBoundingClientRect();
    var viewportW = window.innerWidth;
    var viewportH = window.innerHeight;
    var gap = 6;

    var top;
    if (viewportH - triggerRect.bottom < menuRect.height + gap + 8 && triggerRect.top > menuRect.height + gap) {
      top = triggerRect.top - menuRect.height - gap;
    } else {
      top = triggerRect.bottom + gap;
    }

    var left = triggerRect.right - menuRect.width;
    if (left < 8) left = 8;
    if (left + menuRect.width > viewportW - 8) left = viewportW - menuRect.width - 8;

    menu.style.top = top + "px";
    menu.style.left = left + "px";
  }

  /* ---------------- Searchable combobox (trader/product pickers etc.) ---------------- */

  function initCombobox(opts) {
    var filtered = [];
    var activeIndex = -1;

    function position() {
      var rect = opts.wrap.getBoundingClientRect();
      opts.panel.style.left = rect.left + "px";
      opts.panel.style.top = (rect.bottom + 6) + "px";
      opts.panel.style.width = rect.width + "px";
    }

    function renderOptions() {
      if (!filtered.length) {
        opts.panel.innerHTML = '<div class="combo-empty">No matches found</div>';
        return;
      }
      opts.panel.innerHTML = filtered.map(function (item, i) {
        return '<div class="combo-option' + (i === activeIndex ? ' active' : '') + '" data-idx="' + i + '">' +
          '<div class="combo-avatar">' + opts.getInitial(item) + '</div>' +
          '<div class="combo-text"><span class="combo-title">' + opts.getLabel(item) + '</span><span class="combo-sub">' + opts.getSub(item) + '</span></div>' +
        '</div>';
      }).join("");
    }

    function filter() {
      var term = opts.input.value.trim().toLowerCase();
      filtered = opts.items.filter(function (item) { return opts.matches(item, term); });
      activeIndex = -1;
      renderOptions();
    }

    function open() {
      filter();
      position();
      opts.panel.classList.add("show");
    }

    function close() {
      opts.panel.classList.remove("show");
      activeIndex = -1;
    }

    function select(item) {
      opts.onSelect(item);
      close();
    }

    opts.input.addEventListener("focus", open);
    opts.input.addEventListener("input", open);

    opts.input.addEventListener("keydown", function (e) {
      if (!opts.panel.classList.contains("show")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        renderOptions();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderOptions();
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && filtered[activeIndex]) {
          e.preventDefault();
          select(filtered[activeIndex]);
        }
      } else if (e.key === "Escape") {
        close();
      }
    });

    opts.panel.addEventListener("mousedown", function (e) {
      var optEl = e.target.closest(".combo-option");
      if (!optEl) return;
      e.preventDefault();
      var idx = parseInt(optEl.getAttribute("data-idx"), 10);
      select(filtered[idx]);
    });

    document.addEventListener("click", function (e) {
      if (!opts.wrap.contains(e.target) && !opts.panel.contains(e.target)) close();
    });
    window.addEventListener("scroll", function () { if (opts.panel.classList.contains("show")) position(); }, true);
    window.addEventListener("resize", function () { if (opts.panel.classList.contains("show")) position(); });

    return {
      close: close,
      setItems: function (items) { opts.items = items; }
    };
  }

  window.App = {
    isLoggedIn: isLoggedIn,
    requireAuth: requireAuth,
    login: login,
    getOrgId: getOrgId,
    logout: logout,
    initSidebar: initSidebar,
    initLogout: initLogout,
    initUserBadge: initUserBadge,
    positionActionMenu: positionActionMenu,
    initCombobox: initCombobox
  };
})();
