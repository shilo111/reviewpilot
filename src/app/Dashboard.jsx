"use client";
import { useState, useEffect, useMemo } from "react";

const PLAN_LIMITS = {
  "Basic":    { keywords:3,  replies:50,  instagram:false, report:false, analytics:false },
  "Pro":      { keywords:20, replies:999, instagram:true,  report:true,  analytics:true  },
  "Business": { keywords:99, replies:999, instagram:true,  report:true,  analytics:true  },
};

const INITIAL_REVIEWS = [
  { id:"g1", author:"דנה כהן",    rating:5, text:"שירות מעולה! הצוות מקצועי ואדיב.", date:"2h ago", replied:false },
  { id:"g2", author:"יוסי לוי",   rating:2, text:"המתנה ארוכה מדי.",                  date:"1d ago", replied:false },
  { id:"g3", author:"מיכל א.",    rating:4, text:"מקום נחמד, קצת יקר.",               date:"3d ago", replied:true, reply:"תודה מיכל! מחכים לביקור הבא." },
  { id:"g4", author:"רחל גולן",   rating:1, text:"מאכזב מאוד.",                        date:"4d ago", replied:false },
  { id:"g5", author:"אבי שמש",    rating:5, text:"הטוב ביותר באזור!",                  date:"1w ago", replied:true, reply:"תודה אבי. לקוחות כמוך הם הסיבה שאנחנו כאן." },
];

const INITIAL_IG = [
  { id:"i1", user:"dana_cohen", text:"כמה עולה?",        time:"1h ago", replied:false, post:"New menu item" },
  { id:"i2", user:"yossi_k",   text:"נראה מדהים!",      time:"2h ago", replied:false, post:"New menu item" },
  { id:"i3", user:"rachel_g",  text:"יש חנייה בסביבה?", time:"1d ago", replied:true,  reply:"כן, יש חנייה חינמית ממול.", post:"Good morning" },
];

const INITIAL_KEYWORDS = [
  { id:1, keywords:["מחיר","כמה עולה"], response:"המחירים מתחילים מ-80 שקל. לתור: 050-0000000" },
  { id:2, keywords:["כתובת","איפה"],    response:"הרצל 5, תל אביב. ניווט דרך וייז." },
  { id:3, keywords:["שעות","פתוח"],     response:"א-ה 9:00-19:00, שישי עד 14:00." },
];

const INITIAL_TEMPLATES = [
  { id:1, name:"Positive",  text:"תודה רבה על הביקורת. שמחים לשמוע ומחכים לראותך שוב." },
  { id:2, name:"Negative",  text:"אנו מצטערים על החוויה. נשמח לתקן — צרו קשר ישירות." },
  { id:3, name:"Neutral",   text:"תודה על המשוב. נקח לתשומת לב ונמשיך לשפר." },
];

// ── persistence hook ──
function usePersist(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

function matchKeywords(text, rules) {
  const norm = text.toLowerCase();
  for (const r of rules) for (const kw of r.keywords) if (norm.includes(kw.toLowerCase())) return r.response;
  return null;
}

async function generateAI(text, context, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:150, messages:[{ role:"user", content:`אתה מנהל עסק. ${context}\nתגובה: "${text}"\nכתוב תגובה קצרה בעברית עד 2 משפטים. רק התגובה.` }] })
    });
    return (await res.json()).content?.[0]?.text?.trim();
  } catch { return null; }
}

function getDefault(text) {
  return ["גרוע","נורא","מאכזב","בזבוז"].some(w=>text.includes(w))
    ? "תודה על המשוב. נשמח לתקן — אנא צרו קשר." : "תודה רבה. מחכים לראותך שוב.";
}

