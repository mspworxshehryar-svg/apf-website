document.documentElement.classList.add('js');
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu
document.querySelectorAll('.menu-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var nav = document.getElementById('site-nav');
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// Header shadow once the page scrolls
var header = document.querySelector('.site-header');
if (header) {
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Scroll reveal: elements fade and rise in, siblings staggered
var revealSel = '.section-head, .card, .panel, .split > div:not(.panel), .grid-3 > div:not(.card), .grid-4 > div, .form, .dcard, .checks li, .faq details, .handoff, .track-scroll, .page-hero .wrap > *, .hero .wrap > *, .cta .wrap > *';
var popSel = '.card, .dcard';
var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSel));
revealEls.forEach(function (el) {
  if (el.closest('.reveal') && el.closest('.reveal') !== el) return;
  el.classList.add('reveal');
  if (el.matches(popSel)) el.classList.add('pop');
  var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(revealSel); });
  el.style.setProperty('--d', Math.min(sibs.indexOf(el), 6) * 90 + 'ms');
});
if ('IntersectionObserver' in window && !reduceMotion) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  // Accent underlines draw in when their heading comes into view
  document.querySelectorAll('.accent').forEach(function (a) {
    var ao = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { a.classList.add('drawn'); ao.disconnect(); }
    }, { threshold: 0.6 });
    ao.observe(a);
  });
} else {
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  document.querySelectorAll('.accent').forEach(function (a) { a.classList.add('drawn'); });
}

// Expandable cards: hover expands; click or Enter pins them open
document.querySelectorAll('.xcard').forEach(function (card) {
  var hint = card.querySelector('.xhint');
  var toggle = function () {
    var open = card.classList.toggle('open');
    if (hint) hint.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  card.addEventListener('click', function (e) { if (!e.target.closest('a')) toggle(); });
});

// Home: horizontal delivery process
var track = document.querySelector('.track');
if (track) {
  var steps = Array.prototype.slice.call(track.querySelectorAll('.tstep'));
  var detail = document.getElementById('step-detail');
  var fill = track.querySelector('.track-fill');
  var pinned = -1;
  var show = function (i) {
    if (i < 0) { detail.classList.remove('show'); return; }
    var s = steps[i];
    detail.querySelector('.kicker').textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
    detail.querySelector('h3').textContent = s.querySelector('.tname').textContent;
    detail.querySelector('p:not(.kicker)').textContent = s.dataset.text;
    var tpl = s.querySelector('template');
    if (tpl) detail.querySelector('.icon').innerHTML = tpl.innerHTML;
    detail.classList.add('show');
  };
  var mark = function (i) {
    steps.forEach(function (s, j) {
      s.classList.toggle('active', j === i);
      s.classList.toggle('done', i >= 0 && j < i);
      s.setAttribute('aria-pressed', j === i ? 'true' : 'false');
    });
    track.classList.toggle('has-active', i >= 0);
    if (fill) fill.style.width = i > 0 ? (85.72 * i / (steps.length - 1)) + '%' : '0';
  };
  steps.forEach(function (s, i) {
    s.addEventListener('mouseenter', function () { show(i); });
    s.addEventListener('focus', function () { show(i); });
    s.addEventListener('click', function () {
      pinned = pinned === i ? -1 : i;
      mark(pinned);
      show(pinned === -1 ? i : pinned);
    });
  });
  track.addEventListener('mouseleave', function () { show(pinned); });
}

// Delivery page: hovering a step card lights its dot on the rail
var dots = document.querySelectorAll('.rail-dots > div');
document.querySelectorAll('.dcard').forEach(function (card, i) {
  card.addEventListener('mouseenter', function () { if (dots[i]) dots[i].classList.add('on'); });
  card.addEventListener('mouseleave', function () { if (dots[i]) dots[i].classList.remove('on'); });
});

// Forms: no server on a static host, so forms open a pre-filled email to sales@.
// Swap for a form service (Formspree, Netlify Forms) to receive submissions directly.
document.querySelectorAll('form[data-mailto]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var lines = [];
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.type === 'file' || el.type === 'checkbox' || !el.name) return;
      if (el.value) lines.push(el.dataset.label + ': ' + el.value);
    });
    var href = 'mailto:' + form.dataset.mailto +
      '?subject=' + encodeURIComponent(form.dataset.subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
    var status = form.querySelector('.form-status');
    if (status) status.textContent = form.dataset.done || 'Your email app should open with your message ready to send.';
  });
});

var y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
