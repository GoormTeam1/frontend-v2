# Dockerfile (수정본)
FROM alpine:3.21

ENV NODE_VERSION=18.20.8

RUN apk add --no-cache nodejs npm yarn

WORKDIR /app

COPY next.config.js ./
COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["node", "server.js"]
