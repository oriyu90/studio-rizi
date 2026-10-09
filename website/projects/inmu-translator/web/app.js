// 淫夢語録風変換器 Web (Tango Pro Web風ローカルファースト)
// 既定接続先: 自宅LM Studio http://192.168.0.114:1234 (OpenAI互換, noKey)
const $ = (id) => document.getElementById(id);
const SET_KEY = "inmu.settings.v1", THEME_KEY = "inmu.theme.v1";
const HOME_URL = "http://192.168.0.114:1234/v1", HOME_MODEL = "openai/gpt-oss-20b";
let CORPUS = [];
fetch("./goroku-core.json").then(r => r.json()).then(j => CORPUS = j).catch(() => CORPUS = []);

// ---------- テーマ (light/dark/auto) ----------
function applyTheme(t) {
  const root = document.documentElement;
  if (t === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", t);
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}
applyTheme(localStorage.getItem(THEME_KEY) || "auto");
$("themeBtn").onclick = () => {
  const cur = localStorage.getItem(THEME_KEY) || "auto";
  applyTheme(cur === "auto" ? "dark" : cur === "dark" ? "light" : "auto");
};

// ---------- 設定 ----------
const PRESETS = {
  "home-lmstudio": { baseUrl: HOME_URL, model: HOME_MODEL, noKey: true },
  "ollama": { baseUrl: "http://localhost:11434/v1", model: "llama3.1:8b", noKey: true },
  "lmstudio": { baseUrl: "http://localhost:1234/v1", model: "local-model", noKey: true },
  "openai": { baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", noKey: false },
  "openrouter": { baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini", noKey: false },
  "custom": null
};
function loadSettings() {
  try {
    return Object.assign({ provider: "home-lmstudio", baseUrl: HOME_URL, model: HOME_MODEL, apiKey: "", noKey: true, useAI: true },
      JSON.parse(localStorage.getItem(SET_KEY) || "{}"));
  } catch { return { provider: "home-lmstudio", baseUrl: HOME_URL, model: HOME_MODEL, apiKey: "", noKey: true, useAI: true }; }
}
function applySettings(s) {
  $("provider").value = s.provider in PRESETS ? s.provider : "custom";
  $("baseUrl").value = s.baseUrl; $("model").value = s.model;
  $("apiKey").value = s.apiKey || ""; $("noKey").checked = !!s.noKey; $("useAI").checked = s.useAI !== false;
}
let SETTINGS = loadSettings(); applySettings(SETTINGS);
$("provider").onchange = () => { const p = PRESETS[$("provider").value]; if (p) { $("baseUrl").value = p.baseUrl; $("model").value = p.model; $("noKey").checked = p.noKey; } };
$("level").oninput = () => $("levelVal").textContent = $("level").value;
$("saveSettings").onclick = () => {
  SETTINGS = { provider: $("provider").value, baseUrl: $("baseUrl").value.trim().replace(/\/+$/, ""), model: $("model").value.trim(), apiKey: $("apiKey").value, noKey: $("noKey").checked, useAI: $("useAI").checked };
  try { localStorage.setItem(SET_KEY, JSON.stringify(SETTINGS)); } catch {}
  $("testResult").textContent = "保存しました（この端末のみ）";
};
function setLamp(ok) { const l = $("lamp"); l.classList.remove("ok", "ng"); if (ok === true) l.classList.add("ok"); if (ok === false) l.classList.add("ng"); }

// ---------- ルール変換 (AIなし・オフライン可) ----------
function ruleConvert(input, mode, level) {
  let t = input.slice(0, 300); const used = [];
  const rep = [["ありがとう", "ありがとナス！"], ["美味しい", "あ＾～うめぇなぁ！"], ["おいしい", "あ＾～うめぇなぁ！"],
    ["疲れた", "ぬわあああああん疲れたもおおおおおん"], ["すごい", "イキスギィくらいすごい"], ["とても", "めちゃ"], ["非常に", "イキスギィくらい"],
    ["本当", "ホント"], ["了解", "おかのした"], ["ですね", "ですねぇ！"], ["です", "ですねぇ！"], ["ます", "ますゾ〜"]];
  for (const [a, b] of rep) { if (t.includes(a)) { t = t.replaceAll(a, b); used.push(b); break; } }
  if (/良い|上手|最高|感動|素晴らしい/.test(input)) { t += " やりますねぇ！"; used.push("やりますねぇ！"); }
  else if (level >= 2 && !used.length) {
    if (mode === "kbtit") { t += " ウッソだろお前ｗｗｗ"; used.push("ウッソだろお前ｗｗｗ"); }
    else { t += " いいゾ～これ"; used.push("いいゾ～これ"); }
  }
  if (level >= 3 && !/[？?]$/.test(t)) { t += ["（確信）", "（困惑）", "（提案）"][Math.floor(Math.random() * 3)]; used.push("括弧注釈"); }
  if (level >= 4) { const g = Math.random() < .5 ? "オッスお願いしまーす！" : "おっ大丈夫か大丈夫か？"; t = g + " " + t; used.push(g); }
  if (level >= 5) { t += " 114514(意味深)"; used.push("114514"); }
  return { text: t.slice(0, 300), used };
}

// ---------- AI変換 (OpenAI互換) ----------
function retrieve(input) {
  const pick = (kw) => CORPUS.filter(e => kw.some(k => (e.usage + e.meaning + e.surface).includes(k))).slice(0, 7);
  if (/良い|上手|最高|感動|素晴らしい|美味/.test(input)) return pick(["称賛", "肯定"]);
  if (/[？?]|どう|なに|なぜ/.test(input)) return pick(["確認", "ツッコミ", "驚き"]);
  if (/疲|大丈夫|心配/.test(input)) return pick(["心配", "疲労"]);
  return CORPUS.slice(0, 6);
}
const MODE_TX = {
  yajuu: "丁寧だが唐突に大声。〜ですねぇ！/おかのした", kbtit: "荒いタメ口。ウッソだろお前w/悲しいなぁ",
  inmuchu: "2ch調。いいゾ～これ/微レ存＋括弧注釈", mix: "上記を自然に混ぜる", auto: "入力に合う話者を自動選択"
};
function buildMessages(input, mode, level, cands) {
  const n = level <= 1 ? 1 : level >= 5 ? 4 : "2〜3";
  const candTx = cands.map(c => `・${c.surface}（${c.usage}）`).join("\n");
  const sys = `あなたは意味を保ったまま淫夢語録風口調に言い換える変換器。制約: 意味を変えない。情報の追加・削除禁止。使える語録は下記のみ、${n}個まで。差別・実在個人名・性的直接描写は禁止。括弧注釈は最大1個。挨拶挿入は${level >= 4 ? "最大1個" : "禁止"}。数字ネタは${level === 5 ? "1回まで" : "禁止"}。出力のみ、最大300字。\n[話者]: ${MODE_TX[mode] || MODE_TX.mix}\n[語録候補]:\n${candTx}`;
  return [{ role: "system", content: sys }, { role: "user", content: `[入力文]: ${input}\n[淫夢度]: ${level}/5\n変換してください。出力のみ。` }];
}
async function chatCompletions(s, messages, onToken) {
  const headers = { "Content-Type": "application/json" };
  if (!s.noKey && s.apiKey) headers["Authorization"] = "Bearer " + s.apiKey;
  const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch(s.baseUrl + "/chat/completions", { method: "POST", headers, signal: ctrl.signal,
      body: JSON.stringify({ model: s.model, stream: !!onToken, temperature: 0.7, max_tokens: 400, messages }) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    if (!onToken) { const j = await res.json(); return (j.choices?.[0]?.message?.content || "").trim(); }
    const reader = res.body.getReader(); const dec = new TextDecoder(); let full = "";
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      for (const line of dec.decode(value).split("\n")) {
        if (!line.startsWith("data:")) continue;
        const d = line.slice(5).trim(); if (d === "[DONE]") break;
        try { const t = JSON.parse(d).choices?.[0]?.delta?.content || ""; full += t; onToken(full); } catch {}
      }
    }
    return full.trim();
  } finally { clearTimeout(timer); }
}

// ---------- IndexedDB履歴 ----------
const DB = "inmu-goroku", STORE = "history";
function db() {
  return new Promise((res, rej) => {
    const q = indexedDB.open(DB, 1);
    q.onupgradeneeded = () => q.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
  });
}
async function addHistory(h) {
  try {
    const d = await db(); const tx = d.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add({ ...h, createdAt: new Date().toISOString() });
    tx.oncomplete = () => { d.close(); listHistory(); };
  } catch {}
}
async function listHistory() {
  let d; try { d = await db(); } catch { $("history").innerHTML = "<li>履歴DB利用不可</li>"; return; }
  const q = d.transaction(STORE).objectStore(STORE).getAll();
  q.onsuccess = () => {
    d.close();
    const items = (q.result || []).sort((a, b) => b.id - a.id).slice(0, 100);
    $("histCount").textContent = (q.result || []).length;
    $("history").innerHTML = items.length ? "" : "<li>履歴なし</li>";
    for (const it of items) {
      const li = document.createElement("li");
      const meta = document.createElement("div"); meta.className = "meta";
      meta.textContent = `#${it.id} ${it.createdAt} [${it.mode}/Lv${it.level}/${it.via}]`;
      const inn = document.createElement("div"); inn.textContent = "入: " + it.input;
      const out = document.createElement("div"); out.textContent = "出: " + it.output;
      const acts = document.createElement("div"); acts.className = "acts";
      const rb = document.createElement("button"); rb.textContent = "復元";
      rb.onclick = () => { $("input").value = it.input; $("output").value = it.output; window.scrollTo({ top: 0, behavior: "smooth" }); };
      const cp = document.createElement("button"); cp.textContent = "コピー";
      cp.onclick = () => navigator.clipboard.writeText(it.output);
      const del = document.createElement("button"); del.textContent = "削除"; del.className = "danger";
      del.onclick = async () => { const dd = await db(); const t = dd.transaction(STORE, "readwrite"); t.objectStore(STORE).delete(it.id); t.oncomplete = () => { dd.close(); listHistory(); }; };
      acts.append(rb, cp, del); li.append(meta, inn, out, acts); $("history").append(li);
    }
  };
}
$("clearHistory").onclick = async () => {
  if (!confirm("履歴を全削除しますか？")) return;
  const d = await db(); const t = d.transaction(STORE, "readwrite");
  t.objectStore(STORE).clear(); t.oncomplete = () => { d.close(); listHistory(); };
};
listHistory();

// ---------- UI配線 ----------
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
$("copyBtn").onclick = async () => { if (!$("output").value) return; await navigator.clipboard.writeText($("output").value); $("status").textContent = "コピーしました"; };
$("ruleBtn").onclick = () => doConvert(true);
$("convertBtn").onclick = () => doConvert(false);
$("testBtn").onclick = async () => {
  const s = { baseUrl: $("baseUrl").value.trim().replace(/\/+$/, ""), model: $("model").value.trim(), apiKey: $("apiKey").value, noKey: $("noKey").checked };
  $("testResult").textContent = "確認中…"; setLamp(null);
  try {
    const r = await fetch(s.baseUrl + "/models", { headers: (!s.noKey && s.apiKey) ? { Authorization: "Bearer " + s.apiKey } : {} });
    if (r.ok) { $("testResult").textContent = "OK: 接続成功"; setLamp(true); }
    else { $("testResult").textContent = "NG: HTTP " + r.status; setLamp(false); }
  } catch { $("testResult").textContent = "NG: CORS/Mixed-Contentの可能性。httpで開くかtunnel使用"; setLamp(false); }
};
async function doConvert(forceRule) {
  const input = $("input").value.trim();
  if (!input) { $("status").textContent = "入力してください"; return; }
  const mode = $("mode").value, level = Number($("level").value);
  $("convertBtn").disabled = true; $("status").textContent = "変換中…";
  $("output").value = ""; $("sources").textContent = "";
  try {
    let out, via;
    const s = { ...SETTINGS, baseUrl: $("baseUrl").value.trim().replace(/\/+$/, "") || SETTINGS.baseUrl, model: $("model").value.trim() || SETTINGS.model, apiKey: $("apiKey").value, noKey: $("noKey").checked };
    if (!forceRule && $("useAI").checked) {
      const cands = retrieve(input);
      try {
        out = await chatCompletions(s, buildMessages(input, mode, level, cands), t => { $("output").value = t; });
        if (!out) throw new Error("empty");
        via = "ai:" + s.model; setLamp(true);
        $("sources").innerHTML = "";
        for (const c of cands.slice(0, 3)) {
          const a = document.createElement("a"); a.href = c.sourceUrl; a.target = "_blank"; a.rel = "noopener"; a.textContent = c.surface;
          $("sources").append(a);
        }
      } catch (e) {
        const r = ruleConvert(input, mode, level);
        out = r.text + "\n（AI接続失敗のためルール変換）"; via = "rule-fallback"; setLamp(false);
      }
    } else { const r = ruleConvert(input, mode, level); out = r.text; via = "rule"; }
    $("output").value = out; $("status").textContent = "完了（" + via + "）";
    addHistory({ input, output: out, mode, level, via });
  } finally { $("convertBtn").disabled = false; }
}
