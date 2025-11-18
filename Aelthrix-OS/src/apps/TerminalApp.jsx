import React, { useEffect, useRef, useState } from "react";
import "../styles/terminal.css";

export default function TerminalApp({ openApp }) {
  const [output, setOutput] = useState([
    "Aelthrix Terminal v1.2",
    "Digite 'help' ou '?' para ver os comandos."
  ]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("aelthrix_user") || "user");
  const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme") || "dark");
  const outRef = useRef(null);
  const inRef = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(()=> { if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight }, [output]);
  useEffect(()=> { inRef.current?.focus() }, []);

  const push = (...lines) => setOutput(o => [...o, ...lines]);

  // safeEval (igual ao teu): permite only math
  const safeEval = (expr) => {
    const transformed = expr.replace(/\^/g, "**");
    if (!/^[0-9+\-*/().%\s^]+$/.test(expr)) throw new Error("Apenas números e operadores +-*/%^() são permitidos.");
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`"use strict"; return (${transformed})`);
      const res = fn();
      if (typeof res === "number" && !Number.isFinite(res)) throw new Error("Resultado inválido");
      return res;
    } catch (err) {
      throw new Error("Erro ao calcular");
    }
  };

  const handleCommand = (e) => {
    e?.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    const parts = raw.split(" ").filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    push(`${username}@aelthrix > ${raw}`);

    switch (cmd) {
      case "help":
      case "?":
        push("Comandos: help, about, clear, echo, calc, date, time, uptime, system, open <app>, exit");
        break;
      case "about":
        push("Aelthrix OS — Terminal integrado.");
        break;
      case "clear":
        setOutput([]);
        break;
      case "echo":
        push(args.join(" "));
        break;
      case "calc":
        try {
          const result = safeEval(args.join(" "));
          push(`${args.join(" ")} = ${result}`);
        } catch (err) { push(err.message); }
        break;
      case "date":
        push(new Date().toLocaleDateString());
        break;
      case "time":
        push(new Date().toLocaleTimeString());
        break;
      case "uptime":
        push(`Uptime: ${Math.floor((Date.now()-startTime.current)/1000)}s`);
        break;
      case "system":
        push(`Usuário: ${username}`, `Tema: ${theme}`);
        break;
      case "open":
        if (!args[0]) push("Uso: open <NomeDoApp>");
        else openApp(args.join(" "));
        break;
      case "exit":
      case "quit":
        push("Comando de sair executado.");
        break;
      default:
        push(`Comando não encontrado: ${cmd}`);
    }
    setInput("");
  };

  return (
    <div className={`terminal`} role="region" aria-label="Terminal">
      <div className="terminal-output" ref={outRef}>
        {output.map((line,i)=>(<div key={i} className="terminal-line">{line}</div>))}
      </div>
      <form onSubmit={handleCommand} className="terminal-input">
        <span className="prompt">{`${username}@aelthrix >`}</span>
        <input ref={inRef} value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Digite um comando (help)" autoComplete="off" />
      </form>
    </div>
  );
}
