import { config } from "dotenv";
config();
import express from "express";
import rou from "./routes/routes.js";
import cors from "cors";
const app = express();
const port = process.env.PORT;

const corsOpt = {
	origin: process.env.CORS_ORIGIN,
	methods: ["GET", "POST"],
	allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpt));

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.use(express.json());

app.use("/", rou);
app.use("*", (req, res, next) => {
	return res.status(404).json({ message: "Not Found" });
});
