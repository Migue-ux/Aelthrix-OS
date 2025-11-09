import React, { useState } from "react";
import Window from "./Window";
import Taskbar from "./Taskbar";
import DesktopIcon from "./DesktopIcon";

import TerminalApp from "../apps/TerminalApp.jsx";
import SettingsApp from "../apps/SettingsApp.jsx";
import SystemApp from "../apps/SystemApp.jsx";


import "../styles/desktop.css";

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [zCounter, setZCounter] = useState(100);

  const appsMap = {
    Terminal: { key: "terminal", icon: <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000000"><path d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm0-60h680v-436H140v436Zm160-72-42-42 103-104-104-104 43-42 146 146-146 146Zm190 4v-60h220v60H490Z"/></svg> },
    "Configurações": { key: "settings", icon: <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000000"><path d="M576-100h280v-32q-26-32-62-50t-78-18q-42 0-78 18t-62 50v32Zm140-140q25 0 42.5-17.5T776-300q0-25-17.5-42.5T716-360q-25 0-42.5 17.5T656-300q0 25 17.5 42.5T716-240ZM480-480Zm0-130q-54 0-92 38t-38 92q0 43 24 76t62 47q0-17 1-34t3-31q-14-9-22-25t-8-33q0-29 20.5-49.5T480-550q18 0 34 8.5t25 24.5q9-2 18.5-2.5t18.5-.5h27q-13-39-46.5-64.5T480-610ZM388-80l-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 80v1-1h-61q-1-7-2-13.5t-3-13.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q26 26 59.5 43.5T436-249v169h-48Zm188 40q-25 0-42.5-17.5T516-100v-280q0-25 17.5-42.5T576-440h280q25 0 42.5 17.5T916-380v280q0 25-17.5 42.5T856-40H576Z"/></svg> },
    Sistema: { key: "system", icon: <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000000"><path d="m653-208-88 88-85-85 88-88q-4-11-6-23t-2-24q0-58 41-99t99-41q18 0 35 4.5t32 12.5l-95 95 56 56 95-94q8 15 12.5 31.5T840-340q0 58-41 99t-99 41q-13 0-24.5-2t-22.5-6Zm182-332h-62q-23-102-104-171t-189-69q-125 0-212.5 87.5T180-480q0 81 38.5 147.5T320-226v-114h60v220H160v-60h121q-73-48-117-127t-44-173q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q134 0 233.5 86T835-540Z"/></svg> },
  };

  const openApp = (label) => {
    // bring to front if exists, else create
    const exists = windows.find((w) => w.label === label);
    if (exists) {
      setWindows((prev) =>
        prev.map((w) =>
          w.label === label ? { ...w, minimized: false, zIndex: zCounter + 1 } : w
        )
      );
      setZCounter((c) => c + 1);
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

    setWindows((prev) => [...prev, newWin]);
    setZCounter((c) => c + 1);
  };

  const closeApp = (id) => setWindows((prev) => prev.filter((w) => w.id !== id));
  const minimizeApp = (id) => setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  const focusApp = (id) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter + 1 } : w)));
    setZCounter((c) => c + 1);
  };

  // pass function to apps so they can open other apps (Terminal -> open settings)
  const renderAppContent = (w) => {
    const commonProps = { openApp };
    if (w.key === "terminal") return <TerminalApp {...commonProps} />;
    if (w.key === "settings") return <SettingsApp {...commonProps} />;
    return <SystemApp {...commonProps} />;
  };

  return (
    <div className="desktop">
      {/* wallpaper + icons */}
      <div className="desktop-overlay" />

      <div className="desktop-icons">
        {Object.keys(appsMap).map((label) => (
          <DesktopIcon
            key={label}
            icon={appsMap[label].icon}
            label={label}
            onDoubleClick={() => openApp(label)}
          />
        ))}
      </div>

      {/* windows */}
      {windows.map((w) => {
        if (w.minimized) return null;
        return (
          <div key={w.id} style={{ position: "absolute", zIndex: w.zIndex }}>
            <Window
              title={w.label}
              onClose={() => closeApp(w.id)}
              onMinimize={() => minimizeApp(w.id)}
              onFocus={() => focusApp(w.id)}
            >
              {renderAppContent(w)}
            </Window>
          </div>
        );
      })}

      {/* dock / taskbar */}
      <Taskbar
        openWindows={windows}
        onClickApp={(title) => {
          const win = windows.find((p) => p.label === title);
          if (!win) return;
          if (win.minimized) {
            setWindows((prev) => prev.map((p) => (p.id === win.id ? { ...p, minimized: false, zIndex: zCounter + 1 } : p)));
            setZCounter((c) => c + 1);
          } else {
            setWindows((prev) => prev.map((p) => (p.id === win.id ? { ...p, minimized: true } : p)));
          }
        }}
        onLaunch={(label) => openApp(label)}
      />
    </div>
  );
}
