import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import Post, { IPost } from "../models/post";

class PostController extends BaseController<IPost>{
    constructor() {
        super(Post)
    }

    async post(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
    }

    async get(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.get(req, res);
    }

    async getById(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.getById(req, res);
    }

    async putById(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.putById(req, res);
    }

    async deleteById(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.deleteById(req, res);
    }

    async like(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
    }

    async unlike(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
    }
    
    async comment(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
    }
}

export default new PostController();
