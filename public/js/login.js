document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const msgErro = document.getElementById('msgErro');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Pega os valores dos campos corrigidos
            const login = document.getElementById('login').value;
            const senha = document.getElementById('senha').value;
            const btn = form.querySelector('button');

            btn.textContent = 'Entrando...';
            btn.disabled = true;
            msgErro.style.display = 'none';

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Envia o JSON com a chave 'login'
                    body: JSON.stringify({ login, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = '/admin'; // Redireciona para o painel
                } else {
                    throw new Error(data.erro || 'Erro ao fazer login');
                }
            } catch (error) {
                msgErro.textContent = error.message;
                msgErro.style.display = 'block';
                btn.textContent = 'Entrar';
                btn.disabled = false;
            }
        });
    }
});