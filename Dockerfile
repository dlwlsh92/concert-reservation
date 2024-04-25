FROM node:18.16-alpine3.16 as builder

WORKDIR /opt/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

# 실행을 위한 코드
FROM node:18.16-alpine3.16

COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package*.json ./
COPY --from=builder /opt/app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]