// Скрипт для Google Таблицы: принимает отзыв с сайта и дописывает его строкой в первый лист.
// Как подключить — в README, раздел «Отзывы в Google Таблицу».

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) {}
    const rating = Math.max(0, Math.min(5, parseInt(d.rating, 10) || 0));
    const text = safe(d.text, 5000);
    if (!rating && !text) return ContentService.createTextOutput(JSON.stringify({ ok: false }));
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Когда пришло", "Оценка (из 5)", "Отзыв", "Время на её устройстве"]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), rating || "", text, safe(d.localTime, 80)]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Открыть адрес в браузере: если видно «ok», скрипт работает
function doGet() {
  return ContentService.createTextOutput("ok");
}

// Текст, который начинается с = + - @, таблица посчитала бы формулой, поэтому перед ним ставится апостроф
function safe(v, max) {
  const s = String(v == null ? "" : v).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
