document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('listaEventos');
    const inputBusca = document.getElementById('buscaEventos');
    const selectFiltro = document.getElementById('filtroCategoria');

    // Variáveis de Controle da Paginação
    let paginaAtual = 1;        // Qual página o servidor deve mandar
    let totalPaginas = 1;       // O servidor vai nos dizer quantas existem
    let carregando = false;     // Para evitar cliques duplos
    const ITENS_POR_PAGINA = 6; // Deve bater com o "limit" do backend

    // Cria o botão "Ver Mais" dinamicamente
    const divBotao = document.createElement('div');
    divBotao.className = 'container-carregar-mais oculto';
    divBotao.innerHTML = '<button id="btnVerMais" class="btn-carregar">Ver Mais Eventos 👇</button>';
    // Adiciona o botão DEPOIS da grid de eventos
    container.parentNode.insertBefore(divBotao, container.nextSibling);

    const btnVerMais = document.getElementById('btnVerMais');

    // 1. Função Principal de Busca 
    // O parâmetro 'reset' diz se é uma nova pesquisa (limpa tudo) ou se é paginação (adiciona embaixo)
    function buscarEventos(reset = false) {
        if (carregando) return;
        carregando = true;

        // Se for uma nova busca (digitou algo ou mudou filtro), volta pra página 1
        if (reset) {
            paginaAtual = 1;
            container.innerHTML = '<p class="carregando">Carregando eventos...</p>';
            divBotao.classList.add('oculto'); // Esconde botão enquanto carrega
        }

        // Pega os valores dos filtros
        const termo = inputBusca.value;
        // Se tiver select de categoria, usa, se não, ignora
        
        // Monta a URL da API com Paginação
        const url = `/api/eventos?pagina=${paginaAtual}&limite=${ITENS_POR_PAGINA}&q=${termo}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Erro na API");
                return res.json();
            })
            .then(resposta => {
                // O Backend agora retorna: { dados: [...], meta: {...} }
                const listaEventos = resposta.dados;
                const meta = resposta.meta;

                totalPaginas = meta.totalPaginas;

                // Se for reset, limpa a mensagem de "carregando"
                if (reset) container.innerHTML = '';

                // Verifica se não veio nada
                if (listaEventos.length === 0 && paginaAtual === 1) {
                    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum evento encontrado.</p>';
                    divBotao.classList.add('oculto');
                    carregando = false;
                    return;
                }

                // Renderiza os cards recebidos
                renderizarLote(listaEventos);

                // Lógica do Botão: Se a página atual for menor que o total, mostra o botão
                if (paginaAtual < totalPaginas) {
                    divBotao.classList.remove('oculto');
                    paginaAtual++; // Prepara o contador para a próxima vez que clicar
                } else {
                    divBotao.classList.add('oculto'); // Acabou
                }
            })
            .catch(err => {
                console.error(err);
                if (reset) container.innerHTML = '<p>Erro ao carregar eventos.</p>';
            })
            .finally(() => {
                carregando = false;
            });
    }

    // 2. Filtra (Busca + Categoria) - Agora dispara uma NOVA busca no servidor
    function aplicarFiltros() {
        buscarEventos(true); // TRUE = Reseta a lista e começa do zero
    }

    // 3. Função que renderiza o lote (HTML)
    function renderizarLote(eventos) {
        eventos.forEach(ev => {
            // Cria as variáveis necessárias
            const linkDetalhe = `/detalhe?tipo=evento&id=${ev.id}`;
            // Ajuste de Data para UTC (evita erro de dia anterior)
            const dataFormatada = new Date(ev.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            
            // TRATAMENTO DE IMAGEM (Segurança para links externos vs uploads locais)
            let imagemSrc = ev.imagem;
            if (imagemSrc && !imagemSrc.startsWith('http')) {
                imagemSrc = `/uploads/${imagemSrc}`;
            }
            if (!imagemSrc) imagemSrc = 'https://via.placeholder.com/400';

            // Renderiza o Card (Mantive seu HTML exato)
            const cardHTML = `
                <div class="card-evento">
                    ${typeof Favoritos !== 'undefined' ? Favoritos.renderizarBotao(ev.id, 'evento', ev.nome, ev.imagem, linkDetalhe) : ''}
                    <div class="card-img" style="background-image: url('${imagemSrc}');"></div>
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
            
            // Usa insertAdjacentHTML para não quebrar eventos de itens anteriores
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // Eventos de interação 
    let timeoutBusca;
    inputBusca.addEventListener('input', () => {
        clearTimeout(timeoutBusca);
        timeoutBusca = setTimeout(() => aplicarFiltros(), 500);
    });

    if(selectFiltro) selectFiltro.addEventListener('change', aplicarFiltros);
    
    // Botão "Ver Mais" agora pede a PRÓXIMA página (reset = false)
    btnVerMais.addEventListener('click', () => {
        buscarEventos(false); 
    });

    // Iniciar (Busca a página 1)
    buscarEventos(true);
});