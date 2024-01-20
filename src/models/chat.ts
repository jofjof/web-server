import mongoose from "mongoose";
import { IUser } from "./user";
import { IMessage, messageSchema } from "./message";

export interface IChat {
    users: IUser[];
    messages: IMessage[];
    _id?: string;
}

const chatSchema = new mongoose.Schema<IChat>({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: { type: [messageSchema] }
});

export default mongoose.model<IChat>("Chat", chatSchema);
