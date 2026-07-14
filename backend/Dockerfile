FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/api-server ./cmd/api

FROM alpine:3.20

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/bin/api-server ./api-server
COPY --from=builder /app/seeds ./seeds
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/internal/db/seeds ./internal/db/seeds

EXPOSE 8080

CMD ["./api-server"]
