import express from "express"
import { config } from "./src/config/config"
import { connectDB } from "./src/config/db"
import { MainApp } from "./src/app";

const startServer = async () => {
    const app = express();

    await connectDB()
    MainApp(app);

    const port = config.port || 4000

    app.listen(port, async () => {
        console.log(`Server is running on port ${port}`)
    })
}

startServer()
