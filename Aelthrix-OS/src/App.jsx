import React, { useState, useEffect } from "react";
import Desktop from "./components/Desktop";
import "./styles/desktop.css";

export default function App() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1900); // ~2s boot
    return () => clearTimeout(t);
  }, []);

  if (booting) {
    return (
      <div className="boot-screen">
        <div className="boot-card">
          <div className="boot-logo">Aelthrix</div>
          <div className="boot-sub">Iniciando Aelthrix OS…</div>
          <div className="boot-spinner" />
        </div>
      </div>
    );
  }

  return <Desktop />;
}
