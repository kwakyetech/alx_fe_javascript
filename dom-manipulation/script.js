// ==============================
// Global State
// ==============================
let quotes = [];
let selectedCategory = "all"; // filter state
let conflicts = []; // { id, local, server, choice: 'server'|'local' }
let syncTimer = null;

// ==============================
// Utilities & Storage
// ==============================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    const seed = [
      { text: "The best way to predict the future is to invent it.", category: "Motivation" },
      { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
      { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
    ].map(q => normalizeQuote(q.text, q.category, "local"));
    quotes = seed;
    saveQuotes();
  }
}
function nowIso() {
  return new Date().toISOString();
}
// Deterministic ID from normalized text (stable across devices)
function makeIdFromText(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "").slice(0, 64) || cryptoRandomId();
}
function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function normalizeQuote(text, category, source = "local") {
  const id = makeIdFromText(text);
  return { id, text, category: category || "General", updatedAt: nowIso(), source };
}
function setSyncStatus(message) {
  const el = document.getElementById("syncStatus");
  if (el) el.textContent = message;
}
function notify(message, type = "info") {
  const box = document.getElementById("notifications");
  const note = document.createElement("div");
  note.className = `note ${type === "warn" ? "warn" : "info"}`;
  note.textContent = message;
  box.prepend(note);
}

