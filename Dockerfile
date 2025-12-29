FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# 👇 Build-time env (REQUIRED for prisma)
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN NEXT_PRIVATE_SKIP_TURBOPACK=1 npm run build

# Runtime envs
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]