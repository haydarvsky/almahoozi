/* عامل البحث: يحمّل الأجزاء مرة واحدة، يطبّع نصوصها، ثم يجيب عن الاستعلامات.
   يعيد مواضع النتائج فقط (جزء، كتلة، حاشية)؛ والصفحة تعرض النص من ملف الجزء. */
importScripts('normalize.js');

var vols = {};          // v → {nb: نصوص الكتل المطبَّعة, gr: أصناف الأحكام, nn: الحواشي المطبَّعة, owner: كتلة كل حاشية}
var loading = {};
var current = 0;

function load(book, v) {
  var key = book + '/' + v;
  if (vols[key]) return Promise.resolve(vols[key]);
  if (loading[key]) return loading[key];
  loading[key] = fetch('../data/' + book + '/v' + v + '.json').then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (d) {
    var nb = new Array(d.blocks.length), gr = new Array(d.blocks.length), owner = new Int32Array(d.notes.length).fill(-1);
    var re = /(\d+)/g;
    for (var i = 0; i < d.blocks.length; i++) {
      var b = d.blocks[i], t = b[0] === 'h' ? b[3] : b[0] === 'b' ? b[2] : b[1];
      nb[i] = AR.norm(t);
      gr[i] = b[0] === 'h' ? (b[5] || '') : null;
      var m; re.lastIndex = 0;
      while ((m = re.exec(t))) owner[+m[1]] = i;
    }
    var nn = d.notes.map(function (n) { return AR.norm(n); });
    return (vols[key] = { nb: nb, gr: gr, nn: nn, owner: owner });
  });
  return loading[key];
}

onmessage = function (e) {
  var msg = e.data;
  if (msg.type !== 'search') return;
  var id = current = msg.id, o = msg.opts;
  var c = AR.compile(msg.q, o);
  if (!c) { postMessage({ type: 'done', id: id }); return; }
  var list = o.vol ? [o.vol] : msg.volumes;
  var grade = o.grade || '';
  var inMatn = o.scope !== 'notes', inNotes = o.scope !== 'matn' && !grade;
  var i = 0;
  (function next() {
    if (id !== current) return;
    if (i >= list.length) { postMessage({ type: 'done', id: id }); return; }
    var v = list[i++];
    load(msg.book, v).then(function (d) {
      if (id !== current) return;
      var hits = [], k, s;
      if (inMatn) for (k = 0; k < d.nb.length; k++) {
        if (grade && d.gr[k] !== grade) continue;
        if ((s = AR.score(c, d.nb[k]))) hits.push([k, -1, s]);
      }
      if (inNotes) for (k = 0; k < d.nn.length; k++) {
        if ((s = AR.score(c, d.nn[k]))) hits.push([d.owner[k], k, s]);
      }
      postMessage({ type: 'hits', id: id, v: v, hits: hits, done: i, total: list.length });
      next();
    }).catch(function (err) {
      postMessage({ type: 'error', id: id, v: v, message: String(err) });
      next();
    });
  })();
};
