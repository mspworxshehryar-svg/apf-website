// Mobile menu
document.querySelectorAll('.menu-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var nav = document.getElementById('site-nav');
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
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
    var subject = form.dataset.subject;
    var href = 'mailto:' + form.dataset.mailto +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
    var status = form.querySelector('.form-status');
    if (status) status.textContent = form.dataset.done || 'Your email app should open with your message ready to send.';
  });
});

var y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
