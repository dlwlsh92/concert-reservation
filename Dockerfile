#
# development environment phase
#

FROM node:18.16-alpine3.16 as dev

WORKDIR /opt/app

ENV NODE_ENV=dev

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

USER node


#
# production build phase
#

FROM node:18.16-alpine3.16 as builder

WORKDIR /opt/app

ENV NODE_ENV prod

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build


#
# release deploy phase
#

FROM node:18.16-alpine3.16 as release

ENV NODE_ENV release

COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package*.json ./
COPY --from=builder /opt/app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/src/main.js"]

#
# production deploy phase
#

FROM node:18.16-alpine3.16 as prod

ENV NODE_ENV prod

COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package*.json ./
COPY --from=builder /opt/app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/src/main.js"]