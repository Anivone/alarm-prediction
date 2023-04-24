FROM nikolaik/python-nodejs:python3.11-nodejs16

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g typescript
RUN npm run build

RUN pip3 install pandas
RUN pip3 install numpy
RUN pip3 install pytz

EXPOSE 3000

CMD ["npm", "start"]
