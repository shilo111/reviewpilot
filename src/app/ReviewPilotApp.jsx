import { useState, useEffect } from "react";

// ═══════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════
const MOCK_GOOGLE_REVIEWS = [
  { id: "g1", author: "דנה כהן", rating: 5, text: "שירות מעולה! הצוות מקצועי ואדיב, ממליצה בחום.", date: "לפני שעתיים", replied: false },
  { id: "g2", author: "יוסי לוי", rating: 2, text: "ההמתנה ארוכה מדי. לא קיבלתי מה שביקשתי.", date: "לפני יום", replied: false },
  { id: "g3", author: "מיכל א.", rating: 4, text: "מקום נחמד, קצת יקר אבל שווה.", date: "לפני 3 ימים", replied: true, reply: "תודה מיכל! מחכים לראותך שוב 😊" },
];

const MOCK_INSTAGRAM = [
  { id: "i1", postEmoji: "🍕", postCaption: "פיצה חדשה בתפריט! 🔥", user: "dana_cohen", text: "כמה עולה?", time: "לפני שעה", replied: false },
  { id: "i2", postEmoji: "🍕", postCaption: "פיצה חדשה בתפריט! 🔥", user: "yossi_k", text: "נראה מדהים!! 😍", time: "לפני 2 שעות", replied: false },
  { id: "i3", postEmoji: "☕", postCaption: "בוקר טוב עם קפה ☕", user: "rachel_g", text: "יש חנייה בסביבה?", time: "לפני יום", replied: true, reply: "כן! יש חנייה בחינם ממול 🚗" },
];

const KEYWORD_RULES = [
  { keywords: ["מחיר", "כמה עולה", "עולה"], response: "המחירים שלנו מתחילים מ-80 ₪. לפרטים נוספים התקשרו אלינו!" },
  { keywords: ["כתובת", "איפה", "מיקום"], response: "אנחנו ברחוב הרצל 5, תל אביב. ניתן לנווט דרך וייז 🗺️" },
  { keywords: ["שעות", "פתוח", "סגור"], response: "פתוחים א-ה 9:00-19:00, שישי עד 14:00 ⏰" },
  { keywords: ["חנייה"], response: "יש חנייה בחינם ממול לעסק 🚗" },
];

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function matchKeywords(text) {
  const norm = text.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (norm.includes(kw.toLowerCase())) return rule.response;
    }
  }
  return null;
}

async function generateAI(text, context, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        messages: [{ role: "user", content: `אתה מנהל עסק. ${context}\nתגובה: "${text}"\nכתוב תגובה קצרה ואנושית בעברית (עד 2 משפטים). רק התגובה.` }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text?.trim();
  } catch { return null; }
}

function getDefault(text) {
  const neg = ["גרוע", "נורא", "מאכזב", "בזבוז"];
  return neg.some(w => text.includes(w))
    ? "תודה על המשוב הכן. נשמח לתקן - אנא צרו קשר ישירות."
    : "תודה רבה! מחכים לראותך שוב 😊";
}

const Stars = ({ n, size = 13 }) => (
  <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i<=n?"#F59E0B":"#D1D5DB", fontSize: size }}>{i<=n?"★":"☆"}</span>)}</span>
);

