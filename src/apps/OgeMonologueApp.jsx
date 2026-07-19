import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Puzzle, Search, Pen, GraduationCap, BookOpen, Clock, Activity, Laptop, Building2, Shuffle, Expand, Minimize, Download, Play, Pause, Check, PartyPopper, ThumbsUp, Sun, Moon, ArrowLeft, X } from "lucide-react";

// ── Global styles ─────────────────────────────────────────────────────────────
if (!document.getElementById("mg-s")) {
  const lnk = document.createElement("link");
  lnk.rel = "stylesheet";
  lnk.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(lnk);
  const st = document.createElement("style");
  st.id = "mg-s";
  st.textContent = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#FAFAF7}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulseRing{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.12);opacity:.1}}
    @keyframes recDot{0%,100%{opacity:1}50%{opacity:.1}}
    @keyframes waveBar{0%,100%{height:5px}50%{height:26px}}
    .fade-up{animation:fadeUp .3s ease both}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:16px}
    .act{cursor:pointer;width:100%;border:none;border-radius:13px;padding:16px;font-family:inherit;font-size:.95rem;font-weight:700;transition:opacity .14s,transform .1s;letter-spacing:-.01em}
    .act:hover{opacity:.88}.act:active{transform:scale(.97)}
    .ghost{cursor:pointer;border-radius:11px;padding:12px 10px;font-family:inherit;font-size:.84rem;font-weight:600;border:1.5px solid var(--ghost-border);background:var(--ghost-bg);color:var(--ghost-clr);transition:all .14s;width:100%;text-align:center}
    .ghost:hover{opacity:.8}.ghost:active{transform:scale(.97)}
    .lnk{cursor:pointer;background:none;border:none;font-family:inherit;display:flex;align-items:center;gap:5px;transition:opacity .14s;padding:0}
    .lnk:hover{opacity:.7}
    .tc{cursor:pointer;border-radius:14px;padding:18px 16px;display:flex;align-items:center;gap:12px;border:1px solid transparent;transition:transform .15s,box-shadow .15s}
    .tc:hover{transform:translateY(-2px)}
    .theme-btn{width:38px;height:38px;border-radius:50%;border:2px solid var(--ghost);background:var(--surface);color:var(--app-text);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s ease;flex-shrink:0;font-family:inherit}
    .theme-btn:hover{background:var(--card-hover);border-color:#C4B5F4}
    .ar{-webkit-appearance:none;appearance:none;height:4px;border-radius:4px;cursor:pointer;outline:none;border:none}
    .ar::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#34D399;cursor:pointer}
    .app-scroll{scrollbar-width:thin;scrollbar-color:#44465C transparent}
    .app-scroll::-webkit-scrollbar{width:5px}
    .app-scroll::-webkit-scrollbar-thumb{background:#44465C;border-radius:4px}
    .chip{cursor:pointer;border-radius:10px;padding:10px 14px;font-family:inherit;font-size:.82rem;font-weight:500;border:2px solid;transition:all .15s;text-align:left;line-height:1.45}
    .chip:active{transform:scale(.97)}
    .zone{cursor:pointer;border-radius:10px;padding:10px 14px;font-family:inherit;font-size:.82rem;font-weight:500;border:2px dashed;transition:all .15s;text-align:left;line-height:1.45;width:100%;min-height:46px}
    .zone:active{transform:scale(.98)}
    .inp{width:100%;padding:10px 14px;border-radius:10px;font-family:inherit;font-size:.9rem;border:1.5px solid;outline:none;transition:border-color .15s}
    .inp:focus{border-color:#818CF8 !important}
    textarea.inp{resize:vertical;min-height:200px;line-height:1.6}
  `;
  document.head.appendChild(st);
}

// ── Themes (identical to Speak app) ──────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#0F172A", surface:"#1E293B", border:"#334155",
    text:"#F0F0F0", text2:"#94A3B8", text3:"#64748B", text4:"#94A3B8",
    ghostBg:"#334155", ghostBorder:"#475569", ghostBorderH:"#64748B", ghostClr:"#CBD5E1",
    segBg:"#334155", segBorder:"#475569", segClr:"#CBD5E1",
    track:"#334155", inputBg:"#0F172A", inputBorder:"#475569",
    brand:"#F0F0F0", dim:"#94A3B8", label:"#94A3B8", tcShadow:"rgba(15,23,42,.32)", scrollThumb:"#64748B", ghost:"#334155", cardHover:"#334155",
  },
  light: {
    bg:"#FAFAF7", surface:"#FFFFFF", border:"#E8E4F0",
    text:"#1A2E4A", text2:"#526783", text3:"#6B7C94", text4:"#6B7C94",
    ghostBg:"#F2EFFD", ghostBorder:"#E8E4F0", ghostBorderH:"#C4B5F4", ghostClr:"#526783",
    segBg:"#F2EFFD", segBorder:"#E8E4F0", segClr:"#526783",
    track:"#E8E4F0", inputBg:"#FFFFFF", inputBorder:"#E8E4F0",
    brand:"#1A2E4A", dim:"#526783", label:"#6B7C94", tcShadow:"rgba(26,46,74,.10)", scrollThumb:"#C4B5F4", ghost:"#E8E4F0", cardHover:"#F2EFFD",
  },
};

// ── Level metadata ────────────────────────────────────────────────────────────
const LEVELS = [
  { id:1, name:"Match",       icon:Puzzle,        color:"#93C8EE", bg:"#EAF5FD", darkBg:"#17283C", desc:"Connect each monologue part to the task point it answers" },
  { id:2, name:"Reconstruct", icon:Search,        color:"#C4B5F4", bg:"#F2EFFD", darkBg:"#2A2242", desc:"Read the monologue and work out the original task" },
  { id:3, name:"Speak",       icon:Mic,           color:"#F5C9A8", bg:"#FEF3EC", darkBg:"#3A2922", desc:"Answer one task point out loud in 30 seconds" },
  { id:4, name:"Write",       icon:Pen,           color:"#A8D5B2", bg:"#EBF6EE", darkBg:"#20362A", desc:"Write a full model monologue from the task card" },
  { id:5, name:"Exam",        icon:GraduationCap, color:"#F5AABC", bg:"#FEF0F3", darkBg:"#3A2530", desc:"Full exam simulation with preparation and speaking timers" },
];

const PREP_DURATIONS = [5, 10, 20, 30];

// ── Appearance options ────────────────────────────────────────────────────────
const BG_OPTIONS = {
  dark: [
    { value:"#0B0C14", label:"Navy"      },
    { value:"#141517", label:"Charcoal"  },
    { value:"#1C1C1E", label:"Soft Black"},
    { value:"#000000", label:"Black"     },
  ],
  light: [
    { value:"#F3F4FB", label:"Blue-grey" },
    { value:"#FFFFFF",  label:"White"    },
    { value:"#F5F0EB", label:"Warm"      },
    { value:"#EBEBF0", label:"Cool Grey" },
  ],
};
const TEXT_OPTIONS = {
  dark: [
    { value:"#EEEEF4", label:"Off-white" },
    { value:"#FFFFFF",  label:"White"    },
    { value:"#C0C2D4", label:"Grey"      },
  ],
  light: [
    { value:"#0F1020", label:"Near-black"},
    { value:"#000000",  label:"Black"    },
    { value:"#2C2C3E", label:"Dark Blue" },
  ],
};
const TASK_CARDS = [
  {
    id:"school", category:"School", icon:BookOpen, color:"#93C8EE", bg:"#EAF5FD",
    taskTopic:"your school", monologueTopic:"school",
    points:[
      "what your typical school day is like",
      "what your favourite subject is, and why",
      "what you like most about your school",
      "what your attitude to your school life is",
    ],
    monologue:{
      intro:"I'm going to give a talk about school.",
      paragraphs:[
        "My typical school day is really busy. My lessons usually start at eight thirty and I study from Monday to Friday. At twelve o'clock there is a break for lunch. I usually come home at three in the afternoon and start doing my homework.",
        "My favourite subject is English because it is very interesting and useful for my future career. I also enjoy watching films and series in English, which helps me improve my speaking and listening skills a lot.",
        "Most of all I like my school for the teachers because they are very supportive and kind. They always explain things clearly and help me whenever I don't understand a topic.",
        "In general, my attitude to my school life is positive. Of course, I am sometimes tired and don't feel like doing homework, but there are many good things about school, especially my friends and the interesting lessons.",
      ],
      outro:"That's all that I wanted to tell you about school.",
    },
  },
  {
    id:"daily-routine", category:"Daily Life", icon:Clock, color:"#A8D5B2", bg:"#EBF6EE",
    taskTopic:"your daily routine", monologueTopic:"my daily routine",
    points:[
      "what time you usually get up and how you get to school",
      "what you usually do after school",
      "how you spend your evenings",
      "what you would like to change about your daily routine",
    ],
    monologue:{
      intro:"I'm going to give a talk about my daily routine.",
      paragraphs:[
        "I usually get up at seven o'clock on weekdays because school starts at half past eight. I have a quick breakfast and then take the bus to school, which takes about twenty minutes. I try not to be late.",
        "After school I go home and have lunch. Then I do my homework, which usually takes about two hours. Sometimes I go to an after-school sports club or meet my friends in the park.",
        "In the evenings I like to relax and watch something interesting online or read a book. I also spend time with my family over dinner. I usually go to bed at around ten o'clock.",
        "If I could change something about my daily routine, I would sleep a little longer in the morning. I would also like to have more free time for my hobbies, such as drawing and playing guitar.",
      ],
      outro:"That's all that I wanted to tell you about my daily routine.",
    },
  },
  {
    id:"sport", category:"Sport & Health", icon:Activity, color:"#F5C9A8", bg:"#FEF3EC",
    taskTopic:"sport and a healthy lifestyle", monologueTopic:"sport and a healthy lifestyle",
    points:[
      "what sport or physical activity you do regularly",
      "why sport is important for teenagers",
      "what you do to stay healthy",
      "what sport you would recommend to your friends and why",
    ],
    monologue:{
      intro:"I'm going to give a talk about sport and a healthy lifestyle.",
      paragraphs:[
        "I play football twice a week with my school team and go for a run in the park at weekends. I have been playing football since I was seven years old. It keeps me fit and energetic throughout the week.",
        "Sport is very important for teenagers because it helps to develop a strong and healthy body. It also teaches us teamwork, discipline, and how to deal with both success and failure. Regular exercise also improves concentration and mood.",
        "To stay healthy, I try to eat balanced meals with plenty of vegetables and fruit. I avoid fast food and sugary drinks as much as possible. I also make sure I get enough sleep every night, which is essential for a teenager.",
        "I would recommend swimming to my friends because it is a great workout for the whole body and easy on the joints. It is also a very useful life skill. Most sports centres have a pool, so anyone can start at any level.",
      ],
      outro:"That's all that I wanted to tell you about sport and a healthy lifestyle.",
    },
  },
  {
    id:"technology", category:"Technology", icon:Laptop, color:"#C4B5F4", bg:"#F2EFFD",
    taskTopic:"technology and the Internet", monologueTopic:"technology and the Internet",
    points:[
      "how often you use the Internet and what for",
      "what the main advantages of the Internet are",
      "what dangers the Internet can have for teenagers",
      "whether you think life would be possible without the Internet today",
    ],
    monologue:{
      intro:"I'm going to give a talk about technology and the Internet.",
      paragraphs:[
        "I use the Internet every day for many different purposes. I look up information for school projects, watch educational videos, and communicate with my classmates. In my free time I enjoy streaming music and films.",
        "The Internet has many important advantages. It gives us instant access to almost any information we need. We can study online, learn new languages, and stay in touch with friends and family who live far away.",
        "However, the Internet can also be dangerous for teenagers. Spending too much time on social media can lead to addiction and affect mental health. There is also the serious problem of cyberbullying and unreliable information online.",
        "I think life without the Internet today would be extremely difficult. Almost everything depends on it: education, medicine, business, and communication. I believe the Internet is now as essential to modern life as electricity.",
      ],
      outro:"That's all that I wanted to tell you about technology and the Internet.",
    },
  },
  {
    id:"my-town", category:"My Town", icon:Building2, color:"#F5AABC", bg:"#FEF0F3",
    taskTopic:"the place where you live", monologueTopic:"the place where I live",
    points:[
      "what the place where you live is like",
      "what you can do there in your free time",
      "what you like most about the place where you live",
      "what you would like to improve in your town or city",
    ],
    monologue:{
      intro:"I'm going to give a talk about the place where I live.",
      paragraphs:[
        "I live in a medium-sized city in Russia. It is not a very large city, but it has everything you need: schools, hospitals, parks, and shopping centres. The city has a long history and some beautiful old buildings in the centre.",
        "In my free time I can go to the cinema, visit the local museum, or take a walk in the park by the river. There are also several sports centres and a theatre in my city. In summer, many young people gather in the central park to relax.",
        "What I like most about my city is that it feels safe and friendly. I know many people in my neighbourhood and feel comfortable walking around. The city is also not too crowded or noisy, which makes it a very pleasant place to live.",
        "If I could improve something, I would build more modern facilities for young people, such as a skate park and an outdoor cinema. I would also improve public transport and add more cycling lanes to make the city greener and easier to get around.",
      ],
      outro:"That's all that I wanted to tell you about the place where I live.",
    },
  },
];

// ── Shared Components ─────────────────────────────────────────────────────────
function CircleTimer({ timeLeft, total, color, sub, pulse, trackColor = "#181926" }) {
  const R = 78, SZ = 200, C = 2 * Math.PI * R;
  const off = C * (1 - (total > 0 ? timeLeft / total : 0));
  const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
  return (
    <div style={{ position:"relative", width:SZ, height:SZ, margin:"0 auto" }}>
      {pulse && <div style={{ position:"absolute", inset:-14, border:`2px solid ${color}`, borderRadius:"50%", animation:"pulseRing 1.8s ease-in-out infinite", pointerEvents:"none" }} />}
      <svg width={SZ} height={SZ} style={{ display:"block", transform:"rotate(-90deg)" }}>
        <circle cx="100" cy="100" r={R} fill="none" stroke={trackColor} strokeWidth="10" />
        <circle cx="100" cy="100" r={R} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off}
          style={{ transition:"stroke-dashoffset .9s linear", filter:`drop-shadow(0 0 8px ${color}70)` }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:"2.4rem", fontWeight:800, color, letterSpacing:"-.03em", lineHeight:1 }}>{m}:{s.toString().padStart(2,"0")}</span>
        {sub && <span style={{ fontSize:".6rem", fontWeight:700, color:color+"80", letterSpacing:".12em", textTransform:"uppercase", marginTop:5 }}>{sub}</span>}
      </div>
    </div>
  );
}

function WaveBars({ color }) {
  const delays = [0,.12,.24,.36,.48,.36,.24,.12,0];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, height:36, marginTop:14 }}>
      {delays.map((d,i) => <div key={i} style={{ width:4, borderRadius:3, background:color, height:5, animation:`waveBar 1.1s ${d}s ease-in-out infinite` }} />)}
    </div>
  );
}

function AudioPlayer({ src }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ct, setCt] = useState(0);
  const [dur, setDur] = useState(0);
  const fmt = t => `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,"0")}`;
  const toggle = () => { if(!ref.current) return; if(playing){ref.current.pause();setPlaying(false);}else{ref.current.play();setPlaying(true);} };
  const pct = dur > 0 ? (ct/dur)*100 : 0;
  return (
    <div>
      <audio ref={ref} src={src} onTimeUpdate={()=>setCt(ref.current?.currentTime||0)} onLoadedMetadata={()=>setDur(ref.current?.duration||0)} onEnded={()=>setPlaying(false)} />
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <button onClick={toggle} style={{ cursor:"pointer", width:44, height:44, borderRadius:"50%", background:"#34D39920", border:"1.5px solid #34D39950", color:"#34D399", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"inherit", transition:"all .14s" }}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
        <div style={{ flex:1 }}>
          <input type="range" className="ar" min="0" max={dur||1} step=".05" value={ct}
            onChange={e=>{if(ref.current)ref.current.currentTime=+e.target.value;setCt(+e.target.value);}}
            style={{ width:"100%", background:`linear-gradient(to right,#34D399 ${pct}%,#1E2135 ${pct}%)` }} />
        </div>
        <span style={{ fontSize:".75rem", fontWeight:600, color:"#44465C", minWidth:38, textAlign:"right" }}>{fmt(ct)}</span>
      </div>
    </div>
  );
}



function LevelNavigation({ onBack, onHome, T }) {
  return (
    <div style={{position:"sticky",top:0,zIndex:20,width:"100%",maxWidth:680,padding:"16px 20px 8px",display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bg,flexShrink:0}}>
      <button className="lnk" onClick={onBack} style={{color:T.text2,fontSize:".83rem",fontWeight:600}}><ArrowLeft size={16} /> Back</button>
      <button
        type="button"
        onClick={onHome}
        aria-label="Return to level selection"
        style={{display:"inline-flex",alignItems:"center",gap:6,border:`1px solid ${T.ghostBorder}`,borderRadius:999,background:T.surface,color:T.ghostClr,padding:"8px 12px",fontFamily:"inherit",fontSize:".75rem",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(26,46,74,.10)"}}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-6h6v6"/></svg>
        Home
      </button>
    </div>
  );
}
const SliderIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6"/><circle cx="8" cy="6" r="2.5" fill="currentColor" stroke="none"/>
    <line x1="4" y1="12" x2="20" y2="12"/><circle cx="16" cy="12" r="2.5" fill="currentColor" stroke="none"/>
    <line x1="4" y1="18" x2="20" y2="18"/><circle cx="10" cy="18" r="2.5" fill="currentColor" stroke="none"/>
  </svg>
);

// ── Settings Popup ────────────────────────────────────────────────────────────
function SettingsPopup({ customTheme, onApply, onReset, onClose, T }) {
  const [tab, setTab] = useState("dark");
  const defaults = { dark:{ bg:"#0B0C14", text:"#EEEEF4" }, light:{ bg:"#F3F4FB", text:"#0F1020" } };
  const curBg   = (tab==="dark" ? customTheme.darkBg   : customTheme.lightBg)   || defaults[tab].bg;
  const curText = (tab==="dark" ? customTheme.darkText : customTheme.lightText) || defaults[tab].text;
  const applyBg   = v => onApply({ [tab==="dark" ? "darkBg"   : "lightBg"]:   v });
  const applyText = v => onApply({ [tab==="dark" ? "darkText" : "lightText"]: v });
  const acc = "#818CF8";

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", zIndex:200 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, width:"100%", maxWidth:440, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.45)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontWeight:700, fontSize:".95rem", color:T.text }}>Appearance</span>
          <button onClick={onClose} style={{ cursor:"pointer", background:"none", border:"none", color:T.text2, lineHeight:1, padding:"2px 8px", borderRadius:6, fontFamily:"inherit", display:"flex", alignItems:"center" }}><X size={18} /></button>
        </div>

        {/* Theme tabs */}
        <div style={{ display:"flex", gap:8, padding:"14px 20px 0" }}>
          {["dark","light"].map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{
              cursor:"pointer", padding:"7px 20px", borderRadius:20, fontFamily:"inherit",
              fontSize:".83rem", fontWeight:700, border:"none", transition:"all .15s",
              background: tab===t ? acc+"22" : "transparent",
              color: tab===t ? acc : T.text2,
              outline: tab===t ? `1.5px solid ${acc}50` : "none",
            }}>
              {t==="dark" ? <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Moon size={14} /> Dark</span> : <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Sun size={14} /> Light</span>}
            </button>
          ))}
        </div>

        <div style={{ padding:"16px 20px 20px" }}>

          {/* Background row */}
          <p style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".1em", color:T.label, textTransform:"uppercase", marginBottom:10 }}>Background</p>
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            {BG_OPTIONS[tab].map(opt => {
              const on = curBg===opt.value;
              return (
                <div key={opt.value} style={{ flex:1, textAlign:"center" }}>
                  <button onClick={()=>applyBg(opt.value)} title={opt.label} style={{
                    width:"100%", aspectRatio:"1", borderRadius:12, cursor:"pointer", display:"block",
                    background:opt.value,
                    border:`2.5px solid ${on ? acc : "rgba(128,128,128,.2)"}`,
                    boxShadow: on ? `0 0 0 2px ${acc}40` : "0 1px 4px rgba(0,0,0,.2)",
                    transition:"all .15s",
                  }}>
                    {on && <span style={{ color:acc, display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}><Check size={18} strokeWidth={3} /></span>}
                  </button>
                  <p style={{ fontSize:".62rem", color:T.text4, marginTop:5 }}>{opt.label}</p>
                </div>
              );
            })}
          </div>

          {/* Font row — shown ON the selected background */}
          <p style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".1em", color:T.label, textTransform:"uppercase", marginBottom:10 }}>Text colour</p>
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            {TEXT_OPTIONS[tab].map(opt => {
              const on = curText===opt.value;
              return (
                <div key={opt.value} style={{ flex:1, textAlign:"center" }}>
                  <button onClick={()=>applyText(opt.value)} title={opt.label} style={{
                    width:"100%", aspectRatio:"1", borderRadius:12, cursor:"pointer", display:"flex",
                    alignItems:"center", justifyContent:"center",
                    background:curBg,
                    border:`2.5px solid ${on ? acc : "rgba(128,128,128,.2)"}`,
                    boxShadow: on ? `0 0 0 2px ${acc}40` : "0 1px 4px rgba(0,0,0,.15)",
                    transition:"all .15s", color:opt.value, fontSize:"1.1rem", fontWeight:800, fontFamily:"inherit",
                  }}>
                    Aa
                  </button>
                  <p style={{ fontSize:".62rem", color:T.text4, marginTop:5 }}>{opt.label}</p>
                </div>
              );
            })}
          </div>

          {/* Live preview */}
          <div style={{ borderRadius:13, padding:"14px 16px", background:curBg, border:"1px solid rgba(128,128,128,.15)", marginBottom:16 }}>
            <p style={{ fontSize:".58rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:curText, opacity:.45, marginBottom:8 }}>Preview</p>
            <p style={{ fontSize:".92rem", fontWeight:700, color:curText, marginBottom:5, lineHeight:1.3 }}>{"I'm going to give a talk about school."}</p>
            <p style={{ fontSize:".8rem", color:curText, opacity:.7, lineHeight:1.5 }}>{"My typical school day is really busy. My lessons usually start at eight thirty..."}</p>
          </div>

          <button onClick={onReset} style={{ width:"100%", padding:"11px", borderRadius:10, background:"transparent", border:`1px solid ${T.border}`, color:T.text2, fontFamily:"inherit", fontSize:".83rem", cursor:"pointer" }}>
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Level 1 — Match ───────────────────────────────────────────────────────────
function Level1Match({ card, T, onBack, onComplete }) {
  const parts = [
    { label:"Introduction", text:card.monologue.intro },
    { label:"Point 1",      text:card.monologue.paragraphs[0] },
    { label:"Point 2",      text:card.monologue.paragraphs[1] },
    { label:"Point 3",      text:card.monologue.paragraphs[2] },
    { label:"Point 4",      text:card.monologue.paragraphs[3] },
    { label:"Conclusion",   text:card.monologue.outro },
  ];
  const [chipOrder] = useState(() => {
    const o = [0,1,2,3,4,5];
    for (let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]];}
    return o;
  });
  const [sel, setSel]           = useState(null); // selected original idx
  const [placements, setPlace]  = useState({});   // zoneIdx -> origIdx
  const [checked, setChecked]   = useState(false);
  const [score, setScore]       = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);

  const preview = t => { const w=t.split(" "); return w.length>9?w.slice(0,9).join(" ")+"...":t; };
  const isPlaced = oi => Object.values(placements).includes(oi);

  const tapChip = (oi) => {
    if (checked) return;
    if (sel === oi) { setSel(null); return; }
    // if placed in a zone, lift it
    const z = Object.keys(placements).find(k => placements[k] === oi);
    if (z !== undefined) {
      const np={...placements}; delete np[parseInt(z)];
      setPlace(np); setSel(oi); return;
    }
    setSel(oi);
  };

  const tapZone = (zi) => {
    if (checked) return;
    if (sel === null) {
      if (placements[zi] !== undefined) {
        const np={...placements}; const lifted=np[zi]; delete np[zi];
        setPlace(np); setSel(lifted);
      }
      return;
    }
    setPlace({...placements, [zi]:sel}); setSel(null);
  };

  const handleCheck = () => {
    let s=0; for(let z=0;z<6;z++){if(placements[z]===z)s++;} setScore(s); setChecked(true);
    if(s>=5) onComplete(card.id);
  };

  const reset = () => { setPlace({}); setSel(null); setChecked(false); setScore(0); setShowCorrect(false); };

  const WRAP={width:"100%",maxWidth:680,padding:"16px 20px 52px"};

  return (
    <div className="fade-up" style={WRAP}>
      {/* Task card */}
      <div className="card" style={{padding:"16px 18px",marginBottom:20,background:T.surface,borderColor:T.border}}>
        <p style={{fontSize:".63rem",fontWeight:700,letterSpacing:".1em",color:T.label,textTransform:"uppercase",marginBottom:8}}>Task — {card.taskTopic}</p>
        {card.points.map((p,i) => <p key={i} style={{fontSize:".88rem",color:T.text2,marginBottom:4}}><span style={{color:card.color,fontWeight:700}}>{i+1}.</span> {p}</p>)}
      </div>

      {/* Chips */}
      <p style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",color:T.label,textTransform:"uppercase",marginBottom:10}}>1. Tap a part to select it</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
        {chipOrder.map(oi => {
          const placed=isPlaced(oi), selected=sel===oi;
          const color = selected ? card.color : placed ? T.text4 : T.text2;
          const bg = selected ? card.color+"18" : placed ? T.surface : T.ghostBg;
          const border = selected ? card.color : placed ? T.border : T.ghostBorder;
          return (
            <button key={oi} className="chip" onClick={()=>tapChip(oi)}
              style={{color,background:bg,borderColor:border,opacity:placed&&!selected?.5:1,flex:"1 0 calc(50% - 4px)"}}>
              {preview(parts[oi].text)}
            </button>
          );
        })}
      </div>

      {/* Zones */}
      <p style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",color:T.label,textTransform:"uppercase",marginBottom:10}}>2. Tap a zone to place it</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
        {[0,1,2,3,4,5].map(zi => {
          const placed=placements[zi]; const hasSel=sel!==null;
          const displayedPart = checked && showCorrect ? zi : placed;
          const isCorrect=checked&&(showCorrect||placed===zi), isWrong=checked&&!showCorrect&&placed!==undefined&&placed!==zi;
          const borderColor = isCorrect?"#34D399":isWrong?"#FB7185":hasSel&&!checked?card.color:T.border;
          const bgColor = isCorrect?"#34D39912":isWrong?"#FB718512":T.surface;
          return (
            <div key={zi} style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <span style={{fontSize:".78rem",fontWeight:700,color:T.text2,minWidth:88,paddingTop:12,flexShrink:0}}>{parts[zi].label}</span>
              <button className="zone" onClick={()=>tapZone(zi)}
                style={{background:bgColor,borderColor,color:placed!==undefined?T.text:T.text4,borderStyle:hasSel&&!checked&&placed===undefined?"solid":"dashed"}}>
                {displayedPart!==undefined ? preview(parts[displayedPart].text) : <span style={{fontSize:".78rem",color:T.label}}>tap to place</span>}
                {isWrong && <span style={{display:"block",fontSize:".72rem",color:"#34D399",marginTop:4}}>✓ {parts[zi].label}</span>}
              </button>
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button className="act" onClick={handleCheck} disabled={Object.keys(placements).length<6}
          style={{background:Object.keys(placements).length<6?"#1E2135":"linear-gradient(135deg,#818CF8,#A78BFA)",color:Object.keys(placements).length<6?T.text4:"#fff"}}>
          Check answers
        </button>
      ) : (
        <div>
          <div style={{textAlign:"center",padding:"16px 0 20px"}}>
            <p style={{fontSize:"1.5rem",fontWeight:800,color:score>=5?"#34D399":score>=3?"#FBBF24":"#FB7185"}}>{score}/6 correct</p>
            <p style={{fontSize:".88rem",color:T.text2,marginTop:4}}>{score===6?"Perfect!":score>=4?"Good job — review the highlighted zones.":"Keep practising — check the zones in red."}</p>
          </div>
          <button className="ghost" onClick={()=>setShowCorrect(v=>!v)} style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr,marginBottom:9}}>
            {showCorrect ? "Hide correct answers" : "Show correct answers"}
          </button>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={reset}>Try again</button>
            <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={onBack}>New card</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Level 2 — Reconstruct ─────────────────────────────────────────────────────
function Level2Reconstruct({ card, T, onBack, onComplete }) {
  const [topicAns, setTopicAns]     = useState("");
  const [pointAns, setPointAns]     = useState(["","","",""]);
  const [outroAns, setOutroAns]     = useState("");
  const [checked, setChecked]       = useState(false);
  const [showMono, setShowMono]     = useState(false);

  const WRAP={width:"100%",maxWidth:680,padding:"16px 20px 52px"};
  const labels=["Introduction","Point 1","Point 2","Point 3","Point 4","Conclusion"];
  const allParts=[card.monologue.intro,...card.monologue.paragraphs,card.monologue.outro];

  const handleCheck = () => { setChecked(true); onComplete(card.id); };
  const reset = () => { setTopicAns(""); setPointAns(["","","",""]); setOutroAns(""); setChecked(false); };

  const InpBlock = ({label, value, onChange, model, hint}) => (
    <div style={{marginBottom:16}}>
      <p style={{fontSize:".78rem",fontWeight:700,color:T.text2,marginBottom:6}}>{label}</p>
      {hint && <p style={{fontSize:".75rem",color:T.text4,marginBottom:6,fontStyle:"italic"}}>{hint}</p>}
      <input className="inp" value={value} onChange={e=>onChange(e.target.value)}
        style={{background:T.inputBg,borderColor:T.inputBorder,color:T.text}} disabled={checked} />
      {checked && <div style={{marginTop:6,padding:"8px 12px",borderRadius:8,background:"#34D39912",border:"1px solid #34D39930"}}>
        <p style={{fontSize:".72rem",fontWeight:700,color:"#34D399",marginBottom:2}}>Model answer</p>
        <p style={{fontSize:".85rem",color:T.text}}>{model}</p>
      </div>}
    </div>
  );

  return (
    <div className="fade-up" style={WRAP}>
      {/* Monologue display */}
      <div className="card" style={{padding:"18px 18px",marginBottom:20,background:T.surface,borderColor:T.border}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <p style={{fontSize:".63rem",fontWeight:700,letterSpacing:".1em",color:T.label,textTransform:"uppercase"}}>Full monologue</p>
          <button className="lnk" onClick={()=>setShowMono(v=>!v)} style={{color:card.color,fontSize:".78rem",fontWeight:700}}>{showMono?"Hide ▲":"Read ▼"}</button>
        </div>
        {showMono && allParts.map((t,i) => (
          <div key={i} style={{marginBottom:10,paddingLeft:12,borderLeft:`3px solid ${i===0||i===5?card.color+"60":card.color+"30"}`}}>
            <p style={{fontSize:".65rem",fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:3}}>{labels[i]}</p>
            <p style={{fontSize:".9rem",color:T.text,lineHeight:1.6}}>{t}</p>
          </div>
        ))}
        {!showMono && <p style={{fontSize:".85rem",color:T.text4}}>Tap "Read" to reveal the monologue, then answer the questions below.</p>}
      </div>

      {/* Questions */}
      <p style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",color:T.label,textTransform:"uppercase",marginBottom:14}}>Identify the task</p>

      <InpBlock label="A. What topic does the speaker talk about?"
        hint="Read the introduction — what subject is the talk about?"
        value={topicAns} onChange={setTopicAns} model={card.monologueTopic} />

      {card.points.map((p,i) => (
        <InpBlock key={i} label={`B${i+1}. What does paragraph ${i+1} answer?`}
          hint={`Hint: it answers one of the four task points`}
          value={pointAns[i]} onChange={v=>{const a=[...pointAns];a[i]=v;setPointAns(a);}} model={p} />
      ))}

      <InpBlock label="C. Complete the conclusion"
        hint={`"That's all ..."`}
        value={outroAns} onChange={setOutroAns} model={`That's all that I wanted to tell you about ${card.monologueTopic}.`} />

      {!checked ? (
        <button className="act" onClick={handleCheck}
          style={{background:"linear-gradient(135deg,#C084FC,#818CF8)",color:"#fff",marginTop:8}}>
          Check my answers
        </button>
      ) : (
        <div>
          <p style={{textAlign:"center",fontSize:".9rem",color:T.text2,margin:"16px 0 20px"}}>Compare your answers with the model answers above.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={reset}>Try again</button>
            <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={onBack}>New card</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Level 3 — Speak ───────────────────────────────────────────────────────────
function Level3Speak({ card, T, pointIdx, onBack, onComplete, onNewPoint }) {
  const [phase, setPhase]   = useState("prep");
  const [timeLeft, setLeft] = useState(5);
  const [prepSeconds, setPrepSeconds] = useState(5);
  const [audioURL, setURL]  = useState(null);
  const [noMic, setNoMic]   = useState(false);
  const [trig, setTrig]     = useState(null);
  const mrRef=useRef(null),chunksRef=useRef([]),timerRef=useRef(null),mimeRef=useRef("audio/webm");
  const CardIcon = card.icon;

  const doRecord = useCallback(async () => {
    clearInterval(timerRef.current); setNoMic(false);
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported("audio/webm")?"audio/webm":"audio/mp4";
      mimeRef.current=mime; chunksRef.current=[];
      const mr=new MediaRecorder(stream,{mimeType:mime}); mrRef.current=mr;
      mr.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};
      mr.onstop=()=>{const blob=new Blob(chunksRef.current,{type:mime});setURL(URL.createObjectURL(blob));stream.getTracks().forEach(t=>t.stop());};
      mr.start(); setLeft(30); setPhase("speaking");
    } catch { setNoMic(true); setLeft(30); setPhase("speaking"); }
  },[]);

  const doStop = useCallback(()=>{ clearInterval(timerRef.current); if(mrRef.current?.state!=="inactive")mrRef.current?.stop(); setPhase("review"); },[]);

  useEffect(()=>{
    if(phase!=="prep"&&phase!=="speaking") return;
    timerRef.current=setInterval(()=>setLeft(p=>{if(p<=1){clearInterval(timerRef.current);setTrig(phase==="prep"?"record":"stop");return 0;}return p-1;}),1000);
    return ()=>clearInterval(timerRef.current);
  },[phase, prepSeconds]);

  useEffect(()=>{if(!trig)return;const t=trig;setTrig(null);if(t==="record")doRecord();else doStop();},[trig,doRecord,doStop]);

  const download=()=>{if(!audioURL)return;const a=document.createElement("a");a.href=audioURL;a.download=`speak_${card.id}_${Date.now()}.${mimeRef.current.includes("mp4")?"mp4":"webm"}`;document.body.appendChild(a);a.click();document.body.removeChild(a);};
  const selectPrepTime = (seconds) => {
    setPrepSeconds(seconds);
    setLeft(seconds);
  };

  const WRAP={width:"100%",maxWidth:680,padding:"16px 20px 52px",display:"flex",flexDirection:"column",alignItems:"center"};

  if (phase==="prep") return (
    <div className="fade-up" style={WRAP}>
      <div className="chip" style={{background:card.bg,borderColor:card.color+"40",color:card.color,fontSize:".8rem",fontWeight:700,marginBottom:24,cursor:"default",display:"inline-flex",alignItems:"center",gap:6}}><CardIcon size={15} strokeWidth={2.2} /> {card.category}</div>
      <h2 style={{fontSize:"1.4rem",fontWeight:800,textAlign:"center",marginBottom:6,color:T.text}}>Prepare your answer</h2>
      <p style={{fontSize:".87rem",color:T.text2,textAlign:"center",marginBottom:30}}>Recording starts automatically</p>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:9,marginBottom:22}}>
        <p style={{fontSize:".65rem",fontWeight:700,letterSpacing:".1em",color:T.label,textTransform:"uppercase"}}>Preparation time</p>
        <div style={{display:"flex",gap:7,padding:4,borderRadius:999,background:T.ghostBg,border:`1px solid ${T.ghostBorder}`}}>
          {PREP_DURATIONS.map((seconds) => {
            const selected = prepSeconds === seconds;
            return (
              <button
                key={seconds}
                type="button"
                onClick={() => selectPrepTime(seconds)}
                aria-pressed={selected}
                style={{cursor:"pointer",minWidth:43,padding:"7px 8px",borderRadius:999,border:"none",background:selected ? "#C4B5F4" : "transparent",color:selected ? "#1A2E4A" : T.ghostClr,fontFamily:"inherit",fontSize:".72rem",fontWeight:700,transition:"background .15s,color .15s"}}
              >
                {seconds}s
              </button>
            );
          })}
        </div>
      </div>
      <CircleTimer timeLeft={timeLeft} total={prepSeconds} color="#7963B0" sub="prep" trackColor={T.track} />
      <div className="card" style={{marginTop:28,width:"100%",padding:"16px 18px",background:T.surface,borderColor:T.border}}>
        <p style={{fontSize:".63rem",fontWeight:700,letterSpacing:".1em",color:T.label,textTransform:"uppercase",marginBottom:8}}>Your point</p>
        <p style={{fontSize:"1rem",fontWeight:600,lineHeight:1.6,color:T.text}}>{card.points[pointIdx]}</p>
      </div>
      <button className="act" onClick={doRecord} style={{marginTop:16,background:"#FB923C16",border:"1.5px solid #FB923C40",color:"#FB923C",fontWeight:600,fontSize:".9rem"}}>Start recording now →</button>
    </div>
  );

  if (phase==="speaking") return (
    <div className="fade-up" style={WRAP}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
        {noMic?<span style={{fontSize:".75rem",fontWeight:700,color:"#818CF8",letterSpacing:".1em",textTransform:"uppercase"}}>Practicing</span>:<><span style={{width:9,height:9,borderRadius:"50%",background:"#FB7185",display:"inline-block",animation:"recDot 1.2s ease-in-out infinite"}}/><span style={{fontSize:".75rem",fontWeight:700,color:"#FB7185",letterSpacing:".1em",textTransform:"uppercase"}}>Recording</span></>}
      </div>
      {noMic && <div style={{width:"100%",marginBottom:16,background:"#FBBF2410",border:"1px solid #FBBF2430",borderRadius:10,padding:"10px 14px",fontSize:".8rem",color:"#FBBF24"}}>No mic access — timer only mode.</div>}
      <CircleTimer timeLeft={timeLeft} total={30} color={noMic?"#818CF8":"#FB7185"} sub="speaking" pulse={!noMic} trackColor={T.track} />
      <WaveBars color={noMic?"#818CF880":"#FB7185"} />
      <div className="card" style={{marginTop:24,width:"100%",padding:"14px 18px",background:T.surface,borderColor:T.border}}>
        <p style={{fontSize:".63rem",fontWeight:700,letterSpacing:".1em",color:T.label,textTransform:"uppercase",marginBottom:6}}>Your point</p>
        <p style={{fontSize:".95rem",color:T.dim,lineHeight:1.6}}>{card.points[pointIdx]}</p>
      </div>
      <button className="act" onClick={doStop} style={{marginTop:16,background:"#FB718514",border:"1.5px solid #FB718540",color:"#FB7185",fontWeight:600,fontSize:".9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="1.5"/></svg>
        {noMic?"End practice":"Stop recording"}
      </button>
    </div>
  );

  return (
    <div className="fade-up" style={{...WRAP,alignItems:"stretch"}}>
      <div style={{textAlign:"center",paddingTop:16,paddingBottom:24}}>
        <div style={{marginBottom:8,color:"#34D399"}}><PartyPopper size={40} strokeWidth={2} /></div>
        <h2 style={{fontSize:"1.6rem",fontWeight:800,color:T.text,marginBottom:4}}>Well done!</h2>
        <p style={{fontSize:".88rem",color:T.text2}}>{noMic?"Practice session complete":"Listen back and download your answer"}</p>
      </div>
      <div className="card" style={{padding:"16px 18px",marginBottom:12,background:T.surface,borderColor:T.border}}>
        <p style={{fontSize:".63rem",fontWeight:700,letterSpacing:".1em",color:T.label,textTransform:"uppercase",marginBottom:6}}>Point you answered</p>
        <p style={{fontSize:".95rem",color:T.dim,lineHeight:1.6}}>{card.points[pointIdx]}</p>
      </div>
      {!noMic && audioURL && <div className="card" style={{padding:"18px 18px",marginBottom:12,background:T.surface,borderColor:T.border}}><AudioPlayer src={audioURL}/></div>}
      {!noMic && audioURL && <button className="act" onClick={download} style={{background:"#34D39916",border:"1.5px solid #34D39940",color:"#34D399",fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Download size={18} /> Download</button>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={onNewPoint}>Another point</button>
        <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={onBack}>New card</button>
      </div>
    </div>
  );
}

// ── Level 4 — Write ───────────────────────────────────────────────────────────
function Level4Write({ card, T, onBack, onComplete }) {
  const [text, setText]         = useState("");
  const [showHint, setHint]     = useState(false);
  const [revealed, setRevealed] = useState(0); // 0=none, 1=intro, 2-5=paras, 6=outro
  const [saved, setSaved]       = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sents = (text.match(/[.!?]+/g)||[]).length;
  const allParts = [card.monologue.intro,...card.monologue.paragraphs,card.monologue.outro];
  const revLabels = ["Introduction","Point 1","Point 2","Point 3","Point 4","Conclusion"];

  const handleSave = () => {
    const a=document.createElement("a"); a.href="data:text/plain;charset=utf-8,"+encodeURIComponent(text);
    a.download=`monologue_${card.id}.txt`; document.body.appendChild(a); a.click(); document.body.removeChild(a); setSaved(true);
    if(words>=60) onComplete(card.id);
  };

  const WRAP={width:"100%",maxWidth:680,padding:"16px 20px 52px"};
  const taskText="#1A2E4A";
  const taskTextMuted="rgba(26,46,74,.78)";

  return (
    <div className="fade-up" style={WRAP}>
      {/* Task card */}
      <div style={{marginBottom:20,padding:"16px 18px",borderRadius:16,border:`2px solid ${card.color}50`,background:card.bg}}>
        <p style={{fontSize:".7rem",fontWeight:700,color:taskText,letterSpacing:".08em",textTransform:"uppercase",marginBottom:8}}>Task 3 — give a talk about {card.taskTopic}</p>
        <p style={{fontSize:".83rem",color:taskTextMuted,marginBottom:8}}>You will have to start in 1.5 minutes and speak for not more than 2 minutes (10–12 sentences). Remember to say:</p>
        {card.points.map((p,i)=><p key={i} style={{fontSize:".88rem",color:taskTextMuted,marginBottom:4}}>• {p}</p>)}
      </div>

      {/* Structure hint */}
      <button className="lnk" onClick={()=>setHint(v=>!v)} style={{color:card.color,fontSize:".82rem",fontWeight:700,marginBottom:10}}>{showHint?"▲ Hide structure":"▼ Show structure hint"}</button>
      {showHint && <div className="card" style={{padding:"14px 16px",marginBottom:14,background:T.surface,borderColor:T.border}}>
        {[["Intro",`"I'm going to give a talk about ${card.monologueTopic}."`],
          ["Point 1",`2–3 sentences about: ${card.points[0]}`],
          ["Point 2",`2–3 sentences about: ${card.points[1]}`],
          ["Point 3",`2–3 sentences about: ${card.points[2]}`],
          ["Point 4",`2–3 sentences about: ${card.points[3]}`],
          ["Outro",`"That's all that I wanted to tell you about ${card.monologueTopic}."`],
        ].map(([l,t],i)=><div key={i} style={{marginBottom:8,paddingLeft:10,borderLeft:`2px solid ${card.color}40`}}>
          <span style={{fontSize:".65rem",fontWeight:700,color:card.color,textTransform:"uppercase"}}>{l}: </span>
          <span style={{fontSize:".82rem",color:T.text2,fontStyle:"italic"}}>{t}</span>
        </div>)}
      </div>}

      {/* Textarea */}
      <textarea className="inp" value={text} onChange={e=>setText(e.target.value)}
        placeholder={`I'm going to give a talk about ${card.monologueTopic}.\n\n...`}
        style={{background:T.inputBg,borderColor:T.inputBorder,color:T.text,minHeight:220,width:"100%",display:"block"}} />

      {/* Counters */}
      <div style={{display:"flex",gap:16,marginTop:8,marginBottom:20}}>
        <span style={{fontSize:".78rem",color:words>=80?"#34D399":T.text2}}>{words} words <span style={{color:T.text4}}>(aim: 80–120)</span></span>
        <span style={{fontSize:".78rem",color:sents>=10?"#34D399":T.text2}}>{sents} sentences <span style={{color:T.text4}}>(aim: 10–12)</span></span>
      </div>

      {/* Model reveal */}
      <p style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",color:T.label,textTransform:"uppercase",marginBottom:10}}>Compare with model answer</p>
      {revealed>0 && allParts.slice(0,revealed).map((t,i)=>(
        <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,borderLeft:`3px solid ${card.color}`}}>
          <p style={{fontSize:".65rem",fontWeight:700,color:card.color,textTransform:"uppercase",marginBottom:4}}>{revLabels[i]}</p>
          <p style={{fontSize:".88rem",color:T.text,lineHeight:1.6}}>{t}</p>
        </div>
      ))}
      {revealed<6 && <button className="ghost" onClick={()=>setRevealed(v=>v+1)} style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr,marginBottom:16}}>
        {revealed===0?"Show model intro →":`Show next section (${revealed}/5)`}
      </button>}

      <button className="act" onClick={handleSave} style={{background:"linear-gradient(135deg,#4ADE80,#22C55E)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        {saved ? <><Check size={18} strokeWidth={3} /> Saved</> : <><Download size={18} /> Save as .txt</>}
      </button>
    </div>
  );
}

// ── Level 5 — Exam ────────────────────────────────────────────────────────────
function Level5Exam({ card, T, onBack, onComplete }) {
  const [phase, setPhase]     = useState("task"); // task→prep→speaking→review
  const [timeLeft, setLeft]   = useState(90);
  const [audioURL, setURL]    = useState(null);
  const [noMic, setNoMic]     = useState(false);
  const [trig, setTrig]       = useState(null);
  const [showModel, setModel] = useState(false);
  const mrRef=useRef(null),chunksRef=useRef([]),timerRef=useRef(null),mimeRef=useRef("audio/webm");

  const doRecord = useCallback(async()=>{
    clearInterval(timerRef.current); setNoMic(false);
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported("audio/webm")?"audio/webm":"audio/mp4";
      mimeRef.current=mime; chunksRef.current=[];
      const mr=new MediaRecorder(stream,{mimeType:mime}); mrRef.current=mr;
      mr.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};
      mr.onstop=()=>{const blob=new Blob(chunksRef.current,{type:mime});setURL(URL.createObjectURL(blob));stream.getTracks().forEach(t=>t.stop());};
      mr.start(); setLeft(120); setPhase("speaking");
    } catch { setNoMic(true); setLeft(120); setPhase("speaking"); }
  },[]);

  const doStop=useCallback(()=>{ clearInterval(timerRef.current); if(mrRef.current?.state!=="inactive")mrRef.current?.stop(); setPhase("review"); onComplete(card.id); },[card.id,onComplete]);

  useEffect(()=>{
    if(phase!=="prep"&&phase!=="speaking") return;
    timerRef.current=setInterval(()=>setLeft(p=>{if(p<=1){clearInterval(timerRef.current);setTrig(phase==="prep"?"record":"stop");return 0;}return p-1;}),1000);
    return ()=>clearInterval(timerRef.current);
  },[phase]);

  useEffect(()=>{if(!trig)return;const t=trig;setTrig(null);if(t==="record")doRecord();else doStop();},[trig,doRecord,doStop]);

  const download=()=>{if(!audioURL)return;const a=document.createElement("a");a.href=audioURL;a.download=`exam_${card.id}_${Date.now()}.${mimeRef.current.includes("mp4")?"mp4":"webm"}`;document.body.appendChild(a);a.click();document.body.removeChild(a);};

  const WRAP={width:"100%",maxWidth:680,padding:"16px 20px 52px"};
  const CTR={...WRAP,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:28};

  // Exam task card (styled like real OGE card)
  const ExamCard = ({compact}) => (
    <div style={{borderRadius:16,border:`2px solid #2DD4BF`,background:compact?T.surface+"CC":T.surface,padding:compact?"14px 16px":"20px 20px",marginBottom:20}}>
      {!compact && <p style={{fontSize:".78rem",fontWeight:700,color:"#2DD4BF",letterSpacing:".04em",marginBottom:10}}>Task 3</p>}
      <p style={{fontSize:compact?".82rem":".9rem",fontWeight:600,color:T.text,marginBottom:10,lineHeight:1.5}}>
        You are going to give a talk about <strong>{card.taskTopic}</strong>.{!compact && " You will have to start in 1.5 minutes and speak for not more than 2 minutes (10–12 sentences)."}
      </p>
      {!compact && <p style={{fontSize:".85rem",fontWeight:600,color:T.text,marginBottom:8}}>Remember to say:</p>}
      {card.points.map((p,i)=><p key={i} style={{fontSize:compact?".8rem":".88rem",color:compact?T.dim:T.text,marginBottom:compact?3:6}}>• {p}</p>)}
    </div>
  );

  if (phase==="task") return (
    <div className="fade-up" style={WRAP}>
      <div><ExamCard /></div>
      <button className="act" onClick={()=>{setLeft(90);setPhase("prep");}} style={{background:"linear-gradient(135deg,#818CF8,#A78BFA)",color:"#fff"}}>Start Preparation →</button>
    </div>
  );

  if (phase==="prep") return (
    <div className="fade-up" style={CTR}>
      <h2 style={{fontSize:"1.4rem",fontWeight:800,textAlign:"center",marginBottom:6,color:T.text}}>Prepare your monologue</h2>
      <p style={{fontSize:".87rem",color:T.text2,textAlign:"center",marginBottom:28}}>Recording starts automatically when time runs out</p>
      <CircleTimer timeLeft={timeLeft} total={90} color="#818CF8" sub="prep time" trackColor={T.track} />
      <div style={{marginTop:24,width:"100%"}}><ExamCard compact /></div>
      <button className="act" onClick={doRecord} style={{marginTop:14,background:"#FB923C16",border:"1.5px solid #FB923C40",color:"#FB923C",fontWeight:600,fontSize:".9rem"}}>Start speaking now →</button>
    </div>
  );

  if (phase==="speaking") return (
    <div className="fade-up" style={CTR}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
        {noMic?<span style={{fontSize:".75rem",fontWeight:700,color:"#818CF8",letterSpacing:".1em",textTransform:"uppercase"}}>Practicing</span>:<><span style={{width:9,height:9,borderRadius:"50%",background:"#FB7185",display:"inline-block",animation:"recDot 1.2s ease-in-out infinite"}}/><span style={{fontSize:".75rem",fontWeight:700,color:"#FB7185",letterSpacing:".1em",textTransform:"uppercase"}}>Recording</span></>}
      </div>
      {noMic && <div style={{width:"100%",marginBottom:16,background:"#FBBF2410",border:"1px solid #FBBF2430",borderRadius:10,padding:"10px 14px",fontSize:".8rem",color:"#FBBF24"}}>No mic access — timer only mode.</div>}
      <CircleTimer timeLeft={timeLeft} total={120} color={noMic?"#818CF8":"#FB7185"} sub="speaking" pulse={!noMic} trackColor={T.track} />
      <WaveBars color={noMic?"#818CF880":"#FB7185"} />
      <div style={{marginTop:22,width:"100%"}}><ExamCard compact /></div>
      <button className="act" onClick={doStop} style={{marginTop:14,background:"#FB718514",border:"1.5px solid #FB718540",color:"#FB7185",fontWeight:600,fontSize:".9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="1.5"/></svg>
        {noMic?"End practice":"Stop recording"}
      </button>
    </div>
  );

  // Review
  return (
    <div className="fade-up" style={WRAP}>
      <div style={{textAlign:"center",paddingTop:16,paddingBottom:24}}>
        <div style={{marginBottom:10,color:noMic?"#818CF8":"#34D399"}}>{noMic?<ThumbsUp size={42} strokeWidth={2} />:<PartyPopper size={42} strokeWidth={2} />}</div>
        <h2 style={{fontSize:"1.7rem",fontWeight:800,color:T.text,marginBottom:4}}>Well done!</h2>
        <p style={{fontSize:".88rem",color:T.text2}}>{noMic?"Practice complete":"Listen back and compare with the model"}</p>
      </div>
      {!noMic&&audioURL&&<div className="card" style={{padding:"18px 18px",marginBottom:12,background:T.surface,borderColor:T.border}}><p style={{fontSize:".63rem",fontWeight:700,letterSpacing:".1em",color:T.label,textTransform:"uppercase",marginBottom:12}}>Your recording</p><AudioPlayer src={audioURL}/></div>}
      {!noMic&&audioURL&&<button className="act" onClick={download} style={{background:"#34D39916",border:"1.5px solid #34D39940",color:"#34D399",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Download size={18} /> Download recording</button>}

      {/* Model monologue reveal */}
      <button className="ghost" onClick={()=>setModel(v=>!v)} style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr,marginBottom:showModel?16:0}}>
        {showModel?"▲ Hide model monologue":"▼ Show model monologue"}
      </button>
      {showModel && <div style={{marginBottom:16}}>
        {[card.monologue.intro,...card.monologue.paragraphs,card.monologue.outro].map((t,i)=>(
          <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,borderLeft:`3px solid ${i===0||i===5?"#818CF8":"#818CF860"}`}}>
            <p style={{fontSize:".65rem",fontWeight:700,color:"#818CF8",textTransform:"uppercase",marginBottom:4}}>{["Introduction","Point 1","Point 2","Point 3","Point 4","Conclusion"][i]}</p>
            <p style={{fontSize:".88rem",color:T.text,lineHeight:1.6}}>{t}</p>
          </div>
        ))}
      </div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:8}}>
        <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={()=>{setPhase("task");setURL(null);setModel(false);}}>Try again</button>
        <button className="ghost" style={{background:T.ghostBg,borderColor:T.ghostBorder,color:T.ghostClr}} onClick={onBack}>New card</button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]           = useState(() => localStorage.getItem("mono_theme") === "dark");
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement));
  const [screen, setScreen]       = useState("home");
  const [selLevel, setSelLevel]   = useState(null);
  const [currentCard, setCard]    = useState(null);
  const [pointIdx, setPointIdx]   = useState(0);
  const [progress, setProgress]   = useState({});
  const [customTheme, setCustom]  = useState(() => { try { return JSON.parse(localStorage.getItem("mono-ct") || "{}"); } catch { return {}; } });
  const [showSettings, setSettings] = useState(false);

  const T = THEMES[dark ? "dark" : "light"];

  // Load / save progress
  useEffect(()=>{try{setProgress(JSON.parse(localStorage.getItem("mono-prog")||"{}"))}catch{}},[]);
  useEffect(() => {
    localStorage.setItem("mono_theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);
  const addProgress = (levelId, cardId) => {
    const key=`l${levelId}`;
    const cur=progress[key]||[];
    if(!cur.includes(cardId)){
      const np={...progress,[key]:[...cur,cardId]};
      setProgress(np);
      try{localStorage.setItem("mono-prog",JSON.stringify(np));}catch{}
    }
  };

  const applyCustom = (patch) => {
    const next = { ...customTheme, ...patch };
    setCustom(next);
    try { localStorage.setItem("mono-ct", JSON.stringify(next)); } catch {}
  };
  const resetCustom = () => { setCustom({}); try { localStorage.removeItem("mono-ct"); } catch {} };

  // Theme
  const applyTheme = useCallback((tokens)=>{
    let el=document.getElementById("mono-theme");
    if(!el){el=document.createElement("style");el.id="mono-theme";document.head.appendChild(el);}
    el.textContent=`:root{--surface:${tokens.surface};--border:${tokens.border};--ghost:${tokens.ghost};--card-hover:${tokens.cardHover};--app-text:${tokens.text};--ghost-bg:${tokens.ghostBg};--ghost-border:${tokens.ghostBorder};--ghost-clr:${tokens.ghostClr};}
    .app-scroll{scrollbar-color:${tokens.scrollThumb} transparent !important;}
    .app-scroll::-webkit-scrollbar-thumb{background:${tokens.scrollThumb} !important;}`;
    document.body.style.background=tokens.bg;
  },[]);
  useEffect(()=>{applyTheme(T);},[dark]);

  const APP={position:"fixed",inset:0,overflowY:"auto",background:T.bg,fontFamily:"'Plus Jakarta Sans', sans-serif",color:T.text,display:"flex",flexDirection:"column",alignItems:"center"};
  const WRAP={width:"100%",maxWidth:680,padding:"clamp(24px, 4vh, 40px) 24px",marginBlock:"auto",flexShrink:0};

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const goToCard = (card) => {
    setCard(card);
    if(selLevel===3) setPointIdx(Math.floor(Math.random()*4));
    setScreen("game");
  };

  const handleComplete = (cardId) => { addProgress(selLevel,cardId); };
  const returnToLevelSelection = () => {
    setScreen("home");
    setSelLevel(null);
    setCard(null);
  };

  // ── Home ──────────────────────────────────────────────────────────────────
  if (screen==="home") return (
    <div key="home" className="app-scroll fade-up" style={APP}>
      <div style={WRAP}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:12,background:"#C4B5F4",display:"flex",alignItems:"center",justifyContent:"center",color:"#1A2E4A"}}><Mic size={20} strokeWidth={2.2} /></div>
            <div>
              <p style={{fontWeight:800,fontSize:"1.05rem",color:T.text,letterSpacing:"-.02em"}}>Monologue</p>
              <p style={{fontSize:".65rem",color:T.text2,whiteSpace:"nowrap"}}>OGE Task 3 · 5 cards · 5 levels</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <button className="theme-btn" onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>{isFullscreen ? <Minimize size={16} /> : <Expand size={16} />}</button>
            <button className="theme-btn" onClick={()=>setDark(d=>!d)} title={dark ? "Switch to light" : "Switch to dark"}>{dark ? <Sun size={16} /> : <Moon size={15} />}</button>
          </div>
        </div>

        {/* Level cards */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {LEVELS.map(lv=>{
            const done=(progress[`l${lv.id}`]||[]).length;
            const Icon = lv.icon;
            return (
            <div key={lv.id} style={{borderRadius:16,background:T.surface,border:`1px solid ${T.border}`,borderLeft:`4px solid ${lv.color}`,padding:"18px 18px",cursor:"pointer",boxShadow:dark?"none":"0 8px 32px -18px rgba(26,46,74,.18)",transition:"transform .15s,box-shadow .15s"}} onClick={()=>{setSelLevel(lv.id);setScreen("topicSelect");}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:44,height:44,borderRadius:12,background:lv.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:lv.color}}><Icon size={22} strokeWidth={2.2} /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                      <span style={{fontSize:".65rem",fontWeight:700,color:lv.color,letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>Level {lv.id}</span>
                      <span style={{fontWeight:700,fontSize:".95rem",color:T.text,whiteSpace:"nowrap"}}>{lv.name}</span>
                    </div>
                    <p style={{fontSize:".82rem",color:T.text2,lineHeight:1.4}}>{lv.desc}</p>
                  </div>
                  <div style={{flexShrink:0,textAlign:"center"}}>
                    <p style={{fontSize:"1.1rem",fontWeight:800,color:done===5?"#34D399":lv.color}}>{done}/5</p>
                    <p style={{fontSize:".65rem",color:T.text4}}>cards</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── Topic Select ──────────────────────────────────────────────────────────
  if (screen==="topicSelect") {
    const lv=LEVELS.find(l=>l.id===selLevel);
    const Icon = lv.icon;
    return (
      <div key="topics" className="app-scroll fade-up" style={APP}>
        <LevelNavigation onBack={returnToLevelSelection} onHome={returnToLevelSelection} T={T} />
        <div style={WRAP}>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
            <div style={{padding:"4px 12px",borderRadius:20,background:dark ? lv.darkBg : lv.bg,border:`1px solid ${lv.color}${dark ? "90" : "30"}`,color:dark ? T.text : lv.color,fontSize:".78rem",fontWeight:700,display:"inline-flex",alignItems:"center",gap:6}}><Icon size={14} strokeWidth={2.2} /> Level {lv.id} · {lv.name}</div>
          </div>
          <h2 style={{fontSize:"1.4rem",fontWeight:800,letterSpacing:"-.02em",marginBottom:6,color:T.text}}>Choose a card</h2>
          <p style={{color:T.text2,fontSize:".9rem",marginBottom:24}}>{selLevel===3?"A random point from the card will be selected.":"Pick any card to practice."}</p>

          {/* Random button */}
          <button onClick={()=>goToCard(TASK_CARDS[Math.floor(Math.random()*TASK_CARDS.length)])}
            style={{width:"100%",marginBottom:12,padding:"14px",borderRadius:14,border:`2px dashed ${lv.color}${dark ? "CC" : "60"}`,background:dark ? lv.darkBg : lv.bg,color:dark ? T.text : lv.color,fontFamily:"inherit",fontSize:".9rem",fontWeight:700,cursor:"pointer",transition:"opacity .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
          ><Shuffle size={18} strokeWidth={2.2} /> Random card</button>

          {/* Card grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {TASK_CARDS.map(card=>{
              const done=(progress[`l${selLevel}`]||[]).includes(card.id);
              const CardIcon = card.icon;
              return (
                <div key={card.id} className="tc" onClick={()=>goToCard(card)}
                  style={{background:T.surface,borderColor:T.border,position:"relative",boxShadow:"0 4px 14px -6px rgba(26,46,74,.10)"}}>
                  {done && <span style={{position:"absolute",top:10,right:10,color:"#34D399"}}><Check size={16} strokeWidth={3} /></span>}
                  <span style={{width:40,height:40,borderRadius:10,background:card.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:card.color}}><CardIcon size={20} strokeWidth={2.2} /></span>
                  <div>
                    <div style={{fontWeight:700,fontSize:".88rem",color:T.text}}>{card.category}</div>
                    <div style={{fontSize:".7rem",color:done?"#34D399":T.text4,marginTop:2}}>{done?"practiced":"tap to start"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Game ──────────────────────────────────────────────────────────────────
  if (screen==="game" && currentCard) {
    const shared = {
      card: currentCard, T,
      onBack: ()=>setScreen("topicSelect"),
      onComplete: handleComplete,
    };
    return (
      <div key="game" className="app-scroll fade-up" style={APP}>
        <LevelNavigation onBack={()=>setScreen("topicSelect")} onHome={returnToLevelSelection} T={T} />
        {selLevel===1 && <Level1Match {...shared} />}
        {selLevel===2 && <Level2Reconstruct {...shared} />}
        {selLevel===3 && <Level3Speak {...shared} pointIdx={pointIdx}
          onNewPoint={()=>{setPointIdx(Math.floor(Math.random()*4));setScreen("topicSelect");}} />}
        {selLevel===4 && <Level4Write {...shared} />}
        {selLevel===5 && <Level5Exam {...shared} />}
      </div>
    );
  }

  return (
    <>
    </>
  );
}
