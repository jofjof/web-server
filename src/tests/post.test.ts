import { Express } from "express";
import supertest from "supertest";
import defaults from 'superagent-defaults';
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user";
import Post, { IPost } from "../models/post";

let app: Express;
const user: IUser = {
    name: "test",
    email: "test@student.post.test",
    password: "1234567890",
}

const post: IPost = {
    text: "this is a post",
    date: new Date(),
    createdBy: "",
    usersWhoLiked: []
}

let newPost = { text: "this is actually new", _id: "" }

const post2: IPost = {
    text: "this is a new post",
    date: new Date(),
    createdBy: "",
    usersWhoLiked: []
}

const comment1 = { text: "hi" };

let accessToken = "";
let request;

beforeAll(async () => {
    app = await initApp();
    request = defaults(supertest(app));
    await Post.deleteMany();
    const response = await request.post("/auth/register").send(user);
    user._id = response.body._id;
    accessToken = response.body.accessToken;
    request.set({ 'Authorization': `Bearer ${accessToken}` });
});

afterAll(async () => {
    await User.findByIdAndDelete(user._id);
    await mongoose.connection.close();
});

describe("Post get tests", () => {
    test("Test Get All Posts - empty list", async () => {
        const response = await request.get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test Get Posts by user id - empty list", async () => {
        const response = await request.get(`/post/user/${user._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });
});

describe("Post post tests", () => {
    test("Test Post a post", async () => {
        const response = await request.post("/post").send(post);
        expect(response.statusCode).toBe(201);
        post._id = response.body._id;
        expect(response.body.text).toEqual(post.text);
        expect(response.body.createdBy).toEqual(user._id);
    });

    test("Test Get a post", async () => {
        const response = await request.get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toEqual(post.text);
    });

    test("Test Get all posts", async () => {
        const response = await request.get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });
});

describe("Post get tests", () => {
    test("Test Get Posts by user id - one post", async () => {
        const response = await request.get("/post/user/" + user._id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].text).toEqual(post.text);
    });
});

describe("Put post tests", () => {
    test("Test Put a post", async () => {
        newPost._id = post._id;
        const response = await request.put(`/post`).send(newPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toEqual(newPost.text);
    });

    test("Test Get a post", async () => {
        const response = await request.get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toEqual(newPost.text);
    });
});


describe("Add a comment to post tests", () => {
    test("Test no comments on post", async () => {
        const response = await request.get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.comments).toHaveLength(0);
    });

    test("Test comment on a post", async () => {
        const response = await request.post(`/post/comment/${post._id}`).send(comment1);
        expect(response.statusCode).toBe(201);
        expect(response.body._id).toBe(post._id);
        expect(response.body.comments).toHaveLength(1);
    });

    test("Test one comment on post", async () => {
        const response = await request.get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.comments).toHaveLength(1);
        expect(response.body.comments[0].text).toEqual(comment1.text);
        expect(response.body.comments[0].user).toEqual(user._id);

    });
});

describe("Like a post tests", () => {
    test("Test no likes on post", async () => {
        const response = await request.get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.usersWhoLiked).toHaveLength(0);
    });

    test("Test unlike an unliked post- error", async () => {
        const response = await request.post(`/post/unlike/${post._id}`);
        expect(response.statusCode).toBe(406);
    });

    test("Test like an unliked post", async () => {
        const response = await request.post(`/post/like/${post._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.usersWhoLiked).toHaveLength(1);
    });

    test("Test number of likes on post should equal 1", async () => {
        const response = await request.get(`/post/${post._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.usersWhoLiked).toHaveLength(1);
    });

    test("Test like a liked post- error", async () => {
        const response = await request.post(`/post/like/${post._id}`);
        expect(response.statusCode).toBe(406);
    });

    test("Test unlike a liked post", async () => {
        const response = await request.post(`/post/unlike/${post._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.usersWhoLiked).toHaveLength(0);
    });

    test("Test number of likes on post should equal 0", async () => {
        const response = await request.get(`/post/${post._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.usersWhoLiked).toHaveLength(0);
    });
});

describe("Delete post tests", () => {
    test("Test delete a post", async () => {
        const response = await request.delete("/post/" + post._id);
        expect(response.statusCode).toBe(200);
    });

    test("Test Get a deleted post- results in error", async () => {
        const response = await request.get("/post/" + post._id);
        expect(response.statusCode).toBe(404);
    });

    test("Test delete a deleted post", async () => {
        const response = await request.delete("/post/" + post._id);
        expect(response.statusCode).toBe(400);
    });
});