import cors from 'cors'

import{allowedOrigins} from './allowedOrigins'

export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
