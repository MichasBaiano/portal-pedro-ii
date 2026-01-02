const Favoritos = {
    chave: 'pedroii_favoritos',

    // Pega a lista salva
    getTodos() {
        return JSON.parse(localStorage.getItem(this.chave)) || [];
    },

    // Verifica se já é favorito
    isFavorito(id, tipo) {
        const lista = this.getTodos();
        return lista.some(item => String(item.id) === String(id) && item.tipo === tipo);
    },

    // Adiciona ou Remove
    toggle(id, tipo, nome, imagem, link) {
        let lista = this.getTodos();
        const index = lista.findIndex(item => String(item.id) === String(id) && item.tipo === tipo);
        let acao = '';

        if (index !== -1) {
            lista.splice(index, 1); // Remove
            acao = 'removido';
        } else {
            lista.push({ id, tipo, nome, imagem, link, data: new Date() }); // Adiciona
            acao = 'adicionado';
        }

        localStorage.setItem(this.chave, JSON.stringify(lista));
        window.dispatchEvent(new Event('favoritosAtualizados')); // Avisa o site
        return acao;
    },

    // Gera o botão HTML para colocar nos cards
    renderizarBotao(id, tipo, nome, imagem, link) {
        const ativo = this.isFavorito(id, tipo) ? 'ativo' : '';
        // Proteção contra aspas no nome (ex: D'Avila)
        const nomeSafe = nome.replace(/'/g, "\\'"); 
        
        return `
            <button class="btn-favorito ${ativo}" 
                onclick="Favoritos.animar(this, '${id}', '${tipo}', '${nomeSafe}', '${imagem}', '${link}')"
                title="Favoritar">
                ❤️
            </button>
        `;
    },

    // Animação do clique
    animar(btn, id, tipo, nome, imagem, link) {
        // Previne que o clique no botão abra o link do card
        if(event) event.preventDefault(); 
        
        const resultado = this.toggle(id, tipo, nome, imagem, link);
        if (resultado === 'adicionado') {
            btn.classList.add('ativo');
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => btn.style.transform = 'scale(1)', 200);
        } else {
            btn.classList.remove('ativo');
        }
    }
};