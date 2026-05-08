const baseResources = window.AI_RESOURCES || [];
const xOembedResources = (window.X_OEMBED_RECORDS || [])
  .filter((record) => record.status === "ok" && record.text)
  .map(xRecordToResource);
const resources = [...baseResources, ...xOembedResources];

const els = {
  search: document.querySelector("#searchInput"),
  theme: document.querySelector("#themeFilter"),
  status: document.querySelector("#statusFilter"),
  freshness: document.querySelector("#freshnessFilter"),
  cards: document.querySelector("#cards"),
  statusStrip: document.querySelector("#statusStrip"),
  summaryGrid: document.querySelector("#summaryGrid"),
  conceptCloud: document.querySelector("#conceptCloud")
};

const uniq = (items) => [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));

function optionList(select, label, values) {
  select.innerHTML = [`<option value="">${label}</option>`, ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)].join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function chipClass(value) {
  const text = String(value).toLowerCase();
  if (text.includes("lu") || text.includes("actuel") || text.includes("forte")) return "green";
  if (text.includes("partiel") || text.includes("moyenne") || text.includes("vivant")) return "blue";
  if (text.includes("verifier") || text.includes("page reperee")) return "amber";
  if (text.includes("inaccessible") || text.includes("obsolete") || text.includes("faible")) return "red";
  return "blue";
}

function normalizeTweetUrl(url) {
  return String(url || "")
    .replace("https://twitter.com/", "https://x.com/")
    .replace(/\?.*$/, "");
}

function matchingGroup(record) {
  const recordUrl = normalizeTweetUrl(record.url);
  return baseResources.find((item) => {
    const links = item.links || [item.url, item.canonicalUrl];
    return links.some((link) => normalizeTweetUrl(link) === recordUrl);
  });
}

function inferTweetConcepts(text, group) {
  const lower = text.toLowerCase();
  const concepts = new Set(["tweet lu", "veille X"]);
  for (const concept of group?.keyConcepts || []) concepts.add(concept);

  const rules = [
    ["mcp", "MCP"],
    ["agent", "agents"],
    ["browser", "browser automation"],
    ["claude", "Claude"],
    ["openai", "OpenAI"],
    ["ollama", "Ollama"],
    ["scrap", "scraping"],
    ["ocr", "OCR"],
    ["pdf", "PDF"],
    ["seo", "SEO"],
    ["shopify", "Shopify"],
    ["design", "design"],
    ["airdrop", "airdrop"],
    ["crypto", "crypto"],
    ["tax", "fiscalite"],
    ["markdown", "Markdown"],
    ["wordpress", "WordPress"],
    ["github", "GitHub"]
  ];

  for (const [needle, concept] of rules) {
    if (lower.includes(needle)) concepts.add(concept);
  }

  return [...concepts].slice(0, 8);
}

function xRecordToResource(record) {
  const group = matchingGroup(record);
  const text = record.text.trim();
  const titleText = text.split("\n").find(Boolean) || "Tweet sans texte";
  const title = `${record.authorName || "X"} - ${titleText.slice(0, 72)}${titleText.length > 72 ? "..." : ""}`;
  const theme = group?.theme || "Tweets lus / a classifier";

  return {
    id: `tweet-${record.id}`,
    title,
    url: record.url,
    canonicalUrl: record.url,
    sourceType: "X oEmbed",
    sourceDate: record.publishedDate || "",
    collectedDate: "2026-05-08",
    lastVerified: "2026-05-08",
    theme,
    status: "tweet lu via oEmbed",
    freshness: group?.freshness || "a qualifier",
    confidence: "moyenne",
    summary: text,
    fullText: text,
    keyConcepts: inferTweetConcepts(text, group),
    whatToLearn: "Extraire du tweet une competence precise : outil, methode, promesse, limite, preuve et contexte d'utilisation.",
    action30: "Transformer ce tweet en fiche action : 5 lignes de resume, 3 concepts, 1 test realisable, 1 critere de validation.",
    miniProject: group?.miniProject || "Creer une fiche de veille actionnable a partir du tweet et la relier a une competence.",
    risks: ["oEmbed recupere le texte visible mais pas toujours les medias ou threads complets", "Verifier les liens externes et sources primaires", "Ne pas traiter un claim viral comme une preuve"],
    contentFile: "data/extracted_content/x-oembed.md"
  };
}

