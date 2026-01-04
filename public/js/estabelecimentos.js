document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gridEstabelecimentos');
    const inputBusca = document.getElementById('buscaLocais');
    
    // Variáveis de Controle
    let todosLocais = [];
    let locaisFiltrados = [];
    let indiceAtual = 0;
    const ITENS_POR_PAGINA = 6;
    let filtroCategoriaAtivo = 'todos'; 

    // Captura parâmetros da URL 
    const params = new URLSearchParams(window.location.search);
    const filtroURL = params.get('filtro'); // ex: gastronomia
    const buscaURL = params.get('busca');   // ex: joia

    // Configura botões iniciais baseado na URL
    if (filtroURL) {
        filtroCategoriaAtivo = filtroURL;
        // Ativa o botão visualmente
        const btnAlvo = document.querySelector(`.btn-filtro[onclick*="'${filtroURL}'"]`);
        if(btnAlvo) {
            document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
            btnAlvo.classList.add('ativo');
        }
    }
    
    if (buscaURL && inputBusca) {
        inputBusca.value = buscaURL; // Preenche o campo de busca
    }

    // 1. Criar o Botão "Ver Mais" Dinamicamente
    const divBotao = document.createElement('div');
    divBotao.className = 'container-carregar-mais oculto';
    divBotao.innerHTML = '<button id="btnVerMais" class="btn-carregar">Ver Mais Locais 👇</button>';
    container.parentNode.insertBefore(divBotao, container.nextSibling);

    const btnVerMais = document.getElementById('btnVerMais');

    // 2. Busca Inicial
    function buscarLocais() {
        container.innerHTML = '<p class="carregando">Carregando locais...</p>';
        
        fetch('/api/estabelecimentos')
            .then(res => res.json())
            .then(data => {
                todosLocais = data;
                aplicarFiltros(); // Já vai aplicar os filtros da URL aqui
            })
            .catch(err => {
                console.error(err);
                container.innerHTML = '<p>Erro ao buscar locais.</p>';
            });
    }

    // 3. Aplica os Filtros (Texto + Categoria) e Reinicia a Lista
    function aplicarFiltros() {
        const termo = inputBusca ? inputBusca.value.toLowerCase() : '';

        // Filtra a lista completa
        locaisFiltrados = todosLocais.filter(l => {
            const matchNome = l.nome.toLowerCase().includes(termo);
            // Verifica se a categoria do local CONTÉM o filtro (ex: 'gastronomia' contém 'gastronomia')
            const matchCat = filtroCategoriaAtivo === 'todos' || l.categoria.toLowerCase().includes(filtroCategoriaAtivo);
            return matchNome && matchCat;
        });

        // Reseta a paginação
        container.innerHTML = '';
        indiceAtual = 0;
        divBotao.classList.add('oculto');

        if (locaisFiltrados.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum local encontrado.</p>';
            return;
        }

        // Carrega a primeira leva
        carregarMais();
    }

    // 4. Renderiza o próximo lote
    function carregarMais() {
        const proximoIndice = indiceAtual + ITENS_POR_PAGINA;
        const lote = locaisFiltrados.slice(indiceAtual, proximoIndice);

        lote.forEach(l => {
            const linkDetalhe = `/detalhe?tipo=estabelecimento&id=${l.id}`;
            
            const cardHTML = `
                <div class="card-local">
                    ${typeof Favoritos !== 'undefined' ? Favoritos.renderizarBotao(l.id, 'estabelecimento', l.nome, l.imagem || '/img/placeholder.jpg', linkDetalhe) : ''}

                    <div class="card-img" style="background-image: url('${l.imagem || '/img/placeholder.jpg'}');"></div>
                    <div class="card-conteudo">
                        ${l.destaque ? '<span class="badge-destaque">⭐ Destaque</span>' : ''}
                        <h3>${l.nome}</h3>
                        <span class="badge-categoria">${l.categoria}</span>
                        <p>📞 ${l.telefone}</p>
                        <a href="${linkDetalhe}" class="btn btn-primary">
                            Saiba Mais
                        </a>
                    </div>
                </div>`;
            container.innerHTML += cardHTML;
        });

        indiceAtual = proximoIndice;

        // Controla visibilidade do botão
        if (indiceAtual >= locaisFiltrados.length) {
            divBotao.classList.add('oculto');
        } else {
            divBotao.classList.remove('oculto');
        }
    }

    // 5. Função Global de Filtro (Chamada pelos botões no HTML)
    window.filtrar = function(categoria, btn) {
        // Atualiza visual dos botões
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
        if(btn) btn.classList.add('ativo');

        // Atualiza estado e reaplica
        filtroCategoriaAtivo = categoria;
        aplicarFiltros();
    };

    // Eventos
    if(inputBusca) inputBusca.addEventListener('input', aplicarFiltros);
    btnVerMais.addEventListener('click', carregarMais);

    // Iniciar
    buscarLocais();
});