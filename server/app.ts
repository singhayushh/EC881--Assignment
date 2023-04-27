import express from "express";
import path from "path";
import dotenv from "dotenv";

import { UIRouter } from "./ui/route";
import { ConnectDB } from "./config/db";

dotenv.config();
const PORT = Number(process.env.PORT);
const URI = String(process.env.MONGO_URI);

const app: express.Application = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../static")));
app.use(express.static(path.join(__dirname, "../uploads")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/", UIRouter);

app.listen(PORT, () => {
    ConnectDB(URI);
    console.log('Server started at http://localhost:3000');
});