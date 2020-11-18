FROM node:15

WORKDIR /usr/src/app

COPY app app
COPY public public
COPY webpack.config.js .
COPY package.json .
COPY yarn.lock .
COPY gif.worker.js .
COPY .babelrc .
COPY .eslintrc.js .
COPY entrypoint.sh .

RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT /usr/src/app/entrypoint.sh
