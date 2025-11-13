const formPerfil = document.getElementById('formPerfil');
const perfilSalvo = document.getElementById('perfilSalvo');

const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputFoto = document.getElementById('foto');

const previewFoto = document.getElementById('previewFoto');
const fotoSucesso = document.getElementById('fotoSucesso');
const defaultAvatar = 'path/to/your/default-avatar.png'; 
const resNome = document.getElementById('resNome');
const resEmail = document.getElementById('resEmail');

const erroFormulario = document.getElementById('erroFormulario');

let fotoBase64Selecionada = null;

inputFoto.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (eventoReader) => {
      fotoBase64Selecionada = eventoReader.target.result;
      previewFoto.src = fotoBase64Selecionada;
    };

    reader.readAsDataURL(file);
  }
});


function validarEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

function mostrarErro(mensagem) {
  erroFormulario.textContent = mensagem;
  erroFormulario.classList.remove('oculto');
}

function esconderErro() {
  erroFormulario.classList.add('oculto');
}

formPerfil.addEventListener('submit', (e) => {
  
  e.preventDefault();
  
  const nome = inputNome.value.trim();
  const email = inputEmail.value.trim();

  if (nome === '' || email === '') {
    mostrarErro('Todos os campos são obrigatórios.');
    return;
  }

  if (!validarEmail(email)) {
    mostrarErro('Por favor, insira um e-mail válido.');
    return;
  }

  esconderErro();


  const perfilAntigo = JSON.parse(localStorage.getItem('perfil')) || {};

  const dados = {
    nome: nome,
    email: email,
    foto: fotoBase64Selecionada || perfilAntigo.foto || null 
  };

  localStorage.setItem('perfil', JSON.stringify(dados));

  resNome.textContent = dados.nome;
  resEmail.textContent = dados.email;
  fotoSucesso.src = dados.foto || defaultAvatar;

  perfilSalvo.classList.remove('oculto');
  formPerfil.classList.add('oculto');
});

window.onload = () => {
  const perfil = JSON.parse(localStorage.getItem('perfil'));

  if (perfil) {
    inputNome.value = perfil.nome;
    inputEmail.value = perfil.email;
    
    if (perfil.foto) {
      previewFoto.src = perfil.foto;
      fotoSucesso.src = perfil.foto;
    } else {
      previewFoto.src = defaultAvatar;
      fotoSucesso.src = defaultAvatar;
    }

    formPerfil.classList.remove('oculto');
    perfilSalvo.classList.add('oculto');
    
  } else {
    formPerfil.classList.remove('oculto');
    perfilSalvo.classList.add('oculto');
    previewFoto.src = defaultAvatar;
  }
};