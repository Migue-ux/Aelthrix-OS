import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (username.trim() === "") return alert("Digite seu nome de usuário!");
    setLoading(true);

    setTimeout(() => {
      navigate("/desktop"); // entra no OS
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">Aelthrix<span>OS</span></h1>

        <input
          type="text"
          placeholder="Usuário..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Iniciando..." : "Entrar"}
        </button>

        <p className="tip">Versão Beta • Aelthrix Systems</p>
      </div>
    </div>
  );
}
