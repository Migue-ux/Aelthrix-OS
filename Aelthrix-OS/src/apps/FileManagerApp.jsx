// src/apps/FileManagerApp.jsx
import React, { useEffect, useState } from "react";
import "../styles/filemanager.css";

/**
 * FileManagerApp — Aelthrix OS (Full)
 * - Virtual FS in localStorage (STORAGE_KEY)
 * - Features:
 *   • create folder/file, rename, move, delete->trash, restore, perm delete
 *   • drag & drop between folders (and drop onto sidebar folders)
 *   • upload local files (images saved as dataURL, text saved as text)
 *   • preview images
 *   • icons per extension
 *   • compress (fake .zip as JSON) + download .zip real
 *   • decompress created .zip
 *   • properties modal (size, bytes, date, path, item count)
 * - Exports util functions (loadFS, saveFS, moveToTrash) for Desktop integration
 */

const STORAGE_KEY = "aelthrix_fs_v1";
const TRASH_FOLDER = "TRASH_ROOT";

const makeId = () => "f_" + Math.floor(Math.random() * 1e9).toString(36);

export function loadFS() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFS();
    return JSON.parse(raw);
  } catch (e) {
    return defaultFS();
  }
}

export function saveFS(fs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fs));
}

export function moveToTrash(id) {
  const fs = loadFS();
  const toTrash = collectTreeStatic(fs, id);
  const updated = fs.map((n) => (toTrash.includes(n.id) ? { ...n, trashed: true, parent: TRASH_FOLDER } : n));
  saveFS(updated);
}

function defaultFS() {
  return [
    { id: "root", name: "Home", type: "folder", parent: null, createdAt: Date.now(), trashed: false },
    { id: TRASH_FOLDER, name: "Lixeira", type: "folder", parent: null, createdAt: Date.now(), trashed: false },
    {
      id: makeId(),
      name: "readme.txt",
      type: "file",
      parent: "root",
      content: "Bem-vindo ao Aelthrix File Manager!\nUse upload pra adicionar imagens/textos. Duplo clique abre no Editor.",
      createdAt: Date.now(),
      trashed: false,
    },
  ];
}

function collectTreeStatic(fs, id) {
  const out = [id];
  for (let i = 0; i < out.length; i++) {
    const cur = out[i];
    const kids = fs.filter((x) => x.parent === cur).map((x) => x.id);
    out.push(...kids);
  }
  return out;
}

