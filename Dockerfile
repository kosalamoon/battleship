FROM node:24.14-alpine AS builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:24.14-alpine AS prod

ENV NODE_ENV=production

WORKDIR /usr/app

RUN chown node:node /usr/app

USER node

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]

