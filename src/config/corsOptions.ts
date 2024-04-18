import cors from 'cors'

export const corsOptions: cors.CorsOptions = {
    origin: [
        'localhost',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}
