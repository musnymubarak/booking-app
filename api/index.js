import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
dotenv.config();
app.use(cookieParser());

app.use(express.json());

app.use(cors());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to database");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", ()=> {
    console.log("DB disconnected");
});

mongoose.connection.on("connected", ()=> {
    console.log("DB connected");
});

//middlewares

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});

const PORT = 4040;
app.listen(PORT, () => {
    connect();
    console.log(`Your backend is running on port ${PORT}`);
});
