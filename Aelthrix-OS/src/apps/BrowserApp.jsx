import React, { useState } from "react";
import "../styles/browserApp.css";

export default function Browser() {
  const [url, setUrl] = useState("");
  const [searchUrl, setSearchUrl] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    let finalUrl = url;
    if (!finalUrl.startsWith("http")) {
      finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
    }
    setSearchUrl(finalUrl);
  };

  return (
    <div className="browser">
      <div className="topbar">
        <div className="controls">
          <button>←</button>
          <button>→</button>
          <button>⟳</button>
        </div>
        <form className="address-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Pesquisar ou digitar URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </form>
        <button className="tab-btn">＋</button>
      </div>

      <div className="webview">
        {searchUrl ? (
          <iframe src={searchUrl} title="web" />
        ) : (
          <div className="home">
            <h1>Meu Navegador</h1>
            <p>Digite algo na barra acima para começar a navegar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
