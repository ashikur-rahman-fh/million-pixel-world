FROM node:22-alpine AS base

WORKDIR app/

RUN chown -R 1000:1000 /app

COPY package.*json ./

FROM base AS development
USER 1000

RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
