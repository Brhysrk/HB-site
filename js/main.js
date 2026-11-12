(() => {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const rand = (a) => a[Math.floor(Math.random() * a.length)];

  // Заголовки и подзаголовки страниц из config.js (если ключа нет, остаётся текст из index.html)
  [
    ["#pw-title", "passwordTitle"], ["#pw-subtitle", "passwordSubtitle"],
    ["#compliments-title", "complimentsTitle"], ["#compliments-subtitle", "complimentsSubtitle"], ["#compliment", "complimentsStart"],
    ["#playlist-title", "playlistTitle"], ["#playlist-subtitle", "playlistSubtitle"],
    ["#map-title", "mapTitle"], ["#map-subtitle", "mapSubtitle"],
    ["#envelope-hint", "envelopeHint"],
    ["#remember-emoji", "rememberEmoji"], ["#remember-text", "rememberText"], ["#remember-small", "rememberSmall"],
    ["#feedback-emoji", "feedbackEmoji"], ["#feedback-title", "feedbackTitle"], ["#feedback-text", "feedbackText"],
    ["#feedback-small", "feedbackSmall"], ["#feedback-rating-label", "feedbackRatingLabel"], ["#feedback-send", "feedbackButton"],
    ["#feedback-thanks", "feedbackThanks"],
  ].forEach(([sel, key]) => { if (C[key] != null && $(sel)) $(sel).textContent = C[key]; });

  // ---------- Навигация между экранами ----------
  const NAV = ["s-birthday", "s-gifts", "s-compliments", "s-playlist", "s-remember", "s-map", "s-digital", "s-dance", "s-letter", "s-feedback"];
  const onEnter = {};
  let current = "s-password";
  const visited = new Set(); // точками можно вернуться только туда, где уже была

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    current = id;
    visited.add(id);
    window.scrollTo(0, 0);
    const dots = $("#dots");
    dots.classList.toggle("hidden", !NAV.includes(id));
    dots.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("on", b.dataset.id === id);
      b.disabled = !visited.has(b.dataset.id);
    });
    if (id !== "s-dance") pauseWaltzScene();   // музыка при этом продолжает играть в общем плеере
    $("#mplayer").classList.toggle("hidden", !NAV.includes(id));
    unlockTracks(id);
    onEnter[id] && onEnter[id]();
  }
  NAV.forEach((id, i) => {
    const b = document.createElement("button");
    b.dataset.id = id;
    b.setAttribute("aria-label", "Раздел " + (i + 1));
    b.disabled = true;
    b.onclick = () => visited.has(id) && show(id);
    $("#dots").appendChild(b);
  });
  document.querySelectorAll("[data-next]").forEach((b) => (b.onclick = () => show(b.dataset.next)));

  // ---------- 1. Пароль ----------
  // Ячейки под цифры: сколько цифр в пароле, столько и ячеек
  let tries = 0, unlocked = false;
  const PIN_LEN = String(C.password[0]).length;
  $("#pw-question").textContent = C.passwordQuestion;
  const cells = Array.from({ length: PIN_LEN }, (_, i) => {
    const inp = document.createElement("input");
    inp.type = "text"; inp.inputMode = "numeric"; inp.maxLength = 1; inp.autocomplete = "off";
    inp.setAttribute("aria-label", "Цифра " + (i + 1));
    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/\D/g, "").slice(-1);
      if (inp.value && i < PIN_LEN - 1) cells[i + 1].focus();
      if (cells.every((c) => c.value)) checkPin();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !inp.value && i > 0) { cells[i - 1].value = ""; cells[i - 1].focus(); e.preventDefault(); }
      if (e.key === "ArrowLeft" && i > 0) cells[i - 1].focus();
      if (e.key === "ArrowRight" && i < PIN_LEN - 1) cells[i + 1].focus();
    });
    inp.addEventListener("focus", () => inp.select());
    inp.addEventListener("paste", (e) => {
      e.preventDefault();
      const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").split("");
      for (let k = i; k < PIN_LEN && digits.length; k++) cells[k].value = digits.shift();
      (cells.find((c) => !c.value) || cells[PIN_LEN - 1]).focus();
      if (cells.every((c) => c.value)) checkPin();
    });
    $("#pin").appendChild(inp);
    return inp;
  });
  setTimeout(() => cells[0].focus(), 300);
  onEnter["s-password"] = () => setTimeout(() => cells[0].focus(), 300); // после таймера

  function checkPin() {
    if (unlocked) return;
    const val = cells.map((c) => c.value).join("");
    if (val.length < PIN_LEN) {
      $("#pw-msg").textContent = "Нужно " + PIN_LEN + " цифры 🙂";
      (cells.find((c) => !c.value) || cells[0]).focus();
      return;
    }
    if (C.password.map(String).includes(val)) {
      unlocked = true;
      $("#pin").classList.add("ok");
      $("#pw-msg").textContent = "Добро пожаловать, " + C.name + " 💖";
      setTimeout(() => show("s-gift"), 900);
      return;
    }
    tries++;
    $("#pw-msg").textContent = C.wrongPhrases[(tries - 1) % C.wrongPhrases.length];
    const card = $("#s-password .card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    // открываем подсказки по одной
    const open = C.hintsAfter.filter((n) => tries >= n).length;
    const list = $("#pw-hints");
    while (list.children.length < Math.min(open, C.passwordHints.length)) {
      const n = list.children.length;
      const li = document.createElement("li");
      li.innerHTML = `<b>Подсказка ${n + 1}:</b> `;
      li.append(C.passwordHints[n]);
      list.appendChild(li);
      if (n === C.passwordHints.length - 1 && C.pinPlaceholders)
        cells.forEach((c, k) => (c.placeholder = C.pinPlaceholders[k] || ""));
    }
    setTimeout(() => { cells.forEach((c) => (c.value = "")); cells[0].focus(); }, 450);
  }
  $("#pw-form").addEventListener("submit", (e) => { e.preventDefault(); checkPin(); });

  // ---------- 2. Подарок ----------
  $("#gift-title").textContent = C.giftTitle;
  $("#gift-text").textContent = C.giftText;
  const reject = $("#gift-reject");
  let dodges = 0;
  function dodge(e) {
    e && e.preventDefault();
    const r = reject.getBoundingClientRect();
    if (!reject.classList.contains("running")) {
      reject.style.left = r.left + "px"; reject.style.top = r.top + "px";
      reject.classList.add("running");
    }
    const pad = 16;
    const maxX = window.innerWidth - r.width - pad;
    const maxY = window.innerHeight - r.height - pad;
    // не прыгаем на кнопку «Принять», чтобы не закрыть её
    const a = $("#gift-accept").getBoundingClientRect();
    let x, y, tries = 0;
    do {
      x = Math.max(pad, Math.random() * maxX);
      y = Math.max(pad, Math.random() * maxY);
    } while (tries++ < 30 && x < a.right + 20 && x + r.width > a.left - 20 && y < a.bottom + 20 && y + r.height > a.top - 20);
    reject.style.left = x + "px";
    reject.style.top = y + "px";
    reject.textContent = rand(C.dodgePhrases);
    if (++dodges > 6) reject.style.transform = `scale(${Math.max(0.4, 1 - (dodges - 6) * 0.1)})`;
  }
  reject.addEventListener("mouseenter", dodge);
  reject.addEventListener("touchstart", dodge, { passive: false });
  reject.addEventListener("click", dodge);
  $("#gift-accept").onclick = () => {
    reject.remove();
    $("#gift-box").classList.add("open");
    confetti(120);
    startBirthdaySong(); // включаем прямо в нажатии, иначе телефон может не дать включить звук
    setTimeout(() => show("s-birthday"), 800);
  };

  // ---------- 3. День рождения: торт, конфетти, розы и сырки ----------
  $("#bd-title").textContent = C.birthdayTitle;
  $("#bd-subtitle").textContent = C.birthdaySubtitle;
  $("#cake").innerHTML = cakeSVG(C.candles);
  const candles = $("#cake");
  // за одно нажатие/выдох гаснет несколько свечей, чтобы не жать 18 раз
  const PER_BLOW = Math.max(1, Math.ceil(C.candles / 6));
  let rain = null;
  onEnter["s-birthday"] = () => {
    startBirthdaySong();
    confetti(160);
    if (!rain) rain = setInterval(dropPetal, 350);
  };
  function dropPetal() {
    if (current !== "s-birthday") return;
    const p = document.createElement("div");
    p.className = "petal";
    // 🌹 — розы; 🍫 — сырки (замени на картинку assets/img/syrok.png, если хочешь)
    p.textContent = Math.random() < 0.55 ? "🌹" : "🍫";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 5 + Math.random() * 5 + "s";
    p.style.fontSize = 18 + Math.random() * 18 + "px";
    $("#petals").appendChild(p);
    setTimeout(() => p.remove(), 11000);
  }
  // Торт: два яруса (розовый в кремовый горошек и кремовый с шоколадной глазурью),
  // свечи стоят кольцом на верхнем ярусе; дальние рисуются первыми и чуть меньше
  function cakeSVG(n) {
    const f = (v) => v.toFixed(1);
    const cx = 150;
    const T = { top: 100, bot: 172, rx: 80, ry: 14 };      // верхний ярус
    const B = { top: 178, bot: 248, rx: 112, ry: 18 };     // нижний ярус
    const edge = (x, rx, ry, y) => y + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
    const body = (t) => `M${cx - t.rx},${t.top} L${cx - t.rx},${t.bot} A${t.rx},${t.ry} 0 0 0 ${cx + t.rx},${t.bot} L${cx + t.rx},${t.top} Z`;
    // шоколадные подтёки
    const drips = [-70, -52, -38, -20, -6, 10, 26, 41, 57, 71].map((dx, i) => {
      const x = cx + dx, y = edge(x, T.rx, T.ry, T.top) + 3, L = [10, 18, 7, 22, 12, 16, 8, 20, 11, 14][i];
      return `<path d="M${f(x - 4)},${f(y - 2)} L${f(x - 4)},${f(y + L)} a4,4 0 0 0 8,0 L${f(x + 4)},${f(y - 2)} Z"/>`;
    }).join("");
    // жемчужины крема по нижнему краю ярусов
    const pearls = (t, step, r) => {
      let out = "";
      for (let x = cx - t.rx + r; x <= cx + t.rx - r; x += step)
        out += `<circle cx="${f(x)}" cy="${f(edge(x, t.rx, t.ry, t.bot) - 1)}" r="${r}"/>`;
      return out;
    };
    const rose = (x, y) => `<g transform="translate(${x} ${y})"><circle r="7" fill="#c9787a"/><path d="M-3,-1 a3,3 0 1 1 3,3 a5,5 0 1 1 -5,-5" fill="none" stroke="#a85d62" stroke-width="1.3"/>
      <ellipse cx="-8" cy="4" rx="5" ry="2.4" fill="#8aa37a" transform="rotate(-25 -8 4)"/><ellipse cx="8" cy="4" rx="5" ry="2.4" fill="#8aa37a" transform="rotate(25 8 4)"/></g>`;
    // свечи по эллипсу
    const ring = { rx: 60, ry: 9.5, y: T.top - 1 };
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (2 * Math.PI * i) / n - Math.PI / 2 + Math.PI / n;
      return { x: cx + ring.rx * Math.cos(a), y: ring.y + ring.ry * Math.sin(a) };
    }).sort((p, q) => p.y - q.y);
    const candle = (p) => {
      const d = (p.y - (ring.y - ring.ry)) / (2 * ring.ry);   // 0 — дальняя, 1 — ближняя
      const s = 0.8 + 0.2 * d, h = 32 * s, w = 5.5 * s;
      const delay = (Math.random() * 0.35).toFixed(2);
      return `<g class="candle" transform="translate(${f(p.x)} ${f(p.y)})">
        <ellipse cx="0" cy="0" rx="${f(w * 0.9)}" ry="${f(w * 0.35)}" fill="rgba(0,0,0,.18)"/>
        <rect x="${f(-w / 2)}" y="${f(-h)}" width="${f(w)}" height="${f(h)}" rx="1.4" fill="url(#cStripe)"/>
        <line x1="0" y1="${f(-h)}" x2="0" y2="${f(-h - 3)}" stroke="#4b3628" stroke-width="0.9"/>
        <g transform="translate(0 ${f(-h - 2)}) scale(${f(s)})">
          <circle class="glow" cx="0" cy="-6" r="9" fill="url(#cGlow)"/>
          <path class="flame" style="animation-delay:-${delay}s" d="M0,-14 C4.5,-8 4.5,-2 0,0 C-4.5,-2 -4.5,-8 0,-14 Z" fill="url(#cFlame)"/>
          <path class="smoke" d="M0,-2 c-3,-4 3,-6 0,-10 c-3,-4 3,-6 0,-10" fill="none" stroke="#b9aca0" stroke-width="1.4" stroke-linecap="round"/>
        </g></g>`;
    };
    return `<svg viewBox="0 0 300 280" role="img" aria-label="Торт с ${n} свечами">
      <defs>
        <linearGradient id="cBot" x1="0" x2="1"><stop offset="0" stop-color="#d39a93"/><stop offset=".45" stop-color="#ecc3bc"/><stop offset="1" stop-color="#cf948d"/></linearGradient>
        <linearGradient id="cTop" x1="0" x2="1"><stop offset="0" stop-color="#ead7bd"/><stop offset=".45" stop-color="#fbf0e0"/><stop offset="1" stop-color="#e6d1b5"/></linearGradient>
        <pattern id="cDots" width="22" height="20" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="3" fill="#fbf1e4" opacity=".9"/><circle cx="16" cy="15" r="3" fill="#fbf1e4" opacity=".9"/></pattern>
        <pattern id="cStripe" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <rect width="5" height="5" fill="#fffaf3"/><rect width="2.4" height="5" fill="#d4a29a"/></pattern>
        <radialGradient id="cFlame" cx=".5" cy=".75" r=".7"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#ffd36b"/><stop offset="1" stop-color="#ff9a3c"/></radialGradient>
        <radialGradient id="cGlow"><stop offset="0" stop-color="#ffe7a0" stop-opacity=".9"/><stop offset="1" stop-color="#ffe7a0" stop-opacity="0"/></radialGradient>
        <clipPath id="cBotClip"><path d="${body(B)}"/></clipPath>
      </defs>
      <!-- тарелка -->
      <ellipse cx="${cx}" cy="256" rx="138" ry="17" fill="#dccab4"/>
      <ellipse cx="${cx}" cy="253" rx="134" ry="15" fill="#f3e9dc"/>
      <!-- нижний ярус -->
      <path d="${body(B)}" fill="url(#cBot)"/>
      <rect x="0" y="${B.top}" width="300" height="100" fill="url(#cDots)" clip-path="url(#cBotClip)"/>
      <ellipse cx="${cx}" cy="${B.top}" rx="${B.rx}" ry="${B.ry}" fill="#f2d3cd"/>
      <g fill="#fbf1e4">${pearls(B, 9, 4.2)}</g>
      <g transform="translate(${cx} 222)"><ellipse rx="26" ry="15" fill="#fbf1e4"/>
        <text y="9" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="22" fill="#b98a4e">${n}</text></g>
      <!-- верхний ярус -->
      <path d="${body(T)}" fill="url(#cTop)"/>
      <g fill="#fffaf3">${pearls(T, 8, 3.6)}</g>
      ${rose(cx - 92, 186)}${rose(cx + 92, 186)}
      <!-- шоколадная глазурь -->
      <g fill="#6f4f3a">${drips}<ellipse cx="${cx}" cy="${T.top}" rx="${T.rx}" ry="${T.ry}"/></g>
      <ellipse cx="${cx - 18}" cy="${T.top - 5}" rx="34" ry="4" fill="#8a654b" opacity=".6"/>
      <!-- свечи -->
      ${pts.map(candle).join("")}
    </svg>`;
  }

  function blowOne() {
    const lit = [...candles.querySelectorAll(".candle:not(.out)")];
    if (!lit.length) return;
    lit.sort(() => Math.random() - 0.5).slice(0, PER_BLOW).forEach((c) => c.classList.add("out"));
    if (lit.length <= PER_BLOW) wish();
  }
  function blowAll() { candles.querySelectorAll(".candle").forEach((c) => c.classList.add("out")); wish(); }
  let wished = false;
  function wish() {
    if (wished) return; wished = true;
    stopMic();
    $("#wish-msg").textContent = C.wishText;
    confetti(250);
    $("#bd-next").classList.remove("hidden");
  }
  $("#cake").onclick = blowOne;

  // Задуть в микрофон
  let micStream = null, micRaf = null;
  $("#mic-btn").onclick = async () => {
    pauseForMic();
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctx.createAnalyser(); an.fftSize = 512;
      ctx.createMediaStreamSource(micStream).connect(an);
      const data = new Uint8Array(an.frequencyBinCount);
      $("#mic-btn").textContent = "🌬️ Дуй!";
      let loud = 0;
      const loop = () => {
        an.getByteFrequencyData(data);
        const vol = data.reduce((a, b) => a + b, 0) / data.length;
        loud = vol > 60 ? loud + 1 : 0;
        if (loud > 4) { blowOne(); loud = 0; }
        micRaf = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      $("#mic-btn").textContent = "Микрофон недоступен — жми на свечи";
      resumeAfterMic();
    }
  };
  function stopMic() {
    micRaf && cancelAnimationFrame(micRaf);
    micStream && micStream.getTracks().forEach((t) => t.stop());
    $("#mic-btn").classList.add("hidden");
    resumeAfterMic();
  }
  // Пока она дует в микрофон, песня на паузе (иначе микрофон услышит музыку и задует свечи сам),
  // а после желания играет дальше
  let pausedForMic = false;
  function pauseForMic() { if (isPlaying()) { pausedForMic = true; pauseMusic(); } }
  function resumeAfterMic() { if (pausedForMic) { pausedForMic = false; cur && playTrack(cur); } }

  // ---------- 4. Комплименты ----------
  let pool = [], count = 0;
  $("#compliment-btn").onclick = () => {
    if (!pool.length) pool = [...C.compliments].sort(() => Math.random() - 0.5);
    const q = $("#compliment");
    q.textContent = pool.pop();
    q.classList.remove("flip"); void q.offsetWidth; q.classList.add("flip");
    count++;
    $("#compliment-count").textContent = "Комплиментов получено: " + count;
    if (count % 5 === 0) confetti(60);
  };

  // ---------- Окна-переходы ----------
  $("#gifts-title").textContent = C.giftsTitle;
  $("#gifts-text").textContent = C.giftsText;
  onEnter["s-gifts"] = () => confetti(70);
  $("#digital-text").textContent = C.digitalText;
  $("#digital-small").textContent = C.digitalSmall;

  // ---------- Карта фоток: по нажатию на сердечко открывается альбом места ----------
  const photoPh = (src) => `<div class="ph">📷<span>${src.split("/").pop()}</span></div>`;
  let albumItems = [];
  function openAlbum({ title, sub, text, items }) {
    albumItems = items;
    $("#album-title").textContent = title;
    $("#album-sub").textContent = sub || "";
    $("#album-text").textContent = text || "";
    $("#album-text").classList.toggle("hidden", !text);
    const strip = $("#album-strip");
    strip.innerHTML = items.length ? "" : '<div class="slide empty">Фото этого места пока нет 🙈</div>';
    items.forEach((it, i) => {
      const sl = document.createElement("div");
      sl.className = "slide";
      sl.innerHTML = `<img src="${it.src}" alt="${it.cap || title}" loading="lazy">${it.cap ? `<span class="cap">${it.cap}</span>` : ""}`;
      sl.querySelector("img").onerror = function () { this.outerHTML = photoPh(it.src); };
      sl.onclick = () => openLightbox(i, items.map((x) => ({ src: x.src, cap: x.cap || title })));
      strip.appendChild(sl);
    });
    strip.scrollLeft = 0;
    const many = items.length > 1;
    $("#album-prev").classList.toggle("hidden", !many);
    $("#album-next").classList.toggle("hidden", !many);
    updateAlbumCount();
    $("#album").classList.remove("hidden");
  }
  function updateAlbumCount() {
    const strip = $("#album-strip");
    const i = Math.round(strip.scrollLeft / (strip.clientWidth || 1));
    $("#album-count").textContent = albumItems.length ? `${i + 1} / ${albumItems.length} · нажми на фото, чтобы открыть на весь экран` : "";
  }
  const closeAlbum = () => $("#album").classList.add("hidden");
  const albumStep = (d) => { const st = $("#album-strip"); st.scrollBy({ left: d * st.clientWidth, behavior: "smooth" }); };
  $("#album-strip").addEventListener("scroll", () => requestAnimationFrame(updateAlbumCount));
  $("#album-close").onclick = closeAlbum;
  $("#album-prev").onclick = () => albumStep(-1);
  $("#album-next").onclick = () => albumStep(1);

  function selectCity(city, fit) {
    document.querySelectorAll("#city-tabs button").forEach((x) => x.classList.toggle("on", x.textContent === city));
    if (fit && map) {
      closeAlbum();
      const group = city === "Все" ? allMarkers : placeMarkers.filter((m) => m.city === city);
      if (group.length) map.fitBounds(L.featureGroup(group).getBounds(), { padding: [40, 40], maxZoom: 14 });
    }
  }
  ["Все", ...new Set(C.places.map((p) => p.city))].forEach((city) => {
    const b = document.createElement("button");
    b.textContent = city;
    b.onclick = () => selectCity(city, true);
    $("#city-tabs").appendChild(b);
  });

  let map = null, placeMarkers = [], allMarkers = [];
  // Подложка карты: бесплатные источники без ключа. Перед показом проверяем пробный кусочек карты:
  // некоторые сервисы вместо ошибки отдают картинку «Access blocked» / «API key required»,
  // поэтому смотрим на настоящий код ответа и берём первый источник, который реально отвечает.
  const TILE_SOURCES = [
    { name: "Esri",   url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", attribution: "Tiles &copy; Esri" },
    { name: "OSM FR", url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap France" },
    { name: "2GIS",   url: "https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1", subdomains: "0123", attribution: "&copy; 2GIS" },
    { name: "OSM",    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap" },
  ];
  const sampleTile = (src) => src.url
    .replace("{s}", (src.subdomains || "abc")[0]).replace("{z}", 4).replace("{x}", 11).replace("{y}", 5).replace("{r}", "");
  function probe(src) {
    const url = sampleTile(src);
    const timeout = (ms) => new Promise((res) => setTimeout(() => res(false), ms));
    const viaFetch = fetch(url, { mode: "cors", cache: "no-store" })
      .then((r) => (r.ok ? true : false))          // 401/403/404 => источник не годится
      .catch(() => viaImage(url));                 // CORS не поддерживается — проверяем картинкой
    return Promise.race([viaFetch, timeout(5000)]);
  }
  function viaImage(url) {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img.naturalWidth >= 200);
      img.onerror = () => res(false);
      img.src = url;
    });
  }
  async function addTiles(m) {
    for (const src of TILE_SOURCES) {
      if (await probe(src)) {
        const opts = { attribution: src.attribution, maxZoom: 19 };
        if (src.subdomains) opts.subdomains = src.subdomains;
        L.tileLayer(src.url, opts).addTo(m);
        console.info("Карта:", src.name);
        return;
      }
      console.warn("Источник карты не отвечает:", src.name);
    }
    $("#map").insertAdjacentHTML("beforeend", '<div class="map-off">Подложка карты не загрузилась, но сердечки работают 💗</div>');
  }
  onEnter["s-map"] = () => {
    if (map) { setTimeout(() => map.invalidateSize(), 50); return; }
    selectCity("Все", false);
    if (!window.L) { $("#map").textContent = "Карта не загрузилась (нет интернета?)"; return; }
    map = L.map("map", { scrollWheelZoom: false });
    addTiles(map);
    // сердечко пульсирует, пока на него ни разу не нажали
    const seen = (e) => { const el = e.target.getElement(); el && el.querySelector(".heart-pin").classList.add("seen"); };
    const icon = L.divIcon({ className: "", html: '<div class="heart-pin">💗</div>', iconSize: [28, 28], iconAnchor: [14, 26] });
    // Если карта сильно отдалена, нажатие только плавно приближает город;
    // фото открываются следующим нажатием, когда город уже близко
    const CITY_ZOOM = 13;
    const cityBounds = (city) => L.featureGroup(placeMarkers.filter((m) => m.city === city)).getBounds();
    function zoomThen(bounds, then) {
      const target = Math.min(map.getBoundsZoom(bounds, false, L.point(80, 80)), CITY_ZOOM);
      if (map.getZoom() >= target - 2) { then(); return; } // уже близко — открываем фото
      closeAlbum(); map.closePopup();
      map.flyToBounds(bounds, { padding: [40, 40], maxZoom: CITY_ZOOM, duration: 1.4 });
    }
    const addHeart = (lat, lng, city, album) => {
      const m = L.marker([lat, lng], { icon, title: album.title }).addTo(map)
        .on("click", (e) => { seen(e); selectCity(city, false); zoomThen(cityBounds(city), () => openAlbum(album)); });
      m.city = city;
      return m;
    };
    const photosOf = (p, withCap) => (p.photos || []).map((src) => ({ src, cap: withCap ? p.title : "" }));
    // у места с координатами — своё сердечко со всеми его фото
    placeMarkers = C.places.filter((p) => p.lat != null && p.lng != null)
      .map((p) => addHeart(p.lat, p.lng, p.city, { title: p.title, sub: p.city, text: p.text, items: photosOf(p, false) }));
    // места без координат собираются в одно сердечко города «наши моменты»
    Object.entries(C.cityMoments || {}).forEach(([city, pt]) => {
      const list = C.places.filter((p) => p.city === city && (p.lat == null || p.lng == null) && (p.photos || []).length);
      if (!list.length) return;
      placeMarkers.push(addHeart(pt.lat, pt.lng, city, {
        title: pt.title || city + " · наши моменты", sub: list.map((p) => p.title).join(" · "),
        items: list.flatMap((p) => photosOf(p, true)),
      }));
    });
    allMarkers = [...placeMarkers];
    if (C.teaser) {
      const t = C.teaser;
      const tIcon = L.divIcon({ className: "", html: '<div class="heart-pin teaser-pin">💗</div>', iconSize: [34, 34], iconAnchor: [17, 30] });
      const tm = L.marker([t.lat, t.lng], { icon: tIcon }).addTo(map);
      const pop = L.popup({ className: "teaser-popup" }).setLatLng([t.lat, t.lng])
        .setContent(`<div class="teaser-pop"><small>${t.title}</small><b class="typed"></b></div>`);
      // как и у городов: издалека только приближаем Вену, надпись — следующим нажатием
      tm.on("click", (e) => { seen(e); zoomThen(L.latLngBounds([t.lat, t.lng], [t.lat, t.lng]), () => pop.openOn(map)); });
      pop.on("add", () => {
        const el = pop.getElement().querySelector(".typed");
        el.textContent = "";
        let i = 0;
        const typer = setInterval(() => {
          el.textContent = t.text.slice(0, ++i);
          if (i >= t.text.length) clearInterval(typer);
        }, 90);
      });
      allMarkers.push(tm);
    }
    map.fitBounds(L.featureGroup(allMarkers).getBounds(), { padding: [30, 30] });
    setTimeout(() => map.invalidateSize(), 50);
  };

  // Просмотр фото на весь экран
  let lbIndex = 0, lbItems = [];
  function openLightbox(i, items) {
    if (items) lbItems = items;
    lbIndex = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbIndex];
    const img = $("#lb-img");
    img.style.display = "";
    img.onerror = () => { img.style.display = "none"; $("#lb-cap").textContent = "Фото ещё не добавлено: " + it.src; };
    img.src = it.src;
    $("#lb-cap").textContent = it.cap + "  ·  " + (lbIndex + 1) + " / " + lbItems.length;
    $("#lightbox").classList.remove("hidden");
  }
  const closeLightbox = () => $("#lightbox").classList.add("hidden");
  $("#lb-close").onclick = closeLightbox;
  $("#lb-prev").onclick = (e) => { e.stopPropagation(); openLightbox(lbIndex - 1); };
  $("#lb-next").onclick = (e) => { e.stopPropagation(); openLightbox(lbIndex + 1); };
  $("#lightbox").onclick = (e) => { if (e.target.id === "lightbox") closeLightbox(); };
  addEventListener("keydown", (e) => {
    if ($("#lightbox").classList.contains("hidden")) {
      if (e.key === "Escape") closeAlbum();
      return;
    }
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
  });
  let touchX = null;
  $("#lightbox").addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  $("#lightbox").addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) openLightbox(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // ---------- Общий аудиоплеер внизу ----------
  // Треки: песня с торта + песни из playlist + Never Enough. Каждый трек открывается, когда она впервые
  // доходит до страницы unlockAt (песня с торта — на торте, песни плейлиста — на странице плейлиста).
  const WALTZ = "waltz", BDAY = "bday";
  const tracks = [
    ...(C.birthdaySong ? [{ ...C.birthdaySong, id: BDAY, unlockAt: C.birthdaySong.unlockAt || "s-birthday" }] : []),
    ...C.playlist.map((t, i) => ({ ...t, id: "t" + i, unlockAt: t.unlockAt || "s-playlist" })),
    { id: WALTZ, title: C.waltzTitle || "Never Enough", artist: C.waltzArtist || "", src: C.waltzSong, unlockAt: "s-dance" },
  ];
  const byId = (id) => tracks.find((t) => t.id === id);
  const unlockedTracks = new Set();
  const music = new Audio();
  music.preload = "metadata";
  let cur = null, synthOn = false;

  function unlockTracks(screenId, silent) {
    const fresh = tracks.filter((t) => t.unlockAt === screenId && !unlockedTracks.has(t.id));
    fresh.forEach((t) => unlockedTracks.add(t.id));
    if (!fresh.length) return;
    if (!cur) cur = fresh[0].id;
    if (!silent) {
      const mp = $("#mplayer"); mp.classList.remove("ping"); void mp.offsetWidth; mp.classList.add("ping");
    }
    renderPlayer();
  }
  function playTrack(id) {
    if (!unlockedTracks.has(id)) { toast("🔒 Этот трек откроется дальше"); return; }
    const t = byId(id);
    if (cur !== id || !music.src) {
      if (synthOn) { synthWaltz.stop(); synthOn = false; }
      cur = id;
      music.src = t.src;
    }
    if (id === WALTZ && songMissing) { music.pause(); synthWaltz.start(); synthOn = true; renderPlayer(); return; }
    music.play().catch((err) => {
      if (cur !== id) return;
      // браузер не дал включить звук без нажатия или play прервали паузой: файл есть, просто ждём ▶
      if (err && (err.name === "NotAllowedError" || err.name === "AbortError")) { renderPlayer(); return; }
      if (id === WALTZ) { songMissing = true; synthWaltz.start(); synthOn = true; }
      else { music.pause(); music.removeAttribute("src"); toast("Файл " + t.src + " пока не добавлен"); }
      renderPlayer();
    });
    renderPlayer();
  }
  // Песня с торта включается сама, когда она принимает подарок (один раз)
  let bdayStarted = false;
  function startBirthdaySong() {
    if (bdayStarted || !byId(BDAY)) return;
    bdayStarted = true;
    unlockTracks("s-birthday");
    playTrack(BDAY);
  }
  function pauseMusic() { music.pause(); if (synthOn) { synthWaltz.stop(); synthOn = false; } renderPlayer(); }
  const isPlaying = () => synthOn || !music.paused;
  function step(dir) {
    const list = tracks.filter((t) => unlockedTracks.has(t.id));
    if (!list.length) return;
    const i = list.findIndex((t) => t.id === cur);
    playTrack(list[(i + dir + list.length) % list.length].id);
  }
  music.addEventListener("play", renderPlayer);
  // Пауза в плеере внизу останавливает и пару в вальсе, play — пара снова кружится в такт
  music.addEventListener("playing", () => {
    if (cur === WALTZ && dancing) { $("#ballroom").classList.remove("paused"); syncDancers(); }
  });
  music.addEventListener("pause", () => { if (cur === WALTZ && dancing) $("#ballroom").classList.add("paused"); });
  music.addEventListener("pause", renderPlayer);
  music.addEventListener("timeupdate", () => {
    $("#mp-bar").style.width = music.duration ? (100 * music.currentTime / music.duration) + "%" : "0";
  });
  music.addEventListener("ended", () => {
    if (cur === WALTZ && current === "s-dance") { music.currentTime = 0; music.play(); } // вальс по кругу, пока она на танцполе
    else if (unlockedTracks.size > 1) step(1);
    else renderPlayer(); // единственную открытую песню (с торта) по кругу не крутим
  });

  function renderPlayer() {
    const t = cur && byId(cur);
    const playing = isPlaying();
    $("#mp-title").textContent = t ? t.title : "Треки откроются по пути";
    $("#mp-artist").textContent = t ? t.artist : "";
    $("#mp-play").textContent = playing ? "❚❚" : "▶";
    $("#mp-play").setAttribute("aria-label", playing ? "Пауза" : "Играть");
    $("#mp-play").disabled = !t;
    $("#mp-count").textContent = unlockedTracks.size + "/" + tracks.length;
    $("#mp-tracks").innerHTML = tracks.map((x) => {
      const open = unlockedTracks.has(x.id);
      return `<li class="${open ? "" : "locked"} ${x.id === cur ? "cur" : ""}" data-id="${x.id}">
        <span class="ic">${!open ? "🔒" : x.id === cur && playing ? "♪" : "▶"}</span>
        <span>${open ? `<b>${x.title}</b> ${x.artist ? "· " + x.artist : ""}` : "откроется дальше"}</span></li>`;
    }).join("");
    // строки на странице плейлиста
    [...$("#playlist").children].forEach((li) => {
      const id = li.dataset.id, open = unlockedTracks.has(id);
      li.classList.toggle("locked", !open);
      li.classList.toggle("playing", id === cur && playing);
      li.querySelector(".play").textContent = !open ? "🔒" : id === cur && playing ? "❚❚" : "▶";
    });
  }
  let toastT = null;
  function toast(text) {
    const el = $("#mp-toast");
    el.textContent = text; el.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2600);
  }
  $("#mp-play").onclick = () => (isPlaying() ? pauseMusic() : cur && playTrack(cur));
  $("#mp-prev").onclick = () => step(-1);
  $("#mp-next").onclick = () => step(1);
  $("#mp-list").onclick = (e) => { e.stopPropagation(); $("#mp-toast").classList.remove("show"); $("#mp-popup").classList.toggle("hidden"); };
  $("#mp-tracks").onclick = (e) => {
    const li = e.target.closest("li"); if (!li) return;
    if (li.dataset.id === cur && isPlaying()) pauseMusic(); else playTrack(li.dataset.id);
  };
  document.addEventListener("click", (e) => { if (!e.target.closest("#mplayer")) $("#mp-popup").classList.add("hidden"); });

  // ---------- 6. Плейлист (управляет тем же плеером) ----------
  C.playlist.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track";
    li.dataset.id = "t" + i;
    li.innerHTML = `<button class="play" aria-label="Играть">▶</button>
      <div class="meta"><b>${t.title}</b><span>${t.artist}</span>${t.note ? `<span class="note">${t.note}</span>` : ""}</div>`;
    li.onclick = () => (cur === li.dataset.id && isPlaying() ? pauseMusic() : playTrack(li.dataset.id));
    $("#playlist").appendChild(li);
  });
  // При первом заходе на страницу плейлиста сама включается песня playlistAutoplay (Calm Down)
  let playlistStarted = false;
  onEnter["s-playlist"] = () => {
    if (playlistStarted) return;
    playlistStarted = true;
    const a = C.playlistAutoplay;
    const i = typeof a === "string" ? C.playlist.findIndex((t) => t.title === a) : a;
    if (i != null && i !== false && i >= 0 && C.playlist[i]) playTrack("t" + i);
  };
  const ya = $("#yandex-link");
  if (C.yandexPlaylist) { ya.href = C.yandexPlaylist; ya.onclick = () => pauseMusic(); } else ya.remove();
  renderPlayer();

  // ---------- 7. Чай? Кофе? … Потанцуем? ----------
  $("#drink-q").textContent = C.drinkQuestion;
  $("#drink-prompt").textContent = C.drinkPrompt;
  $("#drink-input").placeholder = C.drinkPlaceholder;
  $("#drink-hint").textContent = C.drinkHint;
  $("#waltz-caption").textContent = C.waltzCaption;
  const norm = (t) => t.toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-я]/g, "");
  let drinkTries = 0;
  $("#drink-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = norm($("#drink-input").value);
    if (!val) return;
    if (C.drinkAnswers.map(norm).includes(val)) {
      $("#drink-step").classList.add("hidden");
      startWaltz(); // запускаем прямо в обработчике нажатия, иначе браузер не даст включить звук
      confetti(80);
      return;
    }
    drinkTries++;
    $("#drink-msg").textContent = C.drinkWrong[(drinkTries - 1) % C.drinkWrong.length];
    const card = $("#s-dance .card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    if (drinkTries >= 2) $("#drink-hint").classList.remove("hidden");
    $("#drink-input").select();
  });

  // Музыка: Never Enough играет через общий плеер, а если файла нет — запасной вальс, сыгранный самим браузером
  let songMissing = false, dancing = false;
  // Песня начинается, как только появляется вопрос «Чай? Кофе?», и продолжается в вальсе
  onEnter["s-dance"] = () => {
    if (!$("#waltz-step").classList.contains("hidden")) startWaltz(); // вернулась к уже начатому вальсу
    else playTrack(WALTZ);
  };
  function startWaltz() {
    $("#waltz-step").classList.remove("hidden");
    $("#ballroom").classList.remove("paused");
    dancing = true;
    if (!(cur === WALTZ && isPlaying())) playTrack(WALTZ); // если уже играет с вопроса, просто продолжается
    syncDancers();
    const sp = $("#sparkles");
    if (!sp.children.length) for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.className = "sparkle"; s.textContent = rand(["✨", "⭐", "🤍", "🖤"]);
      s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 60 + "%";
      s.style.animationDelay = Math.random() * 2 + "s";
      sp.appendChild(s);
    }
  }
  // Кружение в темпе песни: оборот пары = 1 такт (4 доли), круг по залу = 4 такта.
  // Анимация перезапускается с позиции песни, чтобы повороты попадали в доли.
  const BEAT = 60 / (C.waltzBpm || 66), SPIN = 4 * BEAT, PATH = 16 * BEAT;
  function syncDancers() {
    const couple = $("#couple"), dancers = couple.querySelector(".dancers");
    const t = cur === WALTZ && !synthOn ? music.currentTime || 0 : 0;
    couple.style.animationName = dancers.style.animationName = "none";
    void couple.offsetWidth;
    couple.style.animationDuration = PATH + "s";
    dancers.style.animationDuration = SPIN + "s";
    couple.style.animationDelay = -(t % PATH) + "s";
    dancers.style.animationDelay = -(t % SPIN) + "s";
    couple.style.animationName = dancers.style.animationName = "";
  }
  function pauseWaltzScene() {
    dancing = false;
    $("#ballroom").classList.add("paused");
  }

  // Простенький вальс на Web Audio (раз-два-три), играет, только пока нет mp3
  const synthWaltz = (() => {
    let ctx = null, timer = null, next = 0, step = 0;
    const f = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const C_ = [64, 67, 72], G7 = [62, 65, 71], F_ = [65, 69, 72];
    const bars = [[48, C_], [43, G7], [43, G7], [48, C_], [41, F_], [48, C_], [43, G7], [48, C_]];
    const melody = [79, 76, 72, 71, 74, 77, 79, 77, 74, 76, 72, 67, 69, 72, 77, 79, 76, 72, 74, 77, 71, 72, 0, 0];
    const BEAT = 0.42;
    function note(freq, t, dur, vol, type) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    }
    function schedule() {
      while (next < ctx.currentTime + 0.25) {
        const bar = bars[Math.floor(step / 3) % bars.length], beat = step % 3;
        if (beat === 0) note(f(bar[0]), next, BEAT * 1.2, 0.22, "triangle");
        else bar[1].forEach((m) => note(f(m), next, BEAT * 0.6, 0.05, "sine"));
        const m = melody[step % melody.length];
        if (m) note(f(m), next, BEAT * 0.95, 0.08, "triangle");
        next += BEAT; step++;
      }
    }
    return {
      start() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume();
        if (timer) return; // уже играет
        next = ctx.currentTime + 0.05;
        clearInterval(timer); timer = setInterval(schedule, 60);
        $("#waltz-note").textContent = "Never Enough пока не добавлена (" + C.waltzSong + "), играет запасной вальс";
        $("#waltz-note").classList.remove("hidden");
      },
      stop() { clearInterval(timer); timer = null; ctx && ctx.suspend(); },
    };
  })();

  // ---------- 9. Письмо ----------
  $("#letter-title").textContent = C.letterTitle;
  $("#letter-sign").textContent = C.letterSign;
  $("#letter-body").innerHTML = C.letter.map((p) => `<p>${p}</p>`).join("");
  const openLetter = () => {
    $("#envelope").classList.add("hidden");
    $("#letter").classList.remove("hidden");
    confetti(80);
  };
  $("#envelope").onclick = openLetter;
  $("#envelope").onkeydown = (e) => (e.key === "Enter" || e.key === " ") && openLetter();

  // На письме музыка продолжает играть; если ничего не играет — включаем letterSong
  onEnter["s-letter"] = () => {
    if (isPlaying()) return;
    const id = C.letterSong === "waltz" || C.letterSong == null ? WALTZ : "t" + C.letterSong;
    playTrack(unlockedTracks.has(id) ? id : WALTZ);
  };

  // ---------- 10. Отзыв ----------
  // Сердечки-оценка и поле для текста. «Отправить»: если в config.js есть feedbackEndpoint — сохраняет
  // оценку и текст в Google Таблицу. Если его нет или сохранить не вышло: feedbackLink ({text} в ссылке
  // заменяется на её отзыв), иначе «Поделиться» на телефоне, а где этого нет — копирует отзыв.
  let rating = 0;
  const hearts = [1, 2, 3, 4, 5].map((n) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = "♥\uFE0E";
    b.setAttribute("role", "radio"); b.setAttribute("aria-label", n + " из 5");
    b.onclick = () => {
      rating = n;
      $("#feedback-msg").textContent = "";
      hearts.forEach((h, i) => { h.classList.toggle("on", i < n); h.setAttribute("aria-checked", i === n - 1); });
    };
    $("#feedback-rating").appendChild(b);
    return b;
  });
  if (C.feedbackRatingLabel === null) { $("#feedback-rating-label").remove(); $("#feedback-rating").remove(); }
  $("#feedback-input").placeholder = C.feedbackPlaceholder || "";
  $("#feedback-input").oninput = () => { $("#feedback-msg").textContent = ""; };
  const feedbackDone = (msg) => {
    $("#feedback-step").classList.add("hidden");
    $("#feedback-thanks").classList.remove("hidden");
    $("#feedback-msg").textContent = msg || "";
    confetti(90);
  };
  // Запрос «no-cors»: ответ Google прочитать нельзя, но если запрос ушёл, строка в таблице появилась
  const saveFeedback = async (text) => {
    if (!C.feedbackEndpoint) return false;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      await fetch(C.feedbackEndpoint, {
        method: "POST", mode: "no-cors", signal: ctrl.signal,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ rating, text, localTime: new Date().toString() }),
      });
      return true;
    } catch (e) { return false; } finally { clearTimeout(t); }
  };
  $("#feedback-send").onclick = async () => {
    const btn = $("#feedback-send");
    if (btn.disabled) return;
    const text = $("#feedback-input").value.trim();
    if (!text && !rating) {
      $("#feedback-msg").textContent = C.feedbackEmpty || "";
      $("#feedback-step").classList.remove("shake"); void $("#feedback-step").offsetWidth;
      $("#feedback-step").classList.add("shake");
      $("#feedback-input").focus();
      return;
    }
    if (C.feedbackEndpoint) {
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = C.feedbackSending || "…";
      const saved = await saveFeedback(text);
      btn.disabled = false; btn.textContent = label;
      if (saved) return feedbackDone();
    }
    const body = (rating ? "♥".repeat(rating) + "♡".repeat(5 - rating) + " (" + rating + "/5)\n" : "") + text;
    const copy = async () => { try { await navigator.clipboard.writeText(body); return true; } catch (e) { return false; } };
    if (C.feedbackLink) {
      const withText = C.feedbackLink.includes("{text}");
      if (!withText) copy();   // без {text} отзыв копируется, чтобы она вставила его в чат
      window.open(C.feedbackLink.replace("{text}", encodeURIComponent(body)), "_blank", "noopener");
      return feedbackDone(withText ? null : C.feedbackCopied);
    }
    if (navigator.share) {
      try { await navigator.share({ text: body }); return feedbackDone(); }
      catch (e) { if (e.name === "AbortError") return; }   // она закрыла окно «Поделиться» — ничего не делаем
    }
    if (await copy()) return feedbackDone(C.feedbackCopied);
    $("#feedback-msg").textContent = C.feedbackCopyFailed || "";
  };

  // ---------- Конфетти ----------
  const cv = $("#confetti"), cx = cv.getContext("2d");
  let parts = [], raf = null;
  const COLORS = ["#f4a7b9", "#e07a95", "#a9c5a0", "#d8b77a", "#fde3ea", "#c7b8e0"];
  function resize() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
  addEventListener("resize", resize); resize();
  function confetti(n) {
    for (let i = 0; i < n; i++) parts.push({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.3,
      vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4,
      s: (5 + Math.random() * 6) * devicePixelRatio, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: rand(COLORS),
    });
    if (!raf) tick();
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.y < cv.height + 20);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy * devicePixelRatio; p.r += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore();
    });
    raf = parts.length ? requestAnimationFrame(tick) : null;
    if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
  }

  // Для разработки: открой сайт с #dev, чтобы пропустить пароль и подарок
  function startSite() {
    if (location.hash === "#dev") { NAV.forEach((id) => { visited.add(id); unlockTracks(id, true); }); show("s-birthday"); }
    else if (current !== "s-password") show("s-password");
  }

  // ---------- 0. Таймер до дня рождения ----------
  // До openAt (время Австрии, не зависит от часов телефона) вместо открытки идёт обратный отсчёт.
  // 5 нажатий на 🎁 и код timerDebugCode пропускают таймер на этом устройстве; #timer в адресе включает его снова.
  const OPEN_AT = Date.parse(C.openAt || "") || 0;
  const SKIP_KEY = "hb-timer-skip";
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
  };
  if (location.hash === "#timer") store.set(SKIP_KEY, null);
  const pad = (n) => String(n).padStart(2, "0");
  const plural = (n, f) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
  let timerT = null, opening = false;
  function timerTick() {
    const left = OPEN_AT - Date.now();
    if (left <= 0) { openNow(true); return; }
    const s = Math.floor(left / 1000);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    $("#cd-d").textContent = d;      $("#cd-dl").textContent = plural(d, ["день", "дня", "дней"]);
    $("#cd-h").textContent = pad(h); $("#cd-hl").textContent = plural(h, ["час", "часа", "часов"]);
    $("#cd-m").textContent = pad(m); $("#cd-ml").textContent = plural(m, ["минута", "минуты", "минут"]);
    $("#cd-s").textContent = pad(sec); $("#cd-sl").textContent = plural(sec, ["секунда", "секунды", "секунд"]);
  }
  function openNow(celebrate) {
    if (opening) return;
    opening = true;
    clearInterval(timerT);
    if (!celebrate) { startSite(); return; }
    ["d", "h", "m", "s"].forEach((k) => ($("#cd-" + k).textContent = k === "d" ? "0" : "00"));
    $("#timer-title").textContent = C.timerDoneText || "🎉";
    confetti(220);
    setTimeout(startSite, 2000);
  }
  if (OPEN_AT && Date.now() < OPEN_AT && store.get(SKIP_KEY) !== "1") {
    $("#timer-title").textContent = C.timerTitle || "";
    $("#timer-text").textContent = C.timerText || "";
    show("s-timer");
    timerTick();
    timerT = setInterval(timerTick, 1000);
  } else {
    startSite();
  }
  // скрытый вход для проверки: 5 быстрых нажатий на подарок, потом код
  let taps = 0, tapT = null;
  $("#timer-gift").addEventListener("click", () => {
    taps++; clearTimeout(tapT); tapT = setTimeout(() => (taps = 0), 2500);
    if (taps < 5) return;
    taps = 0;
    $("#timer-form").classList.remove("hidden");
    $("#timer-code").focus();
  });
  $("#timer-form").addEventListener("submit", (e) => e.preventDefault());
  $("#timer-code").addEventListener("input", (e) => {
    const code = String(C.timerDebugCode || ""), v = e.target.value.trim();
    if (!code || v.length < code.length) return;
    if (v === code) { store.set(SKIP_KEY, "1"); openNow(false); return; }
    e.target.value = "";
    const card = $("#s-timer .card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
  });
})();
