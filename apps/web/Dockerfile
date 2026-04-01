FROM node:22-alpine AS base

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm install

COPY apps/web ./apps/web

RUN npm run build --workspace @ged/web

EXPOSE 5174

CMD ["npm", "run", "preview", "--workspace", "@ged/web"]