document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar o mapa centrado em Pedro II
    // Coordenadas aproximadas do centro da cidade
    const map = L.map('map').setView([-4.4256, -41.4586], 13); 

    // 2. Adicionar a camada do OpenStreetMap (Gratuito)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3. Buscar os pontos turísticos do backend
    fetch('/api/pontos-mapa')
        .then(response => response.json())
        .then(locais => {
            locais.forEach(local => {
                // Adiciona um marcador para cada local
                L.marker([local.lat, local.lng])
                    .addTo(map)
                    .bindPopup(`
                        <b>${local.nome}</b><br>
                        ${local.categoria}<br>
                        <small>${local.descricao}</small>
                    `);
            });
        })
        .catch(erro => console.error('Erro ao carregar locais:', erro));
});