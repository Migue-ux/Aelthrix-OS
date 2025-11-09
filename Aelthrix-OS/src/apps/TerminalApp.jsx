import React, { useEffect, useRef, useState } from "react";
import "../styles/terminal.css";

/**
 * props: openApp(label)   --> to open other apps (e.g. open settings)
 */

export default function TerminalApp({ openApp }) {
  const [output, setOutput] = useState([
    "Aelthrix Terminal v0.2 (Neon)",
    "Digite 'help' para ver os comandos."
  ]);
  const [input, setInput] = useState("");
  const outRef = useRef(null);
  const inRef = useRef(null);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [output]);

  useEffect(() => {
    if (inRef.current) inRef.current.focus();
  }, []);

  const push = (...lines) => setOutput((o) => [...o, ...lines]);

  const handleCommand = (e) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    const parts = raw.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    push(`> ${raw}`);

    // system-like commands
    if (cmd === "help") {
      push("Comandos: help, about, clear, echo <text>, install <app>, open <app>, aelthrix --version, system");
      setInput("");
      return;
    }

    if (cmd === "about") {
      push("Aelthrix OS — protótipo em React (Neon theme).");
      setInput("");
      return;
    }

    if (cmd === "clear") {
      setOutput([]);
      setInput("");
      return;
    }

    if (cmd === "echo") {
      push(args.join(" "));
      setInput("");
      return;
    }

    if (cmd === "install") {
      const name = args.join(" ");
      if (!name) {
        push("Uso: install <appname>");
      } else {
        push(`Procurando repositório para '${name}'...`);
        setTimeout(() => {
          push(`Instalando ${name}...`, `${name} instalado com sucesso (simulado).`);
        }, 800);
      }
      setInput("");
      return;
    }

    if (cmd === "open") {
      const label = args.join(" ").toLowerCase();
      if (label.includes("setting")) {
        push("Abrindo Configurações...");
        openApp && openApp("Configurações");
      } else if (label.includes("terminal")) {
        push("Terminal já está aberto.");
      } else if (label.includes("system") || label.includes("sistema")) {
        push("Abrindo Sistema...");
        openApp && openApp("Sistema");
      } else {
        push("App não encontrado: " + args.join(" "));
      }
      setInput("");
      return;
    }

    if (cmd === "aelthrix" && args[0] === "--version") {
      push("Aelthrix OS version 0.2 (neon)");
      setInput("");
      return;
    }

    if (cmd === "system") {
      push("Sistema: Aelthrix OS (simulado)");
      push(`Horas: ${new Date().toLocaleTimeString()}`);
      setInput("");
      return;
    }

    push(`Comando não reconhecido: ${cmd}`);
    setInput("");
  };

  return (
    <div className="terminal" role="region" aria-label="Terminal Aelthrix">
      <div className="terminal-output" ref={outRef}>
        {output.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="terminal-input">
        <span className="prompt">{">"}</span>
        <input
          ref={inRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite um comando (help)"
          autoComplete="off"
        />
      </form>
    </div>
  );
}
