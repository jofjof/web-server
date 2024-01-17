import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";
/**
* @swagger
* tags:
*   name: User
*   description: The User API
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
*     User:
*       type: object
*       required:
*         - email
*         - name
*       properties:
*         id:
*           type: string
*           description: The user's id
*         email:
*           type: string
*           description: The user's email
*         name:
*           type: string
*           description: The user's name
*         image:
*           type: string
*           description: path to the user's profile image
*       example:
*         email: 'bob@gmail.com'
*         name: 'bobo'
*         image: '/path/to/image'
*/

/**
* @swagger
* components:
*   schemas:
*     BasicUser:
*       type: object
*       required:
*         - email
*         - name
*       properties:
*         id:
*           type: string
*           description: The user's id
*         name:
*           type: string
*           description: The user's name
*         image:
*           type: string
*           description: path to the user's profile image
*       example:
*         id: '1233'
*         name: 'bobo'
*         image: '/path/to/image'
*/

/**
* @swagger
* /user/profile:
*   get:
*     summary: get user's data
*     tags: [User]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The user's data
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.get("/profile", authController.register);

/**
* @swagger
* /user:
*   get:
*     summary: get all users
*     tags: [User]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: all users
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                   $ref: '#/components/schemas/BasicUser'
*/
router.get("/", authController.register);

export default router;