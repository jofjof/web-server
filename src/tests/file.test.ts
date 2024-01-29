import initApp from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
    app = await initApp();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = "C:\Users\ofird\Pictures\Screenshots\Screenshot 2024-01-20 121523.png";

        const response = await request(app)
            .post("/file?file=123.png").attach('file', filePath);
        expect(response.statusCode).toEqual(200);
        let url = response.body.url;
        console.log(url);
        url = url.replace(/^.*\/\/[^/]+/, '')
        const res = await request(app).get(url)
        expect(res.statusCode).toEqual(200);
    });
})