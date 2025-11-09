import React from "react";
import "../styles/taskbar.css";

export default function Taskbar({ openWindows = [], onClickApp, onLaunch }) {
  // show unique labels in dock (open apps)
  const uniq = Array.from(new Map(openWindows.map(w => [w.label, w])).values());

  return (
    <div className="taskbar">
      <div className="taskbar-left">Aelthrix</div>

      <div className="dock">
        {/* quick launch icons */}
        <button className="dock-launch" onClick={() => onLaunch && onLaunch("Terminal")}>💻</button>
        <button className="dock-launch" onClick={() => onLaunch && onLaunch("Sistema")}>🧠</button>
        <button className="dock-launch" onClick={() => onLaunch && onLaunch("Configurações")}>⚙️</button>

        {/* open apps */}
        {uniq.map((w) => (
          <button
            key={w.id}
            className={`dock-icon ${w.minimized ? "inactive" : "active"}`}
            onClick={() => onClickApp && onClickApp(w.label)}
            title={w.label}
          >
            {w.key === "terminal" ? "💻" : w.key === "settings" ? "⚙️" : "🧠"}
          </button>
        ))}
      </div>

      <div className="taskbar-right">
        <span className="clock">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}
