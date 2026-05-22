/* Chillarin UI Kit — mode-toggle.js
   Source of truth: chillarin-blog/static/js/mode-toggle.js
   localStorage key: 'chirarin.mode' (全プロジェクト共通)
   <html> に .light クラスを付け外しする。
*/
(function () {
  'use strict';

  var STORAGE_KEY = 'chirarin.mode';

  function apply(mode) {
    var root = document.documentElement;
    if (mode === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }

  function save(mode) {
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.mode-toggle');
    if (!btn) return;

    var isLight = document.documentElement.classList.contains('light');
    btn.setAttribute('aria-pressed', String(isLight));

    btn.addEventListener('click', function () {
      var nowLight = !document.documentElement.classList.contains('light');
      apply(nowLight ? 'light' : 'dark');
      save(nowLight ? 'light' : 'dark');
      btn.setAttribute('aria-pressed', String(nowLight));
    });
  });
})();
