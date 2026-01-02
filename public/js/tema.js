document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btnTema');
    
    // 1. Verifica se já existe uma preferência salva
    const temaSalvo = localStorage.getItem('tema');
    
    // Se tiver salvo 'dark', aplica imediatamente
    if (temaSalvo === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(btnTema) btnTema.textContent = '☀️'; // Solzinho
    }

    // 2. Ação do Botão
    if (btnTema) {
        btnTema.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Verifica o tema atual
            const temaAtual = document.body.getAttribute('data-theme');

            if (temaAtual === 'dark') {
                // Voltar para Claro
                document.body.removeAttribute('data-theme');
                localStorage.setItem('tema', 'light');
                btnTema.textContent = '🌙'; // Lua
            } else {
                // Mudar para Escuro
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('tema', 'dark');
                btnTema.textContent = '☀️'; // Sol
            }
        });
    }
});