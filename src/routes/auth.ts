import express from "express";
const router = express.Router();
import authController from "../controllers/auth";
import passport from "../passport";
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
*     refreshAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     InputUser:
*       type: object
*       required:
*         - email
*         - password
*         - name
*       properties:
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
* components:
*   schemas:
*     OutputUser:
*       type: object
*       required:
*         - email
*         - password
*         - name
*       properties:
*         _id:
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
*         accessToken:
*           type: string
*           description: the user's access token for the current session
*         refreshToken:
*           type: string
*           description: the user's refresh token for the current session
*       example:
*         _id: 'r34324'
*         email: 'bob@gmail.com'
*         name: 'bobo'
*         image: '/path/to/image'
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/
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
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/InputUser'
*     responses:
*       201:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/OutputUser'
*       400:
*         description: Bad Request
*         content:
*         application/json:
*           example:
*            error: email or password are absent
*       406:
*         description: Not Acceptable
*         content:
*         application/json:
*           example:
*            error: The email or name are already in use
*/
router.post("/register", authController.register);

/**
* @swagger
* /auth/login:
*   post:
*     summary: signs in a user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*              type: object
*              properties:
*                email:
*                  type: string
*                  description: The user's email
*                password:
*                  type: string
*                  description: The user's password
*              example:
*                email: 'bob@gmail.com'
*                password: '123456'
*     responses:
*       200:
*         description: The acess & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*       400:
*         description: Bad Request
*         content:
*         application/json:
*           example:
*            error: Missing email or password
*       401:
*         description: Unauthorized
*         content:
*         application/json:
*           example:
*            error: The email or name or password provided are incorrect
*/
router.post("/login", authController.login);

/**
* @swagger
* /auth/logout:
*   get:
*     summary: Logout a user
*     tags: [Auth]
*     description: Logout a user
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Logout completed successfully
*       401:
*         description: Unauthorized
*/
router.get("/logout", authController.logout);

/**
* @swagger
* /auth/refresh:
*   get:
*     summary: get a new access token using the refresh token
*     tags: [Auth]
*     description: Tefresh token has to be provided in the auth header
*     security:
*       - refreshAuth: []
*     responses:
*       200:
*         description: The access & refresh tokens
*         content: 
*           application/json:
*               schema:
*                   $ref: '#components/schemas/Tokens'
*       401:
*         description: Unauthorized
*         content:
*         application/json:
*           example:
*            error: No refresh token was provided
*/
router.get("/refresh", authController.refresh);

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to home or profile page
        res.redirect('/user/profile');
    }
);

export default router;
