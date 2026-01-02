document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formSugestao');
    
    // Tenta preencher dados se o usuário já salvou no "Perfil"
    const perfil = JSON.parse(localStorage.getItem('perfil_visitante'));
    if (perfil) {
        if(perfil.nome) document.getElementById('nome').value = perfil.nome;
        if(perfil.email) document.getElementById('email').value = perfil.email;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button');
        const textoOriginal = btn.textContent;
        
        // Feedback visual no botão
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        const dados = {
            tipo: document.getElementById('tipo').value,
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            mensagem: document.getElementById('mensagem').value
        };

        try {
            // Envia para a API (Criaremos a rota no backend se ainda não existir)
            const response = await fetch('/api/sugestoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                // SUCESSO: Mostra APENAS o Popup SweetAlert
                Swal.fire({
                    title: 'Obrigado! 🎉',
                    text: 'Sua sugestão foi enviada com sucesso.',
                    icon: 'success',
                    confirmButtonColor: '#0f4c81'
                });
                
                form.reset(); // Limpa o formulário
                
                // Repreenche o nome/email se tiver salvo, pra facilitar
                if (perfil) {
                    if(perfil.nome) document.getElementById('nome').value = perfil.nome;
                    if(perfil.email) document.getElementById('email').value = perfil.email;
                }

            } else {
                throw new Error('Erro no servidor');
            }
        } catch (erro) {
            Swal.fire({
                title: 'Ops!',
                text: 'Não foi possível enviar agora. Tente novamente.',
                icon: 'error'
            });
        } finally {
            // Restaura o botão
            btn.textContent = textoOriginal;
            btn.disabled = false;
        }
    });
});