export default function FileManagerApp({ openApp }) {
  const [fs, setFs] = useState(() => loadFS());
  const [cwd, setCwd] = useState("root");
  const [filter, setFilter] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [propsNode, setPropsNode] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);

  // sync to storage
  useEffect(() => {
    saveFS(fs);
    // notify other windows
    window.dispatchEvent(new Event("storage"));
  }, [fs]);

  // storage listener (in case Desktop or other window modifies FS)
  useEffect(() => {
    const onStorage = () => {
      const updated = loadFS();
      setFs(updated);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // helpers
  const sorter = (a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "folder" ? -1 : 1;
  };
  const childrenOf = (parentId) => fs.filter((f) => f.parent === parentId && !f.trashed).sort(sorter);
  const trashItems = fs.filter((n) => n.trashed);

  const pathToRoot = (id) => {
    const path = [];
    let cur = id;
    while (cur) {
      const node = fs.find((x) => x.id === cur);
      if (!node) break;
      path.unshift(node);
      cur = node.parent;
    }
    return path;
  };

  function collectTree(id) {
    const out = [id];
    for (let i = 0; i < out.length; i++) {
      const cur = out[i];
      const kids = fs.filter((x) => x.parent === cur).map((x) => x.id);
      out.push(...kids);
    }
    return out;
  }

  // create folder/file
  const createFolder = () => {
    const name = prompt("Nome da pasta:") || "Nova pasta";
    const id = makeId();
    const node = { id, name, type: "folder", parent: cwd, createdAt: Date.now(), trashed: false };
    setFs((prev) => [...prev, node]);
  };

  const createFile = () => {
    const name = prompt("Nome do arquivo (ex: nota.txt):") || `novo_${Date.now()}.txt`;
    const id = makeId();
    const node = { id, name, type: "file", parent: cwd, content: "", createdAt: Date.now(), trashed: false };
    setFs((prev) => [...prev, node]);
  };

  // rename
  const startRename = (id) => {
    const node = fs.find((x) => x.id === id);
    if (!node) return;
    setRenameId(id);
    setRenameValue(node.name);
  };
  const commitRename = () => {
    if (!renameId) return;
    setFs((prev) => prev.map((n) => (n.id === renameId ? { ...n, name: renameValue } : n)));
    setRenameId(null);
    setRenameValue("");
  };

  // move
  const moveItem = (id, newParentId) => {
    if (id === newParentId) return;
    const descendants = collectTree(id);
    if (descendants.includes(newParentId)) return alert("Não pode mover para dentro de uma subpasta.");
    setFs((prev) => prev.map((n) => (n.id === id ? { ...n, parent: newParentId } : n)));
  };

  // delete -> trash
  const removeItem = (id) => {
    const toTrash = collectTree(id);
    setFs((prev) => prev.map((n) => (toTrash.includes(n.id) ? { ...n, trashed: true, parent: TRASH_FOLDER } : n)));
  };

  const restoreItem = (id) => {
    const ids = collectTree(id);
    setFs((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, trashed: false, parent: n.parent === TRASH_FOLDER ? "root" : n.parent } : n)));
  };

  const permDelete = (id) => {
    const toRemove = collectTree(id);
    setFs((prev) => prev.filter((n) => !toRemove.includes(n.id)));
  };

  // open file -> integrate with Editor
  const openFile = (id) => {
    const node = fs.find((x) => x.id === id);
    if (!node) return;
    if (node.type !== "file") {
      setCwd(id);
      return;
    }
    // if image and content is dataURL, copy to editor-open-image? but we use Editor for text files only
    const safeName = node.name.replace(/\s+/g, "_");
    const key = `editor-doc-${safeName}`;
    if (isDataURL(node.content)) {
      // create a textual wrapper that indicates it's a binary/data url - editor won't edit images; better preview
      // fallback: open preview
      setPreviewSrc(node.content);
      return;
    }
    localStorage.setItem(key, node.content || "");
    localStorage.setItem("editor-open", key);
    openApp && openApp("Editor");
  };

  // upload local file
  const uploadLocalFile = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const id = makeId();
    if (file.type.startsWith("image/")) {
      // read as dataURL
      const reader = new FileReader();
      reader.onload = () => {
        const node = { id, name: file.name, type: "file", parent: cwd, content: reader.result, meta: { mime: file.type }, createdAt: Date.now(), trashed: false };
        setFs((prev) => [...prev, node]);
      };
      reader.readAsDataURL(file);
    } else {
      const text = await file.text();
      const node = { id, name: file.name, type: "file", parent: cwd, content: text, meta: { mime: file.type }, createdAt: Date.now(), trashed: false };
      setFs((prev) => [...prev, node]);
    }
  };

  // download
  const downloadFile = (id) => {
    const node = fs.find((x) => x.id === id);
    if (!node || node.type !== "file") return;
    if (isDataURL(node.content)) {
      downloadDataURL(node.content, node.name);
      return;
    }
    const blob = new Blob([node.content || ""], { type: node.meta?.mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = node.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDataURL = (dataUrl, filename) => {
    // dataUrl -> blob
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  // compress -> create fake zip (JSON) as file
  const compressNode = (id) => {
    const node = fs.find((x) => x.id === id);
    if (!node) return alert("Item não encontrado");
    const ids = collectTree(id);
    const payload = ids
      .map((i) => {
        const n = fs.find((x) => x.id === i);
        if (!n) return null;
        return {
          id: n.id,
          name: n.name,
          type: n.type,
          parent: n.parent,
          createdAt: n.createdAt,
          meta: n.meta,
          content: n.type === "file" ? n.content || "" : undefined,
        };
      })
      .filter(Boolean);
    const zipContent = JSON.stringify({ createdAt: Date.now(), source: node.name, items: payload }, null, 2);
    const zipName = node.name.endsWith(".zip") ? node.name : `${node.name}.zip`;
    const zipId = makeId();
    const zipNode = { id: zipId, name: zipName, type: "file", parent: cwd, content: zipContent, createdAt: Date.now(), trashed: false, meta_compressedIds: ids };
    setFs((prev) => [...prev, zipNode]);
    alert(`${zipName} criado na pasta atual.`);
  };

  // download zip as real file
  const downloadZip = (id) => {
    const node = fs.find((x) => x.id === id);
    if (!node || node.type !== "file") return alert("Arquivo inválido para download zip.");
    const content = node.content || "";
    const blob = new Blob([content], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = node.name.endsWith(".zip") ? node.name : node.name + ".zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  // decompress created zip
  const decompressNode = (id) => {
    const node = fs.find((x) => x.id === id);
    if (!node || node.type !== "file") return alert("Arquivo não é um zip válido");
    try {
      const parsed = JSON.parse(node.content || "");
      if (!parsed.items || !Array.isArray(parsed.items)) return alert("Arquivo zip inválido");
      const mapping = {};
      const created = [];
      parsed.items.forEach((item) => {
        const newId = makeId();
        mapping[item.id] = newId;
        const newNode = {
          id: newId,
          name: item.name,
          type: item.type,
          parent: item.parent === null ? cwd : mapping[item.parent] || cwd,
          content: item.type === "file" ? item.content || "" : undefined,
          meta: item.meta,
          createdAt: Date.now(),
          trashed: false,
        };
        created.push(newNode);
      });
      // fix parents again
      const fixed = created.map((n) => {
        const original = parsed.items.find((x) => x.name === n.name && x.type === n.type);
        if (!original) return n;
        const origParent = original.parent;
        if (origParent && mapping[origParent]) n.parent = mapping[origParent];
        else n.parent = cwd;
        return n;
      });
      setFs((prev) => [...prev, ...fixed]);
      alert(`Decompressão finalizada: ${fixed.length} itens criados.`);
    } catch (e) {
      alert("Erro ao descompactar: formato inválido");
    }
  };

  // drag handlers
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropToFolder = (e, folderId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    moveItem(id, folderId);
  };

  const onDragOver = (e) => e.preventDefault();

  // properties modal
  const getNodeSizeBytes = (node) => {
    if (!node) return 0;
    if (node.type === "file") {
      const content = node.content || "";
      try {
        if (isDataURL(content)) {
          // estimate size via blob
          const arr = content.split(",");
          const base64 = arr[1] || "";
          const bytes = Math.ceil((base64.length * 3) / 4);
          return bytes;
        }
        return new Blob([content]).size;
      } catch (e) {
        return content.length;
      }
    }
    // folder sum
    const ids = collectTree(node.id);
    let sum = 0;
    for (const id of ids) {
      const n = fs.find((x) => x.id === id);
      if (n && n.type === "file") sum += getNodeSizeBytes(n);
    }
    return sum;
  };

  const humanSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    const units = ["KB", "MB", "GB", "TB"];
    let i = -1;
    let val = bytes;
    do {
      val = val / 1024;
      i++;
    } while (val >= 1024 && i < units.length - 1);
    return val.toFixed(2) + " " + units[i];
  };

  const openProperties = (id) => {
    const node = fs.find((x) => x.id === id);
    if (!node) return;
    const size = getNodeSizeBytes(node);
    const path = pathToRoot(node.parent || node.id).map((p) => p.name).join(" / ");
    let count = 0;
    if (node.type === "folder") {
      const ids = collectTree(node.id);
      count = fs.filter((n) => ids.includes(n.id)).length - 1;
    }
    setPropsNode({ ...node, size, sizeStr: humanSize(size), path: path || node.name, count });
  };

  const closeProperties = () => setPropsNode(null);

  // preview image
  const isDataURL = (s) => typeof s === "string" && s.startsWith("data:");
  const isImageNode = (n) => {
    if (!n || n.type !== "file") return false;
    if (n.meta?.mime && n.meta.mime.startsWith("image/")) return true;
    const ext = (n.name.split(".").pop() || "").toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(ext);
  };

  const openPreview = (node) => {
    if (!isImageNode(node)) return;
    if (isDataURL(node.content)) setPreviewSrc(node.content);
    else {
      // if content is text but file extension is image, we cannot render; so show message
      alert("Preview não disponível: conteúdo não é um dataURL.");
    }
  };

  const closePreview = () => setPreviewSrc(null);

  // visible nodes (filter + trash)
  const visibleNodes = () => {
    const nodes = showTrash ? trashItems : childrenOf(cwd);
    if (!filter) return nodes;
    const s = filter.toLowerCase();
    return nodes.filter((n) => n.name.toLowerCase().includes(s));
  };

  // icon by extension
  const iconFor = (name, type) => {
    if (type === "folder") return "📁";
    const ext = (name.split(".").pop() || "").toLowerCase();
    const map = {
      png: "🖼️", jpg: "🖼️", jpeg: "🖼️", gif: "🖼️", webp: "🖼️", bmp: "🖼️",
      txt: "📄", md: "📝", js: "📜", json: "🧾", html: "🌐", css: "🎨",
      zip: "🗜️", pdf: "📕", docx: "📄", xlsx: "📊", mp3: "🎵", mp4: "🎬",
    };
    return map[ext] || "📄";
  };

  const path = pathToRoot(cwd);

  return (
    <div className="fm-wrap" onDragOver={(e) => e.preventDefault()}>
      <div className="fm-header">
        <div className="fm-left" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => { setShowTrash(false); setCwd("root"); }} className="fm-btn">Arquivos</button>
          <button onClick={() => setShowTrash(true)} className="fm-btn">Lixeira</button>
          <button onClick={createFolder} className="fm-btn">Nova Pasta</button>
          <button onClick={createFile} className="fm-btn">Novo Arquivo</button>
          <label className="fm-upload fm-btn" style={{ cursor: "pointer" }}>
            Upload
            <input type="file" onChange={uploadLocalFile} />
          </label>
          <button onClick={() => {
            // quick install example: create sample image
            const id = makeId();
            const sample = { id, name: `sample-${Date.now()}.txt`, type: "file", parent: cwd, content: "exemplo", createdAt: Date.now(), trashed: false };
            setFs(prev => [...prev, sample]);
          }} className="fm-btn">Sample</button>
        </div>

        <div className="fm-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input placeholder="Pesquisar..." value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.02)" }} />
        </div>
      </div>

      <div className="fm-breadcrumbs" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {showTrash ? (
          <div className="crumb">Lixeira</div>
        ) : (
          path.map((p, i) => (
            <div key={p.id} className="crumb" style={{ cursor: "pointer", opacity: 0.9 }} onClick={() => setCwd(p.id)}>
              {p.name}{i < path.length - 1 && " / "}
            </div>
          ))
        )}
      </div>

      <div className="fm-content">
        <div className="fm-list" onDragOver={onDragOver} onDrop={(e) => onDropToFolder(e, cwd)}>
          {visibleNodes().length === 0 && <div className="fm-empty">Vazio</div>}

          {visibleNodes().map((node) => (
            <div key={node.id}
              className="fm-item"
              draggable={!showTrash}
              onDragStart={(e) => onDragStart(e, node.id)}
              onDoubleClick={() => {
                if (node.type === "folder") setCwd(node.id);
                else {
                  if (isImageNode(node)) openPreview(node);
                  else openFile(node.id);
                }
              }}
            >
              <div className="fm-item-left" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="fm-icon" title={node.name}>{iconFor(node.name, node.type)}</div>
                <div className="fm-name" style={{ minWidth: 0 }}>
                  {renameId === node.id ? (
                    <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={commitRename} onKeyDown={(e) => e.key === "Enter" && commitRename()} autoFocus style={{ padding: 6, borderRadius: 6 }} />
                  ) : (
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</div>
                  )}
                  <div className="fm-meta" style={{ fontSize: 12, opacity: 0.7 }}>{node.type} • {new Date(node.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="fm-item-actions" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {!showTrash && <button className="fm-btn" onClick={() => startRename(node.id)}>Renomear</button>}
                {!showTrash && <button className="fm-btn" onClick={() => moveItem(node.id, "root")}>Mover pra Home</button>}
                {!showTrash && <button className="fm-btn" onClick={() => removeItem(node.id)}>Excluir</button>}
                {showTrash && <button className="fm-btn" onClick={() => restoreItem(node.id)}>Restaurar</button>}
                {showTrash && <button className="fm-btn" onClick={() => permDelete(node.id)}>Apagar</button>}

                {node.type === "file" && <button className="fm-btn" onClick={() => downloadFile(node.id)}>Baixar</button>}
                {node.type === "file" && <button className="fm-btn" onClick={() => openFile(node.id)}>Abrir</button>}

                {!showTrash && <button className="fm-btn" onClick={() => compressNode(node.id)}>Compactar</button>}
                {node.type === "file" && node.name.endsWith(".zip") && <button className="fm-btn" onClick={() => decompressNode(node.id)}>Descompactar</button>}

                <button className="fm-btn" onClick={() => openProperties(node.id)}>Propriedades</button>
                {node.type === "file" && node.name.endsWith(".zip") && <button className="fm-btn" onClick={() => downloadZip(node.id)}>📦 Baixar ZIP</button>}
              </div>
            </div>
          ))}
        </div>

        <div className="fm-side" onDragOver={onDragOver}>
          <h4>Pastas</h4>
          <div className="fm-folders" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fs.filter((n) => n.type === "folder" && !n.trashed).map((f) => (
              <div key={f.id}
                className={`fm-folder ${f.id === cwd ? "active" : ""}`}
                onClick={() => { setCwd(f.id); setShowTrash(false); }}
                onDragOver={onDragOver}
                onDrop={(e) => onDropToFolder(e, f.id)}
                style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, borderRadius: 8, cursor: "pointer", background: f.id === cwd ? "linear-gradient(90deg,var(--accent),#6b8cff33)" : "transparent" }}
              >
                <div style={{ width: 28 }}>{iconFor(f.name, "folder")}</div>
                <div style={{ fontWeight: 600 }}>{f.name}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <h4>Lixeira</h4>
            <div style={{ marginBottom: 8 }}>{trashItems.length} itens</div>
            {trashItems.length > 0 && <button className="fm-btn" onClick={() => { if (!confirm("Esvaziar lixeira?")) return; setFs((prev) => prev.filter((n) => !n.trashed)); }}>Esvaziar Lixeira</button>}
          </div>

          <div style={{ marginTop: 18 }}>
            <h4>Ajuda</h4>
            <small style={{ opacity: 0.8 }}>Duplo clique abre. Arraste itens para mover entre pastas. Arraste para a Lixeira no desktop para excluir.</small>
          </div>
        </div>
      </div>

      {/* Properties Modal */}
      {propsNode && (
        <div className="fm-modal-backdrop" onClick={closeProperties}>
          <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Propriedades — {propsNode.name}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><strong>Tipo:</strong> {propsNode.type}</div>
              <div><strong>Tamanho:</strong> {propsNode.sizeStr} ({propsNode.size} bytes)</div>
              <div><strong>Criado em:</strong> {new Date(propsNode.createdAt).toLocaleString()}</div>
              <div><strong>Caminho:</strong> {propsNode.path}</div>
              {propsNode.type === "folder" && <div><strong>Itens dentro:</strong> {propsNode.count}</div>}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="fm-btn" onClick={closeProperties}>Fechar</button>
              {propsNode.type === "file" && propsNode.name.endsWith(".zip") && <button className="fm-btn" onClick={() => { downloadZip(propsNode.id); }}>📦 Baixar ZIP</button>}
              {propsNode.type === "file" && <button className="fm-btn" onClick={() => { downloadFile(propsNode.id); }}>Baixar</button>}
              {propsNode.type === "file" && propsNode.name.endsWith(".zip") && <button className="fm-btn" onClick={() => { decompressNode(propsNode.id); closeProperties(); }}>Descompactar</button>}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {previewSrc && (
        <div className="fm-preview-bg" onClick={closePreview}>
          <img className="fm-preview-img" src={previewSrc} alt="preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
