import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

import { corsOptions } from "./config/corsOptions";
import "./db/dataSource";
import apiRouter from "./route/api/api";


const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("combined"));

app.use("/api", [apiRouter]);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});