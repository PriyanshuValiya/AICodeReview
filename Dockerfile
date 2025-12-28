FROM node:20-alpine

WORKDIR /app

# System deps needed by Prisma
RUN apk add --no-cache openssl libc6-compat

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Prisma client generation
RUN npx prisma generate

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]