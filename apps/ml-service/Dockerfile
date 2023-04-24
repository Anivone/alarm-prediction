FROM nikolaik/python-nodejs:python3.11-nodejs16

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g typescript
RUN npm run build

RUN pip3 install matplotlib
RUN pip3 install scikit-learn
RUN pip3 install pandas

EXPOSE 3001

CMD ["npm", "start"]
