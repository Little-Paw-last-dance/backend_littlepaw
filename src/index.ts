import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

import { corsOptions } from "./config/corsOptions";


const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("combined"));

app.get("/ping", async (_req, res) => {
  res.send({
    message: "hello",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});