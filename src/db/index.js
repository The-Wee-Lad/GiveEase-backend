import mongoose from "mongoose";


const dbName = "giveease";

const connectDB = async () => {
    try {
        console.log(dbName,process.env.PORT);
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
            dbName: dbName,
        });
        console.log("Connection established. Connection Host : ", connectionInstance.connection.host);
    } catch (error) {
        console.log("MongoDb Error : Couldn't Connect To DB : ", error);
        process.exit(-1);
    }
}


export { connectDB };