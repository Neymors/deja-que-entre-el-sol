# 🎥 Deja Que Entre el Sol — Proyecto Finalizado



[![Demo](https://img.shields.io/badge/🌐-Live%20Demo-brightgreen)](https://deja-que-entre-el-sol-vorterix.netlify.app/)
[![GitHub License](https://img.shields.io/github/license/Neymors/deja-que-entre-el-sol)](https://github.com/Neymors/deja-que-entre-el-sol/blob/main/LICENSE)

Sitio **no oficial** del equipo de streaming *Deja Que Entre el Sol*.  
Desarrollado como práctica para centralizar contenido multimedia y experimentar con frontend dinámico y funciones serverless.

---

## 🧠 Sobre el proyecto

Este proyecto nace como una forma de integrar contenido en tiempo real (YouTube) con una interfaz web rápida y funcional.

El foco estuvo en:
- Consumo de APIs externas
- Separación entre frontend y lógica backend (serverless)
- Experiencia de usuario simple y fluida

---

## 🛠️ Tecnologías

**Frontend**
- HTML5  
- CSS3 (modo oscuro + glassmorphism)  
- JavaScript (vanilla)

**Backend (serverless)**
- Node.js (Netlify Functions)

**APIs**
- YouTube Data API v3

**Deploy**
- Netlify (CI/CD desde GitHub)

---

## 🚀 Funcionalidades

- 🔄 **Proxy serverless** para consumir la API de YouTube sin exponer credenciales  
- 🎬 **Galería dinámica** con contenido actualizado automáticamente  
- 📊 **NecroProde** con lógica de ordenamiento por puntos  
- 🌓 **Modo oscuro persistente** usando `localStorage`  
- ⏱️ **Cuenta regresiva** para próximos eventos en vivo  

---

## 🛡️ Arquitectura

El proyecto utiliza un enfoque simple de **Backend for Frontend (BFF)** mediante funciones serverless.

- 🔐 Las API keys no se exponen en el cliente  
- 🌐 Control básico de acceso a través del proxy  
- ⚙️ Separación entre lógica de datos y presentación  

---

## ⚙️ Instalación local

1. Clonar el repositorio: git clone https://github.com/Neymors/deja-que-entre-el-sol.git
2. Instalar Netkify CLI: npm install -g netlify-cli
3. Ejecutar entorno local: netlify dev

---

## 📌 Notas

Este proyecto fue utilizado como práctica para:

- Trabajar con APIs externas
- Entender funciones serverless
- Mejorar la organización de código en frontend

📫 Contacto
<p align="center"> <a href="https://github.com/Neymors"><img src="https://img.shields.io/badge/-181717?style=social&logo=github" alt="GitHub" /></a> <a href="https://x.com/ItsNeymor"><img src="https://img.shields.io/badge/-000000?style=social&logo=x" alt="X" /></a> <a href="https://www.instagram.com/itsnotgas/"><img src="https://img.shields.io/badge/-E4405F?style=social&logo=instagram" alt="Instagram" /></a> </p> <p align="center">☀️ Proyecto finalizado</p> 
