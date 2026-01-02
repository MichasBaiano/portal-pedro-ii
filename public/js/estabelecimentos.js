document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gridEstabelecimentos');
    const inputBusca = document.getElementById('buscaLocais');

    function carregarLocais(termo = '') {
        const url = termo ? `/api/estabelecimentos?q=${termo}` : '/api/estabelecimentos';

        fetch(url)
            .then(res => res.json())
            .then(locais => {
                container.innerHTML = '';
                if (locais.length === 0) {
                    container.innerHTML = '<p>Nenhum local encontrado.</p>';
                    return;
                }

                locais.forEach(l => {
                    const cardHTML = `
                        <div class="card-local">
                            <div class="card-img" style="background-image: url('${l.imagem || '/img/placeholder.jpg'}');"></div>
                            <div class="card-conteudo">
                                ${l.destaque ? '<span class="badge-destaque">⭐ Destaque</span>' : ''}
                                <h3>${l.nome}</h3>
                                <span class="badge-categoria">${l.categoria}</span>
                                <p>📞 ${l.telefone}</p>
                                <a href="/detalhe?tipo=estabelecimento&id=${l.id}" class="btn btn-primary">
                                    Saiba Mais
                                </a>
                            </div>
                        </div>`;
                    container.innerHTML += cardHTML;
                });
            });
    }

    // Filtragem visual simples (Client Side)
    window.filtrar = function(categoria, btn) {
        // Atualiza botões
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');

        // Recarrega todos e filtra visualmente (ou chama API se preferir)
        const cards = document.querySelectorAll('.card-local');
        cards.forEach(card => {
            const catCard = card.querySelector('.badge-categoria').innerText.toLowerCase();
            if(categoria === 'todos' || catCard.includes(categoria)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if(inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            carregarLocais(e.target.value);
        });
    }

    carregarLocais();
});