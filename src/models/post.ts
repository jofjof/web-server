import mongoose, { PopulatedDoc } from "mongoose";
import { IUser } from "./user";

export interface IPost {
    text: string;
    date: Date;
    usersWhoLiked: string[];
    image?: string;
    _id?: string;
    comments?: { user: PopulatedDoc<IUser>, text: string }[];
    createdBy: PopulatedDoc<IUser>;
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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, text: String
    }],
    usersWhoLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model<IPost>("Post", postSchema);
