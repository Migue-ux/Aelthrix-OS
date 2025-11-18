import React, { useRef } from "react";
import "../styles/app-window.css";

export default function AppWindow({ title, children, onClose }) {
  const windowRef = useRef(null);
  let offsetX, offsetY;

  const handleMouseDown = (e) => {
    const el = windowRef.current;
    if (!el) return;

    const desktop = el.parentElement;
    const desktopRect = desktop.getBoundingClientRect();

    // só ativa arraste se clicar na barra de título
    if (!e.target.classList.contains("window-header")) return;

    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;

    const handleMouseMove = (event) => {
      el.style.position = "absolute";

      let newLeft = event.clientX - offsetX;
      let newTop = event.clientY - offsetY;

      // aplica limites
      const maxLeft = desktopRect.width - el.offsetWidth;
      const maxTop = desktopRect.height - el.offsetHeight;

      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;
      if (newTop > maxTop) newTop = maxTop;

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
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
    <div ref={windowRef} className="app-window" onMouseDown={handleMouseDown}>
      <div className="window-header">
        <span className="window-title">{title}</span>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
}
