import express from "express";
const router = express.Router();
import ChatController from "../controllers/chat";
import authMiddleware from "../common/auth_middleware";

/**
* @swagger
* tags:
*   name: Chat
*   description: The Chat API
*/


/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     Chat:
*       type: object
*       required:
*         - text
*       properties:
*         id:
*           type: string
*           description: The chat's id
*         text:
*           type: string
*           description: The post's text
*         image:
*           type: string
*           description: path to the post's image
*         date:
*           type: date
*           description: The post's creation time
*         likes_amount:
*           type: integer
*           description: the amount of likes the post has
*         comments_amount:
*           type: integer
*           description: the amount of comments the post has
*         user_name:
*           type: string
*           description: the name of the user who created the post
*         user_image:
*           type: string
*           description: the image of the user who created the post
*         isLiked:
*           type: boolean
*           description: is the post iked by the current user
*         comments:
*           type: integer
*           description: the comments the post has
*       example:
*         text: 'this is a post'
*         user_name: 'bobo'
*         image: '/path/to/image'
*/

/**
* @swagger
* components:
*   schemas:
*     Comment:
*       type: object
*       required:
*         - text
*       properties:
*         id:
*           type: string
*           description: The comment's id
*         text:
*           type: string
*           description: The comment's substance
*         user_id:
*           type: string
*           description: the id of the user who created the comment
*       example:
*         id: '1233'
*         text: 'this is a comment'
*         user_id: '78689'
*/

/**
* @swagger
* /chat:
*   get:
*     summary: get all open chats
*     tags: [Chat]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: all chats the user has
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                   $ref: '#/components/schemas/Chat'
*/
router.get("/", authMiddleware, ChatController.get.bind(ChatController));

/**
* @swagger
* /chat/:id:
*   get:
*     summary: get chat by id
*     tags: [Chat]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: the requested chat
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Chat'
*/
router.get("/:id", authMiddleware, ChatController.getById.bind(ChatController));

export default router;