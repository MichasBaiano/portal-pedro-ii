import { v2 as cloudinary } from 'cloudinary';
import multerStorageCloudinary from 'multer-storage-cloudinary'; // Importa o pacote todo
const { CloudinaryStorage } = multerStorageCloudinary;           // Extrai o que precisamos
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

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