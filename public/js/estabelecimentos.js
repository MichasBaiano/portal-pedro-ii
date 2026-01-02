document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gridEstabelecimentos');
    const inputBusca = document.getElementById('buscaLocais');
    // Para simplificar, o filtro de botões (gastronomia/hotel) pode ser feito via CSS ou JS Client-Side, 
    // mas aqui vamos focar na busca por texto via Backend.

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
                        <div class="card-local" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div class="card-img" style="background-image: url('${l.imagem || 'https://via.placeholder.com/400'}'); height: 200px; background-size: cover; background-position: center;"></div>
                            <div class="card-conteudo" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                                ${l.destaque ? '<span style="color: goldenrod; font-weight: bold;">⭐ Destaque</span>' : ''}
                                <h3 style="margin: 0;">${l.nome}</h3>
                                <span style="background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; width: fit-content;">${l.categoria}</span>
                                <p>📞 ${l.telefone}</p>
                                <a href="/detalhe?tipo=estabelecimento&id=${l.id}" class="btn" style="background-color: var(--cor-primaria); color: white; text-align: center; text-decoration: none; margin-top: 10px; display: block; padding: 10px; border-radius: 5px;">
                                    Saiba Mais
                                </a>
                            </div>
                        </div>`;
                    container.innerHTML += cardHTML;
                });
            });
    }

    inputBusca.addEventListener('input', (e) => {
        carregarLocais(e.target.value);
    });

    carregarLocais();
});