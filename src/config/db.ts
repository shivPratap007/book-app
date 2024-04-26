import mongoose from "mongoose"
import { config } from "./config"

export const connectDB = async () => {
    try {
        
        mongoose.connection.on("connected", () => {
            console.log("DB connected successfully");
        })
        // IT IS USED TO TELL THE ERROR IF THE DB STOPPED WORKING IN BETWEEN
        mongoose.connection.on("error", (error) => {
            console.log("Error in connecting db")
            console.log(error)
        })
        await mongoose.connect(config.databaseURL as string)
    } catch (error: any) {
        // IT IS USED TO TELL THE ERROR IN THE INITIAL STATE WHEN WE ARE NOT ABLE TO CONNECT THE DB BUT NOT IN THE MIDDLE
        console.log(error)
        process.exit(1)
    }
}
