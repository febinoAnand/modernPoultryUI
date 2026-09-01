/* ============================================================
   Shared demo data store — seeds Users & Trades once, then
   persists to localStorage so every page (including the
   dashboard) reads the same live records.
   ============================================================ */

(function () {
  "use strict";

  var USERS_KEY = "ui_users_v1";
  var TRADES_KEY = "ui_trades_v1";
  var BILLS_KEY = "ui_bills_v2";
  var PROFILE_KEY = "ui_profile_v1";
  var GROUPS_KEY = "ui_groups_v2";
  var FARM_CODES_KEY = "ui_farm_codes_v1";
  var TRADER_CODES_KEY = "ui_trader_codes_v1";
  var SALES_ORDERS_KEY = "ui_sales_orders_v1";
  var BRANCHES_KEY = "ui_branches_v1";
  var PRODUCTS_KEY = "ui_products_v1";
  var ORGANIZATIONS_KEY = "ui_organizations_v1";
  var MACHINES_KEY = "ui_machines_v1";

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

  function pad2(n) { return String(n).padStart(2, "0"); }

  function buildSeedBills() {
    var BIRD_TYPES = ["Broiler", "Country Chicken", "Layer"];

    return FIRST_NAMES.map(function (first, i) {
      var last = LAST_NAMES[i % LAST_NAMES.length];
      var name = first + " " + last;
      var day = 3 + (i % 24);
      var month = 1 + (i % 8);
      var dateStr = String(day).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1] + " 2026";
      var isoDate = "2026-" + pad2(month) + "-" + pad2(day);
      var totalBirds = 300 + i * 37;
      var weight = Math.round(totalBirds * (1.8 + (i % 5) * 0.1) * 10) / 10;

      var startHour = 9 + (i % 3);
      var startMin = (i * 11) % 60;
      var startSec = (i * 13) % 60;
      var durationMin = 12 + (i % 10);
      var startTotalSec = startHour * 3600 + startMin * 60 + startSec;
      var endTotalSec = startTotalSec + durationMin * 60 + ((i * 3) % 60);
      var endHour = Math.floor(endTotalSec / 3600) % 24;
      var endMin = Math.floor((endTotalSec % 3600) / 60);
      var endSec = endTotalSec % 60;

      var startTime = isoDate + " " + pad2(startHour) + ":" + pad2(startMin) + ":" + pad2(startSec);
      var endTime = isoDate + " " + pad2(endHour) + ":" + pad2(endMin) + ":" + pad2(endSec);

      var supervisor = DRIVER_FIRST[i % DRIVER_FIRST.length] + " " + LAST_NAMES[(i + 2) % LAST_NAMES.length];
      var driver = DRIVER_FIRST[(i + 4) % DRIVER_FIRST.length] + " " + LAST_NAMES[(i + 5) % LAST_NAMES.length];
      var vehicleNo = STATE_CODES[i % STATE_CODES.length].replace(" ", "") + String.fromCharCode(65 + (i % 26)) + String.fromCharCode(66 + (i % 20)) + (1000 + i * 23).toString().slice(-4);
      var mobileNo = "90" + String(40000000 + i * 191).slice(0, 8);
      var farmCode = "FC-" + (4000 + i * 9);
      var age = 28 + (i % 15);
      var balanceStock = 100 + (i * 23) % 900;
      var birdType = BIRD_TYPES[i % BIRD_TYPES.length];

      var emptyWeight = Math.round(weight * 0.28 * 10) / 10;
      var loadWeight = Math.round((weight + emptyWeight) * 10) / 10;
      var netWeight = weight;
      var avgWeight = Math.round((netWeight / totalBirds) * 100) / 100;
      var totalBox = 3 + (i % 4);
      var filledBox = Math.round(totalBirds / (3 + (i % 3)));
      var emptyBox = Math.max(1, Math.round(totalBox * 0.3));
      var loadingMin = 10 + (i % 15);
      var loadingSec = (i * 7) % 60;
      var loadingTime = loadingMin + "Min " + loadingSec + "Sec";

      var sessionCount = 3;
      var sessions = [];
      var remainingBirds = totalBirds;
      var remainingWeight = netWeight;
      for (var s = 0; s < sessionCount; s++) {
        var isLast = s === sessionCount - 1;
        var boxCount = 5 + ((i + s) % 3);
        var sessFilled = isLast ? remainingBirds : Math.round(totalBirds / sessionCount);
        var sessNet = isLast ? Math.round(remainingWeight * 10) / 10 : Math.round((netWeight / sessionCount) * 10) / 10;
        var sessEmptyWeight = Math.round((emptyWeight / sessionCount) * 10) / 10;
        var sessGross = Math.round((sessNet + sessEmptyWeight) * 10) / 10;
        remainingBirds -= sessFilled;
        remainingWeight -= sessNet;
        var sessTimeSec = startTotalSec + (s + 1) * Math.floor((durationMin * 60) / (sessionCount + 1));
        var sh = Math.floor(sessTimeSec / 3600) % 24;
        var sm = Math.floor((sessTimeSec % 3600) / 60);
        var ss = sessTimeSec % 60;
        sessions.push({
          noOfBox: boxCount,
          filledBox: sessFilled,
          emptyWeight: sessEmptyWeight,
          grossWeight: sessGross,
          netWeight: sessNet,
          time: isoDate + " " + pad2(sh) + ":" + pad2(sm) + ":" + pad2(ss)
        });
      }

      var birdTypeBreakdown = [
        { slNo: 1, birdsType: birdType, box: totalBox, count: totalBirds, total: netWeight }
      ];

      return {
        id: i + 1,
        date: dateStr,
        billNumber: "BILL-" + (30000 + i * 17),
        trader: name,
        email: first.toLowerCase() + "." + last.toLowerCase() + "@example.com",
        totalBirds: totalBirds,
        birdsWeight: weight,
        company: GROUPS[i % GROUPS.length],
        status: i % 6 === 0 ? "Inactive" : "Active",

        startTime: startTime,
        endTime: endTime,
        supervisor: supervisor,
        driver: driver,
        vehicleNo: vehicleNo,
        farmer: name,
        mobileNo: mobileNo,
        farmCode: farmCode,
        age: age,
        balanceStock: balanceStock,
        birdType: birdType,

        filledBox: filledBox,
        emptyBox: emptyBox,
        totalBox: totalBox,
        loadWeight: loadWeight,
        emptyWeight: emptyWeight,
        netWeight: netWeight,
        avgWeight: avgWeight,
        loadingTime: loadingTime,

        weighingSessions: sessions,
        birdTypeBreakdown: birdTypeBreakdown
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
      var m = i % 10;
      var status = m === 0 ? "Inactive" : (m === 1 || m === 2 ? "Pending Approval" : "Active");
      return {
        id: i + 1,
        groupName: name,
        mobile: "96" + String(40000000 + i * 151).slice(0, 8),
        description: GROUP_DESCRIPTIONS[i % GROUP_DESCRIPTIONS.length],
        status: status
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

  function buildSeedTraderCodes() {
    return FIRST_NAMES.map(function (first, i) {
      var last = LAST_NAMES[i % LAST_NAMES.length];
      var name = first + " " + last;
      return {
        id: i + 1,
        traderCode: "TC-" + (3000 + i * 7),
        traderName: name,
        mobile: "94" + String(40000000 + i * 173).slice(0, 8),
        city: LOCATIONS[i % LOCATIONS.length],
        status: i % 6 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function getTraderCodes() {
    var raw = localStorage.getItem(TRADER_CODES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedTraderCodes();
    saveTraderCodes(seeded);
    return seeded;
  }

  function saveTraderCodes(traderCodes) {
    localStorage.setItem(TRADER_CODES_KEY, JSON.stringify(traderCodes));
  }

  var PRODUCTS = ["Broiler Chicken", "Country Chicken", "Chicken Feed", "Layer Feed", "Chick Starter Feed", "Poultry Vaccine", "Egg Tray", "Vitamin Supplement", "Broiler Chicks", "Layer Chicks"];
  var ORDER_STATUSES = ["Pending", "Confirmed", "Delivered"];

  function buildSeedSalesOrders() {
    return FIRST_NAMES.map(function (first, i) {
      var last = LAST_NAMES[i % LAST_NAMES.length];
      var name = first + " " + last;
      var day = 3 + (i % 24);
      var month = 1 + (i % 8);
      var qty = 50 + (i * 17) % 450;
      var rate = 120 + (i * 7) % 180;
      return {
        id: i + 1,
        orderNumber: "SO-" + (5000 + i * 11),
        customerName: name,
        product: PRODUCTS[i % PRODUCTS.length],
        quantity: qty,
        rate: rate,
        totalAmount: qty * rate,
        orderDate: String(day).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1] + " 2026",
        orderStatus: ORDER_STATUSES[i % 3],
        status: i % 8 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function getSalesOrders() {
    var raw = localStorage.getItem(SALES_ORDERS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedSalesOrders();
    saveSalesOrders(seeded);
    return seeded;
  }

  function saveSalesOrders(salesOrders) {
    localStorage.setItem(SALES_ORDERS_KEY, JSON.stringify(salesOrders));
  }

  function buildSeedBranches() {
    return LOCATIONS.concat(LOCATIONS).map(function (city, i) {
      var suffix = i >= LOCATIONS.length ? " " + (Math.floor(i / LOCATIONS.length) + 1) : "";
      return {
        id: i + 1,
        branchName: city + " Branch" + suffix,
        branchCode: "BR-" + (1000 + i * 7),
        address: (100 + i * 13) + " Main Road, " + city,
        status: i % 7 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function getBranches() {
    var raw = localStorage.getItem(BRANCHES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedBranches();
    saveBranches(seeded);
    return seeded;
  }

  function saveBranches(branches) {
    localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  }

  var PRODUCT_CATEGORIES = ["Poultry", "Feed", "Medicine", "Equipment"];

  function buildSeedProducts() {
    return PRODUCTS.map(function (name, i) {
      return {
        id: i + 1,
        productName: name,
        productCode: "PRD-" + (1000 + i * 7),
        category: PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length],
        status: i % 5 === 0 ? "Inactive" : "Active"
      };
    });
  }

  function getProducts() {
    var raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedProducts();
    saveProducts(seeded);
    return seeded;
  }

  function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
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
      group: "",
      orgId: "AGRITRADE",
      companyName: "AgriTrade Poultry Pvt Ltd",
      companyWebsite: "www.agritrade.com",
      teamSize: "11-50",
      mobileVerified: false,
      verifiedMobileNumber: ""
    };
    saveProfile(defaultProfile);
    return defaultProfile;
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  /* ---------------- Organizations (multi-tenant registration) ---------------- */

  function getOrganizations() {
    var raw = localStorage.getItem(ORGANIZATIONS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through */ }
    }
    return [];
  }

  function saveOrganizations(orgs) {
    localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(orgs));
  }

  function generateOrgId(existingOrgs) {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I
    var taken = existingOrgs.map(function (o) { return o.orgId; });
    var id;
    do {
      id = "";
      for (var i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (taken.indexOf(id) !== -1);
    return id;
  }

  function findOrganization(orgId) {
    if (!orgId) return null;
    var orgs = getOrganizations();
    for (var i = 0; i < orgs.length; i++) {
      if (orgs[i].orgId.toUpperCase() === String(orgId).toUpperCase()) return orgs[i];
    }
    return null;
  }

  function isUsernameTaken(username) {
    var orgs = getOrganizations();
    return orgs.some(function (o) { return o.username.toLowerCase() === String(username).toLowerCase(); });
  }

  function registerOrganization(details) {
    var orgs = getOrganizations();
    var org = {
      orgId: generateOrgId(orgs),
      username: details.username,
      email: details.email,
      password: details.password,
      companyName: details.companyName,
      companyWebsite: details.companyWebsite,
      contactNumber: details.contactNumber,
      teamSize: details.teamSize,
      status: "Active",
      createdAt: new Date().toISOString()
    };
    orgs.push(org);
    saveOrganizations(orgs);
    return org;
  }

  function authenticateOrganization(orgId, username, password) {
    var org = findOrganization(orgId);
    if (!org) return null;
    if (org.username.toLowerCase() !== String(username).trim().toLowerCase()) return null;
    if (org.password !== password) return null;
    return org;
  }

  /* ---------------- Machine management ---------------- */

  var MACHINE_MODELS = [
    "Digital Platform Scale", "Heavy Duty Floor Scale", "Truck Weighbridge",
    "Poultry Crate Scale", "Electronic Hanging Scale", "Load Cell Weighing System"
  ];
  var MACHINE_STATUSES = ["Active", "Under Maintenance", "Inactive"];
  var SERVICE_TYPES = ["Calibration", "Preventive Maintenance", "Repair", "Inspection", "Software Update"];
  var SERVICE_NOTES = [
    "Routine check completed, readings within tolerance.",
    "Replaced worn load cell and recalibrated to factory spec.",
    "Cleaned platform and sensors, verified zero-point accuracy.",
    "Firmware updated to latest version, display recalibrated.",
    "Inspected wiring and indicator unit, no faults found.",
    "Adjusted tare settings after drift was reported by operator."
  ];

  function buildSeedMachines() {
    return MACHINE_MODELS.concat(MACHINE_MODELS, MACHINE_MODELS.slice(0, 3)).map(function (model, i) {
      var capacity = [500, 1000, 1500, 2000, 3000, 5000][i % 6];
      var precision = [0.05, 0.1, 0.2, 0.5][i % 4];
      var tare = Math.round(capacity * 0.03);
      var day = 3 + (i % 24);
      var month = 1 + (i % 8);
      var installDate = String(day).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1] + " 2024";
      var calDay = 2 + ((i * 5) % 24);
      var calMonth = 1 + ((i + 2) % 8);
      var calibrationDate = String(calDay).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][calMonth - 1] + " 2026";
      var dueMonth = ((calMonth + 5) % 12) + 1;
      var calibrationDue = String(calDay).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][dueMonth - 1] + " 2026";
      var status = i % 9 === 0 ? "Under Maintenance" : (i % 13 === 0 ? "Inactive" : "Active");

      var sessionCount = 2 + (i % 3);
      var serviceHistory = [];
      for (var s = 0; s < sessionCount; s++) {
        var sDay = 5 + ((i + s * 7) % 22);
        var sMonth = 1 + ((i + s * 2) % 8);
        serviceHistory.push({
          id: s + 1,
          date: String(sDay).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][sMonth - 1] + " 2026",
          type: SERVICE_TYPES[(i + s) % SERVICE_TYPES.length],
          technician: DRIVER_FIRST[(i + s) % DRIVER_FIRST.length] + " " + LAST_NAMES[(i + s * 3) % LAST_NAMES.length],
          notes: SERVICE_NOTES[(i + s) % SERVICE_NOTES.length],
          status: s === sessionCount - 1 && i % 5 === 0 ? "Pending" : "Completed"
        });
      }
      serviceHistory.sort(function (a, b) { return b.id - a.id; });

      return {
        id: i + 1,
        machineNumber: "MC-" + (1000 + i * 7),
        machineName: model,
        branch: LOCATIONS[i % LOCATIONS.length] + " Branch",
        installDate: installDate,
        status: status,
        weighing: {
          capacity: capacity,
          minWeight: Math.round(capacity * 0.01),
          maxWeight: capacity,
          precision: precision,
          tareWeight: tare,
          unit: "kg",
          calibrationDate: calibrationDate,
          calibrationDue: calibrationDue
        },
        serviceHistory: serviceHistory
      };
    });
  }

  function getMachines() {
    var raw = localStorage.getItem(MACHINES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedMachines();
    saveMachines(seeded);
    return seeded;
  }

  function saveMachines(machines) {
    localStorage.setItem(MACHINES_KEY, JSON.stringify(machines));
  }

  /* ---------------- Effective permissions ----------------
     Resolves the CRUD permissions that apply to the current
     session for a given module, based on the profile's selected
     group. No group selected (or a group with no saved
     permissions yet) falls back to full access so the app stays
     usable out of the box — restrictions only kick in once an
     admin actually configures a group's Permissions tab and the
     signed-in profile is assigned to that group. */

  function getModulePermissions(moduleKey) {
    var fullAccess = { create: true, read: true, update: true, delete: true };
    var profile = getProfile();
    if (!profile.group) return fullAccess;

    var groups = getGroups();
    var matched = groups.find(function (g) { return g.groupName === profile.group; });
    if (!matched || !matched.permissions) return fullAccess;

    var modulePerms = matched.permissions[moduleKey];
    if (!modulePerms) return fullAccess;

    return {
      create: !!modulePerms.create,
      read: !!modulePerms.read,
      update: !!modulePerms.update,
      delete: !!modulePerms.delete
    };
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
    getTraderCodes: getTraderCodes,
    saveTraderCodes: saveTraderCodes,
    getSalesOrders: getSalesOrders,
    saveSalesOrders: saveSalesOrders,
    getBranches: getBranches,
    saveBranches: saveBranches,
    getProducts: getProducts,
    saveProducts: saveProducts,
    GROUP_OPTIONS: GROUP_OPTIONS,
    getOrganizations: getOrganizations,
    saveOrganizations: saveOrganizations,
    findOrganization: findOrganization,
    isUsernameTaken: isUsernameTaken,
    registerOrganization: registerOrganization,
    authenticateOrganization: authenticateOrganization,
    getMachines: getMachines,
    saveMachines: saveMachines,
    getModulePermissions: getModulePermissions
  };
})();
