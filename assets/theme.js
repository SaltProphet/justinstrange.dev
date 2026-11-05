/* Theme toggle. Dark is the default; the choice is saved in localStorage ("theme").
   The inline script in each page's <head> applies the saved theme before paint. */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('global-theme-toggle');
  function current() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function sync() { if (btn) btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false'); }
  sync();
  if (!btn) return;
  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });
 })();
