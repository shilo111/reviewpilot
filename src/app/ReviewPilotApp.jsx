"use client";
import { useState } from "react";

const PLAN_LIMITS = {
  "בסיסי":  { keywords: 3,  replies: 50,  instagram: false, report: false, analytics: false },
  "פרו":    { keywords: 20, replies: 999, instagram: true,  report: true,  analytics: true  },
  "עסקי":   { keywords: 99, replies: 999, instagram: true,  report: true,  analytics: true  },
};

const MOCK_GOOGLE = [
  { id:"g1", author:"דנה כהן",  rating:5, text:"שירות מעולה! הצוות מקצועי.", date:"לפני שעתיים", replied:false },
  { id:"g2", author:"יוסי לוי", rating:2, text:"המתנה ארוכה מדי.",            date:"לפני יום",    replied:false },
  { id:"g3", author:"מיכל א.",  rating:4, text:"מקום נחמד, קצת יקר.",         date:"לפני 3 ימים", replied:true, reply:"תודה מיכל! 😊" },
  { id:"g4", author:"רחל גולן", rating:1, text:"מאכזב מאוד.",                 date:"לפני 4 ימים", replied:false },
  { id:"g5", author:"אבי שמש",  rating:5, text:"הטוב ביותר באזור!",           date:"לפני שבוע",   replied:true, reply:"תודה אבי! ❤️" },
];

const MOCK_IG = [
  { id:"i1", user:"dana_cohen", text:"כמה עולה?",       time:"לפני שעה",    replied:false, post:"🍕 פיצה חדשה!" },
  { id:"i2", user:"yossi_k",   text:"נראה מדהים!! 😍", time:"לפני 2 שעות", replied:false, post:"🍕 פיצה חדשה!" },
  { id:"i3", user:"rachel_g",  text:"יש חנייה?",        time:"לפני יום",    replied:true,  reply:"כן! יש ממול 🚗", post:"☕ בוקר טוב" },
];

function matchKeywords(text, rules) {
  const norm = text.toLowerCase();
  for (const r of rules) {
    for (const kw of r.keywords) {
      if (norm.includes(kw.toLowerCase())) return r.response;
    }
  }
  return null;
}

async function generateAI(text, context, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:150,
        messages:[{role:"user", content:`אתה מנהל עסק. ${context}\nתגובה: "${text}"\nכתוב תגובה קצרה בעברית (עד 2 משפטים). רק התגובה.`}]
      })
    });
    const d = await res.json();
    return d.content?.[0]?.text?.trim();
  } catch { return null; }
}

function getDefault(text) {
  const neg = ["גרוע","נורא","מאכזב","בזבוז"];
  return neg.some(w=>text.includes(w)) ? "תודה על המשוב. נשמח לתקן - אנא צרו קשר." : "תודה רבה! מחכים לראותך שוב 😊";
}

const Stars = ({n}) => <span>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?"#F59E0B":"#D1D5DB",fontSize:13}}>{i<=n?"★":"☆"}</span>)}</span>;

const PlanBadge = ({plan}) => {
  const c = {"בסיסי":"#64748B","פרו":"#2D6A4F","עסקי":"#6366F1"}[plan]||"#64748B";
  return <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:`${c}20`,color:c,fontWeight:700,border:`1px solid ${c}40`}}>{plan}</span>;
};

const Locked = ({msg}) => (
  <div style={{textAlign:"center",padding:"40px 20px",color:"#94A3B8"}}>
    <div style={{fontSize:32,marginBottom:12}}>🔒</div>
    <div style={{fontWeight:700,marginBottom:6}}>תכונה זו לא זמינה בתוכנית שלך</div>
    <div style={{fontSize:13,marginBottom:16}}>{msg}</div>
    <button style={{padding:"8px 20px",borderRadius:8,border:"none",background:"#2D6A4F",color:"white",cursor:"pointer",fontSize:13,fontWeight:700}}>שדרג תוכנית ←</button>
  </div>
);

