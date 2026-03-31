FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm install

COPY apps/api ./apps/api

RUN npm run prisma:generate --workspace @ged/api
RUN npm run build --workspace @ged/api

EXPOSE 3001

CMD ["npm", "run", "start", "--workspace", "@ged/api"]