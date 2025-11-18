import React, { useRef } from "react";
import "../styles/desktop-icon.css";

export default function DesktopIcon({ icon, label, onClick, onDoubleClick }) {
  const iconRef = useRef(null);
  let offsetX, offsetY;

  const handleMouseDown = (e) => {
    const el = iconRef.current;
    if (!el) return;

    // posição inicial do mouse e do ícone
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;

    const handleMouseMove = (event) => {
      el.style.position = "absolute";
      el.style.left = `${event.clientX - offsetX}px`;
      el.style.top = `${event.clientY - offsetY}px`;
      el.style.zIndex = 9999;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      el.style.zIndex = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={iconRef}
      className="desktop-icon"
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
