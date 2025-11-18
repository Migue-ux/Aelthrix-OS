import React, { useEffect, useRef, useState } from "react";
import Window from "./Window";
import Taskbar from "./Taskbar";
import DesktopIcon from "./DesktopIcon";

import TerminalApp from "../apps/TerminalApp";
import SettingsApp from "../apps/SettingsApp";
import SystemApp from "../apps/SystemApp";
import BrowserApp from "../apps/BrowserApp";
import EditorApp from "../apps/EditorApp";
import CalcApp from "../apps/CalcApp";
import StoreApp from "../apps/StoreApp";

import "../styles/desktop.css";

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [zCounter, setZCounter] = useState(100);
  const appsMap = {
    Terminal: { key: "terminal", component: TerminalApp, icon: "💻" },
    "Configurações": { key: "settings", component: SettingsApp, icon: "⚙️" },
    Sistema: { key: "system", component: SystemApp, icon: "🧠" },
    Navegador: { key: "browser", component: BrowserApp, icon: "🌐" },
    Editor: { key: "editor", component: EditorApp, icon: "📝" },
    Calculadora: { key: "calc", component: CalcApp, icon: "➗" },
    Loja: { key: "store", component: StoreApp, icon: "🏪" },
  };

  // restore installed apps from storage (store app can add)
  useEffect(()=> {
    const saved = JSON.parse(localStorage.getItem("aelthrix_installed_apps") || "[]");
    // could be used later by store
  },[]);

  const openApp = (label) => {
    const exists = windows.find((w) => w.label === label);
    if (exists) {
      setWindows((prev) => prev.map((w) => w.label === label ? { ...w, minimized:false, zIndex: zCounter+1} : w));
      setZCounter(c => c+1);
      return;
    }
    const newWin = {
      id: Date.now(),
      key: appsMap[label].key,
      label,
      minimized: false,
      zIndex: zCounter + 1,
      pos: null,
    };
    setWindows(prev => [...prev, newWin]);
    setZCounter(c => c+1);
    // system open sound
    playOpenSound();
  };

  const playOpenSound = () => {
    const enabled = localStorage.getItem("aelthrix-sound") !== "off";
    const vol = Number(localStorage.getItem("aelthrix-volume") || 0.6);
    if (!enabled) return;
    const a = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
    a.volume = Math.min(1, vol);
    a.play().catch(()=>{});
  };

  const closeApp = (id) => setWindows(prev => prev.filter(w => w.id !== id));
  const minimizeApp = (id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized:true } : w));
  const focusApp = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zCounter+1 } : w));
    setZCounter(c => c+1);
  };

  const renderAppContent = (w) => {
    const comp = Object.values(appsMap).find(a=>a.key===w.key)?.component;
    if (!comp) return <div style={{padding:16}}>App não encontrado</div>;
    const AppComponent = comp;
    return <AppComponent openApp={openApp} />;
  };

  return (
    <div className="desktop">
      <div className="desktop-overlay" />

      <div className="desktop-icons">
        {Object.keys(appsMap).map(label => (
          <DesktopIcon key={label}
            icon={<div style={{fontSize:28}}>{appsMap[label].icon}</div>}
            label={label}
            onDoubleClick={() => openApp(label)}
          />
        ))}
      </div>

      {windows.map(w => {
        if (w.minimized) return null;
        return (
          <div key={w.id} style={{ position: "absolute", zIndex: w.zIndex }}>
            <Window title={w.label}
                    onClose={() => closeApp(w.id)}
                    onMinimize={() => minimizeApp(w.id)}
                    onFocus={() => focusApp(w.id)}>
              {renderAppContent(w)}
            </Window>
          </div>
        );
      })}

      <Taskbar
        openWindows={windows}
        onClickApp={(title) => {
          const win = windows.find(p=>p.label===title);
          if (!win) return;
          if (win.minimized) {
            setWindows(prev => prev.map(p => p.id === win.id ? { ...p, minimized:false, zIndex: zCounter+1 } : p));
            setZCounter(c=>c+1);
          } else {
            setWindows(prev => prev.map(p => p.id === win.id ? { ...p, minimized:true } : p));
          }
        }}
        onLaunch={(label) => openApp(label)}
      />
    </div>
  );
}
