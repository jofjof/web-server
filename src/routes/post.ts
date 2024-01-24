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

/**
* @swagger
* components:
*   schemas:
*     InputPost:
*       type: object
*       required:
*         - text
*       properties:
*         text:
*           type: string
*           description: The post's text
*         image:
*           type: string
*           description: path to the post's image
*         image_description:
*           type: string
*           description: description for image, to be made into image
*       example:
*         text: 'this is a post'
*         image: '/path/to/image'
*     OutputPost:
*       type: object
*       required:
*         - text
*         - _id
*       properties:
*         _id:
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
*         isLiked: false
*     BasicOutputPost:
*       type: object
*       required:
*         - text
*         - _id
*       properties:
*         _id:
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
*       example:
*         text: 'this is a post'
*         user_name: 'bobo'
*         image: '/path/to/image'
*         isLiked: false
*/

/**
* @swagger
* /post:
*   get:
*     summary: Get all posts
*     tags: [Post]
*     responses:
*       200:
*         description: All posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                   $ref: '#/components/schemas/BasicOutputPost'
*       500:
*         description: Internal server error
*/
router.get("/", PostController.get.bind(PostController));

/**
* @swagger
* /post/{id}:
*   get:
*     summary: Get post by id
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
*               $ref: '#/components/schemas/OutputPost'
*       404:
*         description: Not Found
*       500:
*         description: Internal server error
*/
router.get("/:id", PostController.getById.bind(PostController));

/**
* @swagger
* /post/user/{user_id}:
*   get:
*     summary: Get all posts of user by user's id
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
*                   $ref: '#/components/schemas/BasicOutputPost'
*       500:
*         description: Internal server error
*/
router.get("/user/:user_id", PostController.getByUserId.bind(PostController));

/**
* @swagger
* /post:
*   post:
*     summary: Create a new post
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/InputPost'
*     responses:
*       201:
*         description: The created post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/OutputPost'
*       406:
*         description: Not Acceptable
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
*             $ref: '#/components/schemas/InputPost'
*     responses:
*       200:
*         description: the updated post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/OutputPost'
*       400:
*         description: Bad Request
*       401:
*         description: Unauthorized
*/
router.put("/", authMiddleware, PostController.putById.bind(PostController));

/**
* @swagger
* /post/{post_id}:
*   delete:
*     summary: Delete a post
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
*       400:
*         description: Bad Request
*       401:
*         description: Unauthorized
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
*       201:
*         description: the updated post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/OutputPost'
*       406:
*         description: Not Acceptable
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
*               $ref: '#/components/schemas/OutputPost'
*       406:
*         description: Not Acceptable
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
*               $ref: '#/components/schemas/OutputPost'
*       406:
*         description: Not Acceptable
*/
router.post("/unlike/:id", authMiddleware, PostController.unlike.bind(PostController));

export default router;