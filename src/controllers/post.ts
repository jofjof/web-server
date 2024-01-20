import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import Post, { IPost } from "../models/post";

class PostController extends BaseController<IPost>{
    constructor() {
        super(Post)
    }

    async post(req: AuthRequest, res: Response) {
        const _id = req.user._id;
        req.body.createdBy = _id;
        super.post(req, res);
    }

    async get(req: AuthRequest, res: Response) {
        super.get(req, res);
    }

    async getById(req: AuthRequest, res: Response) {
        super.getById(req, res);
    }

    async getByUserId(req: AuthRequest, res: Response) {
        try {
            const posts = await this.model.find({ createdBy: req.params.user_id });
            res.send(posts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async putById(req: AuthRequest, res: Response) {
        try {
            const post = await Post.findById(req.body._id).select('createdBy');
            if (post.createdBy.toString() === req.user._id) await super.putById(req, res);
            else {
                res.status(401).send();
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    async deleteById(req: AuthRequest, res: Response) {
        try {
            const post = await Post.findById(req.params.id)?.select('createdBy');
            if(!post) res.status(404)
            if (post.createdBy.toString() === req.user._id) await super.deleteById(req, res);
            else {
                res.status(401).send();
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    async like(req: AuthRequest, res: Response) {
        const postId = req.params.id;
        try {
            let requestedPost: IPost = await this.model.findById(postId).select('usersWhoLiked');
            if (requestedPost.usersWhoLiked.find(id => id === req.user._id)) {
                throw ("failed, can't like an already liked post");
            } else {
                const _id = req.user._id;
                requestedPost.usersWhoLiked.push(_id);
                const obj = await this.model.findByIdAndUpdate(postId,);
                res.status(201).send(obj);
            }
        }
        catch (err) {
            res.status(406).send(err.message)
        }
    }

    async unlike(req: AuthRequest, res: Response) {
        const postId = req.params.id;
        try {
            let requestedPost: IPost = await this.model.findById(postId);
            if (!requestedPost.usersWhoLiked.find(id => id === req.user._id)) {
                throw ("failed, can't unlike an already unliked post");
            } else {
                const _id = req.user._id;
                requestedPost.usersWhoLiked = requestedPost.usersWhoLiked.filter
                    (id => id === req.user._id)
                const obj = await this.model.findByIdAndUpdate(postId,);
                res.status(201).send(obj);
            }
        }
        catch (err) {
            res.status(406).send(err.message)
        }
    }

    async comment(req: AuthRequest, res: Response) {
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
