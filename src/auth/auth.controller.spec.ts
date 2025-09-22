import { AppModule } from '@/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from "supertest";
import bcrypt from "bcrypt";
import { decode } from "jsonwebtoken";
import { PrismaService } from '@/prisma.service';
import cookie from "cookie";

describe("AuthController", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const userCredentials = {
    email: "testing_user@test.com",
    password: "Testing@Pas100",
    username: "testing_user"
  };

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    prisma = appModule.get<PrismaService>(PrismaService);

    // This will create a temporary user, only for test purposes
    await prisma.user.create({
      data: {
        email: "testing_user@test.com",
        password: await bcrypt.hash(userCredentials.password, 10),
        username: "testing_user"
      }
    });

    // Global app simulation configuration
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    // Cleanup all unecessary data inserted
    await prisma.user.deleteMany({
      where: {
        email: userCredentials.email
      }
    });
    await prisma.$disconnect();
    await app.close();
  });

  // Set of unit testing
  it("should /auth/login return an access token inside json response", async () => {
    const { username, ...credentials } = userCredentials;

    const loginRes = await request(app.getHttpServer())
      .post("/auth/login")
      .send(credentials);
    const loginBody = loginRes.body;
    const token = decode(loginBody["access_token"]);

    expect(loginRes.statusCode).toBe(200);
    expect(loginBody).toHaveProperty("access_token");
    expect(typeof token?.sub).toEqual("number");
    expect(token?.["username"]).toEqual(username);

  });

  it("should /auth/login create an jwt refresh token on cookie and db", async () => {
    const { username, ...credentials } = userCredentials;

    const loginRes = await request(app.getHttpServer())
      .post("/auth/login")
      .send(credentials);
    const [cookies] = loginRes.headers["set-cookie"];
    const parsedCookies = cookie.parse(cookies);
    const refreshToken = parsedCookies?.["refresh"];
    const decodedToken = decode(refreshToken);
    const dbToken = await prisma.token.findMany({
      where: {
        userId: Number(decodedToken?.sub ?? 0),
      }
    });
    const desiredToken = dbToken.some(async ({ token }) => await bcrypt.compare(refreshToken, token));
    expect(loginRes.statusCode).toBe(200);
    expect(parsedCookies).toHaveProperty("refresh");
    expect(desiredToken).toBeTruthy();
  });
});
