import mongoose from "mongoose";
import { IUser } from "./user";

export interface IPost {
    text: string;
    date: Date;
    usersWhoLiked: IUser[];
    image?: string;
    _id?: string;
    comments?: { user: string, text: string }[];
    createdBy: string;
}

const postSchema = new mongoose.Schema<IPost>({
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
    },
    comments: [{
        user: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }], text: String
    }],
    usersWhoLiked: [[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]],
    createdBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

export default mongoose.model<IPost>("Post", postSchema);