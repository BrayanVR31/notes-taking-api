import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "./app.module";
import request from "supertest";

describe("Private or protected endpoints", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = appModule.createNestApplication();
    await app.init();
  });

  // Set of available routes in API system
  const routes = [
    { method: "get", path: "/tags" },
    { method: "get", path: "/users" }
  ];

  routes.forEach(({ method, path }) => {
    it(`should ${path} return an unauthorized response if client isn't authenticated`, async () => {
      await request(app.getHttpServer())[`${method}`](`${path}`).expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
