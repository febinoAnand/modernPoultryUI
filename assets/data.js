/* ============================================================
   Shared demo data store — seeds Users & Trades once, then
   persists to localStorage so every page (including the
   dashboard) reads the same live records.
   ============================================================ */

(function () {
  "use strict";

  var USERS_KEY = "ui_users_v1";
  var TRADES_KEY = "ui_trades_v1";
  var BILLS_KEY = "ui_bills_v1";
  var PROFILE_KEY = "ui_profile_v1";
  var GROUPS_KEY = "ui_groups_v1";
  var FARM_CODES_KEY = "ui_farm_codes_v1";

  var GROUP_OPTIONS = [
    "VPS BROILER", "KONGU BROILERS", "KM CHICKEN", "VASANTHAA POULTRY FARM", "MP CHICKEN",
    "workout", "temp", "febino2", "NEW TECH TRADERS", "DURAI BROILERS",
    "MANIES BROILERS", "PP AGENCY", "SELVAM BROILERS", "ASS BROILER", "MINNAL TRADERS",
    "SRS COUNTRY CHICKEN", "Maya", "KONAR CHICKEN", "GR CHICKEN", "Febinosolutions",
    "Abi chicken", "ABU BROILERS", "VHL", "RG CHICKEN", "THARANI POULTRY",
    "AADHI CHICKEN", "BASHA FRESH CHICKEN", "MOHA POULTRY FARMS", "MURUGAN TRADERS", "JK CHICKEN",
    "MJ CHICKEN", "SR BISMI", "RRG CHICKEN", "KONGU BROILERS GUDALUR", "KONGU BROILERS PANDALUR",
    "KONGU BROILERS MANJOOR", "KONGU BROILERS COONOOR", "KONGU BROILERS OOTY", "ANNAI POULTRY FARM", "CLEAN KANNUR VENTURES"
  ];

  var FIRST_NAMES = ["Ramesh", "Suresh", "Priya", "Anitha", "Karthik", "Vijay", "Deepa", "Manoj", "Lakshmi", "Arjun", "Sneha", "Vikram", "Divya", "Rahul", "Meena", "Sathish", "Pooja", "Naveen", "Kavya", "Ashok", "Revathi", "Bala", "Nithya", "Ganesh"];
  var LAST_NAMES = ["Kumar", "Raj", "Nair", "Iyer", "Reddy", "Sharma", "Pillai", "Menon", "Gupta", "Rao"];
  var DRIVER_FIRST = ["Murugan", "Selvam", "Kannan", "Raja", "Mani", "Senthil", "Vasu", "Elango", "Prakash", "Dinesh"];
  var STATE_CODES = ["TN10", "TN37", "KA05", "AP09", "KL07"];
  var GROUPS = ["Group A", "Group B", "Group C", "Group D"];

  function buildSeedUsers() {
    return FIRST_NAMES.map(function (first, i) {
      var last = LAST_NAMES[i % LAST_NAMES.length];
      var name = first + " " + last;
      var day = 3 + (i % 24);
      var month = 1 + (i % 8);
      return {
        id: i + 1,
        name: name,
        email: first.toLowerCase() + "." + last.toLowerCase() + "@example.com",
        group: GROUPS[i % GROUPS.length],
        mobile: "98" + String(40000000 + i * 137).slice(0, 8),
        status: i % 5 === 0 ? "Inactive" : "Active",
        machineId: "MC-" + (1000 + i * 3),
        createdDate: String(day).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1] + " 2026"
      };
    });
  }

  function buildSeedTrades() {
    return FIRST_NAMES.map(function (first, i) {
      var last = LAST_NAMES[i % LAST_NAMES.length];
      var name = first + " " + last;
      return {
        id: i + 1,
        name: name,
        customerId: "CUST-" + (1000 + i * 7),
        mobile: "97" + String(40000000 + i * 149).slice(0, 8),
        vehicleNumber: STATE_CODES[i % STATE_CODES.length] + " " + String.fromCharCode(65 + (i % 26)) + String.fromCharCode(66 + (i % 20)) + " " + (1000 + i * 11).toString().slice(-4),
        machineNumber: "MC-" + (2000 + i * 5),
        orderNumber: "ORD-" + (20000 + i * 13),
        driverName: DRIVER_FIRST[i % DRIVER_FIRST.length] + " " + LAST_NAMES[(i + 3) % LAST_NAMES.length],
        status: i % 6 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function buildSeedBills() {
    return FIRST_NAMES.map(function (first, i) {
      var last = LAST_NAMES[i % LAST_NAMES.length];
      var name = first + " " + last;
      var day = 3 + (i % 24);
      var month = 1 + (i % 8);
      var totalBirds = 300 + i * 37;
      var weight = Math.round(totalBirds * (1.8 + (i % 5) * 0.1) * 10) / 10;
      return {
        id: i + 1,
        date: String(day).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1] + " 2026",
        billNumber: "BILL-" + (30000 + i * 17),
        trader: name,
        email: first.toLowerCase() + "." + last.toLowerCase() + "@example.com",
        totalBirds: totalBirds,
        birdsWeight: weight,
        company: GROUPS[i % GROUPS.length],
        status: i % 6 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function getUsers() {
    var raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedUsers();
    saveUsers(seeded);
    return seeded;
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getTrades() {
    var raw = localStorage.getItem(TRADES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedTrades();
    saveTrades(seeded);
    return seeded;
  }

  function saveTrades(trades) {
    localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  }

  function getBills() {
    var raw = localStorage.getItem(BILLS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedBills();
    saveBills(seeded);
    return seeded;
  }

  function saveBills(bills) {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }

  var GROUP_DESCRIPTIONS = [
    "Regular poultry supplier", "Trusted trading partner", "Bulk order specialist",
    "Premium quality broilers", "Long-term associate", "Local farm distributor",
    "Wholesale chicken trader", "Verified vendor", "High volume dealer", "New partnership"
  ];

  function buildSeedGroups() {
    return GROUP_OPTIONS.map(function (name, i) {
      return {
        id: i + 1,
        groupName: name,
        mobile: "96" + String(40000000 + i * 151).slice(0, 8),
        description: GROUP_DESCRIPTIONS[i % GROUP_DESCRIPTIONS.length],
        status: i % 7 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function getGroups() {
    var raw = localStorage.getItem(GROUPS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedGroups();
    saveGroups(seeded);
    return seeded;
  }

  function saveGroups(groups) {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }

  var LOCATIONS = ["Erode", "Namakkal", "Salem", "Coimbatore", "Tirupur", "Karur", "Dindigul", "Trichy", "Madurai", "Theni"];

  function buildSeedFarmCodes() {
    return FIRST_NAMES.map(function (first, i) {
      var last = LAST_NAMES[i % LAST_NAMES.length];
      var name = first + " " + last;
      return {
        id: i + 1,
        farmCode: "FC-" + (4000 + i * 9),
        farmerName: name,
        batchNumber: "BATCH-" + (100 + i * 4),
        mobile: "95" + String(40000000 + i * 163).slice(0, 8),
        location: LOCATIONS[i % LOCATIONS.length],
        status: i % 6 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function getFarmCodes() {
    var raw = localStorage.getItem(FARM_CODES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedFarmCodes();
    saveFarmCodes(seeded);
    return seeded;
  }

  function saveFarmCodes(farmCodes) {
    localStorage.setItem(FARM_CODES_KEY, JSON.stringify(farmCodes));
  }

  function getProfile() {
    var raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to default */ }
    }
    var email = sessionStorage.getItem("ui_user_email") || "vijay@gmail";
    var username = email.split("@")[0];
    var defaultProfile = {
      name: username.charAt(0).toUpperCase() + username.slice(1),
      username: username,
      email: email,
      mobile: "",
      machineId: "",
      group: ""
    };
    saveProfile(defaultProfile);
    return defaultProfile;
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  window.Data = {
    getUsers: getUsers,
    saveUsers: saveUsers,
    getTrades: getTrades,
    saveTrades: saveTrades,
    getBills: getBills,
    saveBills: saveBills,
    getProfile: getProfile,
    saveProfile: saveProfile,
    getGroups: getGroups,
    saveGroups: saveGroups,
    getFarmCodes: getFarmCodes,
    saveFarmCodes: saveFarmCodes,
    GROUP_OPTIONS: GROUP_OPTIONS
  };
})();
