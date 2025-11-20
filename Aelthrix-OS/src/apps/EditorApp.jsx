// src/apps/EditorApp.jsx
import React, { useEffect, useState } from "react";

const FS_KEY = "aelthrix_fs_v1";

export default function EditorApp() {
  // editor works with localStorage key "editor-open" which holds the storage key like "editor-doc-file.txt"
  const [docKey, setDocKey] = useState(() => localStorage.getItem("editor-open") || null);
  const [name, setName] = useState(docKey ? docKey.replace(/^editor-doc-/, "") : "doc1");
  const [text, setText] = useState(() => {
    if (docKey) return localStorage.getItem(docKey) || "";
    return localStorage.getItem(`editor-doc-doc1`) || "";
  });

  useEffect(() => {
    // listen for external requests to open file
    const onStorage = (e) => {
      if (e.key === "editor-open") {
        const key = localStorage.getItem("editor-open");
        if (key) {
          setDocKey(key);
          setName(key.replace(/^editor-doc-/, ""));
          setText(localStorage.getItem(key) || "");
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // save to localStorage key and also sync with virtual FS if exists
  const save = () => {
    const key = docKey || `editor-doc-${name}`;
    localStorage.setItem(key, text);
    setDocKey(key);
    setName(name);
    // sync with virtual FS: find node with same name and update its content
    try {
      const fsRaw = localStorage.getItem(FS_KEY);
      if (fsRaw) {
        const fs = JSON.parse(fsRaw);
        const node = fs.find(n => n.type === "file" && n.name === name);
        if (node) {
          node.content = text;
          localStorage.setItem(FS_KEY, JSON.stringify(fs));
        } else {
          // If doesn't exist, create it in root
          const id = "f_" + Math.floor(Math.random()*1e9).toString(36);
          fs.push({ id, name, type: "file", parent: "root", content: text, createdAt: Date.now(), trashed: false });
          localStorage.setItem(FS_KEY, JSON.stringify(fs));
        }
      }
    } catch (e) { /* ignore */ }
    alert("Arquivo salvo localmente.");
  };

  return (
    <div style={{padding:12}}>
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <input value={name} onChange={(e)=> setName(e.target.value)} style={{padding:8}} />
        <button onClick={save}>Salvar</button>
        <button onClick={() => {
          // clear editor-open (close)
          localStorage.removeItem("editor-open");
          setDocKey(null);
        }}>Fechar</button>
      </div>

      <textarea value={text} onChange={(e)=> setText(e.target.value)}
                style={{marginTop:12, width:"100%", height:360, padding:12}} />
    </div>
  );
}
