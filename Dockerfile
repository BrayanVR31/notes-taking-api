FROM node:22.19.0-alpine3.21 AS builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:22.19.0-alpine3.21 AS development
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

FROM node:22.19.0-alpine3.21 AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json .
COPY --from=builder /usr/src/app/prisma ./prisma

ENV NODE_ENV="production"

EXPOSE 3000

CMD ["sh", "-c", "npm run db:deploy && npm run start:prod"]

