document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gridEstabelecimentos');
    const inputBusca = document.getElementById('buscaLocais');

    // Estado da Aplicação
    let paginaAtual = 1;
    let totalPaginas = 1;
    let carregando = false;
    let filtroCategoriaAtivo = 'todos'; // Controla qual botão está aceso
    const ITENS_POR_PAGINA = 6; 

    // Captura parâmetros da URL (para links compartilhados)
    const params = new URLSearchParams(window.location.search);
    const filtroURL = params.get('filtro'); 
    const buscaURL = params.get('busca');

    // Configura estado inicial baseado na URL
    if (filtroURL) filtroCategoriaAtivo = filtroURL;
    if (buscaURL && inputBusca) inputBusca.value = buscaURL;

    // Atualiza visual dos botões de filtro no início
    atualizarBotoesFiltro();

    // 1. Criar o Botão "Ver Mais" Dinamicamente
    const divBotao = document.createElement('div');
    divBotao.className = 'container-carregar-mais oculto';
    divBotao.innerHTML = '<button id="btnVerMais" class="btn-carregar">Ver Mais Locais 👇</button>';
    container.parentNode.insertBefore(divBotao, container.nextSibling);

    const btnVerMais = document.getElementById('btnVerMais');

    // 2. Função Principal: Buscar Locais (No Servidor)
    function buscarLocais(reset = false) {
        if (carregando) return;
        carregando = true;

        if (reset) {
            paginaAtual = 1;
            container.innerHTML = '<p class="carregando">Carregando locais...</p>';
            divBotao.classList.add('oculto');
        }

        // Lógica de Busca: Texto digitado TEM prioridade. 
        // Se não tiver texto, usa a categoria selecionada.
        let termoEnvio = inputBusca ? inputBusca.value : '';
        
        if (!termoEnvio && filtroCategoriaAtivo !== 'todos') {
            termoEnvio = filtroCategoriaAtivo;
        }

        // Monta URL
        const url = `/api/estabelecimentos?pagina=${paginaAtual}&limite=${ITENS_POR_PAGINA}&q=${termoEnvio}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Erro na API');
                return res.json();
            })
            .then(resposta => {
                const locais = resposta.dados;
                const meta = resposta.meta;

                totalPaginas = meta.totalPaginas;

                if (reset) container.innerHTML = '';

                if (locais.length === 0 && paginaAtual === 1) {
                    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum local encontrado.</p>';
                    divBotao.classList.add('oculto');
                    carregando = false;
                    return;
                }

                renderizarLote(locais);

                // Mostra ou esconde botão "Ver Mais"
                if (paginaAtual < totalPaginas) {
                    divBotao.classList.remove('oculto');
                    paginaAtual++;
                } else {
                    divBotao.classList.add('oculto');
                }
            })
            .catch(err => {
                console.error(err);
                if (reset) container.innerHTML = '<p>Erro ao buscar locais.</p>';
            })
            .finally(() => {
                carregando = false;
            });
    }

    // 3. Renderiza o HTML
    function renderizarLote(locais) {
        locais.forEach(l => {
            const linkDetalhe = `/detalhe?tipo=estabelecimento&id=${l.id}`;

            // --- LÓGICA DO WHATSAPP ---
            const numeroLimpo = l.telefone ? l.telefone.replace(/\D/g, '') : '';
            let botaoZap = '';
            if (numeroLimpo.length >= 10) {
                const linkZap = `https://wa.me/55${numeroLimpo}?text=Olá, vi seu contato no Portal Pedro II!`;
                botaoZap = `<a href="${linkZap}" target="_blank" class="btn-zap">💬 WhatsApp</a>`;
            }

            // --- TRATAMENTO DE IMAGEM ---
            let imagemSrc = l.imagem;
            if (imagemSrc && !imagemSrc.startsWith('http')) {
                imagemSrc = `/uploads/${imagemSrc}`;
            }
            if (!imagemSrc) imagemSrc = '/img/placeholder.jpg';

            const classePremium = l.destaque ? 'card-premium' : '';
            
            // Renderiza Card
            const cardHTML = `
                <div class="card-local ${classePremium}">
                    ${typeof Favoritos !== 'undefined' ? Favoritos.renderizarBotao(l.id, 'estabelecimento', l.nome, imagemSrc, linkDetalhe) : ''}

                    <div class="card-img" style="background-image: url('${imagemSrc}');"></div>
                    <div class="card-conteudo">
                        ${l.destaque ? '<span class="badge-destaque">⭐ Destaque</span>' : ''}
                        <h3>${l.nome}</h3>
                        <span class="badge-categoria">${l.categoria}</span>
                        
                        <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                            <span style="color: var(--texto-corpo);">📞 ${l.telefone || 'S/ Tel'}</span>
                            ${botaoZap}
                        </div>

                        <a href="${linkDetalhe}" class="btn btn-primary">
                            Saiba Mais
                        </a>
                    </div>
                </div>`;
            
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // 4. Funções Auxiliares de Interface
    function atualizarBotoesFiltro() {
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
        // Tenta achar o botão pelo onclick que contém a categoria atual
        const btnAlvo = document.querySelector(`.btn-filtro[onclick*="'${filtroCategoriaAtivo}'"]`);
        // Se não achar, pega o primeiro ou o específico
        if (btnAlvo) {
            btnAlvo.classList.add('ativo');
        } else if (filtroCategoriaAtivo === 'todos') {
            document.querySelector('.btn-filtro').classList.add('ativo');
        }
    }

    // 5. Função Global
    window.filtrar = function (categoria, btn) {
        filtroCategoriaAtivo = categoria;
        
        // Atualiza classes visuais
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
        if (btn) btn.classList.add('ativo');
        
        // Limpa busca de texto se clicou num filtro de categoria
        if (inputBusca) inputBusca.value = '';

        buscarLocais(true); // Reseta e busca
    };

    // Eventos
    let timeoutBusca;
    if (inputBusca) {
        inputBusca.addEventListener('input', () => {
            clearTimeout(timeoutBusca);
            timeoutBusca = setTimeout(() => {
                filtroCategoriaAtivo = 'todos'; // Se digitou, ignora a categoria
                atualizarBotoesFiltro(); // Reseta visual dos botões
                buscarLocais(true);
            }, 500);
        });
    }

    btnVerMais.addEventListener('click', () => buscarLocais(false));

    // Inicialização
    buscarLocais(true);
});