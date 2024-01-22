import mongoose from "mongoose";

export interface IUser {
    email: string;
    password: string;
    name: string;
    image?: string;
    _id?: string;
    refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    refreshTokens: {
        type: [String],
        required: false,
        select: false
    },
});

export default mongoose.model<IUser>("User", userSchema);
