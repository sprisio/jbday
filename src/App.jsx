import { useState, useEffect, useRef } from "react";

/* ─── INJECT FONTS ─────────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;600;700&family=Dancing+Script:wght@600;700&display=swap";
document.head.appendChild(fontLink);

/* ─── GLOBAL CSS ────────────────────────────────────────────────────── */
const injectStyles = () => {
  const el = document.createElement("style");
  el.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Nunito', sans-serif;
      background: linear-gradient(135deg, #fff0f6 0%, #fce4ff 50%, #e8d5ff 100%);
      background-attachment: fixed;
      color: #2d1b2e;
      min-height: 100vh;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #fff0f6; }
    ::-webkit-scrollbar-thumb { background: #ff6fa5; border-radius: 99px; }

    .glass {
      background: rgba(255,255,255,0.55);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1.5px solid rgba(255,182,209,0.5);
      border-radius: 24px;
      box-shadow: 0 8px 40px rgba(255,77,136,0.15);
    }

    @keyframes floatUp {
      0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.85; }
      90%  { opacity: 0.3; }
      100% { transform: translateY(-108vh) scale(0.4) rotate(25deg); opacity: 0; }
    }
    .heart-bg {
      position: fixed; pointer-events: none; z-index: 0;
      bottom: -5%; left: var(--x,50%);
      font-size: var(--sz,1.2rem);
      animation: floatUp var(--dur,12s) linear var(--delay,0s) infinite;
      opacity: 0; user-select: none;
    }

    .cursor-glow {
      position: fixed; pointer-events: none; z-index: 9999;
      width: 30px; height: 30px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,109,165,0.55) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      mix-blend-mode: multiply;
    }

    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .cursor {
      display: inline-block; width: 2px; height: 1em;
      background: #ff6fa5; animation: blink 1s step-end infinite;
      vertical-align: middle; margin-left: 3px;
    }

    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-10px)} 40%{transform:translateX(10px)}
      60%{transform:translateX(-8px)}  80%{transform:translateX(8px)}
    }
    .shake { animation: shake 0.5s ease; }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(35px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .anim { animation: fadeSlideUp 0.7s ease forwards; }

    /* Scroll reveal — default: fade up */
    .reveal {
      opacity: 0;
      transform: translateY(50px);
      transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* Slide from left */
    .reveal-left {
      opacity: 0; transform: translateX(-55px);
      transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
    }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }

    /* Slide from right */
    .reveal-right {
      opacity: 0; transform: translateX(55px);
      transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
    }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.9rem, 5vw, 3rem);
      color: #ff4d88; text-align: center; margin-bottom: .4rem;
    }
    .section-sub {
      font-family: 'Dancing Script', cursive;
      font-size: clamp(1.1rem, 3vw, 1.5rem);
      color: #7a5263; text-align: center; margin-bottom: 3rem;
    }

    .timeline { position: relative; }
    .timeline::before {
      content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
      background: linear-gradient(to bottom, transparent, #ff6fa5, #ff4d88, transparent);
      transform: translateX(-50%);
    }
    @media(max-width:768px) { .timeline::before { left: 18px; } }

    .tl-left, .tl-right {
      width: 50%; padding-right: 3rem;
      display: flex; justify-content: flex-end;
      margin-bottom: 3rem; position: relative;
    }
    .tl-right { padding-right:0; padding-left:3rem; margin-left:50%; justify-content:flex-start; }
    .tl-left::after, .tl-right::after {
      content: '💕'; position: absolute; right: -14px; top: 1.5rem; font-size: 1.1rem; z-index: 2;
    }
    .tl-right::after { right:auto; left:-14px; }
    @media(max-width:768px) {
      .tl-left,.tl-right { width:100%; margin-left:0; padding-left:3rem; padding-right:1rem; justify-content:flex-start; }
      .tl-left::after,.tl-right::after { right:auto; left:8px; }
    }

    @keyframes flipIn {
      from { transform: rotateY(80deg) scale(0.85); opacity: 0; }
      to   { transform: rotateY(0deg) scale(1); opacity: 1; }
    }
    .flip-in { animation: flipIn 0.45s cubic-bezier(.175,.885,.32,1.275) forwards; }

    .promise-card { transition: transform .3s ease, box-shadow .3s ease; cursor: default; }
    .promise-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 16px 50px rgba(255,77,136,0.28); }

    @keyframes openEnv { from{transform:scaleY(0);opacity:0} to{transform:scaleY(1);opacity:1} }
    .letter-open { animation: openEnv 0.6s ease forwards; transform-origin: top; }

    @keyframes pulseScale { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    .pulse { animation: pulseScale 2s ease-in-out infinite; }

    .music-btn {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg,#ff6fa5,#ff4d88);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
      box-shadow: 0 4px 20px rgba(255,77,136,0.4);
      transition: transform .2s;
    }
    .music-btn:hover { transform: scale(1.12); }
    .music-btn-fixed { position: fixed; bottom: 24px; right: 24px; z-index: 9000; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .spin { display:block; animation: spin 3s linear infinite; }

    /* ── Quiz styles ── */
    .quiz-option {
      width: 100%; padding: .85rem 1.2rem; border-radius: 14px;
      text-align: left; font-family: 'Nunito',sans-serif; font-size: .95rem;
      border: 1.5px solid rgba(255,182,209,0.5);
      background: rgba(255,255,255,0.6);
      cursor: pointer; color: #2d1b2e; font-weight: 600;
      transition: all .2s; display: flex; align-items: center;
    }
    .quiz-option:hover:not(:disabled) {
      background: #ffd6e7; border-color: #ff6fa5; transform: translateX(5px);
    }
    .quiz-option.correct {
      background: linear-gradient(135deg,#d4edda,#c3e6cb) !important;
      border-color: #28a745 !important; color: #155724 !important;
    }
    .quiz-option.wrong {
      background: linear-gradient(135deg,#f8d7da,#f5c6cb) !important;
      border-color: #dc3545 !important; color: #721c24 !important;
    }
    @keyframes bounceIn {
      0%  { transform: scale(0.75); opacity: 0; }
      60% { transform: scale(1.05); }
      100%{ transform: scale(1);   opacity: 1; }
    }
    .bounce-in { animation: bounceIn 0.5s cubic-bezier(.175,.885,.32,1.275) forwards; }

    @keyframes scoreReveal {
      0%  { transform: scale(0.5) rotate(-15deg); opacity: 0; }
      70% { transform: scale(1.1) rotate(3deg); }
      100%{ transform: scale(1) rotate(0deg);   opacity: 1; }
    }
    .score-reveal { animation: scoreReveal 0.8s cubic-bezier(.175,.885,.32,1.275) forwards; }
  `;
  document.head.appendChild(el);
};
injectStyles();

/* ─── Scroll Reveal Observer ─────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const selector = ".reveal, .reveal-left, .reveal-right";
    const init = () => {
      const els = document.querySelectorAll(selector);
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
      }, { threshold: 0.08 });
      els.forEach(el => obs.observe(el));
      return obs;
    };
    const obs = init();
    // Re-run after short delay to catch dynamically rendered elements
    const t = setTimeout(() => { obs.disconnect(); init(); }, 500);
    return () => { obs.disconnect(); clearTimeout(t); };
  });
}

/* ─── Floating Hearts ────────────────────────────────────────────────── */
const HEARTS = ["💗","💖","💕","💓","🌸","💝","❤️","🌷","✨"];
function FloatingHearts() {
  const items = Array.from({length:20},(_,i)=>({
    id:i, emoji:HEARTS[i%HEARTS.length],
    x:`${4+(i*4.8)%90}%`, sz:`${0.8+(i%5)*0.3}rem`,
    dur:`${10+(i%7)*1.5}s`, delay:`${(i*0.9)%12}s`,
  }));
  return (
    <div aria-hidden="true">
      {items.map(h=>(
        <span key={h.id} className="heart-bg"
          style={{"--x":h.x,"--sz":h.sz,"--dur":h.dur,"--delay":h.delay}}>
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

/* ─── Cursor Glow ────────────────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(()=>{
    const mv = e => { if(ref.current){ ref.current.style.left=e.clientX+"px"; ref.current.style.top=e.clientY+"px"; } };
    window.addEventListener("mousemove",mv);
    return ()=>window.removeEventListener("mousemove",mv);
  },[]);
  return <div ref={ref} className="cursor-glow"/>;
}

/* ─── Typing Hook ────────────────────────────────────────────────────── */
function useTyping(text, speed=45, go=true) {
  const [out, setOut] = useState("");
  useEffect(()=>{
    if(!go){setOut("");return;}
    setOut(""); let i=0;
    const id=setInterval(()=>{ i++; setOut(text.slice(0,i)); if(i>=text.length)clearInterval(id); },speed);
    return ()=>clearInterval(id);
  },[text,speed,go]);
  return out;
}

/* ─── Music Button ───────────────────────────────────────────────────── */
function MusicButton({ playing, onToggle, fixed=false }) {
  return (
    <button
      className={`music-btn${fixed?" music-btn-fixed":""}`}
      onClick={onToggle}
      title={playing?"Pause music":"Play music"}
    >
      <span className={playing?"spin":""} style={{display:"block"}}>
        {playing?"🎵":"🎶"}
      </span>
    </button>
  );
}

/* ─── PASSWORD GATE ──────────────────────────────────────────────────── */
const VALID = ["5 feb 2023","5feb2023","05/02/2023","5/2/2023","05-02-2023","5-2-2023"];

function PasswordGate({ onUnlock, playing, onToggle }) {
  const [val, setVal]         = useState("");
  const [err, setErr]         = useState(false);
  const [shaking, setShaking] = useState(false);

  const attempt = () => {
    if(VALID.includes(val.trim().toLowerCase())) { onUnlock(); }
    else {
      setErr(true); setShaking(true);
      setTimeout(()=>setShaking(false), 600);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#ffe0f0,#fce4ff,#e8d5ff)",
      position:"relative", overflow:"hidden"
    }}>
      <FloatingHearts />

      {/* Music toggle — top right corner on password screen */}
      <div style={{position:"absolute", top:20, right:20, zIndex:20, display:"flex", flexDirection:"column", alignItems:"center", gap:".3rem"}}>
        <MusicButton playing={playing} onToggle={onToggle} />
        <span style={{fontSize:".7rem", color:"#c09ab0", fontWeight:600, letterSpacing:".05em"}}>
          {playing ? "ON" : "OFF"}
        </span>
      </div>

      <div className={`glass anim${shaking?" shake":""}`} style={{
        padding:"3rem 2.5rem", maxWidth:420, width:"92%",
        zIndex:10, textAlign:"center", position:"relative"
      }}>
        <div style={{fontSize:"3.5rem", marginBottom:".6rem"}}>🔐</div>
        <h1 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(1.8rem,4vw,2.4rem)",
          color:"#ff4d88", marginBottom:".5rem"
        }}>Hey Jyoti ❤️</h1>
        <p style={{color:"#7a5263", marginBottom:"2rem", fontStyle:"italic", fontSize:".95rem"}}>
          Hint: when we met for the first time 🤭
        </p>
        <input
          value={val}
          onChange={e=>{ setVal(e.target.value); setErr(false); }}
          onKeyDown={e=>e.key==="Enter"&&attempt()}
          placeholder="e.g. 24/2/2023"
          style={{
            width:"100%", padding:".85rem 1.2rem", borderRadius:14,
            border:err?"2px solid #ff4d88":"1.5px solid rgba(255,182,209,0.5)",
            background:"rgba(255,255,255,0.8)", outline:"none",
            fontFamily:"'Nunito',sans-serif", fontSize:"1rem",
            textAlign:"center", marginBottom:".8rem", color:"#2d1b2e",
            transition:"border .2s"
          }}
        />
        {err && (
          <p style={{color:"#ff4d88",fontSize:".87rem",marginBottom:".8rem"}}>
            Yeh sahi nahi hai 😅 Try again~
          </p>
        )}
        <button onClick={attempt} style={{
          width:"100%", padding:".9rem", borderRadius:14,
          background:"linear-gradient(135deg,#ff6fa5,#ff4d88)",
          color:"#fff", border:"none", cursor:"pointer",
          fontFamily:"'Nunito',sans-serif", fontSize:"1.05rem", fontWeight:700,
          boxShadow:"0 6px 24px rgba(255,77,136,0.35)", transition:"transform .15s"
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          Enter ✨
        </button>

        <div style={{
          marginTop:"1.3rem", display:"flex", alignItems:"center",
          justifyContent:"center", gap:".5rem",
          color:"#c09ab0", fontSize:".82rem", fontStyle:"italic"
        }}>
          <span>{playing ? "🎵" : "🎶"}</span>
          <span>{playing ? "Music is playing… enjoy the vibe" : "Tap top-right to play music 🎶"}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────── */
const HERO_TEXT = "Hey Jyoti…\nI made something just for you ❤️";
function Hero() {
  const typed = useTyping(HERO_TEXT, 55, true);
  const lines = typed.split("\n");
  return (
    <section id="hero" style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"2rem 1rem", position:"relative"
    }}>
      <div style={{position:"relative", zIndex:5}}>
        <p className="reveal" style={{
          letterSpacing:".3em", color:"#ff6fa5", textTransform:"uppercase",
          fontWeight:700, marginBottom:"1.4rem", fontSize:".88rem"
        }}>A little something ✨</p>
        <h1 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(2.2rem,6vw,3.8rem)",
          lineHeight:1.4, color:"#2d1b2e",
          marginBottom:"2.8rem", whiteSpace:"pre-line"
        }}>
          {lines.map((line,i)=>(
            <span key={i} style={{display:"block"}}>
              {i===lines.length-1 ? <span style={{color:"#ff4d88"}}>{line}</span> : line}
            </span>
          ))}
          <span className="cursor"/>
        </h1>
        <a href="#story" style={{textDecoration:"none"}}>
          <button className="reveal" style={{
            padding:".9rem 2.8rem", borderRadius:99,
            background:"linear-gradient(135deg,#ff6fa5,#ff4d88)",
            color:"#fff", border:"none", cursor:"pointer",
            fontFamily:"'Dancing Script',cursive", fontSize:"1.3rem",
            boxShadow:"0 8px 30px rgba(255,77,136,0.38)", transition:"transform .2s"
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.07)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
            Enter Our Story 💗
          </button>
        </a>
      </div>
    </section>
  );
}

/* ─── TIMELINE ───────────────────────────────────────────────────────── */
const MEMORIES = [
  { date:"5/2/2023",  emoji:"💌",img:"/photos/mem1.png", title:"First Time We Met on Telegram 📱",
    text:"Maine Telegram pe circle ka formula pucha tha toh tumne reply kiya tha sabse pehle. Fir tum mujhe ladki samajh ke baat karne lagi — aur jab maine bata diya ki main ladka hoon, tumne block kar diya! 😭😂\n\nFir hum group mein tumko jaake ulta sidha bolne lage aur fir tum dobara unblock ki — aur phir baat start hua. lol 🙈" },
  { date:"18/2/2023", emoji:"🥲",img:"/photos/mem2.png", title:"I Disappeared 👻",
    text:"Us time hum tumhe lekar zyada serious nahi the. Bole ki humko padhna hai aur gayab ho gaye.\n\nTum udas ho gayi thi — apne birthday pe har ghante check karti thi ki mera message aaya hoga. Lekin humne kiya nahi 🥲 But uske 10 din baad hi aa gaye! lol" },
  { date:"7/3/2023",  emoji:"🌈",img:"/photos/mem3.png", title:"Holi Wali Vibes 🎨",
    text:"Tumhe bahut mann karta hai holi khelne ka, lekin tum khel nahi paati — koi hota hi nahi khelne wala.\n\nToh jab hum holi khel rahe the apne ghar mein — tumhe video aur photos bhejte the. Tumhe dekhne mein maza aata tha lol 😂" },
  { date:"7/7/2023",  emoji:"🎬",img:"/photos/mem4.png", title:"Twilight Nights 🌙",
    text:"Hum saath mein Twilight dekhte the raat mein, aur der raat tak baat bhi karte the.\n\nBahut maza aata tha yaar, kasam se — unforgettable memories hain woh sab 😭❤️" },
  { date:"12/11/2023",emoji:"💍",img:"/photos/mem5.png", title:"My Birthday — Cringe par Beautiful 🎂",
    text:"Mere birthday pe tum bahut sara effort karke likha tha. Aur humne achhe se reply bhi nahi diya — tum udas ho gayi thi.\n\nLekin fir hum raat mein aaye, lagbhag 1 baje. Aur hamlog 7 FERE ki jagah 7 KASAM KHAYE 😭😂😂 Bahut cute tha woh moment ❤️" },
];

function MemoryCard({ m, side }) {
  const cls = side === "left" ? "reveal-left" : "reveal-right";
  return (
    <div className={`glass ${cls}`} style={{maxWidth:420, padding:"1.6rem 1.8rem", width:"100%"}}>
      <div style={{display:"flex", alignItems:"center", gap:".6rem", marginBottom:".7rem"}}>
        <span style={{fontSize:"1.8rem"}}>{m.emoji}</span>
        <span style={{fontSize:".82rem",color:"#ff6fa5",fontWeight:700,background:"#fff0f6",padding:".2rem .75rem",borderRadius:99}}>
          {m.date}
        </span>
      </div>
      <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",color:"#ff4d88",marginBottom:".7rem",lineHeight:1.35}}>
        {m.title}
      </h3>
<img
  src={m.img}
  alt={m.title}
  style={{width:"100%", height:180, objectFit:"cover", borderRadius:14, marginBottom:".9rem"}}
/>
      <p style={{lineHeight:1.8,color:"#7a5263",fontSize:".9rem",whiteSpace:"pre-line"}}>{m.text}</p>
    </div>
  );
}

function Timeline() {
  return (
    <section id="story" style={{padding:"5rem 1rem 6rem",maxWidth:1100,margin:"0 auto"}}>
      <h2 className="section-title reveal">Our Story 📖</h2>
      <p className="section-sub reveal" style={{transitionDelay:".12s"}}>The moments that made us, us</p>
      <div className="timeline">
        {MEMORIES.map((m,i)=>(
          <div key={i} className={i%2===0?"tl-left":"tl-right"}>
            <MemoryCard m={m} side={i%2===0?"left":"right"} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── LOVE LETTER ────────────────────────────────────────────────────── */
const LETTER = `Jyoti,

Kuch cheezein hoti hain jo hum bol nahi paate — par feel karte hain poori gehraai se.

Tum ek aisi ladki ho jo duniya ke saamne haste hue aage badhti hai, par andar se bahut zyada feel karti ho. Tum express nahi karti easily — par jo love karti ho, woh sach mein pure dil se karti ho yar.

Jab tum kisi ki parwaah karti ho, toh uss mein itni caring energy hoti hai ki insan bas khud ko bohot lucky feel krta hai. Tum kisi ke liye raat bhar jaag sakti ho, unke liye effort karti ho — bina kuch zyada bole.

Tum thodi savage bhi ho — toh life aur interesting lagti hai 😄 Tmhari baatein, tmhare reactions, tmhare silences — sab kuch memorable hai.

Yeh website sirf ek chhoti si koshish hai — ki tuko feel ho ki tmhare woh chote wale moments, woh raat ki baatein, woh holi ki videos — hum bhoolein nahi hain.

Hum jaante hain hum hamesha perfect nahi the — but we're here, we're trying, and that counts.

Happy birthday, Jyoti 🌸

— deepansh ❤️`;

function LoveLetter() {
  const [open, setOpen] = useState(false);
  const [go, setGo]     = useState(false);
  const typed = useTyping(LETTER, 16, go);
  const handleOpen = () => { setOpen(true); setTimeout(()=>setGo(true),500); };
  return (
    <section style={{padding:"5rem 1rem",maxWidth:760,margin:"0 auto"}}>
      <h2 className="section-title reveal">A Letter For You 💌</h2>
      <p className="section-sub reveal" style={{transitionDelay:".12s"}}>Sirf tumhare liye likha hai</p>
      {!open ? (
        <div className="reveal" style={{display:"flex",justifyContent:"center"}}>
          <div onClick={handleOpen} style={{textAlign:"center",cursor:"pointer"}}>
            <div style={{
              fontSize:"7rem",lineHeight:1,
              filter:"drop-shadow(0 8px 24px rgba(255,77,136,0.3))",
              transition:"transform .3s"
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1) rotate(-5deg)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1) rotate(0)"}>💌</div>
            <p style={{color:"#ff6fa5",fontFamily:"'Dancing Script',cursive",fontSize:"1.3rem",marginTop:".8rem"}}>
              Click to open your letter…
            </p>
          </div>
        </div>
      ) : (
        <div className="glass letter-open" style={{padding:"2.5rem 2rem"}}>
          <p style={{fontFamily:"'Nunito',sans-serif",fontSize:".96rem",color:"#2d1b2e",lineHeight:1.95,whiteSpace:"pre-line"}}>
            {typed}
            {typed.length < LETTER.length && <span className="cursor"/>}
          </p>
        </div>
      )}
    </section>
  );
}

/* ─── REASONS ────────────────────────────────────────────────────────── */
const REASONS = [
  { emoji:"🌟", title:"Tum genuine ho",          text:"Duniya bhar ke natak mein, sirf tum real me mere sath ho. Koi show off nahi, koi drama nahi — just tum, as you are." },
  { emoji:"💪", title:"Tum silently strong ho",  text:"Tum mushkilon mein bhi hasti rehti ho aur hum jaante hain ki yeh asaan nahi hota." },
  { emoji:"🌙", title:"Raat ki baatein",          text:"Tmhari raat ki baatein, woh late-night conversations — unhe yaad karna hi sab kuch feel kara deta hai." },
  { emoji:"😂", title:"Tmhare reactions priceless", text:"Tmhari har reaction — chahe khushi ki ho ya surprise ki — itni pure lagti hai, hum bas muskura dete hain." },
  { emoji:"❤️", title:"Poore dil se pyaar karti ho", text:"Tum dil lagate waqt zyada nahi bolti — par jab laati hai toh sach mein full commitment ke saath." },
  { emoji:"🌸", title:"Chhote wale gestures",     text:"Tmhari chhoti chhoti cheezein — woh birthday effort, woh bar bar check karna — hum notice karte hain sab." },
  { emoji:"🎯", title:"Tum honest ho",            text:"Seedhi baat karti ho, bina ghuma ke. Yeh quality rare aur genuinely valuable hai." },
  { emoji:"🏠", title:"Tmhare saath home feel",     text:"Jab baat karti ho, ek ajeeb sa sukoon milta hai — jaise sab theek ho jaayega." },
];
function Reasons() {
  const [cur,setCur]=useState(0); const [k,setK]=useState(0);
  const go=dir=>{ setCur(c=>Math.min(Math.max(c+dir,0),REASONS.length-1)); setK(x=>x+1); };
  const r=REASONS[cur];
  return (
    <section style={{padding:"5rem 1rem",maxWidth:600,margin:"0 auto",textAlign:"center"}}>
      <h2 className="section-title reveal">Why I Love You 💗</h2>
      <p className="section-sub reveal" style={{transitionDelay:".12s"}}>Click to explore each reason</p>
      <div key={k} className="glass flip-in" style={{padding:"2.5rem 2rem",marginBottom:"1.8rem"}}>
        <div style={{fontSize:"3.2rem",marginBottom:".8rem"}}>{r.emoji}</div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",color:"#ff4d88",marginBottom:".9rem"}}>{r.title}</h3>
        <p style={{color:"#7a5263",lineHeight:1.85,fontSize:".95rem"}}>{r.text}</p>
        <div style={{marginTop:"1.4rem",color:"#ff6fa5",fontSize:".85rem",fontWeight:700}}>{cur+1} / {REASONS.length}</div>
        <div style={{display:"flex",justifyContent:"center",gap:".4rem",marginTop:".8rem"}}>
          {REASONS.map((_,i)=>(
            <div key={i} onClick={()=>{setCur(i);setK(x=>x+1);}} style={{
              width:i===cur?20:8,height:8,borderRadius:99,
              background:i===cur?"#ff4d88":"#ffd6e7",
              transition:"width .3s,background .3s",cursor:"pointer"
            }}/>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:"1rem",justifyContent:"center"}}>
        <button onClick={()=>go(-1)} disabled={cur===0} style={{
          padding:".7rem 1.8rem",borderRadius:99,fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".95rem",
          border:"none",cursor:cur===0?"not-allowed":"pointer",
          background:cur===0?"#f5d8e4":"#ffd6e7",color:cur===0?"#c9a0b2":"#ff4d88",transition:"all .2s"
        }}>← Prev</button>
        <button onClick={()=>go(1)} disabled={cur===REASONS.length-1} style={{
          padding:".7rem 1.8rem",borderRadius:99,fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".95rem",
          border:"none",cursor:cur===REASONS.length-1?"not-allowed":"pointer",
          background:cur===REASONS.length-1?"#f5d8e4":"linear-gradient(135deg,#ff6fa5,#ff4d88)",
          color:cur===REASONS.length-1?"#c9a0b2":"#fff",
          boxShadow:cur===REASONS.length-1?"none":"0 4px 18px rgba(255,77,136,0.3)",transition:"all .2s"
        }}>Next →</button>
      </div>
    </section>
  );
}

/* ─── COUNTER ────────────────────────────────────────────────────────── */
const START_DATE = new Date("2023-02-05T00:00:00");
function Num({v,label}) {
  return (
    <div className="glass pulse" style={{padding:"1.2rem 1.4rem",textAlign:"center",minWidth:85}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,2.8rem)",color:"#ff4d88",fontWeight:700}}>
        {String(v).padStart(2,"0")}
      </div>
      <div style={{color:"#7a5263",fontSize:".78rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginTop:".2rem"}}>
        {label}
      </div>
    </div>
  );
}
function Counter() {
  const [t,setT]=useState(Math.floor((Date.now()-START_DATE)/1000));
  useEffect(()=>{ const id=setInterval(()=>setT(Math.floor((Date.now()-START_DATE)/1000)),1000); return()=>clearInterval(id); },[]);
  return (
    <section style={{padding:"5rem 1rem",textAlign:"center"}}>
      <h2 className="section-title reveal">Time Together ⏳</h2>
      <p className="section-sub reveal" style={{transitionDelay:".12s"}}>5 February 2023 — still counting 💗</p>
      <div className="reveal" style={{display:"flex",flexWrap:"wrap",gap:"1rem",justifyContent:"center"}}>
        <Num v={Math.floor(t/86400)} label="Days"/>
        <Num v={Math.floor((t%86400)/3600)} label="Hours"/>
        <Num v={Math.floor((t%3600)/60)} label="Minutes"/>
        <Num v={t%60} label="Seconds"/>
      </div>
      <p className="reveal" style={{marginTop:"2rem",fontFamily:"'Dancing Script',cursive",fontSize:"1.4rem",color:"#ff6fa5",transitionDelay:".2s"}}>
        aur yeh silsila chalata rahe… ❤️
      </p>
    </section>
  );
}

/* ─── PROMISES ───────────────────────────────────────────────────────── */
const PROMISES = [
  { emoji:"✈️", title:"Travel Together",       text:"Ek din hum saath kahin door jayenge — pahad ho ya beach — sirf hum dono aur woh khuli hawa." },
  { emoji:"🤝", title:"Meet Soon",              text:"Yeh distance zyada der nahi rahega. Ek din aankhein uthaungi aur tum saamne hogi — woh din aayega, promise." },
  { emoji:"🌃", title:"Late Night Walks",       text:"Raat mein akele ghumna alag hi feeling hai. aur tmhare saath? Woh toh kuch aur hi hoga." },
  { emoji:"🎬", title:"Movie Nights IRL",       text:"Phone pe Twilight dekhna tha. Ab real mein saath baithke dekhenge — popcorn ke saath, blanket ke andar." },
  { emoji:"🏡", title:"Build a Life Together",  text:"Yeh dreams sab milke banana hai — chota sa ghar, bade se sapne, aur tum mere saath. Bas yahi chahiye." },
];
function Promises() {
  return (
    <section style={{padding:"5rem 1rem 6rem",maxWidth:1000,margin:"0 auto"}}>
      <h2 className="section-title reveal">Future Promises 🌅</h2>
      <p className="section-sub reveal" style={{transitionDelay:".12s"}}>Jo hum milke karenge</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:"1.3rem"}}>
        {PROMISES.map((p,i)=>(
          <div key={i} className="glass promise-card reveal" style={{padding:"1.8rem 1.5rem",transitionDelay:`${i*0.1}s`}}>
            <div style={{fontSize:"2.4rem",marginBottom:".8rem"}}>{p.emoji}</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",color:"#ff4d88",marginBottom:".7rem"}}>{p.title}</h3>
            <p style={{color:"#7a5263",lineHeight:1.8,fontSize:".92rem"}}>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── QUIZ ───────────────────────────────────────────────────────────── */
const QUIZ = [
  {
    q: "Maine pehli baar tumse kya pucha tha Telegram pe? 🤔",
    options: ["Tumhara naam kya hai?", "Circle ka formula kya hota hai?", "Kya tum padh rahi ho?", "Mujhe tumse baat karni hai"],
    ans: 1,
    funFact: "Bilkul sahi! Circle ka formula tha — aur tumne sabse pehle reply karke history ban gayi! 😂❤️"
  },
  {
    q: "Tumne mujhe pehli baar kab block kiya? 😭",
    options: ["Jab hum argue kiye the", "Jab maine bola ki main ladka hoon", "Jab hum bina bole gayab ho gaye", "Tumne kabhi block nahi kiya"],
    ans: 1,
    funFact: "Haan! Maine reveal kiya ki main ladka hoon — aur tumne turant block kar diya 😭😂 Classic Jyoti move!"
  },
  {
    q: "Hum raat ko milke kaun si movie dekhte the? 🎬",
    options: ["Harry Potter series", "The Notebook", "Twilight", "Spider-Man: No Way Home"],
    ans: 2,
    funFact: "Twilight! 🌙 Raat ke woh movie nights — der raat tak baatein — bohot unforgettable tha yaar ❤️"
  },
  {
    q: "Mere birthday pe humne 7 FERE ki jagah kya kiya? 😂",
    options: ["7 promises ek dusre ko likhe", "7 kasam khaye", "7 gifts bheje ek dusre ko", "7 baar sorry bola"],
    ans: 1,
    funFact: "7 KASAM KHAYE raat 1 baje! 😭😂 Cringe tha par dil se cute tha — yeh memory forever rahegi ❤️"
  },
  {
    q: "Holi ke time hum tumhe kya bhejte the jab khud holi khel rahe the? 🎨",
    options: ["Sirf text messages", "Voice notes", "Videos aur photos", "Kuch nahi bheja"],
    ans: 2,
    funFact: "Videos aur photos! Tumhe dekhne mein maza aata tha — aur tumhara reaction dekhna bhi 😂🌈"
  },
];

const SCORE_MSGS = [
  { max:1, msg:"Arre yaar 😅 Thoda aur yaad karo humein!", emoji:"🥺", color:"#ff6fa5" },
  { max:2, msg:"Theek hai... par hum expect karte the zyada 😤", emoji:"😏", color:"#ff8c42" },
  { max:3, msg:"Accha kiya! Hum khush hain tumse 😊", emoji:"💕", color:"#ff6fa5" },
  { max:4, msg:"Almost perfect! Tum hume yaad rakhti ho ❤️", emoji:"🌸", color:"#e91e8c" },
  { max:5, msg:"PERFECT SCORE! Tum best ho Jyoti! 😭❤️", emoji:"🏆", color:"#ff4d88" },
];

function Quiz() {
  const [step,     setStep]     = useState(0);  // 0=intro, 1-5=questions, 6=result
  const [picked,   setPicked]   = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score,    setScore]    = useState(0);

  const q = QUIZ[step-1];

  const choose = i => {
    if(answered) return;
    setPicked(i);
    setAnswered(true);
    if(i === q.ans) setScore(s=>s+1);
  };

  const next = () => { setPicked(null); setAnswered(false); setStep(s=>s+1); };
  const restart = () => { setPicked(null); setAnswered(false); setScore(0); setStep(1); };

  const sm = SCORE_MSGS.find(s => score <= s.max) || SCORE_MSGS[SCORE_MSGS.length-1];

  return (
    <section style={{padding:"5rem 1rem 7rem",maxWidth:680,margin:"0 auto"}}>
      <h2 className="section-title reveal">Memory Quiz 🎯</h2>
      <p className="section-sub reveal" style={{transitionDelay:".12s"}}>Kitna yaad hai humara? 😏</p>

      {/* ── INTRO ── */}
      {step===0 && (
        <div className="glass reveal" style={{padding:"2.5rem 2rem",textAlign:"center"}}>
          <div style={{fontSize:"4rem",marginBottom:"1rem"}}>🧠</div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",color:"#ff4d88",marginBottom:"1rem"}}>
            5 Questions About Us
          </h3>
          <p style={{color:"#7a5263",lineHeight:1.8,marginBottom:"2rem",fontSize:".95rem"}}>
            Chalo dekhte hain — Jyoti ko humari kitni yaadein yaad hain 😄<br/>
            5 questions hain, 4 options each. All the best! 💗
          </p>
          <button onClick={()=>setStep(1)} style={{
            padding:".9rem 2.5rem",borderRadius:99,
            background:"linear-gradient(135deg,#ff6fa5,#ff4d88)",
            color:"#fff",border:"none",cursor:"pointer",
            fontFamily:"'Dancing Script',cursive",fontSize:"1.25rem",
            boxShadow:"0 6px 24px rgba(255,77,136,0.35)",transition:"transform .2s"
          }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            Start Quiz ✨
          </button>
        </div>
      )}

      {/* ── QUESTION ── */}
      {step>=1 && step<=5 && (
        <div key={step} className="glass bounce-in" style={{padding:"2.5rem 2rem"}}>
          {/* Progress bar */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
            <span style={{color:"#ff6fa5",fontWeight:700,fontSize:".88rem"}}>Q{step} of 5</span>
            <div style={{flex:1,margin:"0 1rem",height:8,borderRadius:99,background:"#ffd6e7",overflow:"hidden"}}>
              <div style={{
                height:"100%",borderRadius:99,
                background:"linear-gradient(90deg,#ff6fa5,#ff4d88)",
                width:`${(step/5)*100}%`,transition:"width .5s ease"
              }}/>
            </div>
            <span style={{
              background:"#fff0f6",color:"#ff4d88",
              fontWeight:700,fontSize:".88rem",
              padding:".2rem .7rem",borderRadius:99
            }}>Score: {score}</span>
          </div>

          <h3 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(1.05rem,3vw,1.3rem)",
            color:"#2d1b2e",marginBottom:"1.6rem",lineHeight:1.55
          }}>{q.q}</h3>

          <div style={{display:"flex",flexDirection:"column",gap:".75rem",marginBottom:"1.4rem"}}>
            {q.options.map((opt,i)=>{
              let cls="quiz-option";
              if(answered){
                if(i===q.ans)    cls+=" correct";
                else if(i===picked) cls+=" wrong";
              }
              const badge =
                answered && i===q.ans   ? "✓" :
                answered && i===picked  ? "✗" :
                ["A","B","C","D"][i];
              const badgeBg =
                answered && i===q.ans   ? "#28a745" :
                answered && i===picked  ? "#dc3545" :
                "#ffd6e7";
              const badgeColor =
                answered && (i===q.ans||i===picked) ? "#fff" : "#ff4d88";

              return (
                <button key={i} className={cls} onClick={()=>choose(i)} disabled={answered}>
                  <span style={{
                    display:"inline-flex",alignItems:"center",justifyContent:"center",
                    width:26,height:26,borderRadius:"50%",flexShrink:0,
                    background:badgeBg,color:badgeColor,
                    fontSize:".78rem",fontWeight:700,marginRight:".75rem",
                    transition:"background .3s,color .3s"
                  }}>{badge}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Fun fact */}
          {answered && (
            <div style={{
              borderRadius:14,padding:"1rem 1.2rem",marginBottom:"1.2rem",
              background: picked===q.ans
                ? "linear-gradient(135deg,rgba(212,237,218,0.8),rgba(195,230,203,0.8))"
                : "linear-gradient(135deg,rgba(255,243,205,0.8),rgba(255,236,153,0.5))",
              border:`1.5px solid ${picked===q.ans?"#28a745":"#ffc107"}`,
              fontSize:".9rem",color:"#2d1b2e",lineHeight:1.75
            }}>
              {picked===q.ans
                ? <><strong>✅ Bilkul sahi!</strong><br/>{q.funFact}</>
                : <><strong>❌ Galat!</strong> Sahi jawab tha: <strong style={{color:"#28a745"}}>"{q.options[q.ans]}"</strong><br/>{q.funFact}</>
              }
            </div>
          )}

          {answered && (
            <button onClick={next} style={{
              width:"100%",padding:".85rem",borderRadius:14,
              background:"linear-gradient(135deg,#ff6fa5,#ff4d88)",
              color:"#fff",border:"none",cursor:"pointer",
              fontFamily:"'Nunito',sans-serif",fontSize:"1rem",fontWeight:700,
              boxShadow:"0 4px 18px rgba(255,77,136,0.3)",transition:"transform .2s"
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              {step===5?"See My Score 🎉":"Next Question →"}
            </button>
          )}
        </div>
      )}

      {/* ── RESULT ── */}
      {step===6 && (
        <div className="glass" style={{padding:"3rem 2rem",textAlign:"center"}}>
          <div className="score-reveal" style={{display:"inline-block",marginBottom:"1rem"}}>
            <div style={{fontSize:"5rem",lineHeight:1.1}}>{sm.emoji}</div>
            <div style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(3.5rem,12vw,5.5rem)",
              color:sm.color,fontWeight:700,lineHeight:1
            }}>
              {score}<span style={{fontSize:"2rem",color:"#7a5263",fontWeight:400}}>/5</span>
            </div>
          </div>

          <h3 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(1.1rem,3vw,1.4rem)",
            color:"#2d1b2e",margin:"1rem 0 .7rem",lineHeight:1.4
          }}>{sm.msg}</h3>

          {/* Score bar */}
          <div style={{width:"100%",height:12,borderRadius:99,background:"#ffd6e7",margin:"1.2rem 0 1.5rem",overflow:"hidden"}}>
            <div style={{
              height:"100%",borderRadius:99,
              background:`linear-gradient(90deg,#ff6fa5,${sm.color})`,
              width:`${(score/5)*100}%`,
              transition:"width 1.4s cubic-bezier(.22,1,.36,1)"
            }}/>
          </div>

          {/* Individual result dots */}
          <div style={{display:"flex",justifyContent:"center",gap:".6rem",marginBottom:"1.8rem"}}>
            {QUIZ.map((_,i)=>(
              <div key={i} style={{
                width:36,height:36,borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"1.1rem",
                background: i<score ? "linear-gradient(135deg,#d4edda,#c3e6cb)" : "linear-gradient(135deg,#f8d7da,#f5c6cb)",
                border:`1.5px solid ${i<score?"#28a745":"#dc3545"}`
              }}>
                {i<score?"✓":"✗"}
              </div>
            ))}
          </div>

          <p style={{color:"#7a5263",lineHeight:1.8,marginBottom:"2rem",fontSize:".93rem"}}>
            {score===5 ? "Tumne sab yaad rakha! Yeh prove karta hai ki hum tumhare dil mein hain 💗"
            :score>=3  ? "Accha kiya! Humari yaadein tumhare saath hain 🌸"
            :             "Ek baar aur try karo — shayad ibaar zyada yaad aaye! 😄"}
          </p>

          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={restart} style={{
              padding:".8rem 2rem",borderRadius:99,background:"#ffd6e7",
              color:"#ff4d88",border:"none",cursor:"pointer",
              fontFamily:"'Nunito',sans-serif",fontSize:".95rem",fontWeight:700,transition:"transform .2s"
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              🔄 Play Again
            </button>
            <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{
              padding:".8rem 2rem",borderRadius:99,
              background:"linear-gradient(135deg,#ff6fa5,#ff4d88)",
              color:"#fff",border:"none",cursor:"pointer",
              fontFamily:"'Nunito',sans-serif",fontSize:".95rem",fontWeight:700,
              boxShadow:"0 4px 18px rgba(255,77,136,0.3)",transition:"transform .2s"
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              ↑ Back to Top ❤️
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{textAlign:"center",padding:"3rem 1rem 5rem",color:"#7a5263"}}>
      <div style={{fontSize:"2.5rem",marginBottom:".6rem"}}>💗</div>
      <p style={{fontFamily:"'Dancing Script',cursive",fontSize:"1.35rem",color:"#ff6fa5"}}>
        Made with all my heart — deepansh
      </p>
      <p style={{fontSize:".85rem",marginTop:".4rem",opacity:.65}}>5 February 2023 · forever counting</p>
    </footer>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────────── */
export default function App() {
  const [unlocked,    setUnlocked]    = useState(false);
  const [playing,     setPlaying]     = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);

  useScrollReveal();

  const toggleMusic = () => {
    if(!musicLoaded) setMusicLoaded(true);
    setPlaying(p=>!p);
  };

  return (
    <>
      <CursorGlow/>

      {/* YouTube iframe — loaded on first toggle, persists through unlock */}
      {musicLoaded && (
        <iframe
          style={{display:"none"}}
          src={`https://www.youtube.com/embed/U9Ba5qJU6fw?autoplay=${playing?1:0}&loop=1&playlist=U9Ba5qJU6fw`}
          allow="autoplay"
          title="bg music"
        />
      )}

      {!unlocked ? (
        <PasswordGate
          onUnlock={()=>setUnlocked(true)}
          playing={playing}
          onToggle={toggleMusic}
        />
      ) : (
        <div style={{
          minHeight:"100vh",
          background:"linear-gradient(135deg,#fff0f6 0%,#fce4ff 50%,#e8d5ff 100%)",
          backgroundAttachment:"fixed",
          position:"relative"
        }}>
          <FloatingHearts/>
          <Hero/>
          <Timeline/>
          <LoveLetter/>
          <Reasons/>
          <Counter/>
          <Promises/>
          <Quiz/>
          <Footer/>
          {/* Fixed music btn after unlock */}
          <MusicButton playing={playing} onToggle={toggleMusic} fixed/>
        </div>
      )}
    </>
  );
}
