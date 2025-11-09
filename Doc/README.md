# 🌀 Aelthrix OS

> **Sistema operativo minimalista, seguro e pronto pro futuro.**

Aelthrix é um sistema operacional moderno — construído com **Rust**, arquitetura **microkernel modular** e suporte nativo a **WASM**.  
Focado em **segurança por design**, **UX fluida** e **excelente experiência para desenvolvedores**.

---

## ✨ Principais pilares

- 🔒 **Segurança por design:** sandbox WASI, permissões granulares e Key Vault com TPM.  
- ⚙️ **Arquitetura moderna:** microkernel, processos isolados e mensageria IPC.  
- 🧩 **Pacotes atômicos:** `Flux` package manager com rollback, delta updates e builds verificáveis.  
- 🧠 **Dev experience:** CLI (`aeldev`), SDK Rust, WASM templates, integração com VSCode.  
- 🖥️ **UX minimalista:** Nebula Shell — tiling opcional, gestos, hotkeys e dock inteligente.

---

## 🧱 Arquitetura técnica (resumo)

| Camada | Tecnologia | Descrição |
|--------|-------------|-----------|
| **Kernel** | Rust (microkernel) | IPC e capabilities-based security |
| **Userspace** | Rust + WASM + Go | Drivers, apps e utilitários |
| **Filesystem** | Btrfs | Snapshots, encriptação por arquivo |
| **Containers** | OCI + Flux | Imagens assinadas e nativas |
| **Boot** | Secure Boot | Cadeia de confiança verificada |

---

## 🚀 Instalação (em breve)

O Aelthrix ainda está em **fase de prototipagem**.  
Assim que o microkernel e o gerenciador de pacotes estiverem prontos, publicaremos instruções completas de build.

Enquanto isso:
```bash
# clone o projeto
git clone https://github.com/aelthrix/aelthrix.git
cd aelthrix

# execute protótipo (quando disponível)
cargo run
