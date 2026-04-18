“use client”;
import { useState, useEffect, useRef } from “react”;

const useInView = () => {
const ref = useRef(null);
const [visible, setVisible] = useState(false);
useEffect(() => {
const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
if (ref.current) obs.observe(ref.current);
return () => obs.disconnect();
}, []);
return [ref, visible];
};

const Fade = ({ children, delay = 0 }) => {
const [ref, visible] = useInView();
return (
<div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? “none” : “translateY(20px)”, transition: `opacity 0.6s ${delay}s, transform 0.6s ${delay}s` }}>
{children}
</div>
);
};

const FEATURES = [
{ icon: “✦”, title: “מענה אוטומטי עם AI”, desc: “Claude מייצר תגובות אנושיות לכל ביקורת תוך שניות. מותאם לטון ולסגנון של העסק שלך.” },
{ icon: “◈”, title: “מילות מפתח חכמות”, desc: “הגדר תגובות אוטומטיות לשאלות נפוצות — מחיר, כתובת, שעות פתיחה — בלי AI, בחינם.” },
{ icon: “◎”, title: “גוגל + אינסטגרם”, desc: “נהל ביקורות גוגל ותגובות אינסטגרם ממקום אחד. ללא מעבר בין פלטפורמות.” },
{ icon: “⬡”, title: “אנליטיקס ודוחות”, desc: “עקוב אחרי הדירוג הממוצע, שביעות רצון לקוחות, ומגמות לאורך זמן.” },
{ icon: “▣”, title: “תבניות תגובה”, desc: “שמור תגובות שעבדו טוב ושתף אותן עם הצוות. עקביות בכל מענה.” },
{ icon: “◐”, title: “דוח שבועי במייל”, desc: “קבל סיכום שבועי של ביקורות חדשות, ביקורות שליליות שצריכות מענה, ומגמות.” },
];

const TESTIMONIALS = [
{ name: “ריבי כהן”, role: “בעלת מספרה, תל אביב”, text: “לפני ReviewPilot הייתי מפחדת לפתוח את גוגל בבוקר. היום כל ביקורת מקבלת תגובה מקצועית תוך דקות. הלקוחות מופתעים לטובה.”, rating: 5 },
{ name: “מושה לוי”, role: “מנהל מסעדה, חיפה”, text: “חסך לי שעה ביום לפחות. התגובות נשמעות אנושיות לגמרי — לקוחות לא מרגישים שזה אוטומטי. ממליץ בחום.”, rating: 5 },
{ name: “דנה אברהם”, role: “קליניקת יופי, רמת גן”, text: “הגדרתי פעם אחת את שעות הפתיחה והמחירים, ועכשיו כל שאלה עונה לבד. מדהים כמה זמן זה חוסך.”, rating: 5 },
{ name: “אמיר שפירא”, role: “רשת חנויות, ירושלים”, text: “מנהל 4 סניפים ו-ReviewPilot מנהל את כל הביקורות בשבילי. האנליטיקס עוזר לי להבין איפה כל סניף צריך שיפור.”, rating: 5 },
];

const FAQS = [
{ q: “האם התגובות נשמעות אוטומטיות?”, a: “לא. ה-AI כותב בסגנון שלך, עם שם העסק וטון שבחרת. רוב הלקוחות לא מבינים שזה אוטומטי — ואם כן, זה דווקא מרשים.” },
{ q: “כמה זמן לוקח להגדיר?”, a: “כ-10 דקות. מכניסים פרטי עסק, מגדירים כמה מילות מפתח, ומחברים לגוגל. מהרגע הזה הכל אוטומטי.” },
{ q: “האם אני שולט על מה שנשלח?”, a: “תמיד. כל תגובה עוברת דרכך לפני פרסום. אתה יכול לערוך, לאשר, או לדחות. ReviewPilot מציע, אתה מחליט.” },
{ q: “האם זה עובד גם עם אינסטגרם?”, a: “כן, בתוכנית Pro ומעלה. ReviewPilot מנהל תגובות על פוסטים, ושאלות נפוצות כמו מחיר או כתובת — עונות אוטומטית.” },
{ q: “מה קורה אם ה-AI טועה?”, a: “יש מנגנון מילות מפתח שעובד בלי AI — ל-100% דיוק לשאלות נפוצות. ל-AI יש fallback אוטומטי וכפתור ‘צור מחדש’.” },
{ q: “האם אפשר לבטל?”, a: “כן, בכל עת. ללא התחייבות, ללא קנסות. המנוי מתחדש חודשי — מבטלים ולא מחויבים יותר.” },
];

