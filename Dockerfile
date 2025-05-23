# 빌드 스테이지
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
# 환경변수 설정
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
RUN echo "NEXT_PUBLIC_SITE_URL: $NEXT_PUBLIC_SITE_URL"

# 종속성 설치에 필요한 파일 복사
COPY package.json package-lock.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 컴파일 및 Next.js 빌드
RUN npm run build

# 실행 스테이지
FROM node:20-alpine AS runner
WORKDIR /app

# NODE_ENV를 production으로 설정
ENV NODE_ENV production

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
# 환경변수 설정
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL


# 불필요한 패키지 설치 방지
RUN npm install --global pm2

# 필요한 파일과 빌드 결과물 복사
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/custom.d.ts ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# 사용자 생성 및 권한 설정
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# 포트 노출
EXPOSE 9820

# 환경 변수 (필요한 경우 커스터마이징)
ENV PORT 9820

# 애플리케이션 실행
CMD ["pm2-runtime", "npm", "--", "start"]
