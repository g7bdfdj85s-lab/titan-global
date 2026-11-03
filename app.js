const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem("titan_"+k))??d}catch{return d}},set(k,v){localStorage.setItem("titan_"+k,JSON.stringify(v))}};
let missions=store.get("missions",[]), approvals=store.get("approvals",[
{id:1,title:"Approve first venture discovery sprint",detail:"Authorize a research-only sprint. No spending or incorporation.",type:"Strategic research",status:"Pending"},
{id:2,title:"Approve AI workforce architecture",detail:"Approve the role structure and permission model before connecting agents.",type:"Governance",status:"Pending"}]);
let lessons=store.get("lessons",[]), opportunities=store.get("opportunities",[]);
const agents=[["♜","AI Director / CEO","Coordinates approved strategy, departments and reporting."],["⌕","Chief Intelligence Officer","Researches markets, competitors, signals and opportunities."],["◉","Chief Financial Officer","Models budgets, unit economics, cash flow and risk."],["⚙","Chief Technology Officer","Owns platform architecture, integrations and security."],["♟","Chief Operating Officer","Coordinates workflows, delivery and performance."],["✦","Chief Growth Officer","Plans acquisition, sales, retention and partnerships."],["✎","Creative Director","Leads brand, design, content and creative production."],["✓","Risk & Compliance Officer","Checks legal, safety, privacy and operational constraints."]];
const ventures=[["TITAN Media","Marketing & Media","Concept / not launched"],["TITAN Automation","Automation & AI","Concept / not launched"],["TITAN Digital","Software & Digital Products","Concept / not launched"],["TITAN Commerce","E-commerce & Brands","Concept / not launched"],["TITAN Ventures","Research & Investments","Parent investment function"]];
function toast(t){let el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2500)}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
$("#agents").innerHTML=agents.map(a=>`<div class="agent-card"><div class="role-icon">${a[0]}</div><h4>${a[1]}</h4><p>${a[2]}</p><small>ROLE TEMPLATE · NOT RUNNING</small></div>`).join("");
$("#portfolio").innerHTML=ventures.map(v=>`<div class="venture"><div class="sector">${v[1].toUpperCase()}</div><h4>${v[0]}</h4><p>Independent business unit under TITAN GLOBAL. Operational status: planning placeholder.</p><span class="state">${v[2].toUpperCase()}</span></div>`).join("");
$("#m-agents").textContent=String(agents.length).padStart(2,"0");
$("#approval-count").textContent=approvals.filter(a=>a.status==="Pending").length;
$("#m-approvals").textContent=String(approvals.filter(a=>a.status==="Pending").length).padStart(2,"0");
$("#approval-list").innerHTML=approvals.length?approvals.map(a=>`<div class="approval"><div><strong>${escapeHTML(a.title)}</strong><small>${escapeHTML(a.detail)} · ${escapeHTML(a.type)}</small><small>STATUS: ${a.status.toUpperCase()}</small></div>${a.status==="Pending"?`<div><button class="secondary" onclick="decide(${a.id},'Approved')">APPROVE</button><button class="secondary" onclick="decide(${a.id},'Rejected')">REJECT</button></div>`:""}</div>`).join(""):'<div class="panel">No pending approvals.</div>';
$("#mission-list").innerHTML=missions.length?missions.slice().reverse().map(m=>`<div class="mission"><div><strong>${escapeHTML(m.text)}</strong><small>${escapeHTML(m.dept)} · ${escapeHTML(m.priority)} priority · ${m.date}</small></div><select onchange="updateMission(${m.id},this.value)"><option ${m.status==="Queued"?"selected":""}>Queued</option><option ${m.status==="In review"?"selected":""}>In review</option><option ${m.status==="Complete"?"selected":""}>Complete</option></select></div>`).join(""):'<div class="panel">No missions yet. Create your first mission above.</div>';
$("#lesson-list").innerHTML=lessons.length?lessons.slice().reverse().map(l=>`<div class="lesson"><div><strong>${escapeHTML(l.text)}</strong><small>${escapeHTML(l.result)} · ${l.date}</small></div><span class="pill">RECORDED</span></div>`).join(""):'<div class="panel">No learning records yet. Record outcomes to build a decision history.</div>';
$("#lesson-count").textContent=`${lessons.length} RECORDS`;
$("#activity-list").innerHTML=[...missions.slice(-2).map(m=>({time:m.date,msg:"Mission created: "+m.text})),...lessons.slice(-2).map(l=>({time:l.date,msg:"Learning record added: "+l.text}))].slice(-4).reverse().map(x=>`<div class="activity-row"><span>${x.time}</span><div>${escapeHTML(x.msg)}</div></div>`).join("")||'<div class="activity-row"><span>READY</span><div>Command centre initialized. Add a directive to begin.</div></div>';
$("#m-opps").textContent=String(opportunities.length||12).padStart(2,"0");
}
function decide(id,status){approvals=approvals.map(a=>a.id===id?{...a,status}:a);store.set("approvals",approvals);render();toast(`Decision recorded: ${status}.`)}
function updateMission(id,status){missions=missions.map(m=>m.id===id?{...m,status}:m);store.set("missions",missions);render()}
function scoreOpportunity(name,sector,capital,market,risk,learned){
 let base=sector==="Technology & AI"?82:sector==="Media & marketing"?78:sector==="Commerce & retail"?73:sector==="Education"?70:sector==="Energy"?65:68;
 let capitalAdj=capital<1000?4:capital<10000?2:capital<50000?-4:-10;
 let riskAdj=risk==="aggressive"?5:risk==="conservative"?-2:0;
 let feedback=learned.positive*1.5-learned.negative*2;
 return Math.max(35,Math.min(94,Math.round(base+capitalAdj+riskAdj+feedback)));
}
function renderOpps(){
 $("#opportunity-list").innerHTML=opportunities.map((o,i)=>`<div class="opportunity"><div class="opp-top"><div><h4>${escapeHTML(o.name)}</h4><p>${escapeHTML(o.description)}</p></div><div class="score">${o.score}<small>DEMO SCORE</small></div></div><div class="opp-meta"><span class="chip">${escapeHTML(o.sector)}</span><span class="chip">${escapeHTML(o.market)}</span><span class="chip">Est. capital: €${Number(o.capital).toLocaleString()}</span><span class="chip">Risk: ${escapeHTML(o.risk)}</span></div><div class="opp-actions"><button class="secondary" onclick="proposeOpp(${i})">SEND FOR FOUNDER REVIEW</button><button class="secondary" onclick="recordSignal(${i},'positive')">+ POSITIVE SIGNAL</button><button class="secondary" onclick="recordSignal(${i},'negative')">− NEGATIVE SIGNAL</button></div></div>`).join("")||'<div class="panel">Run a scan to generate opportunity concepts.</div>';
}
const concepts=[
["Vertical AI workflow service","Technology & AI","Automate a narrow, repetitive workflow for a clearly defined business niche.","Validate one customer problem and willingness to pay before building."],
["Specialist B2B lead generation","Media & marketing","Build a measurable customer-acquisition service for one industry.","Requires proof of lead quality, consent-aware outreach and customer economics."],
["Niche digital learning product","Education","Package specialist knowledge into a paid course or subscription.","Test demand with interviews and a small paid pilot."],
["Cross-border product microbrand","Commerce & retail","Launch a focused product brand with a small initial assortment.","Validate sourcing, margins, returns and customer acquisition costs."],
["Energy efficiency services","Energy","Help small businesses identify and implement energy savings.","Requires qualified technical partners and local regulatory review."],
["SME operations automation","Technology & AI","Integrate practical automations into small-business operations.","Start with one repeatable workflow and measure hours saved."]
];
$("#scan").addEventListener("click",()=>{
 const sector=$("#industry").value,market=$("#market").value,capital=Math.max(0,Number($("#capital").value||0)),risk=$("#risk").value;
 const filtered=concepts.filter(c=>sector==="Any industry"||c[1]===sector|| (sector==="Technology & AI"&&c[1]==="Technology & AI"));
 const learned={positive:lessons.filter(l=>l.result==="positive").length,negative:lessons.filter(l=>l.result==="negative").length};
 opportunities=filtered.map(c=>({name:c[0],sector:c[1],description:c[2]+" "+c[3],market,capital:Math.min(capital,5000),risk,score:scoreOpportunity(c[0],c[1],capital,market,risk,learned)})).sort((a,b)=>b.score-a.score);
 store.set("opportunities",opportunities);$("#scan-status").textContent=`${opportunities.length} CONCEPTS SCORED`;renderOpps();toast("Demo opportunity shortlist generated.");
});
window.proposeOpp=i=>{const o=opportunities[i];approvals.push({id:Date.now(),title:"Review venture: "+o.name,detail:`${o.description} Demo score ${o.score}/100. Research and validation only; no funds committed.`,type:"New venture proposal",status:"Pending"});store.set("approvals",approvals);render();toast("Proposal sent to Founder Approvals.");};
window.recordSignal=(i,result)=>{const o=opportunities[i];lessons.push({id:Date.now(),text:`${result} signal for ${o.name}. Add verified evidence before relying on this signal.`,result,date:new Date().toLocaleDateString()});store.set("lessons",lessons);render();toast("Signal recorded in local learning history.");};
$("#propose-venture").addEventListener("click",()=>{let name=$("#venture-name").value.trim(),sector=$("#venture-sector").value.trim(),thesis=$("#venture-thesis").value.trim(),budget=$("#venture-budget").value;if(!name||!sector||!thesis){toast("Complete name, industry and thesis first.");return}approvals.push({id:Date.now(),title:"New venture: "+name,detail:`${sector}. ${thesis} Estimated capital: €${budget||"not specified"}.`,type:"New venture proposal",status:"Pending"});store.set("approvals",approvals);render();toast("New venture submitted for your approval.");});
$("#create-mission").addEventListener("click",()=>{let text=$("#mission-input").value.trim();if(!text){toast("Describe the mission first.");return}missions.push({id:Date.now(),text,dept:$("#mission-dept").value,priority:$("#mission-priority").value,status:"Queued",date:new Date().toLocaleDateString()});store.set("missions",missions);$("#mission-input").value="";render();toast("Mission added to local task board.");});
$("#send-directive").addEventListener("click",()=>{let text=$("#directive").value.trim();if(!text){toast("Enter a directive first.");return}missions.push({id:Date.now(),text,dept:"Executive Office",priority:"High",status:"Queued",date:new Date().toLocaleDateString()});store.set("missions",missions);$("#directive").value="";render();toast("Directive saved as a mission. No AI execution yet.");});
$("#save-lesson").addEventListener("click",()=>{let text=$("#lesson").value.trim();if(!text){toast("Enter an outcome or lesson first.");return}lessons.push({id:Date.now(),text,result:$("#lesson-result").value,date:new Date().toLocaleDateString()});store.set("lessons",lessons);$("#lesson").value="";render();toast("Learning record saved on this device.");});
$$(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
function showPage(p){$$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===p));$$(".page").forEach(x=>x.classList.toggle("active",x.id==="page-"+p));let names={overview:"Command Overview",intelligence:"Intelligence Lab",ventures:"Business Portfolio",workforce:"AI Workforce",missions:"Operations & Missions",finance:"Financial Command",approvals:"Founder Approvals",learning:"Learning Engine"};$("#page-title").textContent=names[p]||"Command Overview";window.scrollTo(0,0)}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
render();renderOpps();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
