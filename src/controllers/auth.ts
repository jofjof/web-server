import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const image = req.body.image;

    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const doesExist = await User.findOne({ $or: [{ 'email': email }, { 'name': name }] });
        if (doesExist) {
            return res.status(406).send("email or name already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const response = await User.create({ 'email': email, 'name': name, 'password': encryptedPassword, image: image });
        const tokens = await createTokens(response);
        const user = { ...response['_doc'], ...tokens };
        delete user['refreshTokens'];
        return res.status(201).send(user);
    } catch (err) {
        return res.status(400).send(err.message);
    }
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await User.findOne({ 'email': email }).select('+password +refreshTokens');
        if (!user) {
            return res.status(401).send("email or password incorrect");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }

        const tokens = await createTokens(user);
        return res.status(200).send(tokens);
    } catch (err) {
        return res.status(400);
    }
}

const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { '_id': string }) => {
        if (err) return res.sendStatus(401);
        try {
            const userDb = await User.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            } else {
                userDb.refreshTokens = userDb.refreshTokens.filter(token => token !== refreshToken);
                await userDb.save();
                return res.sendStatus(200);
            }
        } catch (err) {
            res.sendStatus(401).send(err.message);
        }
    });
}

const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1].replace(/\"/g, ''); // Bearer <token>
    if (!refreshToken) return res.status(401).send("No refresh token was provided");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { '_id': string }) => {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = await User.findOne({ '_id': user._id }).select('+refreshTokens');;
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = getAccessToken(user._id);
            const newRefreshToken = getRefreshToken(user._id);
            userDb.refreshTokens = userDb.refreshTokens.filter(token => token !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': refreshToken
            });
        } catch (err) {
            res.sendStatus(401).send(err.message);
        }
    });
}

const googleSignIn = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (email) {
            let user = await User.findOne({ 'email': email });
            if (!user) {
                user = await User.create(
                    {
                        'email': email,
                        'password': '',
                        'image': payload?.picture
                    });
            }
            const tokens = await createTokens(user)
            res.status(200).send(
                {
                    email: user.email,
                    _id: user._id,
                    image: user.image,
                    ...tokens
                })
        } else {
            res.status(401).send("email or password incorrect");
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }

}

const createTokens = async (user) => {
    const accessToken = getAccessToken(user._id);
    const refreshToken = getRefreshToken(user._id);
    if (!user.refreshTokens) {
        user.refreshTokens = [refreshToken];
    } else {
        user.refreshTokens.push(refreshToken);
    }
    await user.save();

    return {
        'accessToken': accessToken,
        'refreshToken': refreshToken
    };
}

const getAccessToken = (id: string) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

const getRefreshToken = (id: string) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET);
}

export default {
    register,
    login,
    logout,
    refresh
}