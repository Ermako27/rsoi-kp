FROM node:12.18.1

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

COPY . .

CMD npm run start