import { config as conf } from "dotenv"
conf()

const _config = {
    port: process.env.PORT,
    databaseURL: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET,
    coludinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_secret: process.env.CLOUDINARY_SECRET,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    allowedOrigin:process.env.FRONTENT_DOMAIN,
}

export const config = Object.freeze(_config)
