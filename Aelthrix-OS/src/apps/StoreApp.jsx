import React, { useState, useEffect } from "react";

const catalog = [
  { id: "editor", name: "Editor de Texto", icon: "📝" },
  { id: "calc", name: "Calculadora", icon: "➗" },
  { id: "browser", name: "Navegador", icon: "🌐" }
];

export default function StoreApp(){
  const [installed, setInstalled] = useState(JSON.parse(localStorage.getItem("aelthrix_installed_apps")||"[]"));
  useEffect(()=> localStorage.setItem("aelthrix_installed_apps", JSON.stringify(installed)), [installed]);
  const install = (it) => {
    if (installed.includes(it.id)) return alert("Já instalado");
    setInstalled(prev => [...prev, it.id]);
    alert(it.name + " instalado");
  };
  const uninstall = (it) => {
    setInstalled(prev => prev.filter(x=>x!==it.id));
  };
  return (
    <div style={{padding:12}}>
      <h3>Loja</h3>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
        {catalog.map(c=>(
          <div key={c.id} style={{padding:8, border:"1px solid rgba(255,255,255,0.06)", borderRadius:6}}>
            <div style={{fontSize:22}}>{c.icon}</div>
            <div style={{fontWeight:600}}>{c.name}</div>
            {installed.includes(c.id) ? (
              <button onClick={()=>uninstall(c)} style={{marginTop:8}}>Remover</button>
            ):(
              <button onClick={()=>install(c)} style={{marginTop:8}}>Instalar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
