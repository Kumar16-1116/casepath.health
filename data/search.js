(()=>{
  const data=window.CASEPATH_NHS_DATA;
  const status=document.getElementById('dataStatus');
  const area=document.getElementById('searchArea');
  const cancer=document.getElementById('cancerInput');
  const list=document.getElementById('cancerOptions');
  const age=document.getElementById('ageSelect');
  const stage=document.getElementById('stageSelect');
  const treatment=document.getElementById('treatmentSelect');
  const results=document.getElementById('results');
  const message=document.getElementById('message');
  const button=document.getElementById('showStats');
  if(!Array.isArray(data)||!data.length){status.textContent='The NHS data file could not be loaded. Open the complete CasePath folder so its data file is beside the page.';return;}
  status.textContent=`Ready: ${data.length.toLocaleString()} NHS age- and stage-group records.`;
  area.classList.remove('hidden');
  const cancers=[...new Set(data.map(x=>x.cancer))].sort((a,b)=>a.localeCompare(b));
  for(const name of cancers){const o=document.createElement('option');o.value=name;list.append(o);}
  cancer.value=cancers.includes('Colon and rectosigmoid junction')?'Colon and rectosigmoid junction':cancers[0];
  const order={'Under 50':0,'50-59':1,'60-69':2,'70-79':3,'80+':4,'Stage 1':1,'Stage 2':2,'Stage 3':3,'Stage 4':4,'Unknown Stage':5};
  function stageName(value){return ({'Stage 1':'Stage I','Stage 2':'Stage II','Stage 3':'Stage III','Stage 4':'Stage IV'})[value]||value;}
  function populate(select, breakdown, preferred){
    const old=select.value;
    const vals=[...new Set(data.filter(x=>x.cancer===cancer.value&&x.breakdown===breakdown).map(x=>x.level))].sort((a,b)=>(order[a]??99)-(order[b]??99)||a.localeCompare(b));
    select.replaceChildren();
    const empty=document.createElement('option');empty.value='';empty.textContent=breakdown==='Age at cancer diagnosis'?'Choose an age group':'Choose a cancer stage';select.append(empty);
    for(const val of vals){const o=document.createElement('option');o.value=val;o.textContent=breakdown==='Stage at cancer diagnosis'?stageName(val):val;select.append(o);}
    if(vals.includes(old))select.value=old;else if(vals.includes(preferred))select.value=preferred;
    return vals.length;
  }
  function refresh(defaults=false){
    const a=populate(age,'Age at cancer diagnosis',defaults?'50-59':'');
    const s=populate(stage,'Stage at cancer diagnosis',defaults?'Stage 4':'');
    button.disabled=!a&&!s;button.style.opacity=button.disabled?'.55':'1';
    results.classList.add('hidden');
    if(!a&&!s)message.textContent='No age or stage breakdown is published for this cancer type. Try another type.';else message.textContent='';
  }
  function findCancer(){
    const typed=cancer.value.trim().toLocaleLowerCase();if(!typed)return null;
    const exact=cancers.find(x=>x.toLocaleLowerCase()===typed);if(exact)return exact;
    const matches=cancers.filter(x=>x.toLocaleLowerCase().includes(typed));return matches.length===1?matches[0]:null;
  }
  cancer.addEventListener('input',()=>{results.classList.add('hidden');const exact=cancers.find(x=>x.toLocaleLowerCase()===cancer.value.trim().toLocaleLowerCase());if(exact)refresh(false);});
  cancer.addEventListener('change',()=>{const actual=findCancer();if(actual){cancer.value=actual;refresh(false);}else message.textContent='Choose a cancer type from the suggestions.';});
  refresh(true);
  function card(level,breakdown,group){
    const byAge=breakdown==='Age at cancer diagnosis';
    const label=byAge?level:stageName(level);
    const rows=data.filter(x=>x.cancer===cancer.value&&x.breakdown===breakdown&&x.level===level&&x.treatmentGroup===group);
    if(!rows.length)return `<div class="panel"><h3>${byAge?'Age group':'Cancer stage'}: ${label}</h3><p>No published figures were found for this selection. This does not mean the number is zero; the NHS may not publish this breakdown.</p></div>`;
    rows.sort((a,b)=>(b.percent??0)-(a.percent??0));
    const denominator=rows[0].diagnosed;
    const table=rows.map(x=>`<tr><td>${x.treatment}</td><td class="num">${x.treated.toLocaleString()}</td><td class="num">${x.percent.toFixed(1)}%</td><td class="num">${x.lower.toFixed(1)}–${x.upper.toFixed(1)}%</td></tr>`).join('');
    const bars=rows.map(x=>`<div class="bar-row"><div class="bar-name">${x.treatment}</div><div class="bar-track" role="img" aria-label="${x.percent.toFixed(1)} percent"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,x.percent))}%"></div></div><div class="bar-value">${x.percent.toFixed(1)}%</div></div>`).join('');
    const scope=byAge?'All stages in this age group':'All age groups in this stage';
    return `<div class="panel"><div class="result-top"><div><span class="badge">NHS England · 2013–2022</span><h3>${byAge?'Age group':'Cancer stage'}: ${label}</h3><p class="meta">${scope} · ${group==='Combined'?'Treatment combinations':'Individual treatment types'}</p></div><div><strong>${denominator.toLocaleString()}</strong><div class="small">tumour records in this group</div></div></div>${bars}<div class="table-wrap"><table class="table"><thead><tr><th>Treatment category</th><th class="num">Tumours recorded</th><th class="num">Share</th><th class="num">95% confidence range</th></tr></thead><tbody>${table}</tbody></table></div><p class="small">The confidence range shows statistical uncertainty. Counts refer to tumours, not necessarily unique people.</p>${group==='Independent'?'<p class="small"><strong>About this view:</strong> A tumour may be counted under more than one treatment type, so percentages may add up to more than 100%.</p>':'<p class="small"><strong>About this view:</strong> “Other care” may include other treatment, care outside the measured period, private treatment, or incomplete records.</p>'}<p class="small">Source: <a href="https://digital.nhs.uk/ndrs/data/data-outputs/cancer-data-hub/cancer-treatments" target="_blank" rel="noopener">NHS England National Disease Registration Service</a>. Dashboard updated 29 May 2025.</p></div>`;
  }
  button.addEventListener('click',()=>{
    const type=findCancer();
    if(!type){message.textContent='Choose a cancer type from the suggestions. If more than one matches, select the full category name.';results.classList.add('hidden');return;}
    if(cancer.value!==type){cancer.value=type;refresh(false);}
    const a=age.value,s=stage.value,group=treatment.value;
    if(!a&&!s){message.textContent='Select an age group, a cancer stage, or both.';results.classList.add('hidden');return;}
    const cards=[];if(a)cards.push(card(a,'Age at cancer diagnosis',group));if(s)cards.push(card(s,'Stage at cancer diagnosis',group));
    const note=a&&s?'<div class="notice"><strong>Two separate group comparisons</strong>The age result includes all stages in the selected age group. The stage result includes all age groups in the selected stage. These NHS data do not provide a combined age-and-stage figure.</div>':'';
    results.innerHTML=note+`<div class="stack">${cards.join('')}</div>`;results.classList.remove('hidden');message.textContent='Statistics are ready below.';
  });
})();