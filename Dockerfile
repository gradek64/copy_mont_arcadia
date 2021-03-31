# Built from Node 12
FROM node:12.14.1-alpine
ARG NPM_TOKEN

WORKDIR /monty
ENV NODE_ENV production

# install dependencies, build and cleanup
ADD . /monty
RUN apk update \
  && apk add python build-base tzdata git py-pip curl \
  && rm -rf /var/cache/apk/* \
  && pip install awscli \
  && cp /usr/share/zoneinfo/Europe/London /etc/localtime \
  && echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc \
  && echo "Europe/London" > /etc/timezone \
  && NODE_ENV=development npm install --no-optional \
  && npm run build \
  && npm cache verify \
  && apk del python build-base git

# Expose ports and start application
EXPOSE 3000 9000

ENTRYPOINT ["/monty/docker/entrypoint.sh"]
CMD "node" "--harmony" "index.js"
