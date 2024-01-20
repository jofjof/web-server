import express from "express";
const router = express.Router();
import PostController from "../controllers/post";
import authMiddleware from "../common/auth_middleware";

/**
* @swagger
* tags:
*   name: Post
*   description: The Posts API
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


// TODO: create a schema for PostInput and Post ig
/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - text
*       properties:
*         id:
*           type: string
*           description: The post's id
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
* /post:
*   get:
*     summary: get all posts
*     tags: [Post]
*     responses:
*       200:
*         description: all posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                   $ref: '#/components/schemas/Post'
*/
router.get("/", PostController.get.bind(PostController));

/**
* @swagger
* /post/{id}:
*   get:
*     summary: get post by id
*     tags: [Post]
*     parameters:
*      - in: path
*        name: id
*        schema:
*          type: string
*        required: true
*        description: ID of the post to get
*     responses:
*       200:
*         description: the requested post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.get("/:id", PostController.getById.bind(PostController));

/**
* @swagger
* /post/user/{user_id}:
*   get:
*     summary: get all posts of user by user's id
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*      - in: path
*        name: user_id
*        schema:
*          type: string
*        required: true
*        description: ID of the user whose posts you want
*     responses:
*       200:
*         description: all posts of a specific user
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                   $ref: '#/components/schemas/Post'
*/
router.get("/user/:user_id", PostController.getByUserId.bind(PostController));

/**
* @swagger
* /post:
*   post:
*     summary: create a new post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: the created post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.post("/", authMiddleware, PostController.post.bind(PostController));

/**
* @swagger
* /post:
*   put:
*     summary: modify a post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: the updated post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.put("/", authMiddleware, PostController.putById.bind(PostController));

/**
* @swagger
* /post/{post_id}:
*   delete:
*     summary: delete a post
*     tags: [Post]
*     parameters:
*      - in: path
*        name: post_id
*        schema:
*          type: string
*        required: true
*        description: ID of the post you'd like to delete
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: the post was successfuly deleted
*/
router.delete("/:id", authMiddleware, PostController.deleteById.bind(PostController));

/**
* @swagger
* /post/comment/{post_id}:
*   post:
*     summary: add a comment to a post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*      - in: path
*        name: post_id
*        schema:
*          type: string
*        required: true
*        description: ID of the post you'd like to comment on
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             postId: string
*             $ref: '#/components/schemas/Comment'
*     responses:
*       200:
*         description: the updated post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.post("/comment/:id", authMiddleware, PostController.comment.bind(PostController));

/**
* @swagger
* /post/like/{post_id}:
*   post:
*     summary: like a post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*      - in: path
*        name: post_id
*        schema:
*          type: string
*        required: true
*        description: ID of the post you want to like
*     responses:
*       200:
*         description: the updated post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.post("/like/:id", authMiddleware, PostController.like.bind(PostController));

/**
* @swagger
* /post/unlike/{post_id}:
*   post:
*     summary: unlike a post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*      - in: path
*        name: post_id
*        schema:
*          type: string
*        required: true
*        description: ID of the post you want like to unlike
*     responses:
*       200:
*         description: the updated post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.post("/unlike/:id", authMiddleware, PostController.unlike.bind(PostController));

export default router;