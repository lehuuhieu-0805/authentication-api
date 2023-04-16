FROM node:18-alpine as development

WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN yarn install --only=development

COPY . .

RUN yarn build

FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]