# 💎 Portal Pedro II - A Suíça Piauiense

> Um guia turístico e comercial completo, interativo e progressivo (PWA) para a cidade de Pedro II, Piauí.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![PWA](https://img.shields.io/badge/PWA-Ready-blue)

## 📖 Sobre o Projeto

O **Portal Pedro II** é uma aplicação web desenvolvida para conectar turistas e moradores aos melhores eventos, pontos turísticos (como o Morro do Gritador e as Minas de Opala) e comércios da cidade. 

O projeto foi construído com foco em performance, acessibilidade offline e monetização para comércios locais.

## ✨ Funcionalidades Principais

* **📱 Progressive Web App (PWA):** Instalável no Android/iOS e funciona Offline.
* **🗺️ Mapa Interativo:** Localização precisa de pontos turísticos e serviços.
* **⭐ Sistema de Avaliações:** Usuários podem dar notas e comentar (Prova Social).
* **💰 Monetização (Destaques):** Sistema de "Patrocínio" onde estabelecimentos pagantes ganham destaque visual e prioridade nas listas.
* **💬 Integração WhatsApp:** Botões de contato direto para hotéis, restaurantes e mototáxis.
* **🔍 Filtros Inteligentes:** "Rota da Opala", "Ecoturismo" e "Gastronomia".
* **🔐 Painel Administrativo:** Gestão completa de banners, eventos e locais com segurança criptografada.
* **🌙 Modo Escuro:** Detecção automática e alternância manual de tema.

## 🛠️ Tecnologias Utilizadas

* **Back-end:** Node.js, Express.
* **Front-end:** HTML5, CSS3 (Moderno), JavaScript (Vanilla), EJS (View Engine).
* **Banco de Dados:** SQLite (Leve e eficiente).
* **Segurança:** Bcrypt (Hash de senhas), Express-Session.
* **Outros:** Leaflet (Mapas), Multer (Upload de Imagens).

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/portal-pedro-ii.git](https://github.com/SEU_USUARIO/portal-pedro-ii.git)
    cd portal-pedro-ii
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione:
    ```ini
    PORT=3000
    NODE_ENV=development
    SESSION_SECRET=sua_chave_secreta_aqui
    ```

4.  **Inicie o Servidor:**
    ```bash
    npm start
    ```

5.  **Acesse:**
    Abra `http://localhost:3000` no seu navegador.

## 👤 Autores
**Ananias Carlos**
**Davi Carreiro**
**Michel Júnior**
**Sidney Nascimento**
* Desenvolvedores Fullstacks
* Estudantes de Análise e Desenvolvimento de Sistemas

---
Feito com ❤️ para Pedro II - PI.
Todos os direitos reservados aos alunos
