FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm install

COPY apps/web ./apps/web

RUN npm run build --workspace @ged/web

EXPOSE 4173

CMD ["npm", "run", "preview", "--workspace", "@ged/web"]