import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Portal Pedro II',
      version: '1.0.0',
      description: 'Documentação da API do Portal da cidade de Pedro II - PI. Gerencia Eventos, Locais, Transportes e Banners.',
      contact: {
        name: 'Suporte Técnico',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], 
};

export const specs = swaggerJsdoc(options);