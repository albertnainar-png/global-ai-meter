/* Global AI Meter — direct Overview rebuild */
(function () {
  function injectStyles() {
    if (document.getElementById('overview-rebuild-styles')) return;
    const style = document.createElement('style');
    style.id = 'overview-rebuild-styles';
    style.textContent = `
      .overview-rebuild{display:grid;gap:2.2rem}
      .overview-hero{position:relative;overflow:hidden;padding:3.4rem 2.2rem 2.6rem;border:1px solid #12394c;border-radius:24px;background:radial-gradient(ellipse at 70% 0%,rgba(0,194,255,.18),transparent 42%),linear-gradient(135deg,#061521,#020812 70%);box-shadow:inset 0 0 60px rgba(0,190,255,.05)}
      .overview-hero:before{content:"";position:absolute;right:8%;top:-55px;width:360px;height:145px;border:1px solid rgba(0,221,255,.3);border-radius:50%;box-shadow:0 0 35px rgba(0,221,255,.2),inset 0 -20px 35px rgba(0,221,255,.12);transform:rotate(-5deg)}
      .overview-hero>*{position:relative;z-index:1;max-width:680px}
      .overview-kicker{color:#23d8ff;text-transform:uppercase;letter-spacing:.22em;font-size:.72rem;font-weight:800}
      .overview-hero h1{font-size:clamp(2.4rem,6vw,5.2rem);line-height:1;margin:1rem 0 1.2rem;letter-spacing:.02em;text-shadow:0 0 22px rgba(151,236,255,.25)}
      .overview-hero .lede{font-size:1.1rem;max-width:620px;color:#c3d9e7}
      .overview-hero .notice{font-size:.9rem;color:#86aabd;max-width:650px}
      .overview-section{display:grid;gap:1rem}
      .overview-section h2{margin:0;font-size:1.5rem;letter-spacing:.04em}
      .overview-meters,.overview-stats,.overview-explore{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.8rem}
      .overview-panel{border:1px solid #12364b;border-radius:15px;background:linear-gradient(180deg,rgba(8,27,42,.95),rgba(3,15,26,.95));padding:1.1rem;min-width:0}
      .overview-panel h3{font-size:.92rem;margin:0 0 .65rem;color:#d7f3ff}
      .overview-panel p{font-size:.8rem;color:#8eafc2;margin:0;line-height:1.55}
      .overview-bar{height:5px;background:#102f40;border-radius:99px;overflow:hidden;margin:1rem 0 .5rem}.overview-bar span{display:block;height:100%;background:linear-gradient(90deg,#18dfff,#4b86ff)}
      .overview-stat .num{display:block;font-size:1.8rem;color:#19d9ff;font-weight:800}.overview-stat .label{display:block;color:#8eafc2;font-size:.75rem;margin-top:.25rem}
      .overview-lower{display:grid;grid-template-columns:1.2fr 1fr;gap:1rem}.overview-list{display:grid;gap:.7rem}.overview-list a{color:#6fe9ff;text-decoration:none;font-weight:700}.overview-list a:hover{text-decoration:underline}.overview-list small{display:block;color:#7897aa;margin-top:.2rem}
      .overview-explore{grid-template-columns:repeat(3,minmax(0,1fr))}.overview-explore a{display:block;text-decoration:none;color:inherit}.overview-explore strong{display:block;color:#d7f3ff}.overview-explore span{display:block;color:#7897aa;font-size:.8rem;margin-top:.25rem}
      @media(max-width:900px){.overview-meters,.overview-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.overview-lower{grid-template-columns:1fr}}
      @media(max-width:520px){.overview-hero{padding:2.2rem 1.2rem}.overview-meters,.overview-stats,.overview-explore{grid-template-columns:1fr}.overview-hero:before{right:-100px}}
    `;
    document.head.appendChild(style);
  }

  function rebuiltOverview() {
    const c = computeCoverageSummary();
    const meters = METERS.map((m) => {
      const records = recordsFor({ meter: m.id });
      const real = records.filter((r) => !r.isDemo).length;
      return `<article class="overview-panel"><h3>${escapeHtml(m.name)}</h3><p>${escapeHtml(m.description)}</p><div class="overview-bar"><span style="width:${Math.min(100, real * 20)}%"></span></div><p>${real ? real + ' verified record(s) loaded' : 'No verified records loaded yet'}</p></article>`;
    }).join('');
    const stats = [
      [c.catalogMetrics, 'Metrics catalogued'], [c.realRecords, 'Verified real records'], [c.demoRecords, 'Demo records excluded'], [c.countries, 'Countries in directory'], [c.sectors, 'Sectors tracked']
    ].map(([n, label]) => `<div class="overview-panel overview-stat"><span class="num">${n}</span><span class="label">${label}</span></div>`).join('');
    const explore = [
      ['#/continents','Continents','6 regions'],['#/countries','Countries',c.countries+' in directory'],['#/sectors','Sectors',c.sectors+' sectors'],['#/usecases','AI use cases',STATE.usecases.usecases.length+' categories'],['#/sources','Sources','Source registry'],['#/methodology','Methodology','How this is measured']
    ].map(([href,name,meta]) => `<a class="overview-panel" href="${href}"><strong>${name}</strong><span>${meta}</span></a>`).join('');
    const research = (STATE.feeds && STATE.feeds.length ? STATE.feeds : []).slice(0,5).map((item) => `<div><a href="${escapeHtml(item.url || '#')}" target="_blank" rel="noopener">${escapeHtml(item.title || 'Research update')}</a><small>${escapeHtml(item.source || item.publisher || 'Public feed')}</small></div>`).join('') || '<p>No research feed items are available in this build.</p>';
    return `<div class="overview-rebuild">
      <section class="overview-hero"><div class="overview-kicker">Public AI intelligence dashboard</div><h1>GLOBAL AI METER</h1><p class="lede">A live-informed view of the world’s AI activity, adoption, infrastructure, investment, and impact.</p><p class="notice">Independent public-information project. Metrics are source-traceable and labelled Reported, Calculated, Estimated, or Unavailable. Not all metrics are real-time.</p></section>
      <section class="overview-section"><h2>AI intelligence meters</h2><div class="overview-meters">${meters}</div></section>
      <section class="overview-section"><h2>Global snapshot</h2><div class="overview-stats">${stats}</div></section>
      <section class="overview-lower"><section class="overview-section overview-panel"><h2>Latest AI research and developments</h2><div class="overview-list">${research}</div></section><section class="overview-section overview-panel"><h2>Data coverage</h2><p>This build prioritizes transparent public evidence over unsupported precision. Where a verified figure is not available at the required geography or category level, the dashboard shows Unavailable instead of inventing a number.</p><p>Explore the source registry and methodology to understand what is measured and how confidence is assigned.</p></section></section>
      <section class="overview-section"><h2>Explore the intelligence directory</h2><div class="overview-explore">${explore}</div></section>
    </div>`;
  }

  function activate() {
    if (typeof computeCoverageSummary !== 'function' || typeof routes === 'undefined') return false;
    injectStyles();
    routes.overview = rebuiltOverview;
    if (typeof STATE !== 'undefined' && STATE.loaded && location.hash.replace(/^#\/?/, '') .split('/')[0] === '') router();
    else if (typeof STATE !== 'undefined' && STATE.loaded && (location.hash === '' || location.hash === '#/' || location.hash === '#/overview')) router();
    return true;
  }
  let tries = 0;
  const timer = setInterval(() => { tries += 1; if (activate() || tries > 80) clearInterval(timer); }, 100);
})();
