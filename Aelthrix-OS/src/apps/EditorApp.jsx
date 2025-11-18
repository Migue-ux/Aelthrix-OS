import React, { useEffect, useState } from "react";

export default function EditorApp(){
  const [name, setName] = useState("doc1");
  const [text, setText] = useState(localStorage.getItem("editor-doc-doc1") || "");
  useEffect(()=> {
    localStorage.setItem(`editor-doc-${name}`, text);
  }, [name, text]);
  const saveAs = () => {
    const newName = prompt("Salvar como (nome):", name) || name;
    localStorage.setItem(`editor-doc-${newName}`, text);
    setName(newName);
    alert("Salvo como " + newName);
  };
  const load = () => {
    const key = prompt("Nome do doc para carregar:", name);
    if (!key) return;
    setName(key);
    setText(localStorage.getItem(`editor-doc-${key}`) || "");
  };
  return (
    <div style={{padding:12}}>
      <div style={{display:"flex", gap:8}}>
        <input value={name} onChange={(e)=> setName(e.target.value)} style={{padding:8}} />
        <button onClick={saveAs}>Salvar</button>
        <button onClick={load}>Carregar</button>
      </div>
      <textarea value={text} onChange={(e)=> setText(e.target.value)} style={{marginTop:12, width:"100%", height:300, padding:12}} />
    </div>
  );
}
