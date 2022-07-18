FROM golang:1.18-alpine as builder
ARG version

RUN apk update && \
    apk add --no-cache make && \
    mkdir -p /app
WORKDIR /app

# for cache go mod depends
COPY go.mod .
COPY go.sum .
RUN go mod download

ENV APP_VERSION=$version
COPY . .
RUN make build


FROM alpine
EXPOSE 80
RUN adduser -D -H -h /app metallplace && \
    mkdir -p /app/internal/migrations && \
    chown -R metallplace:metallplace /app
WORKDIR /app
USER metallplace

COPY --chown=metallplace --from=builder /app/bin/metallplace /app
COPY --chown=metallplace --from=builder /app/internal/migrations /app/internal/migrations
COPY --chown=metallplace --from=builder /app/web /app/web
COPY --chown=metallplace --from=builder /app/var /app/var

CMD ["/app/metallplace"]
