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

  function login(email) {
    sessionStorage.setItem(SESSION_KEY, "true");
    sessionStorage.setItem("ui_user_email", email);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("ui_user_email");
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

  window.App = {
    isLoggedIn: isLoggedIn,
    requireAuth: requireAuth,
    login: login,
    logout: logout,
    initSidebar: initSidebar,
    initLogout: initLogout,
    initUserBadge: initUserBadge,
    positionActionMenu: positionActionMenu
  };
})();
