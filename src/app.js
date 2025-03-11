import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

app.use(cors({
    credentials: true,
    origin: "*"
}));


const cacheOptions = {
    // immutable:true,
    // maxAge:"1d",
    // etag:true,
}

app.use(express.json({limit: "100kb"},cacheOptions));
app.use(express.urlencoded({extended : true, limit : "16kb"}));
app.use(express.static(path.resolve()+"/src/public",cacheOptions));
app.use(cookieParser());

import userRouter from "../src/routes/user.routes.js";
app.use("/user",userRouter);

export default app;