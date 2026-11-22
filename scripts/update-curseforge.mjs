import { readFile, writeFile, mkdir } from "node:fs/promises";
const profileUrl = "https://www.curseforge.com/members/_kevinzin_tuga_/projects";
const followersUrl = "https://www.curseforge.com/members/_kevinzin_tuga_/followers";
const projectUrl = "https://www.curseforge.com/minecraft/mc-mods/autoloot-selector";
const headers = { "user-agent": "Mozilla/5.0 (compatible; KevinzinPortfolioStats/1.0)", "accept-language": "en-US,en;q=0.9" };
async function page(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(\`CurseForge returned HTTP \${response.status} for \${url}\`);
  return (await response.text())
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}
function count(text, label) {
  const match = text.match(new RegExp("(\\d[\\d,.]*\\s*[KMB]?)\\s+" + label, "i"));
  if (!match) return null;
  const raw = match[1].replace(/,/g, "");
  const suffix = raw.slice(-1).toUpperCase();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? Math.round(n * ({K:1e3,M:1e6,B:1e9}[suffix] || 1)) : null;
}
const [profile, followersPage, project] = await Promise.all([page(profileUrl), page(followersUrl), page(projectUrl)]);
const downloads = count(profile, "Downloads");
const followers = count(followersPage, "Followers") ?? count(profile, "Followers");
const projects = count(profile, "Projects");
const autolootDownloads = count(project, "Downloads");
if (downloads === null && followers === null && projects === null) throw new Error("Could not read any public CurseForge profile counters; refusing to overwrite with empty data.");
let previous = {};
try { previous = JSON.parse(await readFile("data/curseforge.json", "utf8")); } catch {}
const updatedAt = new Date().toISOString();
const snapshot = { date: updatedAt.slice(0,10), downloads, followers, projects };
const history = Array.isArray(previous.history) ? previous.history : [];
if (!history.length || history.at(-1).downloads !== downloads || history.at(-1).followers !== followers) history.push(snapshot);
const output = { username:"_Kevinzin_tuga_", profileUrl, downloads, followers, projects, autolootDownloads, updatedAt, history:history.slice(-180) };
await mkdir("data", { recursive:true });
await writeFile("data/curseforge.json", JSON.stringify(output, null, 2) + "\n");
console.log("CurseForge counters updated:", { downloads, followers, projects, autolootDownloads });
