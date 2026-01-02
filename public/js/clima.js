document.addEventListener('DOMContentLoaded', () => {
    const lat = -4.4255;
    const lng = -41.4586;
    
    // URL da API Open-Meteo (Gratuita)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&timezone=America%2FSao_Paulo`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.current.temperature_2m);
            const codigo = data.current.weather_code;
            const isDia = data.current.is_day; // 1 = dia, 0 = noite

            atualizarWidget(temp, codigo, isDia);
        })
        .catch(erro => {
            console.error("Erro ao carregar clima:", erro);
            document.getElementById('climaTexto').innerText = "Pedro II, PI";
        });
});

function atualizarWidget(temp, codigo, isDia) {
    const elTemp = document.getElementById('climaTemp');
    const elTexto = document.getElementById('climaTexto');
    const elIcone = document.getElementById('climaIcone');

    // Mapeamento simplificado dos códigos WMO (Organização Meteorológica Mundial)
    let texto = 'Céu Limpo';
    let icone = isDia ? '☀️' : '🌙';

    // Códigos WMO
    if (codigo >= 1 && codigo <= 3) {
        texto = 'Parcialmente Nublado';
        icone = isDia ? '⛅' : '☁️';
    } else if (codigo >= 45 && codigo <= 48) {
        texto = 'Neblina';
        icone = '🌫️';
    } else if (codigo >= 51 && codigo <= 67) {
        texto = 'Chuva Leve';
        icone = '🌧️';
    } else if (codigo >= 80 && codigo <= 99) {
        texto = 'Tempestade';
        icone = '⛈️';
    }

    // Atualiza o HTML
    elTemp.innerText = `${temp}°C`;
    elTexto.innerText = texto;
    elIcone.innerText = icone;
}