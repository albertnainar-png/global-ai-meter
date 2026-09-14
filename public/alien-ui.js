(function () {
  'use strict';
  const app = document.getElementById('app');
  if (!app) return;

  function enhance() {
    if (!location.hash || location.hash === '#/overview' || location.hash === '#') {
      if (app.querySelector('[data-alien-enhanced]')) return;
      const overview = document.createElement('section');
      overview.className = 'alien-hero';
      overview.dataset.alienEnhanced = 'true';
      overview.innerHTML = `
        <div class="alien-hero__copy">
          <div class="alien-hero__eyebrow">SIGNAL DETECTED · GLOBAL AI METER</div>
          <h1>They're Here.<br><span>AI Is Landing Everywhere.</span></h1>
          <p>Track the spread of artificial intelligence across research, adoption, infrastructure, investment, and real-world impact.</p>
          <p class="alien-hero__tag">One planet. Many systems. One public view.</p>
        </div>
        <div class="alien-hero__scene" aria-label="Illustration of a UFO hovering over a glowing planet">
          <div class="alien-planet"></div><div class="alien-ufo"></div><div class="alien-beam"></div>
          <div class="alien-signal">ORBITAL SIGNAL · ONLINE</div>
        </div>`;
      app.prepend(overview);

      const demo = document.createElement('div');
      demo.className = 'alien-demo-panel';
      demo.innerHTML = '<span aria-hidden="true">⚠</span><div><strong>DEMO DATA MODE</strong><small>The existing data-status notification remains active. Unverified figures are not presented as live facts.</small></div>';
      overview.after(demo);

      const panels = document.createElement('section');
      panels.className = 'alien-panels';
      panels.innerHTML = `
        <article class="alien-panel"><h2>Which AI Is Used Most?</h2><div class="alien-panel__sub">Public adoption comparison · verification pending</div>
          ${['ChatGPT','Gemini','Microsoft Copilot','Meta AI','Grok'].map((name, i) => `<div class="alien-row"><span class="alien-rank">0${i + 1}</span><div><b>${name}</b><small>Reported usage figure under review</small></div><span class="alien-status">Pending</span></div>`).join('')}
        </article>
        <article class="alien-panel"><h2>Global AI Activity</h2><div class="alien-panel__sub">Signals being prepared from traceable public sources</div>
          ${['Research papers','New models','New datasets','Developer activity','News & announcements'].map(name => `<div class="alien-row"><span class="alien-rank">◈</span><div><b>${name}</b><small>Awaiting verified feed item</small></div><span class="alien-value">—</span></div>`).join('')}
        </article>`;
      demo.after(panels);

      const monitor = document.createElement('div');
      monitor.className = 'alien-monitor';
      monitor.innerHTML = '<div><b>GLOBAL MONITORING CHANNEL</b><br><span>Data integrity first. Signals will appear only after source review.</span></div><span class="alien-monitor__pulse" aria-label="Monitoring channel active"></span>';
      panels.after(monitor);
    }
  }

  enhance();
  const observer = new MutationObserver(enhance);
  observer.observe(app, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => setTimeout(enhance, 0));
})();
