import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import "../styles/window.css";

export default function Window({ title, onClose, onFocus, onMinimize, children }) {
  const nodeRef = useRef(null);
  const [max, setMax] = useState(false);

  return (
    <Draggable handle=".window-header" nodeRef={nodeRef} bounds="parent">
      <div ref={nodeRef} className={`window ${max ? "max" : ""}`} onMouseDown={onFocus}>
        <div className="window-header">
          <div className="window-buttons">
            <button className="btn close" onClick={(e)=>{ e.stopPropagation(); onClose && onClose(); }} />
            <button className="btn minimize" onClick={(e)=>{ e.stopPropagation(); onMinimize && onMinimize(); }} />
            <button className="btn maximize" onClick={(e)=>{ e.stopPropagation(); setMax(m=>!m); }} />
          </div>
          <div className="window-title">{title}</div>
        </div>
        <div className="window-content">
          {children}
        </div>
      </div>
    </Draggable>
  );
}
