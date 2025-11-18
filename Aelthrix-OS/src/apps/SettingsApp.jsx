import React, { useEffect, useState } from "react";
import "../styles/settings.css";

export default function SettingsApp({ openApp }) {
  const [theme, setTheme] = useState(localStorage.getItem("aelthrix-theme") || "dark");
  const [wallpaper, setWallpaper] = useState(localStorage.getItem("aelthrix-wallpaper") || "default");
  const [language, setLanguage] = useState(localStorage.getItem("aelthrix-lang") || "pt");
  const [sound, setSound] = useState(localStorage.getItem("aelthrix-sound") !== "off");
  const [volume, setVolume] = useState(Number(localStorage.getItem("aelthrix-volume") || 0.6));
  const [username, setUsername] = useState(localStorage.getItem("aelthrix_user") || "User");

  useEffect(()=> {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("aelthrix-theme", theme);
  },[theme]);

  useEffect(()=> {
    localStorage.setItem("aelthrix-wallpaper", wallpaper);
    // apply to body
    if(wallpaper === "default"){
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=60')";
    } else if(wallpaper==="mac"){
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1518441902114-05f3c3d1e78e?auto=format&fit=crop&w=1600&q=60')";
    } else if(wallpaper==="matrix"){
      document.body.style.backgroundImage = "url('https://wallpaperaccess.com/full/131586.jpg')";
    } else {
      document.body.style.background = "linear-gradient(180deg,#041021,#082133)";
    }
  },[wallpaper]);

  useEffect(()=> {
    localStorage.setItem("aelthrix-lang", language);
  },[language]);

  useEffect(()=> {
    localStorage.setItem("aelthrix-sound", sound ? "on" : "off");
  },[sound]);

  useEffect(()=> {
    localStorage.setItem("aelthrix-volume", volume);
  },[volume]);

  const playClick = (vol = volume) => {
    if (!sound) return;
    const a = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-click-mouse-1126.mp3");
    a.volume = Math.min(1, vol);
    a.play().catch(()=>{});
  };

  const restartSystem = () => {
    playClick();
    setTimeout(()=> window.location.reload(), 400);
  };

  const shutdownSystem = () => {
    playClick();
    document.body.style.background = "black";
    document.body.innerHTML = "<h1 style='color:lime;text-align:center;margin-top:40vh;font-family:monospace'>Sistema Desligado</h1>";
    setTimeout(()=> window.close(), 1500);
  };

  return (
    <div style={{padding:12, maxWidth:520}}>
      <h3 style={{marginTop:0}}>⚙️ Configurações</h3>

      <div style={{marginTop:10}}>
        <div style={{marginBottom:6}}>Tema</div>
        <div style={{display:"flex", gap:8}}>
          <button onClick={()=>{setTheme("dark"); playClick()}} style={{padding:8, borderRadius:8}}>Dark</button>
          <button onClick={()=>{setTheme("light"); playClick()}} style={{padding:8, borderRadius:8}}>Light</button>
          <button onClick={()=>{setTheme("matrix"); playClick()}} style={{padding:8, borderRadius:8}}>Matrix</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <div>Papel de parede</div>
        <select value={wallpaper} onChange={(e)=>{ setWallpaper(e.target.value); playClick(); }} style={{padding:8, width:"100%"}}>
          <option value="default">Paisagem</option>
          <option value="mac">MacOS Vibe</option>
          <option value="matrix">Matrix</option>
          <option value="grad">Gradiente</option>
        </select>
      </div>

      <div style={{marginTop:12}}>
        <label><input type="checkbox" checked={sound} onChange={(e)=>{ setSound(e.target.checked); playClick(); }} /> Som do sistema</label>
      </div>

      <div style={{marginTop:12}}>
        <div>Volume: {(volume*100).toFixed(0)}%</div>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e)=> setVolume(Number(e.target.value))} style={{width:"100%"}} />
      </div>

      <div style={{marginTop:12}}>
        <div>Usuário</div>
        <input value={username} onChange={(e)=> setUsername(e.target.value)} onBlur={()=> localStorage.setItem("aelthrix_user", username)} style={{width:"100%", padding:8}} />
      </div>

      <div style={{marginTop:16, display:"flex", gap:8}}>
        <button onClick={restartSystem} style={{flex:1, padding:8, borderRadius:8, background:"linear-gradient(90deg,var(--accent2),var(--accent1))", color:"#001"}}>Reiniciar</button>
        <button onClick={shutdownSystem} style={{flex:1, padding:8, borderRadius:8, background:"#ff4d4d"}}>Desligar</button>
      </div>
    </div>
  );
}
