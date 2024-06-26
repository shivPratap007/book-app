import mongoose, { Document, Schema, Types } from "mongoose"

export interface BookInterface extends Document {
    title: string
    author: Types.ObjectId
    genre: string
    coverImage: string
    file: string
    description: string
}

const bookSchema: Schema<BookInterface> = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    genre: { type: String, required: true },
    coverImage: { type: String, required: true },
    file: { type: String, required: true },
    description: { type: String, required: true },
})

export const bookModel = mongoose.model<BookInterface>("Book", bookSchema)
