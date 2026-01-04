let todosTransportes = [];

document.addEventListener('DOMContentLoaded', () => {
    // Busca inicial
    fetch('/api/transportes')
        .then(res => res.json())
        .then(data => {
            todosTransportes = data;
            renderizar(data);
        })
        .catch(err => console.error(err));
});

function renderizar(lista) {
    const grid = document.getElementById('gridTransportes');
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = '<p>Nenhum transporte encontrado.</p>';
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card-transporte';

        // Limpa o número
        const numeroLimpo = item.contato.replace(/\D/g, '');
        const linkFake = '#';

        // Cria os botões de ação
        let botoesAcao = `<a href="tel:${numeroLimpo}" class="btn-ligar" style="background:#eee; color:#333;">📞 Ligar</a>`;

        if (numeroLimpo.length >= 10) {
            botoesAcao += `
            <a href="https://wa.me/55${numeroLimpo}?text=Olá, preciso de transporte (vi no Portal Pedro II)." target="_blank" class="btn-zap">
                💬 WhatsApp
            </a>`;
        }

        card.innerHTML = `
        <div class="icone-grande">${item.icone}</div>
        ${Favoritos.renderizarBotao(item.id, 'transporte', item.nome, '', linkFake)}
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
    // 1. Atualiza visual dos botões (troca a classe .ativo)
    if (btn) {
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
    }

    // 2. Filtra os dados
    if (tipo === 'todos') {
        renderizar(todosTransportes);
    } else {
        const filtrados = todosTransportes.filter(t => t.tipo === tipo);
        renderizar(filtrados);
    }
};