function render() {
  const q = els.search.value.trim().toLowerCase();
  const filtered = resources.filter((item) => {
    const haystack = [
      item.title,
      item.theme,
      item.status,
      item.freshness,
      item.summary,
      item.whatToLearn,
      item.action30,
      ...(item.keyConcepts || [])
    ].join(" ").toLowerCase();

    return (!q || haystack.includes(q)) &&
      (!els.theme.value || item.theme === els.theme.value) &&
      (!els.status.value || item.status === els.status.value) &&
      (!els.freshness.value || item.freshness === els.freshness.value);
  });

  renderStats(filtered);
  renderConcepts(filtered);
  renderCards(filtered);
}

function renderStats(items) {
  const read = items.filter((item) => item.status.includes("lu") || item.status.includes("mail")).length;
  const blocked = items.filter((item) => item.status.includes("inaccessible")).length;
  const toVerify = items.filter((item) => item.freshness.includes("verifier") || item.freshness.includes("obsolete")).length;
  const actions = items.filter((item) => item.action30).length;

  els.statusStrip.innerHTML = [
    chip(`${resources.length} ressources`, "blue"),
    chip(`${read} lues`, "green"),
    chip(`${blocked} X bloquees`, "red"),
    chip(`${toVerify} a verifier`, "amber")
  ].join("");

  els.summaryGrid.innerHTML = [
    stat(items.length, "affichees"),
    stat(read, "contenu lu/mail lu"),
    stat(toVerify, "fraicheur a traiter"),
    stat(actions, "actions 30 min")
  ].join("");
}

function stat(number, label) {
  return `<div class="stat"><strong>${number}</strong><span>${escapeHtml(label)}</span></div>`;
}

function chip(label, color) {
  return `<span class="chip ${color}">${escapeHtml(label)}</span>`;
}

function renderConcepts(items) {
  const counts = new Map();
  for (const item of items) {
    for (const concept of item.keyConcepts || []) {
      counts.set(concept, (counts.get(concept) || 0) + 1);
    }
  }
  const concepts = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
    .slice(0, 24);

  els.conceptCloud.innerHTML = concepts.map(([concept, count]) => chip(`${concept} (${count})`, count > 1 ? "green" : "blue")).join("");
}

function renderCards(items) {
  els.cards.innerHTML = items.map((item) => {
    const links = item.links || [item.canonicalUrl || item.url];
    const safeLinks = links.map((url, index) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">lien ${index + 1}</a>`).join("");
    const concepts = (item.keyConcepts || []).map((concept) => chip(concept, "blue")).join("");
    const risks = (item.risks || []).map((risk) => `<li>${escapeHtml(risk)}</li>`).join("");

    return `
      <article class="card">
        <div class="card-head">
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p class="meta">${escapeHtml(item.theme)} · source ${escapeHtml(item.sourceType)} · verifie ${escapeHtml(item.lastVerified)}</p>
          </div>
          <div class="status-strip">
            ${chip(item.status, chipClass(item.status))}
            ${chip(item.freshness, chipClass(item.freshness))}
            ${chip(`confiance ${item.confidence}`, chipClass(item.confidence))}
          </div>
        </div>
        <p class="${item.fullText ? "content-text" : ""}">${escapeHtml(item.summary)}</p>
        <div class="links">${safeLinks}</div>
        <div class="concept-cloud">${concepts}</div>
        <div class="card-grid">
          <div class="block">
            <div class="block-title">A apprendre</div>
            <p>${escapeHtml(item.whatToLearn)}</p>
          </div>
          <div class="block">
            <div class="block-title">Action 30 min</div>
            <p>${escapeHtml(item.action30)}</p>
          </div>
          <div class="block">
            <div class="block-title">Mini-projet</div>
            <p>${escapeHtml(item.miniProject)}</p>
          </div>
        </div>
        <details>
          <summary>Risques, source et fiche</summary>
          ${risks ? `<ul>${risks}</ul>` : "<p>Aucun risque specifique note.</p>"}
          <p class="meta">Fiche contenu : ${escapeHtml(item.contentFile || "non renseignee")}</p>
        </details>
      </article>
    `;
  }).join("");
}

optionList(els.theme, "Tous les themes", uniq(resources.map((item) => item.theme)));
optionList(els.status, "Tous les statuts", uniq(resources.map((item) => item.status)));
optionList(els.freshness, "Toutes les fraicheurs", uniq(resources.map((item) => item.freshness)));

for (const element of [els.search, els.theme, els.status, els.freshness]) {
  element.addEventListener("input", render);
}

render();