function LandingScreen({onStart}) {
  return (
    <div style={{minHeight:"100vh",background:"#0A0A0F",color:"#E2E8F0",fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",position:"relative"}}>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 50% 40% at 60% 30%,rgba(45,106,79,0.12) 0%,transparent 60%)",pointerEvents:"none"}}/>
      <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#2D6A4F,#40916C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:24}}>⭐</div>
      <h1 style={{fontSize:"clamp(32px,6vw,64px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",margin:"0 0 20px"}}>ביקורות שעונות<br/><span style={{color:"#40916C"}}>לבד.</span></h1>
      <p style={{fontSize:17,color:"#64748B",maxWidth:420,margin:"0 auto 40px",lineHeight:1.7}}>AI מייצר תגובות לביקורות גוגל ואינסטגרם. אתה רק מאשר.</p>
      <button onClick={onStart} style={{padding:"16px 36px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#2D6A4F,#40916C)",color:"white",cursor:"pointer",fontSize:16,fontWeight:800,boxShadow:"0 8px 32px rgba(45,106,79,0.35)"}}>התחל ניסיון חינם ←</button>
      <p style={{marginTop:12,fontSize:12,color:"#334155"}}>ללא כרטיס אשראי · ביטול בכל עת</p>
    </div>
  );
}

