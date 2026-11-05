FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force


FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node src/ ./src/

USER node

EXPOSE 3000

CMD ["node", "src/index.js"]

