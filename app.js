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
$("#mission-list").innerHTML=missions.length?missions.slice().reverse().map(m=>`<div class="mission"><div><strong>${escapeHTML(m.text)}</strong><small>${escapeHTML(m.dept)} · ${escapeHTML(m.priority)} priority · ${m.date}</small></div><select onchange="updateMission('${m.id}',this.value)"><option ${m.status==="Queued"?"selected":""}>Queued</option><option ${m.status==="In review"?"selected":""}>In review</option><option ${m.status==="Complete"?"selected":""}>Complete</option></select></div>`).join(""):'<div class="panel">No missions yet. Create your first mission above.</div>';
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
// Mission creation is handled by Supabase below.
$("#send-directive").addEventListener("click",()=>{let text=$("#directive").value.trim();if(!text){toast("Enter a directive first.");return}missions.push({id:Date.now(),text,dept:"Executive Office",priority:"High",status:"Queued",date:new Date().toLocaleDateString()});store.set("missions",missions);$("#directive").value="";render();toast("Directive saved as a mission. No AI execution yet.");});
$("#save-lesson").addEventListener("click",()=>{let text=$("#lesson").value.trim();if(!text){toast("Enter an outcome or lesson first.");return}lessons.push({id:Date.now(),text,result:$("#lesson-result").value,date:new Date().toLocaleDateString()});store.set("lessons",lessons);$("#lesson").value="";render();toast("Learning record saved on this device.");});
$$(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
function showPage(p){$$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===p));$$(".page").forEach(x=>x.classList.toggle("active",x.id==="page-"+p));let names={overview:"Command Overview",intelligence:"Intelligence Lab",ventures:"Business Portfolio",workforce:"AI Workforce",missions:"Operations & Missions",finance:"Financial Command",approvals:"Founder Approvals",learning:"Learning Engine"};$("#page-title").textContent=names[p]||"Command Overview";window.scrollTo(0,0)}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
render();renderOpps();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
const TITAN_API_BASE = "https://titan-global-api.onrender.com";

async function checkTitanBackend() {
  const label = document.querySelector(".side-bottom span");
  const detail = document.querySelector(".side-bottom small");

  if (label) label.textContent = "CHECKING BACKEND...";

  try {
    const response = await fetch(TITAN_API_BASE + "/health");
    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    if (label) label.textContent = "BACKEND " + data.status.toUpperCase();
    if (detail) detail.textContent = "Render connected · AI not enabled";
  } catch {
    if (label) label.textContent = "BACKEND UNAVAILABLE";
    if (detail) detail.textContent = "Check Render connection";
  }
}

