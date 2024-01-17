import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";
/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
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
*         - password
*         - name
*       properties:
*         id:
*           type: string
*           description: The user's id
*         email:
*           type: string
*           description: The user's email
*         password:
*           type: string
*           description: The user's password
*         name:
*           type: string
*           description: The user's name
*         image:
*           type: string
*           description: path to the user's profile image
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*         name: 'bobo'
*         image: '/path/to/image'
*/

/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post("/register", authController.register);

/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/


/**
* @swagger
* /auth/login:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The acess & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/
router.post("/login", authController.login);

/**
* @swagger
* /auth/logout:
*   get:
*     summary: logout a user
*     tags: [Auth]
*     description: refresh token has to be provided in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: logout completed successfully
*/
router.get("/logout", authController.logout);

/**
* @swagger
* /auth/logout:
*   get:
*     summary: get a new access token using the refresh token
*     tags: [Auth]
*     description: refresh token has to be provided in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: the access & refresh tokens
*         content: 
*           application/json:
*               schema:
*                   $ref: '#components/schemas/Tokens'
*/
router.get("/refresh", authController.refresh);

export default router;