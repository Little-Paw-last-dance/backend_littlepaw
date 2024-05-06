import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swagggerOutput from "./swagger_output.json";

import { corsOptions } from "./config/corsOptions";
import logger, { stream } from "./config/logger";  // Importa tanto logger como stream
import "./db/dataSource";
import apiRouter from "./route/api/api";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

app.use(morgan("combined", { stream }));

app.use("/api", [apiRouter]);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagggerOutput));

app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));