checkTitanBackend();
// TITAN GLOBAL — VISIBLE BACKEND STATUS
(() => {
  const badge = document.createElement("div");

  badge.textContent = "BACKEND: CHECKING...";
  Object.assign(badge.style, {
    position: "fixed",
    bottom: "20px",
    right: "15px",
    zIndex: "99999",
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#17243a",
    color: "#ffffff",
    border: "1px solid #4b9fff",
    fontSize: "12px",
    fontWeight: "bold",
    fontFamily: "monospace"
  });

  document.body.appendChild(badge);

  fetch("https://titan-global-api.onrender.com/health", {
    cache: "no-store"
  })
    .then(response => {
      if (!response.ok) throw new Error("API error");
      return response.json();
    })
    .then(data => {
      if (data.status !== "healthy") throw new Error("Unhealthy");

      badge.textContent = "BACKEND: CONNECTED | AI: OFF";
      badge.style.borderColor = "#35d49a";
      badge.style.color = "#35d49a";
    })
    .catch(() => {
      badge.textContent = "BACKEND: OFFLINE";
      badge.style.borderColor = "#ff6464";
      badge.style.color = "#ff6464";
    });
})();
// TITAN GLOBAL — LIVE AI DIRECTIVE CONNECTION
(() => {
  const button = document.querySelector("#send-directive");
  const input = document.querySelector("#directive");
  if (!button || !input) return;

  const newButton = button.cloneNode(true);
  button.replaceWith(newButton);

  const result = document.createElement("div");
  result.style.cssText =
    "margin-top:15px;padding:15px;background:#17243a;color:white;border:1px solid #4b9fff;border-radius:10px;white-space:pre-wrap;";

  newButton.after(result);

  newButton.addEventListener("click", async () => {
    const directive = input.value.trim();
    if (directive.length < 3) {
      toast("Enter a directive first.");
      return;
    }

    newButton.disabled = true;
    newButton.textContent = "AI ANALYSING...";
    result.textContent = "Connecting to TITAN AI...";

    try {
      const response = await fetch(
        "https://titan-global-api.onrender.com/directive",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ directive })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "AI request failed.");

      result.textContent = data.response;
      input.value = "";
      toast("TITAN AI response received.");
    } catch (error) {
      result.textContent = "ERROR: " + error.message;
      toast("AI connection failed.");
    } finally {
      newButton.disabled = false;
      newButton.textContent = "SUBMIT DIRECTIVE ↗";
    }
  });
})();
// TITAN GLOBAL — AUTOMATION ENGINE
(() => {
  const defaults = {
    riskGate: true,
    completionCapture: true,
    executiveBrief: true,
    queueMonitor: true
  };

  let rules = { ...defaults, ...store.get("automation_rules", {}) };
  let events = store.get("automation_events", []);
  let flagged = store.get("automation_flagged", []);

  const save = () => {
    store.set("automation_rules", rules);
    store.set("automation_events", events.slice(-80));
    store.set("automation_flagged", flagged);
  };

  const log = (message, type = "INFO") => {
    events.push({
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleString()
    });
    events = events.slice(-80);
    save();
    renderAutomation();
  };

  // Create the Automation Engine navigation button
  const sidebar = document.querySelector(".sidebar");
  const nav = document.createElement("button");
  nav.className = "nav";
  nav.dataset.page = "automation";
  nav.innerHTML = "⟳ <span>Automation Engine</span>";
  sidebar.insertBefore(nav, document.querySelector(".side-bottom"));

  // Create the Automation Engine page
  const page = document.createElement("section");
  page.className = "page";
  page.id = "page-automation";

  page.innerHTML = `
    <div class="intro">
      <div class="eyebrow gold">RULES / TRIGGERS / GOVERNED EXECUTION</div>
      <h2>Automation <em>Engine</em></h2>
      <p>Local workflows controlled by the Founder. No paid AI calls or external actions.</p>
    </div>

    <div class="metrics">
      <div class="metric"><small>ACTIVE RULES</small><strong id="auto-active">04</strong><span>Enabled rules</span></div>
      <div class="metric"><small>PENDING APPROVALS</small><strong id="auto-approvals">00</strong><span>Founder decisions</span></div>
      <div class="metric"><small>QUEUED MISSIONS</small><strong id="auto-queued">00</strong><span>Awaiting work</span></div>
      <div class="metric"><small>AUTOMATION EVENTS</small><strong id="auto-events">00</strong><span>Local activity</span></div>
    </div>

    <div class="panel">
      <div class="panel-head"><h4>Automation controls</h4><span class="pill">FOUNDER CONTROL</span></div>
      <p class="fine">Rules run while the app is open. They do not run in the background after it is closed.</p>
      <div id="automation-rules"></div>
      <button class="primary full" id="run-automation">RUN AUTOMATION CYCLE ↗</button>
    </div>

    <div class="panel">
      <div class="panel-head"><h4>Automation activity</h4><button class="text-btn" id="clear-automation-log">CLEAR LOG</button></div>
      <div id="automation-log"></div>
    </div>

    <div class="panel">
      <div class="panel-head"><h4>Safety boundaries</h4><span class="pill">ALWAYS ON</span></div>
      <div class="governance">
        <div><b>Human approval</b><span>Payments, contracts, investments and acquisitions require Founder approval.</span></div>
        <div><b>Local storage</b><span>Workflow data stays in this browser on this device.</span></div>
        <div><b>No background execution</b><span>Automation runs while the app is open.</span></div>
        <div><b>No external actions</b><span>No purchases, transfers or third-party changes.</span></div>
      </div>
    </div>
  `;

  document.querySelector(".main footer").before(page);

  // Navigation
  nav.addEventListener("click", () => {
    showPage("automation");
    document.querySelector("#page-title").textContent = "Automation Engine";
    renderAutomation();
  });

  // Styling
  const style = document.createElement("style");
  style.textContent = `
    #automation-rules { display:grid; gap:10px; margin:15px 0; }
    .automation-rule {
      display:flex; justify-content:space-between; align-items:center;
      gap:12px; padding:14px; border:1px solid var(--line);
      border-radius:8px; background:#0d1726;
    }
    .automation-rule strong,.automation-rule small { display:block; }
    .automation-rule strong { font-size:12px; }
    .automation-rule small { font-size:10px; color:var(--muted); margin-top:5px; line-height:1.5; }
    .rule-toggle {
      min-width:55px; border:1px solid #58677a; border-radius:20px;
      padding:8px; background:#202b3b; color:white;
    }
    .rule-toggle.enabled { background:#123a31; border-color:#287c60; color:#54d6a3; }
    .automation-event {
      padding:12px 0; border-top:1px solid var(--line);
      font-size:11px; line-height:1.5;
    }
    .automation-event small { display:block; color:var(--muted); margin-bottom:4px; }
  `;
  document.head.appendChild(style);

  function renderAutomation() {
    const count = id => document.getElementById(id);

    count("auto-active").textContent =
      Object.values(rules).filter(Boolean).length;

    count("auto-approvals").textContent =
      approvals.filter(a => a.status === "Pending").length;

    count("auto-queued").textContent =
      missions.filter(m => m.status === "Queued").length;

    count("auto-events").textContent = events.length;

    const items = [
      ["riskGate", "Founder approval gate", "Flags missions involving payments, contracts, investments or acquisitions."],
      ["completionCapture", "Completion learning capture", "Records completed missions in the Learning Engine."],
      ["executiveBrief", "Executive briefing", "Summarises pending approvals and queued work."],
      ["queueMonitor", "Mission queue monitor", "Flags high-priority missions awaiting attention."]
    ];

    count("automation-rules").innerHTML = items.map(([key, title, description]) => `
      <div class="automation-rule">
        <div><strong>${title}</strong><small>${description}</small></div>
        <button class="rule-toggle ${rules[key] ? "enabled" : ""}" data-rule="${key}">
          ${rules[key] ? "ON" : "OFF"}
        </button>
      </div>
    `).join("");

    count("automation-log").innerHTML = events.length
      ? events.slice().reverse().map(e => `
          <div class="automation-event">
            <small>${escapeHTML(e.time)} · ${escapeHTML(e.type)}</small>
            ${escapeHTML(e.message)}
          </div>
        `).join("")
      : '<p class="fine">No events yet. Run an automation cycle.</p>';
  }

  function processMission(m) {
    if (!m) return;

    const risky = /\b(payment|transfer|purchase|invest|investment|contract|sign|incorporat|acquisition|acquire|loan|borrow|hire|fire)\b/i.test(m.text);

    if (rules.riskGate && risky) {
      const exists = approvals.some(a => a.sourceMissionId === m.id);

      if (!exists) {
        approvals.push({
          id: Date.now(),
          sourceMissionId: m.id,
          title: "Automated safety review",
          detail: "Founder review required before any external action: " + m.text,
          type: "Automation safety gate",
          status: "Pending"
        });

        store.set("approvals", approvals);
        render();
        log("Founder approval created for a sensitive mission.", "APPROVAL");
      }
    }

    if (rules.queueMonitor && m.priority === "High" && m.status === "Queued" && !flagged.includes(m.id)) {
      flagged.push(m.id);
      save();
      log("High-priority mission needs attention: " + m.text, "ATTENTION");
    }
  }

  // Monitor newly created missions
  document.querySelector("#create-mission").addEventListener("click", () => {
    setTimeout(() => {
      const latest = missions[missions.length - 1];
      if (latest) processMission(latest);
    }, 0);
  });

  // Monitor mission completion
  const originalUpdate = window.updateMission;

  if (typeof originalUpdate === "function") {
    window.updateMission = function(id, status) {
      const previous = missions.find(m => m.id === id);
      originalUpdate(id, status);

      if (status === "Complete" && previous && previous.status !== "Complete" && rules.completionCapture) {
        if (!lessons.some(l => l.sourceMissionId === id)) {
          const completed = missions.find(m => m.id === id);
          lessons.push({
            id: Date.now(),
            sourceMissionId: id,
            text: "Mission completed: " + completed.text,
            result: "mixed",
            date: new Date().toLocaleDateString()
          });

          store.set("lessons", lessons);
          render();
          log("Completed mission added to Learning Engine.", "LEARNING");
        }
      }

      renderAutomation();
    };
  }

  // Run a cycle
  document.querySelector("#run-automation").addEventListener("click", () => {
    missions.filter(m => m.status === "Queued").forEach(processMission);

    const pending = approvals.filter(a => a.status === "Pending").length;
    const queued = missions.filter(m => m.status === "Queued").length;

    log("Cycle complete: " + pending + " pending approvals and " + queued + " queued missions. No external actions taken.", "CYCLE");
  });

  // Toggle rules
  document.querySelector("#automation-rules").addEventListener("click", e => {
    const button = e.target.closest("[data-rule]");
    if (!button) return;

    const key = button.dataset.rule;
    rules[key] = !rules[key];
    save();
    renderAutomation();
    log("Rule " + key + " changed to " + (rules[key] ? "ON" : "OFF"));
  });

  // Clear activity
  document.querySelector("#clear-automation-log").addEventListener("click", () => {
    events = [];
    save();
    renderAutomation();
    log("Activity log cleared by Founder.");
  });

  // Daily briefing
  const today = new Date().toLocaleDateString();

  if (rules.executiveBrief && store.get("automation_last_brief", "") !== today) {
    store.set("automation_last_brief", today);
    log(
      "Daily brief: " +
      approvals.filter(a => a.status === "Pending").length +
      " pending approvals; " +
      missions.filter(m => m.status === "Queued").length +
      " queued missions.",
      "BRIEF"
    );
  }

  renderAutomation();
  console.log("TITAN GLOBAL Automation Engine loaded.");
})();

