import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { IUser } from "../models/user";
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
    createdBy: user._id,
    usersWhoLiked: []
}

const post2: IPost = {
    text: "this is a post",
    date: new Date(),
    createdBy: user._id,
    usersWhoLiked: []
}

const comment1 = { text: "hi" };

let accessToken = "";

beforeAll(async () => {
    app = await initApp();
    await Post.deleteMany();
    const response = await request(app).post("/auth/register").send(user);
    user._id = response.body._id;
    const response2 = await request(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Post get tests", () => {
    test("Test Get All Posts - empty list", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test Get Posts by user id - empty list", async () => {
        const response = await request(app).get("/post/user/" + user._id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });
});

describe("Post post tests", () => {
    test("Test Post a post", async () => {
        const response = await request(app).post("/post").send(post);
        expect(response.statusCode).toBe(200);
        post._id = response.body._id;
        expect(response.body.text).toEqual(post.text);
        expect(response.body.owner._id).toEqual(user._id);
    });

    test("Test Get a post", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toEqual(post.text);
    });

    test("Test Get all posts", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });
});

describe("Post get tests", () => {
    test("Test Get Posts by user id - one post", async () => {
        const response = await request(app).get("/post/user/" + user._id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body.posts[0].text).toEqual(post.text);
    });
});

describe("Put post tests", () => {
    test("Test Put a post", async () => {
        const response = await request(app).put("/post/" + post._id).send(post2);
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toEqual(post2.text);
    });

    test("Test Get a post", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.text).toEqual(post2.text);
    });
});


describe("Add a comment to post tests", () => {
    test("Test no comments on post", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.comments).toHaveLength(0);
    });

    test("Test comment on a post", async () => {
        const body = { "postId": post._id, comment1 };
        const response = await request(app).post("/post/comment").send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post._id);
        expect(response.body.comments).toHaveLength(1);
    });

    test("Test one comments on post", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.comments).toHaveLength(1);
        expect(response.body.comments[0].text).toEqual(comment1.text);
    });
});

describe("Like a post tests", () => {
    test("Test no likes on post", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.likes).toEqual(0);
    });

    test("Test unlike an unliked post- error", async () => {
        const body = { "postId": post._id, "isLiked": false };
        const response = await request(app).post("/post/like").send(body);
        expect(response.statusCode).toBe(401);
    });

    test("Test like an unliked post", async () => {
        const body = { "postId": post._id, "isLiked": true };
        const response = await request(app).post("/post/like").send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body.likes).toEqual(1);
    });

    test("Test number of likes on post should equal 1", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.likes).toEqual(1);
    });

    test("Test like a liked post- error", async () => {
        const body = { "postId": post._id, "isLiked": true };
        const response = await request(app).post("/post/like").send(body);
        expect(response.statusCode).toBe(401);
    });

    test("Test unlike a liked post", async () => {
        const body = { "postId": post._id, "isLiked": false };
        const response = await request(app).post("/post/like").send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body.post.likes).toEqual(0);
    });

    test("Test number of likes on post should equal 0", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.post.likes).toEqual(0);
    });
});

describe("Delete post tests", () => {
    test("Test delete a post", async () => {
        const response = await request(app).delete("/post/" + post._id);
        expect(response.statusCode).toBe(200);
    });

    test("Test Get a deleted post- results in error", async () => {
        const response = await request(app).get("/post/" + post._id);
        expect(response.statusCode).toBe(404);
    });

    test("Test delete a deleted post", async () => {
        const response = await request(app).delete("/post/" + post._id);
        expect(response.statusCode).toBe(404);
    });
});