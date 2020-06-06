FROM node:12-alpine 

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

USER node

RUN yarn && yarn cache clean --force --loglevel=error

CMD [ "yarn", "start"]
