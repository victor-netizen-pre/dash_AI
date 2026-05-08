import { readFile, writeFile, mkdir } from "node:fs/promises";

const INPUT = "Compilation_liens_X_competences.md";
const OUT_DIR = "data/extracted_content";
const OUT_JSON = `${OUT_DIR}/x-oembed.json`;
const OUT_MD = `${OUT_DIR}/x-oembed.md`;
const OUT_JS = "data/x-oembed.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractTweetUrls(text) {
  const matches = text.match(/https?:\/\/(?:x|twitter)\.com\/[^\s)]+/g) || [];
  const cleaned = matches
    .map((url) => url.replace(/[.,;]+$/g, ""))
    .filter((url) => /\/(?:i\/)?status\/\d+/.test(url));
  return [...new Set(cleaned)];
}

function tweetId(url) {
  return url.match(/\/(?:i\/)?status\/(\d+)/)?.[1] || null;
}

function decodeEntities(text) {
  return text
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&mdash;", "—")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function htmlToTweetText(html) {
  const paragraph = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";
  return decodeEntities(
    paragraph
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, "$1")
      .replace(/<[^>]+>/g, "")
  ).trim();
}

function extractPublishedDate(html) {
  const match = html.match(/<a href="[^"]*status\/\d+[^"]*">([^<]+)<\/a><\/blockquote>/i);
  return match ? decodeEntities(match[1]).trim() : null;
}

async function fetchOembed(url) {
  const endpoint = new URL("https://publish.twitter.com/oembed");
  endpoint.searchParams.set("url", url.replace("https://x.com/", "https://twitter.com/"));
  endpoint.searchParams.set("omit_script", "1");
  endpoint.searchParams.set("dnt", "1");

  const response = await fetch(endpoint, {
    headers: {
      "accept": "application/json",
      "user-agent": "dash-ai-content-extractor/1.0"
    }
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${body.slice(0, 200)}`);
  }

  return JSON.parse(body);
}

function recordToMarkdown(record) {
  if (record.status !== "ok") {
    return [
      `## ${record.url}`,
      "",
      `Statut : ${record.status}`,
      `Erreur : ${record.error}`,
      ""
    ].join("\n");
  }

  return [
    `## ${record.authorName || "Auteur inconnu"} - ${record.id}`,
    "",
    `URL : ${record.url}`,
    `Auteur : ${record.authorName || ""}`,
    `Date publiee : ${record.publishedDate || ""}`,
    `Statut : contenu lu via X oEmbed`,
    "",
    "Texte :",
    "",
    record.text || "",
    ""
  ].join("\n");
}

async function main() {
  const md = await readFile(INPUT, "utf8");
  const urls = extractTweetUrls(md);
  const records = [];

  for (const url of urls) {
    const id = tweetId(url);
    try {
      const data = await fetchOembed(url);
      records.push({
        id,
        url,
        status: "ok",
        authorName: data.author_name || null,
        authorUrl: data.author_url || null,
        provider: data.provider_name || null,
        publishedDate: extractPublishedDate(data.html || ""),
        text: htmlToTweetText(data.html || ""),
        rawHtml: data.html || ""
      });
    } catch (error) {
      records.push({
        id,
        url,
        status: "error",
        error: error.message
      });
    }
    await sleep(150);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_JSON, `${JSON.stringify({ generatedAt: new Date().toISOString(), count: records.length, records }, null, 2)}\n`);
  await writeFile(OUT_JS, `window.X_OEMBED_RECORDS = ${JSON.stringify(records, null, 2)};\n`);
  await writeFile(OUT_MD, [
    "# Contenus X recuperes via oEmbed",
    "",
    `Generation : ${new Date().toISOString()}`,
    `Nombre de liens traites : ${records.length}`,
    "",
    ...records.map(recordToMarkdown)
  ].join("\n"));

  const ok = records.filter((record) => record.status === "ok").length;
  const errors = records.length - ok;
  console.log(`Extracted ${ok}/${records.length} tweets via oEmbed (${errors} errors).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
