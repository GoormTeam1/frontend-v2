# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# 필요한 파일만 복사
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# 포트 노출
EXPOSE 3000

# 실행 명령
CMD ["node", "server.js"] 