FROM node:22-slim AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development

RUN chown -R node:node /app

USER node

RUN npm install

COPY --chown=node:node . .

CMD ["npm", "run", "dev"]
