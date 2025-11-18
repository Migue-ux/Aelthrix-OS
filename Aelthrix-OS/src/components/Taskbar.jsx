import React, { useEffect, useState } from "react";
import "../styles/taskbar.css";

export default function Taskbar({ openWindows = [], onClickApp, onLaunch }) {
  const uniq = Array.from(new Map(openWindows.map(w => [w.label, w])).values());
  const [time, setTime] = useState(new Date());
  useEffect(()=> {
    const t = setInterval(()=> setTime(new Date()), 1000);
    return ()=> clearInterval(t);
  },[]);
  return (
    <div className="taskbar">
      <div className="taskbar-left">Aelthrix</div>
      <div className="dock">
        <button className="dock-launch" onClick={()=> onLaunch && onLaunch("Terminal")}>💻</button>
        <button className="dock-launch" onClick={()=> onLaunch && onLaunch("Sistema")}>🧠</button>
        <button className="dock-launch" onClick={()=> onLaunch && onLaunch("Configurações")}>⚙️</button>

        {uniq.map((w) => (
          <button key={w.id} className={`dock-icon ${w.minimized ? "inactive" : "active"}`} onClick={()=> onClickApp && onClickApp(w.label)} title={w.label}>
            {w.key === "terminal" ? "💻" : w.key === "settings" ? "⚙️" : w.key === "system" ? "🧠" : "📄"}
          </button>
        ))}
      </div>
      <div className="taskbar-right">
        <span className="clock">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}
