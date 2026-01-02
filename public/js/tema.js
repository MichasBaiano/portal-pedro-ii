document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btnTema');
    const iconeTema = document.getElementById('iconeTema');
    
    // 1. Verifica se já existe uma preferência salva
    const temaSalvo = localStorage.getItem('tema');
    
    // Se tiver salvo 'dark', aplica imediatamente
    if (temaSalvo === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        iconeTema.textContent = '☀️'; // Muda ícone para Sol
    }

    // 2. Ação do Botão
    if (btnTema) {
        btnTema.addEventListener('click', (e) => {
            e.preventDefault(); // Evita scroll se for link
            
            // Verifica o tema atual
            const temaAtual = document.body.getAttribute('data-theme');

            if (temaAtual === 'dark') {
                // Voltar para Claro
                document.body.removeAttribute('data-theme');
                localStorage.setItem('tema', 'light');
                iconeTema.textContent = '🌙'; // Ícone Lua
            } else {
                // Mudar para Escuro
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('tema', 'dark');
                iconeTema.textContent = '☀️'; // Ícone Sol
            }
        });
    }
});