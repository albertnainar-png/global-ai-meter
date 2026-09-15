(() => {
  const $ = (s) => document.querySelector(s);
  const state = {questions:[], answers:[], index:0, done:false};
  const labels = ['Never / Not at all','Rarely','Sometimes','Often','Consistently / Strongly'];
  const dimensions = [
    ['adoption','AI Adoption'],['workflow','Workflow Integration'],['measurement','Value Measurement'],['responsible','Responsible AI & Skills']
  ];
  const band = s => s < 25 ? ['Starting point','Begin with one practical use case and make access easy.'] : s < 50 ? ['Exploring','Move from individual experimentation to repeatable team workflows.'] : s < 75 ? ['Building momentum','Connect adoption to measurable outcomes and stronger operating habits.'] : ['Value-focused','Scale what works while continuing to measure and govern it responsibly.'];
  const render = () => {
    const app = $('#avm-app');
    if(!state.done){
      const q = state.questions[state.index];
      app.innerHTML = `<div class="avm-meta"><span>Question ${state.index+1} of ${state.questions.length}</span><span>${Math.round(state.index/state.questions.length*100)}% complete</span></div><div class="avm-progress"><div style="width:${state.index/state.questions.length*100}%"></div></div><div class="avm-eyebrow">${dimensions.find(d=>d[0]===q.dimension)[1]}</div><h2 class="avm-question">${q.text}</h2><div class="avm-options">${labels.map((l,i)=>`<button class="avm-option" data-value="${i}"><strong>${l}</strong><span>Score ${i} of 4</span></button>`).join('')}</div><div class="avm-actions"><button class="avm-btn secondary" id="avm-back" ${state.index===0?'disabled':''}>Back</button></div>`;
      app.querySelectorAll('[data-value]').forEach(b=>b.addEventListener('click',()=>{state.answers[state.index]=Number(b.dataset.value);state.index++;if(state.index===state.questions.length)state.done=true;render();}));
      $('#avm-back').addEventListener('click',()=>{if(state.index>0){state.index--;render();}});
    } else renderResults(app);
  };
  const renderResults = app => {
    const scores = Object.fromEntries(dimensions.map(([id])=>[id,0]));
    state.questions.forEach((q,i)=>scores[q.dimension]+=state.answers[i]||0);
    const overall=Math.round(state.answers.reduce((a,b)=>a+b,0)/48*100);const [title,advice]=band(overall);const lowest=dimensions.slice().sort((a,b)=>scores[a[0]]-scores[b[0]])[0];
    const post=`I just completed the AI Value Meter — a practical self-assessment of how AI is being adopted, integrated, measured, and used responsibly.\n\nMy score: ${overall}/100\nMy next focus: ${lowest[1]}\n\nThe lesson: AI value is not only about using more tools. It is about turning adoption into better workflows, measurable outcomes, and responsible capability.\n\nExplore it: ${location.href}`;
    app.innerHTML=`<div class="avm-eyebrow">Your AI Value Meter result</div><div class="avm-result-score">${overall}<span style="font-size:.3em;letter-spacing:0">/100</span></div><h2 class="avm-h1" style="font-size:clamp(2rem,5vw,3.4rem)">${title}</h2><p class="avm-lede">${advice}</p><div class="avm-grid">${dimensions.map(([id,name])=>{const n=Math.round(scores[id]/12*100);return `<div class="avm-dim"><h3>${name}</h3><p class="avm-muted">${n}/100</p><div class="avm-bar"><div style="width:${n}%"></div></div></div>`}).join('')}</div><h3>Your next practical move</h3><p>${lowest[1]} is your lowest-scoring dimension. Start with one small, observable improvement and measure it before scaling.</p><h3>LinkedIn draft</h3><div class="avm-post">${post}</div><div class="avm-actions"><button class="avm-btn" id="copy-post">Copy LinkedIn draft</button><button class="avm-btn secondary" id="restart">Retake assessment</button></div><p class="avm-foot">This is an independent self-assessment, not a validated benchmark, certification, or official organizational assessment. No answers are sent to a server.</p>`;
    $('#copy-post').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(post);$('#copy-post').textContent='Copied';}catch(e){$('#copy-post').textContent='Select and copy the draft';}});
    $('#restart').addEventListener('click',()=>{state.answers=[];state.index=0;state.done=false;render();});
  };
  fetch('data/ai-value-questions.json').then(r=>r.json()).then(d=>{state.questions=d.questions;render();}).catch(()=>{$('#avm-app').innerHTML='<p>Unable to load the assessment questions. Please refresh and try again.</p>';});
})();
