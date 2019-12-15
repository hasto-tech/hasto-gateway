FROM node
WORKDIR /usr/src/app

USER root

COPY . .

RUN npm install


EXPOSE 3000

CMD ["npm", "run", "start:dev"]