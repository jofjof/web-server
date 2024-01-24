import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import Chat, { IChat } from "../models/chat";

class ChatController extends BaseController<IChat>{
    constructor() {
        super(Chat)
    }

    async get(req: AuthRequest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        super.get(req, res);
    }

    async getById(req: AuthRequest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        super.getById(req, res);
    }
}

export default new ChatController();
