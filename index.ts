import { app } from "./src/app";
import { config } from "./src/config/config";
import { connectDB } from "./src/config/db";

const startServer = async () => {
    const port = config.port || 4000

    
    await connectDB();
    app.listen(port, async () => {
        console.log(`Server is running on port ${port}`)
        
    })
}

startServer()
