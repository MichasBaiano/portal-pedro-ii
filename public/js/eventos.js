document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('listaEventos');
    const inputBusca = document.getElementById('buscaEventos');
    const selectFiltro = document.getElementById('filtroCategoria');

    // Variáveis de Controle da Paginação
    let todosEventos = [];      // Guarda tudo que veio do banco
    let eventosFiltrados = [];  // Guarda o que está sendo exibido na busca atual
    let indiceAtual = 0;        // Quantos já mostramos
    const ITENS_POR_PAGINA = 6; // Quantos mostrar por vez

    // Cria o botão "Ver Mais" dinamicamente
    const divBotao = document.createElement('div');
    divBotao.className = 'container-carregar-mais oculto';
    divBotao.innerHTML = '<button id="btnVerMais" class="btn-carregar">Ver Mais Eventos 👇</button>';
    // Adiciona o botão DEPOIS da grid de eventos
    container.parentNode.insertBefore(divBotao, container.nextSibling);

    const btnVerMais = document.getElementById('btnVerMais');

    // 1. Busca Inicial
    function buscarEventos() {
        container.innerHTML = '<p class="carregando">Carregando eventos...</p>';
        
        fetch('/api/eventos')
            .then(res => res.json())
            .then(data => {
                todosEventos = data;
                aplicarFiltros(); // Começa a exibir
            })
            .catch(err => {
                console.error(err);
                container.innerHTML = '<p>Erro ao carregar eventos.</p>';
            });
    }

    // 2. Filtra (Busca + Categoria) e Reinicia a Lista
    function aplicarFiltros() {
        const termo = inputBusca.value.toLowerCase();
        const categoria = selectFiltro ? selectFiltro.value : 'todos';

        // Filtra a lista completa
        eventosFiltrados = todosEventos.filter(ev => {
            const matchNome = ev.nome.toLowerCase().includes(termo);
            const matchCat = categoria === 'todos' || ev.categoria === categoria;
            return matchNome && matchCat;
        });

        // Reseta a paginação
        container.innerHTML = '';
        indiceAtual = 0;
        divBotao.classList.add('oculto');

        if (eventosFiltrados.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum evento encontrado.</p>';
            return;
        }

        // Carrega a primeira leva
        carregarMais();
    }

    // 3. Função que renderiza o próximo lote (Paginação)
    function carregarMais() {
        const proximoIndice = indiceAtual + ITENS_POR_PAGINA;
        // Pega uma fatia da lista (ex: do 0 ao 6)
        const lote = eventosFiltrados.slice(indiceAtual, proximoIndice);

        lote.forEach(ev => {
            // Cria as variáveis necessárias
            const linkDetalhe = `/detalhe?tipo=evento&id=${ev.id}`;
            const dataFormatada = new Date(ev.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            
            // Renderiza o Card
            const cardHTML = `
                <div class="card-evento">
                    ${Favoritos.renderizarBotao(ev.id, 'evento', ev.nome, ev.imagem, linkDetalhe)}
                    <div class="card-img" style="background-image: url('${ev.imagem || 'https://via.placeholder.com/400'}');"></div>
                    <div class="card-conteudo">
                        <span class="data-badge">${dataFormatada}</span>
                        <h3>${ev.nome}</h3>
                        <div class="local">📍 ${ev.local}</div>
                        <p class="descricao">${ev.descricao ? ev.descricao.substring(0, 80) + '...' : ''}</p>
                        <a href="${linkDetalhe}" class="btn" style="background-color: var(--cor-primaria); color: white; text-align: center; text-decoration: none; margin-top: auto; display: block; padding: 10px; border-radius: 5px;">
                            Ver Detalhes
                        </a>
                    </div>
                </div>`;
            container.innerHTML += cardHTML;
        });

        // Atualiza o índice
        indiceAtual = proximoIndice;

        // Verifica se ainda tem coisas pra mostrar. Se não tiver, esconde o botão.
        if (indiceAtual >= eventosFiltrados.length) {
            divBotao.classList.add('oculto');
        } else {
            divBotao.classList.remove('oculto');
        }
    }

    // Eventos de interação
    inputBusca.addEventListener('input', aplicarFiltros);
    if(selectFiltro) selectFiltro.addEventListener('change', aplicarFiltros);
    btnVerMais.addEventListener('click', carregarMais);

    // Iniciar
    buscarEventos();
});