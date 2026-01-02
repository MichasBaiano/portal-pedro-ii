let todosTransportes = [];

document.addEventListener('DOMContentLoaded', () => {
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
        
        // Remove caracteres não numéricos para o link tel:
        const numeroLimpo = item.contato.replace(/\D/g, '');

        card.innerHTML = `
            <div class="icone-grande">${item.icone}</div>
            <div class="info-transporte">
                <h3>${item.nome}</h3>
                <div class="rota">${item.rota}</div>
                <div class="horarios">🕒 ${item.horarios}</div>
                <a href="tel:${numeroLimpo}" class="btn-ligar">📞 Ligar: ${item.contato}</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Função global para ser chamada pelo onclick no HTML
window.filtrar = function(tipo) {
    if (tipo === 'todos') {
        renderizar(todosTransportes);
    } else {
        const filtrados = todosTransportes.filter(t => t.tipo === tipo);
        renderizar(filtrados);
    }
};