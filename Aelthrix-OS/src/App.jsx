import React, { useEffect, useState } from "react";
import Desktop from "./components/Desktop";
import "./styles/global.css";
import "./styles/desktop.css";
import "./styles/window.css";
import "./styles/taskbar.css";
import "./styles/terminal.css";
import "./styles/settings.css";
import "./styles/login.css";

function BootScreen({onFinish}) {
  useEffect(() => {
    const t = setTimeout(() => onFinish(), 1800);
    return () => clearTimeout(t);
  }, [onFinish]);
  return (
    <div className="boot-screen">
      <div className="boot-card">
        <div className="boot-logo">Aelthrix</div>
        <div className="boot-sub">Initializing... </div>
      </div>
    </div>
  );
}

function LoginScreen({onLogin}) {
  const [name, setName] = useState(localStorage.getItem("aelthrix_user") || "");
  const [pass, setPass] = useState("");
  useEffect(()=> {
    // focus
    const el = document.querySelector(".login-input");
    el?.focus();
  },[]);
  const submit = (e) => {
    e?.preventDefault();
    if (!name) return alert("Digite um nome.");
    localStorage.setItem("aelthrix_user", name);
    onLogin(name);
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Aelthrix</h1>
        <p>Bem-vindo, digite seu nome</p>
        <form onSubmit={submit}>
          <input className="login-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" />
          <div style={{display:"flex",gap:8, marginTop:10}}>
            <button type="submit" className="btn-primary">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App(){
  const [logged, setLogged] = useState(Boolean(localStorage.getItem("aelthrix_user")));
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // apply theme from storage
    const th = localStorage.getItem("aelthrix-theme") || "dark";
    document.documentElement.setAttribute("data-theme", th);
    // apply wallpaper if exists
    const wp = localStorage.getItem("aelthrix-wallpaper") || "default";
    applyWallpaper(wp);
  }, []);

  function applyWallpaper(code){
    const body = document.body;
    if(code === "default"){
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=60')";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
    } else if(code === "mac"){
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1518441902114-05f3c3d1e78e?auto=format&fit=crop&w=1600&q=60')";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
    } else if(code === "matrix"){
      body.style.backgroundImage = "url('https://wallpaperaccess.com/full/131586.jpg')";
      body.style.backgroundSize = "cover";
    } else {
      body.style.background = "linear-gradient(180deg,#041021,#082133)";
    }
  }

  if (!booted) return <BootScreen onFinish={() => setBooted(true)} />;

  if (!logged) return <LoginScreen onLogin={(name)=>{ setLogged(true); localStorage.setItem("aelthrix_user", name); }} />;

  return <Desktop />;
}
