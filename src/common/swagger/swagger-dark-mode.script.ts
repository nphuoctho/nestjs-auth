/**
 * Injects a fixed dark-mode toggle button into the Swagger UI page.
 * Runs standalone against `document.body` (does not depend on the
 * swagger-ui React app having mounted), persists choice in
 * localStorage, and defaults to the OS color-scheme preference.
 */
export const swaggerDarkModeScript = `
(function () {
  var STORAGE_KEY = 'swagger-theme';
  var root = document.documentElement;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('swagger-theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '\u2600 Light' : '\u263E Dark';
  }

  var stored = localStorage.getItem(STORAGE_KEY);
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(stored || (prefersDark ? 'dark' : 'light'));

  function mount() {
    if (document.getElementById('swagger-theme-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'swagger-theme-toggle';
    btn.type = 'button';
    btn.onclick = function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      apply(next);
    };
    document.body.appendChild(btn);
    apply(root.getAttribute('data-theme') || 'light');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
`;
