import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import { createRequire } from 'module'; // Importa criador de require

dotenv.config();

// Cria a função require manualmente para usar com bibliotecas antigas
const require = createRequire(import.meta.url);
// Carrega o pacote inteiro primeiro
const pkg = require('multer-storage-cloudinary');
// Tenta encontrar a classe CloudinaryStorage de forma segura
// (Tenta a exportação nomeada OU a exportação padrão OU o próprio pacote)
const CloudinaryStorage = pkg.CloudinaryStorage || pkg.default?.CloudinaryStorage || pkg;

// 1. Configura o Cloudinary com chaves
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

let upload;

if (process.env.NODE_ENV === 'test') {
    // --- MODO DE TESTE ---
    // Usamos MemoryStorage para que o Multer LEIA os campos de texto (req.body)
    const storage = multer.memoryStorage();
    const uploadMemory = multer({ storage: storage });

    // Criamos um wrapper inteligente
    upload = {
        single: (campo) => (req, res, next) => {
            // Executa o Multer real (em memória) para popular o req.body
            uploadMemory.single(campo)(req, res, (err) => {
                if (err) return next(err);
                
                // Se houver arquivo, injetamos o 'path' fake que o Controller espera
                if (req.file) {
                    req.file.path = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
                    req.file.filename = 'arquivo_teste_mock';
                }
                next();
            });
        },
        array: () => (req, res, next) => next(),
        fields: () => (req, res, next) => next()
    };
} else {
    // Se for vida real, usa o Cloudinary normal
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'portal-pedro-ii',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
    });
    upload = multer({ storage: storage });
}

export { upload };