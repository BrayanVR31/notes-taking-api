import { SetMetadata } from "@nestjs/common";

// TODO: Make a secure plublic key and load it from secure file such as .env
export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtConstants = {
  secretAccess: process.env.JWT_ACCESS_SECRET,
  secretRefresh: process.env.JWT_REFRESH_SECRET,
  refreshExpiration: 604_800_000, // 7 days in seconds
  accessExpiration: 900_000 // 15 min in ms
};
