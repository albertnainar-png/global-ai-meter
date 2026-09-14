/* Global AI Meter — cinematic landing page */
(function () {
  function injectStyles() {
    if (document.getElementById('overview-cinematic-styles')) return;
    const style = document.createElement('style');
    style.id = 'overview-cinematic-styles';
    style.textContent = `
      .overview-rebuild{display:grid;gap:1.25rem}
      .cin-hero{position:relative;display:grid;grid-template-columns:1.05fr .95fr;min-height:390px;overflow:hidden;border:1px solid #123b51;border-radius:22px;background:radial-gradient(circle at 72% 35%,rgba(0,214,255,.13),transparent 24%),radial-gradient(circle at 90% 15%,rgba(117,74,255,.18),transparent 34%),linear-gradient(135deg,#061521,#020711 70%);box-shadow:inset 0 0 80px rgba(0,193,255,.04)}
      .cin-hero:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(36,123,155,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(36,123,155,.08) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(to bottom,black,transparent)}
      .cin-copy{position:relative;z-index:2;padding:3.2rem 2.6rem;align-self:center}
      .cin-kicker{color:#24dfff;text-transform:uppercase;letter-spacing:.22em;font-size:.68rem;font-weight:800}
      .cin-copy h1{font-size:clamp(3rem,6vw,6.2rem);line-height:.9;letter-spacing:-.055em;margin:1.1rem 0 1.2rem;max-width:560px;text-shadow:0 0 28px rgba(180,242,255,.18)}
      .cin-copy h1 span{color:#16d8ff}
      .cin-copy .lede{font-size:1.03rem;line-height:1.65;color:#b8d2e1;max-width:510px}
      .cin-actions{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.5rem}.cin-actions a{display:inline-flex;padding:.8rem 1rem;border:1px solid #16c9ed;border-radius:5px;color:#d9f8ff;text-decoration:none;text-transform:uppercase;font-size:.68rem;font-weight:800;letter-spacing:.1em;background:rgba(0,193,255,.08)}.cin-actions a:first-child{background:#17d8f5;color:#03101a}.cin-actions a:hover{filter:brightness(1.15)}
      .cin-orbit{position:relative;min-height:330px;align-self:stretch;overflow:hidden}.cin-orbit:before{content:"";position:absolute;width:420px;height:420px;right:-45px;top:55px;border-radius:50%;background:radial-gradient(circle at 35% 25%,#1c5167,#071925 58%,#020912 72%);box-shadow:0 0 55px rgba(0,191,255,.25),inset 0 0 40px rgba(0,221,255,.15)}.cin-orbit:after{content:"";position:absolute;width:470px;height:125px;right:-70px;top:45px;border:2px solid rgba(86,231,255,.72);border-radius:50%;transform:rotate(-9deg);box-shadow:0 0 22px rgba(0,215,255,.35)}.cin-orbit .orbit-ring{position:absolute;width:150px;height:48px;right:120px;top:63px;border:1px solid rgba(92,234,255,.8);border-radius:50%;z-index:2}.cin-orbit .grid{position:absolute;width:350px;height:290px;right:-5px;top:110px;border-radius:50%;background:repeating-linear-gradient(0deg,transparent 0 20px,rgba(44,164,198,.16) 21px 22px),repeating-linear-gradient(90deg,transparent 0 32px,rgba(44,164,198,.13) 33px 34px);transform:perspective(350px) rotateX(42deg);z-index:1}
      .cin-notice{border:1px solid #18506a;background:#061b2a;color:#9cc2d3;padding:.8rem 1rem;border-radius:6px;font-size:.75rem;line-height:1.5}
      .cin-section{display:grid;gap:.75rem}.cin-section h2{font-size:1.15rem;letter-spacing:.08em;text-transform:uppercase;margin:.4rem 0;color:#e0f5ff}.cin-grid-5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.65rem}.cin-card{position:relative;min-width:0;border:1px solid #12394d;border-radius:9px;background:linear-gradient(145deg,rgba(8,31,46,.98),rgba(3,16,27,.98));padding:1rem;overflow:hidden}.cin-card:before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,#11dfff,#8b65ff)}.cin-card h3{font-size:.73rem;text-transform:uppercase;letter-spacing:.04em;color:#d9f3ff;margin:0 0 .65rem}.cin-card p{font-size:.72rem;color:#89afc3;line-height:1.5;margin:0}.cin-number{font-size:1.8rem;font-weight:800;color:#f0fbff;display:block;margin:.4rem 0}.cin-bar{height:4px;background:#12364a;border-radius:9px;overflow:hidden;margin:1rem 0 .4rem}.cin-bar span{display:block;height:100%;background:linear-gradient(90deg,#12dfff,#4d8cff)}
      .cin-bottom{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:.75rem}.cin-list{display:grid;gap:.15rem}.cin-list a{padding:.7rem 0;border-bottom:1px solid rgba(35,101,127,.35);color:#75eaff;text-decoration:none;font-size:.75rem}.cin-list a:last-child{border-bottom:0}.cin-list small{display:block;color:#6d93a8;margin-top:.2rem}.cin-explore{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.65rem}.cin-explore a{text-align:center;text-decoration:none;color:#bfe5f4;border:1px solid #12394d;border-radius:8px;padding:1rem .5rem;background:#061725;font-size:.72rem}.cin-explore a:hover{border-color:#22dfff;background:#092333}.cin-explore span{display:block;color:#20dfff;font-size:1.1rem;margin-bottom:.45rem}
      @media(max-width:1000px){.cin-hero{grid-template-columns:1fr}.cin-orbit{position:absolute;right:0;top:80px;width:45%;opacity:.55}.cin-copy{padding:2.4rem}.cin-grid-5{grid-template-columns:repeat(2,minmax(0,1fr))}.cin-bottom{grid-template-columns:1fr}.cin-explore{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:560px){.cin-copy{padding:2rem 1.1rem}.cin-copy h1{font-size:3.2rem}.cin-orbit{display:none}.cin-grid-5,.cin-explore{grid-template-columns:1fr}.cin-actions a{width:100%;justify-content:center}}
    `;
    document.head.appendChild(style);
  }

  function rebuiltOverview() {
    const c = computeCoverageSummary();
    const meters = METERS.map((m) => {
      const records = recordsFor({ meter: m.id });
      const real = records.filter((r) => !r.isDemo).length;
      return `<article class="cin-card"><h3>${escapeHtml(m.name)}</h3><span class="cin-number">${real}</span><p>${escapeHtml(m.description)}</p><div class="cin-bar"><span style="width:${Math.min(100, real * 20)}%"></span></div><p>${real ? 'Verified records loaded' : 'Awaiting verified public data'}</p></article>`;
    }).join('');
    const stats = [[c.catalogMetrics,'Metrics catalogued'],[c.realRecords,'Verified records'],[c.demoRecords,'Demo records'],[c.countries,'Countries'],[c.sectors,'Sectors']].map(([n,l]) => `<article class="cin-card"><h3>${l}</h3><span class="cin-number">${n}</span><p>Public-data coverage</p></article>`).join('');
    const explore = [['#/continents','◉','Continents'],['#/countries','✦','Countries'],['#/sectors','▦','Sectors'],['#/usecases','◇','AI use cases'],['#/sources','▤','Sources'],['#/methodology','○','Methodology']].map(([h,i,l]) => `<a href="${h}"><span>${i}</span>${l}</a>`).join('');
    const research = (STATE.feeds || []).slice(0,6).map((item) => `<a href="${escapeHtml(item.url || '#')}" target="_blank" rel="noopener">${escapeHtml(item.title || 'Research update')}<small>${escapeHtml(item.source || item.publisher || 'Public feed')}</small></a>`).join('') || '<p>No research feed items are available.</p>';
    const activity = ['ChatGPT weekly active users','Organizations reporting regular AI use','Global data centre electricity consumption','Global investment in data centres','Global corporate AI investment','AI research output at leading AI/ML conferences'].map((x) => `<a href="#/sources">${x} ↗</a>`).join('');
    return `<div class="overview-rebuild">
      <section class="cin-hero"><div class="cin-copy"><div class="cin-kicker">Public AI intelligence dashboard</div><h1>GLOBAL <span>AI</span><br/>METER</h1><p class="lede">One planet. Real insights. Measurable progress.<br/>Explore the world's AI activity, adoption, infrastructure, investment and impact — all in one place.</p><div class="cin-actions"><a href="#/continents">Explore the data →</a><a href="#/methodology">Learn more</a></div></div><div class="cin-orbit" aria-hidden="true"><div class="orbit-ring"></div><div class="grid"></div></div></section>
      <div class="cin-notice"><strong>Data transparency notice:</strong> this dashboard uses public sources and connected feeds. Not all metrics are real-time. Every value is labelled Reported, Calculated, Estimated, or Unavailable.</div>
      <section class="cin-section"><h2>AI intelligence meters</h2><div class="cin-grid-5">${meters}</div></section>
      <section class="cin-section"><h2>Global snapshot</h2><div class="cin-grid-5">${stats}</div></section>
      <section class="cin-bottom"><section class="cin-card cin-section"><h2>AI adoption meter</h2><p>Verified record coverage by meter</p><div class="cin-list">${METERS.map(m => `<a href="#/methodology">${escapeHtml(m.name)} <small>${recordsFor({meter:m.id}).filter(r=>!r.isDemo).length} verified records</small></a>`).join('')}</div></section><section class="cin-card cin-section"><h2>Global AI activity</h2><p>Source-backed public signals</p><div class="cin-list">${activity}</div></section><section class="cin-card cin-section"><h2>AI systems ranking</h2><p>Registry coverage, not performance ranking</p><div class="cin-list">${METERS.map((m,i)=>`<a href="#/methodology">${i+1}. ${escapeHtml(m.name)} <small>${recordsFor({meter:m.id}).filter(r=>!r.isDemo).length} records</small></a>`).join('')}</div></section></section>
      <section class="cin-bottom"><section class="cin-card cin-section"><h2>Regional AI signals</h2><p>Directory coverage by region</p><div class="cin-grid-5" style="grid-template-columns:repeat(2,minmax(0,1fr))">${['Africa','Asia','Europe','North America','South America','Oceania'].map(x=>`<div class="cin-card"><h3>${x}</h3><p>Directory coverage</p></div>`).join('')}</div></section><section class="cin-card cin-section"><h2>Latest AI research and developments</h2><p>Live public feed area</p><div class="cin-list">${research}</div></section></section>
      <section class="cin-section"><h2>Quick explore</h2><div class="cin-explore">${explore}</div></section>
      <section class="cin-card"><h2 style="margin:0;color:#dff8ff;font-size:1rem">Global monitoring console <span style="float:right;color:#36ef8a;font-size:.75rem">● Dashboard services operational</span></h2><p style="margin-top:.4rem">Public-data pipeline status · source-traceable metrics · transparent coverage</p></section>
    </div>`;
  }

  function activate() {
    if (typeof computeCoverageSummary !== 'function' || typeof routes === 'undefined') return false;
    injectStyles();
    routes.overview = rebuiltOverview;
    if (typeof STATE !== 'undefined' && STATE.loaded && (!location.hash || location.hash === '#/' || location.hash === '#/overview')) router();
    return true;
  }
  let tries = 0;
  const timer = setInterval(() => { tries += 1; if (activate() || tries > 100) clearInterval(timer); }, 100);
})();
