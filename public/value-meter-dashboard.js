(() => {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyCfTo7EIxWdDRRoI1EyfB6F4ETFvyPUqw8e-EF4aUHbzOniWxwjuzwF2tf-gU2S4A02Q/exec';

  function number(value) {
    return Number(value || 0).toLocaleString('en-US');
  }

  function injectDashboardStats(data) {
    if (!data || !data.success) return;
    const overview = document.getElementById('app');
    if (!overview || !location.hash.match(/^#\/?overview(?:\/|$)/)) return;
    if (overview.querySelector('.value-meter-live-summary')) return;

    const total = Number(data.totalAssessments || 0);
    const average = Number(data.averageScore || 0);
    const green = Number(data.statuses?.green || 0);
    const amber = Number(data.statuses?.amber || 0);
    const red = Number(data.statuses?.red || 0);

    const section = document.createElement('section');
    section.className = 'value-meter-live-summary';
    section.innerHTML = `
      <h2>AI Value Meter — Live public results</h2>
      <p class="lede">Anonymous assessment results from the connected AI Value Meter. These are early pilot results and are not a validated global benchmark.</p>
      <div class="coverage">
        <div class="coverage__item"><span class="coverage__num">${number(total)}</span><span class="coverage__label">Assessments completed</span></div>
        <div class="coverage__item"><span class="coverage__num">${number(average)}/100</span><span class="coverage__label">Average AI Value Score</span></div>
        <div class="coverage__item"><span class="coverage__num">${number(green)}</span><span class="coverage__label">Green results</span></div>
        <div class="coverage__item"><span class="coverage__num">${number(amber)}</span><span class="coverage__label">Amber results</span></div>
        <div class="coverage__item"><span class="coverage__num">${number(red)}</span><span class="coverage__label">Red results</span></div>
      </div>
      <p class="muted">Source: AI Value Meter anonymous assessment feed.</p>
    `;
    overview.appendChild(section);
  }

  async function load() {
    try {
      const response = await fetch(`${ENDPOINT}?summary=1`, { cache: 'no-store' });
      if (!response.ok) return;
      injectDashboardStats(await response.json());
    } catch (error) {
      // The public dashboard remains usable if the optional live feed is unavailable.
    }
  }

  function scheduleLoad() {
    window.setTimeout(load, 250);
  }

  window.addEventListener('hashchange', scheduleLoad);
  const app = document.getElementById('app');
  if (app) {
    new MutationObserver(scheduleLoad).observe(app, { childList: true });
  }
  scheduleLoad();
})();
