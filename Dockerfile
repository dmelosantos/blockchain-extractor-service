FROM node:12

WORKDIR /usr/app

COPY package*.json ./

RUN npm install
RUN npm install -g ts-node

COPY . .

RUN npm run build

RUN chmod +x docker/start.sh

EXPOSE 5000 5001
CMD [ "docker/start.sh" ]
