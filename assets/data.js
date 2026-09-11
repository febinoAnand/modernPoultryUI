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
  var FARM_CODES_KEY = "ui_farm_codes_v1";
  var TRADER_CODES_KEY = "ui_trader_codes_v1";
  var SALES_ORDERS_KEY = "ui_sales_orders_v1";
  var BRANCHES_KEY = "ui_branches_v1";
  var PRODUCTS_KEY = "ui_products_v1";
  var ORGANIZATIONS_KEY = "ui_organizations_v1";
  var MACHINES_KEY = "ui_machines_v1";
  var APP_SETTINGS_KEY = "ui_app_settings_v1";
  var USER_ROLES_KEY = "ui_user_roles_v1";
  var ROLE_PERMISSIONS_KEY = "ui_role_permissions_v1";

  /* ---------------- Per-tenant data isolation ----------------
     Every Farm/Trader/Branch/Machine/SalesOrder/Bill/User record carries
     an orgId. The tenant-facing app only ever sees (and only ever writes)
     the signed-in session's own org's slice — getX()/saveX() below do
     that filtering/merging transparently, so every existing page keeps
     calling Data.getUsers()/Data.saveUsers(users) exactly as before and
     "just works" scoped to one tenant. getAllX() (no scoping) and
     getXByOrg(orgId) (one specific tenant) are for the Control Center
     pages, which need to see across every tenant. DEFAULT_ORG_ID is the
     bucket every pre-existing seeded record (and the built-in demo
     login, which has no real Organization record) belongs to. */
  var DEFAULT_ORG_ID = "POULTRY";

  /* Four extra example tenants (beyond the DEFAULT_ORG_ID one), each with
     one Farm/Trader/Branch/Sales Order/Bill of its own — demonstrates
     the per-tenant isolation with real, distinct data per tenant rather
     than one tenant owning everything. Appended (not replacing) whatever
     seed/migration already ran, so they show up even on a browser that
     already has localStorage data from before this existed. */
  var EXAMPLE_TENANTS = [
    { orgId: "TENANT01", username: "northbridge_admin", email: "admin@northbridge.com", password: "north123", companyName: "Northbridge Logistics", companyWebsite: "www.northbridge.com", contactNumber: "9810000001", teamSize: "1-10" },
    { orgId: "TENANT02", username: "sunrise_admin", email: "admin@sunrisepoultry.com", password: "sunrise123", companyName: "Sunrise Poultry Farms", companyWebsite: "www.sunrisepoultry.com", contactNumber: "9810000002", teamSize: "11-50" },
    { orgId: "TENANT03", username: "goldenharvest_admin", email: "admin@goldenharvest.com", password: "golden123", companyName: "Golden Harvest Traders", companyWebsite: "www.goldenharvest.com", contactNumber: "9810000003", teamSize: "1-10" },
    { orgId: "TENANT04", username: "greenvalley_admin", email: "admin@greenvalleyagro.com", password: "green123", companyName: "Green Valley Agro", companyWebsite: "www.greenvalleyagro.com", contactNumber: "9810000004", teamSize: "51-200" }
  ];

  function currentOrgId() {
    return sessionStorage.getItem("ui_org_id") || DEFAULT_ORG_ID;
  }

  function recordOrgId(record) {
    return record.orgId || DEFAULT_ORG_ID;
  }

  /* Builds the public getX()/getAllX()/getXByOrg()/saveX() quartet for one
     entity store from its raw (unscoped) getAll/save pair. */
  function scopeByOrg(getAllRaw, saveAllRaw) {
    function getAllX() { return getAllRaw(); }
    function getXByOrg(orgId) { return getAllRaw().filter(function (r) { return recordOrgId(r) === orgId; }); }
    function getX() { return getXByOrg(currentOrgId()); }
    function saveX(scopedList) {
      var org = currentOrgId();
      scopedList.forEach(function (r) { if (r.orgId === undefined) r.orgId = org; });
      var others = getAllRaw().filter(function (r) { return recordOrgId(r) !== org; });
      saveAllRaw(others.concat(scopedList));
    }
    return { getX: getX, getAllX: getAllX, getXByOrg: getXByOrg, saveX: saveX };
  }

  var FIRST_NAMES = ["Ramesh", "Suresh", "Priya", "Anitha", "Karthik", "Vijay", "Deepa", "Manoj", "Lakshmi", "Arjun", "Sneha", "Vikram", "Divya", "Rahul", "Meena", "Sathish", "Pooja", "Naveen", "Kavya", "Ashok", "Revathi", "Bala", "Nithya", "Ganesh"];
  var LAST_NAMES = ["Kumar", "Raj", "Nair", "Iyer", "Reddy", "Sharma", "Pillai", "Menon", "Gupta", "Rao"];
  var DRIVER_FIRST = ["Murugan", "Selvam", "Kannan", "Raja", "Mani", "Senthil", "Vasu", "Elango", "Prakash", "Dinesh"];
  var STATE_CODES = ["TN10", "TN37", "KA05", "AP09", "KL07"];
  var GROUPS = ["Group A", "Group B", "Group C", "Group D"];
  var USER_ROLES = ["Admin", "Manager", "Viewer"];

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
        role: USER_ROLES[i % USER_ROLES.length],
        mobile: "98" + String(40000000 + i * 137).slice(0, 8),
        status: i % 5 === 0 ? "Inactive" : "Active",
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
        status: i % 6 === 0 ? "Inactive" : "Active",
        createdDate: seedCreatedDate(i)
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
        branch: LOCATIONS[i % LOCATIONS.length] + " Branch",
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
        birdTypeBreakdown: birdTypeBreakdown,
        customField: ""
      };
    });
  }

  function getUsersRaw() {
    var raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      try {
        var users = JSON.parse(raw);
        var migrated = false;
        users.forEach(function (u, i) {
          if (u.role === undefined) { u.role = USER_ROLES[i % USER_ROLES.length]; migrated = true; }
        });
        if (migrated) saveUsersRaw(users);
        return users;
      } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedUsers();
    saveUsersRaw(seeded);
    return seeded;
  }

  function saveUsersRaw(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  var _usersScope = scopeByOrg(getUsersRaw, saveUsersRaw);
  function getUsers() { return _usersScope.getX(); }
  function getAllUsers() { return _usersScope.getAllX(); }
  function getUsersByOrg(orgId) { return _usersScope.getXByOrg(orgId); }
  function saveUsers(list) { return _usersScope.saveX(list); }

  /* ---------------- User roles (open-ended, not a fixed enum) ----------
     Starts with Admin/Manager/Viewer but any page can add a new role on
     the fly (see App.initRoleSelect) — it's appended here so it shows up
     in every Role dropdown from then on, across user-list and tenant
     profiles alike. */
  function getUserRoles() {
    var raw = localStorage.getItem(USER_ROLES_KEY);
    if (raw) {
      try {
        var roles = JSON.parse(raw);
        if (Array.isArray(roles) && roles.length) return roles;
      } catch (e) { /* fall through to reseed */ }
    }
    var seeded = USER_ROLES.slice();
    saveUserRoles(seeded);
    return seeded;
  }

  function saveUserRoles(roles) {
    localStorage.setItem(USER_ROLES_KEY, JSON.stringify(roles));
  }

  function getTrades() {
    var raw = localStorage.getItem(TRADES_KEY);
    if (raw) {
      try {
        var trades = JSON.parse(raw);
        var migrated = false;
        trades.forEach(function (t, i) {
          if (t.createdDate === undefined) { t.createdDate = seedCreatedDate(i); migrated = true; }
        });
        if (migrated) saveTrades(trades);
        return trades;
      } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedTrades();
    saveTrades(seeded);
    return seeded;
  }

  function saveTrades(trades) {
    localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  }

  function buildExampleBill(o) {
    var emptyWeight = Math.round(o.netWeight * 0.28 * 10) / 10;
    var loadWeight = Math.round((o.netWeight + emptyWeight) * 10) / 10;
    var avgWeight = Math.round((o.netWeight / o.totalBirds) * 100) / 100;
    return {
      id: o.id,
      date: "05 Sep 2026",
      billNumber: o.billNumber,
      salesOrderNumber: o.salesOrderNumber,
      trader: o.trader,
      email: o.email,
      totalBirds: o.totalBirds,
      birdsWeight: o.netWeight,
      company: o.company,
      branch: o.branch,
      status: "Active",
      startTime: "2026-09-05 09:00:00",
      endTime: "2026-09-05 09:30:00",
      supervisor: o.supervisor,
      driver: o.driver,
      vehicleNo: o.vehicleNo,
      farmer: o.farmer,
      mobileNo: o.mobileNo,
      farmCode: o.farmCode,
      age: 35,
      balanceStock: 200,
      birdType: o.birdType,
      filledBox: o.totalBox,
      emptyBox: 0,
      totalBox: o.totalBox,
      loadWeight: loadWeight,
      emptyWeight: emptyWeight,
      netWeight: o.netWeight,
      avgWeight: avgWeight,
      loadingTime: "12Min 30Sec",
      weighingSessions: [{
        noOfBox: o.totalBox,
        filledBox: o.totalBox,
        emptyWeight: emptyWeight,
        grossWeight: loadWeight,
        netWeight: o.netWeight,
        time: "2026-09-05 09:15:00"
      }],
      birdTypeBreakdown: [{ slNo: 1, birdsType: o.birdType, box: o.totalBox, count: o.totalBirds, total: o.netWeight }],
      customField: "",
      orgId: o.orgId
    };
  }

  var EXAMPLE_BILLS = [
    { id: 1001, billNumber: "BILL-90001", salesOrderNumber: "SO-9001", trader: "Ramesh Traders", email: "ramesh@northbridge.com", company: "Northbridge Logistics", branch: "Northbridge Main Branch", supervisor: "Suresh Kumar", driver: "Murugan Vasu", vehicleNo: "TN10AB9001", farmer: "Arun Prakash", mobileNo: "9833300001", farmCode: "FC-9001", birdType: "Broiler", totalBirds: 200, netWeight: 380, totalBox: 5, orgId: "TENANT01" },
    { id: 1002, billNumber: "BILL-90002", salesOrderNumber: "SO-9002", trader: "Sunrise Trading Co", email: "contact@sunrisepoultry.com", company: "Sunrise Poultry Farms", branch: "Sunrise Main Branch", supervisor: "Elango Raj", driver: "Selvam Iyer", vehicleNo: "TN37AB9002", farmer: "Meena Rani", mobileNo: "9833300002", farmCode: "FC-9002", birdType: "Country Chicken", totalBirds: 150, netWeight: 270, totalBox: 4, orgId: "TENANT02" },
    { id: 1003, billNumber: "BILL-90003", salesOrderNumber: "SO-9003", trader: "Golden Harvest Trading", email: "contact@goldenharvest.com", company: "Golden Harvest Traders", branch: "Golden Harvest Main Branch", supervisor: "Prakash Menon", driver: "Kannan Reddy", vehicleNo: "KA05AB9003", farmer: "Karthik Selvam", mobileNo: "9833300003", farmCode: "FC-9003", birdType: "Layer", totalBirds: 300, netWeight: 540, totalBox: 6, orgId: "TENANT03" },
    { id: 1004, billNumber: "BILL-90004", salesOrderNumber: "SO-9004", trader: "Green Valley Traders", email: "contact@greenvalleyagro.com", company: "Green Valley Agro", branch: "Green Valley Main Branch", supervisor: "Dinesh Iyer", driver: "Raja Sharma", vehicleNo: "AP09AB9004", farmer: "Divya Shree", mobileNo: "9833300004", farmCode: "FC-9004", birdType: "Broiler", totalBirds: 250, netWeight: 475, totalBox: 5, orgId: "TENANT04" }
  ];

  function ensureExampleBills(list) {
    var added = false;
    EXAMPLE_BILLS.forEach(function (o) {
      if (list.some(function (x) { return x.id === o.id; })) return;
      list.push(buildExampleBill(o));
      added = true;
    });
    return added;
  }

  function getBillsRaw() {
    var raw = localStorage.getItem(BILLS_KEY);
    var list;
    var migrated = false;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = buildSeedBills(); migrated = true; }
    } else {
      list = buildSeedBills();
      migrated = true;
    }
    if (ensureExampleBills(list)) migrated = true;
    if (migrated) saveBillsRaw(list);
    return list;
  }

  function saveBillsRaw(bills) {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }

  var _billsScope = scopeByOrg(getBillsRaw, saveBillsRaw);
  function getBills() { return _billsScope.getX(); }
  function getAllBills() { return _billsScope.getAllX(); }
  function getBillsByOrg(orgId) { return _billsScope.getXByOrg(orgId); }
  function saveBills(list) { return _billsScope.saveX(list); }

  function seedCreatedDate(i) {
    var day = 3 + (i % 24);
    var month = 1 + (i % 8);
    return String(day).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1] + " 2026";
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
        status: i % 6 === 0 ? "Inactive" : "Active",
        createdDate: seedCreatedDate(i)
      };
    });
  }

  var EXAMPLE_FARM_CODES = [
    { id: 1001, farmCode: "FC-9001", farmerName: "Arun Prakash", batchNumber: "BATCH-901", mobile: "9811100001", location: "Salem", orgId: "TENANT01" },
    { id: 1002, farmCode: "FC-9002", farmerName: "Meena Rani", batchNumber: "BATCH-902", mobile: "9811100002", location: "Coimbatore", orgId: "TENANT02" },
    { id: 1003, farmCode: "FC-9003", farmerName: "Karthik Selvam", batchNumber: "BATCH-903", mobile: "9811100003", location: "Madurai", orgId: "TENANT03" },
    { id: 1004, farmCode: "FC-9004", farmerName: "Divya Shree", batchNumber: "BATCH-904", mobile: "9811100004", location: "Trichy", orgId: "TENANT04" }
  ];

  function ensureExampleFarmCodes(list) {
    var added = false;
    EXAMPLE_FARM_CODES.forEach(function (f) {
      if (list.some(function (x) { return x.id === f.id; })) return;
      list.push(Object.assign({ status: "Active", createdDate: "05 Sep 2026" }, f));
      added = true;
    });
    return added;
  }

  function getFarmCodesRaw() {
    var raw = localStorage.getItem(FARM_CODES_KEY);
    var list;
    var migrated = false;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = buildSeedFarmCodes(); migrated = true; }
    } else {
      list = buildSeedFarmCodes();
      migrated = true;
    }
    if (ensureExampleFarmCodes(list)) migrated = true;
    if (migrated) saveFarmCodesRaw(list);
    return list;
  }

  function saveFarmCodesRaw(farmCodes) {
    localStorage.setItem(FARM_CODES_KEY, JSON.stringify(farmCodes));
  }

  var _farmCodesScope = scopeByOrg(getFarmCodesRaw, saveFarmCodesRaw);
  function getFarmCodes() { return _farmCodesScope.getX(); }
  function getAllFarmCodes() { return _farmCodesScope.getAllX(); }
  function getFarmCodesByOrg(orgId) { return _farmCodesScope.getXByOrg(orgId); }
  function saveFarmCodes(list) { return _farmCodesScope.saveX(list); }

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
        status: i % 6 === 0 ? "Inactive" : "Active",
        createdDate: seedCreatedDate(i)
      };
    });
  }

  var EXAMPLE_TRADER_CODES = [
    { id: 1001, traderCode: "TC-9001", traderName: "Ramesh Traders", mobile: "9822200001", city: "Salem", orgId: "TENANT01" },
    { id: 1002, traderCode: "TC-9002", traderName: "Sunrise Trading Co", mobile: "9822200002", city: "Coimbatore", orgId: "TENANT02" },
    { id: 1003, traderCode: "TC-9003", traderName: "Golden Harvest Trading", mobile: "9822200003", city: "Madurai", orgId: "TENANT03" },
    { id: 1004, traderCode: "TC-9004", traderName: "Green Valley Traders", mobile: "9822200004", city: "Trichy", orgId: "TENANT04" }
  ];

  function ensureExampleTraderCodes(list) {
    var added = false;
    EXAMPLE_TRADER_CODES.forEach(function (t) {
      if (list.some(function (x) { return x.id === t.id; })) return;
      list.push(Object.assign({ status: "Active", createdDate: "05 Sep 2026" }, t));
      added = true;
    });
    return added;
  }

  function getTraderCodesRaw() {
    var raw = localStorage.getItem(TRADER_CODES_KEY);
    var list;
    var migrated = false;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = buildSeedTraderCodes(); migrated = true; }
    } else {
      list = buildSeedTraderCodes();
      migrated = true;
    }
    if (ensureExampleTraderCodes(list)) migrated = true;
    if (migrated) saveTraderCodesRaw(list);
    return list;
  }

  function saveTraderCodesRaw(traderCodes) {
    localStorage.setItem(TRADER_CODES_KEY, JSON.stringify(traderCodes));
  }

  var _traderCodesScope = scopeByOrg(getTraderCodesRaw, saveTraderCodesRaw);
  function getTraderCodes() { return _traderCodesScope.getX(); }
  function getAllTraderCodes() { return _traderCodesScope.getAllX(); }
  function getTraderCodesByOrg(orgId) { return _traderCodesScope.getXByOrg(orgId); }
  function saveTraderCodes(list) { return _traderCodesScope.saveX(list); }

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
        trader: name,
        branch: LOCATIONS[i % LOCATIONS.length] + " Branch",
        supervisor: DRIVER_FIRST[i % DRIVER_FIRST.length] + " " + LAST_NAMES[(i + 2) % LAST_NAMES.length],
        product: PRODUCTS[i % PRODUCTS.length],
        quantity: qty,
        rate: rate,
        totalAmount: qty * rate,
        orderDate: String(day).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1] + " 2026",
        orderStatus: ORDER_STATUSES[i % 3],
        status: i % 8 === 0 ? "Inactive" : "Active",
        customField: ""
      };
    });
  }

  var EXAMPLE_SALES_ORDERS = [
    { id: 1001, orderNumber: "SO-9001", trader: "Ramesh Traders", branch: "Northbridge Main Branch", supervisor: "Suresh Kumar", product: "Broiler Chicken", quantity: 200, rate: 150, orderStatus: "Confirmed", orgId: "TENANT01" },
    { id: 1002, orderNumber: "SO-9002", trader: "Sunrise Trading Co", branch: "Sunrise Main Branch", supervisor: "Elango Raj", product: "Country Chicken", quantity: 150, rate: 180, orderStatus: "Confirmed", orgId: "TENANT02" },
    { id: 1003, orderNumber: "SO-9003", trader: "Golden Harvest Trading", branch: "Golden Harvest Main Branch", supervisor: "Prakash Menon", product: "Layer Chicks", quantity: 300, rate: 120, orderStatus: "Confirmed", orgId: "TENANT03" },
    { id: 1004, orderNumber: "SO-9004", trader: "Green Valley Traders", branch: "Green Valley Main Branch", supervisor: "Dinesh Iyer", product: "Broiler Chicks", quantity: 250, rate: 140, orderStatus: "Confirmed", orgId: "TENANT04" }
  ];

  function ensureExampleSalesOrders(list) {
    var added = false;
    EXAMPLE_SALES_ORDERS.forEach(function (o) {
      if (list.some(function (x) { return x.id === o.id; })) return;
      list.push(Object.assign({
        totalAmount: o.quantity * o.rate,
        orderDate: "05 Sep 2026",
        status: "Active",
        customField: ""
      }, o));
      added = true;
    });
    return added;
  }

  function getSalesOrdersRaw() {
    var raw = localStorage.getItem(SALES_ORDERS_KEY);
    var parsed;
    var migrated = false;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
        parsed.forEach(function (o) {
          if (o.trader === undefined) { o.trader = o.customerName || ""; delete o.customerName; migrated = true; }
          if (o.branch === undefined) { o.branch = ""; migrated = true; }
          if (o.supervisor === undefined) { o.supervisor = ""; migrated = true; }
          if (o.customField === undefined) { o.customField = ""; migrated = true; }
        });
      } catch (e) {
        parsed = buildSeedSalesOrders();
        migrated = true;
      }
    } else {
      parsed = buildSeedSalesOrders();
      migrated = true;
    }
    if (ensureExampleSalesOrders(parsed)) migrated = true;
    if (migrated) saveSalesOrdersRaw(parsed);
    return parsed;
  }

  function saveSalesOrdersRaw(salesOrders) {
    localStorage.setItem(SALES_ORDERS_KEY, JSON.stringify(salesOrders));
  }

  var _salesOrdersScope = scopeByOrg(getSalesOrdersRaw, saveSalesOrdersRaw);
  function getSalesOrders() { return _salesOrdersScope.getX(); }
  function getAllSalesOrders() { return _salesOrdersScope.getAllX(); }
  function getSalesOrdersByOrg(orgId) { return _salesOrdersScope.getXByOrg(orgId); }
  function saveSalesOrders(list) { return _salesOrdersScope.saveX(list); }

  function buildSeedBranches() {
    return LOCATIONS.concat(LOCATIONS).map(function (city, i) {
      var suffix = i >= LOCATIONS.length ? " " + (Math.floor(i / LOCATIONS.length) + 1) : "";
      return {
        id: i + 1,
        branchName: city + " Branch" + suffix,
        branchCode: "BR-" + (1000 + i * 7),
        address: (100 + i * 13) + " Main Road, " + city,
        status: i % 7 === 0 ? "Inactive" : "Active",
        createdDate: seedCreatedDate(i)
      };
    });
  }

  var EXAMPLE_BRANCHES = [
    { id: 1001, branchName: "Northbridge Main Branch", branchCode: "BR-9001", address: "12 Anna Salai, Salem", orgId: "TENANT01", members: [], farms: [1001], traders: [1001] },
    { id: 1002, branchName: "Sunrise Main Branch", branchCode: "BR-9002", address: "45 Race Course Road, Coimbatore", orgId: "TENANT02", members: [], farms: [1002], traders: [1002] },
    { id: 1003, branchName: "Golden Harvest Main Branch", branchCode: "BR-9003", address: "8 Town Hall Road, Madurai", orgId: "TENANT03", members: [], farms: [1003], traders: [1003] },
    { id: 1004, branchName: "Green Valley Main Branch", branchCode: "BR-9004", address: "20 Trichy Main Road, Trichy", orgId: "TENANT04", members: [], farms: [1004], traders: [1004] }
  ];

  function ensureExampleBranches(list) {
    var added = false;
    EXAMPLE_BRANCHES.forEach(function (b) {
      if (list.some(function (x) { return x.id === b.id; })) return;
      list.push(Object.assign({ status: "Active", createdDate: "05 Sep 2026" }, b));
      added = true;
    });
    return added;
  }

  function getBranchesRaw() {
    var raw = localStorage.getItem(BRANCHES_KEY);
    var list;
    var migrated = false;
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { list = buildSeedBranches(); migrated = true; }
    } else {
      list = buildSeedBranches();
      migrated = true;
    }
    if (ensureExampleBranches(list)) migrated = true;
    if (migrated) saveBranchesRaw(list);
    return list;
  }

  function saveBranchesRaw(branches) {
    localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  }

  var _branchesScope = scopeByOrg(getBranchesRaw, saveBranchesRaw);
  function getBranches() { return _branchesScope.getX(); }
  function getAllBranches() { return _branchesScope.getAllX(); }
  function getBranchesByOrg(orgId) { return _branchesScope.getXByOrg(orgId); }
  function saveBranches(list) { return _branchesScope.saveX(list); }

  var PRODUCT_CATEGORIES = ["Poultry", "Feed", "Medicine", "Equipment"];

  function buildSeedProducts() {
    return PRODUCTS.map(function (name, i) {
      return {
        id: i + 1,
        productName: name,
        productCode: "PRD-" + (1000 + i * 7),
        category: PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length],
        status: i % 5 === 0 ? "Inactive" : "Active",
        createdDate: seedCreatedDate(i)
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
      role: "",
      orgId: "POULTRY",
      companyName: "Poultry Pvt Ltd",
      companyWebsite: "www.poultry.com",
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

  /* Seeds one demo tenant whose orgId matches DEFAULT_ORG_ID, so it owns
     all the pre-existing Farm/Trader/Branch/Machine/Bill/Sales
     Order/User seed data (they all default to DEFAULT_ORG_ID when they
     have no orgId of their own) — clicking into it from Tenant Admin
     shows that data as a ready-made example instead of an empty tenant. */
  function buildSeedOrganizations() {
    return [{
      orgId: DEFAULT_ORG_ID,
      username: "poultry_admin",
      email: "admin@poultry.com",
      password: "poultry123",
      companyName: "Poultry Pvt Ltd",
      companyWebsite: "www.poultry.com",
      contactNumber: "9840000000",
      teamSize: "11-50",
      status: "Active",
      createdAt: new Date().toISOString()
    }];
  }

  function ensureExampleTenants(orgs) {
    var added = false;
    EXAMPLE_TENANTS.forEach(function (t, i) {
      var exists = orgs.some(function (o) { return o.orgId === t.orgId; });
      if (exists) return;
      orgs.push({
        orgId: t.orgId,
        username: t.username,
        email: t.email,
        password: t.password,
        companyName: t.companyName,
        companyWebsite: t.companyWebsite,
        contactNumber: t.contactNumber,
        teamSize: t.teamSize,
        status: "Active",
        createdAt: new Date(Date.now() - (EXAMPLE_TENANTS.length - i) * 86400000).toISOString()
      });
      added = true;
    });
    return added;
  }

  function getOrganizations() {
    var raw = localStorage.getItem(ORGANIZATIONS_KEY);
    var orgs;
    var migrated = false;
    if (raw) {
      try {
        orgs = JSON.parse(raw);
        orgs.forEach(function (o) {
          if (o.status === "Inactive") { o.status = "Suspended"; migrated = true; }
        });
      } catch (e) {
        orgs = buildSeedOrganizations();
        migrated = true;
      }
    } else {
      orgs = buildSeedOrganizations();
      migrated = true;
    }
    if (ensureExampleTenants(orgs)) migrated = true;
    if (migrated) saveOrganizations(orgs);
    return orgs;
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

  function getMachinesRaw() {
    var raw = localStorage.getItem(MACHINES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    var seeded = buildSeedMachines();
    saveMachinesRaw(seeded);
    return seeded;
  }

  function saveMachinesRaw(machines) {
    localStorage.setItem(MACHINES_KEY, JSON.stringify(machines));
  }

  var _machinesScope = scopeByOrg(getMachinesRaw, saveMachinesRaw);
  function getMachines() { return _machinesScope.getX(); }
  function getAllMachines() { return _machinesScope.getAllX(); }
  function getMachinesByOrg(orgId) { return _machinesScope.getXByOrg(orgId); }
  function saveMachines(list) { return _machinesScope.saveX(list); }

  /* ---------------- Role permissions (Roles & Permissions page) ----------
     Keyed by role name (the same open-ended list as Data.getUserRoles),
     so { "Admin": {...}, "Manager": {...} }. Each role's permissions
     object has the same shape as a module's CRUD + field permissions. */

  function getRolePermissions() {
    var raw = localStorage.getItem(ROLE_PERMISSIONS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through */ }
    }
    return {};
  }

  function saveRolePermissions(rolePermissions) {
    localStorage.setItem(ROLE_PERMISSIONS_KEY, JSON.stringify(rolePermissions));
  }

  /* ---------------- Effective permissions ----------------
     Resolves the CRUD permissions that apply to the current
     session for a given module, based on the profile's assigned
     role. No role assigned (or a role with no saved permissions
     yet) falls back to full access so the app stays usable out of
     the box — restrictions only kick in once an admin actually
     configures a role on the Roles & Permissions page and the
     signed-in profile is assigned that role. */

  function getModulePermissions(moduleKey) {
    var fullAccess = { create: true, read: true, update: true, delete: true, fields: null };
    var profile = getProfile();
    if (!profile.role) return fullAccess;

    var rolePermissions = getRolePermissions();
    var matched = rolePermissions[profile.role];
    if (!matched) return fullAccess;

    var modulePerms = matched[moduleKey];
    if (!modulePerms) return fullAccess;

    return {
      create: !!modulePerms.create,
      read: !!modulePerms.read,
      update: !!modulePerms.update,
      delete: !!modulePerms.delete,
      fields: modulePerms.fields || null
    };
  }

  /* ---------------- App-wide settings (Settings page) ----------------
     sessionTimeoutMinutes: 0 means "never" (no auto-logout). Shared by
     every signed-in session — this is an org-wide setting, not per-user. */

  function getAppSettings() {
    var raw = localStorage.getItem(APP_SETTINGS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to default */ }
    }
    return { sessionTimeoutMinutes: 0 };
  }

  function saveAppSettings(settings) {
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
  }

  window.Data = {
    getUsers: getUsers,
    saveUsers: saveUsers,
    getAllUsers: getAllUsers,
    getUsersByOrg: getUsersByOrg,
    getUserRoles: getUserRoles,
    saveUserRoles: saveUserRoles,
    getTrades: getTrades,
    saveTrades: saveTrades,
    getBills: getBills,
    saveBills: saveBills,
    getAllBills: getAllBills,
    getBillsByOrg: getBillsByOrg,
    getProfile: getProfile,
    saveProfile: saveProfile,
    getRolePermissions: getRolePermissions,
    saveRolePermissions: saveRolePermissions,
    getFarmCodes: getFarmCodes,
    saveFarmCodes: saveFarmCodes,
    getAllFarmCodes: getAllFarmCodes,
    getFarmCodesByOrg: getFarmCodesByOrg,
    getTraderCodes: getTraderCodes,
    saveTraderCodes: saveTraderCodes,
    getAllTraderCodes: getAllTraderCodes,
    getTraderCodesByOrg: getTraderCodesByOrg,
    getSalesOrders: getSalesOrders,
    saveSalesOrders: saveSalesOrders,
    getAllSalesOrders: getAllSalesOrders,
    getSalesOrdersByOrg: getSalesOrdersByOrg,
    getBranches: getBranches,
    saveBranches: saveBranches,
    getAllBranches: getAllBranches,
    getBranchesByOrg: getBranchesByOrg,
    getProducts: getProducts,
    saveProducts: saveProducts,
    getOrganizations: getOrganizations,
    saveOrganizations: saveOrganizations,
    generateOrgId: generateOrgId,
    findOrganization: findOrganization,
    isUsernameTaken: isUsernameTaken,
    registerOrganization: registerOrganization,
    authenticateOrganization: authenticateOrganization,
    getMachines: getMachines,
    saveMachines: saveMachines,
    getAllMachines: getAllMachines,
    getMachinesByOrg: getMachinesByOrg,
    getModulePermissions: getModulePermissions,
    getAppSettings: getAppSettings,
    saveAppSettings: saveAppSettings
  };
})();
