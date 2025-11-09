import React from "react";
import "../styles/desktop-icon.css";

export default function DesktopIcon({ icon, label, onClick, onDoubleClick }) {
  return (
    <div className="desktop-icon" onClick={onClick} onDoubleClick={onDoubleClick} role="button" tabIndex={0}>
      <div className="icon">{icon}</div>
      <div className="label">{label}</div>
    </div>
  );
}
