(function () {
  'use strict';
  const app = document.getElementById('app');
  if (!app) return;

  function enhance() {
    if (!(location.hash === '' || location.hash === '#' || location.hash === '#/overview')) return;
    if (app.querySelector('[data-alien-enhanced]')) return;

    const hero = document.createElement('section');
    hero.className = 'alien-hero';
    hero.dataset.alienEnhanced = 'true';
    hero.innerHTML = `
      <div class="alien-hero__copy">
        <div class="alien-hero__eyebrow">SIGNAL DETECTED · GLOBAL AI METER</div>
        <h1>They're Here.<br><span>AI Is Landing Everywhere.</span></h1>
        <p>Tracking the real signals of AI across research, adoption, infrastructure, investment, and impact.</p>
        <p class="alien-hero__tag">Different intelligence. A brighter tomorrow.</p>
      </div>
      <div class="alien-hero__scene" aria-label="Illustration of a UFO hovering over a glowing planet">
        <div class="alien-planet"></div><div class="alien-ufo"></div><div class="alien-beam"></div>
        <div class="alien-signal">ORBITAL SIGNAL · ONLINE</div>
      </div>`;
    app.prepend(hero);

    const demo = document.createElement('div');
    demo.className = 'alien-demo-panel';
    demo.innerHTML = '<span aria-hidden="true">⚠</span><div><strong>DEMO DATA MODE</strong><small>This build contains no verified real-world statistics. Data is sourced from public feeds, and values are under review.</small></div>';
    hero.after(demo);

    const panels = document.createElement('section');
    panels.className = 'alien-panels';
    const systems = ['ChatGPT', 'Gemini', 'Microsoft Copilot', 'Meta AI', 'Grok', 'Claude', 'Character.AI'];
    const signals = ['Research papers', 'New models', 'New datasets', 'GitHub activity', 'News & announcements'];
    panels.innerHTML = `
      <article class="alien-panel">
        <h2>Which AI Is Used Most?</h2>
        <div class="alien-panel__sub">Reported chatbot usage among U.S. adults · source verification pending</div>
        ${systems.map((name, i) => `<div class="alien-row"><span class="alien-rank">${String(i + 1).padStart(2, '0')}</span><div><b>${name}</b><small>Reported usage figure under review</small></div><span class="alien-status">Pending</span></div>`).join('')}
      </article>
      <article class="alien-panel">
        <h2>Global AI Activity</h2>
        <div class="alien-panel__sub">Signals prepared from traceable public sources</div>
        ${signals.map(name => `<div class="alien-row"><span class="alien-rank">◈</span><div><b>${name}</b><small>Awaiting verified feed item</small></div><span class="alien-value">—</span></div>`).join('')}
      </article>`;
    demo.after(panels);

    const monitor = document.createElement('div');
    monitor.className = 'alien-monitor';
    monitor.innerHTML = `<div><b>GLOBAL MONITORING CHANNEL</b><br><span>MONITORING · ANALYSING · INFORMING · A BRIGHTER TOMORROW</span></div><span class="alien-monitor__pulse" aria-label="Monitoring channel active"></span>`;
    panels.after(monitor);
  }

  enhance();
  const observer = new MutationObserver(enhance);
  observer.observe(app, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => setTimeout(enhance, 0));
})();
