document.addEventListener('DOMContentLoaded', () => {
    const listaEventos = document.getElementById('listaEventos');
    const filtroSelect = document.getElementById('filtroCategoria');
    
    let todosEventos = []; // Guarda os dados originais para filtrar depois

    // 1. Função para desenhar os cards na tela
    function renderizarEventos(eventos) {
        listaEventos.innerHTML = ''; // Limpa a lista atual

        if (eventos.length === 0) {
            listaEventos.innerHTML = '<p>Nenhum evento encontrado nesta categoria.</p>';
            return;
        }

        eventos.forEach(evento => {
            // Formata a data para dia/mês/ano
            const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR');

            const card = document.createElement('div');
            card.className = 'card-evento';
            
            // Usa imagem do evento ou um placeholder padrão se não tiver
            const imagemUrl = evento.imagem && evento.imagem.startsWith('http') 
                ? evento.imagem 
                : 'https://via.placeholder.com/400x200?text=Evento+Pedro+II';

            card.innerHTML = `
                <div class="card-img" style="background-image: url('${imagemUrl}')"></div>
                <div class="card-conteudo">
                    <span class="data-badge">${dataFormatada}</span>
                    <h3>${evento.nome}</h3>
                    <div class="local">📍 ${evento.local}</div>
                    <p class="descricao">${evento.descricao}</p>
                </div>
            `;
            listaEventos.appendChild(card);
        });
    }

    // 2. Buscar dados da API
    fetch('/api/eventos')
        .then(res => res.json())
        .then(data => {
            todosEventos = data; // Salva na memória
            renderizarEventos(todosEventos); // Mostra tudo inicialmente
        })
        .catch(err => {
            console.error(err);
            listaEventos.innerHTML = '<p>Erro ao carregar eventos.</p>';
        });

    // 3. Lógica do Filtro
    filtroSelect.addEventListener('change', (e) => {
        const categoriaSelecionada = e.target.value;

        if (categoriaSelecionada === 'todos') {
            renderizarEventos(todosEventos);
        } else {
            const filtrados = todosEventos.filter(evento => 
                evento.categoria === categoriaSelecionada
            );
            renderizarEventos(filtrados);
        }
    });
});