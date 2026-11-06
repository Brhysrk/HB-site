// =============================================================
//  НАСТРОЙКИ ОТКРЫТКИ — всё, что нужно менять, лежит здесь.
//  Тексты, пароль, фото, места на карте, плейлист, письмо.
// =============================================================
window.CONFIG = {
  name: "Диана",

  // ---------- 1. Пароль ----------
  // Пароль из цифр: сколько цифр, столько и ячеек. Можно несколько вариантов одинаковой длины.
  password: ["0910"],
  passwordQuestion: "День, когда я первый раз подарил тебе цветы 💐",
  // Подсказки открываются по одной после неверных попыток (номера попыток в hintsAfter)
  passwordHints: [
    "Я ещё предложил тебе стать моей девушкой тогда",
    "День рождения твоего папы",
    "ДД ММ: сначала 2 цифры дня, потом 2 цифры месяца",
  ],
  hintsAfter: [2, 4, 6],
  pinPlaceholders: "ДДММ",          // появляются в ячейках вместе с последней подсказкой
  wrongPhrases: [
    "Неа. Попробуй ещё, цветочек 🌸",
    "Холодно... как в Питере ❄️",
    "Это пароль от чего-то другого 🤨",
    "Любимая, соберись! 🦌",
    "Почти! (нет)",
    "Система подозревает, что ты не Диана 🕵️‍♀️",
    "Подсказка уже на экране 👀",
    "Ещё одна попытка — и я сам введу 😅",
  ],

  // ---------- 2. Подарок ----------
  giftTitle: "Вам был отправлен подарок 🎁",
  giftText: "Отправитель: тот, кто тебя очень любит",
  dodgePhrases: ["Отказано", "Мимо!", "Даже не думай", "Кнопка устала, жми «Принять»", "🙅‍♂️"],

  // ---------- 3. С днём рождения ----------
  birthdayTitle: "С днём рождения, Диана!",
  birthdaySubtitle: "Задуй свечи и загадай желание ✨",
  candles: 18,
  wishText: "Желание принято и отправлено во Вселенную 💫",

  // ---------- 4. Комплименты ----------
  compliments: [
    "У тебя самая красивая улыбка на свете",
    "Ты невероятно красивая",
    "У тебя самое нежное и прекрасное белое платье",
    "Ты танцуешь вальс лучше всех на выпускном",
    "Ты - мой самый любимый цветочек",
    "Рядом с тобой Москва-Сити кажется маленьким",
    "Ты пахнешь как 101 роза",
    "Ты ценнее 101 сырка",
    "Бэмбик!",
    "С тобой я хочу посетить каждый уголок мира",
    "Ты такая красивая, зачем тебе учиться?",
    "Ты самая красивая выпускница гимназии",
    "У тебя очень красивый и приятный певучий голос",
    "Твой блог - самый эстетичный в мире",
    "У тебя самая милая собака (ребёночек) в мире",
    "Твой аутфит шикарен всегда",
    "Ты - моё счастье"
  ],

  // ---------- Окно после свечей ----------
  giftsTitle: "Я приготовил для тебя несколько подарков!",
  giftsText: "Открывай их по очереди 🎀",

  // ---------- Карта фоток ----------
  // Каждое место с lat/lng = своё сердечко на карте; по нажатию открывается альбом его фото.
  // Места БЕЗ lat/lng попадают в общее сердечко города «наши моменты» (см. cityMoments ниже).
  // В photos можно перечислить сколько угодно фото. Файлы лежат в assets/photos/<город>/.
  places: [
    // --- Екатеринбург ---
    { title: "Ельцин Центр",          city: "Екатеринбург", lat: 56.8447, lng: 60.5915, text: "",
      photos: ["assets/photos/ekb/eltsin-center1.jpg", "assets/photos/ekb/eltsin-center2.jpg"] },
    { title: "Последний звонок",      city: "Екатеринбург", text: "",
      photos: ["assets/photos/ekb/last-ring1.jpg", "assets/photos/ekb/last-ring2.jpg", "assets/photos/ekb/last-ring3.jpg"] },
    { title: "Выпускной", city: "Екатеринбург", text: "",
      photos: ["assets/photos/ekb/prom1.jpg", "assets/photos/ekb/prom2.jpg", "assets/photos/ekb/prom-dance.jpg", "assets/photos/ekb/prom-dance2.jpg"] },
    { title: "101 сырок и 101 роза",  city: "Екатеринбург", text: "",
      photos: ["assets/photos/ekb/101-syrok.jpg", "assets/photos/ekb/101-rose.jpg"] },
    { title: "Кек",                   city: "Екатеринбург", text: "",
      photos: ["assets/photos/ekb/heh.jpg"] },
    { title: "Дерево любви",          city: "Екатеринбург", text: "",
      photos: ["assets/photos/ekb/love-tree1.jpg", "assets/photos/ekb/love-tree2.jpg"] },
    { title: "Ночь музыки",           city: "Екатеринбург", text: "",
      photos: ["assets/photos/ekb/music-night.jpg"] },
    { title: "Фотосессия",            city: "Екатеринбург", text: "",
      photos: ["assets/photos/ekb/photoset.jpg"] },

    // --- Касли ---
    { title: "Касли",                 city: "Касли", lat: 55.8867, lng: 60.7536, text: "",
      photos: ["assets/photos/ekb/kasli.jpg"] },

    // --- Москва ---
    { title: "ВШЭ, финал НТО",        city: "Москва", lat: 55.7539, lng: 37.6486, text: "", photos: [] },
    { title: "Москва-Сити", city: "Москва", lat: 55.7494, lng: 37.5379, text: "Мой день рождения",
      photos: ["assets/photos/moscow/moscow-city.jpg", "assets/photos/moscow/observation-deck.jpg"] },
    { title: "Прогулки по Москве",    city: "Москва", text: "",
      photos: ["assets/photos/moscow/walking.jpg", "assets/photos/moscow/metro.jpg"] },

    // --- Санкт-Петербург ---
    { title: "Эрмитаж и Дворцовая площадь", city: "Санкт-Петербург", lat: 59.9398, lng: 30.3146, text: "",
      photos: ["assets/photos/spb/hermitage.jpg", "assets/photos/spb/palace-square.jpg"] },
    { title: "Эрарта",                city: "Санкт-Петербург", lat: 59.9318, lng: 30.2510, text: "",
      photos: ["assets/photos/spb/erarta.jpg"] },
    { title: "Мариинский театр",      city: "Санкт-Петербург", lat: 59.9256, lng: 30.2960, text: "",
      photos: ["assets/photos/spb/mariinskiy-theatre.jpg"] },
    { title: "Настоечки)))",         city: "Санкт-Петербург", text: "",
      photos: ["assets/photos/spb/restaurant.jpg"] },
  ],
  // Фото мест без координат собираются в одно сердечко города «наши моменты» в этой точке
  cityMoments: {
    "Екатеринбург":    { lat: 56.8380, lng: 60.6040, title: "Екатеринбург · наши моменты" },
    "Москва":          { lat: 55.7558, lng: 37.6173, title: "Москва · наши моменты" },
    "Санкт-Петербург": { lat: 59.9343, lng: 30.3351, title: "Питер · наши моменты" },
  },
  // Сердечко-загадка: фото нет, по нажатию выскакивает надпись
  teaser: { title: "Вена", lat: 48.2082, lng: 16.3738, text: "To be continued..." },

  // ---------- Песня на окне с тортом ----------
  // Первая в плеере внизу: включается сама, когда она принимает подарок, и играет на окне с тортом
  // (на паузе, пока она дует в микрофон). На странице плейлиста её нет.
  birthdaySong: { title: "Zum Geburtstag viel Glück", artist: "Kinderlieder", src: "assets/music/zum-geburtstag.mp3" },

  // ---------- 6. Плейлист ----------
  // src: mp3 в assets/music. note: почему эта песня.
  // Все песни плейлиста появляются в плеере внизу, когда она заходит на страницу плейлиста.
  // unlockAt — открыть песню на другой странице (s-birthday, s-gifts, s-compliments, s-playlist,
  // s-map, s-digital, s-dance, s-letter). Never Enough открывается на «Чай? Кофе?».
  playlist: [
    { title: "Calm Down", artist: "Revolver", src: "assets/music/calm-down.mp3", note: "" },
    { title: "blue", artist: "yung kai", src: "assets/music/blue.mp3", note: "" },
    { title: "we fell in love in october", artist: "girl in red", src: "assets/music/we-fell-in-love-in-october.mp3", note: "" },
    { title: "so am i.",               artist: "Super Whatevr",           src: "assets/music/so-am-i.mp3",         note: "" },
    { title: "В абрикосовой долине",   artist: "mzlff",                   src: "assets/music/abrikosovaya-dolina.mp3", note: "" },
    { title: "I Love You So",          artist: "The Walters",             src: "assets/music/i-love-you-so.mp3",   note: "" },
    { title: "Golden Hour",            artist: "JVKE",                    src: "assets/music/golden-hour.mp3",     note: "" },
    { title: "Heat Waves",             artist: "Glass Animals, iann dior", src: "assets/music/heat-waves.mp3",     note: "" },
    { title: "Love U Like That",       artist: "Lauv",                    src: "assets/music/love-u-like-that.mp3", note: "" },
    { title: "Light Switch",           artist: "Charlie Puth",            src: "assets/music/light-switch.mp3",    note: "" },
    { title: "Safe And Sound",         artist: "Capital Cities",          src: "assets/music/safe-and-sound.mp3",  note: "" },
    { title: "Accidentally In Love",   artist: "Counting Crows",          src: "assets/music/accidentally-in-love.mp3", note: "" },
    { title: "On Melancholy Hill",     artist: "Gorillaz",                src: "assets/music/on-melancholy-hill.mp3", note: "" },
    { title: "Purple",                 artist: "Hollow Coves",            src: "assets/music/purple.mp3",          note: "" },
    { title: "Let Me In",              artist: "Snowmine",                src: "assets/music/let-me-in.mp3",       note: "" },
    { title: "Букет крапивы",          artist: "Noize MC",                src: "assets/music/buket-krapivy.mp3",   note: "" },
    { title: "Под звездопадом",        artist: "Тима Белорусских",        src: "assets/music/pod-zvezdopadom.mp3", note: "" },
    { title: "Somewhere Only We Know", artist: "Keane",                   src: "assets/music/somewhere-only-we-know.mp3", note: "" },
    { title: "Die With a Smile",       artist: "Lady Gaga, Bruno Mars",   src: "assets/music/die-with-a-smile.mp3", note: "" },
    { title: "Любимый цвет",           artist: "Noize MC",                src: "assets/music/lyubimyy-cvet.mp3",   note: "" },
  ],

  // Какая песня сама включается при первом заходе на страницу плейлиста: название из списка выше
  // (или номер, 0 — первая; null — никакая). По названию — чтобы не сбивалось при смене порядка.
  playlistAutoplay: "Calm Down",

  // Кнопка под плейлистом
  yandexPlaylist: "https://music.yandex.ru/playlists/50de6fd2-e10b-48de-8a14-7e0b35667c1f?utm_source=web&utm_medium=copy_link",

  // ---------- Окно перед вальсом ----------
  digitalText: "Все эти подарки в цифровом формате, но я надеюсь, что тебе всё равно понравилось.",
  digitalSmall: "(я очень скучаю)",

  // ---------- 7. Чай? Кофе? ... Потанцуем? ----------
  drinkQuestion: "Чай? Кофе? …",
  drinkPrompt: "Продолжи фразу одним словом",
  drinkPlaceholder: "Твой ответ…",
  drinkAnswers: ["потанцуем"],        // регистр, «ё» и знаки препинания не важны
  drinkWrong: [
    "Извини, но нет 😄",
    "Горячо... но не то 🔥",
    "Мимо, но мне нравится ход мыслей 😏",
    "Ещё варианты? 🙃",
    "Какая-то фигня, собачка"
  ],
  drinkHint: "Подсказка: что мы делали с тобой на выпускном? 🎓",  // показывается после 2-го неверного ответа
  waltzSong: "assets/music/never-enough.mp3",   // Never Enough — положи файл сюда
  waltzTitle: "Never Enough",
  waltzBpm: 66,                       // темп Never Enough: пара делает оборот за такт (4 доли), круг по залу за 4 такта
  waltzCaption: "🤍 🖤",

  // ---------- 9. Личное письмо ----------
  letterTitle: "Моей Диане",
  letter: [
    "Дорогая Ди,",
    "Здесь будет твоё личное письмо. Напиши его своими словами — абзацы разделяются отдельными строками в этом списке.",
    "Второй абзац...",
  ],
  letterSign: "Твой ❤",
  // Песня на письме, если к этому моменту ничего не играет: "waltz" — Never Enough,
  // или номер песни из playlist (0 — первая). Переключать треки можно в плеере внизу.
  letterSong: "waltz",
};
