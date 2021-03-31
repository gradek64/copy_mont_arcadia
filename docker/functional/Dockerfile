FROM cypress/included:3.3.2
# if you feel like running it in electron is not for you, use that base and run with --browser=chrome. it gives more debug info it seems
#FROM cypress/browsers:latest

ARG NPM_TOKEN
ENV NODE_ENV production
ENV BLUEBIRD_WARNINGS 0

WORKDIR /monty

COPY test/functional/mock-server/package.json /monty/mock-server/
COPY test/functional/mock-server/package-lock.json /monty/mock-server/

RUN cd mock-server && npm install --silent

COPY test/functional/mock-server/ /monty/mock-server

COPY package.json /monty
COPY package-lock.json /monty

RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
RUN NODE_ENV=development npm ci --ignore-scripts

COPY ./docker/functional /monty
COPY ./test/functional /monty/test/functional
COPY ./src /monty/src
COPY ./build /monty/build

RUN chmod +x /monty/entrypoint.sh

# we always need to run mock-server first, so its in the entrypoint
ENTRYPOINT ["/monty/entrypoint.sh"]
# cypress parameters can be overriden as command
#CMD ["/monty/node_modules/.bin/cypress", "run"]
