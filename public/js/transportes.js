document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gridTransportes');

    // Variáveis de Controle
    let paginaAtual = 1;
    let totalPaginas = 1;
    let carregando = false;
    let filtroTipoAtivo = 'todos';
    const ITENS_POR_PAGINA = 10;

    // Cria o botão "Ver Mais" dinamicamente
    const divBotao = document.createElement('div');
    divBotao.className = 'container-carregar-mais oculto';
    divBotao.innerHTML = '<button id="btnVerMais" class="btn-carregar">Ver Mais Horários 👇</button>';
    if (grid) grid.parentNode.insertBefore(divBotao, grid.nextSibling);

    const btnVerMais = document.getElementById('btnVerMais');

    // Mapeamento de ícones
    const iconesPorTipo = {
        'Ônibus': '🚌', 'Onibus': '🚌',
        'Van': '🚐',
        'Moto': '🏍️', 'Moto Táxi': '🏍️',
        'Carro': '🚗', 'Taxi': '🚕'
    };

    // Busca inicial
    function buscarTransportes(reset = false) {
        if (carregando) return;
        carregando = true;

        if (reset) {
            paginaAtual = 1;
            grid.innerHTML = '<p class="carregando">Carregando horários...</p>';
            divBotao.classList.add('oculto');
        }

        // Se o filtro for 'todos', não manda 'q', se for específico, manda o tipo na busca
        const termoBusca = filtroTipoAtivo === 'todos' ? '' : filtroTipoAtivo;
        
        // Chama API com paginação
        fetch(`/api/transportes?pagina=${paginaAtual}&limite=${ITENS_POR_PAGINA}&q=${termoBusca}`)
            .then(res => res.json())
            .then(resposta => {
                const dados = resposta.dados;
                const meta = resposta.meta;
                
                totalPaginas = meta.totalPaginas;

                if (reset) grid.innerHTML = '';

                if (dados.length === 0 && paginaAtual === 1) {
                    grid.innerHTML = '<p>Nenhum transporte encontrado.</p>';
                    divBotao.classList.add('oculto');
                    return;
                }

                renderizar(dados);

                // Controle do Botão Ver Mais
                if (paginaAtual < totalPaginas) {
                    divBotao.classList.remove('oculto');
                    paginaAtual++;
                } else {
                    divBotao.classList.add('oculto');
                }
            })
            .catch(err => {
                console.error(err);
                if(reset) grid.innerHTML = '<p>Erro ao carregar transportes.</p>';
            })
            .finally(() => {
                carregando = false;
            });
    }

    function renderizar(lista) {

        lista.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card-transporte';

            // Limpa o número
            const numeroLimpo = item.contato ? item.contato.replace(/\D/g, '') : '';
            const linkFake = '#';

            // Define o ícone (prioriza o do banco, senão usa o mapa pelo tipo, senão padrão)
            const iconeExibido = item.icone || iconesPorTipo[item.tipo] || '🚌';

            // Cria os botões de ação
            let botoesAcao = '';
            
            if (numeroLimpo) {
                botoesAcao += `<a href="tel:${numeroLimpo}" class="btn-ligar" style="background:#eee; color:#333;">📞 Ligar</a>`;
            }

            if (numeroLimpo.length >= 10) {
                botoesAcao += `
                <a href="https://wa.me/55${numeroLimpo}?text=Olá, preciso de transporte (vi no Portal Pedro II)." target="_blank" class="btn-zap">
                    💬 WhatsApp
                </a>`;
            }

            card.innerHTML = `
            <div class="icone-grande">${iconeExibido}</div>
            ${typeof Favoritos !== 'undefined' ? Favoritos.renderizarBotao(item.id, 'transporte', item.nome, '', linkFake) : ''}
            <div class="info-transporte">
                <h3>${item.nome}</h3>
                <div class="rota">${item.rota}</div>
                <div class="horarios">🕒 ${item.horarios}</div>
                <div style="margin-top: 0.5rem; display: flex; gap: 10px; flex-wrap: wrap;">
                    ${botoesAcao}
                </div>
            </div>
        `;
            grid.appendChild(card);
        });
    }

    // Função global de filtro
    window.filtrar = function (tipo, btn) {
        // 1. Atualiza visual dos botões
        if (btn) {
            document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');
        }

        // 2. Filtra os dados
        filtroTipoAtivo = tipo;
        buscarTransportes(true); // true = Reseta a lista e busca do zero
    };

    // Evento do botão Ver Mais
    btnVerMais.addEventListener('click', () => {
        buscarTransportes(false); // false = Busca a próxima página
    });

    // Inicia
    buscarTransportes(true);
});