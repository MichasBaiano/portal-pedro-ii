document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('listaEventos');
    const inputBusca = document.getElementById('buscaEventos');
    const selectFiltro = document.getElementById('filtroCategoria'); // Se tiver filtro de categoria

    // Função Principal de Carregamento
    function carregarEventos(termo = '') {
        const url = termo ? `/api/eventos?q=${termo}` : '/api/eventos';

        fetch(url)
            .then(res => res.json())
            .then(eventos => {
                container.innerHTML = '';
                if (eventos.length === 0) {
                    container.innerHTML = '<p>Nenhum evento encontrado.</p>';
                    return;
                }

                eventos.forEach(ev => {
                        const linkDetalhe = `/detalhe?tipo=evento&id=${ev.id}`;
                    const dataFormatada = new Date(ev.data).toLocaleDateString('pt-BR');
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
            });
    }

    // Evento de Digitação (Pesquisa em tempo real)
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value;
        carregarEventos(termo);
    });

    // Carrega inicial
    carregarEventos();
});