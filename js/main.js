(() => {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const rand = (a) => a[Math.floor(Math.random() * a.length)];

  // ---------- Навигация между экранами ----------
  const NAV = ["s-birthday", "s-compliments", "s-map", "s-playlist", "s-dance", "s-letter"];
  const onEnter = {};
  let current = "s-password";

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    current = id;
    window.scrollTo(0, 0);
    const dots = $("#dots");
    dots.classList.toggle("hidden", !NAV.includes(id));
    dots.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.id === id));
    if (id !== "s-playlist") stopTrack();
    if (id !== "s-dance") stopWaltz();
    onEnter[id] && onEnter[id]();
  }
  NAV.forEach((id, i) => {
    const b = document.createElement("button");
    b.dataset.id = id;
    b.setAttribute("aria-label", "Раздел " + (i + 1));
    b.onclick = () => show(id);
    $("#dots").appendChild(b);
  });
  document.querySelectorAll("[data-next]").forEach((b) => (b.onclick = () => show(b.dataset.next)));

  // ---------- 1. Пароль ----------
  let tries = 0;
  const phrases = [...C.wrongPhrases];
  $("#pw-hint").textContent = C.passwordHint;
  $("#pw-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = $("#pw-input").value.trim().toLowerCase();
    if (C.password.map((p) => p.toLowerCase()).includes(val)) {
      $("#pw-msg").textContent = "Добро пожаловать, " + C.name + " 💖";
      setTimeout(() => show("s-gift"), 700);
      return;
    }
    tries++;
    $("#pw-msg").textContent = phrases[(tries - 1) % phrases.length];
    const card = $("#s-password .card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    if (tries >= 3) $("#pw-hint").classList.remove("hidden");
    $("#pw-input").select();
  });

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
    setTimeout(() => show("s-birthday"), 800);
  };

  // ---------- 3. День рождения: торт, конфетти, розы и сырки ----------
  $("#bd-title").textContent = C.birthdayTitle;
  $("#bd-subtitle").textContent = C.birthdaySubtitle;
  const candles = $("#candles");
  for (let i = 0; i < C.candles; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = '<div class="flame"></div>';
    candles.appendChild(c);
  }
  let rain = null;
  onEnter["s-birthday"] = () => {
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
  function blowOne() {
    const lit = [...candles.querySelectorAll(".candle:not(.out)")];
    if (!lit.length) return;
    rand(lit).classList.add("out");
    if (lit.length === 1) wish();
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
    }
  };
  function stopMic() {
    micRaf && cancelAnimationFrame(micRaf);
    micStream && micStream.getTracks().forEach((t) => t.stop());
    $("#mic-btn").classList.add("hidden");
  }

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

  // ---------- 5. Карта фоток ----------
  let map = null;
  onEnter["s-map"] = () => {
    if (map) { setTimeout(() => map.invalidateSize(), 50); return; }
    if (!window.L) { $("#map").textContent = "Карта не загрузилась (нет интернета?)"; return; }
    map = L.map("map", { scrollWheelZoom: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap, &copy; CARTO", maxZoom: 19,
    }).addTo(map);
    const icon = L.divIcon({ className: "", html: '<div class="heart-pin">💗</div>', iconSize: [28, 28], iconAnchor: [14, 26] });
    const markers = C.places.map((p) => {
      const html = `<div class="popup">
          <img src="${p.photo}" alt="" onerror="this.outerHTML='<div class=ph>Фото: ${p.photo}</div>'">
          <b>${p.title}</b><small>${p.city}</small>${p.text ? `<p>${p.text}</p>` : ""}</div>`;
      return L.marker([p.lat, p.lng], { icon }).addTo(map).bindPopup(html);
    });
    const all = L.featureGroup(markers);
    map.fitBounds(all.getBounds(), { padding: [30, 30] });

    const cities = ["Все", ...new Set(C.places.map((p) => p.city))];
    cities.forEach((city, i) => {
      const b = document.createElement("button");
      b.textContent = city;
      if (!i) b.classList.add("on");
      b.onclick = () => {
        document.querySelectorAll("#city-tabs button").forEach((x) => x.classList.toggle("on", x === b));
        const group = city === "Все" ? markers : markers.filter((_, k) => C.places[k].city === city);
        map.fitBounds(L.featureGroup(group).getBounds(), { padding: [40, 40], maxZoom: 14 });
      };
      $("#city-tabs").appendChild(b);
    });
    setTimeout(() => map.invalidateSize(), 50);
  };

  // ---------- 6. Плейлист ----------
  const player = $("#player");
  let playing = -1;
  C.playlist.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track";
    li.innerHTML = `<button class="play" aria-label="Играть">▶</button>
      <div class="meta"><b>${t.title}</b><span>${t.artist}</span>${t.note ? `<span class="note">${t.note}</span>` : ""}</div>`;
    li.onclick = () => (playing === i ? stopTrack() : playTrack(i));
    $("#playlist").appendChild(li);
  });
  function playTrack(i) {
    stopTrack();
    player.src = C.playlist[i].src;
    player.play().catch(() => alert("Файл " + C.playlist[i].src + " пока не добавлен"));
    playing = i;
    const li = $("#playlist").children[i];
    li.classList.add("playing"); li.querySelector(".play").textContent = "❚❚";
  }
  function stopTrack() {
    player.pause();
    [...$("#playlist").children].forEach((li) => { li.classList.remove("playing"); li.querySelector(".play").textContent = "▶"; });
    playing = -1;
  }
  player.onended = () => { const n = playing + 1; n < C.playlist.length ? playTrack(n) : stopTrack(); };

  // ---------- 7. Чай? Кофе? Потанцуем? ----------
  $("#drink-q").textContent = C.drinkQuestion;
  $("#dance-q").textContent = C.danceQuestion;
  $("#waltz-caption").textContent = C.waltzCaption;
  C.drinkOptions.forEach((o) => {
    const b = document.createElement("button");
    b.className = "btn btn-ghost"; b.textContent = o;
    b.onclick = () => { $("#drink-step").classList.add("hidden"); $("#dance-step").classList.remove("hidden"); };
    $("#drink-options").appendChild(b);
  });
  const waltz = new Audio(C.waltzSong);
  waltz.loop = true;
  function startWaltz() {
    $("#dance-step").classList.add("hidden");
    $("#waltz-step").classList.remove("hidden");
    $("#ballroom").classList.remove("paused");
    $("#waltz-toggle").textContent = "⏸ Пауза";
    waltz.play().catch(() => {});
    const sp = $("#sparkles");
    if (!sp.children.length) for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.className = "sparkle"; s.textContent = rand(["✨", "⭐", "🤍"]);
      s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 60 + "%";
      s.style.animationDelay = Math.random() * 2 + "s";
      sp.appendChild(s);
    }
  }
  function stopWaltz() { waltz.pause(); $("#ballroom").classList.add("paused"); $("#waltz-toggle").textContent = "▶ Продолжить"; }
  $("#dance-yes").onclick = startWaltz;
  $("#dance-yes2").onclick = startWaltz;
  $("#waltz-toggle").onclick = () => (waltz.paused ? startWaltz() : stopWaltz());

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
  if (location.hash === "#dev") show("s-birthday");
})();
