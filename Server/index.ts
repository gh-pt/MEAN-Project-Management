import express, { Express, Request, Response } from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './db/index'
import userRouter from './routes/User.route'

const PORT = process.env.PORT || 3000;
const app: Express = express();
app.use(morgan("tiny"));

// Middleware cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Middleware
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server!!");
});


// MonogDB Connection 
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Server is running on Port: ' + PORT);
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed !!!", error);

    })


app.use('/api/user', userRouter);