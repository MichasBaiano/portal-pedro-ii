import app from "./app.js";
import { inicializarBanco } from "./config/db.js";

const PORT = process.env.PORT || 3000;

// Inicializa o banco e depois liga o servidor
inicializarBanco().then(() => {
    app.listen(PORT, () => {
        console.log(`---------------------------------------------`);
        console.log(`Servidor rodando em: http://localhost:${PORT}`);
        console.log(`---------------------------------------------`);
    });
}).catch(erro => {
    console.error("Erro fatal ao iniciar o banco de dados:", erro);
});