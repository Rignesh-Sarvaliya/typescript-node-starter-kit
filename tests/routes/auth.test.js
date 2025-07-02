"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testSetup_1 = require("../utils/testSetup");
describe("Auth Routes", () => {
    it("should return 401 for invalid login", async () => {
        const res = await (0, supertest_1.default)(testSetup_1.app).post("/auth/login").send({
            email: "wrong@example.com",
            password: "wrongpass",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/invalid/i);
    });
    // You can add more tests like register, logout, etc.
});
