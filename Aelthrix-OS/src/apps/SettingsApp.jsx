import React, { useEffect, useState } from "react";

export default function SettingsApp() {
  const [theme, setTheme] = useState(() => localStorage.getItem("aelthrix_theme") || "neon");
  const [user, setUser] = useState(() => localStorage.getItem("aelthrix_user") || "Miguel");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("aelthrix_theme", theme);
  }, [theme]);

  const saveUser = () => {
    localStorage.setItem("aelthrix_user", user);
    alert("Nome salvo: " + user);
  };

  return (
    <div style={{ padding: 12, maxWidth: 420 }}>
      <h3 style={{ marginTop: 0 }}>⚙️ Configurações</h3>

      <div style={{ marginTop: 10 }}>
        <div style={{ marginBottom: 6 }}>Tema</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTheme("neon")} style={{ padding: 8, borderRadius: 8 }}>Neon Aelthrix</button>
          <button onClick={() => setTheme("macos")} style={{ padding: 8, borderRadius: 8 }}>macOS</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div>Usuário</div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input value={user} onChange={(e) => setUser(e.target.value)} style={{ flex: 1, padding: 8 }} />
          <button onClick={saveUser}>Salvar</button>
        </div>
      </div>

      <p style={{ marginTop: 12, color: "rgba(255,255,255,0.8)" }}>
        Use essas configurações básicas como ponto de partida — dá pra adicionar wallpaper, sons e mais.
      </p>
    </div>
  );
}
