import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import Post, { IPost } from "../models/post";

class PostController extends BaseController<IPost>{
    constructor() {
        super(Post)
    }

    async post(req: AuthResquest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
    }

    async get(req: AuthResquest, res: Response) {
        super.get(req, res);
    }

    async getById(req: AuthResquest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        super.getById(req, res);
    }

    async getByUserId(req: AuthResquest, res: Response) {
        try {
            const posts = await this.model.find({ createdBy: req.params.user_id });
            res.send(posts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async putById(req: AuthResquest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        super.putById(req, res);
    }

    async deleteById(req: AuthResquest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        super.deleteById(req, res);
    }

    async like(req: AuthResquest, res: Response) {
        const postId = req.params.id;
        try {
            let requestedPost: IPost = await this.model.findById(postId);
            if (requestedPost.usersWhoLiked.find(({ _id }) => _id === req.user._id)) {
                throw ("failed, can't like an already liked post");
            } else {
                const _id = req.user._id;
                // req.body.owner = _id;
                // requestedPost.usersWhoLiked.push(_id);
                const obj = await this.model.findByIdAndUpdate(postId,);
                res.status(201).send(obj);
            }
        }
        catch (err) {
            res.status(406).send(err.message)
        }
    }

    async unlike(req: AuthResquest, res: Response) {
        const postId = req.params.id;
        try {
            let requestedPost: IPost = await this.model.findById(postId);
            if (!requestedPost.usersWhoLiked.find(({ _id }) => _id === req.user._id)) {
                throw ("failed, can't unlike an already unliked post");
            } else {
                const _id = req.user._id;
                // req.body.owner = _id;
                requestedPost.usersWhoLiked = requestedPost.usersWhoLiked.filter
                    (({ _id }) => _id === req.user._id)
                const obj = await this.model.findByIdAndUpdate(postId,);
                res.status(201).send(obj);
            }
        }
        catch (err) {
            res.status(406).send(err.message)
        }
    }

    async comment(req: AuthResquest, res: Response) {
        const comment = req.body.comment;
        const postId = req.body.postId;
        try {
            let requestedPost: IPost = await this.model.findById(postId);
            requestedPost.comments.push(comment);
            const obj = await this.model.findByIdAndUpdate(postId,);
            res.status(201).send(obj);
        }
        catch (err) {
            res.status(406).send(err.message)
        }
    }
}

export default new PostController();
