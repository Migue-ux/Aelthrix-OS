import React, { useEffect, useState } from "react";

export default function SystemApp() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const usedMem = Math.floor(Math.random() * 40) + 20;
  const cpu = Math.floor(Math.random() * 30) + 5;

  return (
    <div style={{ padding: 12, maxWidth: 520, color: "white" }}>
      <h3 style={{ marginTop: 0 }}>🧠 Sistema</h3>

      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Versão</div>
          <div style={{ fontWeight: 600 }}>Aelthrix OS 0.2</div>
        </div>

        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Hora</div>
          <div style={{ fontWeight: 600 }}>{time.toLocaleTimeString()}</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Memória</div>
        <div style={{ height: 10, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden", marginTop: 6 }}>
          <div style={{ width: `${usedMem}%`, height: "100%", background: "linear-gradient(90deg,#6b5bff,#00e0ff)" }} />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>CPU</div>
        <div style={{ height: 10, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden", marginTop: 6 }}>
          <div style={{ width: `${cpu}%`, height: "100%", background: "linear-gradient(90deg,#00e0ff,#6b5bff)" }} />
        </div>
      </div>

      <p style={{ marginTop: 12, opacity: 0.9 }}>
        Métricas fictícias para demonstração.
      </p>
    </div>
  );
}
