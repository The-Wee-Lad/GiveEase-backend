import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path:"./.env"
});

import { connectDB } from "./src/db/index.js";

const PORT = process.env.PORT;

connectDB()
.then((res) => {
    app.listen(PORT||3000,()=>{
        console.log("Server is Listening at Port : ",PORT);
    })

    app.on("error", (err)=>{
        console.log("A Catastrophic Error Occurred with APP : ",err);
    })
})
.catch((error)=>{
    console.log("Failed To Establish Connection : Error : ",error);
    process.exit(1);
});