function exportCSV(reviews) {
  const rows = reviews.map(r => `"${r.author||r.user}","${r.rating||""}","${r.text}","${r.date||r.time}","${r.replied?"Yes":"No"}","${r.reply||""}"`);
  const blob = new Blob(["\uFEFFName,Rating,Review,Date,Replied,Reply\n"+rows.join("\n")], {type:"text/csv;charset=utf-8;"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "reviews.csv"; a.click();
}

// ── Star Rating ──
const Stars = ({ n }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(i => <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:i<=n?"#F59E0B":"#E5E7EB" }}/>)}
  </div>
);

// ── Status badge ──
const Status = ({ ok }) => (
  <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:ok?"#ECFDF5":"#FEF3C7", color:ok?"#15803d":"#D97706", border:`1px solid ${ok?"#BBF7D0":"#FDE68A"}` }}>
    {ok ? "Replied" : "Pending"}
  </span>
);

// ── Nav icon ──
const Icon = ({ type, color="#9CA3AF" }) => {
  const s = { stroke:color, strokeWidth:"1.5", fill:"none", strokeLinecap:"round", strokeLinejoin:"round" };
  const icons = {
    reviews:   <svg width="15" height="15" viewBox="0 0 15 15" {...s}><path d="M13 9.5a1.5 1.5 0 01-1.5 1.5H4L1.5 13.5V2.5a1.5 1.5 0 011.5-1.5h8A1.5 1.5 0 0113 2.5v7z"/></svg>,
    keywords:  <svg width="15" height="15" viewBox="0 0 15 15" {...s}><circle cx="6" cy="6" r="4.5"/><path d="M13.5 13.5l-3-3"/></svg>,
    templates: <svg width="15" height="15" viewBox="0 0 15 15" {...s}><rect x="1.5" y="1.5" width="12" height="12" rx="1.5"/><path d="M4.5 5.5h6M4.5 8.5h4"/></svg>,
    analytics: <svg width="15" height="15" viewBox="0 0 15 15" {...s}><path d="M1.5 11.5l4-4 3 3 5-6"/></svg>,
    settings:  <svg width="15" height="15" viewBox="0 0 15 15" {...s}><circle cx="7.5" cy="7.5" r="2"/><path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M3 3l1.5 1.5M10.5 10.5L12 12M3 12l1.5-1.5M10.5 4.5L12 3"/></svg>,
    logout:    <svg width="15" height="15" viewBox="0 0 15 15" {...s}><path d="M5.5 13H3a1 1 0 01-1-1V3a1 1 0 011-1h2.5M10 10.5L13 7.5 10 4.5M13 7.5H5.5"/></svg>,
  };
  return icons[type] || null;
};

