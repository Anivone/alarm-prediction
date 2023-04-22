FROM node:16.9.1

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g typescript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
