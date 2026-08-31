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

  /* ---------------- Group permission enforcement ----------------
     Reads the effective CRUD permissions for the current session
     (see Data.getModulePermissions) and applies them to the page:
     - no "read" -> the whole page is covered by a restricted-access
       overlay (the page's own script still runs harmlessly underneath).
     - no "create" -> any button marked data-perm-action="create" is
       disabled.
     - no "update"/"delete" -> row actions (edit/rename/approve or
       toggle/delete/reject) are blocked at click-time with a toast,
       since those buttons are re-rendered dynamically by each page. */

  var ACTION_PERMISSION_MAP = {
    edit: "update",
    rename: "update",
    approve: "update",
    toggle: "delete",
    delete: "delete",
    reject: "delete"
  };

  function enforcePermissions(moduleKey) {
    var perms = window.Data.getModulePermissions(moduleKey);

    if (!perms.read) showAccessRestricted();

    document.querySelectorAll('[data-perm-action="create"]').forEach(function (btn) {
      if (!perms.create) {
        btn.disabled = true;
        btn.classList.add("perm-disabled");
        btn.title = "You don't have permission to create new records.";
      }
    });

    document.addEventListener("click", function (e) {
      var createTrigger = e.target.closest('[data-perm-action="create"]');
      if (createTrigger && !perms.create) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showDenialToast("You don't have permission to create new records.");
        return;
      }

      var actionTrigger = e.target.closest("[data-action]");
      if (!actionTrigger) return;
      var required = ACTION_PERMISSION_MAP[actionTrigger.getAttribute("data-action")];
      if (required && !perms[required]) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showDenialToast("You don't have permission to " + (required === "update" ? "edit" : "remove") + " this record.");
      }
    }, true);

    return perms;
  }

  function showAccessRestricted() {
    if (document.querySelector(".perm-restricted-overlay")) return;
    var overlay = document.createElement("div");
    overlay.className = "perm-restricted-overlay";
    overlay.innerHTML =
      '<div class="perm-restricted-card">' +
        '<div class="perm-restricted-icon">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' +
        '</div>' +
        '<h3>Access Restricted</h3>' +
        '<p>Your group does not have permission to view this page. Contact your administrator if you believe this is a mistake.</p>' +
        '<div class="perm-restricted-actions">' +
          '<a class="btn btn-primary" href="profile.html">Go to Profile</a>' +
          '<a class="btn btn-outline" href="#" data-logout>Logout</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector("[data-logout]").addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  var denialToastTimer = null;
  function showDenialToast(message) {
    var el = document.getElementById("appPermToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "appPermToast";
      el.className = "toast-notice perm-denied";
      el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span></span>';
      document.body.appendChild(el);
    }
    el.querySelector("span").textContent = message;
    el.classList.add("show");
    clearTimeout(denialToastTimer);
    denialToastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
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
    initCombobox: initCombobox,
    enforcePermissions: enforcePermissions
  };
})();