export default function Dashboard({ user, onLogout, isNew = false }) {
  const plan = user?.plan || "Basic";
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS["Basic"];

  const [page, setPage] = useState("reviews");
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [tab, setTab] = useState("google");
  const [googleReviews, setGoogleReviews] = usePersist("rp_google", INITIAL_REVIEWS);
  const [igComments,    setIgComments]    = usePersist("rp_ig",     INITIAL_IG);
  const [keywords,      setKeywords]      = usePersist("rp_kw",     INITIAL_KEYWORDS);
  const [templates,     setTemplates]     = usePersist("rp_tpl",    INITIAL_TEMPLATES);
  const [apiKey,        setApiKey]        = usePersist("rp_key",    "");
  const [reportEmail,   setReportEmail]   = usePersist("rp_email",  "");

  const [selected,  setSelected]  = useState(null);
  const [reply,     setReply]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState(0);
  const [newKws,    setNewKws]    = useState("");
  const [newResp,   setNewResp]   = useState("");
  const [newTName,  setNewTName]  = useState("");
  const [newTText,  setNewTText]  = useState("");
  const [saved,     setSaved]     = useState("");

  const rawItems = tab === "google" ? googleReviews : igComments;
  const items = useMemo(() => {
    let f = rawItems;
    if (search) f = f.filter(r => (r.author||r.user||"").includes(search) || r.text.includes(search));
    if (filter > 0) f = f.filter(r => r.rating === filter);
    return f;
  }, [rawItems, search, filter]);

  const pending  = [...googleReviews,...igComments].filter(r=>!r.replied).length;
  const gReplied = googleReviews.filter(r=>r.replied).length;
  const iReplied = igComments.filter(r=>r.replied).length;
  const ratings  = googleReviews.map(r=>r.rating);
  const avg      = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : "—";
  const dist     = [5,4,3,2,1].map(s=>({stars:s, count:ratings.filter(r=>r===s).length}));

  const closePanel = () => { setSelected(null); setReply(""); };

  const generate = async (item) => {
    setSelected(item); setLoading(true); setReply("");
    const kw = matchKeywords(item.text, keywords);
    if (kw) { setReply(kw); setLoading(false); return; }
    const ctx = tab==="google" ? `Google review rating ${item.rating}/5.` : `Instagram comment on: "${item.post}"`;
    const ai = await generateAI(item.text, ctx, apiKey);
    setReply(ai || getDefault(item.text));
    setLoading(false);
  };

  const quickSend = (item) => {
    const r = matchKeywords(item.text, keywords) || getDefault(item.text);
    (tab==="google" ? setGoogleReviews : setIgComments)(prev => prev.map(x => x.id===item.id ? {...x, replied:true, reply:r} : x));
  };

  const publish = (id) => {
    (tab==="google" ? setGoogleReviews : setIgComments)(prev => prev.map(x => x.id===id ? {...x, replied:true, reply} : x));
    closePanel();
  };

  const saveToast = (msg) => { setSaved(msg); setTimeout(() => setSaved(""), 2500); };

  // ── Styles ──
  const S = {
    card: { background:"white", border:"1px solid #E5E7EB", borderRadius:10 },
    input: { width:"100%", padding:"9px 12px", borderRadius:7, border:"1.5px solid #E5E7EB", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit", color:"#111827", background:"white" },
    btn: { padding:"9px 18px", borderRadius:7, border:"none", background:"#16a34a", color:"white", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit" },
    btnGhost: { padding:"9px 14px", borderRadius:7, border:"1px solid #E5E7EB", background:"white", color:"#6B7280", cursor:"pointer", fontSize:13, fontFamily:"inherit" },
  };

  const navItems = [
    { id:"reviews",   label:"Reviews",   badge:pending },
    { id:"keywords",  label:"Keywords",  badge:null },
    { id:"templates", label:"Templates", badge:null },
    { id:"analytics", label:"Analytics", badge:null, locked:!limits.analytics },
    { id:"settings",  label:"Settings",  badge:null },
  ];

  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F9FAFB", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#111827", display:"flex" }}>

      {/* Toast */}
      {saved && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#111827", color:"white", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:500, zIndex:200, boxShadow:"0 4px 16px rgba(0,0,0,0.15)" }}>
          {saved}
        </div>
      )}

      {/* Panel backdrop */}
      {selected && <div onClick={closePanel} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:80 }}/>}

      {/* Edit drawer */}
      {selected && (
        <div style={{ position:"fixed", top:0, right:0, width:420, height:"100vh", background:"white", borderLeft:"1px solid #E5E7EB", zIndex:90, overflowY:"auto", padding:24, boxSizing:"border-box", display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:700, fontSize:15 }}>Edit reply</span>
            <button onClick={closePanel} style={{ background:"none", border:"1px solid #E5E7EB", cursor:"pointer", color:"#6B7280", width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✕</button>
          </div>

          <div style={{ ...S.card, padding:"12px 14px", background:"#F9FAFB" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontWeight:600, fontSize:13 }}>{selected.author||"@"+selected.user}</span>
              {selected.rating && <Stars n={selected.rating}/>}
            </div>
            <p style={{ margin:0, fontSize:13, color:"#6B7280", lineHeight:1.6 }}>{selected.text}</p>
          </div>

          <div>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:7, letterSpacing:"0.05em" }}>QUICK TEMPLATES</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {templates.map(t => (
                <button key={t.id} onClick={() => setReply(t.text)} style={{ ...S.btnGhost, padding:"4px 10px", fontSize:12 }}>{t.name}</button>
              ))}
            </div>
          </div>

          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, letterSpacing:"0.05em" }}>{loading ? "GENERATING..." : "REPLY"}</div>
            <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={5} disabled={loading}
              style={{ ...S.input, lineHeight:1.6, resize:"vertical" }}/>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => generate(selected)} style={{ ...S.btnGhost, flex:1 }}>Regenerate</button>
            <button onClick={() => publish(selected.id)} disabled={!reply||loading}
              style={{ ...S.btn, flex:2, opacity:reply&&!loading?1:0.4, cursor:reply&&!loading?"pointer":"not-allowed" }}>
              Publish reply
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width:220, background:"white", borderLeft:"1px solid #E5E7EB", flexShrink:0, display:"flex", flexDirection:"column", padding:"16px 0", position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"0 16px 24px", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:6, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><path d="M6 1L7.5 4.5 11.5 5 8.9 7.5 9.6 11.5 6 9.6 2.4 11.5 3.1 7.5.5 5 4.5 4.5 6 1Z"/></svg>
          </div>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"-0.3px" }}>ReviewPilot</span>
        </div>

        <div style={{ flex:1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 16px", border:"none", cursor:"pointer", width:"100%", textAlign:"right", background:page===item.id?"#F0FDF4":"transparent", color:page===item.id?"#15803d":"#6B7280", borderRight:page===item.id?"2px solid #16a34a":"2px solid transparent", fontSize:13, fontWeight:page===item.id?600:400, transition:"all 0.1s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <Icon type={item.id} color={page===item.id?"#16a34a":"#9CA3AF"}/>
                <span>{item.label}</span>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                {item.locked && <span style={{ fontSize:10, color:"#9CA3AF", background:"#F3F4F6", padding:"1px 6px", borderRadius:4 }}>Pro</span>}
                {item.badge > 0 && <span style={{ background:"#DC2626", color:"white", borderRadius:10, padding:"0 5px", fontSize:10, fontWeight:700, lineHeight:"16px" }}>{item.badge}</span>}
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding:"14px 16px", borderTop:"1px solid #F3F4F6" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"#ECFDF5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#16a34a", flexShrink:0 }}>
              {(user?.name||"U")[0].toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name||"User"}</div>
              <div style={{ fontSize:11, color:"#9CA3AF" }}>{plan} plan</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ background:"none", border:"none", color:"#9CA3AF", cursor:"pointer", fontSize:12, padding:0, display:"flex", alignItems:"center", gap:5 }}>
            <Icon type="logout" color="#9CA3AF"/>
            Sign out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, overflow:"auto", minWidth:0 }}>
        <div style={{ background:"white", borderBottom:"1px solid #E5E7EB", padding:"14px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:40 }}>
          <div>
            <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>
              {{"reviews":"Reviews","keywords":"Keyword Rules","templates":"Response Templates","analytics":"Analytics","settings":"Settings"}[page]}
            </h2>
            <p style={{ margin:0, fontSize:12, color:"#9CA3AF", marginTop:1 }}>
              {page==="reviews"   && `${pending} pending · ${googleReviews.length+igComments.length} total`}
              {page==="keywords"  && `${keywords.length} of ${limits.keywords} rules`}
              {page==="templates" && `${templates.length} saved`}
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#16a34a" }}/>
            <span style={{ fontSize:12, color:"#9CA3AF" }}>Connected</span>
          </div>
        </div>

        <div style={{ padding:28, maxWidth:1000 }}>

          {/* ── REVIEWS ── */}
          {page==="reviews" && (
            <div>
              {isNew && !welcomeDismissed && (
                <div style={{ background:"linear-gradient(135deg,#16a34a,#15803d)", borderRadius:12, padding:"20px 24px", marginBottom:20, color:"white", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>ברוך הבא ל-ReviewPilot, {user?.name || "משתמש"} 👋</div>
                    <div style={{ fontSize:13, opacity:0.85, lineHeight:1.6 }}>
                      הגדר את מפתח ה-API שלך בהגדרות כדי להפעיל תגובות AI · חבר את חשבון Google Business · הוסף מילות מפתח לתגובות אוטומטיות
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                    <button onClick={() => setPage("settings")} style={{ padding:"8px 16px", borderRadius:7, border:"none", background:"white", color:"#16a34a", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"inherit" }}>הגדרות</button>
                    <button onClick={() => setWelcomeDismissed(true)} style={{ padding:"8px 12px", borderRadius:7, border:"1px solid rgba(255,255,255,0.4)", background:"transparent", color:"white", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>סגור</button>
                  </div>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
                {[
                  { label:"Pending", value:pending, sub:"need reply", color:"#D97706" },
                  { label:"Avg rating", value:avg, sub:"out of 5", color:"#111827" },
                  { label:"Google", value:`${gReplied}/${googleReviews.length}`, sub:"replied", color:"#111827" },
                  { label:"Instagram", value:`${iReplied}/${igComments.length}`, sub:"replied", color:"#111827" },
                ].map((s,i) => (
                  <div key={i} style={{ ...S.card, padding:"14px 16px" }}>
                    <div style={{ fontSize:22, fontWeight:700, color:s.color, letterSpacing:"-0.5px" }}>{s.value}</div>
                    <div style={{ fontSize:12, color:"#374151", marginTop:2 }}>{s.label}</div>
                    <div style={{ fontSize:11, color:"#9CA3AF", marginTop:1 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
                <div style={{ display:"flex", gap:1, background:"#F3F4F6", borderRadius:7, padding:3 }}>
                  {[{id:"google",label:"Google",p:googleReviews.filter(r=>!r.replied).length},{id:"instagram",label:"Instagram",p:igComments.filter(r=>!r.replied).length,locked:!limits.instagram}].map(t=>(
                    <button key={t.id} onClick={()=>{if(t.locked)return;setTab(t.id);setSearch("");setFilter(0);}} style={{ padding:"6px 14px", borderRadius:5, border:"none", cursor:t.locked?"not-allowed":"pointer", fontSize:12, fontWeight:500, background:tab===t.id?"white":"transparent", color:tab===t.id?"#111827":"#6B7280", opacity:t.locked?0.4:1, display:"flex", alignItems:"center", gap:5, boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
                      {t.label}
                      {t.p>0&&<span style={{background:"#DC2626",color:"white",borderRadius:8,padding:"0 5px",fontSize:10,fontWeight:600}}>{t.p}</span>}
                    </button>
                  ))}
                </div>

                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reviews..." style={{...S.input,width:190}}/>

                <div style={{ display:"flex", gap:1, background:"#F3F4F6", borderRadius:7, padding:3 }}>
                  {[0,5,4,3,2,1].map(r=>(
                    <button key={r} onClick={()=>setFilter(r===filter?0:r)} style={{ padding:"6px 9px", borderRadius:5, border:"none", cursor:"pointer", fontSize:11, background:filter===r?"white":"transparent", color:filter===r?"#111827":"#6B7280", boxShadow:filter===r?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
                      {r===0?"All":`${r}★`}
                    </button>
                  ))}
                </div>

                <button onClick={()=>exportCSV(rawItems)} style={{...S.btnGhost,fontSize:12}}>Export CSV</button>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {items.length===0 && <div style={{...S.card,padding:"40px",textAlign:"center",color:"#9CA3AF",fontSize:14}}>No results found</div>}
                {items.map(item=>(
                  <div key={item.id} style={{ ...S.card, padding:"14px 16px", cursor:item.replied?"default":"pointer", border:`1px solid ${selected?.id===item.id?"#16a34a":"#E5E7EB"}`, transition:"border-color 0.1s" }}
                    onClick={()=>!item.replied&&generate(item)}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:30, height:30, borderRadius:"50%", background:"#ECFDF5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#16a34a", flexShrink:0 }}>
                          {(item.author||item.user||"?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13 }}>{item.author||"@"+item.user}</div>
                          <div style={{ fontSize:11, color:"#9CA3AF", marginTop:1 }}>{item.date||item.time}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {item.rating && <Stars n={item.rating}/>}
                        <Status ok={item.replied}/>
                      </div>
                    </div>
                    <p style={{ margin:"0 0 9px 40px", fontSize:13, color:"#6B7280", lineHeight:1.6 }}>{item.text}</p>
                    {item.replied && (
                      <div style={{ marginRight:40, background:"#F0FDF4", borderRight:"2px solid #86EFAC", padding:"7px 12px", borderRadius:"0 6px 6px 0", fontSize:12, color:"#15803d", lineHeight:1.6 }}>
                        <div style={{ fontSize:9, fontWeight:700, marginBottom:2, letterSpacing:"0.06em", color:"#16a34a" }}>YOUR REPLY</div>
                        {item.reply}
                      </div>
                    )}
                    {!item.replied && (
                      <div style={{ display:"flex", gap:7, marginRight:40 }}>
                        <button onClick={e=>{e.stopPropagation();generate(item);}} style={{...S.btnGhost,padding:"5px 13px",fontSize:12}}>Edit reply</button>
                        <button onClick={e=>{e.stopPropagation();quickSend(item);}} style={{...S.btn,padding:"5px 13px",fontSize:12}}>Quick send</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── KEYWORDS ── */}
          {page==="keywords" && (
            <div style={{ maxWidth:640 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                <p style={{ margin:0, fontSize:13, color:"#6B7280" }}>Auto-reply when these keywords are detected in reviews</p>
                <span style={{ fontSize:12, color:keywords.length>=limits.keywords?"#DC2626":"#9CA3AF" }}>{keywords.length}/{limits.keywords}</span>
              </div>
              {keywords.map(rule=>(
                <div key={rule.id} style={{ ...S.card, padding:"13px 15px", marginBottom:7 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {rule.keywords.map(kw=><span key={kw} style={{ padding:"2px 9px", borderRadius:4, background:"#ECFDF5", border:"1px solid #BBF7D0", color:"#15803d", fontSize:12, fontWeight:500 }}>{kw}</span>)}
                    </div>
                    <button onClick={()=>{setKeywords(p=>p.filter(r=>r.id!==rule.id));saveToast("Rule deleted");}} style={{ background:"none", border:"none", cursor:"pointer", color:"#D1D5DB", fontSize:18, lineHeight:1, padding:"0 2px" }}>×</button>
                  </div>
                  <div style={{ background:"#F9FAFB", borderRight:"2px solid #86EFAC", padding:"6px 10px", borderRadius:"0 5px 5px 0", fontSize:12, color:"#6B7280", lineHeight:1.6 }}>{rule.response}</div>
                </div>
              ))}
              {keywords.length < limits.keywords ? (
                <div style={{ ...S.card, padding:"16px", border:"1.5px dashed #E5E7EB", marginTop:12 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:10 }}>Add keyword rule</div>
                  <input value={newKws} onChange={e=>setNewKws(e.target.value)} placeholder="Keywords separated by comma: מחיר, כמה עולה" style={{...S.input,marginBottom:7}}/>
                  <textarea value={newResp} onChange={e=>setNewResp(e.target.value)} placeholder="Automatic response text..." rows={2} style={{...S.input,resize:"vertical",marginBottom:9}}/>
                  <button onClick={()=>{if(!newKws||!newResp)return;setKeywords(p=>[...p,{id:Date.now(),keywords:newKws.split(",").map(k=>k.trim()),response:newResp}]);setNewKws("");setNewResp("");saveToast("Rule saved");}} style={S.btn}>Add rule</button>
                </div>
              ):(
                <div style={{...S.card,padding:"14px",marginTop:12,textAlign:"center",background:"#FEF2F2",border:"1px solid #FECACA"}}>
                  <span style={{fontSize:13,color:"#DC2626"}}>Limit reached for {plan} plan. </span>
                  <span style={{fontSize:13,color:"#16a34a",fontWeight:600,cursor:"pointer"}}>Upgrade to Pro</span>
                </div>
              )}
            </div>
          )}

          {/* ── TEMPLATES ── */}
          {page==="templates" && (
            <div style={{ maxWidth:640 }}>
              <p style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>Templates appear in the reply editor for quick insertion</p>
              {templates.map(t=>(
                <div key={t.id} style={{ ...S.card, padding:"13px 15px", marginBottom:7 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontWeight:600, fontSize:13 }}>{t.name}</span>
                    <button onClick={()=>{setTemplates(p=>p.filter(r=>r.id!==t.id));saveToast("Template deleted");}} style={{ background:"none", border:"none", cursor:"pointer", color:"#D1D5DB", fontSize:18, lineHeight:1, padding:"0 2px" }}>×</button>
                  </div>
                  <p style={{ margin:0, fontSize:13, color:"#6B7280", lineHeight:1.6 }}>{t.text}</p>
                </div>
              ))}
              <div style={{ ...S.card, padding:"16px", border:"1.5px dashed #E5E7EB", marginTop:12 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:10 }}>New template</div>
                <input value={newTName} onChange={e=>setNewTName(e.target.value)} placeholder="Template name" style={{...S.input,marginBottom:7}}/>
                <textarea value={newTText} onChange={e=>setNewTText(e.target.value)} placeholder="Response text..." rows={2} style={{...S.input,resize:"vertical",marginBottom:9}}/>
                <button onClick={()=>{if(!newTName||!newTText)return;setTemplates(p=>[...p,{id:Date.now(),name:newTName,text:newTText}]);setNewTName("");setNewTText("");saveToast("Template saved");}} style={S.btn}>Save template</button>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {page==="analytics" && (
            !limits.analytics ? (
              <div style={{ ...S.card, padding:"48px", textAlign:"center", maxWidth:440 }}>
                <div style={{ fontSize:36, marginBottom:12 }}>📊</div>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Analytics</div>
                <div style={{ fontSize:14, color:"#6B7280", marginBottom:20 }}>Available on Pro plan and above</div>
                <button style={{ ...S.btn }}>Upgrade to Pro</button>
              </div>
            ) : (
              <div style={{ maxWidth:620 }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
                  {[
                    { label:"Avg rating", value:avg },
                    { label:"Total reviews", value:googleReviews.length },
                    { label:"Reply rate", value:`${googleReviews.length?Math.round(gReplied/googleReviews.length*100):0}%` },
                  ].map((s,i)=>(
                    <div key={i} style={{ ...S.card, padding:"16px" }}>
                      <div style={{ fontSize:26, fontWeight:700, letterSpacing:"-0.5px" }}>{s.value}</div>
                      <div style={{ fontSize:12, color:"#9CA3AF", marginTop:3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...S.card, padding:"16px 18px", marginBottom:10 }}>
                  <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:12, letterSpacing:"0.05em" }}>RATING DISTRIBUTION</div>
                  {dist.map(d=>(
                    <div key={d.stars} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                      <span style={{ fontSize:11, color:"#F59E0B", width:18, flexShrink:0 }}>{d.stars}★</span>
                      <div style={{ flex:1, background:"#F3F4F6", borderRadius:2, height:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", background:d.stars>=4?"#16a34a":d.stars===3?"#F59E0B":"#EF4444", width:`${googleReviews.length?(d.count/googleReviews.length)*100:0}%`, transition:"width 0.5s" }}/>
                      </div>
                      <span style={{ fontSize:11, color:"#9CA3AF", width:14, textAlign:"center" }}>{d.count}</span>
                    </div>
                  ))}
                </div>
                <div style={{ ...S.card, padding:"16px 18px" }}>
                  <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, marginBottom:12, letterSpacing:"0.05em" }}>SENTIMENT</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                    {[
                      { label:"Positive", count:googleReviews.filter(r=>r.rating>=4).length, bg:"#F0FDF4", color:"#16a34a" },
                      { label:"Neutral",  count:googleReviews.filter(r=>r.rating===3).length, bg:"#FFFBEB", color:"#D97706" },
                      { label:"Negative", count:googleReviews.filter(r=>r.rating<=2).length, bg:"#FEF2F2", color:"#DC2626" },
                    ].map((s,i)=>(
                      <div key={i} style={{ background:s.bg, borderRadius:8, padding:"14px", textAlign:"center", border:"1px solid #E5E7EB" }}>
                        <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.count}</div>
                        <div style={{ fontSize:11, color:"#6B7280", marginTop:3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}

          {/* ── SETTINGS ── */}
          {page==="settings" && (
            <div style={{ maxWidth:500, display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ ...S.card, padding:"20px" }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Claude API Key</div>
                <div style={{ fontSize:13, color:"#6B7280", marginBottom:12 }}>Required for AI-generated replies · console.anthropic.com</div>
                <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-..." type="password" style={S.input}/>
                {apiKey && <div style={{ fontSize:12, color:"#16a34a", marginTop:8, display:"flex", alignItems:"center", gap:5 }}><div style={{width:6,height:6,borderRadius:"50%",background:"#16a34a"}}/> Active</div>}
              </div>

              <div style={{ ...S.card, padding:"20px", opacity:limits.report?1:0.55 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>Weekly email report</div>
                  {!limits.report && <span style={{ fontSize:11, padding:"1px 8px", borderRadius:4, background:"#F3F4F6", color:"#6B7280", fontWeight:600 }}>Pro only</span>}
                </div>
                <div style={{ fontSize:13, color:"#6B7280", marginBottom:12 }}>Weekly summary of reviews that need attention</div>
                <input value={reportEmail} onChange={e=>setReportEmail(e.target.value)} placeholder="your@email.com" disabled={!limits.report} style={{...S.input,opacity:limits.report?1:0.5}}/>
                <button onClick={()=>{if(!limits.report||!reportEmail)return;saveToast("Email saved");}} disabled={!limits.report||!reportEmail}
                  style={{...S.btn,marginTop:10,opacity:limits.report&&reportEmail?1:0.4,cursor:limits.report&&reportEmail?"pointer":"not-allowed"}}>
                  Save
                </button>
              </div>

              <div style={{ ...S.card, padding:"20px" }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Current plan</div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, paddingBottom:12, borderBottom:"1px solid #F3F4F6" }}>
                  <div>
                    <span style={{ fontWeight:600, fontSize:15 }}>{plan}</span>
                    <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>Billed monthly</div>
                  </div>
                  <span style={{ fontSize:20, fontWeight:700 }}>₪{user?.planPrice||79}<span style={{ fontSize:13, fontWeight:400, color:"#9CA3AF" }}>/mo</span></span>
                </div>
                {[
                  { label:"Monthly replies", value:limits.replies===999?"Unlimited":`${limits.replies}` },
                  { label:"Keyword rules",   value:limits.keywords===99?"Unlimited":`${limits.keywords}` },
                  { label:"Instagram",       value:limits.instagram?"Included":"Not included" },
                  { label:"Email report",    value:limits.report?"Included":"Not included" },
                  { label:"Analytics",       value:limits.analytics?"Included":"Not included" },
                ].map(r=>(
                  <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #F9FAFB", fontSize:13 }}>
                    <span style={{ color:"#6B7280" }}>{r.label}</span>
                    <span style={{ fontWeight:500, color:r.value==="Included"?"#16a34a":r.value==="Not included"?"#9CA3AF":"#374151" }}>{r.value}</span>
                  </div>
                ))}
                {plan!=="Business" && <button style={{...S.btn,width:"100%",marginTop:14}}>Upgrade plan</button>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