const PLANS = [
{ name: “Basic”, price: 79, desc: “לעסקים קטנים שרוצים להתחיל”, features: [“50 תגובות/חודש”, “Google Reviews”, “3 מילות מפתח”, “תבניות תגובה”], cta: “התחל בחינם”, highlight: false },
{ name: “Pro”, price: 149, desc: “לעסקים פעילים שצומחים”, features: [“ללא הגבלת תגובות”, “Google + Instagram”, “20 מילות מפתח”, “דוח שבועי במייל”, “אנליטיקס מלא”, “תעדוף תמיכה”], cta: “התחל ניסיון חינם”, highlight: true },
{ name: “Business”, price: 299, desc: “לרשתות ועסקים גדולים”, features: [“כמה סניפים”, “מילות מפתח ללא הגבלה”, “API גישה”, “מנהל חשבון אישי”, “הדרכה אישית”], cta: “דבר איתנו”, highlight: false },
];

export default function LandingPage({ onSignup, onLogin }) {
const [openFaq, setOpenFaq] = useState(null);
const [email, setEmail] = useState(””);
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
const fn = () => setScrolled(window.scrollY > 50);
window.addEventListener(“scroll”, fn);
return () => window.removeEventListener(“scroll”, fn);
}, []);

return (
<div dir=“rtl” style={{ fontFamily: “‘Segoe UI’, system-ui, sans-serif”, color: “#111827”, background: “#fff”, overflowX: “hidden” }}>

```
  {/* ── NAV ── */}
  <nav style={{ position: "fixed", top: 0, right: 0, left: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid #F3F4F6" : "none", transition: "all 0.3s", padding: "0 48px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="white"><path d="M6.5 1L8 4.5 12 5l-2.8 2.7.7 4-3.4-1.8-3.4 1.8.7-4L1 5l4-.5L6.5 1z"/></svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>ReviewPilot</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <a href="#pricing" style={{ padding: "7px 14px", color: "#6B7280", textDecoration: "none", fontSize: 14 }}>תמחור</a>
      <button onClick={onLogin} style={{ padding: "7px 16px", borderRadius: 7, border: "1px solid #E5E7EB", background: "white", color: "#374151", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>כניסה</button>
      <button onClick={onSignup} style={{ padding: "7px 16px", borderRadius: 7, border: "none", background: "#16a34a", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>התחל בחינם</button>
    </div>
  </nav>

  {/* ── HERO ── */}
  <section style={{ paddingTop: 120, paddingBottom: 80, textAlign: "center", background: "linear-gradient(180deg, #f0fdf4 0%, #fff 60%)", padding: "120px 24px 80px" }}>
    <Fade>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontSize: 13, fontWeight: 600, marginBottom: 28 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }}/>
        מעל 500 עסקים כבר משתמשים ב-ReviewPilot
      </div>
      <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", margin: "0 auto 20px", maxWidth: 780, color: "#111827" }}>
        תגובות לביקורות שלך<br/>
        <span style={{ color: "#16a34a" }}>אוטומטיות, אנושיות, מהירות.</span>
      </h1>
      <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8 }}>
        AI מייצר תגובות לביקורות גוגל ואינסטגרם בסגנון שלך. אתה רק מאשר ולוחץ פרסם — כל השאר אוטומטי.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <button onClick={onSignup} style={{ padding: "13px 28px", borderRadius: 8, border: "none", background: "#16a34a", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, boxShadow: "0 4px 20px rgba(22,163,74,0.3)" }}>
          התחל ניסיון חינם של 14 יום
        </button>
        <button onClick={onLogin} style={{ padding: "13px 24px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "white", color: "#374151", cursor: "pointer", fontSize: 15, fontWeight: 500 }}>
          כניסה לחשבון קיים
        </button>
      </div>
      <p style={{ fontSize: 13, color: "#9CA3AF" }}>ללא כרטיס אשראי · ביטול בכל עת</p>
    </Fade>

    {/* Dashboard preview */}
    <Fade delay={0.2}>
      <div style={{ maxWidth: 860, margin: "48px auto 0", borderRadius: 14, boxShadow: "0 24px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)", overflow: "hidden", background: "white" }}>
        <div style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
          {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }}/>)}
          <div style={{ flex: 1, background: "#E5E7EB", borderRadius: 4, height: 20, marginRight: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>app.reviewpilot.co.il</span>
          </div>
        </div>
        <div style={{ padding: "20px 24px", background: "#F9FAFB" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
            {[["3","ממתינות"],["4.6","דירוג ממוצע"],["12/14","גוגל"],["3/4","אינסטגרם"]].map(([v,l],i) => (
              <div key={i} style={{ background: "white", borderRadius: 8, padding: "12px 14px", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          {[
            { name: "דנה כהן", r: 5, text: "שירות מעולה!", replied: true, reply: "תודה דנה! מחכים לראותך שוב." },
            { name: "יוסי ל.", r: 2, text: "המתנה ארוכה מדי.", replied: false },
          ].map((row, i) => (
            <div key={i} style={{ background: "white", borderRadius: 8, padding: "12px 14px", border: "1px solid #E5E7EB", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#16a34a" }}>{row.name[0]}</div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{row.name}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: "#F59E0B", fontSize: 12 }}>{"★".repeat(row.r)}{"☆".repeat(5-row.r)}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: row.replied ? "#ECFDF5" : "#FEF3C7", color: row.replied ? "#16a34a" : "#D97706", fontWeight: 600 }}>
                    {row.replied ? "נענה" : "ממתין"}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{row.text}</p>
              {row.replied && (
                <div style={{ marginTop: 8, padding: "6px 10px", background: "#F0FDF4", borderRight: "2px solid #16a34a", borderRadius: "0 4px 4px 0", fontSize: 11, color: "#15803d" }}>{row.reply}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Fade>
  </section>

  {/* ── LOGOS ── */}
  <section style={{ padding: "32px 48px", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6", textAlign: "center" }}>
    <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>עובד עם הפלטפורמות שאתה כבר משתמש בהן</p>
    <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", alignItems: "center" }}>
      {["Google Reviews", "Instagram", "Payplus", "Claude AI"].map(n => (
        <span key={n} style={{ fontSize: 14, fontWeight: 600, color: "#D1D5DB", letterSpacing: "-0.3px" }}>{n}</span>
      ))}
    </div>
  </section>

  {/* ── FEATURES ── */}
  <section style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
    <Fade>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 14px" }}>הכל במקום אחד</h2>
        <p style={{ color: "#6B7280", fontSize: 16, maxWidth: 460, margin: "0 auto" }}>כל מה שעסק צריך כדי לנהל ביקורות בצורה מקצועית ואוטומטית.</p>
      </div>
    </Fade>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
      {FEATURES.map((f, i) => (
        <Fade key={i} delay={i * 0.05}>
          <div style={{ padding: "24px", borderRadius: 12, border: "1px solid #E5E7EB", background: "white", transition: "box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 16, color: "#16a34a", fontWeight: 700 }}>{f.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, margin: "0 0 8px" }}>{f.title}</h3>
            <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
          </div>
        </Fade>
      ))}
    </div>
  </section>

  {/* ── HOW IT WORKS ── */}
  <section style={{ padding: "80px 48px", background: "#F9FAFB" }}>
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Fade>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 14px" }}>איך זה עובד?</h2>
          <p style={{ color: "#6B7280", fontSize: 16 }}>שלושה שלבים פשוטים. 10 דקות הגדרה.</p>
        </div>
      </Fade>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
        {[
          { num: "01", title: "מחבר את הפלטפורמות", desc: "כניסה מאובטחת עם גוגל. מחבר את הפרופיל העסקי שלך ב-30 שניות." },
          { num: "02", title: "AI מייצר תגובות", desc: "לכל ביקורת חדשה נוצרת תגובה מותאמת אישית תוך שניות." },
          { num: "03", title: "אתה מאשר ופורסם", desc: "לחיצה אחת לאישור. האפשרות לעריכה תמיד שם. אתה בשליטה." },
        ].map((s, i) => (
          <Fade key={i} delay={i * 0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#E5E7EB", marginBottom: 14, fontFamily: "monospace" }}>{s.num}</div>
              <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  </section>

  {/* ── TESTIMONIALS ── */}
  <section style={{ padding: "80px 48px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Fade>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 14px" }}>עסקים שכבר חוסכים זמן</h2>
          <p style={{ color: "#6B7280", fontSize: 16 }}>500+ בעלי עסקים בישראל משתמשים ב-ReviewPilot כל יום.</p>
        </div>
      </Fade>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        {TESTIMONIALS.map((t, i) => (
          <Fade key={i} delay={i * 0.05}>
            <div style={{ padding: "22px", borderRadius: 12, border: "1px solid #E5E7EB", background: "white" }}>
              <div style={{ color: "#F59E0B", fontSize: 14, marginBottom: 12 }}>{"★".repeat(t.rating)}</div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 18 }}>"{t.text}"</p>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  </section>

  {/* ── PRICING ── */}
  <section id="pricing" style={{ padding: "80px 48px", background: "#F9FAFB" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Fade>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px" }}>תמחור פשוט ושקוף</h2>
          <p style={{ color: "#6B7280", fontSize: 16 }}>14 יום ניסיון חינם בכל תוכנית. ללא כרטיס אשראי.</p>
        </div>
      </Fade>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        {PLANS.map((p, i) => (
          <Fade key={i} delay={i * 0.05}>
            <div style={{ background: p.highlight ? "#16a34a" : "white", border: p.highlight ? "none" : "1.5px solid #E5E7EB", borderRadius: 14, padding: "28px 24px", color: p.highlight ? "white" : "#111827", boxShadow: p.highlight ? "0 16px 48px rgba(22,163,74,0.25)" : "none", transform: p.highlight ? "scale(1.02)" : "none", position: "relative" }}>
              {p.highlight && <div style={{ position: "absolute", top: -12, right: 22, background: "#F59E0B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>הכי פופולרי</div>}
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 6 }}>₪{p.price}<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>/חודש</span></div>
              <div style={{ fontSize: 13, opacity: 0.65, marginBottom: 22 }}>{p.desc}</div>
              <div style={{ borderTop: `1px solid ${p.highlight ? "rgba(255,255,255,0.2)" : "#E5E7EB"}`, paddingTop: 18, marginBottom: 22 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 14 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-7" stroke={p.highlight ? "rgba(255,255,255,0.8)" : "#16a34a"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ opacity: 0.85 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={onSignup} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: p.highlight ? "white" : "#16a34a", color: p.highlight ? "#16a34a" : "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>{p.cta}</button>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  </section>

  {/* ── FAQ ── */}
  <section id="faq" style={{ padding: "80px 48px" }}>
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <Fade>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px" }}>שאלות נפוצות</h2>
        </div>
      </Fade>
      {FAQS.map((f, i) => (
        <Fade key={i} delay={i * 0.04}>
          <div style={{ borderBottom: "1px solid #F3F4F6", overflow: "hidden" }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 0", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "right" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{f.q}</span>
              <span style={{ fontSize: 20, color: "#9CA3AF", transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: "0 0 18px", fontSize: 14, color: "#6B7280", lineHeight: 1.8 }}>{f.a}</div>
            )}
          </div>
        </Fade>
      ))}
    </div>
  </section>

  {/* ── CTA ── */}
  <section style={{ padding: "80px 48px", background: "#16a34a", textAlign: "center" }}>
    <Fade>
      <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", letterSpacing: "-1px", margin: "0 0 14px" }}>תתחיל לחסוך זמן היום</h2>
      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 32 }}>14 יום חינם. ללא כרטיס אשראי. ביטול בכל עת.</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", maxWidth: 420, margin: "0 auto" }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="האימייל שלך" style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "none", fontSize: 14, outline: "none", fontFamily: "inherit" }}/>
        <button onClick={onSignup} style={{ padding: "12px 22px", borderRadius: 8, border: "none", background: "white", color: "#16a34a", cursor: "pointer", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>התחל בחינם</button>
      </div>
    </Fade>
  </section>

  {/* ── FOOTER ── */}
  <footer style={{ padding: "32px 48px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><path d="M5 1L6.2 3.8 9.5 4.3 7.3 6.4 7.9 9.7 5 8.2 2.1 9.7 2.7 6.4.5 4.3 3.8 3.8 5 1Z"/></svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: 14 }}>ReviewPilot</span>
    </div>
    <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>© 2025 ReviewPilot · כל הזכויות שמורות</p>
  </footer>
</div>
```

);
}