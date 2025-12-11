// model/TransportesModel.js
const transportes = [
    {
        id: 1,
        tipo: "onibus",
        nome: "Empresa Barroso",
        rota: "Teresina ↔ Pedro II",
        horarios: "Diariamente: 07:00, 14:00, 17:00",
        contato: "(86) 3222-0000",
        icone: "🚌"
    },
    {
        id: 2,
        tipo: "onibus",
        nome: "Guanabara",
        rota: "Fortaleza ↔ Pedro II",
        horarios: "Seg, Qua, Sex: 20:00",
        contato: "0800 728 1992",
        icone: "🚌"
    },
    {
        id: 3,
        tipo: "mototaxi",
        nome: "Ponto Central (Rodoviária)",
        rota: "Corridas dentro da cidade",
        horarios: "06:00 às 22:00",
        contato: "(86) 99999-1234",
        icone: "🏍️"
    },
    {
        id: 4,
        tipo: "van",
        nome: "Vans da Ladeira",
        rota: "Pedro II ↔ Piripiri",
        horarios: "Saídas a cada hora cheia",
        contato: "(86) 98888-5678",
        icone: "🚐"
    }
];

export class TransportesModel {
    static getAll() {
        return transportes;
    }
}