/* مكتبة الشيخ أحمد الماحوزي — تطبيق صفحة واحدة بلا تبعيات.
   المسارات:
     #/                               الرئيسة
     #/book/{id}                      صفحة الكتاب وفهرسه
     #/read/{id}/{جزء}/{قسم}[/b{كتلة}]   القارئ
     #/h/{رقم}                         الانتقال إلى حديث برقمه العام
     #/search?q=…                     البحث
*/
(function () {
  'use strict';

  /* ───────── الكتب: يُضاف كل كتاب جديد هنا مع مجلد بياناته في data/{id}/ ───────── */
  var SADUQ = 'الشيخ الصدوق محمد بن علي بن الحسين بن بابويه القمي';
  var NOTE = 'قد نعبّر في كثير من الموارد عن الموثّق بالصحيح، لأسباب ذكرناها في ملحق رقم: 1، فراجع.';
  var CENTER = 'مركز أهل الذكر لنشر تراث أهل البيت عليهم السلام';
  var BOOKS = [
    {
      id: 'wasail',
      title: 'وسائل الشيعة',
      full: 'تفصيل وسائل الشيعة إلى تحصيل مسائل الشريعة',
      author: 'الشيخ محمد بن الحسن الحرّ العاملي',
      role: 'حقّقه وصحّح أسانيده',
      publisher: CENTER,
      blurb: 'الموسوعة الحديثية الفقهية الجامعة، محقَّقةً مخرَّجةَ الأحاديث، مع الحكم على كل سندٍ وبيان حال رجاله في الحاشية.',
      note: NOTE
    },
    { id: 'bihar', title: 'بحار الأنوار', full: 'بحار الأنوار الجامعة لدرر أخبار الأئمة الأطهار', author: 'العلامة الشيخ محمد باقر المجلسي', role: 'حقّقه وصحّح أسانيده',
      blurb: 'الموسوعة الحديثية الكبرى في العقائد والتاريخ والأخلاق، بتخريج أحاديثها وبيان أسانيدها. المنشور منها عشرة أجزاء.', note: 'نعبّر في الأعمّ الأغلب عن الموثّق بالصحيح، لأسباب ذكرناها في ملحق رقم: 1.' },
    { id: 'faqih', title: 'من لا يحضره الفقيه', full: 'من لا يحضره الفقيه', author: SADUQ, role: 'حقّقه وصحّح أسانيده',
      blurb: 'ثاني الكتب الأربعة في أحاديث الأحكام، كاملاً في خمسة أجزاء مع الحكم على أسانيده.', note: NOTE },
    { id: 'kamal', title: 'كمال الدين وتمام النعمة', full: 'كمال الدين وتمام النعمة', author: SADUQ, role: 'حقّقه وصحّح أسانيده', publisher: CENTER,
      blurb: 'كتاب الغيبة والإمامة، في إثبات الحجة وأخبار القائم عليه السلام.', note: NOTE },
    { id: 'uyun', title: 'عيون أخبار الرضا', full: 'عيون أخبار الرضا عليه السلام', author: SADUQ, role: 'حقّقه وصحّح أسانيده', publisher: CENTER,
      blurb: 'ما رُوي عن الإمام علي بن موسى الرضا عليه السلام من أخبار ومناظرات وأحاديث.', note: NOTE },
    { id: 'amali', title: 'الأمالي', full: 'الأمالي', author: SADUQ, role: 'حقّقه وصحّح أسانيده', publisher: CENTER,
      blurb: 'مجالس الإملاء التي أملاها الصدوق في مجالسه، مرتّبةً بتواريخها.', note: NOTE },
    { id: 'khisal', title: 'الخصال', full: 'الخصال', author: SADUQ, role: 'حقّقه وصحّح أسانيده', publisher: CENTER,
      blurb: 'الأحاديث مرتّبةً على الأعداد: من الواحد إلى ما فوق الألف.', note: NOTE },
    { id: 'ilal', title: 'علل الشرائع', full: 'علل الشرائع', author: SADUQ, role: 'حقّقه وصحّح أسانيده', publisher: CENTER,
      blurb: 'الأحاديث في علل الأحكام والأسماء والخلق، باباً باباً.', note: NOTE },
    { id: 'maani', title: 'معاني الأخبار', full: 'معاني الأخبار', author: SADUQ, role: 'حقّقه وصحّح أسانيده', publisher: CENTER,
      blurb: 'شرح معاني الألفاظ والأحاديث كما وردت عن أهل البيت عليهم السلام.', note: NOTE },
    { id: 'tawhid', title: 'التوحيد', full: 'التوحيد', author: SADUQ, role: 'صحّح أسانيده', extra: 'صحّحه وعلّق عليه السيد هاشم الحسيني الطهراني',
      blurb: 'أحاديث التوحيد ونفي التشبيه والصفات، بتعليقات السيد هاشم الطهراني وتصحيح أسانيدها.', note: NOTE },
    { id: 'thawab', title: 'ثواب الأعمال وعقاب الأعمال', full: 'ثواب الأعمال وعقاب الأعمال', author: SADUQ, role: 'حقّقه وصحّح أسانيده', publisher: 'برعاية إدارة الوقف الجعفري — دولة الكويت',
      blurb: 'ما ورد في ثواب الأعمال الصالحة وعقوبات الذنوب، في جزأين.', note: NOTE },
    { id: 'basair', title: 'بصائر الدرجات', full: 'بصائر الدرجات في فضائل آل محمد صلى الله عليهم', author: 'الشيخ محمد بن الحسن بن فرّوخ الصفّار', role: 'حقّقه وصحّح أسانيده',
      blurb: 'في فضائل الأئمة عليهم السلام وعلومهم. المنشور منه: المجلد الثاني (الجزء السادس فما بعده).', note: NOTE },
    { id: 'kamil', title: 'كامل الزيارات', full: 'كامل الزيارات', author: 'الشيخ جعفر بن محمد بن قولويه القمي', role: 'حقّقه وصحّح أسانيده', publisher: CENTER,
      blurb: 'أصلٌ في الزيارات وفضلها، من الباب التاسع والسبعين: زيارات الحسين عليه السلام. المنشور منه الجزء الثاني.', note: NOTE },
    { id: 'qisas', title: 'قصص الأنبياء', full: 'قصص الأنبياء عليهم السلام', author: 'قطب الدين سعيد بن هبة الله الراوندي', role: 'حقّقه',
      blurb: 'قصص الأنبياء من آدم إلى نبيّنا صلى الله عليه وآله بالأسانيد، محقَّقاً مقابَلاً على نسخه.' },
    { id: 'nusus', title: 'النصوص على أهل الخصوص', full: 'النصوص على أهل الخصوص عليهم السلام', own: true, publisher: 'إصدارات مدرسة أهل الذكر عليهم السلام',
      blurb: 'من مؤلفات الشيخ: جمعٌ للنصوص على الأئمة عليهم السلام من كتب الفريقين، بأسانيدها والكلام عليها.' },
    { id: 'arbaun', title: 'أربعون حديثاً معتبراً', full: 'أربعون حديثاً معتبراً في النص على الأئمة الاثني عشر بأسمائهم', own: true, extra: 'حرّره وأعدّه للطباعة جاسم بو كنان', publisher: 'مكتبة الثقلين',
      blurb: 'من أمالي الشيخ: أربعون حديثاً بأسانيدها، مع بيان مرتبة كل سندٍ وحال رجاله.' }
  ];
  var catalog = null;
  function loadCatalog() { return catalog || (catalog = getJSON('data/catalog.json').catch(function (e) { catalog = null; throw e; })); }
  /* سطر النسبة: «حقّقه وصحّح أسانيده سماحة الشيخ…» أو «تأليف سماحة الشيخ…» */
  function credit(b) { return (b.own ? 'تأليف' : b.role) + ' سماحة الشيخ أحمد الماحوزي'; }
  function volsWord(n) { return n === 1 ? 'جزء واحد' : n === 2 ? 'جزآن' : n + (n <= 10 ? ' أجزاء' : ' جزءاً'); }
  /* رابط الحديث: برقمه العام إن كان الترقيم فريداً في الكتاب، وإلا بموضعه */
  function rawiHref(b, name) { return '#/rawi/' + (b.id === 'wasail' ? '' : b.id + '/') + encodeURIComponent(name); }
  function hadithHref(b, unique, v, sec, i, n) {
    if (unique !== false && n) return '#/h/' + (b.id === 'wasail' ? '' : b.id + '/') + n;
    return '#/read/' + b.id + '/' + v + '/' + sec + '/b' + i;
  }
  var UPCOMING = [
    { title: 'كتبٌ أخرى تأتي تباعاً', sub: 'تُضاف مؤلفات الشيخ وتحقيقاته إلى المكتبة حال اكتمال تجهيزها.' }
  ];
  var GRADES = {
    s: 'صحيح', k: 'كالصحيح', h: 'حسن', m: 'موثّق', q: 'معتبر', r: 'مرسل', d: 'ضعيف', o: 'غير ذلك'
  };
  var GRADE_ORDER = ['s', 'k', 'h', 'q', 'm', 'r', 'd', 'o'];

  /* ───────── أدوات ───────── */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var app = $('#app');
  var fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  var escH = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var bookOf = function (id) { return BOOKS.filter(function (b) { return b.id === id; })[0]; };
  var blockText = function (b) { return b[0] === 'h' ? b[3] : b[0] === 'b' ? b[2] : b[1]; };
  var stripLinks = function (t) { return t.replace(/\uE003[^\uE001]*\uE001|\uE004/g, ''); };
  var stripMarks = function (t) { return stripLinks(t).replace(/\uE000\d+\uE001/g, ''); };
  var stripTashkeel = function (t) { return t.replace(/[ً-ٰٟ]/g, ''); };

  var ICON = {
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    image: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5.5-5 3.5 3 3-2.5 4 3.5"/></svg>',
    print: '<svg viewBox="0 0 24 24"><path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3"/></svg>',
    people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16.5 14.2c2.6.3 4.5 2.5 4.5 5.3"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    notes: '<svg viewBox="0 0 24 24"><path d="M5 4h14v12l-4 4H5z"/><path d="M15 20v-4h4M8 9h8M8 13h5"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21a2 2 0 0 1 2-2h13v2H6"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>'
  };

  /* ───────── الإعدادات ───────── */
  var DEFAULTS = { theme: 'light', size: 21, font: 'saad', tashkeel: true, notes: 'side' };
  var settings = Object.assign({}, DEFAULTS);
  try { Object.assign(settings, JSON.parse(localStorage.getItem('mahoozi.settings') || '{}')); } catch (e) { /* تخزين غير متاح */ }
  var FONTS = [['saad', 'الخط الأول'], ['majalla', 'الخط الثاني'], ['lotus', 'الخط الثالث']];
  if (!FONTS.some(function (f) { return f[0] === settings.font; })) settings.font = 'saad';   // خطوط الإصدار السابق (أميري، نسخ)
  function saveSettings() { try { localStorage.setItem('mahoozi.settings', JSON.stringify(settings)); } catch (e) { /* يُتجاهل */ } }
  function getLast() { try { return JSON.parse(localStorage.getItem('mahoozi.last') || 'null'); } catch (e) { return null; } }
  function setLast(o) { try { localStorage.setItem('mahoozi.last', JSON.stringify(o)); } catch (e) { /* يُتجاهل */ } }
  function applySettings() {
    var r = document.documentElement;
    r.dataset.theme = settings.theme;
    r.style.setProperty('--read-size', settings.size + 'px');
    r.dataset.font = settings.font;
  }
  applySettings();

  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 1900);
  }
  function copy(text, msg) {
    var done = function () { toast(msg || 'نُسخ النص'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('تعذّر النسخ'); }
      ta.remove();
    }
  }

  /* ───────── البيانات ───────── */
  var indexCache = {}, volCache = {};
  function getJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('تعذّر تحميل ' + url); return r.json(); });
  }
  function loadIndex(id) {
    return indexCache[id] || (indexCache[id] = getJSON('data/' + id + '/index.json').catch(function (e) { delete indexCache[id]; throw e; }));
  }
  function loadVol(id, v) {
    var k = id + '/' + v;
    return volCache[k] || (volCache[k] = getJSON('data/' + id + '/v' + v + '.json').catch(function (e) { delete volCache[k]; throw e; }));
  }
  function sectionOf(meta, blockIdx) {
    var s = meta.sections, lo = 0, hi = s.length - 1, ans = 0;
    while (lo <= hi) { var mid = (lo + hi) >> 1; if (s[mid].s <= blockIdx) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
    return ans;
  }
  function sectionEnd(meta, i, vol) { return i + 1 < meta.sections.length ? meta.sections[i + 1].s : vol.blocks.length; }
  function volOfHadith(idx, n) {
    for (var i = 0; i < idx.volumes.length; i++) { var h = idx.volumes[i].h; if (h && n >= h[0] && n <= h[1]) return idx.volumes[i]; }
    return null;
  }

  /* ───────── رسم النص: حواشٍ، أقواس القرآن والنصوص، تظليل البحث ───────── */
  function renderText(text, o) {
    o = o || {};
    var ranges = o.ranges || [], ri = 0, out = '', cls = '', inQ = false, n = 0;
    var open = function (c) { if (c !== cls) { if (cls) out += '</span>'; if (c) out += '<span class="' + c + '">'; cls = c; } };
    for (var i = 0; i < text.length; i++) {
      var ch = text[i], c = text.charCodeAt(i);
      if (c === 0xE000) {
        var e = text.indexOf('', i), id = text.slice(i + 1, e);
        i = e; n++;
        if (o.notes !== false) { open(''); out += '<sup class="fn" data-n="' + id + '" role="button" tabindex="0" aria-label="الحاشية ' + n + '">' + n + '</sup>'; }
        continue;
      }
      if (c === 0xE003) {                       // إحالة داخلية: h{رقم الحديث} أو s{جزء}.{قسم}
        var e2 = text.indexOf('\uE001', i), tg = text.slice(i + 1, e2);
        i = e2;
        if (o.links !== false) { open(''); out += '<a class="xref" href="' + (tg[0] === 'h' ? '#/h/' + tg.slice(1) : '#/read/' + BOOKS[0].id + '/' + tg.slice(1).replace('.', '/')) + '">'; }
        continue;
      }
      if (c === 0xE004) { if (o.links !== false) { open(''); out += '</a>'; } continue; }
      if (o.plain && AR.isMark(c) && c !== 0x0640) continue;
      while (ri < ranges.length && i >= ranges[ri][1]) ri++;
      var inM = ri < ranges.length && i >= ranges[ri][0];
      if (ch === '«') inQ = true;
      open((inM ? 'hl' : '') + (inM && inQ ? ' ' : '') + (inQ ? 'qt' : ''));
      out += ch === '<' ? '&lt;' : ch === '&' ? '&amp;' : ch;
      if (ch === '»') inQ = false;
    }
    open('');
    return out;
  }
  function renderNote(text, o) {
    o = o || {};
    return text.split('\n').map(function (line) {
      var html = renderText(line, { ranges: o.ranges && o.lineRanges ? o.lineRanges(line) : null, plain: o.plain });
      if (!o.book || o.book === 'wasail') html = html.replace(/(الحديث\s*:\s*)(\d{1,5})/g, function (m, a, num) { return a + '<a class="xref" href="#/h/' + num + '">' + num + '</a>'; });
      var sanad = /^\s*و?سنده\s/.test(stripTashkeel(line));
      return '<p' + (sanad ? ' class="sanad"' : '') + '>' + html + '</p>';
    }).join('');
  }

  /* ───────── التوجيه ───────── */
  var cleanup = null;
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, ''), qi = h.indexOf('?'), q = {};
    if (qi >= 0) { h.slice(qi + 1).split('&').forEach(function (kv) { var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' ')); }); h = h.slice(0, qi); }
    return { parts: h.split('/').filter(Boolean).map(decodeURIComponent), q: q };
  }
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    var r = parseHash(), p = r.parts;
    document.body.className = '';
    $$('.nav a').forEach(function (a) { a.classList.remove('on'); });
    var nav = function (k) { var a = $('.nav a[data-nav="' + k + '"]'); if (a) a.classList.add('on'); };
    if (!p.length) { nav('home'); viewHome(); }
    else if (p[0] === 'book' && bookOf(p[1])) { nav('book'); viewBook(bookOf(p[1])); }
    else if (p[0] === 'read' && bookOf(p[1])) { nav('book'); viewReader(bookOf(p[1]), +p[2] || 1, +p[3] || 0, p[4], r.q); }
    else if (p[0] === 'h' && bookOf(p[1])) { nav('book'); gotoHadith(bookOf(p[1]), +p[2]); }
    else if (p[0] === 'h') { nav('book'); gotoHadith(BOOKS[0], +p[1]); }
    else if (p[0] === 'books') { nav('book'); viewBooks(); }
    else if (p[0] === 'search') { nav('search'); viewSearch(r.q); }
    else if (p[0] === 'qa') { nav('qa'); viewQA(); }
    else if (p[0] === 'rawi' && p[2] && bookOf(p[1])) { nav('index'); viewRawi(bookOf(p[1]), p[2]); }
    else if (p[0] === 'rawi' && p[1]) { nav('index'); viewRawi(BOOKS[0], p[1]); }
    else if (p[0] === 'index') { nav('index'); viewIndex(p[1] === 'rawi' ? 'rawi' : 'sources', bookOf(p[2]) || BOOKS[0]); }
    else { viewHome(); }
  }
  function fail(e) {
    app.innerHTML = '<div class="wrap empty"><h2>تعذّر التحميل</h2><p>' + escH(e && e.message || e) + '</p><p><a class="btn" href="#/">العودة إلى الرئيسة</a></p></div>';
  }
  function gotoHadith(book, n) {
    app.innerHTML = '<div class="wrap loading"><div class="spinner"></div></div>';
    loadIndex(book.id).then(function (idx) {
      var meta = volOfHadith(idx, n);
      if (!meta) throw new Error('لا يوجد حديث بالرقم ' + n + ' في ' + book.title + '.');
      return loadVol(book.id, meta.v).then(function (vol) {
        var bi = -1;
        for (var i = 0; i < vol.blocks.length; i++) if (vol.blocks[i][0] === 'h' && vol.blocks[i][1] === n) { bi = i; break; }
        if (bi < 0) throw new Error('الحديث ' + n + ' غير مرقّم في الأصل.');
        location.replace('#/read/' + book.id + '/' + meta.v + '/' + sectionOf(meta, bi) + '/b' + bi);
      });
    }).catch(fail);
  }

  /* ───────── الرئيسة ───────── */
  function bookCard(b, c) {
    var tag = b.own ? 'تأليف' : 'تحقيق';
    var meta = c ? [tag, volsWord(c.vols), c.hadiths ? fmt(c.hadiths) + ' حديثاً' : ''].filter(Boolean).join(' · ') : tag;
    return '<a class="book-card" href="#/book/' + b.id + '">' +
      '<img class="cover" src="assets/covers/' + b.id + '.webp" alt="غلاف ' + b.title + '" width="640" height="954" loading="lazy" decoding="async">' +
      '<div class="book-info"><span class="tag">' + meta + '</span><h3>' + b.title + '</h3>' + (b.full !== b.title ? '<p class="book-full">' + b.full + '</p>' : '') +
      '<p class="book-by">' + (b.own ? 'تأليف سماحة الشيخ أحمد الماحوزي' : 'تأليف ' + b.author) + '</p><p>' + b.blurb + '</p><span class="btn">تصفّح الكتاب ' + ICON.arrow + '</span></div>' +
    '</a>';
  }
  function booksHTML(c) {
    var own = BOOKS.filter(function (b) { return b.own; }), tq = BOOKS.filter(function (b) { return !b.own; });
    return '<header class="block-head"><h2>التحقيقات</h2><p>' + tq.length + ' كتاباً من أمّهات كتب الحديث، محقَّقةً مصحَّحة الأسانيد.</p></header>' +
      '<div class="books">' + tq.map(function (b) { return bookCard(b, c && c[b.id]); }).join('') + '</div>' +
      '<header class="block-head" style="margin-top:2.6rem"><h2>المؤلفات</h2><p>من مؤلفات الشيخ وأماليه.</p></header>' +
      '<div class="books">' + own.map(function (b) { return bookCard(b, c && c[b.id]); }).join('') +
        UPCOMING.map(function (u) { return '<div class="book-card soon"><div class="spine ghost" aria-hidden="true"></div><div class="book-info"><span class="tag">قريباً</span><h3>' + u.title + '</h3><p>' + u.sub + '</p></div></div>'; }).join('') +
      '</div>';
  }
  function viewBooks() {
    window.scrollTo(0, 0);
    document.title = 'الكتب — مكتبة الشيخ أحمد الماحوزي';
    app.innerHTML = '<section class="search-head"><div class="hero-pattern" aria-hidden="true"></div><div class="wrap"><h1>كتب المكتبة</h1>' +
      '<p class="idx-lead">مؤلفات سماحة الشيخ أحمد الماحوزي وتحقيقاته، بنصٍّ يُقرأ ويُنسخ ويُبحث فيه، وحواشٍ مرتبطةٍ بمواضعها.</p></div></section>' +
      '<section class="wrap block" id="booksList">' + booksHTML(null) + '</section>' + footer();
    loadCatalog().then(function (c) { var el = $('#booksList'); if (el) el.innerHTML = booksHTML(c); }).catch(function () { /* الأعداد تكميلية */ });
  }
  function viewHome() {
    window.scrollTo(0, 0);
    document.title = 'مكتبة الشيخ أحمد الماحوزي — المؤلفات والتحقيقات';
    var last = getLast();
    app.innerHTML =
      '<section class="hero">' +
        '<div class="hero-pattern" aria-hidden="true"></div>' +
        '<div class="wrap hero-grid">' +
          '<div class="hero-text">' +
            '<p class="eyebrow">المكتبة الرقمية لمؤلفات وتحقيقات</p>' +
            '<h1 class="hero-name"><span class="name-mark" role="img" aria-label="سماحة الشيخ أحمد الماحوزي"></span></h1>' +
            '<p class="hero-lead">نصوصٌ محقَّقة تُقرأ وتُنسخ ويُبحث فيها، وحواشي التحقيق والتخريج مرتبطةٌ بمواضعها من المتن كلمةً بكلمة.</p>' +
            '<form class="hero-search" id="heroSearch" role="search">' + ICON.search +
              '<input type="search" placeholder="ابحث عن حديث، راوٍ، باب، أو رقم حديث…" aria-label="بحث في المكتبة" autocomplete="off">' +
              '<select id="heroBook" aria-label="الكتاب">' + BOOKS.map(function (b) { return '<option value="' + b.id + '">' + b.title + '</option>'; }).join('') + '</select>' +
              '<button type="submit">بحث</button></form>' +
            '<p class="hero-hint">يتجاوز البحثُ التشكيلَ والهمزات وصور الألف والياء والتاء المربوطة. جرّب: <a href="#/search?q=انما%20الاعمال%20بالنيات">إنما الأعمال بالنيات</a> · <a href="#/search?q=طلب%20العلم%20فريضة">طلب العلم فريضة</a></p>' +
          '</div>' +
          '<figure class="hero-portrait"><div class="arch"><img src="assets/sheikh.jpg" alt="سماحة الشيخ أحمد الماحوزي يطالع كتاباً" width="1200" height="1200"></div></figure>' +
        '</div>' +
        '<div class="wrap stats" id="stats"></div>' +
      '</section>' +
      '<section class="wrap block" id="booksList">' + booksHTML(null) + '</section>' +
      '<section class="wrap block">' +
        '<header class="block-head"><h2>ما الذي يميّز هذه النسخة؟</h2></header>' +
        '<div class="features">' +
          '<article><span class="f-ic">' + ICON.notes + '</span><h3>الحاشية بجوار المتن</h3><p>اضغط رقم الحاشية فتظهر في لوحة جانبية مع تمييز موضعها، أو اعرضها أسفل كل حديث، أو أخفِها للقراءة الصافية.</p></article>' +
          '<article><span class="f-ic grade s">ص</span><h3>الحكم على الأسانيد</h3><p>يظهر حكم السند كما قرّره المحقق في حاشيته — صحيح، كالصحيح، حسن… — على رأس كل حديث، ويمكن التصفية به في البحث.</p></article>' +
          '<article><span class="f-ic">' + ICON.search + '</span><h3>بحثٌ يفهم العربية</h3><p>بالتشكيل أو بدونه، مع توحيد الهمزات والألف المقصورة والتاء المربوطة، في المتن أو الحواشي أو كليهما.</p></article>' +
          '<article><span class="f-ic">' + ICON.copy + '</span><h3>نسخٌ وإحالة</h3><p>انسخ الحديث مع عزوه ورقمه، أو مع حواشيه، أو شارك رابطاً مباشراً يفتح على الحديث نفسه.</p></article>' +
        '</div>' +
      '</section>' +
      '<section class="wrap block"><a class="qa-teaser" href="#/qa"><span class="qa-badge">قريباً</span><div><h3>سجل الأسئلة والأجوبة</h3><p>أسئلة القرّاء وأجوبة سماحة الشيخ عليها، في سجلٍّ يُبحث فيه ويُحال إليه.</p></div>' + ICON.arrow + '</a></section>' +
      footer();
    $('#heroSearch').addEventListener('submit', function (e) {
      e.preventDefault(); var q = $('input', this).value.trim(), bk = $('#heroBook').value;
      if (q) location.hash = '#/search?q=' + encodeURIComponent(q) + (bk !== 'wasail' ? '&book=' + bk : '');
    });
    loadCatalog().then(function (c) {
      var el = $('#booksList'); if (el) el.innerHTML = booksHTML(c);
      var st = $('#stats'); if (!st) return;
      var sum = function (k) { return Object.keys(c).reduce(function (a, id) { return a + (c[id][k] || 0); }, 0); };
      st.innerHTML = [[Object.keys(c).length, 'كتاباً'], [sum('vols'), 'جزءاً'], [fmt(sum('hadiths')), 'حديثاً'], [fmt(sum('notes')), 'حاشية تحقيق']]
        .map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') +
        (last ? '<a class="resume" href="' + escH(last.hash) + '"><span>تابع القراءة</span><b>' + escH(last.label) + '</b></a>' : '');
    }).catch(function () { /* الإحصاءات تكميلية */ });
  }
  /* ───────── سجل الأسئلة والأجوبة (قريباً) ─────────
     لاحقاً: أسئلة الزوار تُرسل من هنا، والشيخ يجيب من حسابٍ خاصٍّ به، وتُنشر الأجوبة في هذا السجل. */
  function viewQA() {
    window.scrollTo(0, 0);
    document.title = 'سجل الأسئلة والأجوبة — مكتبة الشيخ أحمد الماحوزي';
    app.innerHTML =
      '<section class="search-head"><div class="hero-pattern" aria-hidden="true"></div><div class="wrap">' +
        '<h1>سجل الأسئلة والأجوبة</h1>' +
        '<p class="idx-lead">أسئلة القرّاء في الحديث والرجال والفقه، وأجوبة سماحة الشيخ أحمد الماحوزي عليها، مجموعةً في سجلٍّ واحدٍ يُبحث فيه ويُحال إليه.</p>' +
      '</div></section>' +
      '<section class="wrap block qa">' +
        '<div class="qa-soon"><span class="qa-badge">قريباً</span>' +
          '<h2>يُفتح السجل قريباً بإذن الله</h2>' +
          '<p>نعمل على تهيئة طريقةٍ يرسل بها الزوّار أسئلتهم من هذه الصفحة، فتصل إلى سماحة الشيخ عبر حسابٍ خاصٍّ به في الموقع، ثم تُنشر الأجوبة هنا مرتّبةً ومصنّفة.</p>' +
          '<ol class="qa-steps">' +
            '<li><b>السؤال</b><span>يكتب الزائر سؤاله ويحدّد بابه: حديث، رجال، فقه، أو غير ذلك.</span></li>' +
            '<li><b>الجواب</b><span>يطّلع الشيخ على الأسئلة في حسابه الخاص ويجيب عنها.</span></li>' +
            '<li><b>النشر</b><span>يظهر السؤال وجوابه في السجل، مع تاريخه وروابط الأحاديث المذكورة فيه.</span></li>' +
          '</ol>' +
        '</div>' +
        '<div class="qa-preview" aria-hidden="true">' +
          '<article class="qa-item"><header><span class="qa-tag">رجال</span><span class="qa-date">—</span></header><p class="qa-q">سيظهر نصّ السؤال هنا…</p><p class="qa-a">وهنا جواب سماحة الشيخ.</p></article>' +
          '<article class="qa-item"><header><span class="qa-tag">حديث</span><span class="qa-date">—</span></header><p class="qa-q">سيظهر نصّ السؤال هنا…</p><p class="qa-a">وهنا جواب سماحة الشيخ.</p></article>' +
        '</div>' +
      '</section>' + footer();
  }
  function footer() {
    return '<footer class="foot"><div class="wrap"><span class="name-mark sm" aria-hidden="true"></span><p>المكتبة الرقمية لمؤلفات وتحقيقات سماحة الشيخ أحمد الماحوزي</p></div></footer>';
  }

  /* ───────── صفحة الكتاب ───────── */
  function groupSections(meta) {
    // كتاب ← أبواب ← أقسام
    var groups = [];
    meta.sections.forEach(function (s, i) {
      var key = (s.k || '') + '|' + (s.a || '');
      var g = groups[groups.length - 1];
      if (!g || g.key !== key) { g = { key: key, k: s.k, a: s.a, items: [] }; groups.push(g); }
      g.items.push({ s: s, i: i });
    });
    return groups;
  }
  function viewBook(b) {
    window.scrollTo(0, 0);
    app.innerHTML = '<div class="wrap loading"><div class="spinner"></div></div>';
    document.title = b.title + ' — مكتبة الشيخ أحمد الماحوزي';
    loadIndex(b.id).then(function (idx) {
      var uq = idx.unique !== false, qb = b.id === 'wasail' ? '' : '&book=' + b.id;
      var totalG = GRADE_ORDER.reduce(function (a, k) { return a + (idx.grades[k] || 0); }, 0);
      var bar = GRADE_ORDER.filter(function (k) { return idx.grades[k]; }).map(function (k) {
        var n = idx.grades[k], pct = n / totalG * 100;
        return '<a class="gseg g-' + k + '" style="flex:' + n + '" href="#/search?grade=' + k + qb + '" title="' + GRADES[k] + ': ' + fmt(n) + '"><span>' + (pct > 6 ? GRADES[k] : '') + '</span></a>';
      }).join('');
      var legend = GRADE_ORDER.filter(function (k) { return idx.grades[k]; }).map(function (k) {
        return '<a href="#/search?grade=' + k + qb + '" class="gleg"><i class="g-' + k + '"></i>' + GRADES[k] + ' <b>' + fmt(idx.grades[k]) + '</b></a>';
      }).join('');
      var vols = idx.volumes.map(function (m) {
        var kits = []; m.sections.forEach(function (s) { if (s.k && kits.indexOf(s.k) < 0) kits.push(s.k); });
        return '<a class="vol-card" href="#/read/' + b.id + '/' + m.v + '/0"><span class="vol-n">' + m.v + '</span><h3>' + m.name + '</h3>' +
          '<p class="vol-k">' + escH(kits.join(' · ') || 'المقدمات') + '</p>' +
          '<p class="vol-m">' + (m.h ? 'الأحاديث ' + fmt(m.h[0]) + ' – ' + fmt(m.h[1]) : m.sections.length + ' عنواناً') + '</p></a>';
      }).join('');
      app.innerHTML =
        '<section class="book-hero"><div class="hero-pattern" aria-hidden="true"></div><div class="wrap book-hero-grid">' +
          '<img class="hero-cover" src="assets/covers/' + b.id + '.webp" alt="غلاف ' + b.title + '" width="640" height="954">' +
          '<div class="book-hero-text">' +
          '<nav class="crumbs"><a href="#/">الرئيسة</a><span>المؤلفات والتحقيقات</span></nav>' +
          '<h1>' + b.full + '</h1>' +
          '<p class="by">' + (b.own ? '' : 'تأليف ' + b.author) + '</p>' +
          '<p class="by gold">' + credit(b) + '</p>' +
          (b.extra ? '<p class="by">' + b.extra + '</p>' : '') +
          (b.publisher ? '<p class="pub">' + b.publisher + '</p>' : '') +
          '<div class="book-actions"><a class="btn solid" href="#/read/' + b.id + '/1/0">ابدأ القراءة</a>' +
            (uq && idx.hadiths ? '<form class="goto" id="gotoForm"><input type="number" min="1" placeholder="رقم الحديث" aria-label="رقم الحديث"><button class="btn" type="submit">انتقل</button></form>' : '') +
            '<a class="btn" style="background:transparent;color:var(--gold-soft);border-color:rgba(217,197,156,.4)" href="#/search?book=' + b.id + '">ابحث في الكتاب</a>' +
            '<a class="btn" style="background:transparent;color:var(--gold-soft);border-color:rgba(217,197,156,.4)" href="#/index/rawi/' + b.id + '">فهرس الرواة</a></div>' +
        '</div></div></section>' +
        (totalG ? '<section class="wrap block">' +
          '<header class="block-head"><h2>أحكام الأسانيد في التحقيق</h2><p>توزيع ' + fmt(totalG) + ' حديثاً نصّ المحقق على حكم سندها في الحاشية. اضغط على صنفٍ لتصفّح أحاديثه.</p></header>' +
          '<div class="gbar">' + bar + '</div><div class="glegend">' + legend + '</div>' +
          (b.note ? '<p class="callout"><b>ملاحظة المحقق:</b> ' + b.note + '</p>' : '') +
        '</section>' : '') +
        '<section class="wrap block"><header class="block-head"><h2>' + (idx.volumes.length > 1 ? 'الأجزاء' : 'الكتاب') + '</h2><p>' + [volsWord(idx.volumes.length), idx.hadiths ? fmt(idx.hadiths) + ' حديثاً' : '', fmt(idx.babs) + ' عنواناً', fmt(idx.notes) + ' حاشية'].filter(Boolean).join(' · ') + '</p></header><div class="vols">' + vols + '</div></section>' +
        '<section class="wrap block"><header class="block-head"><h2>فهرس الكتب والأبواب</h2>' +
          '<div class="filter">' + ICON.search + '<input id="tocFilter" type="search" placeholder="صفِّ عناوين الأبواب…" aria-label="تصفية الفهرس" autocomplete="off"></div></header>' +
          '<div class="toc-tree" id="tocTree"></div></section>' + footer();
      if ($('#gotoForm')) $('#gotoForm').addEventListener('submit', function (e) { e.preventDefault(); var n = +$('input', this).value; if (n) location.hash = hadithHref(b, true, 0, 0, 0, n); });

      var tree = $('#tocTree');
      function draw(filter) {
        var f = filter ? AR.norm(filter) : '', html = '', shown = 0;
        idx.volumes.forEach(function (m) {
          groupSections(m).forEach(function (g) {
            var items = g.items.filter(function (it) { return !f || AR.norm(it.s.t).indexOf(f) >= 0; });
            if (!items.length) return;
            shown += items.length;
            html += '<details' + (f ? ' open' : '') + '><summary><span class="t-vol">' + (idx.volumes.length > 1 ? 'ج' + m.v : '') + '</span><span class="t-title">' + escH([g.k, g.a].filter(Boolean).join(' — ') || (b.id === 'wasail' ? items[0].s.t : m.name)) + '</span><span class="t-count">' + items.length + '</span></summary><ol>' +
              items.map(function (it) {
                var s = it.s;
                return '<li><a href="#/read/' + b.id + '/' + m.v + '/' + it.i + '">' + (s.n ? '<span class="t-n"' + (s.w ? ' title="' + s.w + '"' : '') + '>' + s.n + '</span>' : '') + '<span>' + escH(s.t) + '</span>' +
                  (s.h ? '<em>' + (s.h[1] - s.h[0] + 1) + ' ح</em>' : '') + '</a></li>';
              }).join('') + '</ol></details>';
          });
        });
        tree.innerHTML = html || '<p class="empty">لا عناوين تطابق «' + escH(filter) + '».</p>';
      }
      draw('');
      var ft;
      $('#tocFilter').addEventListener('input', function () { var v = this.value.trim(); clearTimeout(ft); ft = setTimeout(function () { draw(v); }, 160); });
    }).catch(fail);
  }

  /* ───────── القارئ ───────── */
  function viewReader(b, v, secIdx, target, q) {
    document.body.className = 'reading';
    app.innerHTML = '<div class="wrap loading"><div class="spinner"></div><p>جارٍ تحميل الجزء…</p></div>';
    var alive = true, onScroll, io;
    cleanup = function () { alive = false; if (onScroll) window.removeEventListener('scroll', onScroll); if (io) io.disconnect(); document.removeEventListener('keydown', onKey); };
    function onKey(e) { if (e.key === 'Escape') { document.body.classList.remove('toc-open', 'notes-open', 'set-open'); } }
    document.addEventListener('keydown', onKey);

    Promise.all([loadIndex(b.id), loadVol(b.id, v)]).then(function (res) {
      if (!alive) return;
      var idx = res[0], vol = res[1], meta = idx.volumes[v - 1], uq = idx.unique !== false;
      if (!meta) throw new Error('الجزء ' + v + ' غير موجود.');
      secIdx = Math.max(0, Math.min(secIdx, meta.sections.length - 1));
      var targetBlock = target && /^b\d+$/.test(target) ? +target.slice(1) : -1;
      var comp = q.q ? AR.compile(q.q, { mode: q.mode, whole: q.whole === '1' }) : null;
      var hlNote = q.n !== undefined ? +q.n : -1;
      var first = secIdx, lastSec = secIdx, active = -1, pinned = 0;

      app.innerHTML =
        '<div class="reader">' +
          '<aside class="toc" id="toc"><div class="toc-head"><select id="volSel" aria-label="الجزء">' +
            idx.volumes.map(function (m) { return '<option value="' + m.v + '"' + (m.v === v ? ' selected' : '') + '>' + m.name + '</option>'; }).join('') +
            '</select><button class="icon-btn only-m" data-close>' + ICON.close + '</button></div>' +
            '<div class="filter sm">' + ICON.search + '<input id="tocF" type="search" placeholder="صفِّ الأبواب…" autocomplete="off"></div>' +
            '<nav class="toc-list" id="tocList"></nav></aside>' +
          '<div class="page">' +
            '<div class="toolbar"><button class="tool" id="tocBtn" title="الفهرس">' + ICON.list + '<span>الفهرس</span></button>' +
              '<div class="where" id="where"></div>' +
              (uq && idx.hadiths ? '<form class="goto mini" id="goto2"><input type="number" min="1" placeholder="حديث رقم…" aria-label="الانتقال إلى حديث"></form>' : '') +
              '<button class="tool only-m" id="notesBtn" title="الحواشي">' + ICON.notes + '</button>' +
              '<button class="tool" id="setBtn" title="إعدادات القراءة">' + ICON.gear + '<span>العرض</span></button>' +
              '<div class="settings" id="settings"></div></div>' +
            '<div class="prev-wrap" id="prevWrap"></div>' +
            '<div class="text" id="text"></div>' +
            '<div class="sentinel" id="sentinel"></div>' +
          '</div>' +
          '<aside class="notes" id="notes"><div class="notes-head"><h2>الحواشي والتخريج</h2><span id="notesRef"></span><button class="icon-btn only-m" data-close>' + ICON.close + '</button></div><div class="notes-body" id="notesBody"><p class="hint">اضغط رقم حاشيةٍ في المتن، أو مرّ على الأحاديث، لتظهر حواشيها هنا.</p></div></aside>' +
          '<div class="scrim" id="scrim"></div>' +
        '</div>';
      var text = $('#text'), notesBody = $('#notesBody');

      /* —— إعدادات العرض —— */
      function drawSettings() {
        var seg = function (key, opts) {
          return '<div class="seg">' + opts.map(function (o) { return '<button data-set="' + key + '" data-val="' + o[0] + '"' + (String(settings[key]) === String(o[0]) ? ' class="on"' : '') + '>' + o[1] + '</button>'; }).join('') + '</div>';
        };
        $('#settings').innerHTML =
          '<label>الحواشي</label>' + seg('notes', [['side', 'جانبية'], ['inline', 'تحت النص'], ['off', 'مخفية']]) +
          '<label>التشكيل</label>' + seg('tashkeel', [[true, 'ظاهر'], [false, 'مخفي']]) +
          '<label>حجم الخط</label><div class="seg"><button data-size="-1" aria-label="تصغير">أ−</button><span class="size-v">' + settings.size + '</span><button data-size="1" aria-label="تكبير">أ+</button></div>' +
          '<label>الخط</label>' + seg('font', FONTS) +
          '<label>السمة</label>' + seg('theme', [['light', 'فاتحة'], ['sepia', 'ورقية'], ['dark', 'داكنة']]);
      }
      drawSettings();
      $('#settings').addEventListener('click', function (e) {
        var t = e.target.closest('button'); if (!t) return;
        if (t.dataset.size) settings.size = Math.max(16, Math.min(34, settings.size + (+t.dataset.size) * 1));
        else { var val = t.dataset.val; settings[t.dataset.set] = val === 'true' ? true : val === 'false' ? false : val; }
        saveSettings(); applySettings(); drawSettings();
        if (t.dataset.set === 'tashkeel' || t.dataset.set === 'notes') rerender();
      });
      $('#setBtn').addEventListener('click', function (e) { e.stopPropagation(); document.body.classList.toggle('set-open'); });
      $('#tocBtn').addEventListener('click', function () { document.body.classList.toggle('toc-open'); });
      $('#notesBtn').addEventListener('click', function () { document.body.classList.toggle('notes-open'); });
      $('#scrim').addEventListener('click', function () { document.body.classList.remove('toc-open', 'notes-open', 'set-open'); });
      $$('[data-close]').forEach(function (x) { x.addEventListener('click', function () { document.body.classList.remove('toc-open', 'notes-open'); }); });
      document.addEventListener('click', function closeSet(e) {
        if (!alive) return document.removeEventListener('click', closeSet);
        if (!e.target.closest('#settings')) document.body.classList.remove('set-open');
      });
      $('#volSel').addEventListener('change', function () { location.hash = '#/read/' + b.id + '/' + this.value + '/0'; });
      if ($('#goto2')) $('#goto2').addEventListener('submit', function (e) { e.preventDefault(); var n = +$('input', this).value; if (n) location.hash = hadithHref(b, true, 0, 0, 0, n); });

      /* —— فهرس الجزء —— */
      function drawToc(f) {
        var nf = f ? AR.norm(f) : '';
        $('#tocList').innerHTML = groupSections(meta).map(function (g) {
          var items = g.items.filter(function (it) { return !nf || AR.norm(it.s.t).indexOf(nf) >= 0; });
          if (!items.length) return '';
          var head = [g.k, g.a].filter(Boolean).join(' — ');
          return (head ? '<h4>' + escH(head) + '</h4>' : '') + items.map(function (it) {
            return '<a href="#/read/' + b.id + '/' + v + '/' + it.i + '" data-sec="' + it.i + '">' + (it.s.n ? '<span class="t-n"' + (it.s.w ? ' title="' + it.s.w + '"' : '') + '>' + it.s.n + '</span>' : '') + '<span>' + escH(it.s.t) + '</span></a>';
          }).join('');
        }).join('') || '<p class="hint">لا نتائج.</p>';
        markToc(false);
      }
      var curSec = -1;
      function markToc(scroll) {
        $$('#tocList a.on').forEach(function (a) { a.classList.remove('on'); });
        var a = $('#tocList a[data-sec="' + curSec + '"]');
        if (a) { a.classList.add('on'); if (scroll) { var l = $('#tocList'); l.scrollTop = a.offsetTop - l.clientHeight / 2; } }
      }
      $('#tocF').addEventListener('input', function () { drawToc(this.value.trim()); });
      $('#tocList').addEventListener('click', function () { document.body.classList.remove('toc-open'); });

      /* —— رسم الأقسام —— */
      function blockHTML(i, forPrint) {
        var blk = vol.blocks[i], t = blk[0], txt = blockText(blk);
        var o = { plain: !settings.tashkeel, notes: forPrint || settings.notes !== 'off', links: !forPrint };
        if (comp && i === targetBlock && hlNote < 0) o.ranges = AR.ranges(comp, txt);
        var body = renderText(txt, o);
        var ids = [], m, re = /(\d+)/g; while ((m = re.exec(txt))) ids.push(+m[1]);
        var inl = '';
        if ((forPrint || settings.notes === 'inline') && ids.length) {
          inl = '<ol class="inl-notes">' + ids.map(function (id, k) { return '<li data-n="' + id + '"><span class="note-n">' + (k + 1) + '</span><div>' + noteHTML(id) + '</div></li>'; }).join('') + '</ol>';
        }
        var attr = ' id="b' + i + '" data-b="' + i + '"' + (ids.length ? ' data-has="1"' : '');
        if (t === 'h') {
          var g = blk[5] ? '<a class="grade g-' + blk[5] + '" href="#/search?grade=' + blk[5] + (b.id === 'wasail' ? '' : '&book=' + b.id) + '" title="حكم السند في حاشية المحقق">' + escH(blk[4]) + '</a>' : '';
          return '<article class="hadith"' + attr + '><header><span class="hnum" title="الرقم العام">' + blk[1] + '</span>' + (blk[2] ? '<span class="hloc">' + blk[2] + '</span>' : '') + g +
            '<span class="acts"><button data-act="copy" title="نسخ الحديث مع العزو">' + ICON.copy + '</button><button data-act="copyn" title="نسخ مع الحواشي">' + ICON.notes + '</button><button data-act="link" title="نسخ رابط الحديث">' + ICON.link + '</button><button data-act="img" title="تحميل الحديث مع تعليقه صورةً PNG">' + ICON.image + '</button><button data-act="share" title="مشاركة الحديث صورةً إلى التطبيقات">' + ICON.share + '</button><button data-act="rijal" title="رجال السند">' + ICON.people + '</button></span></header>' +
            '<p class="txt">' + body + '</p>' + inl + '</article>';
        }
        if (t === 'b') return '<header class="bab"' + attr + '>' + (blk[1] ? '<span class="bab-n">' + (blk[3] || 'الباب') + ' ' + blk[1] + '</span>' : '') + (body ? '<h3 class="txt">' + body + '</h3>' : '') + '<button class="bab-pdf" data-act="pdfbab" title="طباعة القسم كاملاً أو حفظه PDF">' + ICON.print + '<span>PDF ' + (blk[3] === 'المجلس' ? 'المجلس' : blk[3] === 'الفصل' ? 'الفصل' : 'الباب') + '</span></button></header>' + inl;
        if (t === 'k') return '<h2 class="kitab txt"' + attr + '>' + body + '</h2>' + inl;
        if (t === 'a') return '<h2 class="abwab txt"' + attr + '>' + body + '</h2>' + inl;
        if (t === 's') return '<h2 class="sect txt"' + attr + '>' + body + '</h2>' + inl;
        if (t === 't') return '<h4 class="sub txt"' + attr + '>' + body + '</h4>';
        if (t === 'm') return '<p class="basmala"' + attr + '>' + body + '</p>';
        var follow = /^(?:و?رواه|أقول|و?قال|و?عنه|و?بإسناده|و?بالإسناد)/.test(stripTashkeel(txt)) ? ' follow' : '';
        return '<div class="para' + follow + '"' + attr + '><p class="txt">' + body + '</p>' + inl + '</div>';
      }
      function noteHTML(id) {
        var nt = vol.notes[id], o = { plain: !settings.tashkeel };
        if (comp && id === hlNote) { o.ranges = true; o.lineRanges = function (line) { return AR.ranges(comp, line); }; }
        o.book = b.id;
        return renderNote(nt, o);
      }
      function sectionHTML(i) {
        var s = meta.sections[i], e = sectionEnd(meta, i, vol), html = '';
        for (var k = s.s; k < e; k++) html += blockHTML(k);
        var info = [];
        if (s.h) info.push((s.h[1] - s.h[0] + 1) + ' حديثاً');
        if (s.p) info.push('ص ' + s.p + ' من المطبوع');
        return '<section class="sec" data-i="' + i + '">' + html + (info.length && s.n ? '<p class="sec-meta">' + info.join(' · ') + '</p>' : '') + '</section>';
      }
      function drawPrev() {
        var pw = $('#prevWrap');
        if (first > 0) pw.innerHTML = '<button class="btn ghost" id="prevBtn">↑ ' + escH(meta.sections[first - 1].t.slice(0, 70)) + '</button>';
        else if (v > 1) pw.innerHTML = '<a class="btn ghost" href="#/read/' + b.id + '/' + (v - 1) + '/' + (idx.volumes[v - 2].sections.length - 1) + '">↑ ' + idx.volumes[v - 2].name + '</a>';
        else pw.innerHTML = '';
        var pb = $('#prevBtn');
        if (pb) pb.addEventListener('click', function () {
          var h0 = document.documentElement.scrollHeight;
          first--; text.insertAdjacentHTML('afterbegin', sectionHTML(first));
          window.scrollBy(0, document.documentElement.scrollHeight - h0);   // يبقى موضع القراءة ثابتاً
          drawPrev();
        });
      }
      function appendNext() {
        if (lastSec + 1 >= meta.sections.length) return false;
        lastSec++; text.insertAdjacentHTML('beforeend', sectionHTML(lastSec)); return true;
      }
      function drawEnd() {
        $('#sentinel').innerHTML = lastSec + 1 >= meta.sections.length
          ? '<div class="vol-end"><p>تمّ ' + meta.name + '</p>' + (v < idx.volumes.length ? '<a class="btn solid" href="#/read/' + b.id + '/' + (v + 1) + '/0">' + idx.volumes[v].name + ' ←</a>' : '<a class="btn" href="#/book/' + b.id + '">فهرس الكتاب</a>') + '</div>' : '';
      }
      function rerender() {
        var keep = active >= 0 ? active : meta.sections[curSec >= 0 ? curSec : first].s;
        var html = ''; for (var i = first; i <= lastSec; i++) html += sectionHTML(i);
        text.innerHTML = html;
        document.body.dataset.notes = settings.notes;
        var el = $('#b' + keep); if (el) el.scrollIntoView({ block: 'start' });
        showNotes(active, -1);
      }

      /* —— لوحة الحواشي —— */
      function blockRef(i) {
        var blk = vol.blocks[i];
        if (blk[0] === 'h') return 'الحديث ' + blk[1];
        if (blk[0] === 'b') return 'عنوان ' + (blk[3] || 'الباب') + (blk[1] ? ' ' + blk[1] : '');
        for (var k = i - 1; k >= 0 && k > i - 12; k--) if (vol.blocks[k][0] === 'h') return 'عقب الحديث ' + vol.blocks[k][1];
        return '';
      }
      function showNotes(i, focusId) {
        $$('.is-active', text).forEach(function (x) { x.classList.remove('is-active'); });
        active = i;
        if (i < 0) return;
        var el = $('#b' + i); if (!el) return;
        el.classList.add('is-active');
        var ids = $$('sup.fn', el).filter(function (s) { return s.closest('[data-b]') === el; }).map(function (s) { return +s.dataset.n; });
        $('#notesRef').textContent = blockRef(i);
        if (!ids.length) { notesBody.innerHTML = '<p class="hint">لا حواشي على هذا الموضع.</p>'; return; }
        notesBody.innerHTML = ids.map(function (id, k) {
          return '<div class="note' + (id === focusId ? ' focus' : '') + '" data-n="' + id + '"><span class="note-n">' + (k + 1) + '</span><div class="note-t">' + noteHTML(id) + '</div><button class="note-copy" title="نسخ الحاشية">' + ICON.copy + '</button></div>';
        }).join('');
        var f = $('.note.focus', notesBody);
        if (f) f.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); else notesBody.scrollTop = 0;
      }
      function focusMarker(id) {
        $$('sup.fn.on', text).forEach(function (s) { s.classList.remove('on'); });
        var s = $('sup.fn[data-n="' + id + '"]', text); if (s) s.classList.add('on');
        return s;
      }
      notesBody.addEventListener('click', function (e) {
        var cp = e.target.closest('.note-copy'), nt = e.target.closest('.note');
        if (!nt) return;
        if (cp) { copy(stripLinks(vol.notes[+nt.dataset.n]), 'نُسخت الحاشية'); return; }
        if (e.target.closest('a')) return;
        $$('.note.focus', notesBody).forEach(function (x) { x.classList.remove('focus'); });
        nt.classList.add('focus');
        var s = focusMarker(+nt.dataset.n);
        if (s) { pinned = Date.now(); s.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      });

      /* —— تفاعل المتن —— */
      function citation(blk) { return '— ' + b.title + '، ' + (b.own ? 'تأليف' : 'تحقيق') + ' الشيخ أحمد الماحوزي' + (idx.volumes.length > 1 ? '، ' + meta.name : '') + (blk[0] === 'h' ? '، الحديث ' + blk[1] : ''); }
      function plainOf(i, withNotes) {
        var blk = vol.blocks[i], txt = blockText(blk), ids = [], k = 0;
        var body = withNotes ? txt.replace(/(\d+)/g, function (m, id) { ids.push(+id); return '(' + (++k) + ')'; }) : stripMarks(txt);
        var out = body + '\n' + citation(blk);
        if (withNotes && ids.length) out += '\n\nالحواشي:\n' + ids.map(function (id, j) { return '(' + (j + 1) + ') ' + stripLinks(vol.notes[id]); }).join('\n');
        return out;
      }
      /* —— رجال السند: أسماء رواة الحديث روابطَ إلى صفحاتهم —— */
      function showRijal(i, el) {
        var old = $('.rijal', el); if (old) { old.remove(); return; }
        loadRawi(b.id).then(function (R) {
          var names = (R.byHadith[v + ':' + i] || []).slice(), txt = AR.norm(blockText(vol.blocks[i]));
          names.sort(function (x, y) { return txt.indexOf(AR.norm(x.n)) - txt.indexOf(AR.norm(y.n)); });
          var html = names.length ? names.map(function (x) { return '<a href="' + rawiHref(b, x.n) + '">' + escH(x.n) + (x.kc ? '<i title="للمحقق تعليق عليه"></i>' : '') + '</a>'; }).join('<span>←</span>')
            : '<em>لم يُستخرج لهذا الحديث سندٌ مفهرس.</em>';
          $('header', el).insertAdjacentHTML('afterend', '<div class="rijal"><b>رجال السند</b>' + html + '</div>');
        }).catch(function () { toast('تعذّر تحميل فهرس الرواة'); });
      }

      /* —— التصدير: PDF عبر الطباعة، وصورة للمشاركة —— */
      function printBlocks(arr, label) {
        var area = $('#printArea');
        if (!area) { area = document.createElement('div'); area.id = 'printArea'; document.body.appendChild(area); }
        var s = meta.sections[sectionOf(meta, arr[0])];
        area.innerHTML = '<header class="p-head"><div><b>' + b.full + '</b><span>' + credit(b) + '</span></div></header>' +
          '<p class="p-path">' + [idx.volumes.length > 1 ? meta.name : '', s.k, s.a, s.n ? (s.w || 'الباب') + ' ' + s.n : ''].filter(Boolean).join(' · ') + '</p>' +
          '<div class="text">' + arr.map(function (k) { return blockHTML(k, true); }).join('') + '</div>' +
          '<footer class="p-foot">' + location.origin + location.pathname + '</footer>';
        var old = document.title; document.title = b.title + ' — ' + meta.name + ' — ' + label;
        var done = function () { document.title = old; area.innerHTML = ''; window.removeEventListener('afterprint', done); };
        window.addEventListener('afterprint', done);
        setTimeout(function () { window.print(); }, 60);
      }
      function shareImage(i, share) {
        /* بطاقات ستوري 9:16 (1080×1920) بألوان الموقع وخط القراءة: النص مضبوط الطرفين بأرقام حواشيه
           ثم التعليق. الحديث الطويل يتوزّع على عدة بطاقات مرقّمة يُكتب في كلٍّ منها «يتبع». */
        var blk = vol.blocks[i], s = meta.sections[sectionOf(meta, i)];
        var W = 1080, H = 1920, M = 54, PAD = 46, X1 = W - M - PAD, X0 = M + PAD, TW = X1 - X0;
        var TOP = 440, BOTTOM = 1610, FS = 38, LH = 78, NS = 27, NLH = 54;      // البطاقة داخل المنطقة الآمنة للستوري
        var fam = (getComputedStyle(document.documentElement).getPropertyValue('--read-font') || 'serif').trim();
        var raw = blockText(blk), noteIds = [], m, re = /(\d+)/g;
        while ((m = re.exec(raw))) noteIds.push(+m[1]);
        var clean = function (t) { return settings.tashkeel ? t : stripTashkeel(t); };
        var C = { bg: '#f6f1e6', card: '#fffdf8', ink: '#1c2a27', ink2: '#44524d', green: '#0f4a42', deep: '#0a322d', gold: '#a8834a', goldSoft: '#d9c59c', quote: '#0d5b4c', line: '#e2d9c5' };
        var GC = { s: '#1d7a55', k: '#24808f', h: '#4a68b5', q: '#a7751f', m: '#6d7a2a', r: '#8a7460', d: '#b4473a', o: '#7a857f' };
        toast('جارٍ تجهيز الصور…');
        // الترويسة خلفيةٌ خضراء بنقشها وحده، بلا مخطوطة الاسم (طلب المستخدم ١٠ أكتوبر ٢٠٢٦)
        Promise.all([document.fonts.load('700 ' + FS + 'px ' + fam, 'بسم'), document.fonts.load(FS + 'px ' + fam, 'بسم')]).then(function () {
          var mc = document.createElement('canvas').getContext('2d');
          var font = function (size, bold) { return (bold ? '700 ' : '') + size + 'px ' + fam; };
          function words(text, size, bold, numbered) {
            var out = [], inQ = false, n = 0;
            mc.font = font(size, bold);
            text.split(/\s+/).forEach(function (tok) {
              if (!tok) return;
              var marks = [];
              var w = tok.replace(/\d+/g, function () { marks.push(++n); return ''; });
              if (!numbered) marks = [];
              w = clean(w);
              if (/^ـ+$/.test(w)) w = '–';              // الشرطة المكتوبة تطويلاً
              if (w.indexOf('«') >= 0) inQ = true;
              var mw = 0;
              if (marks.length) { mc.font = font(Math.round(size * 0.5), true); mw = marks.reduce(function (a, k) { return a + mc.measureText(String(k)).width + size * 0.34; }, 0) + size * 0.08; mc.font = font(size, bold); }
              if (w || marks.length) out.push({ t: w, w: w ? mc.measureText(w).width : 0, marks: marks, mw: mw, q: inQ });
              if (w.indexOf('»') >= 0) inQ = false;
            });
            return out;
          }
          function wrap(ws, width, size) {
            var sp = size * 0.3, lines = [], cur = [], cw = 0;
            ws.forEach(function (x) {
              var add = x.w + x.mw + (cur.length ? sp : 0);
              if (cur.length && cw + add > width) { lines.push({ ws: cur, w: cw }); cur = []; cw = 0; add = x.w + x.mw; }
              cur.push(x); cw += add;
            });
            if (cur.length) lines.push({ ws: cur, w: cw, last: true });
            return lines;
          }
          function drawLine(ctx, ln, xr, y, width, size, bold, color) {
            var sp = size * 0.3, gap = sp, x = xr;
            if (!ln.last && ln.ws.length > 1) gap = sp + Math.min((width - ln.w) / (ln.ws.length - 1), size * 0.9);   // ضبط الطرفين
            ln.ws.forEach(function (wd) {
              ctx.font = font(size, bold); ctx.textAlign = 'right'; ctx.direction = 'rtl';
              ctx.fillStyle = wd.q ? C.quote : color;
              if (wd.t) ctx.fillText(wd.t, x, y);
              x -= wd.w;
              if (wd.marks.length) {
                var ms = Math.round(size * 0.5); x -= size * 0.08;
                wd.marks.forEach(function (num) {
                  ctx.font = font(ms, true); ctx.direction = 'ltr'; ctx.textAlign = 'center';
                  var bw = ctx.measureText(String(num)).width + size * 0.26, bx = x - bw - size * 0.04, by = y - size * 0.86;
                  ctx.fillStyle = 'rgba(168,131,74,.16)'; roundRect(ctx, bx, by, bw, ms * 1.3, ms * 0.35); ctx.fill();
                  ctx.fillStyle = C.gold; ctx.fillText(String(num), bx + bw / 2, by + ms * 1.02);
                  x -= bw + size * 0.08;
                });
              }
              x -= gap;
            });
          }
          // —— صفوف المحتوى: كل صفّ يعرف ارتفاعه وكيف يرسم نفسه ——
          var rows = [];
          wrap(words(raw, FS, false, true), TW, FS).forEach(function (ln) {
            rows.push({ h: LH, draw: function (ctx, y) { drawLine(ctx, ln, X1, y + FS * 1.28, TW, FS, false, C.ink); } });
          });
          if (noteIds.length) {
            rows.push({ h: 96, keep: true, draw: function (ctx, y) {
              ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X0, y + 30); ctx.lineTo(X1, y + 30); ctx.stroke();
              ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(W / 2, y + 30, 5, 0, Math.PI * 2); ctx.fill();
              ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.font = font(25, true); ctx.fillStyle = C.gold; ctx.fillText('الحواشي والتخريج', X1, y + 76);
            } });
            noteIds.forEach(function (id, k) {
              var first = true, IND = NS * 2.1;
              stripLinks(vol.notes[id]).split('\n').forEach(function (para) {
                var sanad = /^\s*و?سنده\s/.test(stripTashkeel(para));
                wrap(words(para, NS, sanad, false), TW - IND, NS).forEach(function (ln) {
                  var badge = first; first = false;
                  rows.push({ h: NLH, draw: function (ctx, y) {
                    if (badge) {
                      var bs = NS * 1.2;
                      ctx.fillStyle = C.gold; roundRect(ctx, X1 - bs, y + NLH * 0.56 - bs * 0.6, bs, bs, bs * 0.3); ctx.fill();
                      ctx.fillStyle = '#fff'; ctx.font = font(Math.round(NS * 0.7), true); ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.fillText(String(k + 1), X1 - bs / 2, y + NLH * 0.56 + bs * 0.2);
                    }
                    drawLine(ctx, ln, X1 - IND, y + NLH * 0.74, TW - IND, NS, sanad, sanad ? C.green : C.ink2);
                  } });
                });
              });
              rows.push({ h: 14, gap: true, draw: function () {} });
            });
          }
          // —— التقسيم على بطاقات ——
          var HEADROW = 92, CONT = 70, CAP = BOTTOM - TOP - HEADROW - 40;       // ما يتّسع له متن البطاقة
          // توزيع متوازن: أقل عدد من البطاقات، ثم أصغر حدٍّ يحققه فلا تبقى للأخيرة أسطرٌ يتيمة
          function paginate(limit) {
            var out = [], cur = [], used = 0;
            rows.forEach(function (r, k) {
              var need = r.h + (r.keep && rows[k + 1] ? rows[k + 1].h : 0);
              if (cur.length && used + need > limit) { out.push(cur); cur = []; used = 0; if (r.gap) return; }
              cur.push(r); used += r.h;
            });
            if (cur.length) out.push(cur);
            return out;
          }
          var totalH = rows.reduce(function (x, r) { return x + r.h; }, 0);
          var pages = totalH <= CAP ? [rows] : paginate(CAP - CONT);
          if (pages.length > 1) {
            for (var lim = totalH / pages.length; lim < CAP - CONT; lim += NLH / 2) {
              var tryP = paginate(lim);
              if (tryP.length === pages.length) { pages = tryP; break; }
            }
          }
          var total = pages.length;
          var blobs = [];
          function render(pi) {
            var cv = document.createElement('canvas'), ctx = cv.getContext('2d'); cv.width = W; cv.height = H;
            var content = pages[pi].reduce(function (a, r) { return a + r.h; }, 0), more = pi < total - 1;
            var cardH = HEADROW + content + 40 + (more ? CONT : 0);
            var top = Math.max(TOP, Math.round((TOP + BOTTOM - cardH) / 2));          // البطاقة تتوسّط المنطقة الآمنة
            // الخلفية والترويسة
            ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
            var g = ctx.createLinearGradient(0, 0, 0, top + 120); g.addColorStop(0, C.deep); g.addColorStop(1, C.green);
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, top + 120);
            ctx.save(); ctx.strokeStyle = 'rgba(217,197,156,.13)'; ctx.lineWidth = 2.2;
            for (var py = 14; py < top + 110; py += 88) for (var px = 10; px < W; px += 88) {
              ctx.save(); ctx.translate(px, py); ctx.beginPath(); ctx.moveTo(22, 8); ctx.bezierCurveTo(31, 11, 35, 17, 34, 26); ctx.bezierCurveTo(25, 28, 18, 24, 16, 16); ctx.bezierCurveTo(16, 12, 18, 9, 22, 8); ctx.stroke(); ctx.restore();
            }
            ctx.restore();
            ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(244,236,217,.88)'; ctx.font = font(28);
            ctx.fillText([b.title, idx.volumes.length > 1 ? meta.name : '', s.a, s.n ? (s.w || 'الباب') + ' ' + s.n : ''].filter(Boolean).join('  ·  '), W / 2, top - 46, W - M * 2);
            // البطاقة
            ctx.save(); ctx.shadowColor = 'rgba(40,30,10,.18)'; ctx.shadowBlur = 44; ctx.shadowOffsetY = 14;
            ctx.fillStyle = C.card; roundRect(ctx, M, top, W - M * 2, cardH, 36); ctx.fill(); ctx.restore();
            ctx.strokeStyle = C.goldSoft; ctx.lineWidth = 1.5; roundRect(ctx, M, top, W - M * 2, cardH, 36); ctx.stroke();
            // صفّ الرأس: رقم الحديث، الحكم أو «تتمة»، وترقيم البطاقات
            var bx = X1, my = top + 30;
            if (blk[0] === 'h') {
              ctx.font = font(27, true); ctx.direction = 'ltr';
              var t1 = String(blk[1]), w1 = ctx.measureText(t1).width + 44;
              ctx.fillStyle = C.green; roundRect(ctx, bx - w1, my, w1, 48, 12); ctx.fill();
              ctx.fillStyle = '#f4ecd9'; ctx.textAlign = 'center'; ctx.fillText(t1, bx - w1 / 2, my + 34);
              bx -= w1 + 16;
            }
            ctx.direction = 'rtl';
            if (pi > 0) { ctx.font = font(25, true); ctx.fillStyle = C.gold; ctx.textAlign = 'right'; ctx.fillText('تتمة', bx, my + 33); }
            else if (blk[4]) {
              ctx.font = font(24, true); var w2 = ctx.measureText(blk[4]).width + 40;
              ctx.fillStyle = GC[blk[5]] || GC.o; roundRect(ctx, bx - w2, my + 3, w2, 42, 21); ctx.fill();
              ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(blk[4], bx - w2 / 2, my + 32);
            }
            if (total > 1) {
              ctx.font = font(24, true); ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.fillStyle = '#7a857f';
              ctx.fillText((pi + 1) + ' / ' + total, X0, my + 33);
            }
            var y = top + HEADROW;
            pages[pi].forEach(function (r) { r.draw(ctx, y); y += r.h; });
            if (more) {
              ctx.direction = 'rtl'; ctx.font = font(26, true); ctx.textAlign = 'left'; ctx.fillStyle = C.gold;
              ctx.fillText('يتبع  ‹', X0, top + cardH - 34);
              ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(X0 + 110, top + cardH - 42); ctx.lineTo(X1, top + cardH - 42); ctx.stroke(); ctx.setLineDash([]);
            }
            // التذييل: اسم الكتاب والمحقق (بلا رابط)
            var fy = Math.min(top + cardH + 62, 1690);
            ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = C.green; ctx.font = font(26, true);
            ctx.fillText(b.full, W / 2, fy, W - M * 2);
            ctx.fillStyle = C.gold; ctx.font = font(23);
            ctx.fillText(credit(b), W / 2, fy + 40);
            return new Promise(function (res) { cv.toBlob(function (bl) { blobs[pi] = bl; res(); }, 'image/png'); });
          }
          var chain = Promise.resolve();
          pages.forEach(function (_, pi) { chain = chain.then(function () { return render(pi); }); });
          return chain.then(function () {
            var base = b.id + '-' + (blk[0] === 'h' && uq ? blk[1] : 'v' + v + '-' + i);
            var files = blobs.map(function (bl, k) { return new File([bl], base + (total > 1 ? '-' + (k + 1) : '') + '.png', { type: 'image/png' }); });
            var download = function (msg) {
              files.forEach(function (f, k) {
                setTimeout(function () {
                  var a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
                  setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
                }, k * 350);
              });
              toast(msg || (total > 1 ? 'حُمّلت ' + total + ' صور PNG' : 'حُمّلت الصورة PNG'));
            };
            if (!share) return download();
            // المشاركة المباشرة إلى التطبيقات (واتساب، إنستغرام، تلغرام…) عبر قائمة النظام
            if (navigator.canShare && navigator.canShare({ files: files })) {
              return navigator.share({ files: files }).catch(function (e) {
                if (e && e.name === 'AbortError') return;          // أغلق المستخدم القائمة
                download('تعذّرت المشاركة، فحُمّلت الصور');
              });
            }
            download('المشاركة غير مدعومة في هذا المتصفح، فحُمّلت الصور');
          });
        }).catch(function () { toast('تعذّر تجهيز الصورة'); });
      }
      function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

      text.addEventListener('click', function (e) {
        var sup = e.target.closest('sup.fn'), act = e.target.closest('[data-act]'), blkEl = e.target.closest('[data-b]');
        if (act && blkEl) {
          var i = +blkEl.dataset.b;
          if (act.dataset.act === 'copy') copy(plainOf(i, false), 'نُسخ الحديث مع العزو');
          else if (act.dataset.act === 'copyn') copy(plainOf(i, true), 'نُسخ الحديث مع حواشيه');
          else if (act.dataset.act === 'img') shareImage(i);
          else if (act.dataset.act === 'share') shareImage(i, true);
          else if (act.dataset.act === 'rijal') showRijal(i, blkEl);
          else if (act.dataset.act === 'pdfbab') { var si = sectionOf(meta, i), se = sectionEnd(meta, si, vol), arr = []; for (var x = meta.sections[si].s; x < se; x++) arr.push(x); printBlocks(arr, (vol.blocks[i][3] || 'الباب') + ' ' + (vol.blocks[i][1] || meta.sections[si].t.slice(0, 40))); }
          else copy(location.origin + location.pathname + hadithHref(b, uq, v, sectionOf(meta, i), i, vol.blocks[i][1]), 'نُسخ رابط الحديث');
          return;
        }
        if (sup) {
          var id = +sup.dataset.n, owner = sup.closest('[data-b]');
          pinned = Date.now();
          if (settings.notes === 'inline') {
            var li = $('.inl-notes li[data-n="' + id + '"]', text);
            if (li) { $$('.inl-notes li.focus', text).forEach(function (x) { x.classList.remove('focus'); }); li.classList.add('focus'); li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
          } else {
            showNotes(+owner.dataset.b, id);
            document.body.classList.add('notes-open');
          }
          focusMarker(id);
          return;
        }
        if (blkEl && blkEl.dataset.has && settings.notes === 'side' && !String(window.getSelection())) { pinned = Date.now(); showNotes(+blkEl.dataset.b, -1); }
      });
      text.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('sup.fn')) { e.preventDefault(); e.target.click(); } });

      /* —— التمرير: القسم الحالي، الحاشية المرافقة، التحميل المتتابع —— */
      function setWhere(i) {
        if (i === curSec) return;
        curSec = i;
        var s = meta.sections[i];
        $('#where').innerHTML = '<a href="#/book/' + b.id + '">' + b.title + '</a>' + (idx.volumes.length > 1 ? '<span>' + meta.name + '</span>' : '') + (s.a ? '<span class="w-opt">' + escH(s.a) + '</span>' : '') + '<b>' + (s.n ? (s.w || 'باب') + ' ' + s.n : escH(s.t.slice(0, 40))) + '</b>';
        var hash = '#/read/' + b.id + '/' + v + '/' + i;
        if (location.hash.split('?')[0].replace(/\/b\d+$/, '') !== hash) history.replaceState(null, '', hash);
        setLast({ hash: hash, label: b.title + (idx.volumes.length > 1 ? '، ' + meta.name : '') + ' — ' + (s.n ? (s.w || 'باب') + ' ' + s.n + ': ' : '') + s.t.slice(0, 60) });
        markToc(true);
        document.title = s.t.slice(0, 60) + ' — ' + b.title + (idx.volumes.length > 1 ? ' ' + meta.name : '');
      }
      var ticking = false;
      onScroll = function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          var top = 130, secs = $$('.sec', text), cur = first;
          for (var i = 0; i < secs.length; i++) { if (secs[i].getBoundingClientRect().top <= top + 40) cur = +secs[i].dataset.i; else break; }
          setWhere(cur);
          if (settings.notes === 'side' && Date.now() - pinned > 1500 && window.innerWidth > 1100) {
            var sec = $('.sec[data-i="' + cur + '"]', text), els = sec ? $$('[data-has]', sec) : [], pick = -1;
            for (var k = 0; k < els.length; k++) { var r = els[k].getBoundingClientRect(); if (r.bottom > top + 30) { if (r.top < window.innerHeight * 0.6) pick = +els[k].dataset.b; break; } }
            if (pick >= 0 && pick !== active) showNotes(pick, -1);
          }
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { var n = 0; while (n < 3 && appendNext()) n++; drawEnd(); }
      }, { rootMargin: '1200px' });

      /* —— البدء —— */
      document.body.dataset.notes = settings.notes;
      text.innerHTML = sectionHTML(secIdx);
      drawPrev(); drawToc(''); drawEnd(); setWhere(secIdx);
      io.observe($('#sentinel'));
      if (targetBlock >= 0 && $('#b' + targetBlock)) {
        var el = $('#b' + targetBlock);
        el.classList.add('flash');
        requestAnimationFrame(function () {
          el.scrollIntoView({ block: 'center' });
          pinned = Date.now() + 1500;
          showNotes(targetBlock, hlNote);
          if (hlNote >= 0) { focusMarker(hlNote); if (window.innerWidth <= 1100) document.body.classList.add('notes-open'); }
        });
      } else { window.scrollTo(0, 0); onScroll(); }
    }).catch(function (e) { if (alive) fail(e); });
  }

  /* ───────── البحث ───────── */
  var worker = null, searchSeq = 0;
  function viewSearch(q) {
    window.scrollTo(0, 0);
    var b = bookOf(q.book) || BOOKS[0], alive = true, state = { hits: [], shown: 0, done: false, id: 0 };
    cleanup = function () { alive = false; searchSeq++; };
    var opts = { scope: q.scope || 'all', mode: q.mode || 'all', whole: q.whole === '1', vol: +q.vol || 0, grade: q.grade || '', src: q.src || '', rawi: q.rawi || '' };
    var query = q.q || '';
    app.innerHTML =
      '<section class="search-head"><div class="hero-pattern" aria-hidden="true"></div><div class="wrap">' +
        '<h1>البحث في ' + b.title + '</h1>' +
        '<div class="s-opts"><div class="og"><span>الكتاب</span><select id="sBook" aria-label="الكتاب">' + BOOKS.map(function (x) { return '<option value="' + x.id + '"' + (x === b ? ' selected' : '') + '>' + x.title + '</option>'; }).join('') + '</select></div></div>' +
        '<form class="hero-search" id="sForm" role="search">' + ICON.search + '<input id="sInput" type="search" value="' + escH(query) + '" placeholder="كلمات، عبارة بين «علامتي تنصيص»، أو رقم حديث" autocomplete="off" aria-label="نص البحث"><button type="submit">بحث</button></form>' +
        '<div class="s-opts" id="sOpts"></div></div></section>' +
      '<section class="wrap results"><div class="s-status" id="sStatus"></div><div id="sList"></div><div class="more" id="sMore"></div></section>';
    var input = $('#sInput');

    $('#sBook').addEventListener('change', function () {
      var p = ['q=' + encodeURIComponent(input.value.trim())]; if (this.value !== 'wasail') p.push('book=' + this.value);
      location.hash = '#/search?' + p.join('&');
    });
    loadIndex(b.id).then(function (idx) {
      if (!alive) return;
      var uq = idx.unique !== false;
      var chip = function (key, val, label) { return '<button type="button" data-k="' + key + '" data-v="' + val + '"' + (String(opts[key]) === String(val) ? ' class="on"' : '') + '>' + label + '</button>'; };
      function drawOpts() {
        $('#sOpts').innerHTML =
          '<div class="og"><span>أين؟</span>' + chip('scope', 'all', 'المتن والحواشي') + chip('scope', 'matn', 'المتن') + chip('scope', 'notes', 'الحواشي') + '</div>' +
          '<div class="og"><span>كيف؟</span>' + chip('mode', 'all', 'كل الكلمات') + chip('mode', 'phrase', 'العبارة نصّاً') + chip('mode', 'any', 'أي كلمة') + '<button type="button" data-k="whole" data-v="' + !opts.whole + '"' + (opts.whole ? ' class="on"' : '') + '>كلمة كاملة</button>' + '</div>' +
          '<div class="og"><span>تصفية</span>' + (idx.volumes.length > 1 ? '<select data-k="vol" aria-label="الجزء"><option value="0">كل الأجزاء</option>' + idx.volumes.map(function (m) { return '<option value="' + m.v + '"' + (opts.vol === m.v ? ' selected' : '') + '>' + m.name + '</option>'; }).join('') + '</select>' : '') +
          (GRADE_ORDER.some(function (k) { return idx.grades[k]; }) ? '<select data-k="grade" aria-label="حكم السند"><option value="">كل الأسانيد</option>' + GRADE_ORDER.filter(function (k) { return idx.grades[k]; }).map(function (k) { return '<option value="' + k + '"' + (opts.grade === k ? ' selected' : '') + '>سنده ' + GRADES[k] + '</option>'; }).join('') + '</select>' : '') + '</div>';
      }
      function push() {
        var p = ['q=' + encodeURIComponent(input.value.trim())];
        if (b.id !== 'wasail') p.push('book=' + b.id);
        if (opts.scope !== 'all') p.push('scope=' + opts.scope);
        if (opts.mode !== 'all') p.push('mode=' + opts.mode);
        if (opts.whole) p.push('whole=1');
        if (opts.vol) p.push('vol=' + opts.vol);
        if (opts.grade) p.push('grade=' + opts.grade);
        if (opts.src) p.push('src=' + encodeURIComponent(opts.src));
        if (opts.rawi) p.push('rawi=' + encodeURIComponent(opts.rawi));
        var h = '#/search?' + p.join('&');
        if (location.hash === h) run(); else { history.replaceState(null, '', h); run(); }
      }
      drawOpts();
      $('#sOpts').addEventListener('click', function (e) {
        var t = e.target.closest('button'); if (!t) return;
        opts[t.dataset.k] = t.dataset.v === 'true' ? true : t.dataset.v === 'false' ? false : t.dataset.v;
        drawOpts(); push();
      });
      $('#sOpts').addEventListener('change', function (e) {
        var t = e.target; if (!t.dataset.k) return;
        opts[t.dataset.k] = t.dataset.k === 'vol' ? +t.value : t.value; push();
      });
      $('#sForm').addEventListener('submit', function (e) { e.preventDefault(); push(); });
      var typeT;
      input.addEventListener('input', function () { clearTimeout(typeT); typeT = setTimeout(push, 350); });

      function status(html) { $('#sStatus').innerHTML = html; }
      function run() {
        query = input.value.trim();
        state = { hits: [], shown: 0, done: false, id: ++searchSeq };
        $('#sList').innerHTML = ''; $('#sMore').innerHTML = '';
        var numOnly = /^[\d٠-٩\s]+$/.test(query) && query, n = numOnly ? +AR.norm(query).replace(/ /g, '') : 0;
        var jump = n && uq && volOfHadith(idx, n) ? '<a class="jump" href="' + hadithHref(b, true, 0, 0, 0, n) + '">انتقل مباشرةً إلى الحديث رقم <b>' + n + '</b> ' + ICON.arrow + '</a>' : '';
        var browse = opts.src || opts.rawi;
        if (browse) {
          // تصفّح فهرس: مصدر أو راوٍ — المواضع جاهزة في ملف الفهرس
          var kind = opts.src ? 'sources' : 'rawi', my0 = state;
          var chip = '<p class="count"><a class="chip-x" href="' + (opts.src ? '#/index/sources/' + b.id : rawiHref(b, browse)) + '">' + (opts.src ? 'المصدر' : 'الراوي') + ': <b>' + escH(browse) + '</b> ✕</a></p>';
          status(chip + '<div class="bar"><i style="width:30%"></i></div>');
          var hl = opts.rawi ? AR.compile('"' + opts.rawi + '"', {}) : (query ? AR.compile(query, opts) : null);
          getJSON('data/' + b.id + '/' + kind + '.json').then(function (list) {
            if (!alive || my0 !== state) return;
            var it = list.filter(function (x) { return x.n === browse; })[0];
            if (it) for (var k = 0; k < it.h.length; k += 2) if (!opts.vol || opts.vol === it.h[k]) my0.hits.push([it.h[k], it.h[k + 1], -1, 1]);
            my0.done = true; finish(my0, hl, chip);
          }).catch(fail);
          return;
        }
        if (!query && !opts.grade) {
          status('<div class="tips"><h3>كيف أبحث؟</h3><ul><li>اكتب الكلمات بأي صورة: <b>الصلوة</b>، <b>الصَّلاة</b>، <b>الصلاه</b> — كلّها سواء.</li><li>ضع العبارة بين علامتي تنصيص للمطابقة النصية: <b>«لا ضرر ولا ضرار»</b>.</li><li>اكتب رقماً للانتقال إلى الحديث مباشرة.</li><li>ابحث في الحواشي عن راوٍ أو مصدر: <b>الكافي الشريف</b>، <b>رجاله ثقات</b>.</li></ul></div>');
          return;
        }
        if (!worker) worker = new Worker('js/search-worker.js?v=2');
        var my = state;
        var compiled = query ? AR.compile(query, opts) : null;
        if (!compiled) {
          // تصفّح بحكم السند وحده: لا حاجة للعامل
          status(jump + '<div class="bar"><i style="width:8%"></i></div><p>جارٍ جمع الأحاديث…</p>');
          var list = opts.vol ? [opts.vol] : idx.volumes.map(function (m) { return m.v; }), k = 0;
          (function step() {
            if (!alive || my !== state) return;
            if (k >= list.length) { my.done = true; finish(my, null, jump); return; }
            var v = list[k++];
            loadVol(b.id, v).then(function (vol) {
              vol.blocks.forEach(function (blk, i) { if (blk[0] === 'h' && blk[5] === opts.grade) my.hits.push([v, i, -1, 1]); });
              status(jump + '<div class="bar"><i style="width:' + (k / list.length * 100) + '%"></i></div><p>' + fmt(my.hits.length) + ' حديثاً حتى الآن…</p>');
              if (my.shown === 0 && my.hits.length) more(my, null);
              step();
            }).catch(function () { step(); });
          })();
          return;
        }
        status(jump + '<div class="bar"><i style="width:3%"></i></div><p>جارٍ تحميل نصوص الأجزاء للبحث (مرةً واحدة)…</p>');
        worker.onmessage = function (e) {
          var m = e.data;
          if (!alive || m.id !== my.id) return;
          if (m.type === 'hits') {
            m.hits.forEach(function (h) { my.hits.push([m.v, h[0], h[1], h[2]]); });
            status(jump + '<div class="bar"><i style="width:' + (m.done / m.total * 100) + '%"></i></div><p>' + fmt(my.hits.length) + ' نتيجة · فُحص ' + m.done + ' من ' + m.total + ' جزءاً</p>');
            if (my.shown === 0 && my.hits.length >= 20) more(my, compiled);
          } else if (m.type === 'done') { my.done = true; finish(my, compiled, jump); }
        };
        worker.postMessage({ type: 'search', id: my.id, q: query, opts: opts, book: b.id, volumes: idx.volumes.map(function (m) { return m.v; }) });
      }
      function finish(my, compiled, jump) {
        // العبارة المتصلة أولاً، ثم بترتيب الكتاب
        my.hits.sort(function (a, c) { return c[3] - a[3] || a[0] - c[0] || a[1] - c[1] || a[2] - c[2]; });
        var nb = my.hits.filter(function (h) { return h[2] < 0; }).length, nn = my.hits.length - nb;
        status(jump + (my.hits.length
          ? '<p class="count"><b>' + fmt(my.hits.length) + '</b> نتيجة' + (compiled ? ' — ' + fmt(nb) + ' في المتن و' + fmt(nn) + ' في الحواشي' : '') + '</p>'
          : '<div class="tips"><h3>لا نتائج' + (query ? ' لـ«' + escH(query) + '»' : '') + '</h3><ul><li>جرّب كلماتٍ أقل، أو وضع «أي كلمة».</li><li>ألغِ خيار «كلمة كاملة» أو تصفية الجزء والسند.</li></ul></div>'));
        $('#sList').innerHTML = ''; my.shown = 0;
        if (my.hits.length) more(my, compiled);
      }
      function more(my, compiled) {
        var slice = my.hits.slice(my.shown, my.shown + 30);
        my.shown += slice.length;
        Promise.all(slice.map(function (h) { return loadVol(b.id, h[0]); })).then(function (vols) {
          if (!alive || my !== state) return;
          $('#sList').insertAdjacentHTML('beforeend', slice.map(function (h, k) { return resultHTML(h, vols[k], idx.volumes[h[0] - 1], compiled); }).join(''));
          $('#sMore').innerHTML = my.done && my.shown < my.hits.length ? '<button class="btn" id="moreBtn">المزيد (' + fmt(my.hits.length - my.shown) + ')</button>' : '';
          var mb = $('#moreBtn'); if (mb) mb.addEventListener('click', function () { more(my, compiled); });
        }).catch(fail);
      }
      function excerpt(text, ranges, max) {
        if (text.length <= max || !ranges || !ranges.length) return { t: text.length > max ? text.slice(0, cutAt(text, max)) + ' …' : text, r: ranges, pre: '' };
        var a = Math.max(0, ranges[0][0] - Math.floor(max / 3));
        if (a > 0) { var sp = text.indexOf(' ', a); a = sp > 0 && sp < ranges[0][0] ? sp + 1 : a; }
        if (a < 40) a = 0;
        // لا يُقطع داخل علامة حاشية
        var e = Math.min(text.length, a + max); e = cutAt(text, e);
        var t = text.slice(a, e);
        return { t: t + (e < text.length ? ' …' : ''), r: ranges.map(function (r) { return [r[0] - a, r[1] - a]; }).filter(function (r) { return r[1] > 0 && r[0] < t.length; }), pre: a ? '… ' : '' };
      }
      function cutAt(text, e) {
        if (e >= text.length) return text.length;
        var o = text.lastIndexOf('', e), c = text.lastIndexOf('', e);
        if (o > c) return o;
        var sp = text.lastIndexOf(' ', e); return sp > e - 30 ? sp : e;
      }
      function resultHTML(h, vol, meta, compiled) {
        var bi = h[1], ni = h[2], blk = vol.blocks[bi] || ['p', ''], sec = meta.sections[sectionOf(meta, bi)];
        var href = '#/read/' + b.id + '/' + meta.v + '/' + sectionOf(meta, bi) + '/b' + bi + (compiled ? '?q=' + encodeURIComponent(query) + (opts.mode !== 'all' ? '&mode=' + opts.mode : '') + (opts.whole ? '&whole=1' : '') + (ni >= 0 ? '&n=' + ni : '') : '');
        var hnum = blk[0] === 'h' ? blk[1] : 0;
        if (!hnum) for (var k = bi - 1; k >= 0 && k > bi - 12; k--) if (vol.blocks[k][0] === 'h') { hnum = vol.blocks[k][1]; break; }
        var kind = ni >= 0 ? 'حاشية' : { h: 'حديث', b: 'عنوان باب', k: 'عنوان', a: 'عنوان', s: 'عنوان', t: 'عنوان' }[blk[0]] || 'متن';
        var body;
        if (ni >= 0) {
          var nt = stripLinks(vol.notes[ni]), ex = excerpt(nt.replace(/\n/g, ' '), AR.ranges(compiled, nt.replace(/\n/g, ' ')), 420);
          var ctx = stripMarks(blockText(blk)); ctx = ctx.length > 150 ? ctx.slice(0, 150) + '…' : ctx;
          body = '<p class="r-ctx">' + escH(ctx) + '</p><p class="r-txt note">' + ex.pre + renderText(ex.t, { ranges: ex.r, notes: false }) + '</p>';
        } else {
          var txt = blockText(blk), ex2 = excerpt(txt, compiled ? AR.ranges(compiled, txt) : null, 560);
          body = '<p class="r-txt">' + ex2.pre + renderText(ex2.t, { ranges: ex2.r, notes: false }) + '</p>';
        }
        var g = blk[0] === 'h' && blk[5] && ni < 0 ? '<span class="grade g-' + blk[5] + '">' + escH(blk[4]) + '</span>' : '';
        return '<a class="result' + (ni >= 0 ? ' in-note' : '') + '" href="' + href + '"><header><span class="r-kind">' + kind + '</span>' + (hnum ? '<span class="hnum">' + hnum + '</span>' : '') + g +
          '<span class="r-path">' + (idx.volumes.length > 1 ? meta.name : b.title) + (sec.k ? ' · ' + escH(sec.k) : '') + (sec.a ? ' · ' + escH(sec.a) : '') + (sec.n ? ' · ' + (sec.w || 'باب') + ' ' + sec.n : '') + '</span></header>' + body + '</a>';
      }
      run();
      if (!query) input.focus();
    }).catch(fail);
  }

  /* ───────── الرواة ───────── */
  var rawiCache = {};
  function loadRawi(id) {
    return rawiCache[id] || (rawiCache[id] = getJSON('data/' + id + '/rawi.json').then(function (list) {
      var byName = {}, byHadith = {};
      list.forEach(function (x) {
        byName[x.n] = x;
        for (var k = 0; k < x.h.length; k += 2) { var key = x.h[k] + ':' + x.h[k + 1]; (byHadith[key] || (byHadith[key] = [])).push(x); }
      });
      return { list: list, byName: byName, byHadith: byHadith };
    }).catch(function (e) { delete rawiCache[id]; throw e; }));
  }
  function noteOwners(vol) {
    if (vol._owner) return vol._owner;
    var o = {}, re = /\uE000(\d+)\uE001/g;
    vol.blocks.forEach(function (blk, i) { var t = blockText(blk), m; re.lastIndex = 0; while ((m = re.exec(t))) o[+m[1]] = i; });
    return (vol._owner = o);
  }
  function viewRawi(b, name) {
    window.scrollTo(0, 0);
    var alive = true;
    cleanup = function () { alive = false; };
    app.innerHTML = '<div class="wrap loading"><div class="spinner"></div></div>';
    Promise.all([loadRawi(b.id), loadIndex(b.id)]).then(function (res) {
      if (!alive) return;
      var R = res[0], idx = res[1], x = R.byName[name];
      if (!x) throw new Error('لا يوجد راوٍ بهذا الاسم في الفهرس: ' + name);
      var rel = (x.rel || []).map(function (n) { return R.byName[n]; }).filter(Boolean);
      var hl = AR.compile('"' + name + '"', {});
      document.title = name + ' — فهرس الرواة';
      app.innerHTML =
        '<section class="search-head"><div class="hero-pattern" aria-hidden="true"></div><div class="wrap">' +
          '<nav class="crumbs"><a href="#/index/rawi/' + b.id + '">فهرس الرواة</a><span>' + b.title + '</span></nav>' +
          '<h1 class="rawi-name">' + escH(name) + '</h1>' +
          '<div class="book-actions"><a class="btn solid" href="#/search?rawi=' + encodeURIComponent(name) + (b.id === 'wasail' ? '' : '&book=' + b.id) + '">أحاديثه في الأسانيد (' + fmt(x.c) + ') ' + ICON.arrow + '</a>' +
          '<a class="btn" style="background:transparent;color:var(--gold-soft);border-color:rgba(217,197,156,.4)" href="#/search?q=' + encodeURIComponent('"' + name + '"') + '&scope=notes' + (b.id === 'wasail' ? '' : '&book=' + b.id) + '">كل ذكرٍ له في الحواشي</a></div>' +
        '</div></section>' +
        (rel.length ? '<section class="wrap block rawi-rel"><header class="block-head"><h2>صيغ قريبة من الاسم</h2><p>قد تكون للراوي نفسه وقد يشترك فيها غيره، فلم تُدمج. اضغط صيغةً لفتح صفحتها.</p></header><div class="rel-chips">' +
          rel.map(function (y) { return '<a href="' + rawiHref(b, y.n) + '">' + escH(y.n) + '<b>' + fmt(y.c) + '</b></a>'; }).join('') + '</div></section>' : '') +
        '<section class="wrap block rawi-notes"><header class="block-head"><h2>تعليقات المحقق عليه</h2><p>' + (x.kc ? fmt(x.kc) + ' موضعاً في الحواشي تكلّم فيها المحقق عن حاله، مرتّبةً من الأوفى. يظهر من كل تعليقٍ الموضعُ الذي ذُكر فيه، ويُفتح كاملاً بالضغط عليه.' : '') + '</p></header><ol class="rk-list" id="rkList"></ol><div class="more" id="rkMore"></div></section>' + footer();
      var refs = x.k || [], shown = 0;
      if (!refs.length) { $('#rkList').outerHTML = '<p class="hint">لم أجد في الحواشي تعليقاً رجالياً بهذه الصيغة من الاسم. جرّب الصيغ القريبة أو «كل ذكرٍ له في الحواشي».</p>'; return; }
      /* مقتطف التعليق: الجملة التي ذُكر فيها الراوي وما يجاورها، مقطوعةً عند الفواصل لا وسط الكلام */
      function excerpt(p, rs) {
        if (!rs.length || p.length <= 420) return { t: p, r: rs, cut: false };
        var a = Math.max(0, rs[0][0] - 170), e = Math.min(p.length, rs[0][1] + 250);
        if (a > 0) { var s1 = Math.max(p.lastIndexOf('، ', rs[0][0]), p.lastIndexOf('. ', rs[0][0])); a = s1 >= a - 60 && s1 > 0 ? s1 + 2 : (p.indexOf(' ', a) + 1 || a); }
        if (e < p.length) { var e1 = p.indexOf('، ', e - 40); var e2 = p.indexOf('. ', e - 40); var ee = [e1, e2].filter(function (z) { return z > 0 && z < e + 80; }); e = ee.length ? Math.min.apply(null, ee) + 1 : (p.lastIndexOf(' ', e) > rs[0][1] ? p.lastIndexOf(' ', e) : e); }
        var t = p.slice(a, e);
        return { t: (a > 0 ? '… ' : '') + t + (e < p.length ? ' …' : ''), r: rs.map(function (q) { return [q[0] - a + (a > 0 ? 2 : 0), q[1] - a + (a > 0 ? 2 : 0)]; }).filter(function (q) { return q[0] >= 0 && q[1] <= t.length + 2; }), cut: true };
      }
      function more() {
        var slice = [];
        for (var k = shown * 2; k < refs.length && slice.length < 8; k += 2) slice.push([refs[k], refs[k + 1]]);
        $('#rkMore').innerHTML = '<div class="spinner"></div>';
        Promise.all(slice.map(function (r) { return loadVol(b.id, r[0]); })).then(function (vols) {
          if (!alive) return;
          $('#rkList').insertAdjacentHTML('beforeend', slice.map(function (r, k) {
            var vol = vols[k], meta = idx.volumes[r[0] - 1], bi = noteOwners(vol)[r[1]], note = stripLinks(vol.notes[r[1]]);
            var all = note.split('\n').filter(Boolean), nrm = AR.norm(name);
            var hit = all.filter(function (p) { return AR.norm(p).indexOf(nrm) >= 0; });
            if (!hit.length) hit = all.slice(0, 1);
            var blk = bi !== undefined ? vol.blocks[bi] : null, hnum = blk && blk[0] === 'h' ? blk[1] : 0;
            var sec = bi !== undefined ? meta.sections[sectionOf(meta, bi)] : null;
            var href = bi !== undefined ? '#/read/' + b.id + '/' + r[0] + '/' + sectionOf(meta, bi) + '/b' + bi + '?q=' + encodeURIComponent('"' + name + '"') + '&n=' + r[1] : '';
            var cut = false;
            var body = hit.slice(0, 2).map(function (p) {
              var ex = excerpt(p, AR.ranges(hl, p)); cut = cut || ex.cut;
              return '<p class="rk-t">' + renderText(ex.t, { ranges: ex.r, notes: false, links: false }) + '</p>';
            }).join('');
            if (hit.length > 2 || all.length > hit.length) cut = true;
            var where = [idx.volumes.length > 1 ? meta.name : '', sec && sec.n ? (sec.w || 'الباب') + ' ' + sec.n : '', sec ? sec.t.slice(0, 70) + (sec.t.length > 70 ? '…' : '') : ''].filter(Boolean).join(' · ');
            return '<li class="rk"><header>' + (hnum ? '<a class="rk-h" href="' + href + '">الحديث <b>' + hnum + '</b></a>' : '<span class="rk-h">حاشية</span>') +
              '<span class="rk-where">' + escH(where) + '</span></header>' + body +
              (cut ? '<details class="rk-full"><summary>التعليق كاملاً</summary><div>' + all.map(function (p) { return '<p>' + renderText(p, { ranges: AR.ranges(hl, p), notes: false, links: false }) + '</p>'; }).join('') + '</div></details>' : '') +
              (href ? '<a class="rk-go" href="' + href + '">افتح الحديث في موضعه ' + ICON.arrow + '</a>' : '') + '</li>';
          }).join(''));
          shown += slice.length;
          $('#rkMore').innerHTML = shown * 2 < refs.length ? '<button class="btn" id="rkBtn">المزيد من التعليقات (' + fmt(refs.length / 2 - shown) + ')</button>' : (x.kc > shown ? '<p class="hint">عُرض أوفى ' + shown + ' تعليقاً من ' + fmt(x.kc) + '.</p>' : '');
          var bt = $('#rkBtn'); if (bt) bt.addEventListener('click', more);
        }).catch(fail);
      }
      more();
    }).catch(fail);
  }

  /* ───────── الفهارس: المصادر والرواة ───────── */
  function viewIndex(kind, b) {
    window.scrollTo(0, 0);
    var alive = true;
    cleanup = function () { alive = false; };
    var isSrc = kind === 'sources';
    app.innerHTML =
      '<section class="search-head"><div class="hero-pattern" aria-hidden="true"></div><div class="wrap">' +
        '<h1>فهارس ' + b.title + '</h1>' +
        '<div class="s-opts"><div class="og"><a class="tab' + (isSrc ? ' on' : '') + '" href="#/index/sources/' + b.id + '">المصادر</a><a class="tab' + (!isSrc ? ' on' : '') + '" href="#/index/rawi/' + b.id + '">الرواة</a></div>' +
          '<div class="og"><span>الكتاب</span><select id="idxBook" aria-label="الكتاب">' + BOOKS.map(function (x) { return '<option value="' + x.id + '"' + (x === b ? ' selected' : '') + '>' + x.title + '</option>'; }).join('') + '</select></div></div>' +
        '<p class="idx-lead">' + (isSrc ? 'المصادر التي خرّج منها المحقق أحاديث الكتاب في حواشيه. اضغط مصدراً لتصفّح كل ما خُرّج منه.' : 'أسماء الرواة كما وردت في أسانيد الأحاديث. لكل راوٍ صفحة فيها تعليقات المحقق عليه وأحاديثه والصيغ القريبة من اسمه.') + '</p>' +
      '</div></section>' +
      '<section class="wrap block idx"><div class="filter">' + ICON.search + '<input id="idxF" type="search" placeholder="' + (isSrc ? 'ابحث عن مصدر…' : 'ابحث عن راوٍ…') + '" autocomplete="off"></div><p class="s-status" id="idxN"></p><div class="idx-list" id="idxList"><div class="spinner"></div></div></section>' + footer();
    $('#idxBook').addEventListener('change', function () { location.hash = '#/index/' + kind + '/' + this.value; });
    getJSON('data/' + b.id + '/' + kind + '.json').then(function (list) {
      if (!alive) return;
      var max = list.length ? list[0].c : 1;
      function draw(f) {
        var nf = f ? AR.norm(f) : '', items = list.filter(function (x) { return !nf || AR.norm(x.n).indexOf(nf) >= 0; });
        $('#idxN').innerHTML = '<p>' + fmt(items.length) + (isSrc ? ' مصدراً' : ' اسماً') + '</p>';
        $('#idxList').innerHTML = items.slice(0, 600).map(function (x) {
          return '<a class="idx-item" href="' + (isSrc ? '#/search?src=' + encodeURIComponent(x.n) + (b.id === 'wasail' ? '' : '&book=' + b.id) : rawiHref(b, x.n)) + '"><span class="idx-n">' + escH(x.n) + '</span><span class="idx-bar"><i style="width:' + Math.max(2, Math.sqrt(x.c / max) * 100) + '%"></i></span><b>' + fmt(x.c) + '</b></a>';
        }).join('') || '<p class="hint">لا نتائج.</p>';
      }
      draw('');
      var t; $('#idxF').addEventListener('input', function () { var v = this.value.trim(); clearTimeout(t); t = setTimeout(function () { draw(v); }, 150); });
    }).catch(fail);
  }

  /* ───────── الشريط العلوي ───────── */
  $('#topSearch').addEventListener('submit', function (e) {
    e.preventDefault(); var i = $('#topSearchInput'), v = i.value.trim(); if (!v) return;
    var m = location.hash.match(/^#\/(?:book|read|rawi|index\/\w+)\/(\w+)/), bk = m && bookOf(m[1]) ? m[1] : (parseHash().q.book || '');
    location.hash = '#/search?q=' + encodeURIComponent(v) + (bk && bk !== 'wasail' ? '&book=' + bk : ''); i.value = ''; i.blur();
  });
  $('#themeBtn').addEventListener('click', function () {
    var order = ['light', 'sepia', 'dark']; settings.theme = order[(order.indexOf(settings.theme) + 1) % 3];
    saveSettings(); applySettings(); toast({ light: 'السمة الفاتحة', sepia: 'السمة الورقية', dark: 'السمة الداكنة' }[settings.theme]);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); ($('#sInput') || $('#topSearchInput')).focus(); }
  });
  window.addEventListener('hashchange', route);
  route();
})();
