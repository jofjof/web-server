import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user";

let app: Express;
const user: IUser = {
    name: "test",
    email: "chat-test@student.post.test",
    password: "123567890",
}
const user2: IUser = {
    name: "test2",
    email: "another@email.com",
    password: "1111",
}

let accessToken = "";

beforeAll(async () => {
    app = await initApp();
    await User.deleteMany({ 'email': user.email });
    const response = await request(app).post("/auth/register").send(user);
    user._id = response.body._id;
    const response2 = await request(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
});

afterAll(async () => {
    await User.deleteMany({ 'email': user.email });
    await mongoose.connection.close();
});

// describe("User get tests", () => {
//     test("Test Get All Users - one user", async () => {
//         const response = await request(app).get("/user");
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toHaveLength(1);
//     });

//     test("Test Get All Users- after adding another user", async () => {
//         const user2_response = await request(app).post("/auth/register").send(user2);
//         user2._id = user2_response.body._id;
//         const response = await request(app).get("/user");
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toHaveLength(2);

//     });

//     test("Test Get user by id- my user", async () => {
//         const response = await request(app).get("/user/" + user._id);
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toEqual(user);
//         expect(response.body._id).toEqual(user._id);
//     });

//     test("Test Get user by id- different user", async () => {
//         const response = await request(app).get("/user/" + user2._id);
//         expect(response.statusCode).toBe(400);
//     });
// });
