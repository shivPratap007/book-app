import mongoose, { Document, Schema } from "mongoose"

interface UserInterface extends Document {
    name: string
    email: string
    password: string
}

const userSchema: Schema<UserInterface> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
)

export const userModel = mongoose.model<UserInterface>("User", userSchema)
