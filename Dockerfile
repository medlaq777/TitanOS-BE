FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "src/server.js"]
