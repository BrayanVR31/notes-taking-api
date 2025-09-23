import { UsersService } from "@/users/users.service";
import { JwtStrategy } from "./jwt.strategy";
import { type Request } from "express";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;
  let mockUserService: Partial<UsersService>;

  beforeEach(() => {
    mockUserService = {
      findOne: jest.fn().mockImplementation((id) => ({
        id,
        username: "guess user"
      }))
    };

    strategy = new JwtStrategy(mockUserService as UsersService);
  });

  it("should extract token from Bearer token header", () => {
    const jwtFromReq = (strategy as any)._jwtFromRequest as Function;
    // This is a simulation header
    const req = {
      headers: {
        authorization: "Bearer simulation_token"
      }
    } as Request;
    const jwtExtracted = jwtFromReq(req);

    expect(jwtExtracted).toBe("simulation_token");
  });

});
