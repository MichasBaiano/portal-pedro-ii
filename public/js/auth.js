document.addEventListener('DOMContentLoaded', () => {
    const linkPerfil = document.getElementById('linkPerfil');
    const msgBoasVindas = document.getElementById('mensagemBoasVindas');

    const perfil = JSON.parse(localStorage.getItem('perfil'));

    if (perfil) {
        if (linkPerfil) {
            linkPerfil.textContent = 'Ver Perfil';
        }
        if (msgBoasVindas) {
            msgBoasVindas.textContent = `Olá, ${perfil.nome}! Aproveite o portal.`;
        }
    } else {
        if (linkPerfil) {
            linkPerfil.textContent = 'Criar Perfil';
        }
        if (msgBoasVindas) {
            msgBoasVindas.textContent = 'Crie seu perfil para ter uma experiência completa.';
        }
    }
});