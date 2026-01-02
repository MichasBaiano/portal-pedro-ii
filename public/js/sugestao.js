document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formSugestao');
    const feedback = document.getElementById('feedback');
    const btnNovo = document.getElementById('btnNovo');

    // Preencher nome/email automaticamente se o usuário estiver logado (localStorage)
    const perfil = JSON.parse(localStorage.getItem('perfil'));
    if (perfil) {
        document.getElementById('nome').value = perfil.nome || '';
        document.getElementById('email').value = perfil.email || '';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            tipo: document.getElementById('tipo').value,
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            mensagem: document.getElementById('mensagem').value
        };

        try {
            // Mostra um "Carregando..." enquanto envia
            Swal.fire({
                title: 'Enviando...',
                text: 'Por favor, aguarde.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading() }
            });

            const resposta = await fetch('/api/sugestao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (resposta.ok) {
                // SUCESSO!
                Swal.fire({
                    title: 'Obrigado! 🎉',
                    text: 'Sua sugestão foi enviada com sucesso.',
                    icon: 'success',
                    confirmButtonColor: '#004e92'
                });

                form.classList.add('oculto');
                feedback.classList.remove('oculto');
            } else {
                // ERRO DO SERVIDOR
                Swal.fire({
                    title: 'Ops...',
                    text: 'Erro ao enviar. Tente novamente.',
                    icon: 'error'
                });
    }
    } catch (erro) {
        console.error(erro);
        // ERRO DE CONEXÃO
        Swal.fire({
            title: 'Sem conexão',
            text: 'Verifique sua internet.',
            icon: 'warning'
        });
    }
    });

    btnNovo.addEventListener('click', () => {
        form.reset();
        feedback.classList.add('oculto');
        form.classList.remove('oculto');
    });
});