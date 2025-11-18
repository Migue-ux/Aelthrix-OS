import React, { useState } from "react";

export default function CalcApp(){
  const [expr, setExpr] = useState("");
  const [res, setRes] = useState("");
  const safeEval = (s) => {
    try {
      const t = s.replace(/\^/g,"**");
      if (!/^[0-9+\-*/().%\s^]+$/.test(s)) throw new Error("caractere inválido");
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${t})`);
      return fn();
    } catch (e) { return "erro"; }
  };
  return (
    <div style={{padding:12}}>
      <h3>Calculadora</h3>
      <input value={expr} onChange={e=>setExpr(e.target.value)} placeholder="2+2*3" style={{width:"100%", padding:8}} />
      <div style={{marginTop:8, display:"flex", gap:8}}>
        <button onClick={()=> setRes(String(safeEval(expr)))}>Calcular</button>
        <button onClick={()=> { setExpr(""); setRes(""); }}>Limpar</button>
      </div>
      <div style={{marginTop:12}}>Resultado: <strong>{res}</strong></div>
    </div>
  );
}
