// model/LocaisModel.js
const locais = [
    {
        id: 1,
        nome: "Morro do Gritador",
        categoria: "Natureza",
        lat: -4.4538,
        lng: -41.4429,
        descricao: "Vista panorâmica incrível da serra."
    },
    {
        id: 2,
        nome: "Centro Histórico",
        categoria: "Cultura",
        lat: -4.4256,
        lng: -41.4586,
        descricao: "Casarões antigos e cultura local."
    },
    {
        id: 3,
        nome: "Museu da Roça",
        categoria: "Cultura",
        lat: -4.4300,
        lng: -41.4600,
        descricao: "Acervo histórico da vida rural."
    }
];

export class LocaisModel {
    static getAll() {
        return locais;
    }
}