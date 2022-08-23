FROM node:12 as builder
WORKDIR /app

RUN mkdir -p app/node_modules && chown -R node:node /app
COPY . .
USER node
RUN npm install && npm run


FROM alpine
EXPOSE 3000
RUN adduser -D -H -h /app metallplace
WORKDIR /app
USER metallplace

COPY --chown=metallplace --from=builder /app/dist/* /app
RUN NODE_ENV=production npm i

CMD [ "node", "app.js" ]