// ==============================
// Category Handling
// ==============================
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  select.appendChild(allOption);

  const categories = [...new Set(quotes.map(q => q.category))].sort((a,b)=>a.localeCompare(b));
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter && [...select.options].some(o => o.value === lastFilter)) {
    selectedCategory = lastFilter;
    select.value = lastFilter;
  } else {
    selectedCategory = "all";
    select.value = "all";
  }
}
function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  selectedCategory = select.value;
  localStorage.setItem("lastFilter", selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const target = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    target.innerHTML = "No quotes available for this category.";
    return;
  }
  const { text, category } = filtered[Math.floor(Math.random()*filtered.length)];
  target.innerHTML = `"${text}" — [${category}]`;
}
function showRandomQuote() {
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  const target = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    target.innerHTML = "No quotes available.";
    return;
  }
  const { text, category } = filtered[Math.floor(Math.random()*filtered.length)];
  target.innerHTML = `"${text}" — [${category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify({ text, category }));
}

// ==============================
// Add Quote Form
// ==============================
function createAddQuoteForm() {
  const mount = document.getElementById("addQuoteForm");

  const title = document.createElement("h2");
  title.textContent = "Add a New Quote";
  mount.appendChild(title);

  const form = document.createElement("form");
  form.id = "quoteForm";
  form.autocomplete = "off";
  mount.appendChild(form);

  const quoteRow = document.createElement("div");
  quoteRow.className = "row";
  form.appendChild(quoteRow);

  const quoteLabel = document.createElement("label");
  quoteLabel.htmlFor = "quoteText";
  quoteLabel.textContent = "Quote";
  quoteRow.appendChild(quoteLabel);

  const quoteInput = document.createElement("textarea");
  quoteInput.id = "quoteText";
  quoteInput.rows = 3;
  quoteInput.required = true;
  quoteRow.appendChild(quoteInput);

  const catRow = document.createElement("div");
  catRow.className = "row";
  form.appendChild(catRow);

  const catLabel = document.createElement("label");
  catLabel.htmlFor = "quoteCategory";
  catLabel.textContent = "Category";
  catRow.appendChild(catLabel);

  const catInput = document.createElement("input");
  catInput.type = "text";
  catInput.id = "quoteCategory";
  catInput.required = true;
  catRow.appendChild(catInput);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";
  form.appendChild(submitBtn);

  const helper = document.createElement("p");
  helper.className = "muted";
  helper.innerHTML = "Fill both fields and press “Add Quote”.";
  mount.appendChild(helper);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = quoteInput.value.trim();
    const category = catInput.value.trim();
    if (!text || !category) {
      helper.className = "error";
      helper.textContent = "Please provide both a quote and a category.";
      return;
    }
    const q = normalizeQuote(text, category, "local");
    // If an item with same id exists locally, update it (local edit)
    const i = quotes.findIndex(x => x.id === q.id);
    if (i >= 0) {
      quotes[i] = { ...q, updatedAt: nowIso() };
    } else {
      quotes.push(q);
    }
    saveQuotes();
    helper.className = "success";
    helper.textContent = "Quote added successfully!";
    form.reset();
    populateCategories();
    showRandomQuote();
  });
}

// ==============================
// Import / Export
// ==============================
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) return alert("Invalid JSON format.");
      const normalized = imported.map(q => normalizeQuote(q.text || q.quote || "", q.category || q.author || "Imported", "local"));
      // Merge by id (local wins because it's an explicit import)
      normalized.forEach(n => {
        const i = quotes.findIndex(x => x.id === n.id);
        if (i >= 0) quotes[i] = { ...n, updatedAt: nowIso() };
        else quotes.push(n);
      });
      saveQuotes();
      populateCategories();
      notify(`Imported ${normalized.length} quotes.`, "info");
    } catch {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ==============================
// Server Sync (Simulation)
// ==============================
// Fetch server quotes from a mock API and normalize to our schema
async function fetchQuotesFromServer() {
  // Using DummyJSON (public mock). Map author→category; attach source=server
  const url = "https://dummyjson.com/quotes?limit=10";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Server fetch failed");
  const data = await res.json();
  const list = Array.isArray(data.quotes) ? data.quotes : [];
  return list.map(item => {
    const text = item.quote || "";
    const category = item.author || "Server";
    const q = normalizeQuote(text, category, "server");
    return q;
  });
}

// Merge server list into local, detect conflicts.
// Conflict definition: same id exists AND (text OR category differs).
function mergeWithConflicts(serverList) {
  const newConflicts = [];
  const localMap = new Map(quotes.map(q => [q.id, q]));
  serverList.forEach(sq => {
    const lq = localMap.get(sq.id);
    if (!lq) {
      // New server item → add
      localMap.set(sq.id, sq);
    } else {
      const differs = lq.text !== sq.text || lq.category !== sq.category;
      if (differs) {
        // server-wins default
        newConflicts.push({
          id: sq.id,
          local: lq,
          server: sq,
          choice: "server"
        });
        localMap.set(sq.id, sq); // default application
      } else {
        // Same content: keep the most recent updatedAt (cosmetic)
        const newer = new Date(lq.updatedAt) > new Date(sq.updatedAt) ? lq : sq;
        localMap.set(sq.id, newer);
      }
    }
  });
  quotes = Array.from(localMap.values());
  return newConflicts;
}

async function syncNow() {
  setSyncStatus("Syncing…");
  try {
    const serverList = await fetchQuotesFromServer();
    const found = mergeWithConflicts(serverList);
    saveQuotes();
    populateCategories();
    filterQuotes();
    if (found.length > 0) {
      conflicts = mergeConflictQueues(conflicts, found);
      notify(`Sync complete with ${found.length} conflict(s). Server version applied by default.`, "warn");
    }
    setSyncStatus("Synced");
  } catch (err) {
    notify("Sync failed. Check your network and try again.", "warn");
    setSyncStatus("Error");
  } finally {
    // Return to Idle after a moment
    setTimeout(() => setSyncStatus("Idle"), 1500);
  }
}

// Keep any previously unresolved conflicts, update/append new ones by id
function mergeConflictQueues(existing, incoming) {
  const map = new Map(existing.map(c => [c.id, c]));
  incoming.forEach(c => {
    if (map.has(c.id)) {
      map.set(c.id, { ...map.get(c.id), ...c });
    } else {
      map.set(c.id, c);
    }
  });
  return Array.from(map.values());
}

// Periodic sync (every 30s)
function startAutoSync() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(() => {
    syncNow();
  }, 30000);
}

// ==============================
// Conflicts UI
// ==============================
function openConflictsPanel() {
  const panel = document.getElementById("conflictsPanel");
  const list = document.getElementById("conflictsList");
  list.innerHTML = "";

  if (conflicts.length === 0) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No conflicts detected.";
    list.appendChild(p);
  } else {
    conflicts.forEach((c, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "conflict-item";

      const title = document.createElement("strong");
      title.textContent = `Conflict #${idx + 1}`;
      wrap.appendChild(title);

      const localP = document.createElement("p");
      localP.innerHTML = `<em>Local:</em> "${c.local.text}" — [${c.local.category}]`;
      wrap.appendChild(localP);

      const serverP = document.createElement("p");
      serverP.innerHTML = `<em>Server:</em> "${c.server.text}" — [${c.server.category}]`;
      wrap.appendChild(serverP);

      const choiceRow = document.createElement("div");
      choiceRow.className = "row";
      const localId = `choice-${c.id}-local`;
      const serverId = `choice-${c.id}-server`;

      const localLabel = document.createElement("label");
      const localRadio = document.createElement("input");
      localRadio.type = "radio";
      localRadio.name = `choice-${c.id}`;
      localRadio.id = localId;
      localRadio.value = "local";
      if (c.choice === "local") localRadio.checked = true;
      localRadio.addEventListener("change", () => c.choice = "local");
      localLabel.htmlFor = localId;
      localLabel.textContent = "Keep Local";
      choiceRow.appendChild(localRadio);
      choiceRow.appendChild(localLabel);

      const serverLabel = document.createElement("label");
      const serverRadio = document.createElement("input");
      serverRadio.type = "radio";
      serverRadio.name = `choice-${c.id}`;
      serverRadio.id = serverId;
      serverRadio.value = "server";
      if (c.choice === "server") serverRadio.checked = true;
      serverRadio.addEventListener("change", () => c.choice = "server");
      serverLabel.htmlFor = serverId;
      serverLabel.textContent = "Use Server";
      choiceRow.appendChild(serverRadio);
      choiceRow.appendChild(serverLabel);

      wrap.appendChild(choiceRow);
      list.appendChild(wrap);
    });
  }

  panel.style.display = "block";
  panel.setAttribute("aria-hidden", "false");
}
function closeConflictsPanel() {
  const panel = document.getElementById("conflictsPanel");
  panel.style.display = "none";
  panel.setAttribute("aria-hidden", "true");
}
function applyResolutions() {
  if (conflicts.length === 0) {
    closeConflictsPanel();
    return;
  }
  const map = new Map(quotes.map(q => [q.id, q]));
  let appliedLocal = 0;
  conflicts.forEach(c => {
    if (c.choice === "local") {
      map.set(c.id, { ...c.local, updatedAt: nowIso(), source: "local" });
      appliedLocal++;
    } else {
      map.set(c.id, { ...c.server, updatedAt: nowIso(), source: "server" });
    }
  });
  quotes = Array.from(map.values());
  saveQuotes();
  populateCategories();
  filterQuotes();
  notify(`Applied resolutions. ${appliedLocal} kept local, ${conflicts.length - appliedLocal} kept server.`, "info");
  conflicts = [];
  closeConflictsPanel();
}

// ==============================
// Wiring
// ==============================
document.getElementById("randomBtn").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("syncNowBtn").addEventListener("click", syncNow);
document.getElementById("viewConflictsBtn").addEventListener("click", openConflictsPanel);
document.getElementById("applyResolutionsBtn").addEventListener("click", applyResolutions);
document.getElementById("closeConflictsBtn").addEventListener("click", closeConflictsPanel);

// Boot
loadQuotes();
createAddQuoteForm();
populateCategories();
// Restore last viewed
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const { text, category } = JSON.parse(lastQuote);
  document.getElementById("quoteDisplay").innerHTML = `"${text}" — [${category}]`;
} else {
  filterQuotes();
}
startAutoSync();
