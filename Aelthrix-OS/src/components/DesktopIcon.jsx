import React, { useRef } from "react";
import "../styles/desktop-icon.css";

export default function DesktopIcon({ icon, label, onClick, onDoubleClick, fileId }) {
  const iconRef = useRef(null);
  let offsetX, offsetY;

  // -----------------------------
  // DRAG & DROP PARA OUTROS APPS
  // -----------------------------
  const handleDragStart = (e) => {
    // envia dados do arquivo/pasta arrastado
    e.dataTransfer.setData(
      "application/aelthrix-file",
      JSON.stringify({
        id: fileId || null,
        label,
        type: "desktop-icon"
      })
    );

    e.dataTransfer.effectAllowed = "move";
    e.target.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    document.dispatchEvent(new Event("aelthrix-drag-end")); // remove highlight global
  };

  // -----------------------------
  // DRAG & DROP ESTÉTICO NO DESKTOP
  // (movimentação do ícone)
  // -----------------------------
  const handleMouseDown = (e) => {
    // botão direito não inicia drag
    if (e.button === 2) return;

    const el = iconRef.current;
    if (!el) return;

    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;

    const mouseMove = (event) => {
      el.style.position = "absolute";
      el.style.left = `${event.clientX - offsetX}px`;
      el.style.top = `${event.clientY - offsetY}px`;
      el.style.zIndex = 9999;
    };

    const mouseUp = () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      el.style.zIndex = "";
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  };

  return (
    <div
      ref={iconRef}
      className="desktop-icon"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      role="button"
      tabIndex={0}
    >
      <div className="icon">{icon}</div>
      <div className="label">{label}</div>
    </div>
  );
}
