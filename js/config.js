// =============================================================
//  НАСТРОЙКИ ОТКРЫТКИ — всё, что нужно менять, лежит здесь.
//  Тексты, пароль, фото, места на карте, плейлист, письмо.
// =============================================================
window.CONFIG = {
  name: "Диана",
  // Заголовки и подзаголовки страниц лежат в разделах ниже, у каждой страницы свои:
  // timerTitle, passwordTitle, giftTitle, birthdayTitle, giftsTitle, complimentsTitle,
  // playlistTitle, rememberText, mapTitle, digitalText, drinkQuestion, letterTitle, feedbackTitle
  // (и рядом их подзаголовки).

  // ---------- 0. Таймер до дня рождения ----------
  // До этого момента вместо открытки показывается обратный отсчёт. Время австрийское и не зависит
  // от часов телефона: +01:00 — зимнее время Австрии, так что открытка откроется везде в одну секунду.
  openAt: "2026-11-12T00:00:00+01:00",
  timerTitle: "До твоего дня рождения",
  timerText: "Открытка откроется 12 ноября в 00:00 (по Центральноевропейскому) 🌸",
  timerDoneText: "С днём рождения! Открываю… 🎉",
  // Код для проверки: 5 раз быстро нажми на 🎁 над таймером и введи код. После этого таймер на этом
  // устройстве больше не показывается; чтобы снова его увидеть, открой сайт с #timer в конце адреса.
  timerDebugCode: "6560",

  // ---------- 1. Пароль ----------
  passwordTitle: "Только для одной принцессы",
  passwordSubtitle: "Введи пароль, чтобы открыть открытку",
  // Пароль из цифр: сколько цифр, столько и ячеек. Можно несколько вариантов одинаковой длины.
  password: ["0910"],
  passwordQuestion: "День, когда я первый раз подарил тебе цветы 💐",
  // Подсказки открываются по одной после неверных попыток (номера попыток в hintsAfter)
  passwordHints: [
    "Я ещё предложил тебе стать моей девушкой тогда",
    "День рождения твоего папы",
    "ДД-ММ: сначала 2 цифры дня, потом 2 цифры месяца",
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

  // ---------- Окно после свечей ----------
  giftsTitle: "Я приготовил для тебя несколько подарков!",
  giftsText: "Открывай их по очереди 🎀",

  // ---------- 4. Комплименты ----------
  complimentsTitle: "Генератор комплиментов",
  complimentsSubtitle: "Жми сколько хочешь — они не заканчиваются",
  complimentsStart: "Нажми на кнопку 💐",   // текст в рамке до первого нажатия
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
    "У тебя очень красивый певучий голос",
    "Твой блог - самый эстетичный в мире",
    "У тебя самая милая собака (ребёночек) в мире",
    "Твой аутфит шикарен всегда",
    "Ты - моё счастье",
    "Я влюбился в тебя с первого свидания",
    "В Эрмитаже много шедевров, но самый красивый всё время шёл рядом со мной",
    "Ты красивая на всех языках: и по‑русски, и auf Deutsch",
    "С тобой мне хочется становиться лучше",
    "Ты умеешь удивлять как никто",
    "Ты - моя анестезия",
    "Ты понимаешь меня с полуслова",
    "С тобой я чувствую себя дома в любом городе",
    "Ты делаешь меня счастливее одним сообщением",
    "Ты красивее, чем вид с любой смотровой площадки",
    "Ты вкуснее матча-латте на миндальном молоке с ванильным сиропом",
    "Du bist mein Sonnenschein ☀️",
    "Твои глаза красивее любого заката",
  ],

  // ---------- Карта фоток ----------
  mapTitle: "Наша карта",
  mapSubtitle: "Ты знаешь, как сильно я люблю карты ... ну и нас тоже)",
  // Каждое место с lat/lng = своё сердечко на карте; по нажатию открывается альбом его фото.
  // Места БЕЗ lat/lng попадают в общее сердечко города «наши моменты» (см. cityMoments ниже).
  // В photos можно перечислить сколько угодно фото. Файлы лежат в assets/photos/<город>/.
  places: [
    // --- Екатеринбург ---
    { title: "Ельцин Центр",          city: "Екатеринбург", lat: 56.8447, lng: 60.5915, text: "Как же много всего произошло именно здесь",
      photos: ["assets/photos/ekb/prom1.jpg", "assets/photos/ekb/prom2.jpg", "assets/photos/ekb/prom-dance.jpg", "assets/photos/ekb/prom-dance2.jpg", "assets/photos/ekb/eltsin-center1.jpg", "assets/photos/ekb/eltsin-center2.jpg"], },
    { title: "Последний звонок",      city: "Екатеринбург", lat: 56.84, lng: 60.58, text: "",
      photos: ["assets/photos/ekb/last-ring3.jpg", "assets/photos/ekb/last-ring2.jpg", "assets/photos/ekb/last-ring1.jpg"] },
    { title: "Твой 🏠",               city: "Екатеринбург", lat: 56.78, lng: 60.53, text: "💐",
      photos: ["assets/photos/ekb/101-rose.jpg", "assets/photos/ekb/heh.jpg"] },
    { title: "Мой 🏠",                city: "Екатеринбург", lat: 56.84260555549573, lng: 60.58319554573038, text: "Лучший подарочкек!",
      photos: ["assets/photos/ekb/101-syrok.jpg", "assets/photos/ekb/love-tree1.jpg", "assets/photos/ekb/love-tree2.jpg"] },
    { title: "Ночь музыки",           city: "Екатеринбург", lat: 56.84, lng: 60.60, text: "Ат вин-та!",
      photos: ["assets/photos/ekb/music-night.jpg"] },
    { title: "Фотосессия",            city: "Екатеринбург", lat: 56.84, lng: 60.61, text: "Спасибо, что согласилась тогда ❤️",
      photos: ["assets/photos/ekb/photoset.jpg"] },

    // --- Касли ---
    { title: "Касли",                 city: "Касли", lat: 55.92, lng: 60.80, text: "Швейцарское море",
      photos: ["assets/photos/ekb/kasli.jpg"] },

    // --- Москва ---
    { title: "ВШЭ, финал НТО",        city: "Москва", lat: 55.7539, lng: 37.6486, text: "Я всё ещё жду фотки 😾", photos: [] },
    { title: "Москва-Сити", city: "Москва", lat: 55.7494, lng: 37.5379, text: "Мой день рождения ❤️",
      photos: ["assets/photos/moscow/observation-deck.jpg", "assets/photos/moscow/moscow-city.jpg"] },
    { title: "Прогулка по Москве",    city: "Москва", text: "",
      photos: ["assets/photos/moscow/walking.jpg", "assets/photos/moscow/metro.jpg"] },

    // --- Санкт-Петербург ---
    { title: "Эрмитаж и Дворцовая площадь", city: "Санкт-Петербург", lat: 59.9398, lng: 30.3146, text: "Мне очень понравилось... тебя сопровождать)",
      photos: ["assets/photos/spb/hermitage.jpg", "assets/photos/spb/palace-square.jpg"] },
    { title: "Эрарта",                city: "Санкт-Петербург", lat: 59.9318, lng: 30.2510, text: "Я отменил подписку кста",
      photos: ["assets/photos/spb/erarta.jpg"] },
    { title: "Мариинский театр",      city: "Санкт-Петербург", lat: 59.9256, lng: 30.2960, text: "Вайбик",
      photos: ["assets/photos/spb/mariinskiy-theatre.jpg"] },
    { title: "Настоечки)))",         city: "Санкт-Петербург", text: "Ням",
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
  playlistTitle: "Мой плейлист для тебя",
  playlistSubtitle: "Песни, которые больше всех напоминают мне о тебе (и все они есть в моих любимых) 🎵",
  // src: mp3 в assets/music. note: почему эта песня.
  // Все песни плейлиста появляются в плеере внизу, когда она заходит на страницу плейлиста.
  // unlockAt — открыть песню на другой странице (s-birthday, s-gifts, s-compliments, s-playlist,
  // s-remember, s-map, s-digital, s-dance, s-letter, s-feedback). Never Enough открывается на «Чай? Кофе?».
  playlist: [
    { title: "Calm Down",              artist: "Revolver",                src: "assets/music/calm-down.mp3",                  note: "Эту песню ты отправила мне, когда мы отправляли друг друг наши ассоциации... с тех пор она мне тоже нравится" },
    { title: "blue",                   artist: "yung kai",                src: "assets/music/blue.mp3",                       note: "Я слушал её в самом начале нашего знакомства" },
    { title: "we fell in love in october", artist: "girl in red",         src: "assets/music/we-fell-in-love-in-october.mp3", note: "Видела бы ты моё удивление, когда я лайкнул её и ты отправила мне её в самом начале октября" },
    { title: "so am i.",               artist: "Super Whatevr",           src: "assets/music/so-am-i.mp3",                    note: "Мы одинаковые" },
    { title: "В абрикосовой долине",   artist: "mzlff",                   src: "assets/music/abrikosovaya-dolina.mp3",        note: "Я меняю краски на взгляд твой" },
    { title: "I Love You So",          artist: "The Walters",             src: "assets/music/i-love-you-so.mp3",              note: "I love u soooooooo" },
    { title: "Golden Hour",            artist: "JVKE",                    src: "assets/music/golden-hour.mp3",                note: "So schön wie du" },
    { title: "Heat Waves",             artist: "Glass Animals, iann dior",src: "assets/music/heat-waves.mp3",                 note: "Иногда я правда не могу перестать о тебе думать" },
    { title: "Love U Like That",       artist: "Lauv",                    src: "assets/music/love-u-like-that.mp3",           note: "Не существует ощущения приятней, чем твои поцелуи" },
    { title: "Light Switch",           artist: "Charlie Puth",            src: "assets/music/light-switch.mp3",               note: "Помню как спал дома в полукоме, а потом ты позвонила, предложила встретиться и я моментально встал и собрался" },
    { title: "Safe And Sound",         artist: "Capital Cities",          src: "assets/music/safe-and-sound.mp3",             note: "You are my luck!" },
    { title: "Accidentally In Love",   artist: "Counting Crows",          src: "assets/music/accidentally-in-love.mp3",       note: "Come on! Come on!" },
    { title: "On Melancholy Hill",     artist: "Gorillaz",                src: "assets/music/on-melancholy-hill.mp3",         note: "You are my medicine, when you're close to me" },
    { title: "Purple",                 artist: "Hollow Coves",            src: "assets/music/purple.mp3",                     note: "Just U and I ..." },
    { title: "Let Me In",              artist: "Snowmine",                src: "assets/music/let-me-in.mp3",                  note: "If you could keep it together for a moment in time" },
    { title: "Букет крапивы",          artist: "Noize MC",                src: "assets/music/buket-krapivy.mp3",              note: "Ты - моя анестезия" },
    { title: "Под звездопадом",        artist: "Тима Белорусских",        src: "assets/music/pod-zvezdopadom.mp3",            note: "Я чисто здесь, чтобы ты улыбалась и не забывала" },
    { title: "Somewhere Only We Know", artist: "Keane",                   src: "assets/music/somewhere-only-we-know.mp3",     note: "Why don't we go?" },
    { title: "Die With a Smile",       artist: "Lady Gaga, Bruno Mars",   src: "assets/music/die-with-a-smile.mp3",           note: "If the world was ending, I'd wanna be next to you" },
    { title: "Любимый цвет",           artist: "Noize MC",                src: "assets/music/lyubimyy-cvet.mp3",              note: "Без намёков (нет, зелёный - не любимый)" },
  ],

  // Какая песня сама включается при первом заходе на страницу плейлиста: название из списка выше
  // (или номер, 0 — первая; null — никакая). По названию — чтобы не сбивалось при смене порядка.
  playlistAutoplay: "Calm Down",

  // Кнопка под плейлистом
  yandexPlaylist: "https://music.yandex.ru/playlists/50de6fd2-e10b-48de-8a14-7e0b35667c1f?utm_source=web&utm_medium=copy_link",

  // ---------- Окно после плейлиста: «Я всё помню» ----------
  rememberEmoji: "🤍",
  rememberText: "Я всё помню",
  rememberSmall: "Даже, когда делаю вид, что забыл. Сейчас покажу 🗺️",

  // ---------- Окно перед вальсом ----------
  digitalText: "Если у тебя есть ещё наши фото, то можешь отправить, я обязательно добавлю их на эту карту 🤗",
  digitalSmall: "(я знаю, что у тебя есть)",
 
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
    "Какая-то фигня, собачка 🐕"
  ],
  drinkHint: "Подсказка: что мы делали с тобой на выпускном? 💃",  // показывается после 2-го неверного ответа
  waltzSong: "assets/music/never-enough.mp3",   // Never Enough — положи файл сюда
  waltzTitle: "Never Enough",
  waltzBpm: 67,                       // темп Never Enough: пара делает оборот за такт (4 доли), круг по залу за 4 такта
  waltzCaption: "🤍 🖤",

  // ---------- 9. Личное письмо ----------
  envelopeHint: "Нажми, чтобы открыть",   // подпись под конвертом
  letterTitle: "Моей Диане",
  letter: [
    "Дорогая Диана,",
    "Поздравляю Райана Гослинга и, конечно  же, тебя с великолепным днём. Прекрасное число 18, открывающее множество возможностей и пространства для фантазии. Хочу чтобы ты прочувствовала, насколько невероятно свободное и независимое ощущение даёт этот возраст, говорю на личном двухмесячном опыте.",
    "Я благодарен тебе за этот год, за все твои подарки и твоё внимание, за первые серьёзные отношения, за то, что была рядом, слушала и поддерживала в трудные моменты, за каждую секунду уделённого тобой времени и, особенно, за каждое твоё проявление любви. Искренне, не помню, чтобы испытывал чувства приятнее и ощущал себя счастливее, чем в подобные моменты. Я безумно рад, что тебе было комфортно и нравилось со мной. Уже говорил, но повторюсь, что за этот прекрасный год ты стала для меня самым близким человеком.",
    "Я искренне рад, что ты не отказалась от своей цели и очень надеюсь, что тебе сейчас хорошо и ты сможешь адоптироваться к новой жизни. Никто не знает, что будет в этом туманном будущем, но твоя вера в меня и наша любовь направляет меня и заставляет верить в лучшее. Ты – моё солнце. Скучаю без тебя и невероятно жду нашу следующую встречу. Всей душой ценю и люблю тебя ... für immer.",
    "С праздником, мой прекрасный цветочек 🎉💐❤️"
  ],
  letterSign: "Лёша ❤",
  // Песня на письме, если к этому моменту ничего не играет: "waltz" — Never Enough,
  // или номер песни из playlist (0 — первая). Переключать треки можно в плеере внизу.
  letterSong: "waltz",

  // ---------- 10. Последнее окно: отзыв ----------
  // Открывается кнопкой «Дальше» под письмом. Она ставит сердечки и пишет пару слов.
  feedbackEmoji: "🥹",
  feedbackTitle: "Тебе понравилось?",
  feedbackText: "Мне очень важно знать, что ты думаешь! Поделись эмоциями и напиши, что понравилось больше всего.",
  feedbackRatingLabel: "Сколько сердечек поставишь?",   // null — убрать сердечки
  feedbackPlaceholder: "Пиши всё как есть…",
  feedbackButton: "Отправить мне 💌",
  feedbackEmpty: "Поставь сердечки или напиши хоть пару слов 🙂",
  feedbackThanks: "Спасибо, солнце! ❤",
  feedbackSmall: "Ich liebe dich … für immer 🤍",
  // Куда уходит отзыв. Пусто — на телефоне откроется «Поделиться» и она сама выберет чат с тобой,
  // а где так нельзя, отзыв скопируется и она вставит его тебе в сообщения.
  // Можно указать свой чат: WhatsApp "https://wa.me/43XXXXXXXXXX?text={text}" (номер без + и пробелов,
  // {text} заменится на её отзыв), или Telegram "https://t.me/твой_ник" (там отзыв скопируется
  // и откроется чат с тобой, останется вставить).
  feedbackLink: "",
  // База для отзывов: адрес веб-приложения Google Таблицы (как его получить — в README, раздел «Отзывы
  // в Google Таблицу»). Вида "https://script.google.com/macros/s/…/exec". Если он есть, оценка и текст
  // сохраняются в таблицу, и окно «Поделиться» уже не открывается. Если сохранить не вышло (нет интернета),
  // работает способ из feedbackLink выше.
  feedbackEndpoint: "https://script.google.com/macros/s/AKfycbzGiDGpCk8QzSgCTA-DLub_J_JReu3iBiDhz3NbJcBsgn4UolerkUTu8a_MPph040_q/exec",
  feedbackSending: "Отправляю…",
  feedbackCopied: "Отзыв скопирован, вставь его мне в сообщения 💌",
  feedbackCopyFailed: "Не получилось отправить отсюда, напиши мне в сообщениях 💌",
};
