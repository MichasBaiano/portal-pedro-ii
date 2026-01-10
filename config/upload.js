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

// 2. Configura o local de armazenamento (Storage)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portal-pedro-ii', // Nome da pasta lá no Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos aceitos
    },
});

// 3. Cria o middleware do Multer
const upload = multer({ storage: storage });

export { upload };