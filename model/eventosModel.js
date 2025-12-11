// model/EventosModel.js
const eventos = [
    {
        id: 1,
        nome: "Festival de Inverno de Pedro II",
        data: "2025-06-20",
        local: "Praça da Bonelle",
        categoria: "Música",
        descricao: "O maior evento de jazz e blues do Piauí, com atrações nacionais e locais.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Festival_de_Inverno_de_Pedro_II.jpg/800px-Festival_de_Inverno_de_Pedro_II.jpg" // Exemplo
    },
    {
        id: 2,
        nome: "Feira da Opala",
        data: "2025-07-15",
        local: "Mercado do Artesão",
        categoria: "Feira",
        descricao: "Exposição e venda das mais belas joias de opala produzidas na região.",
        imagem: "placeholder-opala.jpg"
    },
    {
        id: 3,
        nome: "Festejos da Padroeira",
        data: "2025-12-08",
        local: "Igreja Matriz",
        categoria: "Religioso",
        descricao: "Celebração tradicional com missas, procissões e barracas de comidas típicas.",
        imagem: "placeholder-igreja.jpg"
    }
];

export class EventosModel {
    static getAll() {
        return eventos;
    }
}