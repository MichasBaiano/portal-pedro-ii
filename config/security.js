// Configuração das políticas de segurança (CSP)
export const securityConfig = {
    contentSecurityPolicy: {
        directives: {
            // Padrão: só confia no próprio site
            defaultSrc: ["'self'"], 
            
            // Scripts: Permite scripts do próprio site, inline, e HTTPS (para mapas/APIs externas)
            scriptSrc: ["'self'", "'unsafe-inline'", "https:"], 
            
            // Estilos: Permite CSS do próprio site, inline, Google Fonts e HTTPS
            styleSrc: ["'self'", "'unsafe-inline'", "https:", "https://fonts.googleapis.com"], 
            
            // Fontes: Permite carregar do Google Fonts e outros https
            fontSrc: ["'self'", "https:", "data:", "https://fonts.gstatic.com"], 
            
            // Imagens: Permite carregar de qualquer site HTTPS e Base64
            imgSrc: ["'self'", "data:", "https:"], 
            
            // Conexões: Permite o site falar com a própria API e serviços externos seguros
            connectSrc: ["'self'", "https:"], 
            
            // Permite abrir frames se necessário
            frameSrc: ["'self'"],

            // Impede que outros sites coloquem o seu em um iframe (Clickjacking)
            frameAncestors: ["'self'"]
        },
    },
    // Garante o header antigo X-Frame-Options também
    xFrameOptions: { action: "deny" }
};