function PricingScreen({onSelect}) {
  const plans = [
    {name:"בסיסי",price:79,features:["50 תגובות/חודש","גוגל בלבד","3 מילות מפתח"],highlight:false},
    {name:"פרו",price:149,features:["ללא הגבלה","גוגל + אינסטגרם","20 מילות מפתח","דוח שבועי","אנליטיקס"],highlight:true},
    {name:"עסקי",price:299,features:["כמה סניפים","מילות מפתח ללא הגבלה","API גישה","מנהל אישי"],highlight:false},
  ];
  return (
    <div dir="rtl" style={{minHeight:"100vh",background:"#F8F7F4",fontFamily:"system-ui,sans-serif",padding:"40px 24px"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:32}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#2D6A4F,#40916C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⭐</div>
          <span style={{fontWeight:800,fontSize:17}}>ReviewPilot</span>
        </div>
        <h2 style={{fontSize:32,fontWeight:900,letterSpacing:"-1px",margin:"0 0 10px"}}>בחר תוכנית</h2>
        <p style={{color:"#666",fontSize:15}}>14 יום ניסיון חינם · ללא כרטיס אשראי</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,maxWidth:780,margin:"0 auto"}}>
        {plans.map((p,i)=>(
          <div key={i} style={{background:p.highlight?"#2D6A4F":"white",border:p.highlight?"none":"1.5px solid rgba(0,0,0,0.08)",borderRadius:18,padding:"28px 24px",color:p.highlight?"white":"#1a1a2e",transform:p.highlight?"scale(1.03)":"none",boxShadow:p.highlight?"0 16px 48px rgba(45,106,79,0.3)":"0 2px 12px rgba(0,0,0,0.05)",position:"relative"}}>
            {p.highlight&&<div style={{position:"absolute",top:-12,right:20,background:"#F59E0B",color:"white",fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:20}}>הכי פופולרי</div>}
            <div style={{fontSize:13,opacity:0.7,marginBottom:6}}>{p.name}</div>
            <div style={{fontSize:38,fontWeight:900,letterSpacing:"-2px",marginBottom:20}}>₪{p.price}<span style={{fontSize:13,fontWeight:400,opacity:0.6}}>/חודש</span></div>
            {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,fontSize:13}}><span style={{color:p.highlight?"#A7F3D0":"#2D6A4F",fontWeight:700}}>✓</span>{f}</div>)}
            <button onClick={()=>onSelect(p)} style={{width:"100%",marginTop:20,padding:"12px",borderRadius:10,border:"none",background:p.highlight?"white":"#2D6A4F",color:p.highlight?"#2D6A4F":"white",cursor:"pointer",fontSize:14,fontWeight:800}}>בחר {p.name} ←</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutScreen({plan,onSuccess}) {
  const [step,setStep]=useState("form");
  const [form,setForm]=useState({email:"",card:"",exp:"",cvv:""});
  const handlePay=async()=>{
    if(!form.email||!form.card)return;
    setStep("processing");
    await new Promise(r=>setTimeout(r,2000));
    setStep("success");
    setTimeout(onSuccess,1500);
  };
  if(step==="processing")return<div dir="rtl" style={{minHeight:"100vh",background:"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,fontFamily:"system-ui,sans-serif"}}><div style={{fontSize:40,animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</div><div style={{fontWeight:700}}>מעבד תשלום...</div><style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style></div>;
  if(step==="success")return<div dir="rtl" style={{minHeight:"100vh",background:"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,fontFamily:"system-ui,sans-serif"}}><div style={{fontSize:56}}>✅</div><div style={{fontWeight:900,fontSize:20}}>התשלום הצליח!</div></div>;
  return(
    <div dir="rtl" style={{minHeight:"100vh",background:"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"white",borderRadius:20,padding:36,maxWidth:400,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h3 style={{margin:0,fontWeight:900}}>תשלום מאובטח</h3>
          <div style={{fontSize:12,color:"#635BFF",fontWeight:700}}>🔒 Payplus</div>
        </div>
        <div style={{background:"#F8F7F4",borderRadius:12,padding:"14px 16px",marginBottom:24,display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontWeight:700,fontSize:14}}>ReviewPilot {plan.name}</div><div style={{fontSize:12,color:"#999"}}>14 יום חינם</div></div>
          <div style={{fontWeight:900,fontSize:20}}>₪{plan.price}</div>
        </div>
        {[{label:"אימייל",key:"email",ph:"your@email.com"},{label:"מספר כרטיס",key:"card",ph:"4242 4242 4242 4242"}].map(f=>(
          <div key={f.key} style={{marginBottom:14}}>
            <label style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:5}}>{f.label}</label>
            <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
          </div>
        ))}
        <div style={{display:"flex",gap:12,marginBottom:20}}>
          {[{label:"תוקף",key:"exp",ph:"MM/YY"},{label:"CVV",key:"cvv",ph:"123"}].map(f=>(
            <div key={f.key} style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:5}}>{f.label}</label>
              <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={{width:"100%",padding:"11px 14px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
            </div>
          ))}
        </div>
        <button onClick={handlePay} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2D6A4F,#40916C)",color:"white",cursor:"pointer",fontSize:15,fontWeight:800}}>שלם ₪{plan.price}/חודש ←</button>
      </div>
    </div>
  );
}

function ConnectScreen({onDone}) {
  const [google,setGoogle]=useState(false);
  const [ig,setIg]=useState(false);
  const [connecting,setConnecting]=useState(null);
  const connect=async(p)=>{setConnecting(p);await new Promise(r=>setTimeout(r,1800));p==="google"?setGoogle(true):setIg(true);setConnecting(null);};
  return(
    <div dir="rtl" style={{minHeight:"100vh",background:"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:440,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#2D6A4F,#40916C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 16px"}}>⭐</div>
          <h2 style={{fontSize:22,fontWeight:900,margin:"0 0 8px"}}>חבר את החשבונות שלך</h2>
          <p style={{color:"#666",fontSize:14}}>חבר לפחות פלטפורמה אחת</p>
        </div>
        {[
          {id:"google",label:"Google ביקורות",sub:"ביקורות גוגל",icon:"🔍",color:"#2D6A4F",connected:google},
          {id:"ig",label:"Instagram תגובות",sub:"תגובות על פוסטים",icon:"📸",color:"#833AB4",connected:ig},
        ].map(p=>(
          <div key={p.id} style={{background:"white",borderRadius:14,padding:"18px 20px",marginBottom:12,border:`2px solid ${p.connected?p.color:"rgba(0,0,0,0.07)"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:`${p.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{p.icon}</div>
                <div><div style={{fontWeight:700,fontSize:14}}>{p.label}</div><div style={{fontSize:12,color:"#999"}}>{p.sub}</div></div>
              </div>
              {p.connected?<span style={{color:p.color,fontWeight:800,fontSize:13}}>✓ מחובר</span>:
              <button onClick={()=>connect(p.id)} disabled={connecting===p.id} style={{padding:"8px 16px",borderRadius:8,border:"none",background:connecting===p.id?"#ddd":p.color,color:"white",cursor:"pointer",fontSize:13,fontWeight:700}}>{connecting===p.id?"⟳ מחבר...":"חבר"}</button>}
            </div>
          </div>
        ))}
        <button onClick={onDone} disabled={!google&&!ig} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:(google||ig)?"linear-gradient(135deg,#2D6A4F,#40916C)":"#ddd",color:(google||ig)?"white":"#999",cursor:(google||ig)?"pointer":"not-allowed",fontSize:15,fontWeight:800,marginTop:8}}>
          {(google||ig)?"המשך לדשבורד ←":"חבר לפחות פלטפורמה אחת"}
        </button>
      </div>
    </div>
  );
}

function Dashboard({plan}) {
  const limits = PLAN_LIMITS[plan?.name] || PLAN_LIMITS["בסיסי"];
  const [page,setPage]=useState("reviews");
  const [tab,setTab]=useState("google");
  const [googleReviews,setGoogleReviews]=useState(MOCK_GOOGLE);
  const [igComments,setIgComments]=useState(MOCK_IG);
  const [selected,setSelected]=useState(null);
  const [generatedReply,setGeneratedReply]=useState("");
  const [generating,setGenerating]=useState(false);
  const [apiKey,setApiKey]=useState("");
  const [reportEmail,setReportEmail]=useState("");
  const [reportSaved,setReportSaved]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [keywords,setKeywords]=useState([
    {id:1,keywords:["מחיר","כמה עולה"],response:"המחירים מתחילים מ-80 ₪. להזמנת תור: 050-0000000"},
    {id:2,keywords:["כתובת","איפה"],response:"אנחנו ברחוב הרצל 5, תל אביב 🗺️"},
    {id:3,keywords:["שעות","פתוח"],response:"פתוחים א-ה 9:00-19:00, שישי עד 14:00 ⏰"},
  ]);
  const [newKws,setNewKws]=useState("");
  const [newResp,setNewResp]=useState("");

  const items=tab==="google"?googleReviews:igComments;
  const allPending=[...googleReviews,...igComments].filter(r=>!r.replied).length;
  const ratings=googleReviews.map(r=>r.rating);
  const avg=(ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1);
  const dist=[5,4,3,2,1].map(s=>({stars:s,count:ratings.filter(r=>r===s).length}));

  const handleGenerate=async(item)=>{
    setSelected(item);setGenerating(true);setGeneratedReply("");
    const kw=matchKeywords(item.text,keywords);
    if(kw){setGeneratedReply(kw);setGenerating(false);return;}
    const ctx=tab==="google"?`ביקורת גוגל דירוג ${item.rating}/5.`:`תגובה על פוסט: "${item.post}"`;
    const ai=await generateAI(item.text,ctx,apiKey);
    setGeneratedReply(ai||getDefault(item.text));
    setGenerating(false);
  };

  const handlePublish=(id)=>{
    const setter=tab==="google"?setGoogleReviews:setIgComments;
    setter(prev=>prev.map(r=>r.id===id?{...r,replied:true,reply:generatedReply}:r));
    setSelected(null);setGeneratedReply("");
  };

  const addKeyword=()=>{
    if(!newKws.trim()||!newResp.trim()||keywords.length>=limits.keywords)return;
    setKeywords(prev=>[...prev,{id:Date.now(),keywords:newKws.split(",").map(k=>k.trim()),response:newResp}]);
    setNewKws("");setNewResp("");
  };

  const navItems=[
    {id:"reviews",icon:"💬",label:"ביקורות",badge:allPending},
    {id:"keywords",icon:"🔑",label:"מילות מפתח",badge:null},
    {id:"analytics",icon:"📊",label:"אנליטיקס",badge:null,locked:!limits.analytics},
    {id:"settings",icon:"⚙️",label:"הגדרות",badge:null},
  ];

  return(
    <div dir="rtl" style={{minHeight:"100vh",background:"#F4F5F7",fontFamily:"system-ui,sans-serif",display:"flex"}}>
      {/* Sidebar */}
      <div style={{width:sidebarOpen?220:64,background:"#1a1a2e",transition:"width 0.25s",flexShrink:0,display:"flex",flexDirection:"column",padding:"20px 0"}}>
        <div style={{padding:"0 16px 24px",display:"flex",alignItems:"center",gap:10,overflow:"hidden"}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#2D6A4F,#40916C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⭐</div>
          {sidebarOpen&&<span style={{fontWeight:800,fontSize:15,color:"white",whiteSpace:"nowrap"}}>ReviewPilot</span>}
        </div>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",border:"none",cursor:"pointer",width:"100%",textAlign:"right",background:page===item.id?"rgba(45,106,79,0.25)":"transparent",color:page===item.id?"#40916C":"#64748B",borderRight:page===item.id?"3px solid #40916C":"3px solid transparent",fontSize:14,fontWeight:page===item.id?700:400,position:"relative"}}>
            <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
            {sidebarOpen&&<span style={{whiteSpace:"nowrap"}}>{item.label}{item.locked?" 🔒":""}</span>}
            {item.badge>0&&<span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"#EF4444",color:"white",borderRadius:20,padding:"1px 6px",fontSize:10,fontWeight:700}}>{item.badge}</span>}
          </button>
        ))}
        {sidebarOpen&&(
          <div style={{marginTop:"auto",padding:"16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:11,color:"#475569",marginBottom:6}}>התוכנית שלך</div>
            <PlanBadge plan={plan?.name||"בסיסי"}/>
          </div>
        )}
        <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",padding:"8px 16px",fontSize:18,textAlign:"right"}}>
          {sidebarOpen?"◀":"▶"}
        </button>
      </div>

      {/* Main */}
      <div style={{flex:1,overflow:"auto"}}>
        <div style={{background:"white",borderBottom:"1px solid #E2E8F0",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:40}}>
          <h2 style={{margin:0,fontSize:16,fontWeight:800,color:"#1a1a2e"}}>
            {{"reviews":"ביקורות ותגובות","keywords":"מילות מפתח","analytics":"אנליטיקס","settings":"הגדרות"}[page]}
          </h2>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#10B981"}}/>
            <span style={{fontSize:12,color:"#666"}}>מחובר</span>
          </div>
        </div>

        <div style={{padding:24}}>

          {/* REVIEWS */}
          {page==="reviews"&&(
            <div style={{display:"grid",gridTemplateColumns:selected?"1fr 380px":"1fr",gap:20}}>
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                  {[
                    {label:"ממתינות",value:allPending,icon:"⏳",color:"#F59E0B"},
                    {label:"גוגל",value:`${googleReviews.filter(r=>r.replied).length}/${googleReviews.length}`,icon:"🔍",color:"#2D6A4F"},
                    {label:"אינסטגרם",value:`${igComments.filter(r=>r.replied).length}/${igComments.length}`,icon:"📸",color:"#833AB4"},
                  ].map((s,i)=>(
                    <div key={i} style={{background:"white",borderRadius:12,padding:"14px 16px",border:"1px solid #E2E8F0"}}>
                      <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
                      <div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.value}</div>
                      <div style={{fontSize:11,color:"#999"}}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  {[
                    {id:"google",label:"🔍 גוגל",pending:googleReviews.filter(r=>!r.replied).length},
                    {id:"instagram",label:"📸 אינסטגרם",pending:igComments.filter(r=>!r.replied).length,locked:!limits.instagram},
                  ].map(t=>(
                    <button key={t.id} onClick={()=>{if(t.locked)return;setTab(t.id);setSelected(null);}} style={{padding:"8px 16px",borderRadius:10,border:tab!==t.id?"1px solid #E2E8F0":"none",cursor:t.locked?"not-allowed":"pointer",fontSize:13,fontWeight:700,background:tab===t.id?"#1a1a2e":"white",color:tab===t.id?"white":"#666",opacity:t.locked?0.5:1,display:"flex",alignItems:"center",gap:6}}>
                      {t.label}{t.locked&&" 🔒"}{t.pending>0&&<span style={{background:"#EF4444",color:"white",borderRadius:20,padding:"1px 6px",fontSize:10}}>{t.pending}</span>}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {items.map(item=>(
                    <div key={item.id} style={{background:"white",borderRadius:12,padding:"16px 18px",border:`1.5px solid ${selected?.id===item.id?"#2D6A4F":"#E2E8F0"}`,cursor:"pointer"}} onClick={()=>!item.replied&&handleGenerate(item)}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#2D6A4F,#40916C)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:13}}>
                            {(item.author||item.user||"?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{fontWeight:700,fontSize:13}}>{item.author||"@"+item.user}</div>
                            <div style={{fontSize:11,color:"#999"}}>{item.date||item.time}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                          {item.rating&&<Stars n={item.rating}/>}
                          <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,fontWeight:600,background:item.replied?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)",color:item.replied?"#10B981":"#F59E0B"}}>{item.replied?"✓ נענה":"ממתין"}</span>
                        </div>
                      </div>
                      <p style={{margin:"0 0 10px",fontSize:13,color:"#444",lineHeight:1.6}}>{item.text}</p>
                      {item.replied&&<div style={{background:"rgba(45,106,79,0.05)",borderRight:"2px solid #2D6A4F",padding:"8px 12px",borderRadius:6,fontSize:12,color:"#555"}}><div style={{color:"#2D6A4F",fontWeight:700,fontSize:10,marginBottom:3}}>התגובה שלך</div>{item.reply}</div>}
                      {!item.replied&&<button onClick={e=>{e.stopPropagation();handleGenerate(item);}} style={{padding:"6px 14px",borderRadius:7,border:"1px solid rgba(45,106,79,0.3)",background:"rgba(45,106,79,0.06)",color:"#2D6A4F",cursor:"pointer",fontSize:12,fontWeight:700}}>⚡ צור תגובה</button>}
                    </div>
                  ))}
                </div>
              </div>
              {selected&&(
                <div style={{background:"white",borderRadius:14,padding:22,border:"1px solid #E2E8F0",height:"fit-content",position:"sticky",top:80}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                    <span style={{fontWeight:800,fontSize:15}}>עריכת תגובה</span>
                    <button onClick={()=>{setSelected(null);setGeneratedReply("");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#999"}}>✕</button>
                  </div>
                  <div style={{background:"#F8F7F4",borderRadius:10,padding:"12px 14px",marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontWeight:700,fontSize:13}}>{selected.author||"@"+selected.user}</span>
                      {selected.rating&&<Stars n={selected.rating}/>}
                    </div>
                    <p style={{margin:0,fontSize:12,color:"#555"}}>{selected.text}</p>
                  </div>
                  <label style={{fontSize:11,color:"#2D6A4F",fontWeight:700,display:"block",marginBottom:6}}>{generating?"⟳ מייצר תגובה...":"תגובה שנוצרה"}</label>
                  <textarea value={generatedReply} onChange={e=>setGeneratedReply(e.target.value)} rows={4} disabled={generating} style={{width:"100%",background:"#F8F7F4",border:"1.5px solid rgba(45,106,79,0.2)",borderRadius:8,padding:"10px 12px",fontSize:13,lineHeight:1.6,resize:"vertical",outline:"none",boxSizing:"border-box",fontFamily:"inherit",color:"#333"}}/>
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <button onClick={()=>handleGenerate(selected)} style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid rgba(45,106,79,0.3)",background:"rgba(45,106,79,0.06)",color:"#2D6A4F",cursor:"pointer",fontSize:13,fontWeight:700}}>🔄 חדש</button>
                    <button onClick={()=>handlePublish(selected.id)} disabled={!generatedReply||generating} style={{flex:2,padding:"10px",borderRadius:8,border:"none",background:generatedReply&&!generating?"linear-gradient(135deg,#2D6A4F,#40916C)":"rgba(0,0,0,0.08)",color:generatedReply&&!generating?"white":"#999",cursor:generatedReply&&!generating?"pointer":"not-allowed",fontSize:13,fontWeight:800}}>פרסם ✓</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* KEYWORDS */}
          {page==="keywords"&&(
            <div style={{maxWidth:700}}>
              <div style={{background:"rgba(45,106,79,0.08)",border:"1px solid rgba(45,106,79,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:24,fontSize:13,color:"#2D6A4F"}}>
                תוכנית <strong>{plan?.name||"בסיסי"}</strong>: {keywords.length}/{limits.keywords} מילות מפתח בשימוש
                {keywords.length>=limits.keywords&&<span style={{marginRight:8,color:"#EF4444",fontWeight:700}}> · הגעת למגבלה - שדרג לפרו</span>}
              </div>
              {keywords.map(rule=>(
                <div key={rule.id} style={{background:"white",borderRadius:12,padding:"16px 18px",marginBottom:10,border:"1px solid #E2E8F0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {rule.keywords.map(kw=><span key={kw} style={{padding:"3px 10px",borderRadius:20,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",color:"#6366F1",fontSize:12,fontWeight:600}}>{kw}</span>)}
                    </div>
                    <button onClick={()=>setKeywords(prev=>prev.filter(r=>r.id!==rule.id))} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#CBD5E1"}}>🗑</button>
                  </div>
                  <div style={{background:"#F8F7F4",borderRight:"2px solid #2D6A4F",padding:"8px 12px",borderRadius:6,fontSize:13,color:"#555"}}>{rule.response}</div>
                </div>
              ))}
              {keywords.length<limits.keywords?(
                <div style={{background:"white",borderRadius:12,padding:"20px 18px",border:"1.5px dashed rgba(45,106,79,0.3)",marginTop:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#2D6A4F",marginBottom:14}}>+ הוסף חוק חדש</div>
                  <input value={newKws} onChange={e=>setNewKws(e.target.value)} placeholder="מילות מפתח מופרדות בפסיק: מחיר, כמה עולה" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}/>
                  <textarea value={newResp} onChange={e=>setNewResp(e.target.value)} placeholder="התגובה שתישלח אוטומטית..." rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit",resize:"vertical",marginBottom:12}}/>
                  <button onClick={addKeyword} style={{padding:"10px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#2D6A4F,#40916C)",color:"white",cursor:"pointer",fontSize:13,fontWeight:700}}>הוסף חוק</button>
                </div>
              ):(
                <div style={{background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"16px 18px",marginTop:16,textAlign:"center"}}>
                  <div style={{fontSize:13,color:"#EF4444",fontWeight:700,marginBottom:8}}>הגעת למגבלת {limits.keywords} מילות מפתח</div>
                  <button style={{padding:"8px 20px",borderRadius:8,border:"none",background:"#2D6A4F",color:"white",cursor:"pointer",fontSize:13,fontWeight:700}}>שדרג לפרו ←</button>
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS */}
          {page==="analytics"&&(
            !limits.analytics?<Locked msg="אנליטיקס זמין בתוכנית פרו ומעלה"/>:
            <div style={{maxWidth:700}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
                {[
                  {label:"דירוג ממוצע",value:avg,icon:"⭐",color:"#F59E0B"},
                  {label:"סה\"כ ביקורות",value:googleReviews.length,icon:"💬",color:"#2D6A4F"},
                  {label:"אחוז מענה",value:`${Math.round(googleReviews.filter(r=>r.replied).length/googleReviews.length*100)}%`,icon:"✅",color:"#6366F1"},
                ].map((s,i)=>(
                  <div key={i} style={{background:"white",borderRadius:14,padding:"20px 18px",border:"1px solid #E2E8F0"}}>
                    <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                    <div style={{fontSize:28,fontWeight:900,color:s.color}}>{s.value}</div>
                    <div style={{fontSize:12,color:"#999",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"white",borderRadius:14,padding:"20px 22px",border:"1px solid #E2E8F0",marginBottom:20}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>התפלגות דירוגים</div>
                {dist.map(d=>(
                  <div key={d.stars} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                    <span style={{fontSize:13,color:"#F59E0B",width:20}}>{d.stars}★</span>
                    <div style={{flex:1,background:"#F1F5F9",borderRadius:20,height:10,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:20,background:d.stars>=4?"#10B981":d.stars===3?"#F59E0B":"#EF4444",width:`${(d.count/googleReviews.length)*100}%`}}/>
                    </div>
                    <span style={{fontSize:12,color:"#94A3B8",width:20}}>{d.count}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"white",borderRadius:14,padding:"20px 22px",border:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>שביעות רצון כללית</div>
                <div style={{display:"flex",gap:12}}>
                  {[
                    {label:"חיובי",count:googleReviews.filter(r=>r.rating>=4).length,color:"#10B981",emoji:"😊"},
                    {label:"ניטרלי",count:googleReviews.filter(r=>r.rating===3).length,color:"#F59E0B",emoji:"😐"},
                    {label:"שלילי",count:googleReviews.filter(r=>r.rating<=2).length,color:"#EF4444",emoji:"😞"},
                  ].map((s,i)=>(
                    <div key={i} style={{flex:1,background:`${s.color}10`,borderRadius:12,padding:"16px",textAlign:"center",border:`1px solid ${s.color}30`}}>
                      <div style={{fontSize:28,marginBottom:6}}>{s.emoji}</div>
                      <div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.count}</div>
                      <div style={{fontSize:12,color:"#666"}}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {page==="settings"&&(
            <div style={{maxWidth:560,display:"flex",flexDirection:"column",gap:16}}>
              <div style={{background:"white",borderRadius:14,padding:"22px",border:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:6}}>Claude API Key</div>
                <div style={{fontSize:12,color:"#94A3B8",marginBottom:14}}>נדרש לתגובות AI אמיתיות · השג ב-console.anthropic.com</div>
                <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-..." type="password" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                {apiKey&&<div style={{fontSize:12,color:"#10B981",marginTop:6,fontWeight:700}}>✅ מפתח פעיל</div>}
              </div>
              <div style={{background:"white",borderRadius:14,padding:"22px",border:"1px solid #E2E8F0",opacity:limits.report?1:0.6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontWeight:800,fontSize:15}}>דוח שבועי במייל</div>
                  {!limits.report&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"rgba(239,68,68,0.1)",color:"#EF4444",fontWeight:700}}>פרו בלבד</span>}
                </div>
                <div style={{fontSize:12,color:"#94A3B8",marginBottom:14}}>קבל סיכום שבועי של הביקורות החשובות</div>
                <input value={reportEmail} onChange={e=>setReportEmail(e.target.value)} placeholder="your@email.com" disabled={!limits.report} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:!limits.report?"#F8F7F4":"white"}}/>
                <button onClick={()=>{if(!limits.report||!reportEmail)return;setReportSaved(true);setTimeout(()=>setReportSaved(false),3000);}} disabled={!limits.report||!reportEmail} style={{marginTop:10,padding:"9px 20px",borderRadius:8,border:"none",background:limits.report&&reportEmail?"#2D6A4F":"#E2E8F0",color:limits.report&&reportEmail?"white":"#94A3B8",cursor:limits.report&&reportEmail?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>
                  {reportSaved?"✅ נשמר!":"שמור אימייל"}
                </button>
              </div>
              <div style={{background:"white",borderRadius:14,padding:"22px",border:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>התוכנית שלך</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <PlanBadge plan={plan?.name||"בסיסי"}/>
                  <span style={{fontSize:22,fontWeight:900}}>₪{plan?.price||79}<span style={{fontSize:13,fontWeight:400,color:"#94A3B8"}}>/חודש</span></span>
                </div>
                {[
                  {label:"תגובות בחודש",value:limits.replies===999?"ללא הגבלה":`${limits.replies}`},
                  {label:"מילות מפתח",value:limits.keywords===99?"ללא הגבלה":`${limits.keywords}`},
                  {label:"אינסטגרם",value:limits.instagram?"✅ כלול":"❌ לא כלול"},
                  {label:"דוח שבועי",value:limits.report?"✅ כלול":"❌ לא כלול"},
                  {label:"אנליטיקס",value:limits.analytics?"✅ כלול":"❌ לא כלול"},
                ].map(r=>(
                  <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F1F5F9",fontSize:13}}>
                    <span style={{color:"#666"}}>{r.label}</span>
                    <span style={{fontWeight:600}}>{r.value}</span>
                  </div>
                ))}
                {plan?.name!=="עסקי"&&<button style={{width:"100%",marginTop:16,padding:"10px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#2D6A4F,#40916C)",color:"white",cursor:"pointer",fontSize:13,fontWeight:700}}>שדרג תוכנית ←</button>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ReviewPilotApp() {
  const [screen,setScreen]=useState("landing");
  const [plan,setPlan]=useState(null);
  const steps=["landing","pricing","checkout","connect","dashboard"];
  const currentStep=steps.indexOf(screen);
  return(
    <div>
      {screen!=="landing"&&screen!=="dashboard"&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:3,background:"#E2E8F0"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#2D6A4F,#40916C)",width:`${(currentStep/4)*100}%`,transition:"width 0.4s ease"}}/>
        </div>
      )}
      {screen==="landing"  &&<LandingScreen  onStart={()=>setScreen("pricing")}/>}
      {screen==="pricing"  &&<PricingScreen  onSelect={p=>{setPlan(p);setScreen("checkout");}}/>}
      {screen==="checkout" &&<CheckoutScreen plan={plan} onSuccess={()=>setScreen("connect")}/>}
      {screen==="connect"  &&<ConnectScreen  onDone={()=>setScreen("dashboard")}/>}
      {screen==="dashboard"&&<Dashboard      plan={plan}/>}
    </div>
  );
}
