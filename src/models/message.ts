import mongoose from "mongoose";

export interface IMessage {
    user: string;
    text: string;
    timestamp: Date;
    _id?: string;
}

export const messageSchema = new mongoose.Schema<IMessage>({
    user: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", messageSchema);
