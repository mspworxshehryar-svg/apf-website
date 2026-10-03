// Sample data for the demo portal
var loads = [
  { id: 'APF-1052', po: 'PO-88231', from: 'Oklahoma City, OK', to: 'Kansas City, MO', eq: 'Dry Van 53\'', pick: 'Oct 3, 7:40 am', del: 'Oct 4, 6:00 am', status: 'transit', carrier: 'Sample Carrier LLC', driver: 'D. Brooks', truck: 'Tr 412 / Trl 5309', weight: '41,800 lbs', miles: 350, done: 3, eta: 'Oct 4, 5:30 am', at: 'Near Wichita, KS (I-35 N)' },
  { id: 'APF-1050', po: 'PO-88219', from: 'Tulsa, OK', to: 'Memphis, TN', eq: 'Flatbed + tarps', pick: 'Oct 2, 9:00 am', del: 'Oct 3, 4:00 pm', status: 'transit', carrier: 'Sample Haulers Inc', driver: 'R. Patel', truck: 'Tr 77 / Trl F-21', weight: '44,200 lbs', miles: 400, done: 3, eta: 'Oct 3, 3:15 pm', at: 'Near West Memphis, AR (I-40 E)' },
  { id: 'APF-1055', po: 'PO-88240', from: 'Dallas, TX', to: 'Denver, CO', eq: 'Dry Van 53\'', pick: 'Oct 6, 8:00 am', del: 'Oct 7, 2:00 pm', status: 'booked', carrier: 'Sample Carrier LLC', driver: 'Pending', truck: '—', weight: '38,000 lbs', miles: 790, done: 2, eta: 'Oct 7, 2:00 pm', at: 'Awaiting pickup' },
  { id: 'APF-1056', po: 'PO-88244', from: 'Oklahoma City, OK', to: 'Laredo, TX', eq: 'Dry Van, cross border', pick: 'Oct 7, 6:00 am', del: 'Oct 8, 1:00 pm', status: 'pickup', carrier: 'Sample Freightways', driver: 'Pending', truck: '—', weight: '40,500 lbs', miles: 660, done: 1, eta: 'Oct 8, 1:00 pm', at: 'Awaiting pickup' },
  { id: 'APF-1047', po: 'PO-88190', from: 'Oklahoma City, OK', to: 'Kansas City, MO', eq: 'Dry Van 53\'', pick: 'Oct 2, 6:30 am', del: 'Oct 3, 9:12 am', status: 'delivered', carrier: 'Sample Carrier LLC', driver: 'D. Brooks', truck: 'Tr 412 / Trl 5309', weight: '42,000 lbs', miles: 350, done: 5, eta: 'Delivered', at: 'Kansas City, MO' },
  { id: 'APF-1041', po: 'PO-88152', from: 'Dallas, TX', to: 'Denver, CO', eq: 'Dry Van 53\'', pick: 'Sep 24, 7:00 am', del: 'Sep 26, 10:40 am', status: 'delivered', carrier: 'Sample Haulers Inc', driver: 'M. Ruiz', truck: 'Tr 19 / Trl 880', weight: '36,900 lbs', miles: 790, done: 5, eta: 'Delivered', at: 'Denver, CO' },
  { id: 'APF-1038', po: 'PO-88117', from: 'Tulsa, OK', to: 'Memphis, TN', eq: 'Flatbed + tarps', pick: 'Sep 22, 8:00 am', del: 'Sep 23, 5:20 pm', status: 'delivered', carrier: 'Sample Freightways', driver: 'K. Allen', truck: 'Tr 5 / Trl F-9', weight: '45,000 lbs', miles: 400, done: 5, eta: 'Delivered', at: 'Memphis, TN' }
];
var invoices = [
  { id: 'INV-20418', load: 'APF-1041', date: 'Sep 10', due: 'Oct 10', amt: 2410, st: 'due' },
  { id: 'INV-20425', load: 'APF-1038', date: 'Sep 24', due: 'Oct 24', amt: 1960, st: 'open' },
  { id: 'INV-20431', load: 'APF-1047', date: 'Oct 3', due: 'Nov 2', amt: 1325, st: 'open' },
  { id: 'INV-20402', load: 'APF-1029', date: 'Aug 28', due: 'Sep 27', amt: 1780, st: 'late' },
  { id: 'INV-20391', load: 'APF-1022', date: 'Aug 20', due: 'Sep 19', amt: 4850, st: 'paid' },
  { id: 'INV-20377', load: 'APF-1016', date: 'Aug 12', due: 'Sep 11', amt: 4325, st: 'paid' }
];
var statusInfo = {
  transit: ['In transit', 'p-transit'], booked: ['Booked', 'p-booked'],
  pickup: ['Pickup scheduled', 'p-pickup'], delivered: ['Delivered', 'p-delivered']
};
var invInfo = { due: ['Due soon', 'p-due'], open: ['Open', 'p-booked'], late: ['Past due', 'p-late'], paid: ['Paid', 'p-paid'] };
var money = function (n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
var pill = function (s) { return '<span class="pill ' + statusInfo[s][1] + '">' + statusInfo[s][0] + '</span>'; };
var $ = function (id) { return document.getElementById(id); };

function toast(msg) {
  var t = $('toast');
  t.textContent = msg; t.style.display = 'block';
  clearTimeout(t._h); t._h = setTimeout(function () { t.style.display = 'none'; }, 2800);
}

function loadRow(l, full) {
  var cells = '<td><b>' + l.id + '</b></td>' +
    (full ? '<td>' + l.po + '</td>' : '') +
    '<td>' + l.from + ' → ' + l.to + '</td><td>' + l.eq + '</td><td>' + l.pick + '</td><td>' + l.del + '</td><td>' + pill(l.status) + '</td>' +
    (full ? '<td>' + (l.status === 'delivered' ? 'BOL · POD' : l.status === 'transit' ? 'BOL' : 'Rate conf') + '</td>' : '');
  return '<tr class="click" tabindex="0" data-id="' + l.id + '">' + cells + '</tr>';
}
function bindRows(el) {
  el.querySelectorAll('tr.click').forEach(function (tr) {
    tr.addEventListener('click', function () { openTrack(tr.dataset.id); });
    tr.addEventListener('keydown', function (e) { if (e.key === 'Enter') openTrack(tr.dataset.id); });
  });
}

// Dashboard
var active = loads.filter(function (l) { return l.status !== 'delivered'; });
$('dash-active').innerHTML = active.map(function (l) { return loadRow(l, false); }).join('');
bindRows($('dash-active'));
$('k-transit').textContent = loads.filter(function (l) { return l.status === 'transit'; }).length;
$('k-pickup').textContent = loads.filter(function (l) { return l.status === 'booked' || l.status === 'pickup'; }).length;
var open = invoices.filter(function (i) { return i.st !== 'paid'; });
var openTotal = open.reduce(function (s, i) { return s + i.amt; }, 0);
$('k-balance').textContent = '$' + Math.round(openTotal).toLocaleString();

// Shipments with filters
var filter = 'all';
function renderShipments() {
  var list = loads.filter(function (l) {
    return filter === 'all' || (filter === 'active' ? l.status !== 'delivered' : l.status === filter);
  });
  $('ship-body').innerHTML = list.map(function (l) { return loadRow(l, true); }).join('');
  bindRows($('ship-body'));
  $('ship-filters').innerHTML = [['all', 'All'], ['active', 'Active'], ['transit', 'In transit'], ['delivered', 'Delivered']].map(function (f) {
    return '<button class="chip' + (filter === f[0] ? ' on' : '') + '" data-f="' + f[0] + '">' + f[1] + '</button>';
  }).join('');
  $('ship-filters').querySelectorAll('.chip').forEach(function (b) {
    b.onclick = function () { filter = b.dataset.f; renderShipments(); };
  });
}
renderShipments();

// Tracking
var steps = ['Booked', 'Carrier assigned', 'Picked up', 'In transit', 'Delivered'];
function openTrack(q, quiet) {
  q = (q || '').trim().toUpperCase();
  var l = loads.find(function (x) { return x.id === q || x.po === q || x.id.replace('APF-', '') === q; }) || loads[0];
  if (!quiet && location.hash !== '#track') location.hash = 'track';
  var pct = Math.min(l.done / 4, 1);
  var tl = steps.map(function (s, i) {
    var cls = i < l.done ? 'done' : i === l.done ? 'now' : '';
    if (l.status === 'delivered') cls = 'done';
    var when = i < l.done || l.status === 'delivered' ? (i === 0 ? 'Rate confirmed' : i === 2 ? l.pick : i === 4 ? l.del : 'Completed') : i === l.done ? (i === 3 ? l.at : 'Up next') : '';
    return '<li class="' + cls + '"><div class="dot"></div><div><b>' + s + '</b><div class="when">' + when + '</div></div></li>';
  }).join('');
  var x = 40 + 520 * pct;
  $('track-body').innerHTML =
    '<div class="box"><div class="track-head"><div><div class="big">' + l.id + ' ' + pill(l.status) + '</div>' +
    '<div class="route">' + l.from + '<span class="line"></span>' + l.to + '</div></div>' +
    '<div><div class="kpi" style="border:0;padding:0"><div class="label">' + (l.status === 'delivered' ? 'Delivered' : 'Estimated arrival') + '</div><div class="value" style="font-size:1.3rem">' + (l.status === 'delivered' ? l.del : l.eta) + '</div><div class="delta">Last location: ' + l.at + '</div></div></div></div></div>' +
    '<div class="cols"><div class="box"><h2>Live map</h2>' +
    '<svg class="map" viewBox="0 0 600 260" role="img" aria-label="Route from ' + l.from + ' to ' + l.to + '">' +
    '<rect width="600" height="260" fill="#e9ecf3"/><path d="M40 200 C 180 60, 380 240, 560 70" stroke="#b9bfd3" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<path d="M40 200 C 180 60, 380 240, 560 70" stroke="#2a2385" stroke-width="6" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="' + pct + ' 1"/>' +
    '<circle cx="40" cy="200" r="9" fill="#2a2385"/><circle cx="560" cy="70" r="9" fill="#c8302b"/>' +
    '<text x="40" y="232" font-size="14" font-weight="700" fill="#1b1b22" text-anchor="start">' + l.from + '</text>' +
    '<text x="560" y="50" font-size="14" font-weight="700" fill="#1b1b22" text-anchor="end">' + l.to + '</text>' +
    (l.status === 'transit' ? '<g><circle cx="' + x + '" cy="' + (l.done > 2 ? 150 : 125) + '" r="13" fill="#c8302b" stroke="#fff" stroke-width="3"/></g>' : '') +
    '</svg><p class="note" style="margin-top:8px">Mockup map. A live version would show the truck\'s GPS / ELD position.</p></div>' +
    '<div class="box"><h2>Status</h2><ul class="timeline">' + tl + '</ul></div></div>' +
    '<div class="cols" style="margin-top:24px"><div class="box"><h2>Shipment details</h2><dl class="facts-grid">' +
    '<div><dt>PO #</dt><dd>' + l.po + '</dd></div><div><dt>Equipment</dt><dd>' + l.eq + '</dd></div>' +
    '<div><dt>Weight</dt><dd>' + l.weight + '</dd></div><div><dt>Miles</dt><dd>' + l.miles + '</dd></div>' +
    '<div><dt>Carrier</dt><dd>' + l.carrier + '</dd></div><div><dt>Driver</dt><dd>' + l.driver + '</dd></div>' +
    '<div><dt>Truck / trailer</dt><dd>' + l.truck + '</dd></div><div><dt>Pickup</dt><dd>' + l.pick + '</dd></div></dl></div>' +
    '<div class="box"><h2>Documents</h2><div class="tbl-wrap"><table><tbody>' +
    '<tr><td><b>Rate Confirmation</b></td><td><button class="link-btn" onclick="toast(\'Demo: PDF would open.\')">View</button></td></tr>' +
    (l.done >= 2 ? '<tr><td><b>Bill of Lading</b></td><td><button class="link-btn" onclick="toast(\'Demo: PDF would open.\')">View</button></td></tr>' : '') +
    (l.status === 'delivered' ? '<tr><td><b>Proof of Delivery</b><span class="sub">Signed by receiver</span></td><td><button class="link-btn" onclick="toast(\'Demo: PDF would open.\')">View</button></td></tr>' : '<tr><td class="note">POD appears here after delivery.</td><td></td></tr>') +
    '</tbody></table></div><div class="btn-row" style="margin-top:16px"><button class="btn btn-outline btn-sm" onclick="toast(\'Demo: a tracking link was copied to share with your customer.\')">Share tracking link</button><a class="btn btn-outline btn-sm" href="#support">Message rep</a></div></div></div>';
  $('t-q').value = l.id;
}
openTrack('APF-1052', true);

// Invoices
$('inv-body').innerHTML = invoices.map(function (i) {
  return '<tr><td><b>' + i.id + '</b></td><td>' + i.load + '</td><td>' + i.date + '</td><td>' + i.due + '</td><td><b>' + money(i.amt) + '</b></td>' +
    '<td><span class="pill ' + invInfo[i.st][1] + '">' + invInfo[i.st][0] + '</span></td>' +
    '<td>' + (i.st === 'paid' ? '<button class="link-btn" onclick="toast(\'Demo: receipt would download.\')">Receipt</button>' :
      '<button class="btn btn-red btn-sm" onclick="toast(\'Demo: payment page would open (ACH or card).\')">Pay</button> <button class="link-btn" onclick="toast(\'Demo: invoice PDF would open.\')">PDF</button>') + '</td></tr>';
}).join('');
var sum = function (f) { return invoices.filter(f).reduce(function (s, i) { return s + i.amt; }, 0); };
$('i-open').textContent = '$' + sum(function (i) { return i.st !== 'paid'; }).toLocaleString();
$('i-cur').textContent = '$' + sum(function (i) { return i.st === 'open' || i.st === 'due'; }).toLocaleString();
$('i-past').textContent = '$' + sum(function (i) { return i.st === 'late'; }).toLocaleString();

// Reports chart
var spend = [['Apr', 24], ['May', 31], ['Jun', 28], ['Jul', 35], ['Aug', 33], ['Sep', 38]];
var max = 40;
$('bars').innerHTML = spend.map(function (m) { return '<div class="bar"><b>$' + m[1] + 'K</b><i style="height:' + (m[1] / max * 85) + '%"></i></div>'; }).join('');
$('bar-labels').innerHTML = spend.map(function (m) { return '<span>' + m[0] + '</span>'; }).join('');

// Booking
function bookDone() { $('book-form').hidden = true; $('book-done').hidden = false; window.scrollTo(0, 0); }
function resetBook() { $('book-form').hidden = false; $('book-done').hidden = true; $('book-form').reset(); }

// Router
function route() {
  var v = (location.hash || '#dashboard').slice(1);
  if (!$('v-' + v)) v = 'dashboard';
  document.querySelectorAll('.view').forEach(function (s) { s.classList.toggle('active', s.id === 'v-' + v); });
  document.querySelectorAll('.sidebar a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + v && !a.classList.contains('book')); });
  $('sidebar').classList.remove('open');
  $('side-btn').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();
$('side-btn').onclick = function () {
  var o = $('sidebar').classList.toggle('open');
  this.setAttribute('aria-expanded', o ? 'true' : 'false');
};
