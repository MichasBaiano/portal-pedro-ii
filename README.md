# 🏛️ Portal Turístico de Pedro II (MVP)

> **Status:** MVP Completo (Frontend + Backend + Banco de Dados + Painel Admin).

Bem-vindo ao repositório do **Portal de Pedro II**, uma solução digital desenvolvida para fomentar o turismo na "Suíça Piauiense". Este projeto demonstra uma arquitetura de software robusta, saindo de páginas estáticas para uma aplicação web dinâmica.

## 🚀 Tecnologias e Arquitetura

O projeto foi construído utilizando tecnologias modernas e padrões de mercado:

* **Backend:** Node.js com **Express.js**.
* **Banco de Dados:** **SQLite** (Relacional), garantindo persistência de dados sem necessidade de configuração complexa de servidores externos.
* **Frontend:** HTML5, CSS3, JavaScript (ES6+) e **Leaflet.js** (Mapas interativos).
* **Arquitetura:** **MVC (Model-View-Controller)** com separação clara de responsabilidades.
* **API:** RESTful API interna servindo dados em JSON para o frontend.

## 📂 Estrutura do Projeto

A organização das pastas reflete a arquitetura MVC implementada:

| Pasta | Função | Descrição |
| :--- | :--- | :--- |
| `Config/` | **Database** | Configuração e conexão com o SQLite (`db.js`). Inclui sistema de "Seed" automático. |
| `controller/` | **Lógica** | Gerencia as requisições, valida dados e conecta o Model à View. |
| `model/` | **Dados** | Executa as queries SQL (CRUD) no banco de dados. |
| `routes/` | **Roteamento** | Separação organizada entre rotas do site (`siteRoutes.js`) e da API (`apiRoutes.js`). |
| `view/` | **Interface** | Arquivos HTML, CSS e JS do cliente (Front-end desacoplado). |
| `server.js` | **Servidor** | Ponto de entrada da aplicação. |

## ✨ Funcionalidades

### 🌍 Área Pública (Turista)
1.  **Home Page:** Dashboard visual com acesso rápido a todas as seções.
2.  **Mapa Interativo:** Mapa dinâmico (Leaflet) com pinos marcando pontos turísticos reais.
3.  **Guia de Eventos:** Agenda cultural com listagem de festivais e filtros por categoria.
4.  **Serviços (Onde Ficar/Comer):** Catálogo de pousadas e restaurantes com sistema de "Destaque".
5.  **Transportes:** Informações utilitárias de ônibus, vans e mototáxis com botões de "Ligar agora".
6.  **Sugestões:** Formulário para moradores enviarem dicas, salvas diretamente no banco de dados.
7.  **Perfil do Usuário:** Funcionalidade *Client-Side* que salva preferências e foto no navegador (`localStorage`).

### 🔒 Área Administrativa (Gestão)
O sistema conta com um **Painel de Controle (CRUD Completo)** onde o administrador pode gerenciar o conteúdo do site sem mexer no código:

* **Gerenciar Eventos:** Adicionar, editar e excluir eventos da agenda.
* **Gerenciar Estabelecimentos:** Cadastrar novos comércios e definir destaques.
* **Gerenciar Transportes:** Atualizar horários e contatos.

> **Acesso ao Admin:** Navegue até o rodapé do site e clique em "Área Admin" ou acesse `/admin/eventos`.

## 🎨 Identidade Visual

O projeto respeita as cores da bandeira e a identidade cultural do município:
* 🔵 **Azul:** Representando o céu e as águas.
* 🟡 **Amarelo/Dourado:** Representando as riquezas e a Opala.
* ⚪ **Interface Limpa:** Design focado na usabilidade e leitura.

## 🛠️ Como Rodar o Projeto Localmente

1.  **Pré-requisitos:** Tenha o [Node.js](https://nodejs.org/) instalado.
2.  **Clonar o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPO]
    ```
3.  **Instalar dependências:**
    ```bash
    npm install
    ```
4.  **Rodar o servidor:**
    ```bash
    node server.js
    ```
    *(Nota: O banco de dados `database.sqlite` será criado e populado automaticamente na primeira execução).*
5.  **Acessar:** Abra `http://localhost:3000` no seu navegador.

---
Desenvolvido como projeto acadêmico/MVP para o programa Centelha/IFPI.
Licença MIT.