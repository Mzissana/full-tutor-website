import { useState, useEffect, useRef, useCallback } from "react";

// â”€â”€ Global styles (injected once) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if (!document.getElementById("sp-style")) {
  const lnk = document.createElement("link");
  lnk.rel = "stylesheet";
  lnk.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(lnk);
  const st = document.createElement("style");
  st.id = "sp-style";
  st.textContent = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --surface:#111320;--border:#1E2135;
      --ghost-bg:#0D0E1C;--ghost-border:#1E2135;--ghost-border-h:#2E3050;--ghost-clr:#9193AB;
      --seg-bg:#0D0E1C;--seg-border:#1E2135;--seg-clr:#4A4C63;
      --tc-shadow:rgba(0,0,0,.4);
    }
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulseRing{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.12);opacity:.1}}
    @keyframes recDot{0%,100%{opacity:1}50%{opacity:.1}}
    @keyframes waveBar{0%,100%{height:5px}50%{height:26px}}
    .fade-up{animation:fadeUp .3s ease both}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:16px}
    .chip{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:.78rem;font-weight:700;letter-spacing:.02em}
    .seg{cursor:pointer;flex:1;padding:10px 4px;border-radius:10px;font-family:inherit;font-size:.82rem;font-weight:600;
         border:1.5px solid var(--seg-border);background:var(--seg-bg);color:var(--seg-clr);transition:all .14s}
    .seg:active{transform:scale(.97)}
    .act{cursor:pointer;width:100%;border:none;border-radius:13px;padding:16px;font-family:inherit;
         font-size:.95rem;font-weight:700;transition:opacity .14s,transform .1s;letter-spacing:-.01em}
    .act:hover{opacity:.88}
    .act:active{transform:scale(.97)}
    .ghost{cursor:pointer;border-radius:11px;padding:13px 10px;font-family:inherit;font-size:.84rem;font-weight:600;
           border:1.5px solid var(--ghost-border);background:var(--ghost-bg);color:var(--ghost-clr);
           transition:all .14s;width:100%}
    .ghost:hover{opacity:.8;border-color:var(--ghost-border-h)}
    .ghost:active{transform:scale(.97)}
    .tc{cursor:pointer;border-radius:14px;padding:18px 16px;display:flex;align-items:center;gap:12px;
        border:1px solid transparent;transition:transform .15s,box-shadow .15s}
    .tc:hover{transform:translateY(-2px);box-shadow:0 4px 24px var(--tc-shadow)}
    .lnk{cursor:pointer;background:none;border:none;font-family:inherit;display:flex;align-items:center;gap:5px;transition:opacity .14s}
    .lnk:hover{opacity:.7}
    input[type=number]{-moz-appearance:textfield}
    input::-webkit-inner-spin-button,input::-webkit-outer-spin-button{-webkit-appearance:none}
    .picker-item{cursor:pointer;width:100%;border:none;text-align:left;font-family:inherit;transition:background .12s}
    .picker-item:hover{opacity:.85}
    .picker-scroll{scrollbar-width:thin;scrollbar-color:#44465C transparent}
    .picker-scroll::-webkit-scrollbar{width:5px}
    .picker-scroll::-webkit-scrollbar-track{background:transparent}
    .picker-scroll::-webkit-scrollbar-thumb{background:#44465C;border-radius:4px}
    .picker-scroll::-webkit-scrollbar-thumb:hover{background:#6B6D85}
    .app-scroll{scrollbar-width:thin;scrollbar-color:#44465C transparent}
    .app-scroll::-webkit-scrollbar{width:5px}
    .app-scroll::-webkit-scrollbar-track{background:transparent}
    .app-scroll::-webkit-scrollbar-thumb{background:#44465C;border-radius:4px}
    .app-scroll::-webkit-scrollbar-thumb:hover{background:#6B6D85}
    .ar::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#34D399;cursor:pointer}
    .ar::-moz-range-thumb{width:14px;height:14px;border-radius:50%;border:none;background:#34D399;cursor:pointer}
    .tbtn{cursor:pointer;width:34px;height:34px;border-radius:9px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          border:1px solid var(--border);background:var(--surface);color:var(--ghost-clr);
          transition:all .2s}
    .tbtn:hover{opacity:.75}
  `;
  document.head.appendChild(st);
}

// â”€â”€ Theme tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const THEMES = {
  dark: {
    bg:"#10182B", surface:"#18233A", border:"#31425D",
    text:"#F2F6FF", text2:"#B3C0D6", text3:"#6C7F9C", text4:"#98A9C1",
    ghostBg:"#142038", ghostBorder:"#31425D", ghostBorderH:"#4A607F", ghostClr:"#C5D1E5",
    segBg:"#142038", segBorder:"#31425D", segClr:"#B3C0D6",
    track:"#22314A", inputBg:"#142038", inputBorder:"#31425D",
    brand:"#D6E2F4", dim:"#B3C0D6", label:"#98A9C1", tcShadow:"rgba(0,0,0,.32)", scrollThumb:"#60738F",
  },
  light: {
    bg:"#F9F8F5", surface:"#FFFFFF", border:"#E4E0EE",
    text:"#1E3150", text2:"#667795", text3:"#A6B2C4", text4:"#7C8DA8",
    ghostBg:"#F5F2FA", ghostBorder:"#E4E0EE", ghostBorderH:"#CFC6DD", ghostClr:"#536887",
    segBg:"#F5F2FA", segBorder:"#E4E0EE", segClr:"#667795",
    track:"#E9E5F1", inputBg:"#FCFBFD", inputBorder:"#E4E0EE",
    brand:"#536887", dim:"#667795", label:"#7C8DA8", tcShadow:"rgba(48,61,90,.10)", scrollThumb:"#C6BDDA",
  },
};

// â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const QUESTIONS = {
  School: [
    "How many days a week do you go to school?",
    "What is your favourite school subject?",
    "What subjects are you good at?",
    "What subject do you find the most difficult?",
    "How many classes do you usually have a day?",
    "What do you usually do after lessons?",
    "What is your school uniform like?",
    "Do you think school uniform is necessary or not? Why?",
    "What sports facilities do you have in your school?",
    "What clubs and societies can you attend in your school?",
    "What after-school activities does your school offer?",
    "What school events do you have during the school year?",
    "How often do you have school concerts and performances?",
    "Do you enjoy taking part in school events? Why?",
    "What event would you recommend organizing in your school and why?",
    "What do you like most about your school?",
    "What would you like to improve in your school?",
    "What grade are you in?",
    "How many school holidays do you have?",
    "What school holidays do you like best of all?",
    "Why do most teenagers enjoy school holidays so much?",
    "Do you think it is a good idea for a teenager to take a part-time job during the summer holidays? Why?",
    "What part-time job would you like to do during the school holidays, if any?",
    "What career would you like to choose after finishing school? Why?",
    "What would you recommend to a student who wants to improve his or her school results?",
    "What would you recommend to a student who wants to spend less time on his or her homework?",
  ],
  "Daily Life": [
    "When do you usually get up on weekdays?",
    "What do you prefer to eat for breakfast in the morning?",
    "How long does it take you to get to school?",
    "What means of transport do you use to get to school?",
    "How do you spend your mornings?",
    "What time do you usually go to bed in the evening?",
    "How much time do you spend doing your homework?",
    "Who helps you to do your homework?",
    "Do you use the Internet when you do your homework? What for?",
    "What do you do to help your parents about the house?",
    "How much free time do you have on weekdays?",
    "What is your favourite day of the week? Why do you like it?",
    "When do you usually get up at weekends?",
    "How do you usually spend your weekends?",
    "What is your favourite part of the day: morning, afternoon or evening? Why?",
    "Who usually does the shopping in your family?",
    "What can you buy in your nearest shopping centre?",
    "How often do you usually go shopping?",
    "Why are shopping centres so popular nowadays?",
    "Why do some people hate shopping?",
    "What colour of clothes do you prefer wearing?",
    "What clothes do you usually wear?",
    "How often do you go shopping for clothes?",
    "Who do you usually go shopping with?",
    "Does a career of a fashion designer attract you or not? Why?",
    "What would you like to change in your daily routine?",
    "What would you recommend to teenagers who are often late for school?",
  ],
  Technology: [
    "How much time do you spend on the Internet every day?",
    "What do you use the Internet for?",
    "For what purposes do you use the Internet?",
    "What do you do in Information Technology or Computer Studies lessons?",
    "In what lessons at school do you use computers?",
    "Why are computer skills useful for everyone?",
    "What do you use your computer for?",
    "What do the members of your family use computers for?",
    "Which jobs need good computer skills in your view?",
    "In what way have computers made people's life easier?",
    "What would you recommend to a person who spends too much time on the Internet?",
    "Why do a lot of people prefer learning the news from the Internet?",
    "When did you get your first mobile phone?",
    "What do you usually use your mobile phone for?",
    "What do you use your mobile phone for, apart from talking?",
    "Who do you usually send SMS-s to?",
    "How do you feel when you forget your mobile phone at home?",
    "Do you think it is right that mobile phones are not allowed in some schools?",
    "In what places would you recommend people switch off or turn down their phones? Why?",
    "How can you use mobile phones to learn foreign languages?",
    "Where do you usually switch off your mobile phone?",
    "Why are most teachers against using mobile phones at school?",
  ],
  Entertainment: [
    "How often do you go to the cinema?",
    "What kinds of films do you like most?",
    "Why do you think many people prefer watching films at home?",
    "What film would you recommend your friends see and why?",
    "How often do you go to the cinema or to the theater?",
    "What would you prefer: going to the theater or watching a film at home? Why?",
    "What kind of music do you usually listen to?",
    "What musical instrument would you like to learn to play?",
    "What kind of TV programs do you like?",
    "How much time a day do you spend watching TV?",
    "How many TV sets are there in your house?",
    "Who watches most TV in your family?",
    "What TV programs are popular in your family?",
    "Do you prefer TV or the Internet? Why?",
    "Would you like to take part in a TV show? For example, in a quiz show? Why?",
    "What TV program would you recommend your friends watch?",
    "Does a career on TV attract you or not? Why?",
    "What kind of books do you like to read?",
    "What do you like to read about?",
    "Who is your favourite writer?",
    "What do you usually do in Literature lessons?",
    "How often do you borrow books from the library?",
    "Why do you think teenagers are reading less and less now?",
    "What books do you prefer: printed books or e-books? Why?",
    "What book would you recommend to your friend who wants to read something for pleasure and why?",
    "Where do you prefer to get news from: radio, newspapers or the Internet?",
    "Who listens to the radio in your family?",
    "How often do you buy a newspaper or a magazine?",
    "What would you recommend to your friends who want to make their free time more interesting?",
  ],
  "Food & Health": [
    "How many meals a day do you usually have?",
    "What is your favourite food?",
    "What is your favourite fruit?",
    "What do you usually have for breakfast?",
    "What do you usually have for lunch?",
    "What do you usually have for lunch at school?",
    "Where do you usually have lunch on weekdays?",
    "Is there any food you do not like?",
    "What dishes can you cook?",
    "Do you prefer fast food or home-made food? Why?",
    "Would you like to take part in a TV cookery show? For example, cooking your favourite dish in a TV studio? Why?",
    "Do you do your morning exercises or not? Why?",
    "Do you think everyone should find some time for doing sports? Why?",
    "What food would you recommend to a teenager who wants to be healthy?",
    "What would you recommend to a teenager who wants to keep fit?",
    "What would you recommend to a teenager who wants to stay fit and healthy?",
  ],
  Languages: [
    "When did you start learning English?",
    "What do you do in your English lessons?",
    "Do you find learning English easy or difficult? Why?",
    "What other foreign language would you like to learn and why?",
    "What foreign languages can you learn at your school?",
    "How many English lessons a week do you have?",
    "For what reasons do people learn foreign languages nowadays?",
    "What is the most effective way to learn a foreign language in your opinion?",
    "Do you think English will be useful for you in the future? In what way?",
    "How can reading English books help students to improve their English?",
    "How can films in English help students improve their English?",
    "What language would you recommend your English-speaking friend learn? Why?",
    "What would you recommend a person do to improve his or her English?",
    "What would you recommend your friends do to improve their English?",
  ],
  Friends: [
    "What is your best friend like?",
    "Where did you and your friend meet for the first time?",
    "How often do you see each other?",
    "What do you like to do together?",
    "What career is your best friend going to follow?",
    "What would you recommend to a teenager who wants to be a good friend?",
    "How do you usually celebrate your birthday?",
    "What is the best birthday present you have ever had?",
    "What, from your point of view, is the best birthday present for a teenager?",
    "In what season do you have your birthday?",
    "What other holidays and special days are celebrated in your family?",
    "What is your favourite season? Why do you like it?",
    "What is your favourite holiday? Why do you like it?",
    "How do you usually celebrate your favourite holiday?",
    "What would you recommend to a person who has got a present he or she doesn't need?",
    "Where do you usually spend your summer holidays?",
    "What do you like to do during your winter holidays?",
    "How often do you and your family travel?",
    "What type of transport do you find the most convenient? Why?",
    "What place in your country would you recommend a foreign tourist to visit? Why?",
  ],
  Sports: [
    "How many Physical Education lessons a week do you have?",
    "What sports facilities do you have at school?",
    "What do you do in your Physical Education lessons?",
    "What sports do you like playing?",
    "What sports do you do regularly?",
    "What winter sports are popular with you and your friends?",
    "What sports competitions do you enjoy watching?",
    "Would you like to do any extreme sports? Why or why not?",
    "Is there any sport you would like to play professionally? Why?",
    "Do you think the winter is a good season for doing sports or not? Why?",
    "How do you and your friends usually spend your free time?",
    "Who do you prefer to spend your free time with?",
    "What after-school activities do you take part in?",
    "What sport or hobby do you think you might like to try in your future?",
    "What hobby would you do if you had more free time?",
    "What would you recommend to a teenager who wants to be healthy and fit?",
  ],
  "My Town": [
    "Where is your hometown located?",
    "What is your hometown famous for?",
    "How long have you been living in your city, town or village?",
    "When was your city, town or village founded?",
    "What is the place where you live famous for?",
    "What is your favourite place in your hometown? Why do you like it?",
    "What season is the best for visiting the place where you live? Why?",
    "What season is the best for visiting your city, town or village and why?",
    "What place in your hometown would you recommend visiting?",
    "Where would you like to live: in a big city or in the country? Why?",
    "Is it better to live in the country or in the city? Why?",
    "What are the advantages of living in the country?",
    "What environmental problems do you have in your hometown, if any?",
    "What is the main ecological problem in the place where you live?",
    "Do you and your friends care about ecological problems? Why?",
    "Have you ever taken part in ecological projects at school?",
    "What would you recommend to a person who wants to improve the ecological situation in his or her hometown?",
    "What would you like to improve in your hometown to make it a better place to live?",
  ],
  Animals: [
    "What is your favourite animal? Why do you like it?",
    "What pets are the most popular in your country in your view?",
    "Do you have a pet or would you like to have one? Why?",
    "Is it right for people to keep exotic animals as pets? Why?",
    "What can people do to help homeless animals?",
    "Why do you think most children like visiting zoos?",
    "Does a career as a vet attract you or not? Why?",
  ],
};

const TOPICS = [
  { id:"School",        icon:"S",  color:"#4B90E8", bg:"rgba(75,144,232,0.10)"  },
  { id:"Daily Life",    icon:"D",  color:"#38B978", bg:"rgba(56,185,120,0.10)"  },
  { id:"Technology",    icon:"T",  color:"#21AAA5", bg:"rgba(33,170,165,0.10)" },
  { id:"Entertainment", icon:"E",  color:"#9B72D9", bg:"rgba(155,114,217,0.10)" },
  { id:"Food & Health", icon:"F",  color:"#E7833E", bg:"rgba(231,131,62,0.10)"  },
  { id:"Languages",     icon:"L",  color:"#C99A21", bg:"rgba(201,154,33,0.10)"  },
  { id:"Friends",       icon:"FR", color:"#6776D7", bg:"rgba(103,118,215,0.10)" },
  { id:"Sports",        icon:"SP", color:"#259FC5", bg:"rgba(37,159,197,0.10)"  },
  { id:"My Town",       icon:"MT", color:"#CF6A9D", bg:"rgba(207,106,157,0.10)" },
  { id:"Animals",       icon:"A",  color:"#7EAD42", bg:"rgba(126,173,66,0.10)"  },
];

const PREP_TIME_OPTS = [
  { l:"5 sec",  v:5  },
  { l:"10 sec", v:10 },
  { l:"20 sec", v:20 },
  { l:"Custom", v:"custom" },
];
const SPEAK_TIME_OPTS = [
  { l:"30 sec", v:30 },
  { l:"40 sec", v:40 },
  { l:"1 min",  v:60 },
  { l:"Custom", v:"custom" },
];

// â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CircleTimer({ timeLeft, total, color, sub, pulse, trackColor }) {
  const R = 78, SZ = 200, C = 2 * Math.PI * R;
  const off = C * (1 - (total > 0 ? timeLeft / total : 0));
  const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
  return (
    <div style={{ position:"relative", width:SZ, height:SZ, margin:"0 auto" }}>
      {pulse && (
        <div style={{
          position:"absolute", inset:-14,
          border:`2px solid ${color}`, borderRadius:"50%",
          animation:"pulseRing 1.8s ease-in-out infinite", pointerEvents:"none",
        }} />
      )}
      <svg width={SZ} height={SZ} style={{ display:"block", transform:"rotate(-90deg)" }}>
        <circle cx="100" cy="100" r={R} fill="none" stroke={trackColor} strokeWidth="10" />
        <circle cx="100" cy="100" r={R} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
          style={{ transition:"stroke-dashoffset .9s linear", filter:`drop-shadow(0 0 8px ${color}70)` }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:"2.4rem", fontWeight:800, color, letterSpacing:"-.03em", lineHeight:1 }}>
          {m}:{s.toString().padStart(2,"0")}
        </span>
        {sub && (
          <span style={{ fontSize:".6rem", fontWeight:700, color:color+"80", letterSpacing:".12em", textTransform:"uppercase", marginTop:5 }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function WaveBars({ color }) {
  const delays = [0,.12,.24,.36,.48,.36,.24,.12,0];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, height:36, marginTop:14 }}>
      {delays.map((d,i) => (
        <div key={i} style={{ width:4, borderRadius:3, background:color, height:5,
          animation:`waveBar 1.1s ${d}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function TimerSel({ label, options, value, onChange, customVal, onCustomChange, accent, T }) {
  return (
    <div style={{ marginBottom:18 }}>
      <p style={{ fontSize:".72rem", fontWeight:700, color:T.label, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>
        {label}
      </p>
      <div style={{ display:"flex", gap:7 }}>
        {options.map(o => {
          const a = value === o.v;
          return (
            <button key={o.v} className="seg" onClick={() => onChange(o.v)}
              style={a
                ? { borderColor:accent, background:accent+"18", color:accent }
                : { borderColor:T.segBorder, background:T.segBg, color:T.segClr }
              }>
              {o.l}
            </button>
          );
        })}
      </div>
      {value === "custom" && (
        <div style={{ display:"flex", alignItems:"center", gap:9, marginTop:10 }}>
          <input type="number" min="1" max="900" value={customVal}
            onChange={e => onCustomChange(e.target.value)}
            style={{
              width:68, padding:"8px 11px",
              background:T.inputBg, border:`1.5px solid ${T.inputBorder}`,
              borderRadius:9, color:T.text, fontFamily:"inherit", fontSize:".9rem",
            }} />
          <span style={{ color:T.text2, fontSize:".83rem" }}>seconds</span>
        </div>
      )}
    </div>
  );
}

function AudioPlayer({ src }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ct, setCt] = useState(0);
  const [dur, setDur] = useState(0);
  const fmt = t => `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,"0")}`;
  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };
  const pct = dur > 0 ? (ct/dur)*100 : 0;
  return (
    <div>
      <audio ref={ref} src={src}
        onTimeUpdate={() => setCt(ref.current?.currentTime || 0)}
        onLoadedMetadata={() => setDur(ref.current?.duration || 0)}
        onEnded={() => setPlaying(false)} />
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <button onClick={toggle} style={{
          cursor:"pointer", width:44, height:44, borderRadius:"50%",
          background:"#34D39920", border:"1.5px solid #34D39950",
          color:"#34D399", fontSize:"1rem", display:"flex", alignItems:"center",
          justifyContent:"center", flexShrink:0, fontFamily:"inherit", transition:"all .14s",
        }}>
          {playing ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>}
        </button>
        <div style={{ flex:1 }}>
          <input type="range" className="ar" min="0" max={dur||1} step=".05" value={ct}
            onChange={e => { if(ref.current) ref.current.currentTime=+e.target.value; setCt(+e.target.value); }}
            style={{ width:"100%", background:`linear-gradient(to right,#34D399 ${pct}%,#1E2135 ${pct}%)` }} />
        </div>
        <span style={{ fontSize:".75rem", fontWeight:600, color:"#44465C", minWidth:38, textAlign:"right" }}>
          {fmt(ct)}
        </span>
      </div>
    </div>
  );
}

// â”€â”€ Sun / Moon icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const FullscreenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-6h6v6"/></svg>
);
function TopicIcon({ topic, size = 30 }) {
  return <span aria-hidden="true" style={{width:size,height:size,borderRadius:Math.round(size*.3),display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:topic.color+"18",border:`1px solid ${topic.color}35`,color:topic.color,fontSize:size < 28 ? ".55rem" : ".68rem",fontWeight:800,letterSpacing:"-.04em"}}>{topic.icon}</span>;
}

// â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App() {
  const [dark, setDark]         = useState(() => localStorage.getItem("speak_theme") === "dark");
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement));
  const [phase, setPhase]       = useState("topicSelect");
  const [topic, setTopic]       = useState(null);
  const [question, setQuestion] = useState("");
  const [prepSecs, setPrepSecs] = useState(5);
  const [speakSecs, setSpeakSecs] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [noMic, setNoMic]       = useState(false);
  const [prepOpt, setPrepOpt]   = useState(5);
  const [speakOpt, setSpeakOpt] = useState(30);
  const [custPrep, setCustPrep] = useState("5");
  const [custSpeak, setCustSpeak] = useState("30");
  const [trig, setTrig]         = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const mrRef     = useRef(null);
  const chunksRef = useRef([]);
  const timerRef  = useRef(null);
  const speakRef  = useRef(120);
  const mimeRef   = useRef("audio/webm");
  const appRef    = useRef(null);

  // Theme tokens
  const T = THEMES[dark ? "dark" : "light"];

  // Sync theme â€” write a real <style> block so cascade order guarantees it wins
  const applyTheme = useCallback((tokens) => {
    let el = document.getElementById("sp-theme");
    if (!el) {
      el = document.createElement("style");
      el.id = "sp-theme";
      document.head.appendChild(el);
    }
    el.textContent = `
      :root {
        --surface: ${tokens.surface};
        --border: ${tokens.border};
        --ghost-bg: ${tokens.ghostBg};
        --ghost-border: ${tokens.ghostBorder};
        --ghost-border-h: ${tokens.ghostBorderH};
        --ghost-clr: ${tokens.ghostClr};
        --seg-bg: ${tokens.segBg};
        --seg-border: ${tokens.segBorder};
        --seg-clr: ${tokens.segClr};
        --tc-shadow: ${tokens.tcShadow};
      }
      .picker-scroll::-webkit-scrollbar-thumb { background: ${tokens.scrollThumb} !important; }
      .picker-scroll::-webkit-scrollbar-thumb:hover { background: ${tokens.text2} !important; }
      .picker-scroll { scrollbar-color: ${tokens.scrollThumb} transparent !important; }
      .app-scroll::-webkit-scrollbar-thumb { background: ${tokens.scrollThumb} !important; }
      .app-scroll { scrollbar-color: ${tokens.scrollThumb} transparent !important; }
    `;
    document.body.style.background = tokens.bg;
  }, []);

  useEffect(() => { applyTheme(T); localStorage.setItem("speak_theme", dark ? "dark" : "light"); }, [dark, T, applyTheme]);
  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const td = TOPICS.find(t => t.id === topic) || TOPICS[0];

  const randQ = t => {
    const qs = QUESTIONS[t];
    return qs[Math.floor(Math.random() * qs.length)];
  };

  const pickTopic = t => {
    setTopic(t); setQuestion(randQ(t));
    setAudioURL(null); setNoMic(false);
    setPhase("setup");
  };

  const calcSecs = (opt, cust) =>
    opt === "custom" ? Math.max(1, Math.min(900, parseInt(cust) || 1)) : opt;

  const startPrep = () => {
    const pt = calcSecs(prepOpt, custPrep);
    const st = calcSecs(speakOpt, custSpeak);
    setPrepSecs(pt); setSpeakSecs(st);
    speakRef.current = st;
    setTimeLeft(pt);
    setPhase("prep");
  };

  const doRecord = useCallback(async () => {
    clearInterval(timerRef.current);
    setNoMic(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      mimeRef.current = mime;
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType:mime });
      mrRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type:mime });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setRecordings(prev => [{ url, topic, question, ts:Date.now() }, ...prev.slice(0,4)]);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setTimeLeft(speakRef.current);
      setPhase("recording");
    } catch {
      setNoMic(true);
      setAudioURL(null);
      setTimeLeft(speakRef.current);
      setPhase("recording");
    }
  }, [topic, question]);

  const doStop = useCallback(() => {
    clearInterval(timerRef.current);
    if (mrRef.current?.state !== "inactive") mrRef.current?.stop();
    setPhase("review");
  }, []);

  useEffect(() => {
    if (phase !== "prep" && phase !== "recording") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTrig(phase === "prep" ? "record" : "stop");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (!trig) return;
    const t = trig; setTrig(null);
    if (t === "record") doRecord();
    else if (t === "stop") doStop();
  }, [trig, doRecord, doStop]);

  const nextQ = () => {
    setQuestion(randQ(topic));
    setAudioURL(null); setNoMic(false);
    setPhase("setup");
  };

  const download = () => {
    if (!audioURL) return;
    const ext = mimeRef.current.includes("mp4") ? "mp4" : "webm";
    const a = document.createElement("a");
    a.href = audioURL;
    a.download = `answer_${topic}_${Date.now()}.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const returnHome = () => {
    clearInterval(timerRef.current);
    if (mrRef.current?.state === "recording") mrRef.current.stop();
    setShowPicker(false); setTopic(null); setQuestion(""); setAudioURL(null); setNoMic(false); setPhase("topicSelect");
  };
  const goBack = () => {
    clearInterval(timerRef.current);
    if (mrRef.current?.state === "recording") mrRef.current.stop();
    setShowPicker(false);
    setPhase(phase === "setup" ? "topicSelect" : "setup");
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await appRef.current?.requestFullscreen();
    } catch {}
  };

  // â”€â”€ Layout constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const APP  = {
    position:"fixed", inset:0, overflowY:"auto",
    background:T.bg, fontFamily:"'Plus Jakarta Sans', sans-serif",
    color:T.text, display:"flex", flexDirection:"column", alignItems:"center",
  };
  const WRAP = { width:"100%", maxWidth:760, padding:"24px 20px 52px" };
  const CTR  = { ...WRAP, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:44 };

  const QCard = ({ q, dim }) => (
    <div className="card" style={{ padding:"20px 20px", width:"100%", background:T.surface, borderColor:T.border }}>
      <p style={{ fontSize:".63rem", fontWeight:700, letterSpacing:".1em", color:T.label, textTransform:"uppercase", marginBottom:10 }}>Question</p>
      <p style={{ fontSize:dim?".97rem":"1.15rem", fontWeight:dim?500:600, lineHeight:1.6, color:dim?T.dim:T.text }}>{q}</p>
    </div>
  );

  // â”€â”€ Phase content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderPhase = () => {

    // Topic Select
    if (phase === "topicSelect") return (
      <div style={WRAP} className="fade-up">
        <div style={{ marginBottom:38 }}>
          <h1 style={{ fontSize:"2rem", fontWeight:800, letterSpacing:"-.03em", lineHeight:1.15, marginBottom:10, color:T.text }}>
            Choose a question topic
          </h1>
          <p style={{ color:T.text2, fontSize:".92rem", lineHeight:1.5 }}>
            You'll get a random question, time to prepare, then record your answer
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {TOPICS.map(t => (
            <div key={t.id} className="tc" onClick={() => pickTopic(t.id)}
              style={{ background:t.bg, borderColor:t.color+"28" }}>
              <TopicIcon topic={t} />
              <div>
                <div style={{ fontWeight:700, fontSize:".9rem", color:t.color }}>{t.id}</div>
                <div style={{ fontSize:".7rem", color:t.color+"60", marginTop:2 }}>{QUESTIONS[t.id].length} questions</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // Setup
    if (phase === "setup") return (
      <div style={WRAP} className="fade-up">
        <div style={{ display:"none" }}>
          <button className="lnk" onClick={() => setPhase("topicSelect")}
            style={{ color:T.text2, fontSize:".83rem", fontWeight:600 }}>
            â† Topics
          </button>
          <div className="chip" style={{ marginLeft:"auto", background:td.bg, border:`1px solid ${td.color}28`, color:td.color }}>
            <TopicIcon topic={td} size={20} /> {topic}
          </div>
        </div>

        <div className="card" style={{ padding:"22px 20px", marginBottom:24, background:T.surface, borderColor:T.border }}>
          <p style={{ fontSize:".63rem", fontWeight:700, letterSpacing:".1em", color:T.label, textTransform:"uppercase", marginBottom:12 }}>Your question</p>
          <p style={{ fontSize:"1.15rem", fontWeight:600, lineHeight:1.6, color:T.text }}>{question}</p>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:14 }}>
            <button className="lnk" onClick={nextQ}
              style={{ color:T.text2, fontSize:".8rem", fontWeight:600 }}>
              Shuffle question
            </button>
            <span style={{ color:T.border, fontSize:".9rem" }}>|</span>
            <button className="lnk" onClick={() => setShowPicker(true)}
              style={{ color:T.text2, fontSize:".8rem", fontWeight:600 }}>
              Pick a question
            </button>
          </div>
        </div>

        <TimerSel label="Preparation time" options={PREP_TIME_OPTS} value={prepOpt} onChange={setPrepOpt} customVal={custPrep} onCustomChange={setCustPrep} accent="#818CF8" T={T} />
        <TimerSel label="Speaking time" options={SPEAK_TIME_OPTS} value={speakOpt} onChange={setSpeakOpt} customVal={custSpeak} onCustomChange={setCustSpeak} accent="#FB923C" T={T} />

        <button className="act" onClick={startPrep}
          style={{ background:"linear-gradient(135deg,#818CF8,#A78BFA)", color:"#fff", marginTop:6 }}>
          Start prep timer
        </button>
      </div>
    );

    // Prep
    if (phase === "prep") return (
      <div style={CTR} className="fade-up">
        <div className="chip" style={{ background:td.bg, border:`1px solid ${td.color}28`, color:td.color, marginBottom:26 }}>
          <TopicIcon topic={td} size={20} /> {topic}
        </div>
        <h2 style={{ fontSize:"1.55rem", fontWeight:800, letterSpacing:"-.02em", marginBottom:6, textAlign:"center", color:T.text }}>
          Prepare your answer
        </h2>
        <p style={{ color:T.text2, fontSize:".87rem", marginBottom:34, textAlign:"center" }}>
          Recording starts automatically when time runs out
        </p>
        <CircleTimer timeLeft={timeLeft} total={prepSecs} color="#818CF8" sub="prep time" trackColor={T.track} />
        <div style={{ marginTop:30, width:"100%" }}><QCard q={question} /></div>
        <button className="act" onClick={doRecord}
          style={{ marginTop:16, background:"#FB923C16", border:"1.5px solid #FB923C40", color:"#FB923C", fontWeight:600, fontSize:".9rem" }}>
          Start recording now
        </button>
      </div>
    );

    // Recording
    if (phase === "recording") return (
      <div style={CTR} className="fade-up">
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:26 }}>
          {noMic ? (
            <span style={{ fontSize:".75rem", fontWeight:700, color:"#818CF8", letterSpacing:".1em", textTransform:"uppercase" }}>Practicing</span>
          ) : (
            <>
              <span style={{ width:9, height:9, borderRadius:"50%", background:"#FB7185", display:"inline-block", animation:"recDot 1.2s ease-in-out infinite" }} />
              <span style={{ fontSize:".75rem", fontWeight:700, color:"#FB7185", letterSpacing:".1em", textTransform:"uppercase" }}>Recording</span>
            </>
          )}
        </div>
        <h2 style={{ fontSize:"1.55rem", fontWeight:800, letterSpacing:"-.02em", marginBottom:6, textAlign:"center", color:T.text }}>
          Speak your answer
        </h2>
        <p style={{ color:T.text2, fontSize:".87rem", marginBottom:noMic?16:34, textAlign:"center" }}>
          {noMic ? "Timer stops automatically when time runs out" : "Recording stops automatically when time runs out"}
        </p>
        {noMic && (
          <div style={{
            width:"100%", marginBottom:26,
            background:"#FBBF2410", border:"1px solid #FBBF2430",
            borderRadius:10, padding:"10px 14px",
            fontSize:".8rem", color:"#FBBF24", fontWeight:500, lineHeight:1.5,
          }}>
            Mic access was denied â€” no recording will be saved. You can still use the timer to practice your answer.
          </div>
        )}
        <CircleTimer timeLeft={timeLeft} total={speakSecs} color={noMic?"#818CF8":"#FB7185"} sub="speaking" pulse={!noMic} trackColor={T.track} />
        <WaveBars color={noMic?"#818CF880":"#FB7185"} />
        <div style={{ marginTop:26, width:"100%" }}><QCard q={question} dim /></div>
        <button className="act" onClick={doStop}
          style={{ marginTop:16, background:"#FB718514", border:"1.5px solid #FB718540", color:"#FB7185", fontWeight:600, fontSize:".9rem", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="1.5"/></svg>
          {noMic ? "End practice" : "Stop recording"}
        </button>
      </div>
    );

    // Review
    if (phase === "review") return (
      <div style={WRAP} className="fade-up">
        <div style={{ textAlign:"center", marginBottom:30, paddingTop:16 }}>
          <div style={{ width:48, height:48, borderRadius:"50%", margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center", background:"#34D39918", color:"#34D399", fontSize:"1.15rem", fontWeight:800 }}>OK</div>
          <h2 style={{ fontSize:"1.8rem", fontWeight:800, letterSpacing:"-.03em", marginBottom:5, color:T.text }}>Well done!</h2>
          <p style={{ color:T.text2, fontSize:".89rem" }}>
            {noMic ? "Practice session complete" : "Listen to your answer and download it to keep"}
          </p>
        </div>

        <div className="card" style={{ padding:"18px 20px", marginBottom:12, background:T.surface, borderColor:T.border }}>
          <p style={{ fontSize:".63rem", fontWeight:700, letterSpacing:".1em", color:T.label, textTransform:"uppercase", marginBottom:9 }}>Question answered</p>
          <p style={{ fontSize:".96rem", fontWeight:500, lineHeight:1.6, color:T.dim }}>{question}</p>
        </div>

        {noMic ? (
          <div style={{
            background:"#FBBF2410", border:"1px solid #FBBF2430",
            borderRadius:12, padding:"14px 16px", marginBottom:12,
            fontSize:".83rem", color:"#FBBF24", fontWeight:500, lineHeight:1.5,
          }}>
            No recording was saved â€” mic access was denied. Allow microphone access in your browser settings to record next time.
          </div>
        ) : (
          <>
            {audioURL && (
              <div className="card" style={{ padding:"20px 20px", marginBottom:12, background:T.surface, borderColor:T.border }}>
                <p style={{ fontSize:".63rem", fontWeight:700, letterSpacing:".1em", color:T.label, textTransform:"uppercase", marginBottom:14 }}>Your recording</p>
                <AudioPlayer src={audioURL} />
              </div>
            )}
            {audioURL && (
              <button className="act" onClick={download}
                style={{ background:"#34D39916", border:"1.5px solid #34D39940", color:"#34D399", fontWeight:700, marginBottom:10 }}>
                Download recording
              </button>
            )}
          </>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginTop:noMic?10:0 }}>
          <button className="ghost" onClick={() => { setNoMic(false); nextQ(); }}
            style={{ background:T.ghostBg, borderColor:T.ghostBorder, color:T.ghostClr }}>Next question</button>
          <button className="ghost" onClick={() => { setNoMic(false); setPhase("topicSelect"); }}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:T.ghostBg, borderColor:T.ghostBorder, color:T.ghostClr }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Change topic
          </button>
        </div>

        {recordings.length > 1 && (
          <div style={{ marginTop:28 }}>
            <p style={{ fontSize:".7rem", fontWeight:700, color:T.label, letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>
              Recent recordings
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {recordings.slice(1).map(r => (
                <div key={r.ts} className="card" style={{ padding:"14px 16px", background:T.surface, borderColor:T.border }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10, gap:8 }}>
                    <p style={{ fontSize:".82rem", color:T.dim, fontWeight:500, lineHeight:1.4, flex:1 }}>{r.question}</p>
                    <span style={{ fontSize:".7rem", color:T.label, flexShrink:0, paddingTop:2 }}>
                      <TopicIcon topic={TOPICS.find(t => t.id === r.topic) || TOPICS[0]} size={18} /> {r.topic}
                    </span>
                  </div>
                  <AudioPlayer src={r.url} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    return null;
  };

  return (
    <div key={phase} ref={appRef} className="app-scroll" style={APP}>
      <div style={{width:"100%",maxWidth:760,padding:"16px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        {phase === "topicSelect" ? (
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#818CF8,#A78BFA)",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:".62rem",letterSpacing:"-.06em"}}>QO</div>
            <span style={{fontWeight:700,fontSize:".9rem",color:T.brand,letterSpacing:".02em"}}>Questions for OGE</span>
          </div>
        ) : (
          <button className="lnk" onClick={goBack} style={{color:T.text2,fontSize:".83rem",fontWeight:600}}>← Back</button>
        )}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {phase !== "topicSelect" && <button type="button" onClick={returnHome} aria-label="Return to topic selection" style={{display:"inline-flex",alignItems:"center",gap:6,border:`1px solid ${T.ghostBorder}`,borderRadius:999,background:T.surface,color:T.ghostClr,padding:"8px 12px",fontFamily:"inherit",fontSize:".75rem",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(26,46,74,.10)"}}><HomeIcon />Home</button>}
          <button className="tbtn" onClick={() => setDark(d => !d)} title={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <SunIcon /> : <MoonIcon />}</button>
          <button className="tbtn" onClick={toggleFullscreen} title={isFullscreen ? "Exit full screen" : "Full screen"}><FullscreenIcon /></button>
        </div>
      </div>
      {renderPhase()}

      {/* Question picker modal */}
      {showPicker && topic && (
        <div
          onClick={() => setShowPicker(false)}
          style={{
            position:"fixed", inset:0, zIndex:50,
            background:"rgba(0,0,0,0.55)", backdropFilter:"blur(3px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"24px 16px",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:20, width:"100%", maxWidth:500,
              maxHeight:"72vh", display:"flex", flexDirection:"column",
              boxShadow:"0 20px 60px rgba(0,0,0,0.4)",
              overflow:"hidden",
            }}
          >
            {/* Modal header */}
            <div style={{
              padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0,
            }}>
              <div>
                <span style={{ fontWeight:700, fontSize:".95rem", color:T.text }}>Pick a question</span>
                <span style={{ marginLeft:10, fontSize:".75rem", color:T.label }}>{QUESTIONS[topic].length} total</span>
              </div>
              <button onClick={() => setShowPicker(false)} style={{
                cursor:"pointer", background:"none", border:"none",
                color:T.text2, fontFamily:"inherit", fontSize:"1.2rem", lineHeight:1,
                padding:"2px 6px", borderRadius:6,
              }}>Close</button>
            </div>
            {/* Question list */}
            <div className="picker-scroll" style={{ overflowY:"auto", padding:"8px 14px 8px 0", marginBottom:16, marginRight:10 }}>
              {QUESTIONS[topic].map((q, i) => {
                const active = q === question;
                return (
                  <button
                    key={i}
                    className="picker-item"
                    onClick={() => { setQuestion(q); setShowPicker(false); }}
                    style={{
                      padding:"13px 20px 13px 20px",
                      background: active ? td.color+"18" : "transparent",
                      borderLeft: `3px solid ${active ? td.color : "transparent"}`,
                      color: active ? td.color : T.text,
                      fontSize:".88rem", lineHeight:1.55,
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <span style={{ fontSize:".7rem", fontWeight:700, color: active ? td.color+"90" : T.label, minWidth:16, paddingTop:3, flexShrink:0 }}>{i + 1}</span>
                      <span style={{ textAlign:"left" }}>{q}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
