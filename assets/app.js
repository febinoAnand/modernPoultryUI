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

  window.App = {
    isLoggedIn: isLoggedIn,
    requireAuth: requireAuth,
    login: login,
    logout: logout,
    initSidebar: initSidebar,
    initLogout: initLogout,
    initUserBadge: initUserBadge
  };
})();
