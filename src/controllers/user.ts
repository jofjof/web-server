import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import User, { IUser } from "../models/user";

class UserController extends BaseController<IUser>{
    constructor() {
        super(User)
    }

    async get(req: AuthRequest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.get(req, res);
    }

    async getById(req: AuthRequest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.getById(req, res);
    }

    async putById(req: AuthRequest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.putById(req, res);
    }
}

export default new UserController();
