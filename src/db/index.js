import mongoose from "mongoose";

const clusterUri = process.env.PORT;
const dbName = "giveease";
console.log(clusterUri,dbName,process.env.PORT);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(clusterUri, {
            dbName: dbName,
        });
        console.log("Connection established. Connection Host : ", connectionInstance.connection.host);
    } catch (error) {
        console.log("MongoDb Error : Couldn't Connect To DB : ", error);
        process.exit(-1);
    }
}


export { connectDB };