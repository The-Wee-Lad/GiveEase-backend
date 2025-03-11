import dotenv from 'dotenv';

dotenv.config({ path: './src/.env', debug: true, encoding:"UTF8" })

import { connectDB } from "../src/db/index.js";
import app from "./app.js";



const PORT = process.env.PORT;
console.log("Port from env :",PORT);

connectDB()
.then((res) => {
    app.listen(PORT||4000,()=>{
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