// ═══════════════════════════════════════════
// SCREEN 1 - LANDING
// ═══════════════════════════════════════════
function LandingScreen({ onStart }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0F", color:"#E2E8F0", fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse 50% 40% at 70% 30%, rgba(45,106,79,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 70%, rgba(99,102,241,0.08) 0%, transparent 50%)", pointerEvents:"none" }} />

      {/* Nav */}
      <nav style={{ padding:"20px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#2D6A4F,#40916C)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⭐</div>
          <span style={{ fontWeight:800, fontSize:17 }}>ReviewPilot</span>
        </div>
        <button onClick={onStart} style={{ padding:"10px 22px", borderRadius:10, border:"none", background:"#2D6A4F", color:"white", cursor:"pointer", fontSize:14, fontWeight:700 }}>
          התחל חינם ←
        </button>
      </nav>

      {/* Hero */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"60px 24px", position:"relative", zIndex:10 }}>
        <div style={{ display:"inline-block", padding:"5px 14px", borderRadius:20, background:"rgba(45,106,79,0.15)", border:"1px solid rgba(45,106,79,0.3)", color:"#40916C", fontSize:12, fontWeight:700, marginBottom:28 }}>
          ✨ גוגל + אינסטגרם · מענה אוטומטי עם AI
        </div>
        <h1 style={{ fontSize:"clamp(36px,6vw,72px)", fontWeight:900, lineHeight:1.05, letterSpacing:"-2px", margin:"0 auto 24px", maxWidth:700 }}>
          ביקורות שעונות<br/><span style={{ color:"#40916C" }}>לבד.</span>
        </h1>
        <p style={{ fontSize:18, color:"#64748B", maxWidth:460, margin:"0 auto 44px", lineHeight:1.7 }}>
          AI מייצר תגובות אנושיות לכל ביקורת וכל תגובה. אתה רק מאשר.
        </p>

        {/* Demo preview */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24, maxWidth:520, width:"100%", marginBottom:40, textAlign:"right" }}>
          {[
            { name:"שרה מ.", stars:5, text:"מקום נהדר! הייתי מרוצה מאוד.", reply:"תודה שרה! שמחים שנהנית 😊 מחכים לראותך שוב!", source:"AI" },
            { name:"יוסי ק.", stars:2, text:"ההמתנה הייתה ארוכה מדי.", reply:"יוסי, מצטערים. זה לא הסטנדרט שלנו. נשמח לפצות.", source:"AI" },
          ].map((r,i) => (
            <div key={i} style={{ marginBottom:i===0?16:0, padding:14, background:"rgba(0,0,0,0.2)", borderRadius:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:13 }}>{r.name}</span>
                <Stars n={r.stars} />
              </div>
              <p style={{ margin:"0 0 10px", fontSize:12, color:"#94A3B8" }}>{r.text}</p>
              <div style={{ background:"rgba(45,106,79,0.12)", borderRight:"2px solid #40916C", padding:"8px 12px", borderRadius:7 }}>
                <div style={{ fontSize:10, color:"#40916C", fontWeight:700, marginBottom:3 }}>✓ תגובה אוטומטית · {r.source}</div>
                <p style={{ margin:0, fontSize:12, color:"#A7F3D0" }}>{r.reply}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onStart} style={{ padding:"16px 36px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#2D6A4F,#40916C)", color:"white", cursor:"pointer", fontSize:16, fontWeight:800, boxShadow:"0 8px 32px rgba(45,106,79,0.35)" }}>
          התחל ניסיון חינם של 14 יום ←
        </button>
        <p style={{ marginTop:12, fontSize:12, color:"#334155" }}>ללא כרטיס אשראי · ביטול בכל עת</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SCREEN 2 - PRICING / SIGNUP
// ═══════════════════════════════════════════
function PricingScreen({ onSelect }) {
  const plans = [
    { name:"בסיסי", price:79, features:["50 תגובות/חודש","גוגל בלבד","מילות מפתח"], highlight:false },
    { name:"פרו", price:149, features:["ללא הגבלה","גוגל + אינסטגרם","מילות מפתח ללא הגבלה","דוח שבועי"], highlight:true },
    { name:"עסקי", price:299, features:["כמה סניפים","API גישה","מנהל אישי"], highlight:false },
  ];

  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F8F7F4", fontFamily:"system-ui,sans-serif", padding:"40px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:32 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#2D6A4F,#40916C)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⭐</div>
          <span style={{ fontWeight:800, fontSize:17 }}>ReviewPilot</span>
        </div>
        <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:"-1px", margin:"0 0 10px" }}>בחר תוכנית</h2>
        <p style={{ color:"#666", fontSize:15 }}>14 יום ניסיון חינם · ללא כרטיס אשראי</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, maxWidth:780, margin:"0 auto 40px" }}>
        {plans.map((p,i) => (
          <div key={i} style={{
            background: p.highlight ? "#2D6A4F" : "white",
            border: p.highlight ? "none" : "1.5px solid rgba(0,0,0,0.08)",
            borderRadius:18, padding:"28px 24px",
            color: p.highlight ? "white" : "#1a1a2e",
            transform: p.highlight ? "scale(1.03)" : "scale(1)",
            boxShadow: p.highlight ? "0 16px 48px rgba(45,106,79,0.3)" : "0 2px 12px rgba(0,0,0,0.05)",
            position:"relative",
          }}>
            {p.highlight && <div style={{ position:"absolute", top:-12, right:20, background:"#F59E0B", color:"white", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:20 }}>הכי פופולרי</div>}
            <div style={{ fontSize:13, opacity:0.7, marginBottom:6 }}>{p.name}</div>
            <div style={{ fontSize:38, fontWeight:900, letterSpacing:"-2px", marginBottom:20 }}>₪{p.price}<span style={{ fontSize:13, fontWeight:400, opacity:0.6 }}>/חודש</span></div>
            {p.features.map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, fontSize:13 }}>
                <span style={{ color: p.highlight ? "#A7F3D0" : "#2D6A4F", fontWeight:700 }}>✓</span>{f}
              </div>
            ))}
            <button onClick={() => onSelect(p)} style={{
              width:"100%", marginTop:20, padding:"12px", borderRadius:10, border:"none",
              background: p.highlight ? "white" : "#2D6A4F",
              color: p.highlight ? "#2D6A4F" : "white",
              cursor:"pointer", fontSize:14, fontWeight:800,
            }}>
              בחר {p.name} ←
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SCREEN 3 - STRIPE CHECKOUT (סימולציה)
// ═══════════════════════════════════════════
function CheckoutScreen({ plan, onSuccess }) {
  const [step, setStep] = useState("form"); // form → processing → success
  const [form, setForm] = useState({ email:"", card:"", exp:"", cvv:"", name:"" });

  const handlePay = async () => {
    if (!form.email || !form.card || !form.exp || !form.cvv) return;
    setStep("processing");
    // בקוד אמיתי - קריאה לשרת:
    // POST /create-checkout-session
    // { priceId: plan.stripePriceId, successUrl, cancelUrl }
    // → redirect to Stripe Checkout URL
    await new Promise(r => setTimeout(r, 2000));
    setStep("success");
    setTimeout(onSuccess, 1500);
  };

  if (step === "processing") return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ fontSize:40, animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</div>
      <div style={{ fontWeight:700, fontSize:16 }}>מעבד תשלום...</div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (step === "success") return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ fontSize:56 }}>✅</div>
      <div style={{ fontWeight:900, fontSize:20 }}>התשלום הצליח!</div>
      <div style={{ color:"#666", fontSize:14 }}>מעביר אותך לחיבור חשבונות...</div>
    </div>
  );

  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ background:"white", borderRadius:20, padding:36, maxWidth:420, width:"100%", boxShadow:"0 8px 40px rgba(0,0,0,0.08)" }}>
        {/* Stripe badge */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <h3 style={{ margin:0, fontWeight:900, fontSize:18 }}>תשלום מאובטח</h3>
          <div style={{ fontSize:11, color:"#666", display:"flex", alignItems:"center", gap:4 }}>
            🔒 <span style={{ fontWeight:700, color:"#635BFF" }}>Stripe</span>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background:"#F8F7F4", borderRadius:12, padding:"14px 16px", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>ReviewPilot {plan.name}</div>
            <div style={{ fontSize:12, color:"#999" }}>חיוב חודשי · 14 יום חינם</div>
          </div>
          <div style={{ fontWeight:900, fontSize:20 }}>₪{plan.price}</div>
        </div>

        {/* Form */}
        {[
          { label:"אימייל", key:"email", placeholder:"your@email.com", type:"email" },
          { label:"מספר כרטיס", key:"card", placeholder:"4242 4242 4242 4242", type:"text" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#444", display:"block", marginBottom:5 }}>{f.label}</label>
            <input value={form[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
              placeholder={f.placeholder} type={f.type}
              style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:"1.5px solid #E2E8F0", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
          </div>
        ))}
        <div style={{ display:"flex", gap:12, marginBottom:20 }}>
          {[{label:"תוקף",key:"exp",placeholder:"MM/YY"},{label:"CVV",key:"cvv",placeholder:"123"}].map(f => (
            <div key={f.key} style={{ flex:1 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#444", display:"block", marginBottom:5 }}>{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                placeholder={f.placeholder}
                style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:"1.5px solid #E2E8F0", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
          ))}
        </div>

        <button onClick={handlePay} style={{ width:"100%", padding:"14px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#2D6A4F,#40916C)", color:"white", cursor:"pointer", fontSize:15, fontWeight:800, boxShadow:"0 4px 20px rgba(45,106,79,0.3)" }}>
          שלם ₪{plan.price}/חודש ←
        </button>
        <p style={{ textAlign:"center", fontSize:11, color:"#999", marginTop:12 }}>מאובטח על ידי Stripe · ביטול בכל עת</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SCREEN 4 - CONNECT ACCOUNTS
// ═══════════════════════════════════════════
function ConnectScreen({ onDone }) {
  const [google, setGoogle] = useState(false);
  const [instagram, setInstagram] = useState(false);
  const [connecting, setConnecting] = useState(null);

  const connect = async (platform) => {
    setConnecting(platform);
    await new Promise(r => setTimeout(r, 1800));
    if (platform === "google") setGoogle(true);
    else setInstagram(true);
    setConnecting(null);
  };

  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ maxWidth:460, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#2D6A4F,#40916C)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 16px" }}>⭐</div>
          <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 8px" }}>חבר את החשבונות שלך</h2>
          <p style={{ color:"#666", fontSize:14, lineHeight:1.6 }}>חבר לפחות פלטפורמה אחת כדי להתחיל</p>
        </div>

        {/* Google */}
        <div style={{ background:"white", borderRadius:16, padding:"20px 22px", marginBottom:12, border:`2px solid ${google ? "#2D6A4F" : "rgba(0,0,0,0.07)"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:"#FFF0F0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🔍</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>Google ביקורות</div>
                <div style={{ fontSize:12, color:"#999" }}>ביקורות גוגל · מענה אוטומטי</div>
              </div>
            </div>
            {google ? (
              <span style={{ color:"#2D6A4F", fontWeight:800, fontSize:13 }}>✓ מחובר</span>
            ) : (
              <button onClick={() => connect("google")} disabled={connecting === "google"} style={{
                padding:"8px 18px", borderRadius:8, border:"none",
                background: connecting === "google" ? "#ddd" : "#2D6A4F",
                color:"white", cursor:"pointer", fontSize:13, fontWeight:700,
              }}>
                {connecting === "google" ? "⟳ מחבר..." : "חבר"}
              </button>
            )}
          </div>
        </div>

        {/* Instagram */}
        <div style={{ background:"white", borderRadius:16, padding:"20px 22px", marginBottom:32, border:`2px solid ${instagram ? "#833AB4" : "rgba(0,0,0,0.07)"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:"linear-gradient(135deg,rgba(131,58,180,0.1),rgba(247,119,55,0.1))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>📸</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>Instagram תגובות</div>
                <div style={{ fontSize:12, color:"#999" }}>תגובות על פוסטים · מענה אוטומטי</div>
              </div>
            </div>
            {instagram ? (
              <span style={{ color:"#833AB4", fontWeight:800, fontSize:13 }}>✓ מחובר</span>
            ) : (
              <button onClick={() => connect("instagram")} disabled={connecting === "instagram"} style={{
                padding:"8px 18px", borderRadius:8, border:"none",
                background: connecting === "instagram" ? "#ddd" : "linear-gradient(135deg,#833AB4,#FD1D1D)",
                color:"white", cursor:"pointer", fontSize:13, fontWeight:700,
              }}>
                {connecting === "instagram" ? "⟳ מחבר..." : "חבר"}
              </button>
            )}
          </div>
        </div>

        <button onClick={onDone} disabled={!google && !instagram} style={{
          width:"100%", padding:"14px", borderRadius:12, border:"none",
          background: (google || instagram) ? "linear-gradient(135deg,#2D6A4F,#40916C)" : "#ddd",
          color: (google || instagram) ? "white" : "#999",
          cursor: (google || instagram) ? "pointer" : "not-allowed",
          fontSize:15, fontWeight:800,
        }}>
          {(google || instagram) ? "המשך לדשבורד ←" : "חבר לפחות פלטפורמה אחת"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SCREEN 5 - MAIN DASHBOARD
// ═══════════════════════════════════════════
function Dashboard({ plan, apiKey, setApiKey }) {
  const [tab, setTab] = useState("google");
  const [googleReviews, setGoogleReviews] = useState(MOCK_GOOGLE_REVIEWS);
  const [igComments, setIgComments] = useState(MOCK_INSTAGRAM);
  const [selected, setSelected] = useState(null);
  const [generatedReply, setGeneratedReply] = useState("");
  const [generating, setGenerating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const pendingGoogle = googleReviews.filter(r => !r.replied).length;
  const pendingIG = igComments.filter(r => !r.replied).length;

  const handleGenerate = async (item) => {
    setSelected(item);
    setGenerating(true);
    setGeneratedReply("");

    const kw = matchKeywords(item.text);
    if (kw) { setGeneratedReply(kw); setGenerating(false); return; }

    const context = tab === "google"
      ? `זוהי ביקורת גוגל עם דירוג ${item.rating}/5.`
      : `זוהי תגובה על פוסט באינסטגרם: "${item.postCaption}"`;

    const ai = await generateAI(item.text, context, apiKey);
    setGeneratedReply(ai || getDefault(item.text));
    setGenerating(false);
  };

  const handlePublish = (id) => {
    if (tab === "google") {
      setGoogleReviews(prev => prev.map(r => r.id===id ? {...r, replied:true, reply:generatedReply} : r));
    } else {
      setIgComments(prev => prev.map(r => r.id===id ? {...r, replied:true, reply:generatedReply} : r));
    }
    setSelected(null);
    setGeneratedReply("");
  };

  const items = tab === "google" ? googleReviews : igComments;

  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#F8F7F4", fontFamily:"system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background:"white", borderBottom:"1px solid #EFEFEF", padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#2D6A4F,#40916C)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⭐</div>
          <span style={{ fontWeight:800, fontSize:15 }}>ReviewPilot</span>
          <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:"rgba(45,106,79,0.1)", color:"#2D6A4F", fontWeight:700 }}>{plan?.name || "פרו"}</span>
        </div>
        <button onClick={() => setSettingsOpen(!settingsOpen)} style={{ background:"none", border:"1px solid #E2E8F0", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:13, color:"#666" }}>
          ⚙️ הגדרות
        </button>
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <div style={{ background:"white", borderBottom:"1px solid #EFEFEF", padding:"16px 24px" }}>
          <div style={{ maxWidth:500, display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#444", display:"block", marginBottom:5 }}>Claude API Key (לתגובות AI אמיתיות)</label>
              <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-..." type="password"
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #E2E8F0", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
            {apiKey && <div style={{ fontSize:12, color:"#10B981", fontWeight:700, marginTop:18 }}>✓ פעיל</div>}
          </div>
        </div>
      )}

      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px", display:"grid", gridTemplateColumns:selected?"1fr 380px":"1fr", gap:20 }}>

        {/* Stats */}
        <div style={{ gridColumn:selected?"1":"1", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:0 }}>
          {[
            { label:"ממתינות", value:pendingGoogle+pendingIG, icon:"⏳", color:"#F59E0B" },
            { label:"גוגל", value:googleReviews.filter(r=>r.replied).length+"/"+googleReviews.length, icon:"🔍", color:"#2D6A4F" },
            { label:"אינסטגרם", value:igComments.filter(r=>r.replied).length+"/"+igComments.length, icon:"📸", color:"#833AB4" },
          ].map((s,i) => (
            <div key={i} style={{ background:"white", borderRadius:12, padding:"14px 16px", border:"1px solid #EFEFEF" }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:"#999" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs + List */}
        <div>
          {/* Platform tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:16, marginTop:16 }}>
            {[
              { id:"google", label:"🔍 גוגל ביקורות", pending:pendingGoogle },
              { id:"instagram", label:"📸 אינסטגרם", pending:pendingIG },
            ].map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); setGeneratedReply(""); }} style={{
                padding:"9px 18px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                background: tab===t.id ? "#1a1a2e" : "white",
                color: tab===t.id ? "white" : "#666",
                border: tab!==t.id ? "1px solid #EFEFEF" : "none",
                display:"flex", alignItems:"center", gap:6,
              }}>
                {t.label}
                {t.pending > 0 && <span style={{ background:"#EF4444", color:"white", borderRadius:20, padding:"1px 7px", fontSize:11 }}>{t.pending}</span>}
              </button>
            ))}
          </div>

          {/* Items */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {items.map(item => (
              <div key={item.id} style={{
                background:"white", borderRadius:12, padding:"16px 18px",
                border:`1.5px solid ${selected?.id===item.id ? (tab==="google"?"#2D6A4F":"#833AB4") : "#EFEFEF"}`,
                cursor:"pointer", transition:"all 0.15s",
              }} onClick={() => !item.replied && handleGenerate(item)}>

                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${tab==="google"?"#2D6A4F,#40916C":"#833AB4,#F77737"})`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:13 }}>
                      {(item.author||item.user||"?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>{item.author || "@"+item.user}</div>
                      <div style={{ fontSize:11, color:"#999" }}>{item.date || item.time}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                    {item.rating && <Stars n={item.rating} />}
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, fontWeight:600,
                      background:item.replied?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)",
                      color:item.replied?"#10B981":"#F59E0B" }}>
                      {item.replied ? "✓ נענה" : "ממתין"}
                    </span>
                  </div>
                </div>

                <p style={{ margin:"0 0 10px", fontSize:13, color:"#444", lineHeight:1.6 }}>{item.text}</p>

                {item.replied && (
                  <div style={{ background:"rgba(45,106,79,0.05)", borderRight:"2px solid #2D6A4F", padding:"8px 12px", borderRadius:6, fontSize:12, color:"#555" }}>
                    <div style={{ color:"#2D6A4F", fontWeight:700, fontSize:10, marginBottom:3 }}>התגובה שלך</div>
                    {item.reply}
                  </div>
                )}

                {!item.replied && (
                  <button onClick={e=>{e.stopPropagation();handleGenerate(item);}} style={{
                    padding:"6px 14px", borderRadius:7, border:`1px solid ${tab==="google"?"rgba(45,106,79,0.3)":"rgba(131,58,180,0.3)"}`,
                    background:tab==="google"?"rgba(45,106,79,0.06)":"rgba(131,58,180,0.06)",
                    color:tab==="google"?"#2D6A4F":"#833AB4", cursor:"pointer", fontSize:12, fontWeight:700,
                  }}>⚡ צור תגובה</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edit panel */}
        {selected && (
          <div style={{ background:"white", borderRadius:14, padding:22, border:"1px solid #EFEFEF", height:"fit-content", position:"sticky", top:80 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontWeight:800, fontSize:15 }}>עריכת תגובה</span>
              <button onClick={()=>{setSelected(null);setGeneratedReply("");}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#999" }}>✕</button>
            </div>

            <div style={{ background:"#F8F7F4", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontWeight:700, fontSize:13 }}>{selected.author || "@"+selected.user}</span>
                {selected.rating && <Stars n={selected.rating} />}
              </div>
              <p style={{ margin:0, fontSize:12, color:"#555" }}>{selected.text}</p>
            </div>

            <label style={{ fontSize:11, color:"#2D6A4F", fontWeight:700, display:"block", marginBottom:6 }}>
              {generating ? "⟳ מייצר תגובה..." : "תגובה שנוצרה"}
            </label>
            <textarea value={generatedReply} onChange={e=>setGeneratedReply(e.target.value)}
              rows={4} disabled={generating}
              style={{ width:"100%", background:"#F8F7F4", border:"1.5px solid rgba(45,106,79,0.2)", borderRadius:8, padding:"10px 12px", fontSize:13, lineHeight:1.6, resize:"vertical", outline:"none", boxSizing:"border-box", fontFamily:"inherit", color:"#333" }} />

            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button onClick={()=>handleGenerate(selected)} style={{ flex:1, padding:"10px", borderRadius:8, border:"1px solid rgba(45,106,79,0.3)", background:"rgba(45,106,79,0.06)", color:"#2D6A4F", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                🔄 חדש
              </button>
              <button onClick={()=>handlePublish(selected.id)} disabled={!generatedReply||generating} style={{
                flex:2, padding:"10px", borderRadius:8, border:"none",
                background:generatedReply&&!generating?"linear-gradient(135deg,#2D6A4F,#40916C)":"rgba(0,0,0,0.08)",
                color:generatedReply&&!generating?"white":"#999",
                cursor:generatedReply&&!generating?"pointer":"not-allowed", fontSize:13, fontWeight:800,
              }}>פרסם ✓</button>
            </div>
            <p style={{ fontSize:11, color:"#999", textAlign:"center", marginTop:8 }}>
              {tab==="google" ? "יפורסם ישירות לגוגל" : "יפורסם ישירות לאינסטגרם"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP - ROUTER
// ═══════════════════════════════════════════
export default function ReviewPilotApp() {
  const [screen, setScreen] = useState("landing");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [apiKey, setApiKey] = useState("");

  // Progress indicator
  const steps = ["landing","pricing","checkout","connect","dashboard"];
  const currentStep = steps.indexOf(screen);

  return (
    <div>
      {/* Progress bar - רק בזמן onboarding */}
      {screen !== "landing" && screen !== "dashboard" && (
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, height:3, background:"#E2E8F0" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#2D6A4F,#40916C)", width:`${(currentStep/4)*100}%`, transition:"width 0.4s ease" }} />
        </div>
      )}

      {screen === "landing" && <LandingScreen onStart={() => setScreen("pricing")} />}
      {screen === "pricing" && <PricingScreen onSelect={p => { setSelectedPlan(p); setScreen("checkout"); }} />}
      {screen === "checkout" && <CheckoutScreen plan={selectedPlan} onSuccess={() => setScreen("connect")} />}
      {screen === "connect" && <ConnectScreen onDone={() => setScreen("dashboard")} />}
      {screen === "dashboard" && <Dashboard plan={selectedPlan} apiKey={apiKey} setApiKey={setApiKey} />}
    </div>
  );
}