// Remove completed missions from the active attention queue
window.updateMission = ((original) => function(id, status) {
  original(id, status);

  if (status === "Complete") {
    const remaining = store.get("automation_flagged", [])
      .filter(missionId => missionId !== id);

    store.set("automation_flagged", remaining);
  }
})(window.updateMission);
// TITAN GLOBAL — FOUNDER LOGIN
(async function () {
  const client = window.supabase.createClient(
    "https://uyphbnnfgultvslgmcjn.supabase.co",
    "sb_publishable_cQHdVhypL-B7IbkK_mXcEw_XHzAlKd7"
  );

  window.titanSupabase = client;

  const style = document.createElement("style");
  style.textContent = `
    #titan-login {
      position:fixed; inset:0; z-index:999999;
      background:#080d18; display:grid; place-items:center;
      padding:24px; color:white;
    }
    #titan-login section {
      width:100%; max-width:400px; padding:25px;
      background:#101827; border:1px solid #315070;
      border-radius:14px;
    }
    #titan-login h2 {color:#e9bd70}
    #titan-login input {
      box-sizing:border-box; width:100%; padding:14px;
      margin:8px 0; background:#080d18; color:white;
      border:1px solid #315070; border-radius:6px;
    }
    #titan-login button {
      width:100%; padding:14px; margin-top:12px;
      background:#286ca7; color:white; border:0;
      border-radius:6px;
    }
    #titan-login p {color:#ff9999;font-size:12px}
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "titan-login";
  panel.innerHTML = `
    <section>
      <h2>TITAN GLOBAL</h2>
      <p style="color:#9baac0">FOUNDER SECURE ACCESS</p>
      <form id="titan-form">
        <input id="titan-email" type="email"
          placeholder="Email address" required>
        <input id="titan-password" type="password"
          placeholder="Password (minimum 8 characters)"
          minlength="8" required>
        <input id="titan-name" type="text"
          placeholder="Founder name (for new account)"
          style="display:none">
        <button id="titan-submit">SIGN IN</button>
      </form>
      <button id="titan-toggle">CREATE FOUNDER ACCOUNT</button>
      <p id="titan-message"></p>
    </section>
  `;
  document.body.appendChild(panel);

  let signup = false;
  const message = document.querySelector("#titan-message");
  const toggle = document.querySelector("#titan-toggle");
  const name = document.querySelector("#titan-name");
  const submit = document.querySelector("#titan-submit");

  toggle.onclick = () => {
    signup = !signup;
    name.style.display = signup ? "block" : "none";
    name.required = signup;
    submit.textContent = signup ? "CREATE ACCOUNT" : "SIGN IN";
    toggle.textContent = signup ? "BACK TO SIGN IN" : "CREATE FOUNDER ACCOUNT";
    message.textContent = "";
  };

  async function enterWorkspace(user) {
    const { data, error } = await client
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1);

    if (error) throw error;

    if (!data.length) {
      const { error: createError } = await client
        .from("companies")
        .insert({
          name: "TITAN GLOBAL",
          industry: "Holding company",
          status: "planning"
        });

      if (createError) throw createError;
    }

    window.titanUser = user;
    panel.remove();
    toast("Founder authenticated.");
  }

  document.querySelector("#titan-form").onsubmit = async event => {
    event.preventDefault();
    submit.disabled = true;
    message.textContent = "PLEASE WAIT...";

    const email = document.querySelector("#titan-email").value.trim();
    const password = document.querySelector("#titan-password").value;

    try {
      if (signup) {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.value.trim()
            }
          }
        });

        if (error) throw error;

        if (!data.session) {
          message.textContent =
            "Account created. Check your email to confirm, then sign in.";
          return;
        }

        await enterWorkspace(data.user);
      } else {
        const { data, error } =
          await client.auth.signInWithPassword({ email, password });

        if (error) throw error;
        await enterWorkspace(data.user);
      }
    } catch (error) {
      message.textContent = error.message;
    } finally {
      submit.disabled = false;
      submit.textContent = signup ? "CREATE ACCOUNT" : "SIGN IN";
    }
  };

  const { data, error } = await client.auth.getSession();

  if (error) {
    message.textContent = error.message;
    return;
  }

  if (data.session) {
    try {
      await enterWorkspace(data.session.user);
    } catch (error) {
      message.textContent = error.message;
    }
  }
})();
// TITAN GLOBAL — SUPABASE MISSION SYNC
(async function () {
  const db = window.titanSupabase;
  if (!db) return;

  let companyId = null;

  async function loadMissions(session) {
    if (!session) return;

    const { data: companies, error: companyError } = await db
      .from("companies")
      .select("id")
      .eq("owner_id", session.user.id)
      .limit(1);

    if (companyError) throw companyError;
    if (!companies.length) throw new Error("Company not found.");

    companyId = companies[0].id;

    const { data, error } = await db
      .from("missions")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at");

    if (error) throw error;

    missions = data.map(m => ({
      id: m.id,
      text: m.title,
      dept: m.department,
      priority: m.priority,
      status: m.status,
      date: new Date(m.created_at).toLocaleDateString()
    }));

    store.set("missions", missions);
    render();
  }

  db.auth.onAuthStateChange((event, session) => {
    if (session) {
      setTimeout(() => loadMissions(session).catch(console.error), 0);
    }
  });

  document.querySelector("#create-mission").addEventListener("click", () => {
    setTimeout(async () => {
      const mission = missions[missions.length - 1];
      if (!mission || !companyId || typeof mission.id !== "number") return;

      try {
        const { data, error } = await db
          .from("missions")
          .insert({
            company_id: companyId,
            title: mission.text,
            department: mission.dept,
            priority: mission.priority,
            status: mission.status,
            created_by: window.titanUser.id
          })
          .select()
          .single();

        if (error) throw error;

        mission.id = data.id;
        store.set("missions", missions);
        render();
        toast("Mission saved to Supabase.");
      } catch (error) {
        console.error(error);
        toast("Database save failed: " + error.message);
      }
    }, 100);
  });

    window.updateMission = async function (id, status) {
    try {
      const { error } = await db
        .from("missions")
        .update({ status })
        .eq("id", id)
        .eq("company_id", companyId);

      if (error) throw error;

      missions = missions.map(m =>
        m.id === id ? { ...m, status } : m
      );

      store.set("missions", missions);
      render();
      toast("Mission status saved to Supabase.");
    } catch (error) {
      console.error(error);
      toast("Status save failed: " + error.message);
    }
  };

  const { data } = await db.auth.getSession();
  if (data.session) {
    try {
      await loadMissions(data.session);
      toast("Mission database connected.");
    } catch (error) {
      console.error(error);
      toast("Mission sync error: " + error.message);
    }
  }
})();
// TITAN GLOBAL — FORCE DATABASE MISSION CREATION
document.addEventListener("click", async function(event) {
  const button = event.target.closest("#create-mission");
  if (!button) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const db = window.titanSupabase;
  const user = window.titanUser;
  const input = document.querySelector("#mission-input");
  const text = input.value.trim();

  if (!text) {
    toast("Describe the mission first.");
    return;
  }

  if (!db || !user) {
    toast("Founder session not ready. Sign in again.");
    return;
  }

  button.disabled = true;

  try {
    const { data: companies, error: companyError } = await db
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1);

    if (companyError) throw companyError;
    if (!companies.length) throw new Error("Company not found.");

    const { data, error } = await db
      .from("missions")
      .insert({
        company_id: companies[0].id,
        title: text,
        department: document.querySelector("#mission-dept").value,
        priority: document.querySelector("#mission-priority").value,
        status: "Queued",
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;

    missions.push({
      id: data.id,
      text: data.title,
      dept: data.department,
      priority: data.priority,
      status: data.status,
      date: new Date(data.created_at).toLocaleDateString()
    });

    store.set("missions", missions);
    input.value = "";
    render();
    toast("Mission saved to Supabase.");
  } catch (error) {
    console.error(error);
    toast("Database save failed: " + error.message);
  } finally {
    button.disabled = false;
  }
}, true);
