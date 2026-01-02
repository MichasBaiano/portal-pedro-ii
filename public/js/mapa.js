document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Mapa (Centralizado em Pedro II)
    const map = L.map('map').setView([-4.4255, -41.4586], 14);

    // 2. Adiciona o desenho do mapa (OpenStreetMap - Grátis)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 3. Ícones Personalizados
    const iconeLocal = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Pin Azul
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    const iconeEvento = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1458/1458512.png', // Pin de Música/Festa
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    // 4. Buscar pontos da API
    fetch('/api/pontos-mapa')
        .then(res => res.json())
        .then(pontos => {
            pontos.forEach(p => {
                // Escolhe o ícone
                const icone = p.tipo === 'evento' ? iconeEvento : iconeLocal;

                // Cria o Marcador
                const marker = L.marker([p.lat, p.lng], { icon: icone }).addTo(map);

                // Cria o Popup (Balãozinho ao clicar)
                const linkDetalhe = `/detalhe?tipo=${p.tipo === 'evento' ? 'evento' : 'estabelecimento'}&id=${p.id}`;
                
                const popupContent = `
                    <div style="text-align:center; min-width: 150px;">
                        <img src="${p.img}" style="width:100%; height:80px; object-fit:cover; border-radius:8px; margin-bottom:5px;">
                        <strong style="display:block; font-size:1rem; margin-bottom:5px;">${p.titulo}</strong>
                        <span style="background:#eee; padding:2px 6px; border-radius:4px; font-size:0.8rem;">${p.categoria}</span>
                        <br>
                        <a href="${linkDetalhe}" style="display:inline-block; margin-top:8px; color:white; background:#0f4c81; padding:5px 10px; text-decoration:none; border-radius:4px; font-size:0.8rem;">Ver Detalhes</a>
                    </div>
                `;

                marker.bindPopup(popupContent);
            });
        })
        .catch(err => console.error("Erro ao carregar mapa:", err));
});