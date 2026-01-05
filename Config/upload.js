// Config/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Importe o FS para garantir que a pasta existe

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Garante que a pasta public/uploads existe
const uploadDir = path.join(__dirname, '../public/uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        // Garante nome único com data + extensão original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtro para aceitar APENAS imagens
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas JPG, PNG e WEBP são permitidos.'), false);
    }
}

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    },
    fileFilter: fileFilter
});