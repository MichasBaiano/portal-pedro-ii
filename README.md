# 🏛️ Portal Turístico de Pedro II (MVP)

**Status:** Funcionalidade básica (Perfil e Home) concluída. Design moderno implementado.

Este projeto é um *Produto Mínimo Viável* (MVP) de um portal turístico desenvolvido para demonstrar arquitetura MVC (Model-View-Controller) e persistência de dados no lado do cliente (Client-Side Storage).

## 🚀 Tecnologias

O projeto é construído sobre uma pilha moderna de desenvolvimento web:

* **Backend (Servidor):** Node.js com **Express.js** para roteamento e para servir arquivos estáticos.
* **Frontend:** HTML5, CSS3, e JavaScript ES Modules.
* **Design:** CSS modular (`style.css` global) com paleta Azul e Amarelo moderna.
* **Persistência de Dados:** Uso de **`localStorage`** para salvar dados do perfil e foto (Base64), garantindo funcionalidade offline sem a necessidade de um banco de dados de servidor.

## 🎯 Arquitetura do Projeto

O projeto segue a arquitetura **MVC (Model-View-Controller)** para garantir organização e escalabilidade, mesmo em um projeto pequeno.

| Pasta | Camada | Função Atual |
| :--- | :--- | :--- |
| `server.js` | **Controlador (Roteamento)** | Inicia o servidor Express.js e define as rotas (`/`, `/perfil`). |
| `view/` | **View (Interface do Usuário)** | Contém todos os arquivos visuais (HTML, CSS e JS do Frontend). |
| `model/` | **Model (Dados)** | **(Vazio)** Destinado a lógica de banco de dados e regras de negócio. |
| `controller/` | **Controller (Lógica)** | **(Vazio)** Destinado a manipular requisições entre a View e o Model. |

## ✨ Funcionalidades Entregues (Sprint 01)

As seguintes funcionalidades estão completas e funcionando:

1.  **Estrutura do Servidor:** Servidor Node/Express rodando na porta 3000.
2.  **Página Inicial (`/`):**
    * Exibe mensagem de boas-vindas condicional.
    * Altera o link de navegação para "Criar Perfil" ou "Ver Perfil" com base no status do usuário.
3.  **Criação/Edição de Perfil (`/perfil`):**
    * **Modo Criar/Editar:** O formulário preenche automaticamente os dados salvos (`localStorage`) para edição.
    * **Persistência de Dados:** Salva Nome, E-mail e Cidade no `localStorage`.
    * **Foto de Perfil:** Implementação avançada de upload e salvamento da foto como **Base64** no `localStorage`.
    * **Validação UX:** Valida campos obrigatórios e formato de e-mail antes de salvar, dando feedback visual de erro.
4.  **Licenciamento:** O projeto está sob a Licença **MIT**, permitindo uso e modificação livres.

## 🛠️ Como Rodar o Projeto

1.  **Clonar o Repositório:**
    ```bash
    git clone [Link do seu repositório no GitHub]
    ```
2.  **Instalar Dependências:**
    ```bash
    npm install
    ```
3.  **Iniciar o Servidor:**
    ```bash
    npm start
    ```
    *O servidor estará acessível em `http://localhost:3000`.*
