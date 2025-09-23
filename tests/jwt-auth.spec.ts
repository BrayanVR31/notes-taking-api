import { AppModule } from "@/app.module";
import { jwtConstants } from "@/constants/jwt.constant";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Payload } from "@/interfaces/payload";
import jwt from "jsonwebtoken";
import request from "supertest";
import bcrypt from "bcrypt";
import { PrismaService } from "@/prisma.service";

describe("JWT authentication process on endpoints", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const userCredentials = {
    email: "testing_user@test.com",
    password: "Testing@Pas100",
    username: "testing_user"
  };
  const secretAccessKey = jwtConstants.secretAccess ?? "";
  let simulationPayload: Payload;
  let simulationToken: string;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    prisma = appModule.get<PrismaService>(PrismaService);

    // Here it will insert temporary user
    const user = await prisma.user.create({
      data: {
        ...userCredentials,
        password: await bcrypt.hash(userCredentials.password, 10)
      }
    });

    // This will generate a jwt token
    simulationPayload = { sub: user.id, username: user.username! }
    simulationToken = jwt.sign(simulationPayload, secretAccessKey);

    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it("should return a succed response when access token is provided", async () => {
    const req = request(app.getHttpServer())["get"]("/tags");
    await req.set("Authorization", `Bearer ${simulationToken}`).expect(200);
  });

  it("should return 200 status code /tags with access token provided by /login", async () => {
    const loginRes = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: userCredentials.email, password: userCredentials.password });
    const { access_token } = loginRes.body;
    const req = request(app.getHttpServer())["get"]("/tags");
    await req.set("Authorization", `Bearer ${access_token}`).expect(200);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: userCredentials.email
      }
    });
    await prisma.$disconnect();
    await app.close();
  });
});
