FROM node:18.16-alpine3.16 as builder

WORKDIR /opt/app

COPY package*.json ./
COPY prisma ./prisma
# 지금은 환경 변수에 따른 데이터베이스 url과 같은 값들을 어떻게 넣어야 할 지 모르겠음..
# 현재 환경 변수에 따라 env 파일을 읽어 데이터베이스 url과 같은 정보를 받아오도록 되어 있는데 
# 이 부분은 어떻게 해결해야 할 지 아직 모르겠음..
COPY env ./env

RUN npm install

COPY . .

RUN npm run build

# 실행을 위한 코드
FROM node:18.16-alpine3.16

COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package*.json ./
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/env ./env

EXPOSE 3000

CMD ["npm", "run", "start:prod"]