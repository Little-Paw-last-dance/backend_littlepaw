import cors from 'cors'

export const corsOptions: cors.CorsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:8000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}
