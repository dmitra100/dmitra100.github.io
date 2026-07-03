(() => {
  "use strict";

  const STORAGE_KEY = "portfolioTrackerData";

  const CATEGORIES = {
    stocks_in: {
      label: "Indian Stocks", currency: "INR", mode: "qty", fetch: "yahoo_in",
      fields: [
        { key: "name", label: "Company Name", type: "text", required: true },
        { key: "symbol", label: "NSE Symbol", type: "text", placeholder: "e.g. RELIANCE" },
        { key: "qty", label: "Quantity", type: "number", required: true },
        { key: "avgPrice", label: "Avg. Buy Price (₹)", type: "number", required: true },
        { key: "currentPrice", label: "Current Price (₹)", type: "number", required: true },
      ],
    },
    etfs_in: {
      label: "Indian ETFs", currency: "INR", mode: "qty", fetch: "yahoo_in",
      fields: [
        { key: "name", label: "ETF Name", type: "text", required: true },
        { key: "symbol", label: "NSE Symbol", type: "text", placeholder: "e.g. NIFTYBEES" },
        { key: "qty", label: "Quantity", type: "number", required: true },
        { key: "avgPrice", label: "Avg. Buy Price (₹)", type: "number", required: true },
        { key: "currentPrice", label: "Current Price (₹)", type: "number", required: true },
      ],
    },
    mutual_funds: {
      label: "Mutual Funds", currency: "INR", mode: "qty", fetch: "mfapi",
      fields: [
        { key: "name", label: "Fund Name", type: "text", required: true },
        { key: "schemeCode", label: "MFAPI Scheme Code", type: "text", placeholder: "e.g. 119551" },
        { key: "qty", label: "Units", type: "number", required: true },
        { key: "avgPrice", label: "Avg. NAV (₹)", type: "number", required: true },
        { key: "currentPrice", label: "Current NAV (₹)", type: "number", required: true },
      ],
    },
    global: {
      label: "Global Stocks/ETFs", currency: "USD", mode: "qty", fetch: "yahoo_us",
      fields: [
        { key: "name", label: "Name", type: "text", required: true },
        { key: "symbol", label: "Ticker Symbol", type: "text", placeholder: "e.g. AAPL, VOO" },
        { key: "qty", label: "Quantity", type: "number", required: true },
        { key: "avgPrice", label: "Avg. Buy Price ($)", type: "number", required: true },
        { key: "currentPrice", label: "Current Price ($)", type: "number", required: true },
      ],
    },
    rsu: {
      label: "RSU", currency: "USD", mode: "qty", fetch: "yahoo_us",
      fields: [
        { key: "name", label: "Company", type: "text", required: true },
        { key: "symbol", label: "Ticker Symbol", type: "text", placeholder: "e.g. MSFT" },
        { key: "qty", label: "Vested Units", type: "number", required: true },
        { key: "avgPrice", label: "Grant Price ($)", type: "number", required: true },
        { key: "currentPrice", label: "Current Price ($)", type: "number", required: true },
      ],
    },
    bonds: {
      label: "Bonds", currency: "INR", mode: "amount",
      fields: [
        { key: "name", label: "Bond Name", type: "text", required: true },
        { key: "investedAmount", label: "Invested Amount (₹)", type: "number", required: true },
        { key: "currentValue", label: "Current Value (₹)", type: "number", required: true },
        { key: "rate", label: "Interest Rate (%)", type: "number" },
        { key: "maturityDate", label: "Maturity Date", type: "date" },
      ],
    },
    fd: {
      label: "Fixed Deposits", currency: "INR", mode: "fd",
      fields: [
        { key: "name", label: "Bank / FD Name", type: "text", required: true },
        { key: "investedAmount", label: "Principal (₹)", type: "number", required: true },
        { key: "rate", label: "Interest Rate (% p.a.)", type: "number", required: true },
        { key: "startDate", label: "Start Date", type: "date", required: true },
        { key: "maturityDate", label: "Maturity Date", type: "date", required: true },
      ],
    },
    epf: {
      label: "EPF", currency: "INR", mode: "amount",
      fields: [
        { key: "name", label: "Account / Employer", type: "text", required: true },
        { key: "investedAmount", label: "Total Contribution (₹)", type: "number" },
        { key: "currentValue", label: "Current Balance (₹)", type: "number", required: true },
      ],
    },
    nps: {
      label: "NPS", currency: "INR", mode: "amount",
      fields: [
        { key: "name", label: "Account (Tier I/II)", type: "text", required: true },
        { key: "investedAmount", label: "Total Contribution (₹)", type: "number" },
        { key: "currentValue", label: "Current Balance (₹)", type: "number", required: true },
      ],
    },
    gold_silver: {
      label: "Gold / Silver", currency: "INR", mode: "qty", fetch: "metal",
      fields: [
        { key: "name", label: "Description", type: "text", required: true, placeholder: "e.g. Gold Coins" },
        { key: "metal", label: "Metal", type: "select", options: ["Gold", "Silver"], required: true },
        { key: "qty", label: "Quantity (grams)", type: "number", required: true },
        { key: "avgPrice", label: "Avg. Buy Price (₹/gram)", type: "number", required: true },
        { key: "currentPrice", label: "Current Price (₹/gram)", type: "number", required: true },
      ],
    },
    real_estate: {
      label: "Real Estate", currency: "INR", mode: "amount",
      fields: [
        { key: "name", label: "Property Name / Location", type: "text", required: true },
        { key: "investedAmount", label: "Purchase Value (₹)", type: "number", required: true },
        { key: "currentValue", label: "Current Est. Value (₹)", type: "number", required: true },
      ],
    },
  };

  const CATEGORY_ORDER = Object.keys(CATEGORIES);

  // ---------- Persistence ----------

  function defaultData() {
    const holdings = {};
    CATEGORY_ORDER.forEach((k) => (holdings[k] = []));
    return { holdings, settings: { usdInr: 83 }, snapshots: [] };
  }

  let state = loadData();

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData();
      const parsed = JSON.parse(raw);
      const merged = defaultData();
      merged.settings = { ...merged.settings, ...(parsed.settings || {}) };
      merged.snapshots = Array.isArray(parsed.snapshots) ? parsed.snapshots : [];
      CATEGORY_ORDER.forEach((k) => {
        if (Array.isArray(parsed.holdings && parsed.holdings[k])) {
          merged.holdings[k] = parsed.holdings[k];
        }
      });
      return merged;
    } catch (e) {
      console.warn("Failed to load stored data, starting fresh.", e);
      return defaultData();
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // ---------- Computation ----------

  function computeHolding(catKey, h) {
    const cat = CATEGORIES[catKey];
    let invested = 0, current = 0;
    if (cat.mode === "qty") {
      invested = (Number(h.qty) || 0) * (Number(h.avgPrice) || 0);
      current = (Number(h.qty) || 0) * (Number(h.currentPrice) || 0);
    } else if (cat.mode === "amount") {
      invested = Number(h.investedAmount) || 0;
      current = Number(h.currentValue) || 0;
    } else if (cat.mode === "fd") {
      invested = Number(h.investedAmount) || 0;
      current = computeFdValue(h);
    }
    if (cat.currency === "USD") {
      const rate = Number(state.settings.usdInr) || 83;
      invested *= rate;
      current *= rate;
    }
    return { invested, current };
  }

  function computeFdValue(h) {
    const p = Number(h.investedAmount) || 0;
    const r = Number(h.rate) || 0;
    const start = new Date(h.startDate);
    const maturity = new Date(h.maturityDate);
    if (isNaN(start.getTime()) || isNaN(maturity.getTime())) return p;
    const msPerYear = 365.25 * 86400000;
    const tenureYears = Math.max((maturity - start) / msPerYear, 0);
    const elapsedYears = Math.min(Math.max((Date.now() - start) / msPerYear, 0), tenureYears);
    return p * Math.pow(1 + r / 100, elapsedYears);
  }

  function allTotals() {
    const perCategory = {};
    let invested = 0, current = 0;
    CATEGORY_ORDER.forEach((k) => {
      let ci = 0, cc = 0;
      (state.holdings[k] || []).forEach((h) => {
        const { invested: i, current: c } = computeHolding(k, h);
        ci += i; cc += c;
      });
      perCategory[k] = { invested: ci, current: cc };
      invested += ci; current += cc;
    });
    return { perCategory, invested, current };
  }

  // ---------- Formatting ----------

  function fmtINR(n) {
    if (!isFinite(n)) n = 0;
    return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  }
  function fmtPct(n) {
    if (!isFinite(n)) return "0.0%";
    return n.toFixed(1) + "%";
  }

  // ---------- Toast ----------

  let toastTimer = null;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
  }

  // ---------- Tabs ----------

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      if (btn.dataset.tab === "dashboard") renderDashboard();
    });
  });

  // ---------- Holdings tab ----------

  const categorySelect = document.getElementById("category-select");
  CATEGORY_ORDER.forEach((k) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = CATEGORIES[k].label;
    categorySelect.appendChild(opt);
  });
  categorySelect.addEventListener("change", renderHoldingsTable);

  function currentCategory() {
    return categorySelect.value;
  }

  function renderHoldingsTable() {
    const catKey = currentCategory();
    const cat = CATEGORIES[catKey];
    const thead = document.querySelector("#holdings-table thead");
    const tbody = document.querySelector("#holdings-table tbody");
    const fetchNote = document.getElementById("fetch-note");
    const refreshBtn = document.getElementById("btn-refresh-category");

    refreshBtn.style.display = cat.fetch ? "" : "none";
    fetchNote.textContent = cat.fetch
      ? "Live price refresh available for this category."
      : "Manual entry only for this category.";

    const headerCells = cat.fields.map((f) => `<th>${f.label}</th>`).join("");
    thead.innerHTML = `<tr>${headerCells}<th>Invested</th><th>Current Value</th><th>Gain/Loss</th><th></th></tr>`;

    const rows = state.holdings[catKey] || [];
    document.getElementById("empty-state").style.display = rows.length ? "none" : "";

    tbody.innerHTML = rows
      .map((h) => {
        const { invested, current } = computeHolding(catKey, h);
        const gain = current - invested;
        const gainPct = invested ? (gain / invested) * 100 : 0;
        const gainClass = gain >= 0 ? "positive" : "negative";
        const cells = cat.fields
          .map((f) => `<td>${escapeHtml(h[f.key] ?? "")}</td>`)
          .join("");
        return `<tr data-id="${h.id}">
          ${cells}
          <td>${fmtINR(invested)}</td>
          <td>${fmtINR(current)}</td>
          <td class="${gainClass}">${gain >= 0 ? "+" : ""}${fmtINR(gain)} (${gainPct.toFixed(1)}%)</td>
          <td class="row-actions">
            <button class="edit" data-action="edit">Edit</button>
            <button class="del" data-action="del">Delete</button>
          </td>
        </tr>`;
      })
      .join("");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  document.querySelector("#holdings-table tbody").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const tr = e.target.closest("tr");
    const id = tr.dataset.id;
    const catKey = currentCategory();
    if (btn.dataset.action === "del") {
      if (confirm("Delete this holding?")) {
        state.holdings[catKey] = state.holdings[catKey].filter((h) => h.id !== id);
        saveData();
        renderHoldingsTable();
      }
    } else if (btn.dataset.action === "edit") {
      openHoldingDialog(catKey, state.holdings[catKey].find((h) => h.id === id));
    }
  });

  document.getElementById("btn-add-holding").addEventListener("click", () => {
    openHoldingDialog(currentCategory(), null);
  });

  // ---------- Dialog / form ----------

  const dialog = document.getElementById("holding-dialog");
  const dialogFields = document.getElementById("dialog-fields");
  const dialogTitle = document.getElementById("dialog-title");
  const holdingForm = document.getElementById("holding-form");
  let editingId = null;
  let editingCategory = null;

  function openHoldingDialog(catKey, holding) {
    editingCategory = catKey;
    editingId = holding ? holding.id : null;
    const cat = CATEGORIES[catKey];
    dialogTitle.textContent = (holding ? "Edit " : "Add ") + cat.label;
    dialogFields.innerHTML = cat.fields
      .map((f) => {
        const val = holding ? holding[f.key] ?? "" : "";
        if (f.type === "select") {
          const opts = f.options
            .map((o) => `<option value="${o}" ${val === o ? "selected" : ""}>${o}</option>`)
            .join("");
          return `<div class="field-row">
            <label>${f.label}</label>
            <select name="${f.key}" ${f.required ? "required" : ""}>${opts}</select>
          </div>`;
        }
        return `<div class="field-row">
          <label>${f.label}</label>
          <input type="${f.type}" name="${f.key}" value="${escapeHtml(val)}"
            ${f.placeholder ? `placeholder="${f.placeholder}"` : ""}
            ${f.type === "number" ? 'step="any"' : ""}
            ${f.required ? "required" : ""}>
        </div>`;
      })
      .join("");
    dialog.showModal();
  }

  document.getElementById("btn-cancel-dialog").addEventListener("click", () => dialog.close());

  holdingForm.addEventListener("submit", (e) => {
    const cat = CATEGORIES[editingCategory];
    const formData = new FormData(holdingForm);
    const record = editingId ? { ...state.holdings[editingCategory].find((h) => h.id === editingId) } : { id: crypto.randomUUID() };
    cat.fields.forEach((f) => {
      const v = formData.get(f.key);
      record[f.key] = f.type === "number" ? (v === "" ? "" : Number(v)) : v;
    });
    if (!editingId) {
      state.holdings[editingCategory].push(record);
    } else {
      const idx = state.holdings[editingCategory].findIndex((h) => h.id === editingId);
      state.holdings[editingCategory][idx] = record;
    }
    saveData();
    renderHoldingsTable();
    renderDashboard();
  });

  // ---------- Live price fetching ----------

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
    ]);
  }

  async function fetchPrice(catKey, h) {
    const cat = CATEGORIES[catKey];
    if (!cat.fetch) return null;
    try {
      if (cat.fetch === "yahoo_in" || cat.fetch === "yahoo_us") {
        if (!h.symbol) return null;
        const symbol = cat.fetch === "yahoo_in" ? `${h.symbol}.NS` : h.symbol;
        const res = await withTimeout(
          fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`),
          8000
        );
        const data = await res.json();
        const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
        return typeof price === "number" ? price : null;
      }
      if (cat.fetch === "mfapi") {
        if (!h.schemeCode) return null;
        const res = await withTimeout(
          fetch(`https://api.mfapi.in/mf/${encodeURIComponent(h.schemeCode)}/latest`),
          8000
        );
        const data = await res.json();
        const nav = data?.data?.[0]?.nav;
        return nav ? parseFloat(nav) : null;
      }
      if (cat.fetch === "metal") {
        const symbol = h.metal === "Silver" ? "XAG" : "XAU";
        const res = await withTimeout(fetch(`https://api.gold-api.com/price/${symbol}`), 8000);
        const data = await res.json();
        if (typeof data?.price !== "number") return null;
        const rate = Number(state.settings.usdInr) || 83;
        return (data.price / 31.1034768) * rate; // per gram, INR
      }
    } catch (e) {
      console.warn("Live price fetch failed:", catKey, h.name || h.symbol, e);
      return null;
    }
    return null;
  }

  async function refreshCategory(catKey, { quiet } = {}) {
    const cat = CATEGORIES[catKey];
    if (!cat.fetch) return { ok: 0, fail: 0 };
    let ok = 0, fail = 0;
    for (const h of state.holdings[catKey] || []) {
      const price = await fetchPrice(catKey, h);
      if (price !== null) {
        h.currentPrice = Math.round(price * 100) / 100;
        ok++;
      } else {
        fail++;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    saveData();
    if (!quiet) toast(`${cat.label}: ${ok} updated, ${fail} failed/skipped`);
    return { ok, fail };
  }

  document.getElementById("btn-refresh-category").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    await refreshCategory(currentCategory());
    renderHoldingsTable();
    renderDashboard();
    btn.disabled = false;
  });

  document.getElementById("btn-refresh-all").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    const statusEl = document.getElementById("refresh-status");
    let totalOk = 0, totalFail = 0;
    for (const k of CATEGORY_ORDER) {
      if (!CATEGORIES[k].fetch) continue;
      statusEl.textContent = `Refreshing ${CATEGORIES[k].label}...`;
      const { ok, fail } = await refreshCategory(k, { quiet: true });
      totalOk += ok; totalFail += fail;
    }
    statusEl.textContent = `Done: ${totalOk} prices updated, ${totalFail} failed/skipped.`;
    renderHoldingsTable();
    renderDashboard();
    btn.disabled = false;
  });

  // ---------- Settings ----------

  const usdInrInput = document.getElementById("usd-inr-rate");
  usdInrInput.value = state.settings.usdInr;
  usdInrInput.addEventListener("change", () => {
    state.settings.usdInr = Number(usdInrInput.value) || 83;
    saveData();
    renderDashboard();
  });

  document.getElementById("btn-fetch-rate").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      const res = await withTimeout(fetch("https://api.frankfurter.app/latest?from=USD&to=INR"), 8000);
      const data = await res.json();
      const rate = data?.rates?.INR;
      if (rate) {
        usdInrInput.value = rate;
        state.settings.usdInr = rate;
        saveData();
        renderDashboard();
        toast(`USD/INR rate updated to ${rate}`);
      } else {
        toast("Could not read rate from response.");
      }
    } catch (err) {
      toast("Live rate fetch failed — enter it manually.");
    }
    btn.disabled = false;
  });

  document.getElementById("btn-export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("btn-import").addEventListener("click", () => {
    document.getElementById("import-file").click();
  });
  document.getElementById("import-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const merged = defaultData();
        merged.settings = { ...merged.settings, ...(parsed.settings || {}) };
        merged.snapshots = Array.isArray(parsed.snapshots) ? parsed.snapshots : [];
        CATEGORY_ORDER.forEach((k) => {
          if (Array.isArray(parsed.holdings && parsed.holdings[k])) merged.holdings[k] = parsed.holdings[k];
        });
        state = merged;
        saveData();
        usdInrInput.value = state.settings.usdInr;
        renderHoldingsTable();
        renderDashboard();
        toast("Data imported successfully.");
      } catch (err) {
        toast("Import failed: invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  document.getElementById("btn-clear").addEventListener("click", () => {
    if (confirm("This will permanently delete all holdings, snapshots and settings from this browser. Continue?")) {
      state = defaultData();
      saveData();
      usdInrInput.value = state.settings.usdInr;
      renderHoldingsTable();
      renderDashboard();
      toast("All data cleared.");
    }
  });

  document.getElementById("btn-snapshot").addEventListener("click", () => {
    const { current } = allTotals();
    const today = new Date().toISOString().slice(0, 10);
    const existing = state.snapshots.find((s) => s.date === today);
    if (existing) existing.netWorth = current;
    else state.snapshots.push({ date: today, netWorth: current });
    state.snapshots.sort((a, b) => a.date.localeCompare(b.date));
    saveData();
    renderDashboard();
    toast("Snapshot saved for " + today);
  });

  // ---------- Dashboard ----------

  let allocationChart = null;
  let trendChart = null;

  function renderDashboard() {
    const { perCategory, invested, current } = allTotals();
    const gain = current - invested;
    const gainPct = invested ? (gain / invested) * 100 : 0;

    const cardsEl = document.getElementById("summary-cards");
    cardsEl.innerHTML = `
      <div class="card">
        <div class="label">Total Net Worth</div>
        <div class="value">${fmtINR(current)}</div>
      </div>
      <div class="card">
        <div class="label">Total Invested</div>
        <div class="value">${fmtINR(invested)}</div>
      </div>
      <div class="card">
        <div class="label">Total Gain/Loss</div>
        <div class="value ${gain >= 0 ? "positive" : "negative"}">${gain >= 0 ? "+" : ""}${fmtINR(gain)}</div>
        <div class="sub ${gain >= 0 ? "positive" : "negative"}">${gainPct.toFixed(1)}%</div>
      </div>
    `;

    // breakdown table
    const tbody = document.querySelector("#breakdown-table tbody");
    tbody.innerHTML = CATEGORY_ORDER
      .filter((k) => (state.holdings[k] || []).length > 0)
      .map((k) => {
        const { invested: i, current: c } = perCategory[k];
        const g = c - i;
        const pctOfPortfolio = current ? (c / current) * 100 : 0;
        return `<tr>
          <td>${CATEGORIES[k].label}</td>
          <td>${fmtINR(i)}</td>
          <td>${fmtINR(c)}</td>
          <td class="${g >= 0 ? "positive" : "negative"}">${g >= 0 ? "+" : ""}${fmtINR(g)}</td>
          <td>${fmtPct(pctOfPortfolio)}</td>
        </tr>`;
      })
      .join("") || `<tr><td colspan="5" class="hint">No holdings added yet.</td></tr>`;

    renderAllocationChart(perCategory);
    renderTrendChart();
  }

  function renderAllocationChart(perCategory) {
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("allocationChart");
    const labels = [];
    const values = [];
    CATEGORY_ORDER.forEach((k) => {
      const v = perCategory[k].current;
      if (v > 0) {
        labels.push(CATEGORIES[k].label);
        values.push(Math.round(v));
      }
    });
    if (allocationChart) allocationChart.destroy();
    if (!labels.length) return;
    allocationChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            "#2f6fed", "#17a673", "#f2a93b", "#e5484d", "#8b5cf6",
            "#06b6d4", "#f472b6", "#84cc16", "#f97316", "#64748b", "#0ea5e9",
          ],
        }],
      },
      options: {
        plugins: { legend: { position: "right" } },
        maintainAspectRatio: false,
      },
    });
  }

  function renderTrendChart() {
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("trendChart");
    if (trendChart) trendChart.destroy();
    if (!state.snapshots.length) return;
    trendChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: state.snapshots.map((s) => s.date),
        datasets: [{
          label: "Net Worth",
          data: state.snapshots.map((s) => s.netWorth),
          borderColor: "#2f6fed",
          backgroundColor: "rgba(47,111,237,0.15)",
          fill: true,
          tension: 0.25,
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: (v) => fmtINR(v) } } },
      },
    });
  }

  // ---------- Init ----------

  renderHoldingsTable();
  renderDashboard();
})();
