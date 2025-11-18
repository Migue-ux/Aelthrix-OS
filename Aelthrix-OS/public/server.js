// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// ajuste de timeout/size se necessário
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing url query param");

  try {
    // garante schema
    const realUrl = target.startsWith("http") ? target : `https://${target}`;

    const r = await fetch(realUrl, {
      headers: {
        "User-Agent": "AelthrixBrowser/1.0 (+https://example.local)"
      }
    });

    const contentType = r.headers.get("content-type") || "";
    // Se não for HTML, apenas repassa o corpo (stream)
    if (!contentType.includes("text/html")) {
      // repassa headers úteis
      res.set("content-type", contentType);
      const buffer = await r.arrayBuffer();
      return res.send(Buffer.from(buffer));
    }

    let html = await r.text();

    // injeta <base href="..."> dentro do <head> para resolver caminhos relativos
    const baseTag = `<base href="${realUrl}">`;
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${baseTag}\n`);
    } else {
      html = baseTag + html;
    }

    // Opcional: remover meta referrer ou CSP que impediriam execução — cuidado legal
    // aqui não removemos nada automaticamente para evitar problemas legais

    res.set("content-type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("proxy error:", err);
    res.status(500).send(`<h2>Erro ao acessar ${req.query.url}</h2><pre>${String(err)}</pre>`);
  }
});

const PORT = process.env.PROXY_PORT || 5000;
app.listen(PORT, () => console.log(`🧩 Proxy rodando em http://localhost:${PORT}/proxy?url=<site>`));
