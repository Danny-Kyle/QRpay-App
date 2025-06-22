import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const port = process.env.PORT || 4000;


const allowedOrigins = ['http://localhost:5173', 'https://zesty-pothos-ff7fb8.netlify.app/']

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

connectDB();

app.get("/", (req, res) => res.send("API UP and Running!"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log("API Started on port", port));
