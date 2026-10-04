/* تطبيع النص العربي للبحث — يُستعمل في الصفحة وفي عامل البحث معاً.
   يحذف التشكيل والتطويل وعلامات الحواشي، ويوحّد صور الألف والياء والهاء
   والأرقام، ويحوّل الترقيم إلى فراغ واحد. */
(function (root) {
  'use strict';
  var MAP = {
    'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ٲ': 'ا', 'ٳ': 'ا',
    'ى': 'ي', 'ئ': 'ي', 'ی': 'ي', 'ې': 'ي', 'ے': 'ي',
    'ؤ': 'و', 'ة': 'ه', 'ۀ': 'ه', 'ہ': 'ه', 'ک': 'ك', 'گ': 'ك',
    'ﻻ': 'لا', 'ﻼ': 'لا', 'ﻷ': 'لا', 'ﻸ': 'لا', 'ﻹ': 'لا', 'ﻺ': 'لا', 'ﻵ': 'لا', 'ﻶ': 'لا',
    'ﷲ': 'الله'
  };

  function isMark(c) {
    return (c >= 0x064B && c <= 0x065F) || c === 0x0670 || c === 0x0640 ||
      (c >= 0x0610 && c <= 0x061A) || (c >= 0x06D6 && c <= 0x06ED) ||
      (c >= 0x200B && c <= 0x200F) || c === 0xFEFF;
  }
  function isWord(c) {
    return (c >= 0x0621 && c <= 0x064A) || (c >= 0x0671 && c <= 0x06D3) ||
      (c >= 0x30 && c <= 0x39) || (c >= 0x61 && c <= 0x7A);
  }

  /* يعيد النص المطبَّع؛ وإن طُلبت الخريطة أعاد معها موضع كل حرف في الأصل. */
  function run(s, wantMap) {
    var out = '', map = wantMap ? [] : null, lastSpace = true;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i], c = s.charCodeAt(i);
      if (c === 0xE000) {                       // علامة حاشية: تُتخطّى كاملة
        var e = s.indexOf('', i);
        i = e < 0 ? s.length : e;
        continue;
      }
      if (isMark(c)) continue;
      var r = MAP[ch];
      if (r === undefined) {
        if (c >= 0x0660 && c <= 0x0669) r = String.fromCharCode(c - 0x0660 + 0x30);
        else if (c >= 0x06F0 && c <= 0x06F9) r = String.fromCharCode(c - 0x06F0 + 0x30);
        else if (c >= 0x41 && c <= 0x5A) r = String.fromCharCode(c + 32);
        else r = ch;
      }
      if (r.length === 1 && !isWord(r.charCodeAt(0))) {
        if (lastSpace) continue;
        out += ' '; if (map) map.push(i); lastSpace = true;
        continue;
      }
      out += r; lastSpace = false;
      if (map) for (var k = 0; k < r.length; k++) map.push(i);
    }
    if (lastSpace && out.length) { out = out.slice(0, -1); if (map) map.pop(); }
    return wantMap ? { text: out, map: map } : out;
  }

  function esc(t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var PRE = '(?:و|ف)?(?:ب|ل|ك)?(?:ال|ل)?';

  /* يبني تعابير المطابقة من نص الاستعلام.
     opts.mode: all (كل الكلمات) | phrase (العبارة) | any (أي كلمة)
     opts.whole: كلمة كاملة (مع جواز السوابق: و، ف، ب، ل، ك، ال) */
  function compile(q, opts) {
    opts = opts || {};
    var mode = opts.mode || 'all';
    var m = /^\s*["«”“](.+)["»”“]\s*$/.exec(q);
    if (m) { q = m[1]; mode = 'phrase'; }
    var tokens = run(q).split(' ').filter(Boolean);
    if (!tokens.length) return null;
    var w = !!opts.whole;
    var wrap = function (body) { return w ? '(?:^| )' + PRE + '(?:' + body + ')(?= |$)' : body; };
    // العبارة تتسامح مع سقوط الفراغ بين الكلمات (شائع في النصوص المنضَّدة)
    var phrase = new RegExp(wrap(tokens.map(esc).join(' ?')), 'g');
    var each = tokens.map(function (t) { return new RegExp(wrap(esc(t)), 'g'); });
    return { mode: mode, tokens: tokens, phrase: phrase, each: each };
  }

  /* 0 = لا تطابق؛ وإلا درجة الترتيب. */
  function score(c, text) {
    c.phrase.lastIndex = 0;
    var ph = c.phrase.test(text);
    if (c.mode === 'phrase') return ph ? 3 : 0;
    var hit = 0;
    for (var i = 0; i < c.each.length; i++) { c.each[i].lastIndex = 0; if (c.each[i].test(text)) hit++; }
    if (c.mode === 'all') return hit === c.each.length ? (ph ? 3 : 1) : 0;
    return hit ? (ph ? 3 : hit / c.each.length) : 0;
  }

  /* مواضع التطابق في النص الأصلي: [[بداية، نهاية)…] مرتبة غير متداخلة. */
  function ranges(c, original) {
    var nm = run(original, true), res = [], list = c.mode === 'phrase' ? [c.phrase] : c.each.concat([c.phrase]);
    list.forEach(function (re) {
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(nm.text))) {
        if (!m[0].length) { re.lastIndex++; continue; }
        var a = m.index, b = m.index + m[0].length;
        if (nm.text[a] === ' ') a++;
        res.push([nm.map[a], nm.map[b - 1] + 1]);
      }
    });
    res.sort(function (x, y) { return x[0] - y[0] || y[1] - x[1]; });
    var out = [];
    res.forEach(function (r) {
      var l = out[out.length - 1];
      if (l && r[0] <= l[1]) l[1] = Math.max(l[1], r[1]); else out.push(r);
    });
    // يمتدّ التظليل ليشمل حركات الحرف الأخير
    out.forEach(function (r) { while (r[1] < original.length && isMark(original.charCodeAt(r[1]))) r[1]++; });
    return out;
  }

  root.AR = { norm: run, compile: compile, score: score, ranges: ranges, isMark: isMark };
})(typeof self !== 'undefined' ? self : this);
